import * as vscode from 'vscode';
import { FieldSchema, TRAIT_CATEGORIES, STATS } from '../schemas/traitSchema';

// Import effect and trigger data
import { effectsMap, EffectDefinition } from '../data';
import { triggersMap, TriggerDefinition } from '../data';

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
import { activitySchemaMap } from '../schemas/activitySchema';

type CK3FileType =
  | 'trait' | 'event' | 'decision' | 'interaction' | 'building'
  | 'on_action' | 'scheme' | 'men_at_arms' | 'casus_belli'
  | 'culture' | 'tradition' | 'faith' | 'religion'
  | 'scripted_effect' | 'scripted_trigger' | 'artifact'
  | 'court_position' | 'lifestyle' | 'focus' | 'perk'
  | 'dynasty_legacy' | 'modifier' | 'law' | 'government'
  | 'activity'
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

    // Get the appropriate schema map for this file type (may be null)
    const schemaMap = this.getSchemaMapForFileType(fileType);

    // Check schema fields first (if we have a schema)
    if (schemaMap) {
      // Check if this is a field name (before =)
      const fieldMatch = lineText.match(/^\s*(\w+)\s*=/);
      if (fieldMatch && fieldMatch[1] === word) {
        const fieldHover = this.getFieldHover(word, schemaMap);
        if (fieldHover) return fieldHover;
      }

      // Check if this is a value (after =)
      const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
      if (valueMatch && valueMatch[2] === word) {
        const valueHover = this.getValueHover(valueMatch[1], word, schemaMap);
        if (valueHover) return valueHover;
      }

      // Generic field lookup
      const field = schemaMap.get(word);
      if (field) {
        return this.getFieldHover(word, schemaMap);
      }
    }

    // Trait-specific hovers (categories and stats)
    if (fileType === 'trait') {
      if (TRAIT_CATEGORIES.includes(word as any)) {
        return this.getTraitCategoryHover(word);
      }
      if (STATS.includes(word as any)) {
        // Check if this is a stat value (after =) or just the stat name
        const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
        if (valueMatch && valueMatch[1] === word) {
          // This is the field name, not a value
          return this.getStatHover(word);
        }
        if (valueMatch && STATS.includes(valueMatch[1] as any) && valueMatch[2] === word) {
          // This is a stat value
          return this.getStatValueHover(valueMatch[1], word);
        }
        return this.getStatHover(word);
      }
    }

    // Always check for effects and triggers (works in any CK3 file)
    const effectHover = this.getEffectHover(word);
    if (effectHover) {
      return effectHover;
    }

    const triggerHover = this.getTriggerHover(word);
    if (triggerHover) {
      return triggerHover;
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
    if (normalizedPath.includes('/common/activities/')) return 'activity';

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
      case 'activity': return activitySchemaMap;
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

  /**
   * Get hover documentation for an effect
   */
  private getEffectHover(name: string): vscode.Hover | null {
    const effect = effectsMap.get(name);
    if (!effect) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${name}\n\n`);
    markdown.appendMarkdown(`**Effect** · `);

    if (effect.isIterator) {
      markdown.appendMarkdown(`*Iterator*\n\n`);
    } else {
      markdown.appendMarkdown(`*Command*\n\n`);
    }

    markdown.appendMarkdown(`${effect.description}\n\n`);

    // Show supported scopes
    const scopes = effect.supportedScopes.join(', ');
    markdown.appendMarkdown(`**Scopes:** \`${scopes}\`\n\n`);

    // Show supported targets for iterators
    if (effect.supportedTargets && effect.supportedTargets.length > 0) {
      const targets = effect.supportedTargets.join(', ');
      markdown.appendMarkdown(`**Targets:** \`${targets}\`\n\n`);
    }

    // Show output scope if it changes scope
    if (effect.outputScope) {
      markdown.appendMarkdown(`**Output scope:** \`${effect.outputScope}\`\n\n`);
    }

    // Show syntax example
    if (effect.syntax) {
      markdown.appendMarkdown(`**Syntax:**\n\`\`\`\n${effect.syntax}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover documentation for a trigger
   */
  private getTriggerHover(name: string): vscode.Hover | null {
    const trigger = triggersMap.get(name);
    if (!trigger) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${name}\n\n`);
    markdown.appendMarkdown(`**Trigger** · `);

    if (trigger.isIterator) {
      markdown.appendMarkdown(`*Iterator*\n\n`);
    } else if (trigger.valueType === 'boolean') {
      markdown.appendMarkdown(`*Boolean*\n\n`);
    } else if (trigger.valueType === 'comparison') {
      markdown.appendMarkdown(`*Comparison*\n\n`);
    } else {
      markdown.appendMarkdown(`*Condition*\n\n`);
    }

    markdown.appendMarkdown(`${trigger.description}\n\n`);

    // Show supported scopes
    const scopes = trigger.supportedScopes.join(', ');
    markdown.appendMarkdown(`**Scopes:** \`${scopes}\`\n\n`);

    // Show supported targets for iterators
    if (trigger.supportedTargets && trigger.supportedTargets.length > 0) {
      const targets = trigger.supportedTargets.join(', ');
      markdown.appendMarkdown(`**Targets:** \`${targets}\`\n\n`);
    }

    // Show output scope if it changes scope
    if (trigger.outputScope) {
      markdown.appendMarkdown(`**Output scope:** \`${trigger.outputScope}\`\n\n`);
    }

    // Show syntax example
    if (trigger.syntax) {
      markdown.appendMarkdown(`**Syntax:**\n\`\`\`\n${trigger.syntax}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for trait category values
   */
  private getTraitCategoryHover(category: string): vscode.Hover {
    const descriptions: Record<string, string> = {
      personality: 'Core personality traits that define character behavior. Generated with characters and affect AI decisions.',
      education: 'Education traits representing the character\'s upbringing. One per character, acquired at age 16.',
      childhood: 'Child personality traits that grow into adult traits when the character comes of age.',
      commander: 'Combat leadership traits that affect battlefield performance.',
      winter_commander: 'Specialized commander traits for winter warfare.',
      lifestyle: 'Traits gained through lifestyle focus progress.',
      court_type: 'Royal court type traits (requires Royal Court DLC).',
      fame: 'Fame and prestige-related traits.',
      health: 'Health conditions and physical states.',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## Category: ${category}\n\n`);
    markdown.appendMarkdown(descriptions[category] || 'A trait category.');

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for stat names (diplomacy, martial, etc.)
   */
  private getStatHover(stat: string): vscode.Hover {
    const descriptions: Record<string, string> = {
      diplomacy: 'Diplomacy affects relations, vassals, and negotiation. Used for diplomatic actions and schemes.',
      martial: 'Martial affects military performance, levy size, and army effectiveness.',
      stewardship: 'Stewardship affects domain limit, tax income, and economic actions.',
      intrigue: 'Intrigue affects schemes, secrets, and covert actions.',
      learning: 'Learning affects research speed, piety, and religious/cultural actions.',
      prowess: 'Prowess affects personal combat ability in duels and battles.',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${stat.charAt(0).toUpperCase() + stat.slice(1)}\n\n`);
    markdown.appendMarkdown(descriptions[stat] || 'A character stat.');

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for stat values (shows magnitude interpretation)
   */
  private getStatValueHover(stat: string, value: string): vscode.Hover {
    const numValue = parseInt(value);
    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${stat} modifier: ${value}\n\n`);

    if (!isNaN(numValue)) {
      if (numValue > 0) {
        markdown.appendMarkdown(`Grants **+${numValue}** to ${stat}.\n\n`);
      } else if (numValue < 0) {
        markdown.appendMarkdown(`Reduces ${stat} by **${Math.abs(numValue)}**.\n\n`);
      } else {
        markdown.appendMarkdown(`No effect on ${stat}.\n\n`);
      }

      // Context for the value
      if (Math.abs(numValue) <= 1) {
        markdown.appendMarkdown('*Minor modifier*');
      } else if (Math.abs(numValue) <= 3) {
        markdown.appendMarkdown('*Moderate modifier*');
      } else if (Math.abs(numValue) <= 5) {
        markdown.appendMarkdown('*Significant modifier*');
      } else {
        markdown.appendMarkdown('*Major modifier*');
      }
    }

    return new vscode.Hover(markdown);
  }
}
