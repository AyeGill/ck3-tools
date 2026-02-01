/**
 * Schema definition for CK3 Province History - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const provinceHistorySchema: FieldSchema[] = [
  // Culture and Religion
  {
    name: 'culture',
    type: 'string',
    description: 'The culture of this province.',
    example: 'culture = english',
  },
  {
    name: 'religion',
    type: 'string',
    description: 'The religion of this province.',
    example: 'religion = catholic',
  },
  {
    name: 'faith',
    type: 'string',
    description: 'The specific faith of this province.',
    example: 'faith = catholic',
  },

  // Holdings
  {
    name: 'holding',
    type: 'enum',
    description: 'Type of holding in this province.',
    values: ['castle_holding', 'city_holding', 'church_holding', 'tribal_holding', 'none'],
    example: 'holding = castle_holding',
  },
  {
    name: 'buildings',
    type: 'list',
    description: 'Buildings constructed in this province.',
    example: `buildings = {
    curtain_walls_01
    barracks_01
}`,
  },

  // Special Buildings
  {
    name: 'special_building',
    type: 'string',
    description: 'Special building in this province.',
    example: 'special_building = normal_building_hagia_sophia',
  },
  {
    name: 'special_building_slot',
    type: 'string',
    description: 'Special building slot for unique buildings.',
    example: 'special_building_slot = hagia_sophia_01',
  },

  // Terrain
  {
    name: 'terrain',
    type: 'string',
    description: 'Terrain type of the province.',
    example: 'terrain = plains',
  },

  // Date-based Changes
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects to apply at this date.',
    example: `effect = {
    set_holding_type = city_holding
}`,
  },

  // Development
  {
    name: 'development_level',
    type: 'integer',
    description: 'Starting development level.',
    example: 'development_level = 20',
  },

  // Holy Site
  {
    name: 'holy_site',
    type: 'string',
    description: 'Holy site identifier in this province.',
    example: 'holy_site = rome_holy_site',
  },
];

// Map for quick lookup
export const provinceHistorySchemaMap = new Map<string, FieldSchema>(
  provinceHistorySchema.map((field) => [field.name, field])
);

export function getProvinceHistoryFieldNames(): string[] {
  return provinceHistorySchema.map((field) => field.name);
}

export function getProvinceHistoryFieldDocumentation(fieldName: string): string | undefined {
  const field = provinceHistorySchemaMap.get(fieldName);
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
