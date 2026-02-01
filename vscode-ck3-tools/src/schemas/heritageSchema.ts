/**
 * Schema definition for CK3 Heritages - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const heritageSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the heritage name.',
    example: 'name = "heritage_germanic"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the heritage description.',
    example: 'desc = "heritage_germanic_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this heritage.',
    example: 'icon = "gfx/interface/icons/culture_pillars/heritage_germanic.dds"',
  },

  // Color
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for the heritage.',
    example: 'color = { 0.8 0.6 0.4 }',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters with this heritage.',
    example: `character_modifier = {
    heavy_infantry_maintenance_mult = -0.1
}`,
  },
  {
    name: 'culture_modifier',
    type: 'block',
    description: 'Modifiers applied to cultures with this heritage.',
    example: `culture_modifier = {
    cultural_acceptance_gain_mult = 0.1
}`,
  },

  // Graphics
  {
    name: 'graphical_cultures',
    type: 'list',
    description: 'Graphical cultures associated with this heritage.',
    example: `graphical_cultures = {
    western_building_gfx
    western_unit_gfx
}`,
  },

  // Men at Arms
  {
    name: 'special_maa',
    type: 'list',
    description: 'Special men-at-arms available to this heritage.',
    example: `special_maa = {
    huscarl
}`,
  },

  // Traditions
  {
    name: 'traditions',
    type: 'list',
    description: 'Traditions inherent to this heritage.',
    example: `traditions = {
    tradition_warrior_culture
}`,
  },

  // History
  {
    name: 'history',
    type: 'block',
    description: 'Historical information about this heritage.',
    example: `history = {
    origins = germanic_origins
}`,
  },
];

// Map for quick lookup
export const heritageSchemaMap = new Map<string, FieldSchema>(
  heritageSchema.map((field) => [field.name, field])
);

export function getHeritageFieldNames(): string[] {
  return heritageSchema.map((field) => field.name);
}

export function getHeritageFieldDocumentation(fieldName: string): string | undefined {
  const field = heritageSchemaMap.get(fieldName);
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
