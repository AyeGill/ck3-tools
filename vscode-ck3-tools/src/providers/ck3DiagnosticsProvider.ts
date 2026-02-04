import * as vscode from 'vscode';
import * as fs from 'fs';
import { FieldSchema } from '../schemas/traitSchema';
import { effectsMap, triggersMap, modifiersMap, matchesModifierTemplate, ScopeType } from '../data';
import { CK3WorkspaceIndex, EntityType } from './workspaceIndex';
import {
  TRIGGER_BLOCKS,
  EFFECT_BLOCKS,
  WEIGHT_BLOCKS,
  WEIGHT_BLOCK_PARAMS,
  TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS,
  BlockContext,
  analyzeBlockContext,
  validateScopePath,
  looksLikeScopePath,
  isScopeReference,
  KNOWN_SCOPE_CHANGERS,
} from '../utils/scopeContext';

// Import all schemas we want to validate
import { traitSchema, traitSchemaMap } from '../schemas/traitSchema';
import { eventSchema, eventSchemaMap } from '../schemas/eventSchema';
import { decisionSchema, decisionSchemaMap } from '../schemas/decisionSchema';
import { interactionSchema, interactionSchemaMap } from '../schemas/interactionSchema';
import { buildingSchema, buildingSchemaMap } from '../schemas/buildingSchema';
import { artifactSchema, artifactSchemaMap } from '../schemas/artifactSchema';
import { schemeSchema, schemeSchemaMap } from '../schemas/schemeSchema';
import { opinionModifierSchema, opinionModifierSchemaMap } from '../schemas/opinionModifierSchema';
import { nicknameSchema, nicknameSchemaMap } from '../schemas/nicknameSchema';
import { modifierSchema, modifierSchemaMap } from '../schemas/modifierSchema';
import { secretSchema, secretSchemaMap } from '../schemas/secretSchema';
import { activitySchema, activitySchemaMap } from '../schemas/activitySchema';
import { onActionSchema, onActionSchemaMap } from '../schemas/onActionSchema';
import { scriptedEffectSchema, scriptedEffectSchemaMap } from '../schemas/scriptedEffectsSchema';
import { scriptedTriggerSchema, scriptedTriggerSchemaMap } from '../schemas/scriptedTriggersSchema';
import { scriptedModifierSchema, scriptedModifierSchemaMap } from '../schemas/scriptedModifierSchema';

/**
 * Supported file types for diagnostics
 */
type DiagnosticFileType =
  | 'trait' | 'event' | 'decision' | 'interaction' | 'building'
  | 'artifact' | 'scheme' | 'opinion_modifier' | 'nickname'
  | 'modifier' | 'secret' | 'activity' | 'on_action'
  | 'scripted_effect' | 'scripted_trigger' | 'scripted_modifier'
  | 'unknown';

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
 * Blocks where children are dynamic keys (not effects/triggers)
 * For example, stress_impact children are trait names, not effects
 */
const DYNAMIC_KEY_BLOCKS = new Set([
  'stress_impact',           // children are trait names
  'ai_value_modifier',       // may have dynamic keys
  'compare_value',           // comparison block
  'value',                   // numeric value blocks
  'option',                  // event options have schema fields + effects (temporary - see TODO)
  'switch',                  // children are case keys (trait names, terrain types, yes/no, etc.)
  'random_traits_list',      // children are trait names
  'random_list',             // children are numeric weight keys (50 = { }, 25 = { })
  'participants',            // children are participant role names
  'properties',              // children are property names
  'ai_frequency_by_tier',    // children are title tier names (barony, county, etc.)
]);

/**
 * Fields that are valid inside random_list weight blocks (numeric parent names)
 * These are commonly used for tooltips and weight configuration
 */
const RANDOM_LIST_WEIGHT_FIELDS = new Set([
  'desc', 'show_chance', 'trigger', 'modifier', 'weight', 'min', 'max',
]);

/**
 * Blocks that establish script value context (math expressions)
 * Inside these blocks, math operations like value, add, multiply are valid
 */
const SCRIPT_VALUE_BLOCKS = new Set([
  'chance',                           // parameter of random effect
  'add', 'subtract', 'multiply', 'divide',  // math operation blocks
  'min', 'max',                       // bounds blocks
  'factor',                           // multiplier block
  'compare_modifier',                 // comparison with modifiers
  'compatibility_modifier',           // compatibility calculations
]);

/**
 * Mapping from effect/trigger supportedTargets values to EntityType for validation
 * Only includes target types that we can actually validate against the workspace index
 */
const TARGET_TO_ENTITY_TYPE: Partial<Record<string, EntityType>> = {
  'trait': 'trait',
  // Future: add more as we expand workspace index tracking
  // 'event': 'event',  // Would need special handling for namespace.id format
};

