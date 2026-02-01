"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraitHoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const traitSchema_1 = require("../schemas/traitSchema");
/**
 * Provides hover information for CK3 trait fields
 */
class TraitHoverProvider {
    provideHover(document, position, token) {
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
        if (traitSchema_1.TRAIT_CATEGORIES.includes(word)) {
            return this.getCategoryHover(word);
        }
        // Check if it's a stat name
        if (traitSchema_1.STATS.includes(word)) {
            return this.getStatHover(word);
        }
        // Generic field lookup
        const doc = (0, traitSchema_1.getFieldDocumentation)(word);
        if (doc) {
            return new vscode.Hover(new vscode.MarkdownString(doc));
        }
        return null;
    }
    getFieldHover(fieldName) {
        const doc = (0, traitSchema_1.getFieldDocumentation)(fieldName);
        if (!doc)
            return null;
        const field = traitSchema_1.traitSchemaMap.get(fieldName);
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
    getValueHover(fieldName, value) {
        const field = traitSchema_1.traitSchemaMap.get(fieldName);
        if (!field)
            return null;
        const markdown = new vscode.MarkdownString();
        // Special handling for category values
        if (fieldName === 'category') {
            return this.getCategoryHover(value);
        }
        // Special handling for stats
        if (traitSchema_1.STATS.includes(fieldName)) {
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
    getCategoryHover(category) {
        const descriptions = {
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
    getStatHover(stat) {
        const descriptions = {
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
    getStatValueHover(stat, value) {
        const numValue = parseInt(value);
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## ${stat} modifier: ${value}\n\n`);
        if (!isNaN(numValue)) {
            if (numValue > 0) {
                markdown.appendMarkdown(`Grants **+${numValue}** to ${stat}.\n\n`);
            }
            else if (numValue < 0) {
                markdown.appendMarkdown(`Reduces ${stat} by **${Math.abs(numValue)}**.\n\n`);
            }
            else {
                markdown.appendMarkdown(`No effect on ${stat}.\n\n`);
            }
            // Context for the value
            if (Math.abs(numValue) <= 1) {
                markdown.appendMarkdown('*Minor modifier*');
            }
            else if (Math.abs(numValue) <= 3) {
                markdown.appendMarkdown('*Moderate modifier*');
            }
            else if (Math.abs(numValue) <= 5) {
                markdown.appendMarkdown('*Significant modifier*');
            }
            else {
                markdown.appendMarkdown('*Major modifier*');
            }
        }
        return new vscode.Hover(markdown);
    }
}
exports.TraitHoverProvider = TraitHoverProvider;
//# sourceMappingURL=traitHoverProvider.js.map