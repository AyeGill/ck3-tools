"use strict";
/**
 * Schema definition for CK3 Customizable Localization - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.customLocalizationSchemaMap = exports.customLocalizationSchema = void 0;
exports.getCustomLocalizationFieldNames = getCustomLocalizationFieldNames;
exports.getCustomLocalizationFieldDocumentation = getCustomLocalizationFieldDocumentation;
exports.customLocalizationSchema = [
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'The scope type this localization applies to.',
        values: ['character', 'title', 'province', 'faith', 'culture', 'dynasty', 'none'],
        example: 'type = character',
    },
    // Text blocks
    {
        name: 'text',
        type: 'block',
        description: 'A text option with optional trigger.',
        example: `text = {
    trigger = { is_female = yes }
    localization_key = "LADY_TITLE"
}`,
    },
    {
        name: 'localization_key',
        type: 'string',
        description: 'The localization key to use.',
        example: 'localization_key = "LORD_TITLE"',
    },
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this text option.',
        example: `trigger = {
    is_ruler = yes
}`,
    },
    {
        name: 'fallback',
        type: 'boolean',
        description: 'Whether this is the fallback option.',
        default: false,
        example: 'fallback = yes',
    },
    // Random selection
    {
        name: 'random_valid',
        type: 'boolean',
        description: 'Select randomly from valid options.',
        default: false,
        example: 'random_valid = yes',
    },
    // Parent reference
    {
        name: 'parent',
        type: 'string',
        description: 'Parent custom localization to inherit from.',
        example: 'parent = "GetTitleTier"',
    },
];
// Map for quick lookup
exports.customLocalizationSchemaMap = new Map(exports.customLocalizationSchema.map((field) => [field.name, field]));
function getCustomLocalizationFieldNames() {
    return exports.customLocalizationSchema.map((field) => field.name);
}
function getCustomLocalizationFieldDocumentation(fieldName) {
    const field = exports.customLocalizationSchemaMap.get(fieldName);
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
//# sourceMappingURL=customLocalizationSchema.js.map