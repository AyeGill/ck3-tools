import * as vscode from 'vscode';
import { FieldSchema } from '../schemas/registry/types';
import { TRAIT_CATEGORIES, STATS } from '../schemas/traitSchema';

// Import effect and trigger data
import { EffectDefinition, getEffect, getTrigger } from '../data';
import { TriggerDefinition } from '../data';
// Import weight block definitions
import {
  WEIGHT_BLOCKS,
  WEIGHT_BLOCK_PARAMS,
  TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS,
} from '../utils/scopeContext';
import { getImmediateParentBlock, createGetText } from '../utils/blockParser';
import { getBlockSchemaMap } from '../schemas/blockSchemas';
import { schemaRegistry } from '../schemas/registry/schemaRegistry';

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

    // Get the appropriate schema map for this file (may be null)
    const schemaMap = this.getSchemaMapForFile(document.fileName);

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
    const normalizedPath = document.fileName.replace(/\\/g, '/');
    if (normalizedPath.includes('/common/traits/')) {
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

    // Check if this is a parameter of an effect/trigger block
    const parameterHover = this.getParameterHover(document, position, word);
    if (parameterHover) {
      return parameterHover;
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

  /**
   * Get the schema map for a file based on its path
   */
  private getSchemaMapForFile(fileName: string): Map<string, FieldSchema> | null {
    return schemaRegistry.getSchemaMapForFile(fileName);
  }

  private getFieldHover(fieldName: string, schemaMap: Map<string, FieldSchema>): vscode.Hover | null {
    const field = schemaMap.get(fieldName);
    if (!field) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${fieldName}\n\n`);
    markdown.appendMarkdown(`**Type:** \`${field.type || 'unknown'}\`\n\n`);

    if (field.required) {
      markdown.appendMarkdown(`**Required field**\n\n`);
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
      markdown.appendMarkdown(`**Range:** ${field.min ?? '-inf'} to ${field.max ?? 'inf'}\n\n`);
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
          markdown.appendMarkdown(`Warning: Below minimum value (${field.min})\n\n`);
        }
        if (field.max !== undefined && numValue > field.max) {
          markdown.appendMarkdown(`Warning: Above maximum value (${field.max})\n\n`);
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
    const effect = getEffect(name);
    if (!effect) return null;

    const markdown = new vscode.MarkdownString();

    // Use the definition's name (shows pattern name like set_relation_$RELATION$ for pattern matches)
    markdown.appendMarkdown(`## ${effect.name}\n\n`);
    markdown.appendMarkdown(`**Effect** - `);

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
    const trigger = getTrigger(name);
    if (!trigger) return null;

    const markdown = new vscode.MarkdownString();

    // Use the definition's name (shows pattern name for pattern matches)
    markdown.appendMarkdown(`## ${trigger.name}\n\n`);
    markdown.appendMarkdown(`**Trigger** - `);

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

  /**
   * Get hover documentation for a parameter of an effect/trigger
   */
  private getParameterHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    word: string
  ): vscode.Hover | null {
    // Find the parent block by scanning backwards using unified parser
    const getText = createGetText(document);
    const parentBlock = getImmediateParentBlock(getText, position.line, position.character);
    if (!parentBlock) return null;

    // Check BLOCK_SCHEMAS for structural block fields (triggered_desc, desc, men_at_arms, etc.)
    const blockSchemaMap = getBlockSchemaMap(parentBlock);
    if (blockSchemaMap) {
      const fieldSchema = blockSchemaMap.get(word);
      if (fieldSchema) {
        return this.getBlockSchemaFieldHover(fieldSchema, parentBlock);
      }
    }

    // Check if this is a weight block parameter
    if (WEIGHT_BLOCKS.has(parentBlock) && WEIGHT_BLOCK_PARAMS.has(word)) {
      return this.getWeightParamHover(word, parentBlock);
    }

    // Check if this is a parameter of a trigger-context block with extra params
    const blockConfig = TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.get(parentBlock);
    if (blockConfig && blockConfig.extraParams.has(word)) {
      return this.getTriggerContextBlockParamHover(word, parentBlock, blockConfig.extraParams);
    }

    // Check if this word is a parameter of the parent block
    const effect = getEffect(parentBlock);
    const trigger = getTrigger(parentBlock);

    const effectDef = effect as EffectDefinition | undefined;
    const triggerDef = trigger as TriggerDefinition | undefined;

    const isEffectParam = effectDef?.parameters?.includes(word);
    const isTriggerParam = triggerDef?.parameters?.includes(word);

    if (!isEffectParam && !isTriggerParam) return null;

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${word}\n\n`);
    markdown.appendMarkdown(`**Parameter of** \`${parentBlock}\`\n\n`);

    // Try to extract description from the syntax
    const def = effectDef || triggerDef;
    if (def?.syntax) {
      const paramDesc = this.extractParameterDescription(word, def.syntax);
      if (paramDesc) {
        markdown.appendMarkdown(`${paramDesc}\n\n`);
      }
    }

    // Show the full syntax as reference
    if (def?.syntax) {
      markdown.appendMarkdown(`**Full syntax:**\n\`\`\`\n${def.syntax}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for weight block parameters (base, modifier, factor, etc.)
   */
  private getWeightParamHover(param: string, parentBlock: string): vscode.Hover {
    const descriptions: Record<string, string> = {
      base: 'The starting weight value before modifiers are applied.',
      modifier: 'A conditional weight modifier block. Contains inline triggers that, if true, apply the adjustment (add/factor/multiply).',
      opinion_modifier: 'An opinion-based weight modifier. Adjusts weight based on opinion between characters.',
      factor: 'Multiplies the current weight by this value.',
      add: 'Adds this value to the current weight.',
      multiply: 'Multiplies the current weight by this value (alias for factor).',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${param}\n\n`);
    markdown.appendMarkdown(`**Weight block parameter** in \`${parentBlock}\`\n\n`);
    markdown.appendMarkdown(`${descriptions[param] || 'A weight calculation parameter.'}\n\n`);

    // Show example syntax for the whole weight block
    markdown.appendMarkdown(`**Example:**\n\`\`\`\n${parentBlock} = {\n    base = 100\n    modifier = {\n        add = 50\n        has_trait = ambitious\n    }\n}\n\`\`\`\n`);

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for extra parameters in trigger-context blocks (like modifier inside weight)
   */
  private getTriggerContextBlockParamHover(
    param: string,
    parentBlock: string,
    extraParams: Set<string>
  ): vscode.Hover {
    // Descriptions for modifier block params
    const modifierParamDescriptions: Record<string, string> = {
      add: 'Adds this value to the weight when the inline triggers are satisfied.',
      factor: 'Multiplies the weight by this value when the inline triggers are satisfied.',
      multiply: 'Multiplies the weight by this value when the inline triggers are satisfied (alias for factor).',
      desc: 'A localization key or string describing what this modifier does.',
      value: 'The value to use for this modifier.',
    };

    // Descriptions for opinion_modifier block params
    const opinionModifierParamDescriptions: Record<string, string> = {
      who: 'The character whose opinion is being checked.',
      opinion_target: 'The character the opinion is towards.',
      min: 'Minimum opinion value to consider.',
      max: 'Maximum opinion value to consider.',
      multiplier: 'Multiplies the opinion value by this factor.',
      desc: 'A localization key or string describing what this modifier does.',
      step: 'Step size for opinion value increments.',
    };

    // Descriptions for compare_value block params
    const compareValueParamDescriptions: Record<string, string> = {
      value: 'The value to compare against.',
      target: 'The target value or scope to compare.',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${param}\n\n`);
    markdown.appendMarkdown(`**Parameter of** \`${parentBlock}\`\n\n`);

    // Get description based on parent block
    let description: string | undefined;
    if (parentBlock === 'modifier') {
      description = modifierParamDescriptions[param];
    } else if (parentBlock === 'opinion_modifier') {
      description = opinionModifierParamDescriptions[param];
    } else if (parentBlock === 'compare_value') {
      description = compareValueParamDescriptions[param];
    }

    markdown.appendMarkdown(`${description || 'A block parameter.'}\n\n`);

    // Show all valid params for this block
    const paramList = Array.from(extraParams).join(', ');
    markdown.appendMarkdown(`**Valid parameters:** \`${paramList}\`\n\n`);

    // Block-specific example
    if (parentBlock === 'modifier') {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\nmodifier = {\n    add = 50\n    has_trait = ambitious\n}\n\`\`\`\n`);
    } else if (parentBlock === 'opinion_modifier') {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\nopinion_modifier = {\n    who = root\n    opinion_target = scope:target\n    multiplier = 0.5\n}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for a field from BLOCK_SCHEMAS (structural blocks like triggered_desc, men_at_arms, etc.)
   */
  private getBlockSchemaFieldHover(fieldSchema: FieldSchema, parentBlock: string): vscode.Hover {
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${fieldSchema.name}\n\n`);
    markdown.appendMarkdown(`**Field of** \`${parentBlock}\` block\n\n`);

    if (fieldSchema.description) {
      markdown.appendMarkdown(`${fieldSchema.description}\n\n`);
    }

    // Show type information
    if (fieldSchema.type) {
      markdown.appendMarkdown(`**Type:** \`${fieldSchema.type}\`\n\n`);
    }

    // Show valid values for enums
    if (fieldSchema.values && fieldSchema.values.length > 0) {
      const valuesList = fieldSchema.values.slice(0, 10).join(', ');
      const suffix = fieldSchema.values.length > 10 ? `, ... (${fieldSchema.values.length} total)` : '';
      markdown.appendMarkdown(`**Valid values:** ${valuesList}${suffix}\n\n`);
    }

    // Show required status
    if (fieldSchema.required) {
      markdown.appendMarkdown(`*Required field*\n\n`);
    }

    // Show example if available
    if (fieldSchema.example) {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\n${fieldSchema.example}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Extract a parameter's description from the syntax documentation
   */
  private extractParameterDescription(param: string, syntax: string): string | null {
    // Look for lines like "param = description" or "param = value # comment"
    const lines = syntax.split('\n');
    for (const line of lines) {
      // Match patterns like: "param = value # description" or "param = value - description"
      const paramPattern = new RegExp(`^\\s*${param}\\s*=\\s*(.*)$`, 'i');
      const match = line.match(paramPattern);
      if (match) {
        let desc = match[1].trim();
        // Extract comment/description from # or after the value
        const commentMatch = desc.match(/#\s*(.*)$/);
        if (commentMatch) {
          return commentMatch[1].trim();
        }
        // Return the whole value description if no comment
        if (desc && desc.length < 100) { // Sanity check
          return desc;
        }
      }
    }
    return null;
  }
}
