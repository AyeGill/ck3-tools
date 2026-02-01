"use strict";
/**
 * Schema definition for CK3 Character History - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterHistorySchemaMap = exports.characterHistorySchema = void 0;
exports.getCharacterHistoryFieldNames = getCharacterHistoryFieldNames;
exports.getCharacterHistoryFieldDocumentation = getCharacterHistoryFieldDocumentation;
exports.characterHistorySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Character name (localization key or literal).',
        example: 'name = "Charlemagne"',
    },
    {
        name: 'female',
        type: 'boolean',
        description: 'Whether the character is female.',
        default: false,
        example: 'female = yes',
    },
    {
        name: 'dynasty',
        type: 'integer',
        description: 'Dynasty ID.',
        example: 'dynasty = 25',
    },
    {
        name: 'dynasty_house',
        type: 'integer',
        description: 'Dynasty house ID.',
        example: 'dynasty_house = 100',
    },
    {
        name: 'religion',
        type: 'string',
        description: 'Character religion.',
        example: 'religion = "catholic"',
    },
    {
        name: 'culture',
        type: 'string',
        description: 'Character culture.',
        example: 'culture = "french"',
    },
    {
        name: 'father',
        type: 'integer',
        description: 'Father character ID.',
        example: 'father = 12345',
    },
    {
        name: 'mother',
        type: 'integer',
        description: 'Mother character ID.',
        example: 'mother = 12346',
    },
    {
        name: 'martial',
        type: 'integer',
        description: 'Base martial skill.',
        example: 'martial = 12',
    },
    {
        name: 'diplomacy',
        type: 'integer',
        description: 'Base diplomacy skill.',
        example: 'diplomacy = 10',
    },
    {
        name: 'stewardship',
        type: 'integer',
        description: 'Base stewardship skill.',
        example: 'stewardship = 8',
    },
    {
        name: 'intrigue',
        type: 'integer',
        description: 'Base intrigue skill.',
        example: 'intrigue = 6',
    },
    {
        name: 'learning',
        type: 'integer',
        description: 'Base learning skill.',
        example: 'learning = 14',
    },
    {
        name: 'prowess',
        type: 'integer',
        description: 'Base prowess skill.',
        example: 'prowess = 10',
    },
    {
        name: 'trait',
        type: 'string',
        description: 'Add a trait to the character.',
        example: 'trait = brave',
    },
    {
        name: 'disallow_random_traits',
        type: 'boolean',
        description: 'Prevent random trait generation.',
        default: false,
        example: 'disallow_random_traits = yes',
    },
    {
        name: 'dna',
        type: 'string',
        description: 'DNA string for appearance.',
        example: 'dna = my_custom_dna',
    },
    {
        name: 'sexuality',
        type: 'enum',
        description: 'Character sexuality.',
        values: ['heterosexual', 'homosexual', 'bisexual', 'asexual'],
        example: 'sexuality = heterosexual',
    },
    {
        name: 'health',
        type: 'float',
        description: 'Starting health value.',
        example: 'health = 5.0',
    },
    {
        name: 'fertility',
        type: 'float',
        description: 'Base fertility value.',
        example: 'fertility = 0.5',
    },
    // Date-based effects (within date blocks)
    {
        name: 'birth',
        type: 'string',
        description: 'Birth date.',
        example: 'birth = "742.4.2"',
    },
    {
        name: 'death',
        type: 'string',
        description: 'Death date.',
        example: 'death = "814.1.28"',
    },
    {
        name: 'employer',
        type: 'integer',
        description: 'Employer character ID.',
        example: 'employer = 12345',
    },
    {
        name: 'add_spouse',
        type: 'integer',
        description: 'Add a spouse by character ID.',
        example: 'add_spouse = 12347',
    },
    {
        name: 'add_matrilineal_spouse',
        type: 'integer',
        description: 'Add a matrilineal spouse by character ID.',
        example: 'add_matrilineal_spouse = 12347',
    },
    {
        name: 'add_concubine',
        type: 'integer',
        description: 'Add a concubine by character ID.',
        example: 'add_concubine = 12348',
    },
    {
        name: 'remove_spouse',
        type: 'integer',
        description: 'Remove a spouse by character ID.',
        example: 'remove_spouse = 12347',
    },
    {
        name: 'effect',
        type: 'block',
        description: 'Run arbitrary effects.',
        example: `effect = {
    add_gold = 100
}`,
    },
    {
        name: 'give_nickname',
        type: 'string',
        description: 'Give a nickname to the character.',
        example: 'give_nickname = nick_the_great',
    },
];
// Map for quick lookup
exports.characterHistorySchemaMap = new Map(exports.characterHistorySchema.map((field) => [field.name, field]));
function getCharacterHistoryFieldNames() {
    return exports.characterHistorySchema.map((field) => field.name);
}
function getCharacterHistoryFieldDocumentation(fieldName) {
    const field = exports.characterHistorySchemaMap.get(fieldName);
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
//# sourceMappingURL=characterHistorySchema.js.map