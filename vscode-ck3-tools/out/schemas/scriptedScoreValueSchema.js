"use strict";
/**
 * Schema definition for CK3 Scripted Score Values - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedScoreValueSchemaMap = exports.scriptedScoreValueSchema = void 0;
exports.getScriptedScoreValueFieldNames = getScriptedScoreValueFieldNames;
exports.getScriptedScoreValueFieldDocumentation = getScriptedScoreValueFieldDocumentation;
exports.scriptedScoreValueSchema = [
    // Base Value
    {
        name: 'base',
        type: 'integer',
        description: 'Base value for the score.',
        example: 'base = 100',
    },
    // Modifiers
    {
        name: 'modifier',
        type: 'block',
        description: 'Conditional modifier to the score.',
        example: `modifier = {
    add = 50
    has_trait = ambitious
}`,
    },
    {
        name: 'add',
        type: 'integer',
        description: 'Value to add to the score.',
        example: 'add = 25',
    },
    {
        name: 'multiply',
        type: 'float',
        description: 'Multiplier for the score.',
        example: 'multiply = 1.5',
    },
    {
        name: 'min',
        type: 'integer',
        description: 'Minimum value for the score.',
        example: 'min = 0',
    },
    {
        name: 'max',
        type: 'integer',
        description: 'Maximum value for the score.',
        example: 'max = 1000',
    },
    // Factor
    {
        name: 'factor',
        type: 'float',
        description: 'Factor to multiply the final score.',
        example: 'factor = 2.0',
    },
    // Conditional Values
    {
        name: 'if',
        type: 'block',
        description: 'Conditional score calculation.',
        example: `if = {
    limit = { is_ruler = yes }
    add = 100
}`,
    },
    {
        name: 'else_if',
        type: 'block',
        description: 'Alternative conditional calculation.',
        example: `else_if = {
    limit = { is_knight = yes }
    add = 50
}`,
    },
    {
        name: 'else',
        type: 'block',
        description: 'Default calculation if no conditions match.',
        example: `else = {
    add = 10
}`,
    },
    // Comparison Value
    {
        name: 'value',
        type: 'integer',
        description: 'Direct value assignment.',
        example: 'value = 500',
    },
    // Description
    {
        name: 'desc',
        type: 'string',
        description: 'Description shown in tooltips.',
        example: 'desc = "score_value_description"',
    },
];
// Map for quick lookup
exports.scriptedScoreValueSchemaMap = new Map(exports.scriptedScoreValueSchema.map((field) => [field.name, field]));
function getScriptedScoreValueFieldNames() {
    return exports.scriptedScoreValueSchema.map((field) => field.name);
}
function getScriptedScoreValueFieldDocumentation(fieldName) {
    const field = exports.scriptedScoreValueSchemaMap.get(fieldName);
    if (!field)
        return undefined;
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
//# sourceMappingURL=scriptedScoreValueSchema.js.map