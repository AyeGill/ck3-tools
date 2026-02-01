"use strict";
/**
 * Schema definition for CK3 Character Flags - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterFlagSchemaMap = exports.characterFlagSchema = void 0;
exports.getCharacterFlagFieldNames = getCharacterFlagFieldNames;
exports.getCharacterFlagFieldDocumentation = getCharacterFlagFieldDocumentation;
exports.characterFlagSchema = [
    // Basic Properties
    {
        name: 'flag',
        type: 'string',
        description: 'The flag identifier.',
        example: 'flag = "my_custom_flag"',
    },
    // Duration
    {
        name: 'days',
        type: 'integer',
        description: 'Duration in days before flag expires.',
        example: 'days = 365',
    },
    {
        name: 'months',
        type: 'integer',
        description: 'Duration in months before flag expires.',
        example: 'months = 12',
    },
    {
        name: 'years',
        type: 'integer',
        description: 'Duration in years before flag expires.',
        example: 'years = 5',
    },
    // Value
    {
        name: 'value',
        type: 'integer',
        description: 'Value to set for the flag.',
        example: 'value = 1',
    },
    // Persistence
    {
        name: 'persist',
        type: 'boolean',
        description: 'Whether the flag persists through death.',
        default: false,
        example: 'persist = yes',
    },
    // Description
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the flag description.',
        example: 'desc = "flag_my_custom_flag_desc"',
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this flag to be valid.',
        example: `trigger = {
    is_adult = yes
}`,
    },
    // Category
    {
        name: 'category',
        type: 'enum',
        description: 'Category of the flag.',
        values: ['event', 'decision', 'interaction', 'scheme', 'war', 'other'],
        example: 'category = event',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the flag.',
        example: 'icon = "gfx/interface/icons/flags/flag.dds"',
    },
];
// Map for quick lookup
exports.characterFlagSchemaMap = new Map(exports.characterFlagSchema.map((field) => [field.name, field]));
function getCharacterFlagFieldNames() {
    return exports.characterFlagSchema.map((field) => field.name);
}
function getCharacterFlagFieldDocumentation(fieldName) {
    const field = exports.characterFlagSchemaMap.get(fieldName);
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
//# sourceMappingURL=characterFlagSchema.js.map