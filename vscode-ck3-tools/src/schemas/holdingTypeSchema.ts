/**
 * Schema definition for CK3 Holding Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const holdingTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'primary',
    type: 'boolean',
    description: 'Whether this is a primary holding type.',
    default: false,
    example: 'primary = yes',
  },
  {
    name: 'can_be_created',
    type: 'boolean',
    description: 'Whether this holding type can be created by players.',
    default: true,
    example: 'can_be_created = yes',
  },

  // Buildings
  {
    name: 'buildings',
    type: 'list',
    description: 'Buildings that can be constructed in this holding type.',
    example: `buildings = {
    castle_01
    castle_02
    walls_01
}`,
  },

  // Modifiers
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to the province.',
    example: `province_modifier = {
    levy_size = 0.2
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

  // Graphics
  {
    name: 'gfx',
    type: 'string',
    description: 'Graphics type for the holding.',
    example: 'gfx = "castle_gfx"',
  },
  {
    name: 'flag',
    type: 'string',
    description: 'Flag type for the holding.',
    example: 'flag = "castle_flag"',
  },

  // Requirements
  {
    name: 'can_construct',
    type: 'trigger',
    description: 'Conditions to construct this holding type.',
    example: `can_construct = {
    holder = {
        gold >= 500
    }
}`,
  },
  {
    name: 'on_construction',
    type: 'effect',
    description: 'Effects when this holding is constructed.',
    example: `on_construction = {
    holder = {
        add_gold = -500
    }
}`,
  },

  // Cost
  {
    name: 'construction_time',
    type: 'integer',
    description: 'Time in days to construct this holding.',
    example: 'construction_time = 1825',
  },
  {
    name: 'gold_cost',
    type: 'integer',
    description: 'Gold cost to construct this holding.',
    example: 'gold_cost = 500',
  },

  // Special Slots
  {
    name: 'special_building_slot',
    type: 'string',
    description: 'Special building slot type for this holding.',
    example: 'special_building_slot = "castle_building"',
  },

  // Priority
  {
    name: 'order',
    type: 'integer',
    description: 'Display order for this holding type.',
    example: 'order = 1',
  },
];

// Map for quick lookup
export const holdingTypeSchemaMap = new Map<string, FieldSchema>(
  holdingTypeSchema.map((field) => [field.name, field])
);

export function getHoldingTypeFieldNames(): string[] {
  return holdingTypeSchema.map((field) => field.name);
}

export function getHoldingTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = holdingTypeSchemaMap.get(fieldName);
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
