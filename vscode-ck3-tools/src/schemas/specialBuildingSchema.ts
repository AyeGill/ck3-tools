/**
 * Schema definition for CK3 Special Buildings - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const specialBuildingSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the building name.',
    example: 'name = "special_building_hagia_sophia"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the building description.',
    example: 'desc = "special_building_hagia_sophia_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the special building.',
    example: 'icon = "gfx/interface/icons/buildings/hagia_sophia.dds"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of special building.',
    values: ['wonder', 'holy_site', 'duchy_building', 'special'],
    example: 'type = wonder',
  },

  // Province
  {
    name: 'province',
    type: 'integer',
    description: 'Province ID where this building can be built.',
    example: 'province = 496',
  },
  {
    name: 'barony',
    type: 'string',
    description: 'Barony where this building can be built.',
    example: 'barony = b_constantinople',
  },

  // Requirements
  {
    name: 'can_construct',
    type: 'trigger',
    description: 'Conditions to construct this building.',
    example: `can_construct = {
    holder = {
        piety >= 1000
    }
}`,
  },

  // Cost
  {
    name: 'gold_cost',
    type: 'integer',
    description: 'Gold cost to construct.',
    example: 'gold_cost = 1000',
  },
  {
    name: 'piety_cost',
    type: 'integer',
    description: 'Piety cost to construct.',
    example: 'piety_cost = 500',
  },
  {
    name: 'prestige_cost',
    type: 'integer',
    description: 'Prestige cost to construct.',
    example: 'prestige_cost = 500',
  },
  {
    name: 'construction_time',
    type: 'integer',
    description: 'Time in days to construct.',
    example: 'construction_time = 3650',
  },

  // Modifiers
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to the county.',
    example: `county_modifier = {
    development_growth_factor = 0.2
    monthly_county_control_growth_add = 0.1
}`,
  },
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to the province.',
    example: `province_modifier = {
    garrison_size = 0.5
    fort_level = 2
}`,
  },
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to the holder.',
    example: `character_modifier = {
    monthly_prestige = 2.0
    piety_mult = 0.1
}`,
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value for building this.',
    example: `ai_value = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const specialBuildingSchemaMap = new Map<string, FieldSchema>(
  specialBuildingSchema.map((field) => [field.name, field])
);

export function getSpecialBuildingFieldNames(): string[] {
  return specialBuildingSchema.map((field) => field.name);
}

export function getSpecialBuildingFieldDocumentation(fieldName: string): string | undefined {
  const field = specialBuildingSchemaMap.get(fieldName);
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
