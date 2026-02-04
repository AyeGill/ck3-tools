import * as vscode from 'vscode';
import * as fs from 'fs';
import { FieldSchema } from '../schemas/registry/types';
import { effectsMap, triggersMap, modifiersMap, matchesModifierTemplate, ScopeType } from '../data';
import { CK3WorkspaceIndex, EntityType } from './workspaceIndex';
import {
  TRIGGER_BLOCKS,
  EFFECT_BLOCKS,
  WEIGHT_BLOCKS,
  WEIGHT_BLOCK_PARAMS,
  TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS,
  LIST_BLOCKS,
  BlockContext,
  analyzeBlockContext,
  validateScopePath,
  looksLikeScopePath,
  isScopeReference,
  KNOWN_SCOPE_CHANGERS,
} from '../utils/scopeContext';
import {
  BLOCK_START_PATTERN,
  SCRIPT_VALUE_BLOCKS,
  determineBlockContext,
} from '../utils/blockParser';

import { BLOCK_SCHEMAS, getBlockSchemaMap } from '../schemas/blockSchemas';
import { schemaRegistry } from '../schemas/registry/schemaRegistry';


/**
 * Represents a parsed entity from a CK3 file
 */
interface ParsedEntity {
  name: string;
  startLine: number;
  endLine: number;
  fields: Map<string, ParsedField>;
}

/**
 * Represents a parsed field within an entity
 */
interface ParsedField {
  name: string;
  value: string;
  line: number;
  column: number;
}

/**
 * Fields that are valid in both trigger and effect contexts (control flow, etc.)
 */
const CONTROL_FLOW_FIELDS = new Set([
  'if', 'else', 'else_if', 'switch', 'trigger_if', 'trigger_else',
  'random', 'random_list', 'while', 'break', 'continue',
  'limit', 'modifier', 'weight', 'factor', 'add', 'multiply',
  'save_scope_as', 'save_scope_value_as', 'save_temporary_scope_as',
  'custom_description', 'custom_tooltip', 'show_as_tooltip',
  'hidden_effect', 'run_interaction',
  // Script value fields - valid in many contexts for math expressions
  'value', 'subtract', 'divide', 'min', 'max', 'round', 'floor', 'ceiling',
  'desc',  // Used for tooltips in many places
]);

// SCOPE_CHANGERS now imported from '../utils/scopeContext' as KNOWN_SCOPE_CHANGERS

/**
 * Prefixes for iterator effects/triggers
 */
const ITERATOR_PREFIXES = [
  'every_', 'random_', 'any_', 'ordered_',
];


/**
 * Control flow blocks that are transparent for parameter validation.
 * Parameters inside these blocks belong to the enclosing effect/trigger.
 * E.g., in `start_war = { if = { cb = X } }`, the `cb` belongs to `start_war`.
 */
const TRANSPARENT_FOR_PARAMS = new Set([
  'if', 'else', 'else_if',
  'switch',
  'trigger_if', 'trigger_else',
  'random', 'random_list',
  'while',
  'hidden_effect',
]);

/**
 * Fields that are valid inside random_list weight blocks (numeric parent names)
 * These are commonly used for tooltips and weight configuration
 */
const RANDOM_LIST_WEIGHT_FIELDS = new Set([
  'desc', 'show_chance', 'trigger', 'modifier', 'weight', 'min', 'max',
]);

/**
 * Mapping from effect/trigger supportedTargets values to EntityType for validation
 * Only includes target types that we can actually validate against the workspace index
 */
const TARGET_TO_ENTITY_TYPE: Partial<Record<string, EntityType>> = {
  // Core scripting
  'scripted_effect': 'scripted_effect',
  'scripted_trigger': 'scripted_trigger',
  'scripted_modifier': 'scripted_modifier',
  // Character-related
  'trait': 'trait',
  'secret': 'secret_type',
  'scheme': 'scheme',
  // Events and decisions
  'event': 'event',
  'decision': 'decision',
  // Activities
  'activity': 'activity',
  'activity_type': 'activity', // Same as activity
  // Culture
  'culture': 'culture',
  'culture_tradition': 'culture_tradition',
  'culture_innovation': 'culture_innovation',
  'culture_pillar': 'culture_pillar',
  // Religion
  // Note: doctrine is excluded because doctrines are nested inside religion files
  // and can't be easily indexed with our simple top-level parser
  // Titles and holdings
  'landed_title': 'landed_title',
  'holding_type': 'holding_type',
  'government_type': 'government_type',
  // Dynasties
  'dynasty': 'dynasty',
  'dynasty_house': 'dynasty_house',
  // War
  'casus_belli_type': 'casus_belli_type',
  'faction': 'faction',
  // DLC features
  'legend': 'legend',
  'legend_type': 'legend', // Same folder
  'inspiration': 'inspiration',
  'struggle': 'struggle',
  'epidemic': 'epidemic',
  'epidemic_type': 'epidemic', // Same folder
  'great_project': 'great_project',
  'great_project_type': 'great_project', // Same folder
  'accolade': 'accolade_type',
  'accolade_type': 'accolade_type',
  'situation': 'situation',
  'story': 'story_cycle',
  'court_position_type': 'court_position_type',
  'artifact': 'artifact',
};

/**
 * Map prefixes to scope types (e.g., 'title' -> 'landed_title')
 */
const PREFIX_TO_SCOPE_TYPE: Record<string, ScopeType> = {
  'title': 'landed_title',
  'trait': 'trait',
  'culture': 'culture',
  'faith': 'faith',
  'religion': 'religion',
  'dynasty': 'dynasty',
  'house': 'dynasty_house',
  'character': 'character',
  'province': 'province',
  'cp': 'character', // Council positions resolve to characters
};

/**
 * Resolve a prefixed scope path to its final type
 * e.g., "title:k_england.holder" -> "character" (last part .holder outputs character)
 *       "title:k_england" -> "landed_title" (prefix determines type)
 *       "cp:councillor_chancellor" -> "character" (cp prefix outputs character)
 *
 * @returns The final scope type, or null if unable to resolve
 */
function resolvePrefixedScopePath(path: string): ScopeType | null {
  const colonIndex = path.indexOf(':');
  if (colonIndex <= 0) {
    return null; // No prefix
  }

  const prefix = path.substring(0, colonIndex);
  const rest = path.substring(colonIndex + 1);

  // Skip if prefix contains dots (e.g., root.var:X)
  if (prefix.includes('.')) {
    return null;
  }

  // Get initial type from prefix
  const initialType = PREFIX_TO_SCOPE_TYPE[prefix];
  if (!initialType) {
    return null; // Unknown prefix
  }

  // If no dots after the key, return the initial type
  if (!rest.includes('.')) {
    return initialType;
  }

  // For paths with scope changers (e.g., "k_england.holder"),
  // the final type is determined by the last scope changer
  const parts = rest.split('.');
  const lastPart = parts[parts.length - 1];

  const effect = effectsMap.get(lastPart);
  const trigger = triggersMap.get(lastPart);
  const definition = effect || trigger;

  return definition?.outputScope ?? null;
}

/**
 * Resolve a dot-separated scope path to its final type
 * The output type is determined by the LAST scope changer in the path,
 * since each scope changer has a fixed output type regardless of input.
 *
 * e.g., "prev.culture" -> "culture" (.culture always outputs culture)
 *       "root.capital_county.holder" -> "character" (.holder always outputs character)
 *       "some_var.primary_title" -> "landed_title"
 *
 * @returns The final scope type, or null if the last part isn't a known scope changer
 */
