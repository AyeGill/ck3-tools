/**
 * Schema definition for CK3 Ethnic Groups - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const ethnicGroupSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the ethnic group name.',
    example: 'name = "ethnic_group_european"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "ethnic_group_european_desc"',
  },

  // Templates
  {
    name: 'template',
    type: 'string',
    description: 'Base template for this ethnicity.',
    example: 'template = "mediterranean_template"',
  },

  // Skin
  {
    name: 'skin_color',
    type: 'block',
    description: 'Skin color range.',
    example: `skin_color = {
    min = 0.3
    max = 0.7
}`,
  },
  {
    name: 'skin_color_blend',
    type: 'float',
    description: 'Skin color blend factor.',
    example: 'skin_color_blend = 0.5',
  },

  // Hair
  {
    name: 'hair_color',
    type: 'block',
    description: 'Hair color settings.',
    example: `hair_color = {
    0.2 0.1 0.05
}`,
  },
  {
    name: 'hair_color_blend',
    type: 'float',
    description: 'Hair color blend factor.',
    example: 'hair_color_blend = 0.5',
  },

  // Eye
  {
    name: 'eye_color',
    type: 'block',
    description: 'Eye color settings.',
    example: `eye_color = {
    0.3 0.5 0.2
}`,
  },
  {
    name: 'eye_color_blend',
    type: 'float',
    description: 'Eye color blend factor.',
    example: 'eye_color_blend = 0.5',
  },

  // Face Shape
  {
    name: 'face_shape',
    type: 'list',
    description: 'Face shape genes.',
    example: `face_shape = {
    gene_face_shape_01
    gene_face_shape_02
}`,
  },

  // Body
  {
    name: 'body_type',
    type: 'string',
    description: 'Body type template.',
    example: 'body_type = "average"',
  },

  // Blending
  {
    name: 'blend_with',
    type: 'block',
    description: 'Blend settings with other ethnicities.',
    example: `blend_with = {
    other_ethnic_group = 0.3
}`,
  },

  // Regions
  {
    name: 'regions',
    type: 'list',
    description: 'Regions where this ethnicity is found.',
    example: `regions = {
    world_europe_west
    world_europe_south
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for ethnicity availability.',
    example: `potential = {
    culture = { has_cultural_pillar = heritage_latin }
}`,
  },
];

// Map for quick lookup
export const ethnicGroupSchemaMap = new Map<string, FieldSchema>(
  ethnicGroupSchema.map((field) => [field.name, field])
);

export function getEthnicGroupFieldNames(): string[] {
  return ethnicGroupSchema.map((field) => field.name);
}

export function getEthnicGroupFieldDocumentation(fieldName: string): string | undefined {
  const field = ethnicGroupSchemaMap.get(fieldName);
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
