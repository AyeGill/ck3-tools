"use strict";
/**
 * Schema definition for CK3 Landed Titles - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.baronySchemaMap = exports.landedTitleSchemaMap = exports.baronySchema = exports.landedTitleSchema = exports.TITLE_TIERS = void 0;
exports.getLandedTitleFieldNames = getLandedTitleFieldNames;
exports.getLandedTitleFieldDocumentation = getLandedTitleFieldDocumentation;
exports.TITLE_TIERS = [
    'barony',
    'county',
    'duchy',
    'kingdom',
    'empire',
];
exports.landedTitleSchema = [
    // Basic Properties
    {
        name: 'color',
        type: 'block',
        description: 'RGB color for the title on the map.',
        example: 'color = { 150 50 50 }',
    },
    {
        name: 'color2',
        type: 'block',
        description: 'Secondary RGB color for the title.',
        example: 'color2 = { 255 255 255 }',
    },
    {
        name: 'capital',
        type: 'string',
        description: 'The capital county/barony of this title.',
        example: 'capital = c_middlesex',
    },
    {
        name: 'province',
        type: 'integer',
        description: 'Province ID for baronies.',
        example: 'province = 1234',
    },
    {
        name: 'definite_form',
        type: 'boolean',
        description: 'Whether the title uses "the" (e.g., "the Kingdom of...").',
        default: false,
        example: 'definite_form = yes',
    },
    {
        name: 'landless',
        type: 'boolean',
        description: 'Whether this is a landless title (titular).',
        default: false,
        example: 'landless = yes',
    },
    {
        name: 'no_automatic_claims',
        type: 'boolean',
        description: 'Prevents automatic claims from being generated.',
        default: false,
        example: 'no_automatic_claims = yes',
    },
    {
        name: 'destroy_if_invalid_heir',
        type: 'boolean',
        description: 'Title is destroyed if no valid heir exists.',
        default: false,
        example: 'destroy_if_invalid_heir = yes',
    },
    {
        name: 'delete_on_destroy',
        type: 'boolean',
        description: 'Title is deleted when destroyed rather than becoming titular.',
        default: false,
        example: 'delete_on_destroy = yes',
    },
    {
        name: 'always_follows_primary_heir',
        type: 'boolean',
        description: 'Title always goes to the primary heir regardless of succession.',
        default: false,
        example: 'always_follows_primary_heir = yes',
    },
    {
        name: 'de_jure_drift_disabled',
        type: 'boolean',
        description: 'Disables de jure drift for this title.',
        default: false,
        example: 'de_jure_drift_disabled = yes',
    },
    {
        name: 'can_be_named_after_dynasty',
        type: 'boolean',
        description: 'Whether the title can be renamed after a dynasty.',
        default: true,
        example: 'can_be_named_after_dynasty = no',
    },
    {
        name: 'ai_primary_priority',
        type: 'block',
        description: 'AI priority for making this their primary title.',
        example: `ai_primary_priority = {
    base = 100
}`,
    },
    // Cultural Names
    {
        name: 'cultural_names',
        type: 'block',
        description: 'Culture-specific names for the title.',
        example: `cultural_names = {
    greek = cn_byzantion
    russian = cn_tsargrad
}`,
    },
    // Can Create/Destroy
    {
        name: 'can_create',
        type: 'trigger',
        description: 'Conditions for creating this title.',
        example: `can_create = {
    is_independent_ruler = yes
    prestige >= 1000
}`,
    },
    {
        name: 'can_create_on_partition',
        type: 'trigger',
        description: 'Conditions for creating this title on partition succession.',
        example: `can_create_on_partition = {
    always = yes
}`,
    },
    {
        name: 'can_destroy',
        type: 'trigger',
        description: 'Conditions for destroying this title.',
        example: `can_destroy = {
    always = no
}`,
    },
    // Effects
    {
        name: 'on_creation',
        type: 'effect',
        description: 'Effects when the title is created.',
        example: `on_creation = {
    add_prestige = 500
}`,
    },
    {
        name: 'on_destruction',
        type: 'effect',
        description: 'Effects when the title is destroyed.',
        example: `on_destruction = {
    add_prestige = -500
}`,
    },
];
// Schema for barony-level titles
exports.baronySchema = [
    {
        name: 'province',
        type: 'integer',
        description: 'Province ID for this barony.',
        required: true,
        example: 'province = 1234',
    },
    {
        name: 'color',
        type: 'block',
        description: 'RGB color for the barony.',
        example: 'color = { 150 50 50 }',
    },
];
// Map for quick lookup
exports.landedTitleSchemaMap = new Map(exports.landedTitleSchema.map((field) => [field.name, field]));
exports.baronySchemaMap = new Map(exports.baronySchema.map((field) => [field.name, field]));
function getLandedTitleFieldNames() {
    return exports.landedTitleSchema.map((field) => field.name);
}
function getLandedTitleFieldDocumentation(fieldName) {
    const field = exports.landedTitleSchemaMap.get(fieldName);
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
//# sourceMappingURL=landedTitleSchema.js.map