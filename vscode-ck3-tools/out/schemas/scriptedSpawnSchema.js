"use strict";
/**
 * Schema definition for CK3 Scripted Spawns - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedSpawnSchemaMap = exports.scriptedSpawnSchema = void 0;
exports.getScriptedSpawnFieldNames = getScriptedSpawnFieldNames;
exports.getScriptedSpawnFieldDocumentation = getScriptedSpawnFieldDocumentation;
exports.scriptedSpawnSchema = [
    // Basic Properties
    {
        name: 'save_scope_as',
        type: 'string',
        description: 'Save the spawned character to a scope.',
        example: 'save_scope_as = spawned_character',
    },
    {
        name: 'save_temporary_scope_as',
        type: 'string',
        description: 'Save the spawned character to a temporary scope.',
        example: 'save_temporary_scope_as = temp_character',
    },
    // Character Properties
    {
        name: 'gender',
        type: 'enum',
        description: 'Gender of the spawned character.',
        values: ['male', 'female', 'random'],
        example: 'gender = male',
    },
    {
        name: 'age',
        type: 'integer',
        description: 'Age of the spawned character.',
        example: 'age = 25',
    },
    {
        name: 'culture',
        type: 'string',
        description: 'Culture of the spawned character.',
        example: 'culture = scope:liege.culture',
    },
    {
        name: 'faith',
        type: 'string',
        description: 'Faith of the spawned character.',
        example: 'faith = scope:liege.faith',
    },
    {
        name: 'dynasty',
        type: 'string',
        description: 'Dynasty of the spawned character.',
        example: 'dynasty = none',
    },
    {
        name: 'dynasty_house',
        type: 'string',
        description: 'Dynasty house of the spawned character.',
        example: 'dynasty_house = scope:liege.house',
    },
    // Traits
    {
        name: 'trait',
        type: 'string',
        description: 'Trait to add to the spawned character.',
        example: 'trait = brave',
    },
    {
        name: 'random_traits',
        type: 'boolean',
        description: 'Whether to add random traits.',
        default: true,
        example: 'random_traits = no',
    },
    {
        name: 'random_traits_list',
        type: 'list',
        description: 'List of traits to randomly select from.',
        example: `random_traits_list = {
    brave
    craven
    ambitious
}`,
    },
    // Skills
    {
        name: 'diplomacy',
        type: 'integer',
        description: 'Diplomacy skill value.',
        example: 'diplomacy = 10',
    },
    {
        name: 'martial',
        type: 'integer',
        description: 'Martial skill value.',
        example: 'martial = 15',
    },
    {
        name: 'stewardship',
        type: 'integer',
        description: 'Stewardship skill value.',
        example: 'stewardship = 8',
    },
    {
        name: 'intrigue',
        type: 'integer',
        description: 'Intrigue skill value.',
        example: 'intrigue = 12',
    },
    {
        name: 'learning',
        type: 'integer',
        description: 'Learning skill value.',
        example: 'learning = 10',
    },
    {
        name: 'prowess',
        type: 'integer',
        description: 'Prowess skill value.',
        example: 'prowess = 20',
    },
    // Location
    {
        name: 'location',
        type: 'string',
        description: 'Location to spawn the character.',
        example: 'location = scope:liege.capital_province',
    },
    // Effects
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
exports.scriptedSpawnSchemaMap = new Map(exports.scriptedSpawnSchema.map((field) => [field.name, field]));
function getScriptedSpawnFieldNames() {
    return exports.scriptedSpawnSchema.map((field) => field.name);
}
function getScriptedSpawnFieldDocumentation(fieldName) {
    const field = exports.scriptedSpawnSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedSpawnSchema.js.map