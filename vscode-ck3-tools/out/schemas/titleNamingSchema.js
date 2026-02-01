"use strict";
/**
 * Schema definition for CK3 Title Naming - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.titleNamingSchemaMap = exports.titleNamingSchema = void 0;
exports.getTitleNamingFieldNames = getTitleNamingFieldNames;
exports.getTitleNamingFieldDocumentation = getTitleNamingFieldDocumentation;
exports.titleNamingSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the naming convention.',
        example: 'name = "title_naming_latin"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "title_naming_latin_desc"',
    },
    // Tier Names
    {
        name: 'barony',
        type: 'string',
        description: 'Name for barony tier.',
        example: 'barony = "baronia"',
    },
    {
        name: 'county',
        type: 'string',
        description: 'Name for county tier.',
        example: 'county = "comitatus"',
    },
    {
        name: 'duchy',
        type: 'string',
        description: 'Name for duchy tier.',
        example: 'duchy = "ducatus"',
    },
    {
        name: 'kingdom',
        type: 'string',
        description: 'Name for kingdom tier.',
        example: 'kingdom = "regnum"',
    },
    {
        name: 'empire',
        type: 'string',
        description: 'Name for empire tier.',
        example: 'empire = "imperium"',
    },
    // Holder Names
    {
        name: 'baron',
        type: 'string',
        description: 'Title for baron.',
        example: 'baron = "baro"',
    },
    {
        name: 'count',
        type: 'string',
        description: 'Title for count.',
        example: 'count = "comes"',
    },
    {
        name: 'duke',
        type: 'string',
        description: 'Title for duke.',
        example: 'duke = "dux"',
    },
    {
        name: 'king',
        type: 'string',
        description: 'Title for king.',
        example: 'king = "rex"',
    },
    {
        name: 'emperor',
        type: 'string',
        description: 'Title for emperor.',
        example: 'emperor = "imperator"',
    },
    // Female Variants
    {
        name: 'baroness',
        type: 'string',
        description: 'Title for baroness.',
        example: 'baroness = "baronissa"',
    },
    {
        name: 'countess',
        type: 'string',
        description: 'Title for countess.',
        example: 'countess = "comitissa"',
    },
    {
        name: 'duchess',
        type: 'string',
        description: 'Title for duchess.',
        example: 'duchess = "ducissa"',
    },
    {
        name: 'queen',
        type: 'string',
        description: 'Title for queen.',
        example: 'queen = "regina"',
    },
    {
        name: 'empress',
        type: 'string',
        description: 'Title for empress.',
        example: 'empress = "imperatrix"',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for naming convention.',
        example: `potential = {
    culture = { has_cultural_pillar = heritage_latin }
}`,
    },
];
// Map for quick lookup
exports.titleNamingSchemaMap = new Map(exports.titleNamingSchema.map((field) => [field.name, field]));
function getTitleNamingFieldNames() {
    return exports.titleNamingSchema.map((field) => field.name);
}
function getTitleNamingFieldDocumentation(fieldName) {
    const field = exports.titleNamingSchemaMap.get(fieldName);
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
//# sourceMappingURL=titleNamingSchema.js.map