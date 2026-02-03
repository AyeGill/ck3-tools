/**
 * Validate CK3 game files with the syntax checker
 * This helps ensure our syntax validation is permissive enough
 * to not flag valid game code as errors.
 */

import * as fs from 'fs';
import * as path from 'path';

const CK3_GAME_PATH = '/Users/eigil/Library/Application Support/Steam/steamapps/common/Crusader Kings III/game';

interface SyntaxError {
  file: string;
  line: number;
  column: number;
  message: string;
}

/**
 * Validate syntax of a single file
 */
function validateSyntax(filePath: string, content: string): SyntaxError[] {
  const errors: SyntaxError[] = [];
  const lines = content.split('\n');

  // Track brace matching
  const braceStack: Array<{ line: number; column: number }> = [];

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
          errors.push({
            file: filePath,
            line: lineNum + 1,
            column: eqPos + 1,
            message: 'Incomplete assignment: expected value after "="'
          });
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
          errors.push({
            file: filePath,
            line: lineNum + 1,
            column: col + 1,
            message: 'Unmatched closing brace "}"'
          });
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
        errors.push({
          file: filePath,
          line: lineNum + 1,
          column: codePart.indexOf('=') + 1,
          message: 'Missing field name before "="'
        });
      }
    }
  }

  // Check for unmatched opening braces at end of file
  for (const brace of braceStack) {
    errors.push({
      file: filePath,
      line: brace.line + 1,
      column: brace.column + 1,
      message: 'Unmatched opening brace "{"'
    });
  }

  return errors;
}

/**
 * Recursively find all .txt files in a directory
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

async function main() {
  console.log('CK3 Game File Syntax Validator');
  console.log('==============================\n');

  const commonDir = path.join(CK3_GAME_PATH, 'common');
  const eventsDir = path.join(CK3_GAME_PATH, 'events');

  const allFiles = [
    ...findTxtFiles(commonDir),
    ...findTxtFiles(eventsDir),
  ];

  console.log(`Found ${allFiles.length} .txt files to validate\n`);

  let totalErrors = 0;
  const errorsByType: Record<string, number> = {};
  const filesWithErrors: string[] = [];

  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const errors = validateSyntax(file, content);

      if (errors.length > 0) {
        totalErrors += errors.length;
        filesWithErrors.push(file);

        for (const err of errors) {
          const shortMsg = err.message.split(':')[0];
          errorsByType[shortMsg] = (errorsByType[shortMsg] || 0) + 1;
        }

        // Print first few errors for each file
        if (errors.length <= 3) {
          for (const err of errors) {
            const relPath = path.relative(CK3_GAME_PATH, err.file);
            console.log(`${relPath}:${err.line}:${err.column}: ${err.message}`);
          }
        } else {
          const relPath = path.relative(CK3_GAME_PATH, file);
          console.log(`${relPath}: ${errors.length} errors`);
          for (const err of errors.slice(0, 2)) {
            console.log(`  Line ${err.line}: ${err.message}`);
          }
          console.log(`  ... and ${errors.length - 2} more`);
        }
      }
    } catch (err) {
      console.error(`Error reading ${file}: ${err}`);
    }
  }

  console.log('\n==============================');
  console.log('Summary');
  console.log('==============================');
  console.log(`Total files checked: ${allFiles.length}`);
  console.log(`Files with errors: ${filesWithErrors.length}`);
  console.log(`Total errors: ${totalErrors}`);

  if (Object.keys(errorsByType).length > 0) {
    console.log('\nErrors by type:');
    for (const [type, count] of Object.entries(errorsByType).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${type}: ${count}`);
    }
  }

  if (totalErrors === 0) {
    console.log('\n✅ All game files pass syntax validation!');
  } else {
    console.log('\n⚠️  Some game files have syntax issues - may need to adjust validation rules');
  }
}

main().catch(console.error);
