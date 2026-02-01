"use strict";
/**
 * Schema definition for CK3 Pilgrimage Types - autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pilgrimageTypeSchemaMap = exports.pilgrimageTypeSchema = void 0;
exports.getPilgrimageTypeFieldNames = getPilgrimageTypeFieldNames;
exports.getPilgrimageTypeFieldDocumentation = getPilgrimageTypeFieldDocumentation;
exports.pilgrimageTypeSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the pilgrimage name.',
        example: 'name = "pilgrimage_jerusalem"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "pilgrimage_jerusalem_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this pilgrimage.',
        example: 'icon = "gfx/interface/icons/pilgrimage/jerusalem.dds"',
    },
    // Religion
    {
        name: 'religion',
        type: 'string',
        description: 'Religion this pilgrimage belongs to.',
        example: 'religion = christianity_religion',
    },
    // Holy Site
    {
        name: 'holy_site',
        type: 'string',
        description: 'Target holy site.',
        example: 'holy_site = jerusalem',
    },
    // Duration
    {
        name: 'duration',
        type: 'integer',
        description: 'Base duration in days.',
        example: 'duration = 365',
    },
    // Piety
    {
        name: 'piety_gain',
        type: 'integer',
        description: 'Piety gained on completion.',
        example: 'piety_gain = 500',
    },
    // Cost
    {
        name: 'cost',
        type: 'block',
        description: 'Cost to embark.',
        example: `cost = {
    gold = 100
    piety = 50
}`,
    },
    // Modifiers
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Character modifiers during pilgrimage.',
        example: `character_modifier = {
    monthly_piety = 1
    diplomacy = -2
}`,
    },
    {
        name: 'completion_modifier',
        type: 'block',
        description: 'Modifier applied on completion.',
        example: `completion_modifier = {
    piety_mult = 0.1
    learning = 2
}`,
    },
    // Effects
    {
        name: 'on_start',
        type: 'effect',
        description: 'Effects when pilgrimage starts.',
        example: `on_start = {
    add_character_flag = on_pilgrimage
}`,
    },
    {
        name: 'on_complete',
        type: 'effect',
        description: 'Effects when completed.',
        example: `on_complete = {
    add_trait = pilgrim
    add_piety = 500
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    faith = { religion = religion:christianity_religion }
}`,
    },
    {
        name: 'can_embark',
        type: 'trigger',
        description: 'Conditions to embark.',
        example: `can_embark = {
    gold >= 100
    is_at_war = no
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.pilgrimageTypeSchemaMap = new Map(exports.pilgrimageTypeSchema.map((field) => [field.name, field]));
function getPilgrimageTypeFieldNames() {
    return exports.pilgrimageTypeSchema.map((field) => field.name);
}
function getPilgrimageTypeFieldDocumentation(fieldName) {
    const field = exports.pilgrimageTypeSchemaMap.get(fieldName);
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
//# sourceMappingURL=pilgrimageTypeSchema.js.map