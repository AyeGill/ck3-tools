"use strict";
/**
 * Schema definition for CK3 Character Interaction Categories - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactionCategorySchemaMap = exports.interactionCategorySchema = void 0;
exports.getInteractionCategoryFieldNames = getInteractionCategoryFieldNames;
exports.getInteractionCategoryFieldDocumentation = getInteractionCategoryFieldDocumentation;
exports.interactionCategorySchema = [
    // Basic Properties
    {
        name: 'index',
        type: 'integer',
        description: 'Display order index for the category.',
        example: 'index = 10',
    },
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the category name.',
        example: 'name = "interaction_category_diplomacy"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the category description.',
        example: 'desc = "interaction_category_diplomacy_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the category.',
        example: 'icon = "gfx/interface/icons/interaction_categories/diplomacy.dds"',
    },
    // Visibility
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for showing this category.',
        example: `is_shown = {
    NOT = { this = scope:recipient }
}`,
    },
    // Default Category
    {
        name: 'default',
        type: 'boolean',
        description: 'Whether this is the default category.',
        default: false,
        example: 'default = yes',
    },
    // Special Categories
    {
        name: 'special',
        type: 'enum',
        description: 'Special category type.',
        values: ['prison', 'hostile', 'vassal', 'religious', 'intrigue'],
        example: 'special = hostile',
    },
];
// Map for quick lookup
exports.interactionCategorySchemaMap = new Map(exports.interactionCategorySchema.map((field) => [field.name, field]));
function getInteractionCategoryFieldNames() {
    return exports.interactionCategorySchema.map((field) => field.name);
}
function getInteractionCategoryFieldDocumentation(fieldName) {
    const field = exports.interactionCategorySchemaMap.get(fieldName);
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
//# sourceMappingURL=interactionCategorySchema.js.map