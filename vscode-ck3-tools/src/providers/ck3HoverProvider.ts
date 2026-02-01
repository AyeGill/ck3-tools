import * as vscode from 'vscode';
import { FieldSchema } from '../schemas/traitSchema';

// Import all schema maps
import { traitSchemaMap } from '../schemas/traitSchema';
import { eventSchemaMap } from '../schemas/eventSchema';
import { decisionSchemaMap } from '../schemas/decisionSchema';
import { interactionSchemaMap } from '../schemas/interactionSchema';
import { buildingSchemaMap } from '../schemas/buildingSchema';
import { onActionSchemaMap } from '../schemas/onActionSchema';
import { schemeSchemaMap } from '../schemas/schemeSchema';
import { menAtArmsSchemaMap } from '../schemas/menAtArmsSchema';
import { casusBelliSchemaMap } from '../schemas/casusBelliSchema';
import { cultureSchemaMap, traditionSchemaMap } from '../schemas/cultureSchema';
import { faithSchemaMap, religionSchemaMap } from '../schemas/faithSchema';
import { scriptedEffectSchemaMap } from '../schemas/scriptedEffectsSchema';
import { scriptedTriggerSchemaMap } from '../schemas/scriptedTriggersSchema';
import { artifactSchemaMap } from '../schemas/artifactSchema';
import { courtPositionSchemaMap } from '../schemas/courtPositionSchema';
import { lifestyleSchemaMap, focusSchemaMap, perkSchemaMap } from '../schemas/lifestyleSchema';
import { dynastyLegacySchemaMap } from '../schemas/dynastyLegacySchema';
import { modifierSchemaMap } from '../schemas/modifierSchema';
import { lawSchemaMap } from '../schemas/lawSchema';
import { governmentSchemaMap } from '../schemas/governmentSchema';

type CK3FileType =
  | 'trait' | 'event' | 'decision' | 'interaction' | 'building'
  | 'on_action' | 'scheme' | 'men_at_arms' | 'casus_belli'
  | 'culture' | 'tradition' | 'faith' | 'religion'
  | 'scripted_effect' | 'scripted_trigger' | 'artifact'
  | 'court_position' | 'lifestyle' | 'focus' | 'perk'
  | 'dynasty_legacy' | 'modifier' | 'law' | 'government'
  | 'unknown';

/**
 * Provides hover information for CK3 entity fields across all file types
 */
