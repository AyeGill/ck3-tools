"use strict";
/**
 * Schema definition for CK3 Character Templates - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterTemplateSchemaMap = exports.characterTemplateSchema = void 0;
exports.getCharacterTemplateFieldNames = getCharacterTemplateFieldNames;
exports.getCharacterTemplateFieldDocumentation = getCharacterTemplateFieldDocumentation;
exports.characterTemplateSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name for the character template.',
        example: 'name = "generic_knight"',
    },
    // Demographics
    {
        name: 'gender',
        type: 'enum',
        description: 'Gender of the character.',
        values: ['male', 'female', 'random'],
        example: 'gender = male',
    },
    {
        name: 'age',
        type: 'block',
        description: 'Age range for the character.',
        example: 'age = { 20 40 }',
    },
    {
        name: 'culture',
        type: 'string',
        description: 'Culture of the character.',
        example: 'culture = culture:english',
    },
    {
        name: 'faith',
        type: 'string',
        description: 'Faith of the character.',
        example: 'faith = faith:catholic',
    },
    // Traits
    {
        name: 'trait',
        type: 'string',
        description: 'A trait to add to the character.',
        example: 'trait = brave',
    },
    {
        name: 'random_traits',
        type: 'boolean',
        description: 'Whether to add random traits.',
        default: true,
        example: 'random_traits = yes',
    },
    {
        name: 'random_traits_list',
        type: 'list',
        description: 'List of traits to randomly pick from.',
        example: `random_traits_list = {
    brave
    craven
    ambitious
}`,
    },
    // Skills
    {
        name: 'diplomacy',
        type: 'block',
        description: 'Diplomacy skill range.',
        example: 'diplomacy = { 8 12 }',
    },
    {
        name: 'martial',
        type: 'block',
        description: 'Martial skill range.',
        example: 'martial = { 10 16 }',
    },
    {
        name: 'stewardship',
        type: 'block',
        description: 'Stewardship skill range.',
        example: 'stewardship = { 6 10 }',
    },
    {
        name: 'intrigue',
        type: 'block',
        description: 'Intrigue skill range.',
        example: 'intrigue = { 5 9 }',
    },
    {
        name: 'learning',
        type: 'block',
        description: 'Learning skill range.',
        example: 'learning = { 4 8 }',
    },
    {
        name: 'prowess',
        type: 'block',
        description: 'Prowess skill range.',
        example: 'prowess = { 12 18 }',
    },
    // Dynasty
    {
        name: 'dynasty',
        type: 'string',
        description: 'Dynasty for the character.',
        example: 'dynasty = dynasty:500',
    },
    {
        name: 'dynasty_house',
        type: 'string',
        description: 'Dynasty house for the character.',
        example: 'dynasty_house = house:house_normandy',
    },
    // Flags
    {
        name: 'save_scope_as',
        type: 'string',
        description: 'Save the character in a scope.',
        example: 'save_scope_as = new_knight',
    },
];
// Map for quick lookup
exports.characterTemplateSchemaMap = new Map(exports.characterTemplateSchema.map((field) => [field.name, field]));
function getCharacterTemplateFieldNames() {
    return exports.characterTemplateSchema.map((field) => field.name);
}
function getCharacterTemplateFieldDocumentation(fieldName) {
    const field = exports.characterTemplateSchemaMap.get(fieldName);
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
//# sourceMappingURL=characterTemplateSchema.js.map