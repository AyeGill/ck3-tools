/**
 * Schema definition for CK3 Casus Belli Groups - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const casusBelliGroupSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name of the casus belli group.',
    example: 'name = "CB_GROUP_NAME"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the group.',
    example: 'icon = "gfx/interface/icons/cb_groups/conquest.dds"',
  },

  // Ordering
  {
    name: 'order',
    type: 'integer',
    description: 'Display order in the UI.',
    example: 'order = 10',
  },

  // Color
  {
    name: 'color',
    type: 'block',
    description: 'Color for the group.',
    example: 'color = { 0.8 0.2 0.2 }',
  },

  // Description
  {
    name: 'desc',
    type: 'string',
    description: 'Description localization key.',
    example: 'desc = "CB_GROUP_DESC"',
  },
];

// Map for quick lookup
export const casusBelliGroupSchemaMap = new Map<string, FieldSchema>(
  casusBelliGroupSchema.map((field) => [field.name, field])
);

export function getCasusBelliGroupFieldNames(): string[] {
  return casusBelliGroupSchema.map((field) => field.name);
}

export function getCasusBelliGroupFieldDocumentation(fieldName: string): string | undefined {
  const field = casusBelliGroupSchemaMap.get(fieldName);
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
