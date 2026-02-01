"use strict";
/**
 * Schema definition for CK3 Coat of Arms Colors - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.coaColorSchemaMap = exports.coaColorSchema = void 0;
exports.getCoaColorFieldNames = getCoaColorFieldNames;
exports.getCoaColorFieldDocumentation = getCoaColorFieldDocumentation;
exports.coaColorSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the color name.',
        example: 'name = "coa_color_azure"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "coa_color_azure_desc"',
    },
    // Color Values
    {
        name: 'color',
        type: 'block',
        description: 'RGB color values (0-1 range).',
        example: `color = {
    0.2 0.4 0.8
}`,
    },
    {
        name: 'color_hex',
        type: 'string',
        description: 'Hexadecimal color value.',
        example: 'color_hex = "#3366CC"',
    },
    // Category
    {
        name: 'category',
        type: 'enum',
        description: 'Color category.',
        values: ['metal', 'colour', 'fur', 'special'],
        example: 'category = colour',
    },
    // Heraldic
    {
        name: 'heraldic_name',
        type: 'string',
        description: 'Heraldic term for this color.',
        example: 'heraldic_name = "azure"',
    },
    // Contrast
    {
        name: 'contrast_colors',
        type: 'list',
        description: 'Colors that contrast well.',
        example: `contrast_colors = {
    or
    argent
}`,
    },
    // Weight
    {
        name: 'weight',
        type: 'integer',
        description: 'Selection weight for random generation.',
        example: 'weight = 100',
    },
    // Restrictions
    {
        name: 'allowed_with',
        type: 'list',
        description: 'Colors allowed to be combined with.',
        example: `allowed_with = {
    or
    argent
    ermine
}`,
    },
    // Texture
    {
        name: 'texture',
        type: 'string',
        description: 'Optional texture overlay.',
        example: 'texture = "gfx/coat_of_arms/textures/fur.dds"',
    },
    // Pattern
    {
        name: 'pattern',
        type: 'string',
        description: 'Optional pattern for fur colors.',
        example: 'pattern = "ermine_pattern"',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for color availability.',
        example: `potential = {
    always = yes
}`,
    },
];
// Map for quick lookup
exports.coaColorSchemaMap = new Map(exports.coaColorSchema.map((field) => [field.name, field]));
function getCoaColorFieldNames() {
    return exports.coaColorSchema.map((field) => field.name);
}
function getCoaColorFieldDocumentation(fieldName) {
    const field = exports.coaColorSchemaMap.get(fieldName);
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
//# sourceMappingURL=coaColorSchema.js.map