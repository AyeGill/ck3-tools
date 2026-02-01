"use strict";
/**
 * Schema definition for CK3 Named Colors - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.namedColorsSchemaMap = exports.namedColorsSchema = void 0;
exports.getNamedColorsFieldNames = getNamedColorsFieldNames;
exports.getNamedColorsFieldDocumentation = getNamedColorsFieldDocumentation;
exports.namedColorsSchema = [
    // Color definitions are simple: name = { r g b } or name = hsv { h s v }
    // This schema is minimal as colors are straightforward
    {
        name: 'rgb',
        type: 'block',
        description: 'RGB color values (0-255 or 0.0-1.0).',
        example: 'my_color = rgb { 128 64 192 }',
    },
    {
        name: 'hsv',
        type: 'block',
        description: 'HSV color values (0.0-1.0).',
        example: 'my_color = hsv { 0.5 0.8 0.9 }',
    },
    {
        name: 'hsv360',
        type: 'block',
        description: 'HSV color values with 360-degree hue.',
        example: 'my_color = hsv360 { 180 80 90 }',
    },
    {
        name: 'hex',
        type: 'string',
        description: 'Hexadecimal color value.',
        example: 'my_color = hex { 8040c0ff }',
    },
];
// Map for quick lookup
exports.namedColorsSchemaMap = new Map(exports.namedColorsSchema.map((field) => [field.name, field]));
function getNamedColorsFieldNames() {
    return exports.namedColorsSchema.map((field) => field.name);
}
function getNamedColorsFieldDocumentation(fieldName) {
    const field = exports.namedColorsSchemaMap.get(fieldName);
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
//# sourceMappingURL=namedColorsSchema.js.map