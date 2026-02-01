"use strict";
/**
 * Schema definition for CK3 Messages - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageSchemaMap = exports.messageSchema = exports.MESSAGE_TYPES = void 0;
exports.getMessageFieldNames = getMessageFieldNames;
exports.getMessageFieldDocumentation = getMessageFieldDocumentation;
exports.MESSAGE_TYPES = [
    'character',
    'title',
    'war',
    'scheme',
    'faction',
    'religious',
];
exports.messageSchema = [
    // Basic Properties
    {
        name: 'display',
        type: 'enum',
        description: 'How the message is displayed.',
        values: ['feed', 'toast', 'popup'],
        example: 'display = toast',
    },
    {
        name: 'title',
        type: 'string',
        description: 'Localization key for the message title.',
        example: 'title = "MSG_TITLE_KEY"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the message description.',
        example: 'desc = "MSG_DESC_KEY"',
    },
    {
        name: 'tooltip',
        type: 'string',
        description: 'Localization key for the tooltip.',
        example: 'tooltip = "MSG_TOOLTIP_KEY"',
    },
    // Style
    {
        name: 'style',
        type: 'string',
        description: 'Visual style for the message.',
        example: 'style = "good"',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the message.',
        example: 'icon = "gfx/interface/icons/message_icons/gold.dds"',
    },
    // Sound
    {
        name: 'sound',
        type: 'string',
        description: 'Sound effect to play.',
        example: 'sound = "event:/SFX/UI/Messages/sfx_ui_message_generic"',
    },
    // Scope
    {
        name: 'on_click',
        type: 'effect',
        description: 'Effects when the message is clicked.',
        example: `on_click = {
    open_view_data = {
        view = character
        player = root
    }
}`,
    },
    // Combine
    {
        name: 'combine_into_one',
        type: 'boolean',
        description: 'Combine multiple instances into one message.',
        default: false,
        example: 'combine_into_one = yes',
    },
    // Log
    {
        name: 'log_only',
        type: 'boolean',
        description: 'Only log, do not show notification.',
        default: false,
        example: 'log_only = yes',
    },
];
// Map for quick lookup
exports.messageSchemaMap = new Map(exports.messageSchema.map((field) => [field.name, field]));
function getMessageFieldNames() {
    return exports.messageSchema.map((field) => field.name);
}
function getMessageFieldDocumentation(fieldName) {
    const field = exports.messageSchemaMap.get(fieldName);
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
//# sourceMappingURL=messageSchema.js.map