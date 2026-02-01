/**
 * Schema definition for CK3 Coat of Arms Patterns - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const coaPatternSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Internal name of the pattern.',
    example: 'name = "pattern_solid"',
  },

  // Texture
  {
    name: 'texture',
    type: 'string',
    description: 'Texture file for the pattern.',
    example: 'texture = "gfx/coat_of_arms/patterns/solid.dds"',
  },
  {
    name: 'texture_path',
    type: 'string',
    description: 'Path to the pattern texture.',
    example: 'texture_path = "gfx/coat_of_arms/patterns/"',
  },

  // Colors
  {
    name: 'colors',
    type: 'integer',
    description: 'Number of colors used by this pattern.',
    example: 'colors = 2',
  },
  {
    name: 'color1',
    type: 'block',
    description: 'First color definition.',
    example: `color1 = {
    x = 0
    y = 0
    w = 0.5
    h = 1.0
}`,
  },
  {
    name: 'color2',
    type: 'block',
    description: 'Second color definition.',
    example: `color2 = {
    x = 0.5
    y = 0
    w = 0.5
    h = 1.0
}`,
  },
  {
    name: 'color3',
    type: 'block',
    description: 'Third color definition.',
    example: `color3 = {
    x = 0
    y = 0.5
    w = 0.5
    h = 0.5
}`,
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of the pattern.',
    values: ['simple', 'complex', 'divisions', 'ordinaries', 'special'],
    example: 'category = simple',
  },

  // Mask
  {
    name: 'mask',
    type: 'string',
    description: 'Mask texture for the pattern.',
    example: 'mask = "gfx/coat_of_arms/masks/solid_mask.dds"',
  },

  // Weight
  {
    name: 'weight',
    type: 'integer',
    description: 'Generation weight for random selection.',
    example: 'weight = 100',
  },

  // Visibility
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether pattern appears in designer.',
    default: true,
    example: 'visible = yes',
  },

  // Special
  {
    name: 'allow_charged',
    type: 'boolean',
    description: 'Whether charges can be placed on this pattern.',
    default: true,
    example: 'allow_charged = yes',
  },
];

// Map for quick lookup
export const coaPatternSchemaMap = new Map<string, FieldSchema>(
  coaPatternSchema.map((field) => [field.name, field])
);

export function getCoaPatternFieldNames(): string[] {
  return coaPatternSchema.map((field) => field.name);
}

export function getCoaPatternFieldDocumentation(fieldName: string): string | undefined {
  const field = coaPatternSchemaMap.get(fieldName);
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
