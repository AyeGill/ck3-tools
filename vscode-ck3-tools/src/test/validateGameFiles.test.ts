/**
 * Full validation of CK3 game files using the actual diagnostics provider
 * This ensures the validation script tests the exact same code as the extension
 *
 * Run with: npx vitest run src/test/validateGameFiles.test.ts
 *
 * For detailed deduplicated lists of each error type:
 *   DETAILED=1 npx vitest run src/test/validateGameFiles.test.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { describe, it, beforeAll, vi } from 'vitest';

// Mock vscode module - vitest hoists this automatically
const mockDiagnostics: Map<string, any[]> = new Map();

vi.mock('vscode', () => ({
  languages: {
    createDiagnosticCollection: () => ({
      set: (uri: any, diagnostics: any[]) => {
        const key = typeof uri === 'string' ? uri : uri.toString();
        mockDiagnostics.set(key, diagnostics);
      },
      get: (uri: any) => {
        const key = typeof uri === 'string' ? uri : uri.toString();
        return mockDiagnostics.get(key);
      },
      delete: (uri: any) => {
        const key = typeof uri === 'string' ? uri : uri.toString();
        mockDiagnostics.delete(key);
      },
      clear: () => mockDiagnostics.clear(),
      dispose: () => mockDiagnostics.clear(),
    }),
  },
  DiagnosticSeverity: {
    Error: 0,
    Warning: 1,
    Information: 2,
    Hint: 3,
  },
  Diagnostic: class {
    range: any;
    message: string;
    severity: number;
    constructor(range: any, message: string, severity: number = 0) {
      this.range = range;
      this.message = message;
      this.severity = severity;
    }
  },
  Range: class {
    start: any;
    end: any;
    constructor(startOrPosition: any, endOrCharacter?: any, endLine?: number, endChar?: number) {
      if (typeof startOrPosition === 'number') {
        this.start = { line: startOrPosition, character: endOrCharacter };
        this.end = { line: endLine, character: endChar };
      } else {
        this.start = startOrPosition;
        this.end = endOrCharacter;
      }
    }
  },
  Position: class {
    line: number;
    character: number;
    constructor(line: number, character: number) {
      this.line = line;
      this.character = character;
    }
  },
  Uri: {
    file: (filePath: string) => ({ toString: () => `file://${filePath}`, fsPath: filePath }),
  },
  workspace: {
    workspaceFolders: undefined,
    findFiles: async () => [],
    openTextDocument: async () => { throw new Error('Not in VS Code'); },
  },
}));

// Import after mock is set up
import { CK3DiagnosticsProvider } from '../providers/ck3DiagnosticsProvider';
import { CK3WorkspaceIndex } from '../providers/workspaceIndex';

const CK3_GAME_PATH = '/Users/eigil/Library/Application Support/Steam/steamapps/common/Crusader Kings III/game';

interface ValidationError {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: string;
}

/**
 * Create a mock TextDocument
 */
function createMockDocument(content: string, fileName: string): any {
  const lines = content.split('\n');
  return {
    fileName,
    uri: { toString: () => `file://${fileName}`, fsPath: fileName },
    languageId: 'ck3',
    lineCount: lines.length,
    getText: () => content,
    lineAt: (line: number) => ({
      text: lines[line] || '',
      lineNumber: line,
    }),
    positionAt: (offset: number) => {
      let remaining = offset;
      for (let line = 0; line < lines.length; line++) {
        const lineLength = lines[line].length + 1;
        if (remaining < lineLength) {
          return { line, character: remaining };
        }
        remaining -= lineLength;
      }
      return { line: lines.length - 1, character: lines[lines.length - 1]?.length || 0 };
    },
  };
}

/**
 * Recursively find all .txt files
 */
function findTxtFiles(dir: string): string[] {
  const files: string[] = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...findTxtFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.txt')) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Skip directories we can't read
  }

  return files;
}

