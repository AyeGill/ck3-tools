/**
 * Schema definition for CK3 Name Lists - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const nameListSchema: FieldSchema[] = [
  // Male Names
  {
    name: 'male_names',
    type: 'list',
    description: 'List of male names.',
    example: `male_names = {
    William Henry Richard Edward
    Robert James John Thomas
}`,
  },

  // Female Names
  {
    name: 'female_names',
    type: 'list',
    description: 'List of female names.',
    example: `female_names = {
    Elizabeth Margaret Mary Anne
    Catherine Eleanor Jane Alice
}`,
  },

  // Dynasty Names
  {
    name: 'dynasty_names',
    type: 'list',
    description: 'List of dynasty names.',
    example: `dynasty_names = {
    "of York" "of Lancaster" "Plantagenet"
}`,
  },

  // Patronymic
  {
    name: 'patronym_male',
    type: 'string',
    description: 'Male patronymic suffix.',
    example: 'patronym_male = "son"',
  },
  {
    name: 'patronym_female',
    type: 'string',
    description: 'Female patronymic suffix.',
    example: 'patronym_female = "dottir"',
  },
  {
    name: 'patronym_prefix',
    type: 'string',
    description: 'Patronymic prefix.',
    example: 'patronym_prefix = "fitz"',
  },

  // Name Probability
  {
    name: 'always_use_patronym',
    type: 'boolean',
    description: 'Whether to always use patronymic names.',
    default: false,
    example: 'always_use_patronym = yes',
  },
  {
    name: 'dynasty_name_first',
    type: 'boolean',
    description: 'Whether dynasty name comes first.',
    default: false,
    example: 'dynasty_name_first = yes',
  },
  {
    name: 'founder_named_dynasties',
    type: 'boolean',
    description: 'Whether dynasties are named after founders.',
    default: true,
    example: 'founder_named_dynasties = yes',
  },

  // Graphical Culture
  {
    name: 'graphical_cultures',
    type: 'list',
    description: 'Graphical cultures associated with these names.',
    example: `graphical_cultures = {
    western_building_gfx
    western_coa_gfx
}`,
  },

  // Cadet Branch
  {
    name: 'cadet_dynasty_names',
    type: 'list',
    description: 'Names for cadet branches.',
    example: `cadet_dynasty_names = {
    "of Wessex" "of Mercia"
}`,
  },
];

// Map for quick lookup
export const nameListSchemaMap = new Map<string, FieldSchema>(
  nameListSchema.map((field) => [field.name, field])
);

export function getNameListFieldNames(): string[] {
  return nameListSchema.map((field) => field.name);
}

export function getNameListFieldDocumentation(fieldName: string): string | undefined {
  const field = nameListSchemaMap.get(fieldName);
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
