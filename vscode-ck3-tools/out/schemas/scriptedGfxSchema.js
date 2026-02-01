"use strict";
/**
 * Schema definition for CK3 Scripted GFX - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedGfxSchemaMap = exports.scriptedGfxSchema = void 0;
exports.getScriptedGfxFieldNames = getScriptedGfxFieldNames;
exports.getScriptedGfxFieldDocumentation = getScriptedGfxFieldDocumentation;
exports.scriptedGfxSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name identifier for the scripted GFX.',
        example: 'name = "my_custom_gfx"',
    },
    {
        name: 'texture',
        type: 'string',
        description: 'Path to the texture file.',
        example: 'texture = "gfx/interface/icons/custom_icon.dds"',
    },
    // Frame
    {
        name: 'frame',
        type: 'integer',
        description: 'Frame number to display.',
        example: 'frame = 1',
    },
    {
        name: 'framesize',
        type: 'block',
        description: 'Size of each frame in pixels.',
        example: 'framesize = { 64 64 }',
    },
    {
        name: 'noofframes',
        type: 'integer',
        description: 'Total number of frames in the texture.',
        example: 'noofframes = 8',
    },
    // Animation
    {
        name: 'animation_rate',
        type: 'float',
        description: 'Rate of animation playback.',
        example: 'animation_rate = 1.0',
    },
    {
        name: 'looping',
        type: 'boolean',
        description: 'Whether the animation loops.',
        default: true,
        example: 'looping = yes',
    },
    // Conditions
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this GFX to be used.',
        example: `trigger = {
    is_ruler = yes
}`,
    },
    // Effects
    {
        name: 'effect',
        type: 'string',
        description: 'Visual effect to apply.',
        example: 'effect = "glow"',
    },
    // Color
    {
        name: 'color',
        type: 'block',
        description: 'Color tint to apply.',
        example: 'color = { 1.0 0.8 0.6 1.0 }',
    },
    // Scale
    {
        name: 'scale',
        type: 'float',
        description: 'Scale factor for the GFX.',
        example: 'scale = 1.5',
    },
];
// Map for quick lookup
exports.scriptedGfxSchemaMap = new Map(exports.scriptedGfxSchema.map((field) => [field.name, field]));
function getScriptedGfxFieldNames() {
    return exports.scriptedGfxSchema.map((field) => field.name);
}
function getScriptedGfxFieldDocumentation(fieldName) {
    const field = exports.scriptedGfxSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedGfxSchema.js.map