describe('CK3 Game File Validation', () => {
  let provider: CK3DiagnosticsProvider;
  let workspaceIndex: CK3WorkspaceIndex;
  let allFiles: string[] = [];

  beforeAll(async () => {
    // Create and populate the workspace index with game files
    workspaceIndex = new CK3WorkspaceIndex();

    // Index game files (scripted_effects, scripted_triggers, etc.)
    // This path is the parent of 'game' folder
    const ck3BasePath = path.dirname(CK3_GAME_PATH);
    await workspaceIndex.indexGameFiles(ck3BasePath);

    console.log(`Workspace index populated:`);
    console.log(`  - Scripted effects: ${workspaceIndex.getCount('scripted_effect')}`);
    console.log(`  - Scripted triggers: ${workspaceIndex.getCount('scripted_trigger')}`);
    console.log(`  - Script values: ${workspaceIndex.getCount('script_value')}`);
    console.log(`  - Traits: ${workspaceIndex.getCount('trait')}`);
    console.log(`  - Events: ${workspaceIndex.getCount('event')}`);
    console.log(`  - Total: ${workspaceIndex.getTotalCount()}`);

    // Create provider with the populated index
    provider = new CK3DiagnosticsProvider(workspaceIndex);

    // Find all relevant directories
    const dirs = [
      path.join(CK3_GAME_PATH, 'common'),
      path.join(CK3_GAME_PATH, 'events'),
    ];

    for (const dir of dirs) {
      if (fs.existsSync(dir)) {
        allFiles.push(...findTxtFiles(dir));
      }
    }

    console.log(`Found ${allFiles.length} .txt files to validate\n`);
  });

  it('validates all game files and reports diagnostics', () => {
    const DETAILED = process.env.DETAILED === '1';

    const allErrors: ValidationError[] = [];
    const errorsByType: Record<string, number> = {};
    const errorsByField: Record<string, number> = {};
    const severityNames = ['Error', 'Warning', 'Information', 'Hint'];

    // For detailed mode: track unique values per category
    const uniqueUnknownFields = new Set<string>();
    const uniqueUnknownEffects = new Set<string>();
    const uniqueUnknownTriggers = new Set<string>();
    const uniqueInvalidEnumValues: Record<string, Set<string>> = {}; // field -> values
    const uniqueTypeMismatches: Record<string, Set<string>> = {}; // field -> values
    // Track invalid ?= usages with examples: scope name -> array of {file, line, lineText}
    const invalidScopeExamples: Map<string, Array<{ file: string; line: number; lineText: string }>> = new Map();

    // Track unknown fields by schema type: schema -> Set<fieldName>
    const unknownFieldsBySchema: Map<string, Set<string>> = new Map();

    // Track examples of specific unknown effects (for debugging)
    const TRACK_EFFECT = process.env.TRACK_EFFECT || '';
    const trackedEffectExamples: Array<{ file: string; line: number; lineText: string }> = [];

    // Track parent->child pairs for unknown effects (to find missing parameters)
    const unknownEffectInParent: Map<string, Set<string>> = new Map(); // parent -> set of unknown children
    const unknownTriggerInParent: Map<string, Set<string>> = new Map(); // parent -> set of unknown children

    // Known false positives to skip - iterators and effects used with ?= in game files
    // These appear in official game files but are likely typos or edge cases we don't understand yet
    const SKIP_INVALID_SCOPE_USAGES = new Set([
      // Iterators used with ?= (likely typos in game files)
      'any_attending_character', 'any_character_artifact', 'any_child', 'any_court_position_holder',
      'any_courtier_or_guest', 'any_diarchy_succession_character', 'any_maa_regiment',
      'any_neighboring_top_suzerain_realm_owner', 'any_parent', 'any_pool_character',
      'any_secret', 'any_spouse', 'any_sub_realm_county',
      'every_child', 'every_neighboring_county', 'every_relation', 'every_vassal_or_below',
      'random_attending_character', 'random_claim', 'random_county_situation',
      'random_court_position_holder', 'random_courtier', 'random_courtier_or_guest',
      'random_knight', 'random_memory', 'random_pool_character', 'random_spouse',
      'random_sub_realm_county',
      // Effects used with ?= (unclear semantics)
      'remove_character_flag', 'remove_variable', 'tgp_join_house_bloc_effect',
    ]);

    // Helper to check if a diagnostic should be skipped
    function shouldSkipDiagnostic(msg: string): boolean {
      if (msg.startsWith('Invalid ?= usage:')) {
        const match = msg.match(/Invalid \?= usage: "([^"]+)"/);
        if (match && SKIP_INVALID_SCOPE_USAGES.has(match[1])) {
          return true;
        }
      }
      return false;
    }

    // Track which file types are validated
    const fileTypeCount: Record<string, number> = {};
    const validatedTypes = new Set([
      'trait', 'event', 'decision', 'interaction', 'building',
      'artifact', 'scheme', 'opinion_modifier', 'nickname',
      'modifier', 'secret', 'activity', 'on_action',
      'scripted_effect', 'scripted_trigger', 'scripted_modifier',
    ]);

    function getFileType(filePath: string): string {
      const p = filePath.replace(/\\/g, '/');
      if (p.includes('/common/traits/')) return 'trait';
      if (p.includes('/events/')) return 'event';
      if (p.includes('/common/decisions/')) return 'decision';
      if (p.includes('/common/character_interactions/')) return 'interaction';
      if (p.includes('/common/buildings/')) return 'building';
      if (p.includes('/common/artifacts/')) return 'artifact';
      if (p.includes('/common/schemes/')) return 'scheme';
      if (p.includes('/common/opinion_modifiers/')) return 'opinion_modifier';
      if (p.includes('/common/nicknames/')) return 'nickname';
      if (p.includes('/common/modifiers/')) return 'modifier';
      if (p.includes('/common/secret_types/')) return 'secret';
      if (p.includes('/common/activities/')) return 'activity';
      if (p.includes('/common/on_action/')) return 'on_action';
      if (p.includes('/common/scripted_effects/')) return 'scripted_effect';
      if (p.includes('/common/scripted_triggers/')) return 'scripted_trigger';
      if (p.includes('/common/scripted_modifiers/')) return 'scripted_modifier';
      return 'unknown';
    }

    for (const file of allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const doc = createMockDocument(content, file);

        // Track file type
        const fileType = getFileType(file);
        fileTypeCount[fileType] = (fileTypeCount[fileType] || 0) + 1;

        // Validate the document
        provider.validateDocument(doc);

        // Get the diagnostics from the provider's collection directly
        const collection = provider.getDiagnosticCollection();
        const diagnostics = (collection as any).get(doc.uri) || [];

        for (const diag of diagnostics) {
          // Skip known false positives
          if (shouldSkipDiagnostic(diag.message)) {
            continue;
          }

          const error: ValidationError = {
            file,
            line: diag.range.start.line + 1,
            column: diag.range.start.character + 1,
            message: diag.message,
            severity: severityNames[diag.severity] || 'Unknown',
          };
          allErrors.push(error);

          // Count by message type (first part of message)
          const msgType = diag.message.split(':')[0];
          errorsByType[msgType] = (errorsByType[msgType] || 0) + 1;

          // Extract field name from message
          const fieldMatch = diag.message.match(/"([^"]+)"/);
          if (fieldMatch) {
            const field = fieldMatch[1];
            errorsByField[field] = (errorsByField[field] || 0) + 1;
          }

          // For detailed mode: categorize unique values
          if (DETAILED) {
            const msg = diag.message;
            if (msg.startsWith('Unknown field:')) {
              const match = msg.match(/Unknown field: "([^"]+)"/);
              if (match) {
                uniqueUnknownFields.add(match[1]);
                // Track by schema type
                if (!unknownFieldsBySchema.has(fileType)) {
                  unknownFieldsBySchema.set(fileType, new Set());
                }
                unknownFieldsBySchema.get(fileType)!.add(match[1]);
              }
            } else if (msg.startsWith('Unknown effect:')) {
              const match = msg.match(/Unknown effect: "([^"]+)" in "([^"]+)"/);
              if (match) {
                const [, fieldName, parentBlock] = match;
                uniqueUnknownEffects.add(fieldName);
                // Track parent->child pairs
                if (!unknownEffectInParent.has(parentBlock)) {
                  unknownEffectInParent.set(parentBlock, new Set());
                }
                unknownEffectInParent.get(parentBlock)!.add(fieldName);
                // Track examples for specific effect
                if (TRACK_EFFECT && fieldName === TRACK_EFFECT && trackedEffectExamples.length < 10) {
                  const lines = content.split('\n');
                  trackedEffectExamples.push({
                    file: path.relative(CK3_GAME_PATH, file),
                    line: diag.range.start.line + 1,
                    lineText: lines[diag.range.start.line] || '',
                  });
                }
              }
            } else if (msg.startsWith('Unknown trigger:')) {
              const match = msg.match(/Unknown trigger: "([^"]+)" in "([^"]+)"/);
              if (match) {
                const [, fieldName, parentBlock] = match;
                uniqueUnknownTriggers.add(fieldName);
                // Track parent->child pairs for triggers
                if (!unknownTriggerInParent.has(parentBlock)) {
                  unknownTriggerInParent.set(parentBlock, new Set());
                }
                unknownTriggerInParent.get(parentBlock)!.add(fieldName);
              }
            } else if (msg.startsWith('Invalid value for')) {
              const match = msg.match(/Invalid value for "([^"]+)": "([^"]+)"/);
              if (match) {
                const [, field, value] = match;
                if (!uniqueInvalidEnumValues[field]) uniqueInvalidEnumValues[field] = new Set();
                uniqueInvalidEnumValues[field].add(value);
              }
            } else if (msg.includes('expects')) {
              // Type mismatch: "field" expects X, got "value"
              const match = msg.match(/"([^"]+)" expects .+, got "([^"]+)"/);
              if (match) {
                const [, field, value] = match;
                if (!uniqueTypeMismatches[field]) uniqueTypeMismatches[field] = new Set();
                uniqueTypeMismatches[field].add(value);
              }
            } else if (msg.startsWith('Invalid ?= usage:')) {
              // Extract the scope name from the message
              const match = msg.match(/Invalid \?= usage: "([^"]+)"/);
              if (match) {
                const scopeName = match[1];
                if (!invalidScopeExamples.has(scopeName)) {
                  invalidScopeExamples.set(scopeName, []);
                }
                const examples = invalidScopeExamples.get(scopeName)!;
                // Keep up to 3 examples per scope name
                if (examples.length < 3) {
                  const lines = content.split('\n');
                  examples.push({
                    file: path.relative(CK3_GAME_PATH, file),
                    line: diag.range.start.line + 1,
                    lineText: lines[diag.range.start.line] || '',
                  });
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error reading ${file}: ${err}`);
      }
    }

    console.log('============================================================');
    console.log('Summary');
    console.log('============================================================');
    console.log(`Total files found: ${allFiles.length}`);

    // Show files by type
    const validatedCount = Object.entries(fileTypeCount)
      .filter(([type]) => validatedTypes.has(type))
      .reduce((sum, [, count]) => sum + count, 0);
    const skippedCount = fileTypeCount['unknown'] || 0;

    console.log(`Files validated: ${validatedCount}`);
    console.log(`Files skipped (unknown type): ${skippedCount}`);

    console.log('\nBy file type:');
    for (const [type, count] of Object.entries(fileTypeCount).sort((a, b) => b[1] - a[1])) {
      const marker = validatedTypes.has(type) ? '✓' : '○';
      console.log(`  ${marker} ${type}: ${count}`);
    }

    console.log(`\nTotal diagnostics: ${allErrors.length}`);

    // Count by severity
    const bySeverity: Record<string, number> = {};
    for (const err of allErrors) {
      bySeverity[err.severity] = (bySeverity[err.severity] || 0) + 1;
    }
    if (Object.keys(bySeverity).length > 0) {
      console.log('\nBy severity:');
      for (const [sev, count] of Object.entries(bySeverity).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${sev}: ${count}`);
      }
    }

    if (Object.keys(errorsByType).length > 0) {
      console.log('\nBy message type:');
      for (const [type, count] of Object.entries(errorsByType).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${type}: ${count}`);
      }
    }

    // Show top unknown fields
    const sortedFields = Object.entries(errorsByField)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);

    if (sortedFields.length > 0) {
      console.log('\nTop 50 flagged identifiers:');
      for (const [field, count] of sortedFields) {
        console.log(`  ${field}: ${count}`);
      }
    }

    // Show sample errors
    console.log('\n============================================================');
    console.log('Sample diagnostics (first 30):');
    console.log('============================================================');
    for (const err of allErrors.slice(0, 30)) {
      const relPath = path.relative(CK3_GAME_PATH, err.file);
      console.log(`[${err.severity}] ${relPath}:${err.line}: ${err.message}`);
    }

    if (allErrors.length === 0) {
      console.log('\n✅ All game files pass validation!');
    } else {
      console.log(`\n⚠️  Found ${allErrors.length} diagnostics to investigate`);
    }

    // Detailed mode: output deduplicated lists
    if (DETAILED) {
      console.log('\n============================================================');
      console.log('DETAILED: Deduplicated Error Lists');
      console.log('============================================================');

      if (uniqueUnknownFields.size > 0) {
        console.log(`\n--- Unknown Fields (${uniqueUnknownFields.size} unique) ---`);
        for (const field of [...uniqueUnknownFields].sort()) {
          console.log(field);
        }
      }

      if (uniqueUnknownEffects.size > 0) {
        console.log(`\n--- Unknown Effects (${uniqueUnknownEffects.size} unique) ---`);
        for (const effect of [...uniqueUnknownEffects].sort()) {
          console.log(effect);
        }
      }

      if (uniqueUnknownTriggers.size > 0) {
        console.log(`\n--- Unknown Triggers (${uniqueUnknownTriggers.size} unique) ---`);
        for (const trigger of [...uniqueUnknownTriggers].sort()) {
          console.log(trigger);
        }
      }

      for (const [field, values] of Object.entries(uniqueInvalidEnumValues).sort()) {
        console.log(`\n--- Invalid values for "${field}" (${values.size} unique) ---`);
        for (const value of [...values].sort()) {
          console.log(value);
        }
      }

      for (const [field, values] of Object.entries(uniqueTypeMismatches).sort()) {
        console.log(`\n--- Type mismatches for "${field}" (${values.size} unique) ---`);
        for (const value of [...values].sort()) {
          console.log(value);
        }
      }

      if (invalidScopeExamples.size > 0) {
        console.log(`\n--- Invalid ?= Usages (${invalidScopeExamples.size} unique scope names) ---`);
        for (const [scope, examples] of [...invalidScopeExamples.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
          console.log(`\n${scope}:`);
          for (const ex of examples) {
            console.log(`  ${ex.file}:${ex.line}`);
            console.log(`    ${ex.lineText.trim()}`);
          }
        }
      }

      // Output unknown effects by parent block (for finding missing parameters)
      if (unknownEffectInParent.size > 0) {
        console.log(`\n--- Unknown Effects by Parent Block (${unknownEffectInParent.size} parents) ---`);
        // Sort by number of unknown children (most first)
        const sorted = [...unknownEffectInParent.entries()].sort((a, b) => b[1].size - a[1].size);
        for (const [parent, children] of sorted.slice(0, 50)) {
          console.log(`'${parent}': [${[...children].map(c => `'${c}'`).join(', ')}],`);
        }
      }

      // Output unknown triggers by parent block (for finding missing parameters)
      if (unknownTriggerInParent.size > 0) {
        console.log(`\n--- Unknown Triggers by Parent Block (${unknownTriggerInParent.size} parents) ---`);
        // Sort by number of unknown children (most first)
        const sortedTriggers = [...unknownTriggerInParent.entries()].sort((a, b) => b[1].size - a[1].size);
        for (const [parent, children] of sortedTriggers.slice(0, 50)) {
          console.log(`'${parent}': [${[...children].map(c => `'${c}'`).join(', ')}],`);
        }
      }

      // Output tracked effect examples
      if (TRACK_EFFECT && trackedEffectExamples.length > 0) {
        console.log(`\n--- Examples of Unknown Effect "${TRACK_EFFECT}" ---`);
        for (const ex of trackedEffectExamples) {
          console.log(`${ex.file}:${ex.line}`);
          console.log(`  ${ex.lineText.trim()}`);
        }
      }

      // Output unknown fields grouped by schema - this can be used to generate schema additions
      if (unknownFieldsBySchema.size > 0) {
        console.log(`\n============================================================`);
        console.log(`Unknown Fields by Schema (for schema generation)`);
        console.log(`============================================================`);
        // Sort schemas by number of unknown fields
        const sortedSchemas = [...unknownFieldsBySchema.entries()].sort((a, b) => b[1].size - a[1].size);
        for (const [schema, fields] of sortedSchemas) {
          const sortedFields = [...fields].sort();
          console.log(`\n--- ${schema}Schema (${sortedFields.length} unknown fields) ---`);
          // Output as a TypeScript-friendly format for easy copy-paste
          for (const field of sortedFields) {
            console.log(`  '${field}',`);
          }
        }
      }
    }

    // Cleanup
    provider.dispose();

    // Note: We don't assert zero errors because we expect some false positives
    // This test is for gathering diagnostic data, not enforcing zero errors
  });
});
