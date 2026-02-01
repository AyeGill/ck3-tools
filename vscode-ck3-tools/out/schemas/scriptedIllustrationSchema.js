"use strict";
/**
 * Schema definition for CK3 Scripted Illustrations - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedIllustrationSchemaMap = exports.scriptedIllustrationSchema = void 0;
exports.getScriptedIllustrationFieldNames = getScriptedIllustrationFieldNames;
exports.getScriptedIllustrationFieldDocumentation = getScriptedIllustrationFieldDocumentation;
exports.scriptedIllustrationSchema = [
    // Basic Properties
    {
        name: 'texture',
        type: 'string',
        description: 'Path to the illustration texture.',
        example: 'texture = "gfx/interface/illustrations/event_scenes/throne_room.dds"',
    },
    {
        name: 'environment',
        type: 'string',
        description: 'Environment setup for the illustration.',
        example: 'environment = "environment_event_standard"',
    },
    // Animation
    {
        name: 'animation',
        type: 'block',
        description: 'Animation settings for the illustration.',
        example: `animation = {
    name = "idle"
    speed = 1.0
}`,
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for showing this illustration.',
        example: `trigger = {
    is_ruler = yes
}`,
    },
    // Priority
    {
        name: 'priority',
        type: 'integer',
        description: 'Selection priority among valid illustrations.',
        example: 'priority = 100',
    },
    // Character Position
    {
        name: 'position',
        type: 'block',
        description: 'Position settings for characters in the illustration.',
        example: `position = {
    x = 0.5
    y = 0.3
}`,
    },
    // Layers
    {
        name: 'layer',
        type: 'block',
        description: 'Layer definitions for the illustration.',
        example: `layer = {
    texture = "gfx/interface/illustrations/event_scenes/overlay.dds"
    blend_mode = overlay
}`,
    },
    // Reference
    {
        name: 'reference',
        type: 'string',
        description: 'Reference to another illustration definition.',
        example: 'reference = "standard_throne_room"',
    },
];
// Map for quick lookup
exports.scriptedIllustrationSchemaMap = new Map(exports.scriptedIllustrationSchema.map((field) => [field.name, field]));
function getScriptedIllustrationFieldNames() {
    return exports.scriptedIllustrationSchema.map((field) => field.name);
}
function getScriptedIllustrationFieldDocumentation(fieldName) {
    const field = exports.scriptedIllustrationSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedIllustrationSchema.js.map