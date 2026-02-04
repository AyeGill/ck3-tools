/**
 * Schema definition for CK3 Title History - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const titleHistorySchema: FieldSchema[] = [
  // Holder
  {
    name: 'holder',
    type: 'integer',
    description: 'Character ID who holds the title.',
    example: 'holder = 12345',
  },
  {
    name: 'government',
    type: 'string',
    description: 'Government type for the title.',
    example: 'government = feudal_government',
  },
  {
    name: 'liege',
    type: 'string',
    description: 'Liege title.',
    example: 'liege = k_france',
  },

  // De jure
  {
    name: 'de_jure_liege',
    type: 'string',
    description: 'De jure liege title.',
    example: 'de_jure_liege = e_hre',
  },

  // Development
  {
    name: 'development_level',
    type: 'integer',
    description: 'Development level of the county.',
    example: 'development_level = 20',
  },

  // Special
  {
    name: 'effect',
    type: 'effect',
    description: 'Run arbitrary effects.',
    example: `effect = {
    set_variable = { name = custom_var value = 1 }
}`,
  },

  // Change succession
  {
    name: 'succession_laws',
    type: 'list',
    description: 'Succession laws for the title.',
    example: `succession_laws = {
    feudal_elective
    male_preference
}`,
  },

  // Buildings
  {
    name: 'buildings',
    type: 'block',
    description: 'Buildings in the holding.',
    example: `buildings = {
    castle_walls_01
    barracks_01
}`,
  },

  // Name
  {
    name: 'name',
    type: 'string',
    description: 'Custom name for the title.',
    example: 'name = "Custom Kingdom"',
  },

  // Reset
  {
    name: 'reset_name',
    type: 'boolean',
    description: 'Reset to default name.',
    example: 'reset_name = yes',
  },
];

// Map for quick lookup
export const titleHistorySchemaMap = new Map<string, FieldSchema>(
  titleHistorySchema.map((field) => [field.name, field])
);

export function getTitleHistoryFieldNames(): string[] {
  return titleHistorySchema.map((field) => field.name);
}

export function getTitleHistoryFieldDocumentation(fieldName: string): string | undefined {
  const field = titleHistorySchemaMap.get(fieldName);
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
