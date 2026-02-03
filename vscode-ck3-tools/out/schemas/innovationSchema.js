"use strict";
/**
 * Schema definition for CK3 Innovations - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.innovationSchemaMap = exports.innovationSchema = exports.INNOVATION_ERAS = exports.INNOVATION_GROUPS = void 0;
exports.getInnovationFieldNames = getInnovationFieldNames;
exports.getInnovationFieldDocumentation = getInnovationFieldDocumentation;
exports.INNOVATION_GROUPS = [
    'culture_group_military',
    'culture_group_civic',
    'culture_group_regional',
];
exports.INNOVATION_ERAS = [
    'culture_era_tribal',
    'culture_era_early_medieval',
    'culture_era_high_medieval',
    'culture_era_late_medieval',
];
exports.innovationSchema = [
    // Basic Properties
    {
        name: 'group',
        type: 'enum',
        description: 'The innovation group category.',
        values: [...exports.INNOVATION_GROUPS],
        example: 'group = culture_group_military',
    },
    {
        name: 'culture_era',
        type: 'enum',
        description: 'The era this innovation belongs to.',
        values: [...exports.INNOVATION_ERAS],
        example: 'culture_era = culture_era_early_medieval',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the innovation.',
        example: 'icon = "gfx/interface/icons/culture_innovations/innovation_example.dds"',
    },
    {
        name: 'region',
        type: 'string',
        description: 'Region requirement for regional innovations.',
        example: 'region = world_europe_west',
    },
    // Requirements
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for the innovation to be available.',
        example: `potential = {
    has_cultural_pillar = heritage_west_germanic
}`,
    },
    {
        name: 'can_progress',
        type: 'trigger',
        description: 'Conditions for progress to be made on this innovation.',
        example: `can_progress = {
    culture_head = { is_at_war = no }
}`,
    },
    // Unlocks
    {
        name: 'unlock_building',
        type: 'string',
        description: 'Building type unlocked by this innovation.',
        example: 'unlock_building = castle_walls_02',
    },
    {
        name: 'unlock_casus_belli',
        type: 'string',
        description: 'Casus belli unlocked by this innovation.',
        example: 'unlock_casus_belli = imperial_reconquest_cb',
    },
    {
        name: 'unlock_law',
        type: 'string',
        description: 'Law unlocked by this innovation.',
        example: 'unlock_law = crown_authority_2',
    },
    {
        name: 'unlock_maa',
        type: 'string',
        description: 'Men-at-arms type unlocked by this innovation.',
        example: 'unlock_maa = armored_footmen',
    },
    // Modifiers
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Modifiers applied to characters of cultures with this innovation.',
        example: `character_modifier = {
    heavy_infantry_damage_mult = 0.1
    heavy_infantry_toughness_mult = 0.1
}`,
    },
    {
        name: 'culture_modifier',
        type: 'block',
        description: 'Modifiers applied to the culture itself.',
        example: `culture_modifier = {
    cultural_acceptance_gain_mult = 0.1
}`,
    },
    {
        name: 'province_modifier',
        type: 'block',
        description: 'Modifiers applied to provinces of this culture.',
        example: `province_modifier = {
    tax_mult = 0.05
}`,
    },
    {
        name: 'county_modifier',
        type: 'block',
        description: 'Modifiers applied to counties of this culture.',
        example: `county_modifier = {
    development_growth_factor = 0.1
}`,
    },
    // Flags
    {
        name: 'flag',
        type: 'string',
        description: 'Flag set when this innovation is unlocked.',
        example: 'flag = innovation_has_example',
    },
    // Custom
    {
        name: 'custom',
        type: 'string',
        description: 'Custom localization description.',
        example: 'custom = innovation_example_custom_desc',
    },
];
// Map for quick lookup
exports.innovationSchemaMap = new Map(exports.innovationSchema.map((field) => [field.name, field]));
function getInnovationFieldNames() {
    return exports.innovationSchema.map((field) => field.name);
}
function getInnovationFieldDocumentation(fieldName) {
    const field = exports.innovationSchemaMap.get(fieldName);
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
//# sourceMappingURL=innovationSchema.js.map