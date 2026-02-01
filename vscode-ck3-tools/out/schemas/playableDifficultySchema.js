"use strict";
/**
 * Schema definition for CK3 Playable Difficulty - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.playableDifficultySchemaMap = exports.playableDifficultySchema = void 0;
exports.getPlayableDifficultyFieldNames = getPlayableDifficultyFieldNames;
exports.getPlayableDifficultyFieldDocumentation = getPlayableDifficultyFieldDocumentation;
exports.playableDifficultySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the difficulty name.',
        example: 'name = "difficulty_easy"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the difficulty description.',
        example: 'desc = "difficulty_easy_desc"',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the difficulty level.',
        example: 'icon = "gfx/interface/icons/difficulty/easy.dds"',
    },
    // Order
    {
        name: 'order',
        type: 'integer',
        description: 'Display order for the difficulty.',
        example: 'order = 1',
    },
    // Modifiers
    {
        name: 'player_modifier',
        type: 'block',
        description: 'Modifiers applied to the player.',
        example: `player_modifier = {
    monthly_income_mult = 0.25
    army_damage_mult = 0.1
}`,
    },
    {
        name: 'ai_modifier',
        type: 'block',
        description: 'Modifiers applied to AI rulers.',
        example: `ai_modifier = {
    monthly_income_mult = -0.25
}`,
    },
    // Color
    {
        name: 'color',
        type: 'block',
        description: 'Color for the difficulty display.',
        example: 'color = { 0.2 0.8 0.2 }',
    },
    // Default
    {
        name: 'default',
        type: 'boolean',
        description: 'Whether this is the default difficulty.',
        default: false,
        example: 'default = yes',
    },
    // Achievements
    {
        name: 'achievements',
        type: 'boolean',
        description: 'Whether achievements are enabled on this difficulty.',
        default: true,
        example: 'achievements = no',
    },
];
// Map for quick lookup
exports.playableDifficultySchemaMap = new Map(exports.playableDifficultySchema.map((field) => [field.name, field]));
function getPlayableDifficultyFieldNames() {
    return exports.playableDifficultySchema.map((field) => field.name);
}
function getPlayableDifficultyFieldDocumentation(fieldName) {
    const field = exports.playableDifficultySchemaMap.get(fieldName);
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
//# sourceMappingURL=playableDifficultySchema.js.map