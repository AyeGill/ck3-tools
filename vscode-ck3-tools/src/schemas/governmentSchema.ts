/**
 * Schema definition for CK3 Governments - powers autocomplete and hover documentation
 * Based on game documentation from _governments.info
 */

import { FieldSchema } from './registry/types';

export const GOVERNMENT_TYPES = [
  'feudal_government',
  'clan_government',
  'tribal_government',
  'republic_government',
  'theocracy_government',
  'mercenary_company',
  'holy_order',
  'administrative_government',
  'landless_adventurer_government',
] as const;

export const governmentSchema: FieldSchema[] = [
  // Core structure blocks
  {
    name: 'government_rules',
    type: 'block',
    description: 'Block containing government rule flags. These properties can be tested with government_allows/disallows triggers.',
    example: `government_rules = {
    create_cadet_branches = yes
    rulers_should_have_dynasty = yes
    legitimacy = yes
}`,
  },
  {
    name: 'ai',
    type: 'block',
    description: 'AI behavior overrides for rulers with this government type.',
    example: `ai = {
    use_lifestyle = yes
    arrange_marriage = yes
    use_goals = yes
    use_legends = yes
}`,
  },
  {
    name: 'flags',
    type: 'list',
    description: 'List of flags this government uses. Can be referenced with government_has_flag trigger.',
    example: `flags = {
    government_is_feudal
    government_is_settled
}`,
  },

  // Government type classification
  {
    name: 'mechanic_type',
    type: 'enum',
    description: 'The "family" of government this belongs to. Used for specific code checks.',
    values: ['feudal', 'mercenary', 'holy_order', 'clan', 'theocracy', 'administrative', 'landless_adventurer', 'herder', 'nomad', 'mandala'],
    example: 'mechanic_type = feudal',
  },
  {
    name: 'is_mechanic_type_default',
    type: 'boolean',
    description: 'Whether this is the default government for its mechanic_type. Only one per type should be marked default.',
    default: false,
    example: 'is_mechanic_type_default = yes',
  },
  {
    name: 'fallback',
    type: 'integer',
    description: 'Fallback priority when no other government is valid (1 is selected over 2). At least one government should be scripted as fallback.',
    example: 'fallback = 1',
  },

  // Holdings
  {
    name: 'primary_holding',
    type: 'string',
    description: 'The primary holding type for this government. Key from common/holdings/.',
    example: 'primary_holding = castle_holding',
  },
  {
    name: 'valid_holdings',
    type: 'list',
    description: 'Holdings that can be held directly by rulers of this government. The primary holding is always valid.',
    example: `valid_holdings = { church_holding temple_citadel_holding }`,
  },
  {
    name: 'required_county_holdings',
    type: 'list',
    description: 'Holdings that must be present in a county before more of an existing type or others can be built.',
    example: `required_county_holdings = { castle_holding city_holding church_holding }`,
  },

  // Royal court
  {
    name: 'royal_court',
    type: 'enum',
    description: 'Whether rulers can have a royal court.',
    values: ['none', 'any', 'top_liege'],
    example: 'royal_court = any',
  },
  {
    name: 'blocked_subject_courts',
    type: 'list',
    description: 'Prevents vassals of the listed government types from having their own royal court.',
    example: 'blocked_subject_courts = { theocracy_government }',
  },

  // Vassal contracts
  {
    name: 'vassal_contract',
    type: 'list',
    description: 'Vassal obligations - how much does the vassal give to their liege. Keys from common/vassal_contracts/.',
    example: `vassal_contract = {
    feudal_obligation
}`,
  },
  {
    name: 'vassal_contract_group',
    type: 'string',
    description: 'The vassal contract group to use for this government type. (Used in game files instead of vassal_contract.)',
    example: 'vassal_contract_group = feudal_vassal',
  },

  // Triggers
  {
    name: 'can_get_government',
    type: 'trigger',
    description: 'Trigger in character scope; checked when landed to see if government is appropriate. Root = character being evaluated.',
    example: `can_get_government = {
    is_adult = yes
}`,
  },
  {
    name: 'can_move_realm_capital',
    type: 'trigger',
    description: 'Checked when attempting to move realm capital. Default allows movement. Root = ruler.',
    example: `can_move_realm_capital = {
    always = yes
}`,
  },

  // Culture/Religion preferences
  {
    name: 'primary_heritages',
    type: 'list',
    description: 'List of heritages for which this government is valid and preferred.',
    example: 'primary_heritages = { heritage_arabic heritage_iranian }',
  },
  {
    name: 'preferred_religions',
    type: 'list',
    description: 'List of religions for which this government type is preferred.',
    example: 'preferred_religions = { islam_religion }',
  },

  // Character generation
  {
    name: 'generated_character_template',
    type: 'string',
    description: 'Default scripted character template for generating characters. Key from common/scripted_character_templates.',
    example: 'generated_character_template = herder_character',
  },
  {
    name: 'court_generate_commanders',
    type: 'integer',
    description: 'Whether/how many commanders are generated in courts. Can be yes/no or a multiplier integer.',
    example: 'court_generate_commanders = yes',
  },

  // Administrative tiers
  {
    name: 'main_administrative_tier',
    type: 'enum',
    description: 'Title tier that enables most administrative mechanics (title troops, map modes, etc.).',
    values: ['county', 'duchy', 'kingdom'],
    example: 'main_administrative_tier = duchy',
  },
  {
    name: 'min_appointment_tier',
    type: 'enum',
    description: 'Title tier that enables appointment succession mechanics.',
    values: ['county', 'duchy', 'kingdom'],
    example: 'min_appointment_tier = duchy',
  },
  {
    name: 'minimum_provincial_maa_tier',
    type: 'enum',
    description: 'Lowest title tier allowed to have title troops. Defaults to duchy.',
    values: ['county', 'duchy', 'kingdom'],
    example: 'minimum_provincial_maa_tier = duchy',
  },
  {
    name: 'title_maa_setup',
    type: 'enum',
    description: 'Which titles within admin government can create title troops.',
    values: ['main_administrative_tier_and_top_liege', 'vassals_and_top_liege', 'top_vassals_and_top_liege'],
    example: 'title_maa_setup = main_administrative_tier_and_top_liege',
  },
  {
    name: 'administrative_title_maa_setup',
    type: 'enum',
    description: 'Alternative name for title_maa_setup in administrative governments.',
    values: ['main_administrative_tier_and_top_liege', 'vassals_and_top_liege', 'top_vassals_and_top_liege'],
    example: 'administrative_title_maa_setup = vassals_and_top_liege',
  },

  // Modifiers
  {
    name: 'max_dread',
    type: 'integer',
    description: 'Maximum dread for rulers of this government type.',
    example: 'max_dread = 150',
  },
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifier applied to rulers with this government type.',
    example: `character_modifier = {
    domain_limit = 2
}`,
  },
  {
    name: 'top_liege_character_modifier',
    type: 'block',
    description: 'Modifier applied only to independent top lieges with this government. Applied on top of character_modifier.',
    example: `top_liege_character_modifier = {
    monthly_prestige = 1
}`,
  },
  {
    name: 'supply_limit_mult_for_others',
    type: 'float',
    description: 'Multiplier to supply limit for armies of different government types.',
    example: 'supply_limit_mult_for_others = 0.5',
  },
  {
    name: 'prestige_opinion_override',
    type: 'list',
    description: 'Override for opinion bonus from prestige levels. Number of values should match define.',
    example: 'prestige_opinion_override = { -20 -10 0 5 10 15 }',
  },

  // Opinion systems
  {
    name: 'opinion_of_liege',
    type: 'block',
    description: 'Opinion bonus/malus for vassals toward their liege, specific to this government. Variables: liege, vassal.',
    example: `opinion_of_liege = {
    value = -10
}`,
  },
  {
    name: 'opinion_of_liege_desc',
    type: 'block',
    description: 'Dynamic description for opinion_of_liege. Variables: liege, vassal.',
    example: `opinion_of_liege_desc = {
    desc = opinion_of_liege_desc
}`,
  },
  {
    name: 'opinion_of_suzerain',
    type: 'block',
    description: 'Opinion bonus/malus for tributaries toward their suzerain. Variables: suzerain, tributary.',
    example: `opinion_of_suzerain = {
    value = 10
}`,
  },
  {
    name: 'opinion_of_suzerain_desc',
    type: 'block',
    description: 'Dynamic description for opinion_of_suzerain. Variables: suzerain, tributary.',
    example: `opinion_of_suzerain_desc = {
    desc = opinion_of_suzerain_desc
}`,
  },
  {
    name: 'opinion_of_overlord',
    type: 'block',
    description: 'Opinion for subjects toward overlord (applies to both liege and suzerain). Variables: overlord, subject.',
    example: `opinion_of_overlord = {
    value = 0
}`,
  },
  {
    name: 'opinion_of_overlord_desc',
    type: 'block',
    description: 'Dynamic description for opinion_of_overlord. Variables: overlord, subject.',
    example: `opinion_of_overlord_desc = {
    desc = opinion_of_overlord_desc
}`,
  },

  // Special mechanics
  {
    name: 'house_unity',
    type: 'string',
    description: 'House unity configuration key from common/house_unities.',
    example: 'house_unity = clan_house_unity',
  },
  {
    name: 'domicile_type',
    type: 'string',
    description: 'Domicile configuration key from common/domiciles.',
    example: 'domicile_type = camp',
  },
  {
    name: 'tax_slot_type',
    type: 'string',
    description: 'Type of tax slot used by this government.',
    example: 'tax_slot_type = clan_tax_slot',
  },
  {
    name: 'currency_levels_cap',
    type: 'block',
    description: 'Maximum currency level caps (0-indexed). Keys: piety, prestige, influence, merit.',
    example: `currency_levels_cap = {
    piety = 5
    prestige = 5
    merit = 9
}`,
  },
  {
    name: 'compatible_government_type_succession',
    type: 'list',
    description: 'Government types that are also valid candidates for succession in admin governments.',
    example: 'compatible_government_type_succession = { feudal_government }',
  },

  // AI scripted values
  {
    name: 'ai_ruler_desired_kingdom_titles',
    type: 'block',
    description: 'Script value for how many kingdom titles AI wants to keep. Negative = keep all. Root = ruler.',
    example: 'ai_ruler_desired_kingdom_titles = -1',
  },
  {
    name: 'ai_ruler_desired_empire_titles',
    type: 'block',
    description: 'Script value for how many empire titles AI wants to keep. Negative = keep all. Root = ruler.',
    example: 'ai_ruler_desired_empire_titles = -1',
  },
  {
    name: 'ai_can_reassign_council_positions',
    type: 'trigger',
    description: 'Whether AI rulers can reassign council positions. Default = yes. Root = council owner.',
    example: `ai_can_reassign_council_positions = {
    always = yes
}`,
  },

  // Visual
  {
    name: 'color',
    type: 'block',
    description: 'Color for map mode. Can be RGB { r g b } or HSV hsv{ h s v }.',
    example: 'color = hsv{ 0.67 1.00 0.78 }',
  },
  {
    name: 'realm_mask_offset',
    type: 'block',
    description: 'Offset for realm mask on map.',
    example: 'realm_mask_offset = { 0.0 0.01 }',
  },
  {
    name: 'realm_mask_scale',
    type: 'block',
    description: 'Scale for realm mask on map.',
    example: 'realm_mask_scale = { 1 1 }',
  },
];

// Map for quick lookup
export const governmentSchemaMap = new Map<string, FieldSchema>(
  governmentSchema.map((field) => [field.name, field])
);

export function getGovernmentFieldNames(): string[] {
  return governmentSchema.map((field) => field.name);
}

export function getGovernmentFieldDocumentation(fieldName: string): string | undefined {
  const field = governmentSchemaMap.get(fieldName);
  if (!field) return undefined;

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
