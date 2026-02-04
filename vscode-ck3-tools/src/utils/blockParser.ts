/**
 * Unified block parsing utilities for CK3 script analysis
 *
 * This module consolidates the block parsing logic that was previously
 * duplicated across CompletionProvider, DiagnosticsProvider, and HoverProvider.
 *
 * Key features:
 * - Handles all CK3 operators: =, ?=, >, <, >=, <=
 * - Supports dots in identifiers (faith.religious_head)
 * - Supports script variables ($CHARACTER$)
 * - Supports scope prefixes (scope:actor, var:my_var)
 * - Correctly handles multiple inline blocks on one line
 * - Tracks both context type (trigger/effect/weight) and scope type (character/province/etc.)
 */

import {
  TRIGGER_BLOCKS,
  EFFECT_BLOCKS,
  WEIGHT_BLOCKS,
  TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS,
  BlockContext,
  isScopeReference,
  analyzeBlockContext,
} from './scopeContext';
import { ScopeType } from '../data/scopes';

/**
 * Information about a single block in the stack
 */
export interface BlockInfo {
  /** The block name (e.g., 'trigger', 'any_vassal', 'scope:actor') */
  name: string;
  /** The operator used to open this block ('=', '?=', '>', '<', '>=', '<=') */
  operator: string;
  /** The context type inside this block */
  context: 'trigger' | 'effect' | 'weight' | 'unknown';
  /** The parent's context type (for inheriting context) */
  parentContext?: 'trigger' | 'effect' | 'weight' | 'unknown';
}

/**
 * Result of parsing block context up to a position
 */
export interface ParsedBlockContext {
  /** Current brace nesting depth (0 = top level) */
  depth: number;
  /** Array of block names from outermost to innermost (excluding top-level entity) */
  blockPath: string[];
  /** Full block stack with context information */
  blockStack: BlockInfo[];
  /** Current context type at the parse position */
  currentContext: 'trigger' | 'effect' | 'weight' | 'unknown';
  /** Current scope type at the parse position */
  currentScope: ScopeType;
}

/**
 * Script value blocks that establish weight/math context
 * Inside these blocks, math operations like value, add, multiply are valid
 */
export const SCRIPT_VALUE_BLOCKS = new Set([
  'chance',                             // parameter of random effect
  'add', 'subtract', 'multiply', 'divide',  // math operation blocks
  'min', 'max',                         // bounds blocks
  'factor', 'value',                    // multiplier/value blocks
  'compare_modifier',                   // comparison with modifiers
  'compatibility_modifier',             // compatibility calculations
]);

/**
 * Regex pattern string for matching block starts
 * Matches: identifier = {, identifier ?= {, identifier > {, etc.
 *
 * Supports:
 * - Simple identifiers: trigger, immediate
 * - Prefix:identifier: scope:actor, var:my_var
 * - Dots: faith.religious_head
 * - Script variables: $CHARACTER$
 * - All operators: =, ?=, >, <, >=, <=
 *
 * Note: Create your own RegExp with 'g' flag when using matchAll
 */
