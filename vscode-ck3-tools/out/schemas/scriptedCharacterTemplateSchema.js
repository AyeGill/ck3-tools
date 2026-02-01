"use strict";
/**
 * Schema definition for CK3 Scripted Character Templates - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedCharacterTemplateSchemaMap = exports.scriptedCharacterTemplateSchema = void 0;
exports.getScriptedCharacterTemplateFieldNames = getScriptedCharacterTemplateFieldNames;
exports.getScriptedCharacterTemplateFieldDocumentation = getScriptedCharacterTemplateFieldDocumentation;
exports.scriptedCharacterTemplateSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name for the character.',
        example: 'name = "John"',
    },
    {
        name: 'dynasty',
        type: 'string',
        description: 'Dynasty for the character.',
        example: 'dynasty = 1000',
    },
    {
        name: 'dynasty_house',
        type: 'string',
        description: 'Dynasty house for the character.',
        example: 'dynasty_house = house_example',
    },
    // Demographics
    {
        name: 'gender',
        type: 'enum',
        description: 'Gender of the character.',
        values: ['male', 'female'],
        example: 'gender = male',
    },
    {
        name: 'age',
        type: 'block',
        description: 'Age range for the character.',
        example: `age = {
    min = 20
    max = 40
}`,
    },
    {
        name: 'culture',
        type: 'string',
        description: 'Culture for the character.',
        example: 'culture = french',
    },
    {
        name: 'faith',
        type: 'string',
        description: 'Faith for the character.',
        example: 'faith = catholic',
    },
    // Traits
    {
        name: 'trait',
        type: 'string',
        description: 'Add a specific trait.',
        example: 'trait = brave',
    },
    {
        name: 'random_traits',
        type: 'boolean',
        description: 'Whether to add random traits.',
        example: 'random_traits = yes',
    },
    {
        name: 'random_traits_list',
        type: 'list',
        description: 'List of possible random traits.',
        example: `random_traits_list = {
    brave
    craven
    just
}`,
    },
    // Skills
    {
        name: 'diplomacy',
        type: 'block',
        description: 'Diplomacy skill range.',
        example: `diplomacy = {
    min = 8
    max = 15
}`,
    },
    {
        name: 'martial',
        type: 'block',
        description: 'Martial skill range.',
        example: `martial = {
    min = 8
    max = 15
}`,
    },
    {
        name: 'stewardship',
        type: 'block',
        description: 'Stewardship skill range.',
        example: `stewardship = {
    min = 8
    max = 15
}`,
    },
    {
        name: 'intrigue',
        type: 'block',
        description: 'Intrigue skill range.',
        example: `intrigue = {
    min = 8
    max = 15
}`,
    },
    {
        name: 'learning',
        type: 'block',
        description: 'Learning skill range.',
        example: `learning = {
    min = 8
    max = 15
}`,
    },
    {
        name: 'prowess',
        type: 'block',
        description: 'Prowess skill range.',
        example: `prowess = {
    min = 8
    max = 15
}`,
    },
    // Family
    {
        name: 'father',
        type: 'string',
        description: 'Father character reference.',
        example: 'father = scope:father',
    },
    {
        name: 'mother',
        type: 'string',
        description: 'Mother character reference.',
        example: 'mother = scope:mother',
    },
    // After creation
    {
        name: 'after_creation',
        type: 'effect',
        description: 'Effects to run after character creation.',
        example: `after_creation = {
    add_gold = 100
}`,
    },
];
// Map for quick lookup
exports.scriptedCharacterTemplateSchemaMap = new Map(exports.scriptedCharacterTemplateSchema.map((field) => [field.name, field]));
function getScriptedCharacterTemplateFieldNames() {
    return exports.scriptedCharacterTemplateSchema.map((field) => field.name);
}
function getScriptedCharacterTemplateFieldDocumentation(fieldName) {
    const field = exports.scriptedCharacterTemplateSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedCharacterTemplateSchema.js.map