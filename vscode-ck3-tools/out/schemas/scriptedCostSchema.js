"use strict";
/**
 * Schema definition for CK3 Scripted Costs - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedCostSchemaMap = exports.scriptedCostSchema = void 0;
exports.getScriptedCostFieldNames = getScriptedCostFieldNames;
exports.getScriptedCostFieldDocumentation = getScriptedCostFieldDocumentation;
exports.scriptedCostSchema = [
    // Cost types
    {
        name: 'gold',
        type: 'block',
        description: 'Gold cost calculation.',
        example: `gold = {
    value = 100
    multiply = {
        value = 0.5
        if = {
            limit = { has_trait = greedy }
        }
    }
}`,
    },
    {
        name: 'prestige',
        type: 'block',
        description: 'Prestige cost calculation.',
        example: `prestige = {
    value = 50
    add = {
        value = 10
        every_vassal = { count = yes }
    }
}`,
    },
    {
        name: 'piety',
        type: 'block',
        description: 'Piety cost calculation.',
        example: `piety = {
    value = 100
}`,
    },
    {
        name: 'renown',
        type: 'block',
        description: 'Renown cost calculation.',
        example: `renown = {
    value = 250
}`,
    },
    // Conditional costs
    {
        name: 'if',
        type: 'block',
        description: 'Conditional cost modification.',
        example: `if = {
    limit = { has_trait = greedy }
    gold = { multiply = 0.5 }
}`,
    },
    {
        name: 'else_if',
        type: 'block',
        description: 'Alternative conditional cost.',
        example: `else_if = {
    limit = { has_trait = generous }
    gold = { multiply = 1.5 }
}`,
    },
    {
        name: 'else',
        type: 'block',
        description: 'Default cost if no conditions match.',
        example: `else = {
    gold = { value = 100 }
}`,
    },
    // Scaling
    {
        name: 'multiply',
        type: 'block',
        description: 'Multiply the cost.',
        example: `multiply = {
    value = tier_difference
}`,
    },
    {
        name: 'add',
        type: 'block',
        description: 'Add to the cost.',
        example: `add = {
    value = 50
}`,
    },
    {
        name: 'min',
        type: 'integer',
        description: 'Minimum cost value.',
        example: 'min = 10',
    },
    {
        name: 'max',
        type: 'integer',
        description: 'Maximum cost value.',
        example: 'max = 1000',
    },
];
// Map for quick lookup
exports.scriptedCostSchemaMap = new Map(exports.scriptedCostSchema.map((field) => [field.name, field]));
function getScriptedCostFieldNames() {
    return exports.scriptedCostSchema.map((field) => field.name);
}
function getScriptedCostFieldDocumentation(fieldName) {
    const field = exports.scriptedCostSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedCostSchema.js.map