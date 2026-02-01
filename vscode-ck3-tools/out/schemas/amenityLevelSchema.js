"use strict";
/**
 * Schema definition for CK3 Amenity Levels - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.amenityLevelSchemaMap = exports.amenityLevelSchema = void 0;
exports.getAmenityLevelFieldNames = getAmenityLevelFieldNames;
exports.getAmenityLevelFieldDocumentation = getAmenityLevelFieldDocumentation;
exports.amenityLevelSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the level name.',
        example: 'name = "amenity_level_lavish"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "amenity_level_lavish_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this amenity level.',
        example: 'icon = "gfx/interface/icons/amenity/lavish.dds"',
    },
    // Level
    {
        name: 'level',
        type: 'integer',
        description: 'Numeric level.',
        example: 'level = 3',
    },
    // Amenity Type
    {
        name: 'amenity_type',
        type: 'string',
        description: 'Type of amenity this level belongs to.',
        example: 'amenity_type = food_quality',
    },
    // Modifiers
    {
        name: 'owner_modifier',
        type: 'block',
        description: 'Modifiers applied to owner.',
        example: `owner_modifier = {
    monthly_prestige = 0.5
    stress_gain_mult = -0.1
}`,
    },
    {
        name: 'courtier_modifier',
        type: 'block',
        description: 'Modifiers applied to courtiers.',
        example: `courtier_modifier = {
    courtier_opinion = 10
}`,
    },
    {
        name: 'guest_modifier',
        type: 'block',
        description: 'Modifiers applied to guests.',
        example: `guest_modifier = {
    guest_opinion = 5
}`,
    },
    // Cost
    {
        name: 'cost',
        type: 'float',
        description: 'Monthly cost for this level.',
        example: 'cost = 2.0',
    },
    // Grandeur
    {
        name: 'grandeur_baseline',
        type: 'integer',
        description: 'Grandeur baseline contribution.',
        example: 'grandeur_baseline = 5',
    },
    // AI
    {
        name: 'ai_preference',
        type: 'block',
        description: 'AI preference for this level.',
        example: `ai_preference = {
    base = 100
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for level availability.',
        example: `potential = {
    gold >= monthly_character_income
}`,
    },
];
// Map for quick lookup
exports.amenityLevelSchemaMap = new Map(exports.amenityLevelSchema.map((field) => [field.name, field]));
function getAmenityLevelFieldNames() {
    return exports.amenityLevelSchema.map((field) => field.name);
}
function getAmenityLevelFieldDocumentation(fieldName) {
    const field = exports.amenityLevelSchemaMap.get(fieldName);
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
//# sourceMappingURL=amenityLevelSchema.js.map