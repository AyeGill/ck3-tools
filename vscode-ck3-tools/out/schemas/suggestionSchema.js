"use strict";
/**
 * Schema definition for CK3 Suggestions - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestionSchemaMap = exports.suggestionSchema = void 0;
exports.getSuggestionFieldNames = getSuggestionFieldNames;
exports.getSuggestionFieldDocumentation = getSuggestionFieldDocumentation;
exports.suggestionSchema = [
    // Basic Properties
    {
        name: 'suggestion_type',
        type: 'enum',
        description: 'Type of suggestion.',
        values: ['alert', 'notification', 'tutorial', 'action'],
        example: 'suggestion_type = alert',
    },
    {
        name: 'priority',
        type: 'integer',
        description: 'Priority of the suggestion (higher = more important).',
        example: 'priority = 100',
    },
    // Localization
    {
        name: 'title',
        type: 'string',
        description: 'Localization key for the title.',
        example: 'title = "SUGGESTION_TITLE_KEY"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "SUGGESTION_DESC_KEY"',
    },
    {
        name: 'tooltip',
        type: 'string',
        description: 'Localization key for the tooltip.',
        example: 'tooltip = "SUGGESTION_TOOLTIP_KEY"',
    },
    // Visual
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the suggestion.',
        example: 'icon = "gfx/interface/icons/suggestions/suggestion_icon.dds"',
    },
    // Conditions
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for showing the suggestion.',
        example: `is_shown = {
    is_ruler = yes
    gold < 50
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the suggestion to be valid.',
        example: `is_valid = {
    is_alive = yes
}`,
    },
    // Action
    {
        name: 'effect',
        type: 'effect',
        description: 'Effects when acting on the suggestion.',
        example: `effect = {
    open_view = decisions
}`,
    },
    {
        name: 'on_click',
        type: 'effect',
        description: 'Effects when clicking the suggestion.',
        example: `on_click = {
    open_view_data = {
        view = character
        player = root
    }
}`,
    },
    // Dismissal
    {
        name: 'can_dismiss',
        type: 'boolean',
        description: 'Whether the suggestion can be dismissed.',
        default: true,
        example: 'can_dismiss = yes',
    },
    {
        name: 'dismiss_duration',
        type: 'block',
        description: 'How long the suggestion stays dismissed.',
        example: `dismiss_duration = {
    days = 30
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to act on this suggestion.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.suggestionSchemaMap = new Map(exports.suggestionSchema.map((field) => [field.name, field]));
function getSuggestionFieldNames() {
    return exports.suggestionSchema.map((field) => field.name);
}
function getSuggestionFieldDocumentation(fieldName) {
    const field = exports.suggestionSchemaMap.get(fieldName);
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
//# sourceMappingURL=suggestionSchema.js.map