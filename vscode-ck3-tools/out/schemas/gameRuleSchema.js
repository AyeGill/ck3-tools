"use strict";
/**
 * Schema definition for CK3 Game Rules - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRuleOptionSchemaMap = exports.gameRuleSchemaMap = exports.gameRuleOptionSchema = exports.gameRuleSchema = void 0;
exports.getGameRuleFieldNames = getGameRuleFieldNames;
exports.getGameRuleFieldDocumentation = getGameRuleFieldDocumentation;
exports.gameRuleSchema = [
    // Basic Properties
    {
        name: 'default',
        type: 'string',
        description: 'The default option for this game rule.',
        required: true,
        example: 'default = "default"',
    },
    {
        name: 'category',
        type: 'string',
        description: 'Category for UI organization.',
        example: 'category = "rule_category_general"',
    },
    {
        name: 'order',
        type: 'integer',
        description: 'Order within the category.',
        example: 'order = 1',
    },
    // Options
    {
        name: 'option',
        type: 'block',
        description: 'An option for this game rule.',
        example: `option = {
    name = "default"
    text = "GAME_RULE_DEFAULT"
    desc = "GAME_RULE_DEFAULT_DESC"
    achievements = yes
}`,
    },
    // Achievements
    {
        name: 'achievements',
        type: 'boolean',
        description: 'Whether achievements are enabled with this rule.',
        default: true,
        example: 'achievements = yes',
    },
    // Visibility
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the rule to be shown.',
        example: `is_shown = {
    has_dlc = "Royal Court"
}`,
    },
];
// Schema for game rule options
exports.gameRuleOptionSchema = [
    {
        name: 'name',
        type: 'string',
        description: 'Internal name of the option.',
        required: true,
        example: 'name = "default"',
    },
    {
        name: 'text',
        type: 'string',
        description: 'Localization key for the option name.',
        example: 'text = "GAME_RULE_OPTION_TEXT"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the option description.',
        example: 'desc = "GAME_RULE_OPTION_DESC"',
    },
    {
        name: 'achievements',
        type: 'boolean',
        description: 'Whether achievements are enabled with this option.',
        default: true,
        example: 'achievements = yes',
    },
    {
        name: 'flag',
        type: 'string',
        description: 'Flag set when this option is selected.',
        example: 'flag = "game_rule_flag"',
    },
    {
        name: 'modifier',
        type: 'block',
        description: 'Modifiers applied when this option is active.',
        example: `modifier = {
    ai_rationality = 50
}`,
    },
];
// Map for quick lookup
exports.gameRuleSchemaMap = new Map(exports.gameRuleSchema.map((field) => [field.name, field]));
exports.gameRuleOptionSchemaMap = new Map(exports.gameRuleOptionSchema.map((field) => [field.name, field]));
function getGameRuleFieldNames() {
    return exports.gameRuleSchema.map((field) => field.name);
}
function getGameRuleFieldDocumentation(fieldName) {
    const field = exports.gameRuleSchemaMap.get(fieldName);
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
//# sourceMappingURL=gameRuleSchema.js.map