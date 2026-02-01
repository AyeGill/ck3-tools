/**
 * Schema definition for CK3 Title Colors - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const titleColorSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for the title.',
    example: 'color = { 0.8 0.2 0.2 }',
  },
  {
    name: 'color2',
    type: 'block',
    description: 'Secondary RGB color for the title.',
    example: 'color2 = { 0.6 0.1 0.1 }',
  },

  // HSV
  {
    name: 'color_hsv',
    type: 'block',
    description: 'HSV color for the title.',
    example: 'color_hsv = { 0.0 0.8 0.8 }',
  },

  // Named
  {
    name: 'color_name',
    type: 'string',
    description: 'Named color reference.',
    example: 'color_name = "red"',
  },

  // Title
  {
    name: 'title',
    type: 'string',
    description: 'Title this color applies to.',
    example: 'title = k_england',
  },

  // Conditions
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for using this color.',
    example: `trigger = {
    holder = { has_government = theocracy_government }
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority for color selection.',
    example: 'priority = 100',
  },

  // Map
  {
    name: 'map_color',
    type: 'block',
    description: 'Color shown on the map.',
    example: 'map_color = { 0.8 0.2 0.2 }',
  },
];

// Map for quick lookup
export const titleColorSchemaMap = new Map<string, FieldSchema>(
  titleColorSchema.map((field) => [field.name, field])
);

export function getTitleColorFieldNames(): string[] {
  return titleColorSchema.map((field) => field.name);
}

export function getTitleColorFieldDocumentation(fieldName: string): string | undefined {
  const field = titleColorSchemaMap.get(fieldName);
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
