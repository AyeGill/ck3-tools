"use strict";
/**
 * Schema definition for CK3 Succession Parameters - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.successionParameterSchemaMap = exports.successionParameterSchema = void 0;
exports.getSuccessionParameterFieldNames = getSuccessionParameterFieldNames;
exports.getSuccessionParameterFieldDocumentation = getSuccessionParameterFieldDocumentation;
exports.successionParameterSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the parameter name.',
        example: 'name = "succession_parameter_primogeniture"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "succession_parameter_primogeniture_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this parameter.',
        example: 'icon = "gfx/interface/icons/succession/primogeniture.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of succession parameter.',
        values: ['gender', 'order', 'division', 'election', 'special'],
        example: 'type = order',
    },
    // Value
    {
        name: 'value',
        type: 'string',
        description: 'Parameter value.',
        example: 'value = "eldest_first"',
    },
    // Modifiers
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Modifiers applied to ruler.',
        example: `character_modifier = {
    vassal_opinion = 5
}`,
    },
    {
        name: 'heir_modifier',
        type: 'block',
        description: 'Modifiers applied to heir.',
        example: `heir_modifier = {
    diplomacy = 1
}`,
    },
    // Score
    {
        name: 'score',
        type: 'block',
        description: 'Heir score calculation.',
        example: `score = {
    base = 100
    modifier = {
        add = 1000
        is_primary_heir = yes
    }
}`,
    },
    // Gender
    {
        name: 'gender_law',
        type: 'enum',
        description: 'Gender succession law.',
        values: ['male_only', 'male_preference', 'equal', 'female_preference', 'female_only'],
        example: 'gender_law = male_preference',
    },
    // Effects
    {
        name: 'on_succession',
        type: 'effect',
        description: 'Effects on succession.',
        example: `on_succession = {
    add_prestige = 100
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for parameter availability.',
        example: `potential = {
    has_government = feudal_government
}`,
    },
    {
        name: 'can_use',
        type: 'trigger',
        description: 'Conditions to use this parameter.',
        example: `can_use = {
    has_innovation = innovation_heraldry
}`,
    },
    // Cost
    {
        name: 'prestige_cost',
        type: 'integer',
        description: 'Prestige cost to change.',
        example: 'prestige_cost = 500',
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for this parameter.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.successionParameterSchemaMap = new Map(exports.successionParameterSchema.map((field) => [field.name, field]));
function getSuccessionParameterFieldNames() {
    return exports.successionParameterSchema.map((field) => field.name);
}
function getSuccessionParameterFieldDocumentation(fieldName) {
    const field = exports.successionParameterSchemaMap.get(fieldName);
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
//# sourceMappingURL=successionParameterSchema.js.map