"use strict";
/**
 * Schema definition for CK3 Character Interaction Categories - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterInteractionCategorySchemaMap = exports.characterInteractionCategorySchema = void 0;
exports.getCharacterInteractionCategoryFieldNames = getCharacterInteractionCategoryFieldNames;
exports.getCharacterInteractionCategoryFieldDocumentation = getCharacterInteractionCategoryFieldDocumentation;
exports.characterInteractionCategorySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the category name.',
        example: 'name = "interaction_category_hostile"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the category description.',
        example: 'desc = "interaction_category_hostile_desc"',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the category.',
        example: 'icon = "gfx/interface/icons/interaction_categories/hostile.dds"',
    },
    // Order
    {
        name: 'order',
        type: 'integer',
        description: 'Display order in the menu.',
        example: 'order = 10',
    },
    // Visibility
    {
        name: 'visible',
        type: 'trigger',
        description: 'Conditions for showing this category.',
        example: `visible = {
    always = yes
}`,
    },
    // Interactions
    {
        name: 'interactions',
        type: 'list',
        description: 'List of interactions in this category.',
        example: `interactions = {
    murder_interaction
    fabricate_hook_interaction
}`,
    },
    // Default
    {
        name: 'default',
        type: 'boolean',
        description: 'Whether this is the default category.',
        default: false,
        example: 'default = no',
    },
    // Collapsible
    {
        name: 'collapsible',
        type: 'boolean',
        description: 'Whether the category can be collapsed.',
        default: true,
        example: 'collapsible = yes',
    },
];
// Map for quick lookup
exports.characterInteractionCategorySchemaMap = new Map(exports.characterInteractionCategorySchema.map((field) => [field.name, field]));
function getCharacterInteractionCategoryFieldNames() {
    return exports.characterInteractionCategorySchema.map((field) => field.name);
}
function getCharacterInteractionCategoryFieldDocumentation(fieldName) {
    const field = exports.characterInteractionCategorySchemaMap.get(fieldName);
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
//# sourceMappingURL=characterInteractionCategorySchema.js.map