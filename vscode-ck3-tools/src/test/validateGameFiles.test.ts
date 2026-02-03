/**
 * Full validation of CK3 game files using the actual diagnostics provider
 * This ensures the validation script tests the exact same code as the extension
 *
 * Run with: npx vitest run src/test/validateGameFiles.test.ts
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
}));

// Import after mock is set up
import { CK3DiagnosticsProvider } from '../providers/ck3DiagnosticsProvider';

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
  let allFiles: string[] = [];

  beforeAll(() => {
    provider = new CK3DiagnosticsProvider();

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
    const allErrors: ValidationError[] = [];
    const errorsByType: Record<string, number> = {};
    const errorsByField: Record<string, number> = {};
    const severityNames = ['Error', 'Warning', 'Information', 'Hint'];

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

        // Clear previous diagnostics
        mockDiagnostics.clear();

        // Validate the document
        provider.validateDocument(doc);

        // Get the diagnostics
        const diagnostics = mockDiagnostics.get(doc.uri.toString()) || [];

        for (const diag of diagnostics) {
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

    // Cleanup
    provider.dispose();

    // Note: We don't assert zero errors because we expect some false positives
    // This test is for gathering diagnostic data, not enforcing zero errors
  });
});