export class CK3HoverProvider implements vscode.HoverProvider {

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const wordRange = document.getWordRangeAtPosition(position, /[\w_]+/);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);
    const lineText = document.lineAt(position).text;
    const fileType = this.getFileType(document.fileName);

    if (fileType === 'unknown') {
      return null;
    }

    // Get the appropriate schema map for this file type
    const schemaMap = this.getSchemaMapForFileType(fileType);
    if (!schemaMap) {
      return null;
    }

    // Check if this is a field name (before =)
    const fieldMatch = lineText.match(/^\s*(\w+)\s*=/);
    if (fieldMatch && fieldMatch[1] === word) {
      return this.getFieldHover(word, schemaMap);
    }

    // Check if this is a value (after =)
    const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
    if (valueMatch && valueMatch[2] === word) {
      return this.getValueHover(valueMatch[1], word, schemaMap);
    }

    // Generic field lookup
    const field = schemaMap.get(word);
    if (field) {
      return this.getFieldHover(word, schemaMap);
    }

    return null;
  }

  private getFileType(fileName: string): CK3FileType {
    // Normalize path separators
    const normalizedPath = fileName.replace(/\\/g, '/');

    // Check file path patterns
    if (normalizedPath.includes('/common/traits/')) return 'trait';
    if (normalizedPath.includes('/events/')) return 'event';
    if (normalizedPath.includes('/common/decisions/')) return 'decision';
    if (normalizedPath.includes('/common/character_interactions/')) return 'interaction';
    if (normalizedPath.includes('/common/buildings/')) return 'building';
    if (normalizedPath.includes('/common/on_actions/')) return 'on_action';
    if (normalizedPath.includes('/common/schemes/')) return 'scheme';
    if (normalizedPath.includes('/common/men_at_arms_types/')) return 'men_at_arms';
    if (normalizedPath.includes('/common/casus_belli_types/')) return 'casus_belli';
    if (normalizedPath.includes('/common/culture/cultures/')) return 'culture';
    if (normalizedPath.includes('/common/culture/traditions/')) return 'tradition';
    if (normalizedPath.includes('/common/religion/religions/')) return 'religion';
    if (normalizedPath.includes('/common/religion/holy_sites/')) return 'faith';
    if (normalizedPath.includes('/common/scripted_effects/')) return 'scripted_effect';
    if (normalizedPath.includes('/common/scripted_triggers/')) return 'scripted_trigger';
    if (normalizedPath.includes('/common/artifacts/')) return 'artifact';
    if (normalizedPath.includes('/common/court_positions/')) return 'court_position';
    if (normalizedPath.includes('/common/lifestyles/')) return 'lifestyle';
    if (normalizedPath.includes('/common/dynasty_legacies/')) return 'dynasty_legacy';
    if (normalizedPath.includes('/common/modifiers/')) return 'modifier';
    if (normalizedPath.includes('/common/laws/')) return 'law';
    if (normalizedPath.includes('/common/governments/')) return 'government';

    return 'unknown';
  }

  private getSchemaMapForFileType(fileType: CK3FileType): Map<string, FieldSchema> | null {
    switch (fileType) {
      case 'trait': return traitSchemaMap;
      case 'event': return eventSchemaMap;
      case 'decision': return decisionSchemaMap;
      case 'interaction': return interactionSchemaMap;
      case 'building': return buildingSchemaMap;
      case 'on_action': return onActionSchemaMap;
      case 'scheme': return schemeSchemaMap;
      case 'men_at_arms': return menAtArmsSchemaMap;
      case 'casus_belli': return casusBelliSchemaMap;
      case 'culture': return cultureSchemaMap;
      case 'tradition': return traditionSchemaMap;
      case 'faith': return faithSchemaMap;
      case 'religion': return religionSchemaMap;
      case 'scripted_effect': return scriptedEffectSchemaMap;
      case 'scripted_trigger': return scriptedTriggerSchemaMap;
      case 'artifact': return artifactSchemaMap;
      case 'court_position': return courtPositionSchemaMap;
      case 'lifestyle': return lifestyleSchemaMap;
      case 'focus': return focusSchemaMap;
      case 'perk': return perkSchemaMap;
      case 'dynasty_legacy': return dynastyLegacySchemaMap;
      case 'modifier': return modifierSchemaMap;
      case 'law': return lawSchemaMap;
      case 'government': return governmentSchemaMap;
      default: return null;
    }
  }

  private getFieldHover(fieldName: string, schemaMap: Map<string, FieldSchema>): vscode.Hover | null {
    const field = schemaMap.get(fieldName);
    if (!field) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${fieldName}\n\n`);
    markdown.appendMarkdown(`**Type:** \`${field.type || 'unknown'}\`\n\n`);

    if (field.required) {
      markdown.appendMarkdown(`⚠️ **Required field**\n\n`);
    }

    markdown.appendMarkdown(`${field.description || ''}\n\n`);

    if (field.type === 'enum' && field.values) {
      markdown.appendMarkdown(`**Valid values:**\n`);
      for (const val of field.values) {
        markdown.appendMarkdown(`- \`${val}\`\n`);
      }
      markdown.appendMarkdown('\n');
    }

    if (field.default !== undefined) {
      markdown.appendMarkdown(`**Default:** \`${field.default}\`\n\n`);
    }

    if (field.min !== undefined || field.max !== undefined) {
      markdown.appendMarkdown(`**Range:** ${field.min ?? '∞'} to ${field.max ?? '∞'}\n\n`);
    }

    if (field.example) {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\n${field.example}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  private getValueHover(fieldName: string, value: string, schemaMap: Map<string, FieldSchema>): vscode.Hover | null {
    const field = schemaMap.get(fieldName);
    if (!field) return null;

    const markdown = new vscode.MarkdownString();

    // Generic value description
    if (field.type === 'enum' && field.values?.includes(value)) {
      markdown.appendMarkdown(`**${value}**\n\n`);
      markdown.appendMarkdown(`Valid value for \`${fieldName}\`\n`);
      return new vscode.Hover(markdown);
    }

    if (field.type === 'boolean') {
      markdown.appendMarkdown(`**${value}**\n\n`);
      markdown.appendMarkdown(value === 'yes' ? 'Enables this option' : 'Disables this option');
      return new vscode.Hover(markdown);
    }

    // Numeric value hover
    if (field.type === 'integer' || field.type === 'float') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        markdown.appendMarkdown(`**${fieldName}: ${value}**\n\n`);

        if (field.min !== undefined && numValue < field.min) {
          markdown.appendMarkdown(`⚠️ Below minimum value (${field.min})\n\n`);
        }
        if (field.max !== undefined && numValue > field.max) {
          markdown.appendMarkdown(`⚠️ Above maximum value (${field.max})\n\n`);
        }

        return new vscode.Hover(markdown);
      }
    }

    return null;
  }
}
