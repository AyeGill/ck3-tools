/**
 * Schema definition for CK3 buildings - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const BUILDING_TYPES = [
  'castle',
  'city',
  'temple',
  'tribal',
  'special',
] as const;

export const buildingSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'construction_time',
    type: 'string',
    description: 'Time to construct the building (script value or number).',
    example: 'construction_time = slow_construction_time',
  },
  {
    name: 'type',
    type: 'string',
    description: 'Building type category.',
    example: 'type = duchy_capital_building',
  },
  {
    name: 'flag',
    type: 'string',
    description: 'Building flag for use in triggers.',
    example: 'flag = building_economy',
  },

  // Cost
  {
    name: 'cost_gold',
    type: 'integer',
    description: 'Gold cost to construct.',
    example: 'cost_gold = 300',
  },
  {
    name: 'cost_prestige',
    type: 'integer',
    description: 'Prestige cost to construct.',
    example: 'cost_prestige = 100',
  },
  {
    name: 'cost_piety',
    type: 'integer',
    description: 'Piety cost to construct.',
    example: 'cost_piety = 50',
  },

  // Level Requirements
  {
    name: 'next_building',
    type: 'string',
    description: 'Next building in the upgrade chain.',
    example: 'next_building = castle_02',
  },
  {
    name: 'can_be_disabled',
    type: 'boolean',
    description: 'Whether the building can be disabled.',
    default: true,
    example: 'can_be_disabled = no',
  },

  // Conditions
  {
    name: 'is_enabled',
    type: 'trigger',
    description: 'Conditions for the building to provide bonuses.',
    example: `is_enabled = {
    county.holder = { has_perk = centralization_perk }
}`,
  },
  {
    name: 'can_construct_potential',
    type: 'trigger',
    description: 'Soft conditions for construction (affects visibility).',
    example: `can_construct_potential = {
    building_requirement_tribal = no
}`,
  },
  {
    name: 'can_construct_showing_failures_only',
    type: 'trigger',
    description: 'Hard conditions for construction (shows failures).',
    example: `can_construct_showing_failures_only = {
    county.holder = { gold >= 100 }
}`,
  },
  {
    name: 'can_construct',
    type: 'trigger',
    description: 'Additional construction conditions.',
    example: `can_construct = {
    has_building_or_higher = manor_house_01
}`,
  },

  // Effects
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when construction completes.',
    example: `on_complete = {
    county.holder = { add_prestige = 100 }
}`,
  },
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when construction starts.',
    example: 'on_start = { }',
  },

  // Modifiers (Province)
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to the province.',
    example: `province_modifier = {
    monthly_income = 0.5
    garrison_size = 0.1
}`,
  },
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to the county.',
    example: `county_modifier = {
    development_growth_factor = 0.1
}`,
  },
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to the holder.',
    example: `character_modifier = {
    monthly_prestige = 0.1
}`,
  },

  // Culture/Religion Modifiers
  {
    name: 'culture_modifier',
    type: 'block',
    description: 'Modifiers active when culture has parameter.',
    example: `culture_modifier = {
    parameter = castle_building_bonuses
    levy_size = 0.05
}`,
  },
  {
    name: 'faith_modifier',
    type: 'block',
    description: 'Modifiers active when faith has doctrine.',
    example: `faith_modifier = {
    parameter = temple_tax_bonus
    tax_mult = 0.1
}`,
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value calculation for building.',
    example: `ai_value = {
    base = 100
    modifier = {
        factor = 1.5
        county.holder = { is_at_war = yes }
    }
}`,
  },

  // Visual
  {
    name: 'asset',
    type: 'block',
    description: 'Visual asset for the building on the map.',
    example: `asset = {
    type = pdxmesh
    name = "building_castle_01_mesh"
    illustration = "gfx/interface/illustrations/holding_types/castle.dds"
}`,
  },

  // Levy and Garrison
  {
    name: 'levy',
    type: 'integer',
    description: 'Flat levy bonus.',
    example: 'levy = 50',
  },
  {
    name: 'max_garrison',
    type: 'integer',
    description: 'Maximum garrison increase.',
    example: 'max_garrison = 200',
  },
  {
    name: 'garrison_reinforcement_factor',
    type: 'float',
    description: 'Garrison reinforcement speed factor.',
    example: 'garrison_reinforcement_factor = 0.1',
  },

  // Duchy Buildings
  {
    name: 'duchy_capital_county_modifier',
    type: 'block',
    description: 'Modifier applied to all counties in duchy.',
    example: `duchy_capital_county_modifier = {
    development_growth_factor = 0.05
}`,
  },

  // Show/Hide
  {
    name: 'show_disabled',
    type: 'boolean',
    description: 'Show building even when disabled.',
    default: false,
    example: 'show_disabled = yes',
  },

  // Additional modifier blocks
  {
    name: 'character_culture_modifier',
    type: 'block',
    description: 'Modifiers applied to the holder based on culture parameters.',
  },
  {
    name: 'character_government_modifier',
    type: 'block',
    description: 'Modifiers applied to the holder based on government type.',
  },
  {
    name: 'county_culture_modifier',
    type: 'block',
    description: 'Modifiers applied to the county based on culture parameters.',
  },
  {
    name: 'county_dynasty_modifier',
    type: 'block',
    description: 'Modifiers applied to the county based on dynasty.',
  },
  {
    name: 'county_holder_character_modifier',
    type: 'block',
    description: 'Modifiers applied to the county holder character.',
  },
  {
    name: 'duchy_capital_county_culture_modifier',
    type: 'block',
    description: 'Modifiers applied to duchy capital county based on culture.',
  },
  {
    name: 'province_culture_modifier',
    type: 'block',
    description: 'Modifiers applied to the province based on culture parameters.',
  },
  {
    name: 'province_government_modifier',
    type: 'block',
    description: 'Modifiers applied to the province based on government type.',
  },
  {
    name: 'province_terrain_modifier',
    type: 'block',
    description: 'Modifiers applied to the province based on terrain type.',
  },

  // Slot and type
  {
    name: 'slot',
    type: 'string',
    description: 'Building slot this building occupies.',
    example: 'slot = city_01',
  },
  {
    name: 'type_icon',
    type: 'string',
    description: 'Icon type for the building.',
    example: 'type_icon = "economy"',
  },

  // Great projects and special buildings
  {
    name: 'great_project_type',
    type: 'string',
    description: 'Type of great project this building is part of.',
  },
  {
    name: 'is_graphical_background',
    type: 'boolean',
    description: 'Whether this is a graphical background building.',
  },
  {
    name: 'is_mandala_capital',
    type: 'boolean',
    description: 'Whether this building makes the holding a mandala capital.',
  },
  {
    name: 'can_rebuild',
    type: 'block',
    description: 'Whether this building can be rebuilt after destruction. Can be a trigger block for conditional checks.',
  },
  {
    name: 'rebuild_cost',
    type: 'block',
    description: 'Cost to rebuild this building.',
  },
  {
    name: 'fallback',
    type: 'string',
    description: 'Fallback building if this one cannot be built.',
  },

  // Cost block (alternative to cost_gold/cost_prestige)
  {
    name: 'cost',
    type: 'block',
    description: 'Cost block for building construction.',
    example: `cost = {
    gold = 100
    prestige = 50
}`,
  },

  // Description
  {
    name: 'effect_desc',
    type: 'string',
    description: 'Description of the building effects for UI.',
  },
];

// Map for quick lookup
export const buildingSchemaMap = new Map<string, FieldSchema>(
  buildingSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getBuildingFieldNames(): string[] {
  return buildingSchema.map((field) => field.name);
}

// Get documentation for a field
export function getBuildingFieldDocumentation(fieldName: string): string | undefined {
  const field = buildingSchemaMap.get(fieldName);
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
