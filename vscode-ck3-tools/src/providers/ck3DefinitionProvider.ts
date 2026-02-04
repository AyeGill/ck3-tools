/**
 * Go to Definition provider for CK3 entity references
 *
 * Allows navigation from entity references (like `add_trait = brave`)
 * to the definition of that entity.
 */

import * as vscode from 'vscode';
import { CK3WorkspaceIndex, EntityType } from './workspaceIndex';
import { effectsMap, triggersMap, effectParameterEntityTypes, triggerParameterEntityTypes } from '../data';
import { LIST_BLOCKS } from '../utils/scopeContext';
import { parseBlockContext, getImmediateParentBlock } from '../utils/blockParser';

/**
 * Mapping from effect/trigger supportedTargets values to EntityType
 * This is the same mapping used in ck3DiagnosticsProvider for validation
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
  'activity_type': 'activity',
  // Culture
  'culture': 'culture',
  'culture_tradition': 'culture_tradition',
  'culture_innovation': 'culture_innovation',
  'culture_pillar': 'culture_pillar',
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
  'legend_type': 'legend',
  'inspiration': 'inspiration',
  'struggle': 'struggle',
  'epidemic': 'epidemic',
  'epidemic_type': 'epidemic',
  'great_project': 'great_project',
  'great_project_type': 'great_project',
  'accolade': 'accolade_type',
  'accolade_type': 'accolade_type',
  'situation': 'situation',
  'story': 'story_cycle',
  'court_position_type': 'court_position_type',
  'artifact': 'artifact',
};

/**
 * Check if a value should be skipped for entity resolution
 */
function shouldSkipValue(value: string): boolean {
  // Dynamic scope references
  if (value.startsWith('scope:')) return true;
  // Variables
  if (value.startsWith('$') && value.endsWith('$')) return true;
  // Flags
  if (value.startsWith('flag:')) return true;
  // var: references
  if (value.startsWith('var:')) return true;
  // Prefixed references (type-checked only, not indexed)
  if (value.includes(':')) return true;
  // Bare scope changers
  const bareScopes = ['prev', 'this', 'root', 'from', 'yes', 'no'];
  if (bareScopes.includes(value)) return true;

  return false;
}

/**
 * Provides Go to Definition for CK3 entity references
 */
export class CK3DefinitionProvider implements vscode.DefinitionProvider {
  constructor(private workspaceIndex: CK3WorkspaceIndex) {}

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.Definition | null {
    // Get word at cursor - support underscores and dots (for namespace.event_id)
    const wordRange = document.getWordRangeAtPosition(position, /[\w.]+/);
    if (!wordRange) return null;

    const word = document.getText(wordRange);

    // Skip non-resolvable values
    if (shouldSkipValue(word)) return null;

    const lineText = document.lineAt(position.line).text;

    // Try different resolution strategies
    return (
      this.resolveFieldValue(document, position, lineText, word, wordRange) ||
      this.resolveScriptedCall(document, position, lineText, word, wordRange) ||
      this.resolveBareIdentifier(document, position, word)
    );
  }

