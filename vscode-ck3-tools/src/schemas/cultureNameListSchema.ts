/**
 * Schema definition for CK3 Culture Name Lists - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const cultureNameListSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the culture name list.',
    example: 'name = "norse_names"',
  },

  // Male Names
  {
    name: 'male_names',
    type: 'list',
    description: 'List of male first names.',
    example: `male_names = {
    Erik
    Ragnar
    Bjorn
    Harald
}`,
  },

  // Female Names
  {
    name: 'female_names',
    type: 'list',
    description: 'List of female first names.',
    example: `female_names = {
    Astrid
    Freya
    Sigrid
    Ingrid
}`,
  },

  // Dynasty Names
  {
    name: 'dynasty_names',
    type: 'list',
    description: 'List of dynasty names.',
    example: `dynasty_names = {
    Yngling
    Munsö
    Fairhair
}`,
  },

  // Patronym
  {
    name: 'patronym_suffix_male',
    type: 'string',
    description: 'Suffix for male patronymic names.',
    example: 'patronym_suffix_male = "son"',
  },
  {
    name: 'patronym_suffix_female',
    type: 'string',
    description: 'Suffix for female patronymic names.',
    example: 'patronym_suffix_female = "dottir"',
  },
  {
    name: 'patronym_prefix_male',
    type: 'string',
    description: 'Prefix for male patronymic names.',
    example: 'patronym_prefix_male = "mac"',
  },
  {
    name: 'patronym_prefix_female',
    type: 'string',
    description: 'Prefix for female patronymic names.',
    example: 'patronym_prefix_female = "nic"',
  },

  // Matronym
  {
    name: 'matronym_suffix_male',
    type: 'string',
    description: 'Suffix for male matronymic names.',
    example: 'matronym_suffix_male = "son"',
  },
  {
    name: 'matronym_suffix_female',
    type: 'string',
    description: 'Suffix for female matronymic names.',
    example: 'matronym_suffix_female = "dottir"',
  },

  // Dynasty Prefix
  {
    name: 'dynasty_prefix',
    type: 'string',
    description: 'Prefix added to dynasty names.',
    example: 'dynasty_prefix = "House "',
  },

  // Cadet Dynasty Names
  {
    name: 'cadet_dynasty_names',
    type: 'list',
    description: 'List of cadet dynasty names.',
    example: `cadet_dynasty_names = {
    Yngling
    Ragnarsson
}`,
  },

  // Name Chances
  {
    name: 'father_name_chance',
    type: 'float',
    description: 'Chance to use father\'s name.',
    example: 'father_name_chance = 0.1',
  },
  {
    name: 'mother_name_chance',
    type: 'float',
    description: 'Chance to use mother\'s name.',
    example: 'mother_name_chance = 0.05',
  },
  {
    name: 'grandfather_name_chance',
    type: 'float',
    description: 'Chance to use grandfather\'s name.',
    example: 'grandfather_name_chance = 0.25',
  },
];

// Map for quick lookup
export const cultureNameListSchemaMap = new Map<string, FieldSchema>(
  cultureNameListSchema.map((field) => [field.name, field])
);

export function getCultureNameListFieldNames(): string[] {
  return cultureNameListSchema.map((field) => field.name);
}

export function getCultureNameListFieldDocumentation(fieldName: string): string | undefined {
  const field = cultureNameListSchemaMap.get(fieldName);
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
