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
exports.TraitCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const traitSchema_1 = require("../schemas/traitSchema");
/**
 * Provides autocomplete suggestions for CK3 trait files
 */
class TraitCompletionProvider {
    provideCompletionItems(document, position, token, context) {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        // Determine the context we're in
        const parseContext = this.analyzeContext(document, position);
        if (parseContext.afterEquals) {
            // We're after an = sign, suggest values
            return this.getValueCompletions(parseContext.fieldName, parseContext);
        }
        if (parseContext.insideTraitBlock) {
            // We're inside a trait block, suggest field names based on context
            return this.getFieldCompletions(linePrefix, parseContext.blockPath || []);
        }
        // Top level - suggest starting a new trait
        if (linePrefix.trim() === '') {
            return this.getTopLevelCompletions();
        }
        return null;
    }
    analyzeContext(document, position) {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        // Get brace depth and block path
        const { depth: braceDepth, blockPath } = this.getBraceDepthAndPath(document, position);
        // Check if we're after an = sign
        const equalsMatch = linePrefix.match(/^\s*(\w+)\s*=\s*$/);
        if (equalsMatch) {
            return {
                insideTraitBlock: braceDepth >= 1,
                afterEquals: true,
                fieldName: equalsMatch[1],
                braceDepth,
                blockPath,
            };
        }
        // Check if we're partially typing a value after =
        const partialValueMatch = linePrefix.match(/^\s*(\w+)\s*=\s*(\S*)$/);
        if (partialValueMatch) {
            return {
                insideTraitBlock: braceDepth >= 1,
                afterEquals: true,
                fieldName: partialValueMatch[1],
                partialValue: partialValueMatch[2],
                braceDepth,
                blockPath,
            };
        }
        return {
            insideTraitBlock: braceDepth >= 1,
            afterEquals: false,
            braceDepth,
            blockPath,
        };
    }
    /**
     * Gets the brace depth and the path of block names we're nested inside.
     * For example, if cursor is inside:
     *   my_trait = {
     *     desc = {
     *       first_valid = {
     *         |  <- cursor here
     *
     * Returns: { depth: 3, blockPath: ['desc', 'first_valid'] }
     * (Note: the trait name itself is not included in blockPath)
     */
    getBraceDepthAndPath(document, position) {
        let depth = 0;
        const blockStack = [];
        let pendingFieldName = null;
        for (let i = 0; i <= position.line; i++) {
            const line = document.lineAt(i).text;
            const endChar = i === position.line ? position.character : line.length;
            // Check for field = { pattern on this line (before processing braces)
            // This captures the field name that precedes an opening brace
            const fieldMatch = line.match(/^\s*(\w+)\s*=\s*\{/);
            if (fieldMatch) {
                pendingFieldName = fieldMatch[1];
            }
            for (let j = 0; j < endChar; j++) {
                // Skip comments
                if (line[j] === '#')
                    break;
                if (line[j] === '{') {
                    depth++;
                    // If depth > 1, we're entering a nested block (not the trait definition itself)
                    // Push the pending field name to the block stack
                    if (depth > 1 && pendingFieldName) {
                        blockStack.push(pendingFieldName);
                    }
                    pendingFieldName = null;
                }
                if (line[j] === '}') {
                    depth--;
                    // Pop from block stack when closing a nested block
                    if (blockStack.length > 0 && depth >= 1) {
                        blockStack.pop();
                    }
                }
            }
            // Reset pending field name at end of line if no brace was found
            if (!line.includes('{')) {
                pendingFieldName = null;
            }
        }
        return { depth, blockPath: blockStack };
    }
    getFieldCompletions(linePrefix, blockPath) {
        const items = [];
        const partial = linePrefix.trim().toLowerCase();
        // Get the appropriate schema based on where we are in the block hierarchy
        const schema = (0, traitSchema_1.getSchemaForContext)(blockPath);
        for (const field of schema) {
            if (partial === '' || field.name.toLowerCase().startsWith(partial)) {
                const item = new vscode.CompletionItem(field.name, this.getCompletionKind(field));
                item.detail = this.getFieldDetail(field);
                item.documentation = new vscode.MarkdownString(this.getFieldDoc(field));
                // Insert with = and appropriate value placeholder
                item.insertText = this.getFieldInsertText(field);
                // Sort required fields first
                item.sortText = field.required ? `0_${field.name}` : `1_${field.name}`;
                items.push(item);
            }
        }
        return items;
    }
    /**
     * Get documentation for a field (works for any schema, not just trait schema)
     */
    getFieldDoc(field) {
        let doc = field.description;
        if (field.type === 'enum' && field.values) {
            doc += `\n\nValid values: ${field.values.join(', ')}`;
        }
        if (field.default !== undefined) {
            doc += `\n\nDefault: ${field.default}`;
        }
        if (field.example) {
            doc += `\n\nExample:\n\`\`\`\n${field.example}\n\`\`\``;
        }
        return doc;
    }
    getValueCompletions(fieldName, context) {
        if (!fieldName)
            return [];
        // Get the appropriate schema map based on context
        const schemaMap = (0, traitSchema_1.getSchemaMapForContext)(context.blockPath || []);
        const field = schemaMap.get(fieldName);
        // If field not found in context schema, try the trait schema as fallback
        const effectiveField = field || traitSchema_1.traitSchemaMap.get(fieldName);
        if (!effectiveField)
            return [];
        const items = [];
        switch (effectiveField.type) {
            case 'enum':
                if (effectiveField.values) {
                    for (const value of effectiveField.values) {
                        if (!context.partialValue || value.startsWith(context.partialValue)) {
                            const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.EnumMember);
                            item.detail = `Value for ${fieldName}`;
                            items.push(item);
                        }
                    }
                }
                break;
            case 'boolean':
                items.push(this.createSimpleCompletion('yes', 'Enable this option'), this.createSimpleCompletion('no', 'Disable this option'));
                break;
            case 'integer':
                // Suggest common values based on field
                const intSuggestions = this.getIntegerSuggestions(fieldName, effectiveField);
                for (const [value, desc] of intSuggestions) {
                    items.push(this.createSimpleCompletion(value, desc));
                }
                break;
            case 'float':
                const floatSuggestions = this.getFloatSuggestions(fieldName);
                for (const [value, desc] of floatSuggestions) {
                    items.push(this.createSimpleCompletion(value, desc));
                }
                break;
            case 'block':
            case 'trigger':
            case 'effect':
                // Suggest opening a block
                const blockItem = new vscode.CompletionItem('{ }', vscode.CompletionItemKind.Struct);
                blockItem.insertText = new vscode.SnippetString('{\n\t$0\n}');
                blockItem.detail = 'Open a block';
                items.push(blockItem);
                break;
            case 'string':
                // For string fields, suggest an empty string placeholder
                const stringItem = new vscode.CompletionItem('localization_key', vscode.CompletionItemKind.Text);
                stringItem.insertText = new vscode.SnippetString('${1:localization_key}');
                stringItem.detail = 'Enter a localization key';
                items.push(stringItem);
                break;
        }
        return items;
    }
    getIntegerSuggestions(fieldName, field) {
        const suggestions = [];
        // Stats typically range -5 to +5
        if (traitSchema_1.STATS.includes(fieldName)) {
            suggestions.push(['-2', 'Small penalty'], ['-1', 'Minor penalty'], ['1', 'Minor bonus'], ['2', 'Small bonus'], ['3', 'Moderate bonus'], ['5', 'Large bonus']);
        }
        // Age fields
        else if (fieldName.includes('age')) {
            suggestions.push(['0', 'From birth'], ['6', 'Childhood'], ['12', 'Pre-teen'], ['16', 'Adulthood']);
        }
        // Percentages
        else if (fieldName.includes('chance') || fieldName === 'birth' || fieldName === 'random_creation') {
            suggestions.push(['5', '5% chance'], ['10', '10% chance'], ['25', '25% chance'], ['50', '50% chance'], ['100', 'Always']);
        }
        // Ruler designer cost
        else if (fieldName === 'ruler_designer_cost') {
            suggestions.push(['-50', 'Bad trait reward'], ['-25', 'Minor bad trait reward'], ['0', 'Neutral'], ['25', 'Minor good trait cost'], ['50', 'Good trait cost'], ['100', 'Very good trait cost']);
        }
        // AI value
        else if (fieldName === 'ai_value') {
            suggestions.push(['0', 'AI ignores'], ['50', 'Low priority'], ['100', 'Normal priority'], ['200', 'High priority']);
        }
        // Opinion modifiers
        else if (fieldName.includes('opinion')) {
            suggestions.push(['-20', 'Strong negative'], ['-10', 'Moderate negative'], ['-5', 'Slight negative'], ['5', 'Slight positive'], ['10', 'Moderate positive'], ['20', 'Strong positive']);
        }
        // Default
        else {
            if (field.min !== undefined && field.max !== undefined) {
                const mid = Math.floor((field.min + field.max) / 2);
                suggestions.push([String(field.min), 'Minimum'], [String(mid), 'Middle'], [String(field.max), 'Maximum']);
            }
            else {
                suggestions.push(['1', 'Value 1'], ['5', 'Value 5'], ['10', 'Value 10']);
            }
        }
        return suggestions;
    }
    getFloatSuggestions(fieldName) {
        if (fieldName.includes('monthly')) {
            return [
                ['0.1', 'Small monthly gain'],
                ['0.25', 'Moderate monthly gain'],
                ['0.5', 'Large monthly gain'],
                ['1.0', 'Very large monthly gain'],
                ['-0.1', 'Small monthly loss'],
                ['-0.25', 'Moderate monthly loss'],
            ];
        }
        if (fieldName.includes('shift') || fieldName.includes('factor')) {
            return [
                ['0.1', '10%'],
                ['0.25', '25%'],
                ['0.5', '50%'],
                ['1.0', '100%'],
            ];
        }
        return [
            ['0.1', 'Small value'],
            ['0.5', 'Medium value'],
            ['1.0', 'Large value'],
        ];
    }
    createSimpleCompletion(label, detail) {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);
        item.detail = detail;
        return item;
    }
    getTopLevelCompletions() {
        const item = new vscode.CompletionItem('trait_name', vscode.CompletionItemKind.Class);
        item.detail = 'Define a new trait';
        item.documentation = new vscode.MarkdownString('Creates a new trait definition. Replace `trait_name` with your trait\'s unique identifier.');
        item.insertText = new vscode.SnippetString('${1:trait_name} = {\n\tcategory = ${2|personality,education,childhood,commander,lifestyle,health|}\n\t$0\n}');
        return [item];
    }
    getCompletionKind(field) {
        switch (field.type) {
            case 'boolean':
                return vscode.CompletionItemKind.Property;
            case 'enum':
                return vscode.CompletionItemKind.Enum;
            case 'block':
            case 'trigger':
            case 'effect':
                return vscode.CompletionItemKind.Struct;
            case 'modifier':
                return vscode.CompletionItemKind.Field;
            default:
                return vscode.CompletionItemKind.Property;
        }
    }
    getFieldDetail(field) {
        let detail = `(${field.type})`;
        if (field.required) {
            detail += ' [required]';
        }
        if (field.default !== undefined) {
            detail += ` = ${field.default}`;
        }
        return detail;
    }
    getFieldInsertText(field) {
        switch (field.type) {
            case 'boolean':
                return new vscode.SnippetString(`${field.name} = \${1|yes,no|}`);
            case 'enum':
                if (field.values && field.values.length > 0) {
                    const choices = field.values.join(',');
                    return new vscode.SnippetString(`${field.name} = \${1|${choices}|}`);
                }
                return new vscode.SnippetString(`${field.name} = $1`);
            case 'block':
            case 'trigger':
            case 'effect':
                return new vscode.SnippetString(`${field.name} = {\n\t$0\n}`);
            case 'integer':
                const defaultInt = field.default !== undefined ? String(field.default) : '0';
                return new vscode.SnippetString(`${field.name} = \${1:${defaultInt}}`);
            case 'float':
                const defaultFloat = field.default !== undefined ? String(field.default) : '0.0';
                return new vscode.SnippetString(`${field.name} = \${1:${defaultFloat}}`);
            default:
                return new vscode.SnippetString(`${field.name} = $1`);
        }
    }
}
exports.TraitCompletionProvider = TraitCompletionProvider;
//# sourceMappingURL=traitCompletionProvider.js.map