  /**
   * Resolve effect/trigger target values like `add_trait = brave`
   */
  private resolveFieldValue(
    document: vscode.TextDocument,
    position: vscode.Position,
    lineText: string,
    word: string,
    wordRange: vscode.Range
  ): vscode.Location | null {
    // Match field = value pattern
    const fieldValueMatch = lineText.match(/^\s*([\w.]+)\s*=\s*([\w.]+)\s*(?:#.*)?$/);
    if (!fieldValueMatch) return null;

    const [, fieldName, fieldValue] = fieldValueMatch;

    // Check if cursor is on the value (not the field name)
    const valueStartIndex = lineText.indexOf(fieldValue, lineText.indexOf('='));
    const valueEndIndex = valueStartIndex + fieldValue.length;

    if (
      wordRange.start.character < valueStartIndex ||
      wordRange.end.character > valueEndIndex
    ) {
      return null; // Cursor is on field name, not value
    }

    // Check if field is an effect/trigger with supportedTargets
    const definition = effectsMap.get(fieldName) || triggersMap.get(fieldName);
    if (definition?.supportedTargets) {
      // Try each supported target type
      for (const target of definition.supportedTargets) {
        const entityType = TARGET_TO_ENTITY_TYPE[target];
        if (entityType) {
          const location = this.workspaceIndex.get(entityType, word);
          if (location) {
            return new vscode.Location(
              vscode.Uri.parse(location.uri),
              new vscode.Position(location.line, 0)
            );
          }
        }
      }
    }

    // Check if this is a typed parameter of a parent effect/trigger block
    const getText = (line: number) => document.lineAt(line).text;
    const parentBlock = getImmediateParentBlock(getText, position.line, position.character);
    if (parentBlock) {
      const paramTypes = effectParameterEntityTypes[parentBlock] || triggerParameterEntityTypes[parentBlock];
      if (paramTypes?.[fieldName]) {
        const entityType = TARGET_TO_ENTITY_TYPE[paramTypes[fieldName]];
        if (entityType) {
          const location = this.workspaceIndex.get(entityType, word);
          if (location) {
            return new vscode.Location(
              vscode.Uri.parse(location.uri),
              new vscode.Position(location.line, 0)
            );
          }
        }
      }
    }

    return null;
  }

  /**
   * Resolve scripted effect/trigger calls like `my_scripted_effect = yes`
   */
  private resolveScriptedCall(
    document: vscode.TextDocument,
    position: vscode.Position,
    lineText: string,
    word: string,
    wordRange: vscode.Range
  ): vscode.Location | null {
    // Match field = value pattern where cursor is on field
    const fieldValueMatch = lineText.match(/^\s*([\w.]+)\s*=\s*([\w.]+)\s*(?:#.*)?$/);
    if (!fieldValueMatch) return null;

    const [, fieldName] = fieldValueMatch;

    // Check if cursor is on the field name
    const fieldStartIndex = lineText.indexOf(fieldName);
    const fieldEndIndex = fieldStartIndex + fieldName.length;

    if (
      wordRange.start.character < fieldStartIndex ||
      wordRange.end.character > fieldEndIndex
    ) {
      return null; // Cursor is not on field name
    }

    // Skip if this is a known built-in effect/trigger
    if (effectsMap.has(fieldName) || triggersMap.has(fieldName)) {
      return null;
    }

    // Determine context (effect or trigger)
    const getText = (line: number) => document.lineAt(line).text;
    const context = parseBlockContext(
      getText,
      document.lineCount,
      position.line,
      position.character
    );

    // Look up as scripted effect or trigger based on context
    if (context.currentContext === 'effect') {
      const location = this.workspaceIndex.get('scripted_effect', fieldName);
      if (location) {
        return new vscode.Location(
          vscode.Uri.parse(location.uri),
          new vscode.Position(location.line, 0)
        );
      }
    } else if (context.currentContext === 'trigger') {
      const location = this.workspaceIndex.get('scripted_trigger', fieldName);
      if (location) {
        return new vscode.Location(
          vscode.Uri.parse(location.uri),
          new vscode.Position(location.line, 0)
        );
      }
    }

    return null;
  }

  /**
   * Resolve bare identifiers in list blocks like `first_valid = { my_event }`
   */
  private resolveBareIdentifier(
    document: vscode.TextDocument,
    position: vscode.Position,
    word: string
  ): vscode.Location | null {
    const lineText = document.lineAt(position.line).text;

    // Check if this line looks like a bare identifier (no = sign, just a word)
    const trimmed = lineText.trim();
    // Remove comments
    const commentIdx = trimmed.indexOf('#');
    const cleanLine = commentIdx >= 0 ? trimmed.substring(0, commentIdx).trim() : trimmed;

    // Should be just the word (possibly with whitespace around it)
    if (cleanLine !== word && !cleanLine.match(/^\s*[\w.]+\s*$/)) {
      return null;
    }

    // Find parent block
    const getText = (line: number) => document.lineAt(line).text;
    const parentBlock = getImmediateParentBlock(getText, position.line, position.character);

    if (!parentBlock) return null;

    // Check if parent is a list block
    const listBlockType = LIST_BLOCKS[parentBlock];
    if (listBlockType === undefined || listBlockType === null) {
      return null; // Not a list block, or list block without validation
    }

    // Look up in workspace index
    const location = this.workspaceIndex.get(listBlockType as EntityType, word);
    if (location) {
      return new vscode.Location(
        vscode.Uri.parse(location.uri),
        new vscode.Position(location.line, 0)
      );
    }

    return null;
  }
}
