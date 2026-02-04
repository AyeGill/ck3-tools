/**
 * Schema definition for CK3 DNA Data - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const dnaDataSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'portrait_info',
    type: 'block',
    description: 'Portrait generation information.',
    example: `portrait_info = {
    genes = { }
}`,
  },
  {
    name: 'genes',
    type: 'block',
    description: 'Genetic information for portrait generation.',
    example: `genes = {
    hair_color = { 0 0 0 255 }
    eye_color = { 0 128 255 255 }
}`,
  },

  // Physical Features
  {
    name: 'hair_color',
    type: 'block',
    description: 'Hair color RGBA values.',
    example: 'hair_color = { 139 69 19 255 }',
  },
  {
    name: 'eye_color',
    type: 'block',
    description: 'Eye color RGBA values.',
    example: 'eye_color = { 0 128 255 255 }',
  },
  {
    name: 'skin_color',
    type: 'block',
    description: 'Skin color RGBA values.',
    example: 'skin_color = { 255 220 185 255 }',
  },

  // Gene Modifiers
  {
    name: 'gene_age',
    type: 'block',
    description: 'Age-related gene settings.',
    example: `gene_age = {
    value = 0.5
}`,
  },
  {
    name: 'gene_chin',
    type: 'block',
    description: 'Chin shape gene.',
    example: `gene_chin = {
    template = chin_01
    value = 0.5
}`,
  },
  {
    name: 'gene_nose',
    type: 'block',
    description: 'Nose shape gene.',
    example: `gene_nose = {
    template = nose_01
    value = 0.5
}`,
  },
  {
    name: 'gene_mouth',
    type: 'block',
    description: 'Mouth shape gene.',
    example: `gene_mouth = {
    template = mouth_01
    value = 0.5
}`,
  },
  {
    name: 'gene_eye',
    type: 'block',
    description: 'Eye shape gene.',
    example: `gene_eye = {
    template = eye_01
    value = 0.5
}`,
  },
  {
    name: 'gene_forehead',
    type: 'block',
    description: 'Forehead shape gene.',
    example: `gene_forehead = {
    template = forehead_01
    value = 0.5
}`,
  },
  {
    name: 'gene_cheeks',
    type: 'block',
    description: 'Cheek shape gene.',
    example: `gene_cheeks = {
    template = cheeks_01
    value = 0.5
}`,
  },
  {
    name: 'gene_jaw',
    type: 'block',
    description: 'Jaw shape gene.',
    example: `gene_jaw = {
    template = jaw_01
    value = 0.5
}`,
  },
  {
    name: 'gene_ears',
    type: 'block',
    description: 'Ear shape gene.',
    example: `gene_ears = {
    template = ears_01
    value = 0.5
}`,
  },
  {
    name: 'gene_neck',
    type: 'block',
    description: 'Neck shape gene.',
    example: `gene_neck = {
    template = neck_01
    value = 0.5
}`,
  },

  // Body Genes
  {
    name: 'gene_bs_body_type',
    type: 'block',
    description: 'Body type gene.',
    example: `gene_bs_body_type = {
    template = body_average
    value = 0.5
}`,
  },
  {
    name: 'gene_bs_body_fat',
    type: 'block',
    description: 'Body fat gene.',
    example: `gene_bs_body_fat = {
    template = body_fat_average
    value = 0.5
}`,
  },

  // Template and Preset
  {
    name: 'template',
    type: 'string',
    description: 'Gene template to use.',
    example: 'template = gene_template_01',
  },
  {
    name: 'value',
    type: 'float',
    description: 'Gene value (0.0 to 1.0).',
    example: 'value = 0.5',
  },

  // Accessory Genes
  {
    name: 'gene_hairstyles',
    type: 'block',
    description: 'Hairstyle gene.',
    example: `gene_hairstyles = {
    template = western_hairstyles
    value = 0.5
}`,
  },
  {
    name: 'gene_beards',
    type: 'block',
    description: 'Beard gene.',
    example: `gene_beards = {
    template = western_beards
    value = 0.5
}`,
  },
  {
    name: 'gene_clothes',
    type: 'block',
    description: 'Clothing gene.',
    example: `gene_clothes = {
    template = western_clothes
    value = 0.5
}`,
  },
];

// Map for quick lookup
export const dnaDataSchemaMap = new Map<string, FieldSchema>(
  dnaDataSchema.map((field) => [field.name, field])
);

export function getDnaDataFieldNames(): string[] {
  return dnaDataSchema.map((field) => field.name);
}

export function getDnaDataFieldDocumentation(fieldName: string): string | undefined {
  const field = dnaDataSchemaMap.get(fieldName);
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
