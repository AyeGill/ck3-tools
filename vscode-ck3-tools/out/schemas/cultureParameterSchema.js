"use strict";
/**
 * Schema definition for CK3 Culture Parameters - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cultureParameterSchemaMap = exports.cultureParameterSchema = void 0;
exports.getCultureParameterFieldNames = getCultureParameterFieldNames;
exports.getCultureParameterFieldDocumentation = getCultureParameterFieldDocumentation;
exports.cultureParameterSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the parameter name.',
        example: 'name = "culture_parameter_can_diverge"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "culture_parameter_can_diverge_desc"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of parameter.',
        values: ['boolean', 'integer', 'float', 'modifier'],
        example: 'type = boolean',
    },
    // Default Value
    {
        name: 'default',
        type: 'string',
        description: 'Default parameter value.',
        example: 'default = yes',
    },
    // Categories
    {
        name: 'category',
        type: 'enum',
        description: 'Parameter category.',
        values: ['general', 'military', 'diplomacy', 'religion', 'economy'],
        example: 'category = general',
    },
    // Modifiers
    {
        name: 'modifier_if_true',
        type: 'block',
        description: 'Modifiers when true.',
        example: `modifier_if_true = {
    cultural_acceptance_gain_mult = 0.25
}`,
    },
    {
        name: 'modifier_if_false',
        type: 'block',
        description: 'Modifiers when false.',
        example: `modifier_if_false = {
    cultural_acceptance_gain_mult = -0.25
}`,
    },
    // Effects
    {
        name: 'on_change',
        type: 'effect',
        description: 'Effects when parameter changes.',
        example: `on_change = {
    trigger_event = culture_events.1000
}`,
    },
    // Cost
    {
        name: 'change_cost',
        type: 'block',
        description: 'Cost to change parameter.',
        example: `change_cost = {
    prestige = 500
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    always = yes
}`,
    },
    {
        name: 'can_change',
        type: 'trigger',
        description: 'Conditions to change.',
        example: `can_change = {
    prestige >= 500
}`,
    },
    // AI
    {
        name: 'ai_preference',
        type: 'block',
        description: 'AI preference weight.',
        example: `ai_preference = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.cultureParameterSchemaMap = new Map(exports.cultureParameterSchema.map((field) => [field.name, field]));
function getCultureParameterFieldNames() {
    return exports.cultureParameterSchema.map((field) => field.name);
}
function getCultureParameterFieldDocumentation(fieldName) {
    const field = exports.cultureParameterSchemaMap.get(fieldName);
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
//# sourceMappingURL=cultureParameterSchema.js.map