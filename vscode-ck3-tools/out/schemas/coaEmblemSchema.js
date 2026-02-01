"use strict";
/**
 * Schema definition for CK3 Coat of Arms Emblems - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.coaEmblemSchemaMap = exports.coaEmblemSchema = void 0;
exports.getCoaEmblemFieldNames = getCoaEmblemFieldNames;
exports.getCoaEmblemFieldDocumentation = getCoaEmblemFieldDocumentation;
exports.coaEmblemSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Internal name of the emblem.',
        example: 'name = "emblem_lion"',
    },
    // Texture
    {
        name: 'texture',
        type: 'string',
        description: 'Texture file for the emblem.',
        example: 'texture = "gfx/coat_of_arms/emblems/lion.dds"',
    },
    {
        name: 'texture_path',
        type: 'string',
        description: 'Path to the emblem texture.',
        example: 'texture_path = "gfx/coat_of_arms/emblems/"',
    },
    // Colors
    {
        name: 'colors',
        type: 'integer',
        description: 'Number of colors used by this emblem.',
        example: 'colors = 1',
    },
    {
        name: 'color1',
        type: 'block',
        description: 'First color definition.',
        example: `color1 = {
    red = 1.0
    green = 0.8
    blue = 0.0
}`,
    },
    {
        name: 'color2',
        type: 'block',
        description: 'Second color definition.',
        example: `color2 = {
    red = 0.0
    green = 0.0
    blue = 0.0
}`,
    },
    // Position
    {
        name: 'position',
        type: 'block',
        description: 'Position of the emblem on the shield.',
        example: `position = {
    x = 0.5
    y = 0.5
}`,
    },
    {
        name: 'scale',
        type: 'block',
        description: 'Scale of the emblem.',
        example: `scale = {
    x = 0.8
    y = 0.8
}`,
    },
    {
        name: 'rotation',
        type: 'float',
        description: 'Rotation angle in degrees.',
        example: 'rotation = 0',
    },
    // Category
    {
        name: 'category',
        type: 'enum',
        description: 'Category of the emblem.',
        values: ['animals', 'plants', 'symbols', 'objects', 'crosses', 'religious', 'special'],
        example: 'category = animals',
    },
    // Mask
    {
        name: 'mask',
        type: 'list',
        description: 'Color mask indices.',
        example: `mask = {
    1 2
}`,
    },
    // Weight
    {
        name: 'weight',
        type: 'integer',
        description: 'Generation weight for random selection.',
        example: 'weight = 100',
    },
    // Visibility
    {
        name: 'visible',
        type: 'boolean',
        description: 'Whether emblem appears in designer.',
        default: true,
        example: 'visible = yes',
    },
    // Instance
    {
        name: 'instance',
        type: 'list',
        description: 'Multiple instances of the emblem.',
        example: `instance = {
    position = { 0.25 0.5 }
    scale = { 0.4 0.4 }
}`,
    },
    // Depth
    {
        name: 'depth',
        type: 'float',
        description: 'Depth layer for rendering order.',
        example: 'depth = 1.0',
    },
];
// Map for quick lookup
exports.coaEmblemSchemaMap = new Map(exports.coaEmblemSchema.map((field) => [field.name, field]));
function getCoaEmblemFieldNames() {
    return exports.coaEmblemSchema.map((field) => field.name);
}
function getCoaEmblemFieldDocumentation(fieldName) {
    const field = exports.coaEmblemSchemaMap.get(fieldName);
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
//# sourceMappingURL=coaEmblemSchema.js.map