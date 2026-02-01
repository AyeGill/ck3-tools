"use strict";
/**
 * Schema definition for CK3 Scripted GUIs - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedGuiSchemaMap = exports.scriptedGuiSchema = void 0;
exports.getScriptedGuiFieldNames = getScriptedGuiFieldNames;
exports.getScriptedGuiFieldDocumentation = getScriptedGuiFieldDocumentation;
exports.scriptedGuiSchema = [
    // Scope
    {
        name: 'scope',
        type: 'enum',
        description: 'The scope type this GUI operates on.',
        values: ['character', 'title', 'province', 'faith', 'culture', 'dynasty', 'none'],
        example: 'scope = character',
    },
    {
        name: 'saved_scopes',
        type: 'block',
        description: 'Scopes to save and make available.',
        example: `saved_scopes = {
    target_character
}`,
    },
    // Visibility
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the GUI to be shown.',
        example: `is_shown = {
    is_ruler = yes
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the GUI to be valid/interactable.',
        example: `is_valid = {
    is_available = yes
}`,
    },
    // Effects
    {
        name: 'effect',
        type: 'effect',
        description: 'Effects when the GUI is triggered.',
        example: `effect = {
    add_gold = 100
}`,
    },
    // AI
    {
        name: 'ai_is_valid',
        type: 'trigger',
        description: 'Conditions for AI to consider this GUI.',
        example: `ai_is_valid = {
    always = no
}`,
    },
    {
        name: 'ai_chance',
        type: 'block',
        description: 'AI weight for using this GUI.',
        example: `ai_chance = {
    base = 100
}`,
    },
    // Confirmation
    {
        name: 'confirm_title',
        type: 'string',
        description: 'Title for confirmation dialog.',
        example: 'confirm_title = "CONFIRM_ACTION_TITLE"',
    },
    {
        name: 'confirm_text',
        type: 'string',
        description: 'Text for confirmation dialog.',
        example: 'confirm_text = "CONFIRM_ACTION_TEXT"',
    },
];
// Map for quick lookup
exports.scriptedGuiSchemaMap = new Map(exports.scriptedGuiSchema.map((field) => [field.name, field]));
function getScriptedGuiFieldNames() {
    return exports.scriptedGuiSchema.map((field) => field.name);
}
function getScriptedGuiFieldDocumentation(fieldName) {
    const field = exports.scriptedGuiSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedGuiSchema.js.map