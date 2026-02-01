import * as vscode from 'vscode';
import {
  traitSchemaMap,
  getFieldDocumentation,
  TRAIT_CATEGORIES,
  STATS,
} from '../schemas/traitSchema';

/**
 * Provides hover information for CK3 trait fields
 */
export class TraitHoverProvider implements vscode.HoverProvider {

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

    // Check if this is a field name (before =)
    const fieldMatch = lineText.match(/^\s*(\w+)\s*=/);
    if (fieldMatch && fieldMatch[1] === word) {
      return this.getFieldHover(word);
    }

    // Check if this is a value (after =)
    const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
    if (valueMatch && valueMatch[2] === word) {
      return this.getValueHover(valueMatch[1], word);
    }

    // Check if it's a trait category value
    if (TRAIT_CATEGORIES.includes(word as any)) {
      return this.getCategoryHover(word);
    }

    // Check if it's a stat name
    if (STATS.includes(word as any)) {
      return this.getStatHover(word);
    }

    // Generic field lookup
    const doc = getFieldDocumentation(word);
    if (doc) {
      return new vscode.Hover(new vscode.MarkdownString(doc));
    }

    return null;
  }

  private getFieldHover(fieldName: string): vscode.Hover | null {
    const doc = getFieldDocumentation(fieldName);
    if (!doc) return null;

    const field = traitSchemaMap.get(fieldName);
    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${fieldName}\n\n`);
    markdown.appendMarkdown(`**Type:** \`${field?.type || 'unknown'}\`\n\n`);

    if (field?.required) {
      markdown.appendMarkdown(`⚠️ **Required field**\n\n`);
    }

    markdown.appendMarkdown(`${field?.description || ''}\n\n`);

    if (field?.type === 'enum' && field.values) {
      markdown.appendMarkdown(`**Valid values:**\n`);
      for (const val of field.values) {
        markdown.appendMarkdown(`- \`${val}\`\n`);
      }
      markdown.appendMarkdown('\n');
    }

    if (field?.default !== undefined) {
      markdown.appendMarkdown(`**Default:** \`${field.default}\`\n\n`);
    }

    if (field?.min !== undefined || field?.max !== undefined) {
      markdown.appendMarkdown(`**Range:** ${field?.min ?? '∞'} to ${field?.max ?? '∞'}\n\n`);
    }

    if (field?.example) {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\n${field.example}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  private getValueHover(fieldName: string, value: string): vscode.Hover | null {
    const field = traitSchemaMap.get(fieldName);
    if (!field) return null;

    const markdown = new vscode.MarkdownString();

    // Special handling for category values
    if (fieldName === 'category') {
      return this.getCategoryHover(value);
    }

    // Special handling for stats
    if (STATS.includes(fieldName as any)) {
      return this.getStatValueHover(fieldName, value);
    }

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

    return null;
  }

  private getCategoryHover(category: string): vscode.Hover {
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
