import * as vscode from 'vscode';
import { FieldSchema } from '../schemas/traitSchema';

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

/**
 * Supported file types for diagnostics
 */
type DiagnosticFileType =
  | 'trait' | 'event' | 'decision' | 'interaction' | 'building'
  | 'artifact' | 'scheme' | 'opinion_modifier' | 'nickname'
  | 'modifier' | 'secret' | 'activity' | 'unknown';

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
      const invalidFields = this.checkInvalidFields(entity, schemaInfo.schemaMap, fileType);
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
      if (braceDepth === 0 && openBraces > 0) {
        const match = cleanLine.match(/^\s*(\w+)\s*=\s*\{/);
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

    for (const [fieldName, field] of entity.fields) {
      // Skip common fields that are valid across many contexts
      if (this.isCommonField(fieldName)) {
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
