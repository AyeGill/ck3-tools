"use strict";
/**
 * Schema definition for CK3 Faiths and Religions - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.religionSchemaMap = exports.doctrineSchemaMap = exports.faithSchemaMap = exports.religionSchema = exports.doctrineSchema = exports.faithSchema = exports.DOCTRINE_GROUPS = exports.FAITH_HOSTILITY = exports.RELIGION_FAMILIES = void 0;
exports.getFaithFieldNames = getFaithFieldNames;
exports.getDoctrineFieldNames = getDoctrineFieldNames;
exports.getReligionFieldNames = getReligionFieldNames;
exports.getFaithFieldDocumentation = getFaithFieldDocumentation;
exports.RELIGION_FAMILIES = [
    'rf_pagan',
    'rf_christian',
    'rf_islamic',
    'rf_eastern',
    'rf_dualist',
    'rf_jewish',
    'rf_zoroastrian',
];
exports.FAITH_HOSTILITY = [
    'righteous',
    'astray',
    'hostile',
    'evil',
];
exports.DOCTRINE_GROUPS = [
    'main_group',
    'marriage_doctrines',
    'crime_doctrines',
    'clergy_doctrines',
    'special_doctrines',
];
exports.faithSchema = [
    // Basic Properties
    {
        name: 'color',
        type: 'block',
        description: 'RGB color for the faith on the map.',
        example: 'color = { 0.8 0.6 0.2 }',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the faith.',
        example: 'icon = catholic',
    },
    {
        name: 'reformed_icon',
        type: 'string',
        description: 'Icon for the reformed version (pagan faiths).',
        example: 'reformed_icon = reformed_norse',
    },
    {
        name: 'graphical_faith',
        type: 'string',
        description: 'Graphical style for the faith.',
        example: 'graphical_faith = catholic_gfx',
    },
    {
        name: 'piety_icon_group',
        type: 'string',
        description: 'Icon group for piety display.',
        example: 'piety_icon_group = christian',
    },
    // Doctrine
    {
        name: 'doctrine',
        type: 'string',
        description: 'A doctrine this faith follows.',
        example: 'doctrine = doctrine_monogamy',
    },
    {
        name: 'reserved_male_names',
        type: 'list',
        description: 'Male names reserved for religious figures.',
        example: `reserved_male_names = {
    Peter Paul
}`,
    },
    {
        name: 'reserved_female_names',
        type: 'list',
        description: 'Female names reserved for religious figures.',
        example: `reserved_female_names = {
    Mary Martha
}`,
    },
    // Holy Sites
    {
        name: 'holy_site',
        type: 'string',
        description: 'A holy site for this faith.',
        example: 'holy_site = rome',
    },
    // Localization
    {
        name: 'localization',
        type: 'block',
        description: 'Custom localization strings.',
        example: `localization = {
    HighGodName = god_the_father
    HighGodNamePossessive = god_the_father_possessive
}`,
    },
    // Religious Head
    {
        name: 'religious_head',
        type: 'string',
        description: 'Title of the religious head.',
        example: 'religious_head = k_papal_state',
    },
    // Holy Orders
    {
        name: 'holy_order_names',
        type: 'list',
        description: 'Names for holy orders.',
        example: `holy_order_names = {
    { name = "holy_order_knights_templar" }
    { name = "holy_order_knights_hospitaller" }
}`,
    },
    {
        name: 'holy_order_maa',
        type: 'string',
        description: 'Men-at-arms type for holy orders.',
        example: 'holy_order_maa = holy_order_knights',
    },
];
// Schema for doctrines
exports.doctrineSchema = [
    {
        name: 'group',
        type: 'string',
        description: 'The doctrine group this doctrine belongs to.',
        example: 'group = "marriage_doctrines"',
    },
    {
        name: 'piety_cost',
        type: 'block',
        description: 'Piety cost to change to this doctrine.',
        example: `piety_cost = {
    base = 500
    per_above_reformed_religion_level = 100
}`,
    },
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the doctrine to be shown.',
        example: `is_shown = {
    OR = {
        religion = religion:christianity_religion
        religion = religion:islam_religion
    }
}`,
    },
    {
        name: 'can_pick',
        type: 'trigger',
        description: 'Conditions for the doctrine to be selectable.',
        example: `can_pick = {
    custom_tooltip = {
        text = has_reformed_religion_doctrine
        religion = { is_reformed = yes }
    }
}`,
    },
    {
        name: 'parameters',
        type: 'block',
        description: 'Parameters granted by this doctrine.',
        example: `parameters = {
    hostility_same_religion_evil_faith_level = evil
    hostility_same_religion_hostile_faith_level = hostile
}`,
    },
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Modifiers applied to characters of this faith.',
        example: `character_modifier = {
    monthly_piety_gain_mult = 0.1
}`,
    },
    {
        name: 'clergy_modifier',
        type: 'block',
        description: 'Modifiers applied to clergy.',
        example: `clergy_modifier = {
    learning = 2
}`,
    },
    {
        name: 'traits',
        type: 'block',
        description: 'Trait interactions (virtues/sins).',
        example: `traits = {
    virtue = { chaste humble }
    sin = { lustful proud }
}`,
    },
];
// Schema for religions
exports.religionSchema = [
    {
        name: 'family',
        type: 'enum',
        description: 'The religion family this religion belongs to.',
        values: [...exports.RELIGION_FAMILIES],
        example: 'family = rf_christian',
    },
    {
        name: 'doctrine',
        type: 'string',
        description: 'A base doctrine for all faiths in this religion.',
        example: 'doctrine = doctrine_gender_male_dominated',
    },
    {
        name: 'pagan_roots',
        type: 'boolean',
        description: 'Whether this religion has pagan roots.',
        default: false,
        example: 'pagan_roots = yes',
    },
    {
        name: 'graphical_faith',
        type: 'string',
        description: 'Default graphical style for faiths.',
        example: 'graphical_faith = christian_gfx',
    },
    {
        name: 'hostility_override',
        type: 'block',
        description: 'Override hostility levels between faiths.',
        example: `hostility_override = {
    orthodox = righteous
}`,
    },
];
// Map for quick lookup
exports.faithSchemaMap = new Map(exports.faithSchema.map((field) => [field.name, field]));
exports.doctrineSchemaMap = new Map(exports.doctrineSchema.map((field) => [field.name, field]));
exports.religionSchemaMap = new Map(exports.religionSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getFaithFieldNames() {
    return exports.faithSchema.map((field) => field.name);
}
function getDoctrineFieldNames() {
    return exports.doctrineSchema.map((field) => field.name);
}
function getReligionFieldNames() {
    return exports.religionSchema.map((field) => field.name);
}
// Get documentation for a field
function getFaithFieldDocumentation(fieldName) {
    const field = exports.faithSchemaMap.get(fieldName);
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
//# sourceMappingURL=faithSchema.js.map