export const BLOCK_START_PATTERN = /([\w.:$]+)\s*(\?=|>=|<=|=|>|<)\s*\{/;

// Internal regex with global flag for use in parseBlockContext
const BLOCK_START_REGEX = new RegExp(BLOCK_START_PATTERN.source, 'g');

/**
 * Parse block context from a document up to a given position.
 *
 * This is the main entry point for completion and hover providers.
 *
 * @param getText Function to get text of a line (e.g., document.lineAt(i).text)
 * @param lineCount Total number of lines in the document
 * @param targetLine The line number to parse up to (0-indexed)
 * @param targetChar The character position on the target line to parse up to
 * @param initialScope The starting scope type (default: 'character')
 * @returns Parsed block context information
 */
export function parseBlockContext(
  getText: (line: number) => string,
  lineCount: number,
  targetLine: number,
  targetChar: number,
  initialScope: ScopeType = 'character'
): ParsedBlockContext {
  const blockStack: BlockInfo[] = [];
  let depth = 0;

  for (let lineNum = 0; lineNum <= Math.min(targetLine, lineCount - 1); lineNum++) {
    const line = getText(lineNum);
    const endChar = lineNum === targetLine ? targetChar : line.length;

    // Remove comments before processing
    const commentIdx = line.indexOf('#');
    const cleanLine = commentIdx >= 0 && commentIdx < endChar
      ? line.substring(0, commentIdx)
      : line.substring(0, endChar);

    // Find all block starts on this line with their positions
    const blockStarts: { name: string; operator: string; bracePos: number }[] = [];
    BLOCK_START_REGEX.lastIndex = 0;
    let match;
    while ((match = BLOCK_START_REGEX.exec(cleanLine)) !== null) {
      const bracePos = match.index + match[0].length - 1;
      if (bracePos < endChar) {
        blockStarts.push({
          name: match[1],
          operator: match[2],
          bracePos,
        });
      }
    }

    // Process character by character to track brace depth
    let blockStartIdx = 0;
    for (let charPos = 0; charPos < endChar; charPos++) {
      const char = cleanLine[charPos];

      if (char === '{') {
        depth++;

        // Check if this brace has an associated block start
        if (blockStartIdx < blockStarts.length && blockStarts[blockStartIdx].bracePos === charPos) {
          const blockStart = blockStarts[blockStartIdx];
          const parentContext = blockStack.length > 0
            ? blockStack[blockStack.length - 1].context
            : 'unknown';

          const context = determineBlockContext(
            blockStart.name,
            blockStart.operator,
            parentContext
          );

          // Only add to stack if depth > 1 (exclude top-level entity)
          if (depth > 1) {
            blockStack.push({
              name: blockStart.name,
              operator: blockStart.operator,
              context,
              parentContext,
            });
          }

          blockStartIdx++;
        }
      } else if (char === '}') {
        depth--;
        // Pop from stack when closing a block (but not the top-level entity)
        if (blockStack.length > 0 && depth >= 1) {
          blockStack.pop();
        }
      }
    }
  }

  // Build blockPath from blockStack
  const blockPath = blockStack.map(b => b.name);

  // Determine current context and scope using the shared analyzeBlockContext
  const blockContext = analyzeBlockContext(blockPath, initialScope);

  // Override context if we have more specific info from our stack
  let currentContext = blockContext.type;
  if (blockStack.length > 0) {
    currentContext = blockStack[blockStack.length - 1].context;
  }

  return {
    depth,
    blockPath,
    blockStack,
    currentContext,
    currentScope: blockContext.scope,
  };
}

/**
 * Determine the context type for a block based on its name and operator.
 *
 * This is the core logic for determining whether a block establishes
 * trigger, effect, or weight context. Used by all providers.
 *
 * @param blockName The name of the block
 * @param operator The operator used ('=', '?=', '>', etc.)
 * @param parentContext The parent block's context
 * @returns The context type for this block
 */
export function determineBlockContext(
  blockName: string,
  operator: string,
  parentContext: 'trigger' | 'effect' | 'weight' | 'unknown'
): 'trigger' | 'effect' | 'weight' | 'unknown' {
  // Comparison operators (>, <, >=, <=) create weight/script value context
  if (operator === '>' || operator === '<' || operator === '>=' || operator === '<=') {
    return 'weight';
  }

  // ?= is a null-safe scope changer - inherit parent context
  if (operator === '?=') {
    return parentContext === 'trigger' || parentContext === 'effect' ? parentContext : 'unknown';
  }

  // Check for blocks that establish specific contexts
  if (WEIGHT_BLOCKS.has(blockName) || SCRIPT_VALUE_BLOCKS.has(blockName)) {
    return 'weight';
  }

  if (TRIGGER_BLOCKS.has(blockName)) {
    return 'trigger';
  }

  if (EFFECT_BLOCKS.has(blockName)) {
    return 'effect';
  }

  // Check for blocks that create trigger context with extra params
  const blockConfig = TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.get(blockName);
  if (blockConfig && (blockConfig.validIn === 'any' || blockConfig.validIn === parentContext)) {
    return 'trigger';
  }

  // Scope references (scope:X) inherit parent context
  if (isScopeReference(blockName)) {
    return parentContext;
  }

  // Default: inherit from parent
  if (parentContext !== 'unknown') {
    return parentContext;
  }

  return 'unknown';
}

/**
 * Get just the immediate parent block name by scanning backwards from position.
 *
 * This is optimized for hover provider which only needs the immediate parent.
 *
 * @param getText Function to get text of a line
 * @param targetLine The line number to start scanning from
 * @param targetChar The character position on the target line
 * @returns The immediate parent block name, or null if not found
 */
export function getImmediateParentBlock(
  getText: (line: number) => string,
  targetLine: number,
  targetChar: number
): string | null {
  let braceDepth = 0;

  for (let lineNum = targetLine; lineNum >= 0; lineNum--) {
    const lineText = getText(lineNum);

    // On the target line, only look at text before the cursor
    const textToCheck = lineNum === targetLine
      ? lineText.substring(0, targetChar)
      : lineText;

    // Remove comments
    const commentIdx = textToCheck.indexOf('#');
    const cleanText = commentIdx >= 0 ? textToCheck.substring(0, commentIdx) : textToCheck;

    // Scan from end of line backwards
    for (let i = cleanText.length - 1; i >= 0; i--) {
      const char = cleanText[i];

      if (char === '}') {
        braceDepth++;
      } else if (char === '{') {
        braceDepth--;

        // When braceDepth goes negative, we've found an unclosed block start
        if (braceDepth < 0) {
          // Look for the block name before this brace
          const beforeBrace = cleanText.substring(0, i);
          const blockMatch = beforeBrace.match(/([\w.:$]+)\s*(?:\?=|>=|<=|=|>|<)\s*$/);
          if (blockMatch) {
            return blockMatch[1];
          }

          // Check previous line if block name not on same line
          if (lineNum > 0) {
            const prevLine = getText(lineNum - 1);
            const commentIdx = prevLine.indexOf('#');
            const cleanPrev = commentIdx >= 0 ? prevLine.substring(0, commentIdx) : prevLine;
            const prevMatch = cleanPrev.match(/([\w.:$]+)\s*(?:\?=|>=|<=|=|>|<)\s*$/);
            if (prevMatch) {
              return prevMatch[1];
            }
          }

          // Reset and continue looking
          braceDepth = 0;
        }
      }
    }
  }

  return null;
}

/**
 * Helper to create a getText function from a VSCode TextDocument
 */
export function createGetText(document: { lineAt(line: number): { text: string } }): (line: number) => string {
  return (line: number) => document.lineAt(line).text;
}
