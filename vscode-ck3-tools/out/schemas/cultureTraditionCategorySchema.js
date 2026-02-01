"use strict";
/**
 * Schema definition for CK3 Culture Tradition Categories - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cultureTraditionCategorySchemaMap = exports.cultureTraditionCategorySchema = void 0;
exports.getCultureTraditionCategoryFieldNames = getCultureTraditionCategoryFieldNames;
exports.getCultureTraditionCategoryFieldDocumentation = getCultureTraditionCategoryFieldDocumentation;
exports.cultureTraditionCategorySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the category name.',
        example: 'name = "tradition_category_warfare"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "tradition_category_warfare_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this category.',
        example: 'icon = "gfx/interface/icons/culture/category_warfare.dds"',
    },
    // Color
    {
        name: 'color',
        type: 'block',
        description: 'Color for this category.',
        example: `color = {
    0.8 0.2 0.2
}`,
    },
    // Limits
    {
        name: 'max_traditions',
        type: 'integer',
        description: 'Maximum traditions from this category.',
        example: 'max_traditions = 3',
    },
    {
        name: 'min_traditions',
        type: 'integer',
        description: 'Minimum traditions required.',
        default: 0,
        example: 'min_traditions = 1',
    },
    // Sorting
    {
        name: 'sort_order',
        type: 'integer',
        description: 'Display sort order.',
        example: 'sort_order = 10',
    },
    // Traditions
    {
        name: 'traditions',
        type: 'list',
        description: 'Traditions in this category.',
        example: `traditions = {
    tradition_warriors
    tradition_stand_and_fight
}`,
    },
    // Requirements
    {
        name: 'ethos_requirement',
        type: 'list',
        description: 'Required ethos for this category.',
        example: `ethos_requirement = {
    ethos_bellicose
    ethos_communal
}`,
    },
    // Modifiers
    {
        name: 'category_modifier',
        type: 'block',
        description: 'Modifiers for having traditions in this category.',
        example: `category_modifier = {
    martial = 1
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for category availability.',
        example: `potential = {
    always = yes
}`,
    },
    // AI
    {
        name: 'ai_preference',
        type: 'block',
        description: 'AI preference for this category.',
        example: `ai_preference = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.cultureTraditionCategorySchemaMap = new Map(exports.cultureTraditionCategorySchema.map((field) => [field.name, field]));
function getCultureTraditionCategoryFieldNames() {
    return exports.cultureTraditionCategorySchema.map((field) => field.name);
}
function getCultureTraditionCategoryFieldDocumentation(fieldName) {
    const field = exports.cultureTraditionCategorySchemaMap.get(fieldName);
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
//# sourceMappingURL=cultureTraditionCategorySchema.js.map