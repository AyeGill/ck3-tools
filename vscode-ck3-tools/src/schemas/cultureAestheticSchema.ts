/**
 * Schema definition for CK3 Culture Aesthetics - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const cultureAestheticSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the aesthetic name.',
    example: 'name = "culture_aesthetic_western"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "culture_aesthetic_western_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this aesthetic.',
    example: 'icon = "gfx/interface/icons/culture/aesthetic_western.dds"',
  },

  // Architecture
  {
    name: 'building_gfx',
    type: 'string',
    description: 'Building graphics set.',
    example: 'building_gfx = "western_building_gfx"',
  },
  {
    name: 'unit_gfx',
    type: 'string',
    description: 'Unit graphics set.',
    example: 'unit_gfx = "western_unit_gfx"',
  },

  // Clothing
  {
    name: 'clothing_gfx',
    type: 'string',
    description: 'Clothing graphics set.',
    example: 'clothing_gfx = "western_clothing_gfx"',
  },
  {
    name: 'court_gfx',
    type: 'string',
    description: 'Court graphics set.',
    example: 'court_gfx = "western_court_gfx"',
  },

  // CoA
  {
    name: 'coa_gfx',
    type: 'string',
    description: 'Coat of arms graphics set.',
    example: 'coa_gfx = "western_coa_gfx"',
  },

  // Name
  {
    name: 'name_list',
    type: 'string',
    description: 'Name list to use.',
    example: 'name_list = "western_names"',
  },

  // Ethnicities
  {
    name: 'ethnicities',
    type: 'list',
    description: 'Ethnicities associated with this aesthetic.',
    example: `ethnicities = {
    european
    mediterranean
}`,
  },

  // Hair/Beard
  {
    name: 'hair_styles',
    type: 'list',
    description: 'Available hair styles.',
    example: `hair_styles = {
    western_hair_01
    western_hair_02
}`,
  },
  {
    name: 'beard_styles',
    type: 'list',
    description: 'Available beard styles.',
    example: `beard_styles = {
    western_beard_01
    western_beard_02
}`,
  },

  // Accessories
  {
    name: 'headgear',
    type: 'list',
    description: 'Available headgear.',
    example: `headgear = {
    crown_01
    crown_02
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for aesthetic availability.',
    example: `potential = {
    culture = { has_cultural_pillar = heritage_frankish }
}`,
  },
];

// Map for quick lookup
export const cultureAestheticSchemaMap = new Map<string, FieldSchema>(
  cultureAestheticSchema.map((field) => [field.name, field])
);

export function getCultureAestheticFieldNames(): string[] {
  return cultureAestheticSchema.map((field) => field.name);
}

export function getCultureAestheticFieldDocumentation(fieldName: string): string | undefined {
  const field = cultureAestheticSchemaMap.get(fieldName);
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
