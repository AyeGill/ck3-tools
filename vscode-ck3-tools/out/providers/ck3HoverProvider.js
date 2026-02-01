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
exports.CK3HoverProvider = void 0;
const vscode = __importStar(require("vscode"));
// Import effect and trigger data
const data_1 = require("../data");
const data_2 = require("../data");
// Import all schema maps
const traitSchema_1 = require("../schemas/traitSchema");
const eventSchema_1 = require("../schemas/eventSchema");
const decisionSchema_1 = require("../schemas/decisionSchema");
const interactionSchema_1 = require("../schemas/interactionSchema");
const buildingSchema_1 = require("../schemas/buildingSchema");
const onActionSchema_1 = require("../schemas/onActionSchema");
const schemeSchema_1 = require("../schemas/schemeSchema");
const menAtArmsSchema_1 = require("../schemas/menAtArmsSchema");
const casusBelliSchema_1 = require("../schemas/casusBelliSchema");
const cultureSchema_1 = require("../schemas/cultureSchema");
const faithSchema_1 = require("../schemas/faithSchema");
const scriptedEffectsSchema_1 = require("../schemas/scriptedEffectsSchema");
const scriptedTriggersSchema_1 = require("../schemas/scriptedTriggersSchema");
const artifactSchema_1 = require("../schemas/artifactSchema");
const courtPositionSchema_1 = require("../schemas/courtPositionSchema");
const lifestyleSchema_1 = require("../schemas/lifestyleSchema");
const dynastyLegacySchema_1 = require("../schemas/dynastyLegacySchema");
const modifierSchema_1 = require("../schemas/modifierSchema");
const lawSchema_1 = require("../schemas/lawSchema");
const governmentSchema_1 = require("../schemas/governmentSchema");
/**
 * Provides hover information for CK3 entity fields across all file types
 */
class CK3HoverProvider {
    provideHover(document, position, token) {
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
                if (fieldHover)
                    return fieldHover;
            }
            // Check if this is a value (after =)
            const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
            if (valueMatch && valueMatch[2] === word) {
                const valueHover = this.getValueHover(valueMatch[1], word, schemaMap);
                if (valueHover)
                    return valueHover;
            }
            // Generic field lookup
            const field = schemaMap.get(word);
            if (field) {
                return this.getFieldHover(word, schemaMap);
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
    getFileType(fileName) {
        // Normalize path separators
        const normalizedPath = fileName.replace(/\\/g, '/');
        // Check file path patterns
        if (normalizedPath.includes('/common/traits/'))
            return 'trait';
        if (normalizedPath.includes('/events/'))
            return 'event';
        if (normalizedPath.includes('/common/decisions/'))
            return 'decision';
        if (normalizedPath.includes('/common/character_interactions/'))
            return 'interaction';
        if (normalizedPath.includes('/common/buildings/'))
            return 'building';
        if (normalizedPath.includes('/common/on_actions/'))
            return 'on_action';
        if (normalizedPath.includes('/common/schemes/'))
            return 'scheme';
        if (normalizedPath.includes('/common/men_at_arms_types/'))
            return 'men_at_arms';
        if (normalizedPath.includes('/common/casus_belli_types/'))
            return 'casus_belli';
        if (normalizedPath.includes('/common/culture/cultures/'))
            return 'culture';
        if (normalizedPath.includes('/common/culture/traditions/'))
            return 'tradition';
        if (normalizedPath.includes('/common/religion/religions/'))
            return 'religion';
        if (normalizedPath.includes('/common/religion/holy_sites/'))
            return 'faith';
        if (normalizedPath.includes('/common/scripted_effects/'))
            return 'scripted_effect';
        if (normalizedPath.includes('/common/scripted_triggers/'))
            return 'scripted_trigger';
        if (normalizedPath.includes('/common/artifacts/'))
            return 'artifact';
        if (normalizedPath.includes('/common/court_positions/'))
            return 'court_position';
        if (normalizedPath.includes('/common/lifestyles/'))
            return 'lifestyle';
        if (normalizedPath.includes('/common/dynasty_legacies/'))
            return 'dynasty_legacy';
        if (normalizedPath.includes('/common/modifiers/'))
            return 'modifier';
        if (normalizedPath.includes('/common/laws/'))
            return 'law';
        if (normalizedPath.includes('/common/governments/'))
            return 'government';
        return 'unknown';
    }
    getSchemaMapForFileType(fileType) {
        switch (fileType) {
            case 'trait': return traitSchema_1.traitSchemaMap;
            case 'event': return eventSchema_1.eventSchemaMap;
            case 'decision': return decisionSchema_1.decisionSchemaMap;
            case 'interaction': return interactionSchema_1.interactionSchemaMap;
            case 'building': return buildingSchema_1.buildingSchemaMap;
            case 'on_action': return onActionSchema_1.onActionSchemaMap;
            case 'scheme': return schemeSchema_1.schemeSchemaMap;
            case 'men_at_arms': return menAtArmsSchema_1.menAtArmsSchemaMap;
            case 'casus_belli': return casusBelliSchema_1.casusBelliSchemaMap;
            case 'culture': return cultureSchema_1.cultureSchemaMap;
            case 'tradition': return cultureSchema_1.traditionSchemaMap;
            case 'faith': return faithSchema_1.faithSchemaMap;
            case 'religion': return faithSchema_1.religionSchemaMap;
            case 'scripted_effect': return scriptedEffectsSchema_1.scriptedEffectSchemaMap;
            case 'scripted_trigger': return scriptedTriggersSchema_1.scriptedTriggerSchemaMap;
            case 'artifact': return artifactSchema_1.artifactSchemaMap;
            case 'court_position': return courtPositionSchema_1.courtPositionSchemaMap;
            case 'lifestyle': return lifestyleSchema_1.lifestyleSchemaMap;
            case 'focus': return lifestyleSchema_1.focusSchemaMap;
            case 'perk': return lifestyleSchema_1.perkSchemaMap;
            case 'dynasty_legacy': return dynastyLegacySchema_1.dynastyLegacySchemaMap;
            case 'modifier': return modifierSchema_1.modifierSchemaMap;
            case 'law': return lawSchema_1.lawSchemaMap;
            case 'government': return governmentSchema_1.governmentSchemaMap;
            default: return null;
        }
    }
    getFieldHover(fieldName, schemaMap) {
        const field = schemaMap.get(fieldName);
        if (!field)
            return null;
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
    getValueHover(fieldName, value, schemaMap) {
        const field = schemaMap.get(fieldName);
        if (!field)
            return null;
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
    getEffectHover(name) {
        const effect = data_1.effectsMap.get(name);
        if (!effect)
            return null;
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## ${name}\n\n`);
        markdown.appendMarkdown(`**Effect** · `);
        if (effect.isIterator) {
            markdown.appendMarkdown(`*Iterator*\n\n`);
        }
        else {
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
    getTriggerHover(name) {
        const trigger = data_2.triggersMap.get(name);
        if (!trigger)
            return null;
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## ${name}\n\n`);
        markdown.appendMarkdown(`**Trigger** · `);
        if (trigger.isIterator) {
            markdown.appendMarkdown(`*Iterator*\n\n`);
        }
        else if (trigger.valueType === 'boolean') {
            markdown.appendMarkdown(`*Boolean*\n\n`);
        }
        else if (trigger.valueType === 'comparison') {
            markdown.appendMarkdown(`*Comparison*\n\n`);
        }
        else {
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
}
exports.CK3HoverProvider = CK3HoverProvider;
//# sourceMappingURL=ck3HoverProvider.js.map