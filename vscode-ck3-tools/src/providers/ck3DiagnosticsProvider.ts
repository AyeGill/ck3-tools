import * as vscode from 'vscode';
import { FieldSchema } from '../schemas/traitSchema';
import { effectsMap, triggersMap } from '../data';

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
 * Schema registry mapping file types to their schemas
 */
/**
 * Block names that establish trigger context
 */
const TRIGGER_BLOCKS = new Set([
  'trigger', 'is_shown', 'is_valid', 'is_valid_showing_failures_only',
  'ai_potential', 'ai_will_do', 'can_be_picked', 'can_pick',
  'is_highlighted', 'auto_accept', 'can_send', 'can_be_picked_artifact',
  'limit', // limit inside effects contains triggers
]);

/**
 * Block names that establish effect context
 */
const EFFECT_BLOCKS = new Set([
  'immediate', 'effect', 'after', 'on_accept', 'on_decline',
  'on_send', 'on_auto_accept', 'option', 'hidden_effect',
  'on_use', 'on_expire', 'on_invalidated',
  'on_discover', 'on_expose',
  'on_start', 'on_end', 'on_monthly', 'on_yearly',
]);

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
]);

/**
 * Scope-changing effects/triggers (valid in most contexts)
 */
const SCOPE_CHANGERS = new Set([
  'root', 'prev', 'this', 'from',
  'liege', 'top_liege', 'host', 'employer',
  'father', 'mother', 'primary_spouse', 'betrothed',
  'primary_heir', 'player_heir', 'designated_heir',
  'dynasty', 'house', 'faith', 'culture', 'religion',
  'capital_province', 'capital_county', 'primary_title',
  'location', 'home_court',
  // Iterator prefixes - these will be checked specially
]);

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
]);

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

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('ck3');
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
    const nameCollisions = this.checkNameCollisions(entities);
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

    for (const [fieldName, field] of entity.fields) {
      // Skip common fields that are valid across many contexts
      if (this.isCommonField(fieldName)) {
        continue;
      }

      // If schema has trigger wildcard, accept any valid trigger
      if (hasTriggerWildcard && triggersMap.has(fieldName)) {
        continue;
      }

      // If schema has effect wildcard, accept any valid effect
      if (hasEffectWildcard && effectsMap.has(fieldName)) {
        continue;
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
            mismatches.push({
              line: field.line,
              message: `"${fieldName}" expects an integer, got "${value}"`
            });
          } else {
            // Check min/max if defined
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
            mismatches.push({
              line: field.line,
              message: `"${fieldName}" expects a number, got "${value}"`
            });
          }
          break;
      }
    }

    return mismatches;
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

    // Track context as we parse
    const blockStack: Array<{ name: string; context: 'trigger' | 'effect' | 'unknown' }> = [];
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

      // Check for ALL block starts on this line: name = {
      // A single line may contain multiple inline blocks like: limit = { scope:actor = { is_ai = yes } }
      // We need to push ALL of them to keep the stack balanced with closing braces
      const blockStartRegex = /(\S+)\s*=\s*\{/g;
      const blockStarts = [...cleanLine.matchAll(blockStartRegex)];
      for (const match of blockStarts) {
        const blockName = match[1];
        let context: 'trigger' | 'effect' | 'unknown' = 'unknown';

        // Determine context based on block name
        if (TRIGGER_BLOCKS.has(blockName)) {
          context = 'trigger';
        } else if (EFFECT_BLOCKS.has(blockName)) {
          context = 'effect';
        } else if (blockStack.length > 0) {
          // Inherit context from parent if this is a scope changer or iterator
          const parentContext = blockStack[blockStack.length - 1].context;
          if (parentContext !== 'unknown') {
            // Check if this is a valid scope changer or iterator
            if (this.isValidScopeChanger(blockName) || this.isValidIterator(blockName, parentContext)) {
              context = parentContext;
            } else if (parentContext === 'effect' && effectsMap.has(blockName)) {
              context = 'effect';
            } else if (parentContext === 'trigger' && triggersMap.has(blockName)) {
              context = 'trigger';
            }
          }
        }

        blockStack.push({ name: blockName, context });
      }

      // Check for simple field: name = value (no opening brace)
      const fieldMatch = cleanLine.match(/^\s*(\S+)\s*=\s*([^{].*)$/);
      if (fieldMatch && blockStack.length > 0) {
        const fieldName = fieldMatch[1];
        const currentBlock = blockStack[blockStack.length - 1];

        // Skip validation inside dynamic key blocks (e.g., stress_impact where keys are trait names)
        if (DYNAMIC_KEY_BLOCKS.has(currentBlock.name)) {
          continue;
        }

        // Only validate if we're in a known context
        if (currentBlock.context !== 'unknown') {
          const diagnostic = this.validateFieldInContext(
            fieldName,
            currentBlock.context,
            currentBlock.name,
            lineNum,
            cleanLine,
            document
          );
          if (diagnostic) {
            diagnostics.push(diagnostic);
          }
        }
      }

      // Note: We don't validate block names (like `immediate`, `if`, `liege`) here.
      // Block names that establish context are schema fields (validated by schema validation).
      // Block names that are scope changers or control flow are handled by context inheritance.

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
   * Check if a field name is a valid scope changer
   */
  private isValidScopeChanger(name: string): boolean {
    if (SCOPE_CHANGERS.has(name)) {
      return true;
    }
    // Check for scope: prefix
    if (name.startsWith('scope:')) {
      return true;
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
   * Validate a field in a specific context (trigger or effect)
   */
  private validateFieldInContext(
    fieldName: string,
    context: 'trigger' | 'effect',
    parentBlockName: string,
    lineNum: number,
    cleanLine: string,
    document: vscode.TextDocument
  ): vscode.Diagnostic | null {
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

    // Check if it's a valid effect/trigger for the context
    if (context === 'effect') {
      if (!effectsMap.has(fieldName) && !triggersMap.has(fieldName)) {
        // Could be a scripted effect - those start with various prefixes
        // Be lenient: only flag if it doesn't look like a scripted effect
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
      if (!triggersMap.has(fieldName) && !effectsMap.has(fieldName)) {
        // Could be a scripted trigger
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
