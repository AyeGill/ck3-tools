"use strict";
/**
 * Schema definition for CK3 Event Backgrounds - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBackgroundSchemaMap = exports.eventBackgroundSchema = void 0;
exports.getEventBackgroundFieldNames = getEventBackgroundFieldNames;
exports.getEventBackgroundFieldDocumentation = getEventBackgroundFieldDocumentation;
exports.eventBackgroundSchema = [
    // Basic Properties
    {
        name: 'background',
        type: 'string',
        description: 'Path to the background texture.',
        example: 'background = "gfx/interface/event_window/event_backgrounds/my_background.dds"',
    },
    {
        name: 'environment',
        type: 'string',
        description: 'Environment preset for 3D portraits.',
        example: 'environment = "environment_event_council"',
    },
    {
        name: 'ambience',
        type: 'string',
        description: 'Ambience sound effect.',
        example: 'ambience = "event:/SFX/Events/Ambience/castle_interior"',
    },
    // Conditions
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this background to be selected.',
        example: `trigger = {
    location = {
        terrain = mountains
    }
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Validity conditions for the background.',
        example: `is_valid = {
    exists = location
}`,
    },
    // Reference
    {
        name: 'reference',
        type: 'string',
        description: 'Reference to another background definition.',
        example: 'reference = "throne_room"',
    },
];
// Map for quick lookup
exports.eventBackgroundSchemaMap = new Map(exports.eventBackgroundSchema.map((field) => [field.name, field]));
function getEventBackgroundFieldNames() {
    return exports.eventBackgroundSchema.map((field) => field.name);
}
function getEventBackgroundFieldDocumentation(fieldName) {
    const field = exports.eventBackgroundSchemaMap.get(fieldName);
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
//# sourceMappingURL=eventBackgroundSchema.js.map