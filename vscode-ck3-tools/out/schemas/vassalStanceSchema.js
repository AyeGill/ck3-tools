"use strict";
/**
 * Schema definition for CK3 Vassal Stances - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.vassalStanceSchemaMap = exports.vassalStanceSchema = void 0;
exports.getVassalStanceFieldNames = getVassalStanceFieldNames;
exports.getVassalStanceFieldDocumentation = getVassalStanceFieldDocumentation;
exports.vassalStanceSchema = [
    // Basic Properties
    {
        name: 'stance_type',
        type: 'enum',
        description: 'Type of vassal stance.',
        values: ['loyal', 'content', 'discontented', 'rebellious'],
        example: 'stance_type = loyal',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this stance.',
        example: 'icon = "gfx/interface/icons/vassal_stances/loyal.dds"',
    },
    // Requirements
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the stance to be valid.',
        example: `is_valid = {
    is_vassal_of = scope:liege
}`,
    },
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for the stance to be available.',
        example: `potential = {
    opinion = { target = liege value >= 50 }
}`,
    },
    // Modifiers
    {
        name: 'liege_modifier',
        type: 'block',
        description: 'Modifiers applied to the liege.',
        example: `liege_modifier = {
    vassal_opinion = 5
}`,
    },
    {
        name: 'vassal_modifier',
        type: 'block',
        description: 'Modifiers applied to the vassal.',
        example: `vassal_modifier = {
    monthly_prestige = 0.2
}`,
    },
    // Tax and Levy
    {
        name: 'tax_factor',
        type: 'float',
        description: 'Tax contribution factor.',
        example: 'tax_factor = 1.2',
    },
    {
        name: 'levy_factor',
        type: 'float',
        description: 'Levy contribution factor.',
        example: 'levy_factor = 1.0',
    },
    // On actions
    {
        name: 'on_stance_change',
        type: 'effect',
        description: 'Effects when changing to this stance.',
        example: `on_stance_change = {
    trigger_event = vassal_events.001
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to adopt this stance.',
        example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        opinion = { target = liege value >= 75 }
    }
}`,
    },
];
// Map for quick lookup
exports.vassalStanceSchemaMap = new Map(exports.vassalStanceSchema.map((field) => [field.name, field]));
function getVassalStanceFieldNames() {
    return exports.vassalStanceSchema.map((field) => field.name);
}
function getVassalStanceFieldDocumentation(fieldName) {
    const field = exports.vassalStanceSchemaMap.get(fieldName);
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
//# sourceMappingURL=vassalStanceSchema.js.map