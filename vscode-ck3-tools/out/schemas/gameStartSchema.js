"use strict";
/**
 * Schema definition for CK3 Game Start - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameStartSchemaMap = exports.gameStartSchema = void 0;
exports.getGameStartFieldNames = getGameStartFieldNames;
exports.getGameStartFieldDocumentation = getGameStartFieldDocumentation;
exports.gameStartSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the game start name.',
        example: 'name = "game_start_867"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the game start description.',
        example: 'desc = "game_start_867_desc"',
    },
    // Date
    {
        name: 'date',
        type: 'string',
        description: 'Start date for this scenario.',
        example: 'date = "867.1.1"',
    },
    {
        name: 'end_date',
        type: 'string',
        description: 'End date for the scenario.',
        example: 'end_date = "1453.5.29"',
    },
    // Requirements
    {
        name: 'is_playable',
        type: 'trigger',
        description: 'Conditions for this start to be playable.',
        example: `is_playable = {
    has_dlc = "Royal Court"
}`,
    },
    // Default Character
    {
        name: 'default_character',
        type: 'string',
        description: 'Default character to play as.',
        example: 'default_character = "charlemagne"',
    },
    // Tutorial
    {
        name: 'is_tutorial',
        type: 'boolean',
        description: 'Whether this is a tutorial start.',
        default: false,
        example: 'is_tutorial = no',
    },
    // Effects
    {
        name: 'on_start',
        type: 'effect',
        description: 'Effects to run when game starts.',
        example: `on_start = {
    every_ruler = {
        add_gold = 100
    }
}`,
    },
    // History
    {
        name: 'history_file',
        type: 'string',
        description: 'Path to history file.',
        example: 'history_file = "history/867"',
    },
    // Map
    {
        name: 'map_mode',
        type: 'string',
        description: 'Default map mode for this start.',
        example: 'map_mode = "realms"',
    },
    // Display
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the game start.',
        example: 'icon = "gfx/interface/icons/game_starts/867.dds"',
    },
    {
        name: 'priority',
        type: 'integer',
        description: 'Display priority in the menu.',
        example: 'priority = 100',
    },
];
// Map for quick lookup
exports.gameStartSchemaMap = new Map(exports.gameStartSchema.map((field) => [field.name, field]));
function getGameStartFieldNames() {
    return exports.gameStartSchema.map((field) => field.name);
}
function getGameStartFieldDocumentation(fieldName) {
    const field = exports.gameStartSchemaMap.get(fieldName);
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
//# sourceMappingURL=gameStartSchema.js.map