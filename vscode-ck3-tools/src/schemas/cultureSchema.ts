/**
 * Schema definition for CK3 Cultures - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const CULTURE_ERAS = [
  'culture_era_tribal',
  'culture_era_early_medieval',
  'culture_era_high_medieval',
  'culture_era_late_medieval',
] as const;

export const MARTIAL_CUSTOMS = [
  'martial_custom_male_only',
  'martial_custom_female_only',
  'martial_custom_equal',
] as const;

export const NAME_LISTS = [
  'name_list_norse',
  'name_list_anglo_saxon',
  'name_list_irish',
  'name_list_scottish',
  'name_list_welsh',
  'name_list_breton',
  'name_list_french',
  'name_list_norman',
  'name_list_occitan',
  'name_list_catalan',
  'name_list_castilian',
  'name_list_portuguese',
  'name_list_basque',
  'name_list_italian',
  'name_list_lombard',
  'name_list_german',
  'name_list_dutch',
  'name_list_frisian',
  'name_list_polish',
  'name_list_czech',
  'name_list_slovien',
  'name_list_croatian',
  'name_list_serbian',
  'name_list_bulgarian',
  'name_list_romanian',
  'name_list_hungarian',
  'name_list_finnish',
  'name_list_estonian',
  'name_list_lithuanian',
  'name_list_latvian',
  'name_list_prussian',
  'name_list_russian',
  'name_list_greek',
  'name_list_armenian',
  'name_list_georgian',
  'name_list_alan',
  'name_list_arabic',
  'name_list_berber',
  'name_list_persian',
  'name_list_turkish',
  'name_list_mongol',
  'name_list_ethiopian',
  'name_list_somali',
  'name_list_nubian',
  'name_list_akan',
  'name_list_yoruba',
  'name_list_hausa',
  'name_list_senegambian',
  'name_list_tibetan',
  'name_list_han',
  'name_list_burmese',
  'name_list_thai',
  'name_list_khmer',
  'name_list_vietnamese',
  'name_list_bengali',
  'name_list_hindustani',
  'name_list_marathi',
  'name_list_tamil',
  'name_list_kannada',
  'name_list_telugu',
  'name_list_sinhala',
] as const;

export const cultureSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for the culture on the map.',
    example: 'color = { 0.8 0.2 0.2 }',
  },
  {
    name: 'ethos',
    type: 'string',
    description: 'The cultural ethos (defines cultural bonuses).',
    example: 'ethos = ethos_bellicose',
  },
  {
    name: 'heritage',
    type: 'string',
    description: 'The cultural heritage (cultural group).',
    example: 'heritage = heritage_north_germanic',
  },
  {
    name: 'language',
    type: 'string',
    description: 'The language spoken by this culture.',
    example: 'language = language_norse',
  },
  {
    name: 'martial_custom',
    type: 'enum',
    description: 'Gender rules for martial roles.',
    values: [...MARTIAL_CUSTOMS],
    example: 'martial_custom = martial_custom_male_only',
  },

  // Name Lists
  {
    name: 'name_list',
    type: 'string',
    description: 'Name list for character name generation.',
    example: 'name_list = name_list_norse',
  },
  {
    name: 'coa_gfx',
    type: 'list',
    description: 'Coat of arms graphics sets.',
    example: `coa_gfx = { western_coa_gfx }`,
  },
  {
    name: 'building_gfx',
    type: 'list',
    description: 'Building graphics sets.',
    example: `building_gfx = { western_building_gfx }`,
  },
  {
    name: 'clothing_gfx',
    type: 'list',
    description: 'Clothing graphics sets.',
    example: `clothing_gfx = { western_clothing_gfx }`,
  },
  {
    name: 'unit_gfx',
    type: 'list',
    description: 'Unit graphics sets.',
    example: `unit_gfx = { western_unit_gfx }`,
  },

  // Traditions
  {
    name: 'traditions',
    type: 'list',
    description: 'List of cultural traditions.',
    example: `traditions = {
    tradition_northern_stories
    tradition_seafaring
    tradition_warriors_by_merit
}`,
  },

  // History
  {
    name: 'history',
    type: 'block',
    description: 'Historical changes to the culture over time.',
    example: `history = {
    867 = {
        traditions = { tradition_seafaring }
    }
}`,
  },

  // Dynasty Name
  {
    name: 'dynasty_names',
    type: 'list',
    description: 'Names for dynasties of this culture.',
    example: `dynasty_names = {
    "Yngling"
    "Fairhair"
}`,
  },
  {
    name: 'male_names',
    type: 'list',
    description: 'Male character names.',
    example: `male_names = {
    Bjorn Harald Erik
}`,
  },
  {
    name: 'female_names',
    type: 'list',
    description: 'Female character names.',
    example: `female_names = {
    Astrid Freydis Ingrid
}`,
  },

  // Cadet Names
  {
    name: 'cadet_dynasty_names',
    type: 'list',
    description: 'Names for cadet branches.',
    example: `cadet_dynasty_names = {
    "Ironside"
    "the Bold"
}`,
  },

  // Parents
  {
    name: 'parents',
    type: 'list',
    description: 'Parent cultures this culture descends from.',
    example: `parents = { norwegian danish }`,
  },

  // Created
  {
    name: 'created',
    type: 'block',
    description: 'When/how this culture was created.',
    example: `created = {
    867.1.1 = { founder = character:123 }
}`,
  },

  // Era
  {
    name: 'era',
    type: 'enum',
    description: 'Starting cultural era.',
    values: [...CULTURE_ERAS],
    example: 'era = culture_era_early_medieval',
  },
];

// Schema for cultural traditions
export const traditionSchema: FieldSchema[] = [
  {
    name: 'category',
    type: 'enum',
    description: 'Category of the tradition.',
    values: ['realm', 'combat', 'societal', 'regional'],
    example: 'category = combat',
  },
  {
    name: 'layers',
    type: 'block',
    description: 'Visual layers for the tradition icon.',
    example: `layers = {
    0 = martial
    4 = combat
}`,
  },
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the tradition to appear as an option.',
    example: `is_shown = {
    has_cultural_pillar = heritage_north_germanic
}`,
  },
  {
    name: 'can_pick',
    type: 'trigger',
    description: 'Conditions for the tradition to be selectable.',
    example: `can_pick = {
    scope:character = { prestige >= 1000 }
}`,
  },
  {
    name: 'can_pick_reason',
    type: 'block',
    description: 'Explanation of why tradition can/cannot be picked.',
    example: `can_pick_reason = {
    text = tradition_incompatible
}`,
  },
  {
    name: 'parameters',
    type: 'block',
    description: 'Cultural parameters granted by this tradition.',
    example: `parameters = {
    seafaring = yes
    can_recruit_berserkers = yes
}`,
  },
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters of this culture.',
    example: `character_modifier = {
    knight_effectiveness_mult = 0.1
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
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to provinces of this culture.',
    example: `province_modifier = {
    supply_limit_mult = 0.1
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
    name: 'doctrine_modifier',
    type: 'block',
    description: 'Modifiers based on cultural parameters.',
    example: `doctrine_modifier = {
    parameter = seafaring
    coastal_advantage = 5
}`,
  },
  {
    name: 'cost',
    type: 'block',
    description: 'Cost to add this tradition.',
    example: `cost = {
    prestige = {
        value = 2000
    }
}`,
  },
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI preference for picking this tradition.',
    example: `ai_will_do = {
    value = 100
    if = {
        limit = { has_cultural_pillar = heritage_north_germanic }
        add = 50
    }
}`,
  },
];

// Map for quick lookup
export const cultureSchemaMap = new Map<string, FieldSchema>(
  cultureSchema.map((field) => [field.name, field])
);

export const traditionSchemaMap = new Map<string, FieldSchema>(
  traditionSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getCultureFieldNames(): string[] {
  return cultureSchema.map((field) => field.name);
}

export function getTraditionFieldNames(): string[] {
  return traditionSchema.map((field) => field.name);
}

// Get documentation for a field
export function getCultureFieldDocumentation(fieldName: string): string | undefined {
  const field = cultureSchemaMap.get(fieldName);
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