/**
 * Parsed field with context information
 */
interface ParsedFieldWithContext extends ParsedField {
  context: 'trigger' | 'effect' | 'schema' | 'unknown';
  blockPath: string[];
}

const SCHEMA_REGISTRY: Map<DiagnosticFileType, { schema: FieldSchema[], schemaMap: Map<string, FieldSchema> }> = new Map([
  ['trait', { schema: traitSchema, schemaMap: traitSchemaMap }],
  ['event', { schema: eventSchema, schemaMap: eventSchemaMap }],
  ['decision', { schema: decisionSchema, schemaMap: decisionSchemaMap }],
  ['interaction', { schema: interactionSchema, schemaMap: interactionSchemaMap }],
  ['building', { schema: buildingSchema, schemaMap: buildingSchemaMap }],
  ['artifact', { schema: artifactSchema, schemaMap: artifactSchemaMap }],
  ['scheme', { schema: schemeSchema, schemaMap: schemeSchemaMap }],
  ['opinion_modifier', { schema: opinionModifierSchema, schemaMap: opinionModifierSchemaMap }],
  ['nickname', { schema: nicknameSchema, schemaMap: nicknameSchemaMap }],
  ['modifier', { schema: modifierSchema, schemaMap: modifierSchemaMap }],
  ['secret', { schema: secretSchema, schemaMap: secretSchemaMap }],
  ['activity', { schema: activitySchema, schemaMap: activitySchemaMap }],
  ['on_action', { schema: onActionSchema, schemaMap: onActionSchemaMap }],
  ['scripted_effect', { schema: scriptedEffectSchema, schemaMap: scriptedEffectSchemaMap }],
  ['scripted_trigger', { schema: scriptedTriggerSchema, schemaMap: scriptedTriggerSchemaMap }],
  ['scripted_modifier', { schema: scriptedModifierSchema, schemaMap: scriptedModifierSchemaMap }],
]);

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

    const fileType = this.getFileType(document.fileName);
    if (fileType === 'unknown') {
      // Clear diagnostics for unknown file types
      this.diagnosticCollection.set(document.uri, []);
      return;
    }

    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();

    // Parse entities from the document
    const entities = this.parseEntities(text);

    // Get schema for this file type
    const schemaInfo = SCHEMA_REGISTRY.get(fileType);
    if (!schemaInfo) {
      this.diagnosticCollection.set(document.uri, []);
      return;
    }

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
   * Determine file type from path
   */
  private getFileType(filePath: string): DiagnosticFileType {
    const normalizedPath = filePath.replace(/\\/g, '/');

    if (normalizedPath.includes('/common/traits/')) return 'trait';
    if (normalizedPath.includes('/events/')) return 'event';
    if (normalizedPath.includes('/common/decisions/')) return 'decision';
    if (normalizedPath.includes('/common/character_interactions/')) return 'interaction';
    if (normalizedPath.includes('/common/buildings/')) return 'building';
    if (normalizedPath.includes('/common/artifacts/')) return 'artifact';
    if (normalizedPath.includes('/common/schemes/')) return 'scheme';
    if (normalizedPath.includes('/common/opinion_modifiers/')) return 'opinion_modifier';
    if (normalizedPath.includes('/common/nicknames/')) return 'nickname';
    if (normalizedPath.includes('/common/modifiers/')) return 'modifier';
    if (normalizedPath.includes('/common/secret_types/')) return 'secret';
    if (normalizedPath.includes('/common/activities/')) return 'activity';
    if (normalizedPath.includes('/common/on_action/')) return 'on_action';
    if (normalizedPath.includes('/common/scripted_effects/')) return 'scripted_effect';
    if (normalizedPath.includes('/common/scripted_triggers/')) return 'scripted_trigger';
    if (normalizedPath.includes('/common/scripted_modifiers/')) return 'scripted_modifier';

    return 'unknown';
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
    fileType: DiagnosticFileType
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

      // Check for ALL block starts on this line: name = { or name ?= {
      // A single line may contain multiple inline blocks like: limit = { scope:actor = { is_ai = yes } }
      // We need to push ALL of them to keep the stack balanced with closing braces
      // The regex captures: (1) identifier, (2) operator (= or ?=)
      // Identifier can include dots, colons for scope paths like faith.religious_head or scope:target
      // Also includes $ for script variables like $CHARACTER$.liege
      const blockStartRegex = /([\w.:$]+)\s*(\?=|=)\s*\{/g;
      const blockStarts = [...cleanLine.matchAll(blockStartRegex)];
      for (const match of blockStarts) {
        const blockName = match[1];
        const operator = match[2]; // '=' or '?='
        let context: 'trigger' | 'effect' | 'weight' | 'unknown' = 'unknown';
        const parentContext = blockStack.length > 0 ? blockStack[blockStack.length - 1].context : 'unknown';

        // For ?= operator, the LHS must be a valid scope (not an effect/trigger)
        // ?= is a null-safe scope changer that only executes if the scope exists
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
          // ?= always establishes a scope change context - inherit from parent
          if (parentContext === 'trigger' || parentContext === 'effect') {
            context = parentContext;
          }
          blockStack.push({ name: blockName, context, parentContext });
          continue; // Skip the rest of the block validation for ?= blocks
        }

        // Determine context based on block name
        if (WEIGHT_BLOCKS.has(blockName) || SCRIPT_VALUE_BLOCKS.has(blockName)) {
          // Weight blocks (ai_will_do, ai_chance, etc.) and script value blocks (chance, add, multiply)
          // establish weight context where math operations are valid
          context = 'weight';
        } else if (TRIGGER_BLOCKS.has(blockName)) {
          context = 'trigger';
        } else if (EFFECT_BLOCKS.has(blockName)) {
          context = 'effect';
        } else {
          // Check for blocks that create trigger context with extra params
          const blockConfig = TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.get(blockName);
          if (blockConfig && (blockConfig.validIn === 'any' || blockConfig.validIn === parentContext)) {
            // This block (e.g., modifier in weight context) creates trigger context inside
            context = 'trigger';
          } else if (parentContext !== 'unknown') {
            // Inherit context from parent if this is a scope changer or iterator
            if (parentContext === 'weight') {
              // Inside weight context, non-special blocks don't change context
              context = 'weight';
            } else if (this.isValidScopeChanger(blockName) || this.isValidIterator(blockName, parentContext as 'trigger' | 'effect')) {
              context = parentContext;
            } else if (parentContext === 'effect' && effectsMap.has(blockName)) {
              context = 'effect';
            } else if (parentContext === 'trigger' && triggersMap.has(blockName)) {
              context = 'trigger';
            }
          }
        }

        // Validate block names that are in a trigger/effect context but don't establish their own context
        // These are potentially unknown effects/triggers with block values (e.g., `adsasd = { }`)
        if (context === 'unknown' && (parentContext === 'trigger' || parentContext === 'effect')) {
          // Get the parent block info for validation
          const parentBlockInfo = blockStack.length > 0 ? blockStack[blockStack.length - 1] : null;
          const parentBlockName = parentBlockInfo?.name || '';

          // Skip validation inside dynamic key blocks
          if (!DYNAMIC_KEY_BLOCKS.has(parentBlockName)) {
            const diagnostic = this.validateFieldInContext(
              blockName,
              parentContext,
              parentBlockName,
              lineNum,
              cleanLine,
              document,
              parentBlockInfo?.parentContext
            );
            if (diagnostic) {
              diagnostics.push(diagnostic);
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

        // Skip validation inside dynamic key blocks (e.g., stress_impact where keys are trait names)
        if (shouldValidate && DYNAMIC_KEY_BLOCKS.has(currentBlock.name)) {
          shouldValidate = false;
        }

        // Only validate if we're in a known context and validation isn't skipped
        if (shouldValidate && currentBlock.context !== 'unknown') {
          const diagnostic = this.validateFieldInContext(
            fieldName,
            currentBlock.context,
            currentBlock.name,
            lineNum,
            cleanLine,
            document,
            currentBlock.parentContext
          );
          if (diagnostic) {
            diagnostics.push(diagnostic);
          }

          // Validate target value for effects that expect specific entity types
          if (currentBlock.context === 'effect') {
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
    parentBlockName: string,
    lineNum: number,
    cleanLine: string,
    document: vscode.TextDocument,
    parentContext?: 'trigger' | 'effect' | 'weight' | 'unknown'
  ): vscode.Diagnostic | null {
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

    // Check if it's a known parameter of the parent block
    const parentEffect = effectsMap.get(parentBlockName);
    const parentTrigger = triggersMap.get(parentBlockName);
    if (parentEffect?.parameters?.includes(fieldName) || parentTrigger?.parameters?.includes(fieldName)) {
      return null;
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

    // Remove quotes if present
    const cleanValue = value.replace(/^["']|["']$/g, '');

    // Skip empty values
    if (!cleanValue) {
      return null;
    }

    // Look up the effect definition
    const effect = effectsMap.get(effectName);
    if (!effect?.supportedTargets) {
      return null;
    }

    // Check if any supportedTargets maps to an entity type we track
    for (const target of effect.supportedTargets) {
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
