/**
 * Schema definition for CK3 Climate - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const climateSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the climate name.',
    example: 'name = "climate_temperate"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "climate_temperate_desc"',
  },

  // Visual
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this climate.',
    example: 'icon = "gfx/interface/icons/climate/temperate.dds"',
  },
  {
    name: 'color',
    type: 'block',
    description: 'Map color for this climate.',
    example: `color = {
    0.3 0.6 0.2
}`,
  },

  // Provinces
  {
    name: 'provinces',
    type: 'list',
    description: 'List of province IDs with this climate.',
    example: `provinces = {
    1 2 3 4 5
}`,
  },

  // Modifiers
  {
    name: 'supply_limit_mult',
    type: 'float',
    description: 'Supply limit multiplier.',
    example: 'supply_limit_mult = 1.0',
  },
  {
    name: 'development_growth_factor',
    type: 'float',
    description: 'Development growth factor.',
    example: 'development_growth_factor = 0.1',
  },
  {
    name: 'attrition',
    type: 'float',
    description: 'Army attrition in this climate.',
    example: 'attrition = 0.01',
  },

  // Winter
  {
    name: 'winter_severity',
    type: 'enum',
    description: 'Severity of winter.',
    values: ['none', 'mild', 'normal', 'harsh', 'severe'],
    example: 'winter_severity = normal',
  },
  {
    name: 'winter_supply_limit_mult',
    type: 'float',
    description: 'Supply limit multiplier during winter.',
    example: 'winter_supply_limit_mult = 0.5',
  },

  // Disease
  {
    name: 'disease_resistance',
    type: 'float',
    description: 'Disease resistance modifier.',
    example: 'disease_resistance = 0.1',
  },

  // Agriculture
  {
    name: 'farming_efficiency',
    type: 'float',
    description: 'Farming efficiency modifier.',
    example: 'farming_efficiency = 1.0',
  },

  // Movement
  {
    name: 'movement_speed_mult',
    type: 'float',
    description: 'Army movement speed multiplier.',
    example: 'movement_speed_mult = 1.0',
  },

  // Valid Terrain
  {
    name: 'valid_terrain',
    type: 'list',
    description: 'Terrain types valid for this climate.',
    example: `valid_terrain = {
    plains
    farmlands
    hills
}`,
  },
];

// Map for quick lookup
export const climateSchemaMap = new Map<string, FieldSchema>(
  climateSchema.map((field) => [field.name, field])
);

export function getClimateFieldNames(): string[] {
  return climateSchema.map((field) => field.name);
}

export function getClimateFieldDocumentation(fieldName: string): string | undefined {
  const field = climateSchemaMap.get(fieldName);
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
