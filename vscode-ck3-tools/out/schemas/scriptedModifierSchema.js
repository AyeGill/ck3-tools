"use strict";
/**
 * Schema definition for CK3 Scripted Modifiers - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedModifierSchemaMap = exports.scriptedModifierSchema = void 0;
exports.getScriptedModifierFieldNames = getScriptedModifierFieldNames;
exports.getScriptedModifierFieldDocumentation = getScriptedModifierFieldDocumentation;
exports.scriptedModifierSchema = [
    // Basic Properties
    {
        name: 'base',
        type: 'float',
        description: 'Base value for the modifier calculation.',
        example: 'base = 100',
    },
    {
        name: 'add',
        type: 'float',
        description: 'Add a flat value.',
        example: 'add = 50',
    },
    {
        name: 'multiply',
        type: 'float',
        description: 'Multiply the current value.',
        example: 'multiply = 1.5',
    },
    {
        name: 'min',
        type: 'float',
        description: 'Minimum value floor.',
        example: 'min = 0',
    },
    {
        name: 'max',
        type: 'float',
        description: 'Maximum value cap.',
        example: 'max = 1000',
    },
    // Conditional modifiers
    {
        name: 'modifier',
        type: 'block',
        description: 'Conditional modifier block.',
        example: `modifier = {
    add = 25
    is_ruler = yes
}`,
    },
    // Opinion modifiers
    {
        name: 'opinion_modifier',
        type: 'block',
        description: 'Opinion-based modifier.',
        example: `opinion_modifier = {
    who = scope:target
    opinion_target = root
    multiplier = 0.5
}`,
    },
    // AI modifiers
    {
        name: 'ai_value_modifier',
        type: 'block',
        description: 'AI value modification block.',
        example: `ai_value_modifier = {
    ai_boldness = 0.5
    ai_greed = -0.25
}`,
    },
    // Comparison
    {
        name: 'compare_modifier',
        type: 'block',
        description: 'Compare two values for modification.',
        example: `compare_modifier = {
    value = scope:target.martial
    multiplier = 2
}`,
    },
];
// Map for quick lookup
exports.scriptedModifierSchemaMap = new Map(exports.scriptedModifierSchema.map((field) => [field.name, field]));
function getScriptedModifierFieldNames() {
    return exports.scriptedModifierSchema.map((field) => field.name);
}
function getScriptedModifierFieldDocumentation(fieldName) {
    const field = exports.scriptedModifierSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedModifierSchema.js.map