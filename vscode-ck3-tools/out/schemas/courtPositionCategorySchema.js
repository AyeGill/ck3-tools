"use strict";
/**
 * Schema definition for CK3 Court Position Categories - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.courtPositionCategorySchemaMap = exports.courtPositionCategorySchema = void 0;
exports.getCourtPositionCategoryFieldNames = getCourtPositionCategoryFieldNames;
exports.getCourtPositionCategoryFieldDocumentation = getCourtPositionCategoryFieldDocumentation;
exports.courtPositionCategorySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the category name.',
        example: 'name = "court_position_category_administrative"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the category description.',
        example: 'desc = "court_position_category_administrative_desc"',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the category.',
        example: 'icon = "gfx/interface/icons/court_positions/administrative.dds"',
    },
    // Order
    {
        name: 'order',
        type: 'integer',
        description: 'Display order for the category.',
        example: 'order = 10',
    },
    // Visibility
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for showing this category.',
        example: `is_shown = {
    has_royal_court = yes
}`,
    },
    // Default
    {
        name: 'default',
        type: 'boolean',
        description: 'Whether this is the default category.',
        default: false,
        example: 'default = yes',
    },
];
// Map for quick lookup
exports.courtPositionCategorySchemaMap = new Map(exports.courtPositionCategorySchema.map((field) => [field.name, field]));
function getCourtPositionCategoryFieldNames() {
    return exports.courtPositionCategorySchema.map((field) => field.name);
}
function getCourtPositionCategoryFieldDocumentation(fieldName) {
    const field = exports.courtPositionCategorySchemaMap.get(fieldName);
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
//# sourceMappingURL=courtPositionCategorySchema.js.map