function resolveDotScopePath(path: string): ScopeType | null {
  if (!path.includes('.')) {
    return null; // Not a dot path
  }

  const parts = path.split('.');
  const lastPart = parts[parts.length - 1];

  // Look up the last part as a scope changer - its outputScope is the final type
  const effect = effectsMap.get(lastPart);
  const trigger = triggersMap.get(lastPart);
  const definition = effect || trigger;

  return definition?.outputScope ?? null;
}

/**
 * Parsed field with context information
 */
interface ParsedFieldWithContext extends ParsedField {
  context: 'trigger' | 'effect' | 'schema' | 'unknown';
  blockPath: string[];
}


/**
 * CK3 Diagnostics Provider
 * Provides linting and validation for CK3 mod files
 */
export class CK3DiagnosticsProvider {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private readonly DEBOUNCE_DELAY = 300; // ms
  private workspaceIndex: CK3WorkspaceIndex | null;

  constructor(workspaceIndex?: CK3WorkspaceIndex) {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('ck3');
    this.workspaceIndex = workspaceIndex ?? null;
  }

  /**
   * Get the diagnostic collection for disposal
   */
  public getDiagnosticCollection(): vscode.DiagnosticCollection {
    return this.diagnosticCollection;
  }

  /**
   * Validate a document with debouncing
   */
  public validateDocumentDebounced(document: vscode.TextDocument): void {
    const uri = document.uri.toString();

    // Clear existing timer
    const existingTimer = this.debounceTimers.get(uri);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.validateDocument(document);
      this.debounceTimers.delete(uri);
    }, this.DEBOUNCE_DELAY);

    this.debounceTimers.set(uri, timer);
  }

  /**
   * Validate a document immediately
   */
  public validateDocument(document: vscode.TextDocument): void {
    // Only validate CK3 files
    if (document.languageId !== 'ck3') {
      return;
    }

    // Get schema for this file using the centralized registry
    const schemaInfo = schemaRegistry.getForFile(document.fileName);
    if (!schemaInfo) {
      // Clear diagnostics for unknown file types
      this.diagnosticCollection.set(document.uri, []);
      return;
    }

    const fileType = schemaInfo.fileType;
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();

    // Parse entities from the document
    const entities = this.parseEntities(text);

    // Check for name collisions within the file
    // Skip for on_action since multiple definitions extend the same on_action (additive)
    const nameCollisions = fileType === 'on_action' ? [] : this.checkNameCollisions(entities);
    for (const collision of nameCollisions) {
      const range = new vscode.Range(
        document.positionAt(this.getLineStart(text, collision.line)),
        document.positionAt(this.getLineEnd(text, collision.line))
      );
      diagnostics.push(new vscode.Diagnostic(
        range,
        `Duplicate ${fileType} name: "${collision.name}" (also defined on line ${collision.otherLine + 1})`,
        vscode.DiagnosticSeverity.Error
      ));
    }

    // Validate each entity
    for (const entity of entities) {
      // Check for missing required fields
      const missingFields = this.checkRequiredFields(entity, schemaInfo.schema);
      for (const field of missingFields) {
        const range = new vscode.Range(
          new vscode.Position(entity.startLine, 0),
          new vscode.Position(entity.startLine, entity.name.length)
        );
        diagnostics.push(new vscode.Diagnostic(
          range,
          `Missing required field: "${field}"`,
          vscode.DiagnosticSeverity.Warning
        ));
      }

      // Check for invalid/unknown fields
      const invalidFields = this.checkInvalidFields(entity, schemaInfo.schema, schemaInfo.schemaMap, fileType);
      for (const invalid of invalidFields) {
        const line = document.lineAt(invalid.line);
        const fieldStart = line.text.indexOf(invalid.name);
        const range = new vscode.Range(
          new vscode.Position(invalid.line, fieldStart >= 0 ? fieldStart : 0),
          new vscode.Position(invalid.line, fieldStart >= 0 ? fieldStart + invalid.name.length : line.text.length)
        );
        diagnostics.push(new vscode.Diagnostic(
          range,
          `Unknown field: "${invalid.name}"`,
          vscode.DiagnosticSeverity.Warning
        ));
      }

      // Check for type mismatches
      const typeMismatches = this.checkTypeMismatches(entity, schemaInfo.schemaMap);
      for (const mismatch of typeMismatches) {
        const line = document.lineAt(mismatch.line);
        const valueStart = line.text.indexOf('=') + 1;
        const range = new vscode.Range(
          new vscode.Position(mismatch.line, valueStart),
          new vscode.Position(mismatch.line, line.text.length)
        );
        diagnostics.push(new vscode.Diagnostic(
          range,
          mismatch.message,
          vscode.DiagnosticSeverity.Warning
        ));
      }

      // Check for invalid enum values
      const invalidEnums = this.checkEnumValues(entity, schemaInfo.schemaMap);
      for (const invalid of invalidEnums) {
        const line = document.lineAt(invalid.line);
        const valueStart = line.text.indexOf('=') + 1;
        const range = new vscode.Range(
          new vscode.Position(invalid.line, valueStart),
          new vscode.Position(invalid.line, line.text.length)
        );
        diagnostics.push(new vscode.Diagnostic(
          range,
          invalid.message,
          vscode.DiagnosticSeverity.Warning
        ));
      }
    }

    // Validate syntax errors (unmatched braces, incomplete assignments, etc.)
    const syntaxDiagnostics = this.validateSyntax(document);
    diagnostics.push(...syntaxDiagnostics);

    // Validate effects and triggers in context
    const effectTriggerDiagnostics = this.validateEffectsAndTriggers(document);
    diagnostics.push(...effectTriggerDiagnostics);

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  /**
   * Clear diagnostics for a document
   */
  public clearDiagnostics(uri: vscode.Uri): void {
    this.diagnosticCollection.delete(uri);
  }

  /**
   * Validate a file from URI without opening it in VS Code
   * Returns the diagnostics array for the file
   */
  public validateFile(uri: vscode.Uri): vscode.Diagnostic[] {
    const filePath = uri.fsPath;

    // Read file content
    let content: string;
    try {
      content = fs.readFileSync(filePath, 'utf-8');
    } catch {
      return [];
    }

    // Create a mock document
    const mockDocument = this.createMockDocument(content, filePath, uri);

    // Validate using the existing method (which sets diagnostics on the collection)
    this.validateDocument(mockDocument as vscode.TextDocument);

    // Return the diagnostics that were set
    return this.diagnosticCollection.get(uri) as vscode.Diagnostic[] || [];
  }

  /**
   * Validate all .txt files in a directory recursively
   * Returns total number of files validated
   */
  public async validateDirectory(
    dirUri: vscode.Uri,
    progress?: vscode.Progress<{ message?: string; increment?: number }>
  ): Promise<{ fileCount: number; diagnosticCount: number }> {
    const files = this.findTxtFiles(dirUri.fsPath);
    const totalFiles = files.length;
    let diagnosticCount = 0;

    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      const uri = vscode.Uri.file(filePath);

      if (progress) {
        progress.report({
          message: `Validating ${i + 1}/${totalFiles}: ${filePath.split('/').pop()}`,
          increment: 100 / totalFiles
        });
      }

      const diagnostics = this.validateFile(uri);
      diagnosticCount += diagnostics.length;
    }

    return { fileCount: totalFiles, diagnosticCount };
  }

  /**
   * Create a mock TextDocument for validation without opening in VS Code
   */
  private createMockDocument(content: string, fileName: string, uri: vscode.Uri): Partial<vscode.TextDocument> {
    const lines = content.split('\n');
    return {
      fileName,
      uri,
      languageId: 'ck3',
      lineCount: lines.length,
      getText: () => content,
      lineAt: (lineOrPosition: number | vscode.Position) => {
        const lineNum = typeof lineOrPosition === 'number' ? lineOrPosition : lineOrPosition.line;
        return {
          text: lines[lineNum] || '',
          lineNumber: lineNum,
          range: new vscode.Range(lineNum, 0, lineNum, (lines[lineNum] || '').length),
          rangeIncludingLineBreak: new vscode.Range(lineNum, 0, lineNum + 1, 0),
          firstNonWhitespaceCharacterIndex: (lines[lineNum] || '').search(/\S/),
          isEmptyOrWhitespace: !(lines[lineNum] || '').trim(),
        } as vscode.TextLine;
      },
      positionAt: (offset: number) => {
        let remaining = offset;
        for (let line = 0; line < lines.length; line++) {
          const lineLength = lines[line].length + 1;
          if (remaining < lineLength) {
            return new vscode.Position(line, remaining);
          }
          remaining -= lineLength;
        }
        return new vscode.Position(lines.length - 1, lines[lines.length - 1]?.length || 0);
      },
    };
  }

  /**
   * Recursively find all .txt files in a directory
   */
  private findTxtFiles(dir: string): string[] {
    const files: string[] = [];

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = `${dir}/${entry.name}`;

        if (entry.isDirectory()) {
          files.push(...this.findTxtFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.txt')) {
          files.push(fullPath);
        }
      }
    } catch {
      // Skip directories we can't read
    }

    return files;
  }

  /**
   * Dispose of resources
   */
  public dispose(): void {
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();
    this.diagnosticCollection.dispose();
  }

  /**
   * Parse entities from document text
   * Returns top-level entity definitions (e.g., trait_name = { ... })
   */
  private parseEntities(text: string): ParsedEntity[] {
    const entities: ParsedEntity[] = [];
    const lines = text.split('\n');

    let currentEntity: ParsedEntity | null = null;
    let braceDepth = 0;
    let entityBraceStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') {
        continue;
      }

      // Remove inline comments
      const commentIndex = line.indexOf('#');
      const cleanLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;

      // Count braces
      const openBraces = (cleanLine.match(/\{/g) || []).length;
      const closeBraces = (cleanLine.match(/\}/g) || []).length;

      // Check for entity start: name = { at brace depth 0
      // Use [\w.]+ to match both regular entities (trait_name) and event IDs (namespace.0001)
      if (braceDepth === 0 && openBraces > 0) {
        const match = cleanLine.match(/^\s*([\w.]+)\s*=\s*\{/);
        if (match) {
          currentEntity = {
            name: match[1],
            startLine: i,
            endLine: i,
            fields: new Map()
          };
          entityBraceStart = 1;
        }
      }

      // Parse fields if we're inside an entity at depth 1
      if (currentEntity && braceDepth === 1 && openBraces === 0) {
        const fieldMatch = cleanLine.match(/^\s*(\w+)\s*=\s*(.+?)\s*$/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          const fieldValue = fieldMatch[2];
          currentEntity.fields.set(fieldName, {
            name: fieldName,
            value: fieldValue,
            line: i,
            column: cleanLine.indexOf(fieldName)
          });
        }
      }

      // Also catch fields that start a block (field = {)
      if (currentEntity && braceDepth === 1 && openBraces > 0) {
        const blockFieldMatch = cleanLine.match(/^\s*(\w+)\s*=\s*\{/);
        if (blockFieldMatch) {
          const fieldName = blockFieldMatch[1];
          currentEntity.fields.set(fieldName, {
            name: fieldName,
            value: '{...}',
            line: i,
            column: cleanLine.indexOf(fieldName)
          });
        }
      }

      braceDepth += openBraces - closeBraces;

      // Check for entity end
      if (currentEntity && braceDepth === 0) {
        currentEntity.endLine = i;
        entities.push(currentEntity);
        currentEntity = null;
      }
    }

    return entities;
  }

  /**
   * Check for name collisions within a file
   */
  private checkNameCollisions(entities: ParsedEntity[]): Array<{ name: string; line: number; otherLine: number }> {
    const collisions: Array<{ name: string; line: number; otherLine: number }> = [];
    const nameMap = new Map<string, number>();

    for (const entity of entities) {
      const existingLine = nameMap.get(entity.name);
      if (existingLine !== undefined) {
        collisions.push({
          name: entity.name,
          line: entity.startLine,
          otherLine: existingLine
        });
      } else {
        nameMap.set(entity.name, entity.startLine);
      }
    }

    return collisions;
  }

  /**
   * Check for missing required fields
   */
  private checkRequiredFields(entity: ParsedEntity, schema: FieldSchema[]): string[] {
    const missing: string[] = [];

    for (const field of schema) {
      if (field.required && !entity.fields.has(field.name)) {
        missing.push(field.name);
      }
    }

    return missing;
  }

  /**
   * Check for invalid/unknown fields
   */
  private checkInvalidFields(
    entity: ParsedEntity,
    schema: FieldSchema[],
    schemaMap: Map<string, FieldSchema>,
    fileType: string
  ): Array<{ name: string; line: number }> {
    const invalid: Array<{ name: string; line: number }> = [];

    // Skip validation for certain complex file types that have many dynamic fields
    if (['event', 'decision', 'interaction'].includes(fileType)) {
      // These have trigger/effect blocks with many valid fields not in the schema
      // Only validate top-level fields that are clearly wrong
      return invalid;
    }

    // Check if schema has wildcard entries
    const hasTriggerWildcard = schema.some(f => f.isWildcard && f.type === 'trigger');
    const hasEffectWildcard = schema.some(f => f.isWildcard && f.type === 'effect');
    const hasModifierWildcard = schema.some(f => f.isWildcard && f.type === 'modifier');

    for (const [fieldName, field] of entity.fields) {
      // Skip common fields that are valid across many contexts
      if (this.isCommonField(fieldName)) {
        continue;
      }

      // If schema has trigger wildcard, accept any valid trigger or scripted trigger
      if (hasTriggerWildcard) {
        if (triggersMap.has(fieldName) || this.workspaceIndex?.has('scripted_trigger', fieldName) || KNOWN_SCOPE_CHANGERS.has(fieldName)) {
          continue;
        }
      }

      // If schema has effect wildcard, accept any valid effect or scripted effect
      if (hasEffectWildcard) {
        if (effectsMap.has(fieldName) || this.workspaceIndex?.has('scripted_effect', fieldName) || KNOWN_SCOPE_CHANGERS.has(fieldName)) {
          continue;
        }
      }

      // If schema has modifier wildcard, accept any valid modifier, template match, or scripted modifier
      if (hasModifierWildcard) {
        if (modifiersMap.has(fieldName) || matchesModifierTemplate(fieldName) || this.workspaceIndex?.has('scripted_modifier', fieldName)) {
          continue;
        }
      }

      if (!schemaMap.has(fieldName)) {
        invalid.push({ name: fieldName, line: field.line });
      }
    }

    return invalid;
  }

  /**
   * Check if a field is a common field valid in many contexts
   */
  private isCommonField(fieldName: string): boolean {
    const commonFields = new Set([
      // Trigger/effect blocks
      'trigger', 'effect', 'immediate', 'after', 'option',
      'is_shown', 'is_valid', 'is_valid_showing_failures_only',
      'ai_potential', 'ai_will_do', 'on_accept', 'on_decline',
      // Modifier blocks
      'modifier', 'character_modifier', 'county_modifier', 'province_modifier',
      // Common structural fields
      'limit', 'if', 'else', 'else_if', 'random_list', 'random',
      // Weight/AI fields
      'weight', 'factor', 'add', 'multiply',
      // Localization
      'desc', 'name', 'tooltip',
    ]);

    return commonFields.has(fieldName);
  }

  /**
   * Check for type mismatches
   */
  private checkTypeMismatches(
    entity: ParsedEntity,
    schemaMap: Map<string, FieldSchema>
  ): Array<{ line: number; message: string }> {
    const mismatches: Array<{ line: number; message: string }> = [];

    for (const [fieldName, field] of entity.fields) {
      const schemaField = schemaMap.get(fieldName);
      if (!schemaField) continue;

      const value = field.value.trim();

      switch (schemaField.type) {
        case 'boolean':
          if (!['yes', 'no'].includes(value)) {
            mismatches.push({
              line: field.line,
              message: `"${fieldName}" expects a boolean (yes/no), got "${value}"`
            });
          }
          break;

        case 'integer':
          // Allow negative numbers
          if (!/^-?\d+$/.test(value)) {
            // In CK3, numeric fields can reference script values
            // Accept @ references (local script values), known script values, or scope paths
            if (!this.isValidScriptValueReference(value)) {
              mismatches.push({
                line: field.line,
                message: `"${fieldName}" expects an integer or script value, got "${value}"`
              });
            }
          } else {
            // Check min/max if defined (only for literal values)
            const num = parseInt(value, 10);
            if (schemaField.min !== undefined && num < schemaField.min) {
              mismatches.push({
                line: field.line,
                message: `"${fieldName}" value ${num} is below minimum ${schemaField.min}`
              });
            }
            if (schemaField.max !== undefined && num > schemaField.max) {
              mismatches.push({
                line: field.line,
                message: `"${fieldName}" value ${num} is above maximum ${schemaField.max}`
              });
            }
          }
          break;

        case 'float':
          if (!/^-?\d+(\.\d+)?$/.test(value)) {
            // In CK3, numeric fields can reference script values
            if (!this.isValidScriptValueReference(value)) {
              mismatches.push({
                line: field.line,
                message: `"${fieldName}" expects a number or script value, got "${value}"`
              });
            }
          }
          break;
      }
    }

    return mismatches;
  }

  /**
   * Check if a value is a valid script value reference
   * This includes @ references (local script values), known script values from the workspace index,
   * and scope paths that evaluate to numbers
   */
  private isValidScriptValueReference(value: string): boolean {
    // @ references are local script values defined at the top of the file
    if (value.startsWith('@')) {
      return true;
    }

    // Scope paths can reference numeric values (e.g., scope:target.martial)
    if (value.includes('.') || value.includes(':')) {
      return true;
    }

    // Check if it's a known script value from the workspace index
    if (this.workspaceIndex?.has('script_value', value)) {
      return true;
    }

    // Accept any identifier that looks like a script value name
    // (starts with letter/underscore, contains only word characters)
    // This is permissive because we may not have indexed all script values yet
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
      return true;
    }

    return false;
  }

  /**
   * Check for invalid enum values
   */
  private checkEnumValues(
    entity: ParsedEntity,
    schemaMap: Map<string, FieldSchema>
  ): Array<{ line: number; message: string }> {
    const invalid: Array<{ line: number; message: string }> = [];

    for (const [fieldName, field] of entity.fields) {
      const schemaField = schemaMap.get(fieldName);
      if (!schemaField || schemaField.type !== 'enum' || !schemaField.values) {
        continue;
      }

      const value = field.value.trim();
      if (!schemaField.values.includes(value)) {
        invalid.push({
          line: field.line,
          message: `Invalid value for "${fieldName}": "${value}". Expected one of: ${schemaField.values.join(', ')}`
        });
      }
    }

    return invalid;
  }

  /**
   * Validate syntax errors (unmatched braces, incomplete assignments, etc.)
   */
  private validateSyntax(document: vscode.TextDocument): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    // Track brace matching
    const braceStack: Array<{ line: number; column: number }> = [];
    let inString = false;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];

      // Skip comment-only lines
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        continue;
      }

      // Find comment start on this line
      const commentIndex = line.indexOf('#');
      const codePart = commentIndex >= 0 ? line.substring(0, commentIndex) : line;

      // Check for incomplete assignment (= at end of line with nothing after)
      // But don't flag comparison operators (<=, >=, !=, ==) as incomplete assignments
      const incompleteAssignMatch = codePart.match(/=\s*$/);
      if (incompleteAssignMatch && !codePart.includes('{')) {
        // Check if the trailing = is part of a comparison operator
        const lastEqPos = codePart.lastIndexOf('=');
        const charBefore = lastEqPos > 0 ? codePart[lastEqPos - 1] : '';
        const isComparisonOp = ['<', '>', '!', '='].includes(charBefore);

        if (!isComparisonOp) {
          // Check if next non-empty line starts with { or has a value (multi-line assignment)
          let nextLineHasValue = false;
          for (let j = lineNum + 1; j < lines.length; j++) {
            const nextTrimmed = lines[j].trim();
            if (nextTrimmed === '' || nextTrimmed.startsWith('#')) continue;
            // Accept: { (block), " (string), number, yes/no, identifier
            if (nextTrimmed.startsWith('{') ||
                nextTrimmed.startsWith('"') ||
                /^-?\d/.test(nextTrimmed) ||
                /^(yes|no)\b/.test(nextTrimmed) ||
                /^[\w@]/.test(nextTrimmed)) {
              nextLineHasValue = true;
            }
            break;
          }

          if (!nextLineHasValue) {
            const eqPos = codePart.lastIndexOf('=');
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(lineNum, eqPos, lineNum, eqPos + 1),
              'Incomplete assignment: expected value after "="',
              vscode.DiagnosticSeverity.Error
            ));
          }
        }
      }

      // Track braces for matching
      for (let col = 0; col < codePart.length; col++) {
        const char = codePart[col];

        if (char === '{') {
          braceStack.push({ line: lineNum, column: col });
        } else if (char === '}') {
          if (braceStack.length === 0) {
            // Unmatched closing brace
            diagnostics.push(new vscode.Diagnostic(
              new vscode.Range(lineNum, col, lineNum, col + 1),
              'Unmatched closing brace "}"',
              vscode.DiagnosticSeverity.Error
            ));
          } else {
            braceStack.pop();
          }
        }
      }

      // Note: We don't check for double equals (==) because CK3 uses == for comparisons in triggers
      // e.g., `$VALUE$ == 25` or `count == 5`

      // Check for assignment without field name: = value at start of line
      // But allow if previous line ends with a field name (multi-line continuation)
      const badAssignMatch = codePart.match(/^\s*=\s*\S/);
      if (badAssignMatch) {
        // Check if previous non-comment line ends with an identifier (field name continuation)
        let prevLineEndsWithFieldName = false;
        for (let j = lineNum - 1; j >= 0; j--) {
          const prevLine = lines[j].trim();
          if (prevLine === '' || prevLine.startsWith('#')) continue;
          // Remove inline comment
          const prevCommentIdx = prevLine.indexOf('#');
          const prevCode = prevCommentIdx >= 0 ? prevLine.substring(0, prevCommentIdx).trim() : prevLine;
          // Check if it ends with an identifier (word characters)
          if (/\w$/.test(prevCode)) {
            prevLineEndsWithFieldName = true;
          }
          break;
        }

        if (!prevLineEndsWithFieldName) {
          diagnostics.push(new vscode.Diagnostic(
            new vscode.Range(lineNum, codePart.indexOf('='), lineNum, codePart.indexOf('=') + 1),
            'Missing field name before "="',
            vscode.DiagnosticSeverity.Error
          ));
        }
      }
    }

    // Check for unmatched opening braces at end of file
    for (const brace of braceStack) {
      diagnostics.push(new vscode.Diagnostic(
        new vscode.Range(brace.line, brace.column, brace.line, brace.column + 1),
        'Unmatched opening brace "{"',
        vscode.DiagnosticSeverity.Error
      ));
    }

    return diagnostics;
  }

  /**
   * Validate effects and triggers in context-aware blocks
   */
  private validateEffectsAndTriggers(
    document: vscode.TextDocument
  ): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const lines = text.split('\n');

    // Track context as we parse - now includes 'weight' context
    const blockStack: Array<{ name: string; context: 'trigger' | 'effect' | 'weight' | 'unknown'; parentContext?: 'trigger' | 'effect' | 'weight' | 'unknown' }> = [];
    let braceDepth = 0;

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum];
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || trimmed === '') {
        continue;
      }

      // Remove inline comments
      const commentIndex = line.indexOf('#');
      const cleanLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;

      // Count braces
      const openBraces = (cleanLine.match(/\{/g) || []).length;
      const closeBraces = (cleanLine.match(/\}/g) || []).length;

      // Check for ALL block starts on this line using the unified regex pattern
      // A single line may contain multiple inline blocks like: limit = { scope:actor = { is_ai = yes } }
      // We need to push ALL of them to keep the stack balanced with closing braces
      const blockStartRegex = new RegExp(BLOCK_START_PATTERN.source, 'g');
      const blockStarts = [...cleanLine.matchAll(blockStartRegex)];
      for (const match of blockStarts) {
        const blockName = match[1];
        const operator = match[2];
        const parentContext = blockStack.length > 0 ? blockStack[blockStack.length - 1].context : 'unknown';

        // Validate ?= operator usage (must be valid scope changer)
        if (operator === '?=') {
          if (!this.isValidScopeChanger(blockName)) {
            const fieldStart = cleanLine.indexOf(blockName);
            const range = new vscode.Range(
              new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
              new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + blockName.length : cleanLine.length)
            );
            diagnostics.push(new vscode.Diagnostic(
              range,
              `Invalid ?= usage: "${blockName}" is not a valid scope. The ?= operator requires a scope changer.`,
              vscode.DiagnosticSeverity.Warning
            ));
          }
        }

        // Use unified context determination from blockParser
        let context = determineBlockContext(blockName, operator, parentContext);

        // For comparison and ?= operators, skip further block validation
        if (operator === '?=' || operator === '>' || operator === '<' || operator === '>=' || operator === '<=') {
          blockStack.push({ name: blockName, context, parentContext });
          continue;
        }

        // Validate block names that are in a trigger/effect context but aren't explicitly recognized
        // These are potentially unknown effects/triggers with block values (e.g., `adsasd = { }`)
        // Check if the block is explicitly recognized (establishes its own context or is a known inheriting block)
        const isExplicitlyRecognized = (
          WEIGHT_BLOCKS.has(blockName) ||
          SCRIPT_VALUE_BLOCKS.has(blockName) ||
          TRIGGER_BLOCKS.has(blockName) ||
          EFFECT_BLOCKS.has(blockName) ||
          TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.has(blockName) ||
          isScopeReference(blockName) ||
          this.isValidScopeChanger(blockName) ||
          this.isValidIterator(blockName, parentContext as 'trigger' | 'effect') ||
          (parentContext === 'effect' && effectsMap.has(blockName)) ||
          (parentContext === 'trigger' && triggersMap.has(blockName))
        );

        if (!isExplicitlyRecognized && (parentContext === 'trigger' || parentContext === 'effect')) {
          // Get the parent block info for validation
          const parentBlockInfo = blockStack.length > 0 ? blockStack[blockStack.length - 1] : null;
          const parentBlockName = parentBlockInfo?.name || '';

          // Check if parent block has special schema validation
          const parentBlockConfig = BLOCK_SCHEMAS.get(parentBlockName);
          if (!parentBlockConfig) {
            // Normal validation - parent block has no special schema
            const diagnostic = this.validateFieldInContext(
              blockName,
              parentContext,
              blockStack,
              lineNum,
              cleanLine,
              document,
              parentBlockInfo?.parentContext
            );
            if (diagnostic) {
              diagnostics.push(diagnostic);
            }
          } else {
            // Parent block has special schema - validate according to its type
            switch (parentBlockConfig.childValidation) {
              case 'none':
                // Pure dynamic keys - skip validation
                break;
              case 'schema-only': {
                // Only schema fields allowed
                const schemaMap = getBlockSchemaMap(parentBlockName);
                if (schemaMap && !schemaMap.has(blockName)) {
                  const fieldStart = cleanLine.indexOf(blockName);
                  const range = new vscode.Range(
                    new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
                    new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + blockName.length : cleanLine.length)
                  );
                  diagnostics.push(new vscode.Diagnostic(
                    range,
                    `Unknown field "${blockName}" in ${parentBlockName} block. Valid fields: ${[...schemaMap.keys()].join(', ')}`,
                    vscode.DiagnosticSeverity.Warning
                  ));
                }
                break;
              }
              case 'schema+effects': {
                // Schema fields + effects allowed - validate as effect if not in schema
                const schemaMap = getBlockSchemaMap(parentBlockName);
                if (!schemaMap?.has(blockName)) {
                  // Not a schema field - validate as effect/trigger
                  const diagnostic = this.validateFieldInContext(
                    blockName,
                    parentContext,
                    blockStack,
                    lineNum,
                    cleanLine,
                    document,
                    parentBlockInfo?.parentContext
                  );
                  if (diagnostic) {
                    diagnostics.push(diagnostic);
                  }
                }
                break;
              }
            }
          }

          // Inherit parent context so nested contents are still validated
          context = parentContext;
        }

        blockStack.push({ name: blockName, context, parentContext });
      }

      // Check for simple field: name = value or name ?= value (no opening brace)
      // Regex captures: (1) identifier, (2) operator (= or ?=), (3) value
      // Includes $ for script variables like $CHARACTER$.liege
      // IMPORTANT: Use [^{]* (not [^{].*) to ensure value contains NO braces at all
      // Otherwise " { ..." would match because space is [^{] and .* matches the rest
      const fieldMatch = cleanLine.match(/^\s*([\w.:$]+)\s*(\?=|=)\s*([^{]*)$/);
      if (fieldMatch && blockStack.length > 0) {
        const fieldName = fieldMatch[1];
        const fieldOperator = fieldMatch[2];
        const currentBlock = blockStack[blockStack.length - 1];

        // Determine if we should validate this field
        let shouldValidate = true;

        // For ?= operator with simple values, this is a scope comparison
        // e.g., "house ?= top_liege.house" - comparing if scopes are equal
        // These are valid as long as the LHS is a valid scope reference
        if (fieldOperator === '?=') {
          if (!this.isValidScopeChanger(fieldName)) {
            const fieldStart = cleanLine.indexOf(fieldName);
            const range = new vscode.Range(
              new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
              new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length)
            );
            diagnostics.push(new vscode.Diagnostic(
              range,
              `Invalid ?= usage: "${fieldName}" is not a valid scope. The ?= operator requires a scope reference.`,
              vscode.DiagnosticSeverity.Warning
            ));
          }
          shouldValidate = false; // Don't validate ?= as effect/trigger
        }

        // Check if current block has special schema validation
        const currentBlockConfig = BLOCK_SCHEMAS.get(currentBlock.name);
        if (shouldValidate && currentBlockConfig) {
          switch (currentBlockConfig.childValidation) {
            case 'none':
              // Pure dynamic keys - skip validation
              shouldValidate = false;
              break;
            case 'schema-only': {
              // Only schema fields allowed
              const schemaMap = getBlockSchemaMap(currentBlock.name);
              if (schemaMap && !schemaMap.has(fieldName)) {
                const fieldStart = cleanLine.indexOf(fieldName);
                const range = new vscode.Range(
                  new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
                  new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length)
                );
                diagnostics.push(new vscode.Diagnostic(
                  range,
                  `Unknown field "${fieldName}" in ${currentBlock.name} block. Valid fields: ${[...schemaMap.keys()].join(', ')}`,
                  vscode.DiagnosticSeverity.Warning
                ));
              }
              shouldValidate = false;
              break;
            }
            case 'schema+effects': {
              // Schema fields + effects allowed - only skip if it's a schema field
              const schemaMap = getBlockSchemaMap(currentBlock.name);
              if (schemaMap?.has(fieldName)) {
                shouldValidate = false; // Known schema field, don't validate as effect
              }
              // Otherwise continue to effect/trigger validation
              break;
            }
          }
        }

        // Only validate if we're in a known context and validation isn't skipped
        if (shouldValidate && currentBlock.context !== 'unknown') {
          const diagnostic = this.validateFieldInContext(
            fieldName,
            currentBlock.context,
            blockStack,
            lineNum,
            cleanLine,
            document,
            currentBlock.parentContext
          );
          if (diagnostic) {
            diagnostics.push(diagnostic);
          }

          // Validate target value for effects/triggers that expect specific entity types
          if (currentBlock.context === 'effect' || currentBlock.context === 'trigger') {
            const fieldValue = fieldMatch[3].trim();
            const targetDiag = this.validateTargetValue(
              fieldName,
              fieldValue,
              lineNum,
              cleanLine
            );
            if (targetDiag) {
              diagnostics.push(targetDiag);
            }
          }
        }
      }

      // Check for bare identifiers (lines without operators) inside blocks
      // These are valid in list blocks (events, on_actions) but errors in trigger/effect blocks
      if (!fieldMatch && blockStack.length > 0) {
        const bareIdentifierMatch = cleanLine.match(/^\s*([\w.:]+)\s*$/);
        if (bareIdentifierMatch) {
          const identifier = bareIdentifierMatch[1];
          const currentBlock = blockStack[blockStack.length - 1];
          const listBlockType = LIST_BLOCKS[currentBlock.name];

          if (listBlockType !== undefined) {
            // This is a list block
            if (listBlockType !== null) {
              // Validate the identifier exists against entity registry
              const entityType = listBlockType as EntityType;
              if (this.workspaceIndex && !this.workspaceIndex.has(entityType, identifier)) {
                const identifierStart = cleanLine.indexOf(identifier);
                const range = new vscode.Range(
                  new vscode.Position(lineNum, identifierStart >= 0 ? identifierStart : 0),
                  new vscode.Position(lineNum, identifierStart >= 0 ? identifierStart + identifier.length : cleanLine.length)
                );
                diagnostics.push(new vscode.Diagnostic(
                  range,
                  `Unknown ${entityType} "${identifier}"`,
                  vscode.DiagnosticSeverity.Warning
                ));
              }
            }
            // If listBlockType is null, bare identifiers are allowed without validation
          } else if (currentBlock.context === 'trigger' || currentBlock.context === 'effect') {
            // Not a list block, but we're in a trigger/effect context - this is likely an error
            const identifierStart = cleanLine.indexOf(identifier);
            const range = new vscode.Range(
              new vscode.Position(lineNum, identifierStart >= 0 ? identifierStart : 0),
              new vscode.Position(lineNum, identifierStart >= 0 ? identifierStart + identifier.length : cleanLine.length)
            );
            diagnostics.push(new vscode.Diagnostic(
              range,
              `Unexpected bare identifier "${identifier}". Did you forget "= yes" or "= <value>"?`,
              vscode.DiagnosticSeverity.Warning
            ));
          }
        }
      }

      // Update brace depth and pop blocks
      braceDepth += openBraces - closeBraces;

      // Pop blocks when braces close
      for (let i = 0; i < closeBraces; i++) {
        if (blockStack.length > 0) {
          blockStack.pop();
        }
      }
    }

    return diagnostics;
  }

  /**
   * Check if a name is a valid scope reference
   * Valid scope references include:
   * - Known scope changers (liege, domicile, activity_host, etc.)
   * - Prefixed scopes (scope:target, var:my_var, culture:english, court_position:X)
   * - Dot-paths (faith.religious_head, house.house_confederation)
   * - Script variables ($CHARACTER$, $TARGET$.liege, etc.)
   */
  private isValidScopeChanger(name: string): boolean {
    // Script variables like $CHARACTER$ or $TARGET$.liege are always valid
    // They get substituted at runtime with actual scope references
    if (name.includes('$')) {
      return true;
    }

    // Known scope changers
    if (KNOWN_SCOPE_CHANGERS.has(name)) {
      return true;
    }

    // Prefixed scopes: scope:X, var:X, culture:X, faith:X, title:X, etc.
    if (name.includes(':')) {
      return true;
    }

    // Dot-paths: faith.religious_head, house.house_confederation
    if (name.includes('.')) {
      // First segment should be a valid scope changer or prefixed scope
      const firstSegment = name.split('.')[0];
      if (KNOWN_SCOPE_CHANGERS.has(firstSegment) || firstSegment.includes(':')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a field name is a valid iterator for the context
   */
  private isValidIterator(name: string, context: 'trigger' | 'effect'): boolean {
    for (const prefix of ITERATOR_PREFIXES) {
      if (name.startsWith(prefix)) {
        // Check if this iterator exists in effects or triggers
        if (context === 'effect' && effectsMap.has(name)) {
          return true;
        }
        if (context === 'trigger' && triggersMap.has(name)) {
          return true;
        }
        // Also check the other map since some iterators work in both
        if (effectsMap.has(name) || triggersMap.has(name)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Validate a field in a specific context (trigger, effect, or weight)
   */
  private validateFieldInContext(
    fieldName: string,
    context: 'trigger' | 'effect' | 'weight',
    blockStack: Array<{ name: string; context: 'trigger' | 'effect' | 'weight' | 'unknown'; parentContext?: 'trigger' | 'effect' | 'weight' | 'unknown' }>,
    lineNum: number,
    cleanLine: string,
    document: vscode.TextDocument,
    parentContext?: 'trigger' | 'effect' | 'weight' | 'unknown'
  ): vscode.Diagnostic | null {
    // Get the immediate parent block name for error messages
    const parentBlockName = blockStack.length > 0 ? blockStack[blockStack.length - 1].name : '';
    // Handle weight context - validate against weight block params
    if (context === 'weight') {
      if (WEIGHT_BLOCK_PARAMS.has(fieldName)) {
        return null; // Valid weight block parameter
      }
      // In weight context, unknown fields are not flagged as effects/triggers
      // They could be script values or other valid constructs
      return null;
    }

    // Skip UPPERCASE parameters - these are scripted effect/trigger parameters
    // Scripted effects/triggers use UPPERCASE naming convention for their parameters
    // e.g., change_house_relation_effect = { HOUSE = ... VALUE = ... REASON = ... }
    if (/^[A-Z][A-Z0-9_]*$/.test(fieldName)) {
      return null;
    }

    // Skip known fields inside random_list weight blocks (numeric parent names like "50", "25")
    // These blocks can have desc, show_chance, trigger, modifier, weight plus actual effects
    if (/^\d+$/.test(parentBlockName) && RANDOM_LIST_WEIGHT_FIELDS.has(fieldName)) {
      return null;
    }

    // Handle blocks that create trigger context with extra params
    const blockConfig = TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.get(parentBlockName);
    if (blockConfig) {
      if (blockConfig.extraParams.has(fieldName)) {
        return null; // Valid block-specific parameter (e.g., 'add' in modifier)
      }
      // Not an extra param - validate as trigger (inline triggers)
    }
    // Skip control flow and common fields
    if (CONTROL_FLOW_FIELDS.has(fieldName)) {
      return null;
    }

    // Skip context-establishing blocks (these are schema fields, not effects/triggers)
    // This handles edge cases where `immediate =` is on a separate line from `{`
    if (TRIGGER_BLOCKS.has(fieldName) || EFFECT_BLOCKS.has(fieldName)) {
      return null;
    }

    // Skip scope changers
    if (this.isValidScopeChanger(fieldName)) {
      return null;
    }

    // Skip iterators
    if (this.isValidIterator(fieldName, context)) {
      return null;
    }

    // Check if it's a known parameter of the immediate parent block
    const parentEffect = effectsMap.get(parentBlockName);
    const parentTrigger = triggersMap.get(parentBlockName);
    if (parentEffect?.parameters?.includes(fieldName) || parentTrigger?.parameters?.includes(fieldName)) {
      return null;
    }

    // 'custom' is a valid parameter for all iterator effects (provides custom tooltip header)
    if (fieldName === 'custom' && (parentEffect?.isIterator || parentTrigger?.isIterator)) {
      return null;
    }

    // If the immediate parent is a transparent control flow block, also check enclosing effect/trigger
    // E.g., in `start_war = { if = { cb = X } }`, cb is a parameter of start_war, not if
    if (TRANSPARENT_FOR_PARAMS.has(parentBlockName)) {
      for (let i = blockStack.length - 2; i >= 0; i--) {  // Start from grandparent
        const block = blockStack[i];
        // Skip other transparent blocks
        if (TRANSPARENT_FOR_PARAMS.has(block.name)) {
          continue;
        }
        // Found the enclosing non-transparent block - check its parameters
        const ownerEffect = effectsMap.get(block.name);
        const ownerTrigger = triggersMap.get(block.name);
        if (ownerEffect?.parameters?.includes(fieldName) || ownerTrigger?.parameters?.includes(fieldName)) {
          return null;
        }
        // 'custom' is valid for enclosing iterators too
        if (fieldName === 'custom' && (ownerEffect?.isIterator || ownerTrigger?.isIterator)) {
          return null;
        }
        // Stop at the first non-transparent block
        break;
      }
    }

    // Check if it's a scope path like "liege.primary_title.holder"
    if (looksLikeScopePath(fieldName)) {
      // For now, use 'character' as the starting scope
      // TODO: Use the actual tracked scope from block context
      const result = validateScopePath(fieldName, 'character');
      if (result.valid) {
        return null;
      }
      // If invalid, we'll let it fall through to the unknown effect/trigger check
    }

    // Check if it's a scope:X reference
    if (isScopeReference(fieldName)) {
      return null;
    }

    // Check for special CK3 patterns that shouldn't be flagged
    if (this.isSpecialPattern(fieldName)) {
      return null;
    }

    // Check if it's a valid effect/trigger for the context
    if (context === 'effect') {
      const isKnownEffect = effectsMap.has(fieldName);
      const isKnownTrigger = triggersMap.has(fieldName);

      if (!isKnownEffect) {
        // Not a known effect - check if it's a trigger used in wrong context
        if (isKnownTrigger) {
          const fieldStart = cleanLine.indexOf(fieldName);
          const range = new vscode.Range(
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length)
          );
          return new vscode.Diagnostic(
            range,
            `Trigger "${fieldName}" used in effect context (in "${parentBlockName}")`,
            vscode.DiagnosticSeverity.Warning
          );
        }
        // Unknown - could be a scripted effect
        if (!this.couldBeScriptedEffectOrTrigger(fieldName)) {
          const fieldStart = cleanLine.indexOf(fieldName);
          const range = new vscode.Range(
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length)
          );
          return new vscode.Diagnostic(
            range,
            `Unknown effect: "${fieldName}" in "${parentBlockName}"`,
            vscode.DiagnosticSeverity.Warning
          );
        }
      }
    } else if (context === 'trigger') {
      const isKnownEffect = effectsMap.has(fieldName);
      const isKnownTrigger = triggersMap.has(fieldName);

      if (!isKnownTrigger) {
        // Not a known trigger - check if it's an effect used in wrong context
        if (isKnownEffect) {
          const fieldStart = cleanLine.indexOf(fieldName);
          const range = new vscode.Range(
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length)
          );
          return new vscode.Diagnostic(
            range,
            `Effect "${fieldName}" used in trigger context (in "${parentBlockName}")`,
            vscode.DiagnosticSeverity.Warning
          );
        }
        // Unknown - could be a scripted trigger
        if (!this.couldBeScriptedEffectOrTrigger(fieldName)) {
          const fieldStart = cleanLine.indexOf(fieldName);
          const range = new vscode.Range(
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0),
            new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length)
          );
          return new vscode.Diagnostic(
            range,
            `Unknown trigger: "${fieldName}" in "${parentBlockName}"`,
            vscode.DiagnosticSeverity.Warning
          );
        }
      }
    }

    return null;
  }

  /**
   * Validate that an effect/trigger target value exists in the workspace index
   * For effects like `add_trait = brave`, checks that 'brave' is a valid trait
   */
  private validateTargetValue(
    effectName: string,
    value: string,
    lineNum: number,
    cleanLine: string
  ): vscode.Diagnostic | null {
    // Skip if no workspace index
    if (!this.workspaceIndex) {
      return null;
    }

    // Skip scope references (scope:X) - these are dynamic
    if (value.startsWith('scope:')) {
      return null;
    }

    // Skip variable references ($VARIABLE$)
    if (value.startsWith('$') && value.endsWith('$')) {
      return null;
    }

    // Skip flag: references (flag:some_flag)
    if (value.startsWith('flag:')) {
      return null;
    }

    // Skip bare scope references - these reference the current/previous scope
    // whose type depends on context and can't be statically validated
    const bareScopes = [
      // Basic scope changers
      'prev', 'this', 'root', 'from',
      // Variable accessors
      'event_target', 'global_var', 'local_var',
      // Context-specific scope variables (commonly used in iterations/events)
      'involved_activity', 'activity', 'inspiration', 'scheme', 'secret',
      'artifact', 'war', 'faction', 'legend', 'story', 'struggle',
      'regiment_owning_title', 'target_title', 'landed_title',
    ];
    if (bareScopes.includes(value)) {
      return null;
    }

    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, '');

    // Skip empty values
    if (!cleanValue) {
      return null;
    }

    // Look up the effect or trigger definition
    const definition = effectsMap.get(effectName) || triggersMap.get(effectName);
    if (!definition?.supportedTargets) {
      return null;
    }

    // Check for prefixed database references (trait:brave, title:k_france, etc.)
    // These are valid only if the resolved type matches the expected target type
    const colonIndex = cleanValue.indexOf(':');
    if (colonIndex > 0 && !cleanValue.startsWith('scope:')) {
      const prefix = cleanValue.substring(0, colonIndex);

      // Skip var: references (variable access)
      if (prefix === 'var') {
        return null;
      }

      // Skip if prefix contains dots (e.g., root.var:X) - can't validate these
      if (prefix.includes('.')) {
        return null;
      }

      // Try to resolve the scope path to its final type
      // e.g., "title:k_england.holder" -> "character"
      const resolvedType = resolvePrefixedScopePath(cleanValue);

      if (resolvedType) {
        // We could resolve the type - check if it matches what's expected
        if (definition.supportedTargets.includes(resolvedType as any)) {
          return null; // Type matches - valid reference
        }
        // Type doesn't match - flag it
        const expectedType = definition.supportedTargets[0];
        const valueStart = cleanLine.lastIndexOf(value);
        const range = new vscode.Range(
          new vscode.Position(lineNum, valueStart >= 0 ? valueStart : 0),
          new vscode.Position(lineNum, valueStart >= 0 ? valueStart + value.length : cleanLine.length)
        );
        return new vscode.Diagnostic(
          range,
          `Expected ${expectedType}, got ${resolvedType}: "${cleanValue}"`,
          vscode.DiagnosticSeverity.Warning
        );
      }

      // Couldn't resolve (unknown prefix or unknown scope changer) - skip validation
      return null;
    }

    // Try to resolve dot-separated scope paths (root.culture, root.capital_county.holder)
    // These resolve through scope changers to a final type
    if (cleanValue.includes('.')) {
      const resolvedType = resolveDotScopePath(cleanValue);

      if (resolvedType) {
        // We resolved the path - check if type matches expected targets
        if (definition.supportedTargets.includes(resolvedType as any)) {
          return null; // Type matches - valid reference
        }
        // Type doesn't match - flag it
        const expectedType = definition.supportedTargets[0];
        const valueStart = cleanLine.lastIndexOf(value);
        const range = new vscode.Range(
          new vscode.Position(lineNum, valueStart >= 0 ? valueStart : 0),
          new vscode.Position(lineNum, valueStart >= 0 ? valueStart + value.length : cleanLine.length)
        );
        return new vscode.Diagnostic(
          range,
          `Expected ${expectedType}, got ${resolvedType}: "${cleanValue}"`,
          vscode.DiagnosticSeverity.Warning
        );
      }

      // Couldn't resolve (starts with prev/this/from or unknown changer) - skip validation
      return null;
    }

    // Check if the value is a bare scope changer that outputs the expected type
    // e.g., "primary_title" is a scope changer that outputs landed_title
    const scopeChangerDef = effectsMap.get(cleanValue) || triggersMap.get(cleanValue);
    if (scopeChangerDef?.outputScope) {
      // This is a scope changer - check if its output type matches what's expected
      if (definition.supportedTargets.includes(scopeChangerDef.outputScope as any)) {
        return null; // Valid - scope changer outputs the right type
      }
      // Output type doesn't match - could flag it, but skip for now to avoid false positives
      return null;
    }

    // Check if any supportedTargets maps to an entity type we track
    for (const target of definition.supportedTargets) {
      const entityType = TARGET_TO_ENTITY_TYPE[target];
      if (entityType) {
        // Check if value exists in index
        if (!this.workspaceIndex.has(entityType, cleanValue)) {
          const valueStart = cleanLine.lastIndexOf(value);
          const range = new vscode.Range(
            new vscode.Position(lineNum, valueStart >= 0 ? valueStart : 0),
            new vscode.Position(lineNum, valueStart >= 0 ? valueStart + value.length : cleanLine.length)
          );
          return new vscode.Diagnostic(
            range,
            `Unknown ${entityType}: "${cleanValue}"`,
            vscode.DiagnosticSeverity.Warning
          );
        }
      }
    }

    return null;
  }

  /**
   * Check if a name could be a scripted effect or trigger
   * Scripted effects/triggers are user-defined and can have any name
   * We use heuristics to avoid false positives
   */
  private couldBeScriptedEffectOrTrigger(name: string): boolean {
    // Common patterns for scripted effects/triggers
    const scriptedPatterns = [
      /_effect$/,
      /_trigger$/,
      /^trigger_/,
      /^effect_/,
      /^scripted_/,
      /^has_/,
      /^is_/,
      /^can_/,
      /^get_/,
      /^set_/,
      /^add_/,
      /^remove_/,
      /^check_/,
      /^calculate_/,
      /^apply_/,
      /^grant_/,
      /^create_/,
      /^destroy_/,
      /^update_/,
      /^validate_/,
    ];

    for (const pattern of scriptedPatterns) {
      if (pattern.test(name)) {
        return true;
      }
    }

    // Also allow anything with underscores (likely a scripted thing)
    // This is very permissive to avoid false positives
    if (name.includes('_') && name.length > 3) {
      return true;
    }

    return false;
  }

  /**
   * Check if a name is a special CK3 pattern that shouldn't be flagged
   * These include script variables, flag/var references, and specific scope targets
   */
  private isSpecialPattern(name: string): boolean {
    // Script variable substitutions: $VAR$, $VARIABLE$
    if (/^\$[A-Z_][A-Z0-9_]*\$$/.test(name)) {
      return true;
    }

    // Paths containing script variables: $INVADER$.faith.religion
    if (name.includes('$')) {
      return true;
    }

    // Flag references: flag:something, flag:$VAR$
    if (/^flag:[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
      return true;
    }

    // Variable references: var:something
    if (/^var:[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      return true;
    }

    // Specific scope targets: faith:catholic, title:k_france, culture:norse
    if (/^(faith|title|culture|religion|dynasty|house|artifact|character):[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
      return true;
    }

    // Pure numeric values used as triggers (like "1" in some contexts)
    if (/^\d+$/.test(name)) {
      return true;
    }

    return false;
  }

  /**
   * Get the start position of a line in the text
   */
  private getLineStart(text: string, lineNumber: number): number {
    let pos = 0;
    let line = 0;
    while (line < lineNumber && pos < text.length) {
      if (text[pos] === '\n') {
        line++;
      }
      pos++;
    }
    return pos;
  }

  /**
   * Get the end position of a line in the text
   */
  private getLineEnd(text: string, lineNumber: number): number {
    let pos = this.getLineStart(text, lineNumber);
    while (pos < text.length && text[pos] !== '\n') {
      pos++;
    }
    return pos;
  }
}
