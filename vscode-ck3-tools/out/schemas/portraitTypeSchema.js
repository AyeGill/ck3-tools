"use strict";
/**
 * Schema definition for CK3 Portrait Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.portraitTypeSchemaMap = exports.portraitTypeSchema = void 0;
exports.getPortraitTypeFieldNames = getPortraitTypeFieldNames;
exports.getPortraitTypeFieldDocumentation = getPortraitTypeFieldDocumentation;
exports.portraitTypeSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name identifier for the portrait type.',
        example: 'name = "portrait_type_bust"',
    },
    // Camera
    {
        name: 'camera',
        type: 'string',
        description: 'Camera preset to use.',
        example: 'camera = "camera_bust"',
    },
    // Size
    {
        name: 'width',
        type: 'integer',
        description: 'Width of the portrait.',
        example: 'width = 200',
    },
    {
        name: 'height',
        type: 'integer',
        description: 'Height of the portrait.',
        example: 'height = 300',
    },
    // Animation
    {
        name: 'animation',
        type: 'string',
        description: 'Default animation.',
        example: 'animation = "idle"',
    },
    {
        name: 'animation_set',
        type: 'string',
        description: 'Animation set to use.',
        example: 'animation_set = "portrait_animations"',
    },
    // Background
    {
        name: 'background',
        type: 'string',
        description: 'Background asset.',
        example: 'background = "gfx/portraits/backgrounds/default.dds"',
    },
    // Lighting
    {
        name: 'lighting',
        type: 'string',
        description: 'Lighting preset.',
        example: 'lighting = "portrait_lighting"',
    },
    // Frame
    {
        name: 'frame',
        type: 'string',
        description: 'Frame asset.',
        example: 'frame = "gfx/portraits/frames/default.dds"',
    },
    // Mask
    {
        name: 'mask',
        type: 'string',
        description: 'Mask texture.',
        example: 'mask = "gfx/portraits/masks/circle.dds"',
    },
    // Render
    {
        name: 'render_type',
        type: 'enum',
        description: 'Render type for portrait.',
        values: ['full', 'bust', 'head', 'icon'],
        example: 'render_type = bust',
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for using this portrait type.',
        example: `trigger = {
    is_ruler = yes
}`,
    },
];
// Map for quick lookup
exports.portraitTypeSchemaMap = new Map(exports.portraitTypeSchema.map((field) => [field.name, field]));
function getPortraitTypeFieldNames() {
    return exports.portraitTypeSchema.map((field) => field.name);
}
function getPortraitTypeFieldDocumentation(fieldName) {
    const field = exports.portraitTypeSchemaMap.get(fieldName);
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
//# sourceMappingURL=portraitTypeSchema.js.map