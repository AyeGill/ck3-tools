/**
 * Schema definition for CK3 Court Position Categories - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const courtPositionCategorySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the category name.',
    example: 'name = "court_position_category_administrative"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the category description.',
    example: 'desc = "court_position_category_administrative_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the category.',
    example: 'icon = "gfx/interface/icons/court_positions/administrative.dds"',
  },

  // Order
  {
    name: 'order',
    type: 'integer',
    description: 'Display order for the category.',
    example: 'order = 10',
  },

  // Visibility
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for showing this category.',
    example: `is_shown = {
    has_royal_court = yes
}`,
  },

  // Default
  {
    name: 'default',
    type: 'boolean',
    description: 'Whether this is the default category.',
    default: false,
    example: 'default = yes',
  },
];

// Map for quick lookup
export const courtPositionCategorySchemaMap = new Map<string, FieldSchema>(
  courtPositionCategorySchema.map((field) => [field.name, field])
);

export function getCourtPositionCategoryFieldNames(): string[] {
  return courtPositionCategorySchema.map((field) => field.name);
}

export function getCourtPositionCategoryFieldDocumentation(fieldName: string): string | undefined {
  const field = courtPositionCategorySchemaMap.get(fieldName);
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
