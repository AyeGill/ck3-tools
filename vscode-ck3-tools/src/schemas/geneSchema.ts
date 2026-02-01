/**
 * Schema definition for CK3 Genes - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const geneSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the gene.',
    example: 'name = "gene_eye_color"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of gene.',
    values: ['color', 'morph', 'accessory', 'special'],
    example: 'type = color',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of the gene.',
    values: ['face', 'body', 'hair', 'eyes', 'skin', 'special'],
    example: 'category = eyes',
  },

  // Values
  {
    name: 'values',
    type: 'block',
    description: 'Possible values for this gene.',
    example: `values = {
    blue = { 0.2 0.4 0.8 }
    green = { 0.3 0.6 0.3 }
    brown = { 0.4 0.3 0.2 }
}`,
  },

  // Inheritance
  {
    name: 'inheritance_chance',
    type: 'float',
    description: 'Chance of inheriting this gene.',
    example: 'inheritance_chance = 0.5',
  },
  {
    name: 'dominant',
    type: 'boolean',
    description: 'Whether this is a dominant gene.',
    default: false,
    example: 'dominant = yes',
  },

  // Blending
  {
    name: 'blend_mode',
    type: 'enum',
    description: 'How genes blend between parents.',
    values: ['average', 'random', 'dominant', 'recessive'],
    example: 'blend_mode = average',
  },

  // Range
  {
    name: 'min_value',
    type: 'float',
    description: 'Minimum gene value.',
    example: 'min_value = 0.0',
  },
  {
    name: 'max_value',
    type: 'float',
    description: 'Maximum gene value.',
    example: 'max_value = 1.0',
  },

  // UI
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether this gene is visible in UI.',
    default: true,
    example: 'visible = yes',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this gene.',
    example: 'icon = "gfx/interface/icons/genes/eye_color.dds"',
  },
];

// Map for quick lookup
export const geneSchemaMap = new Map<string, FieldSchema>(
  geneSchema.map((field) => [field.name, field])
);

export function getGeneFieldNames(): string[] {
  return geneSchema.map((field) => field.name);
}

export function getGeneFieldDocumentation(fieldName: string): string | undefined {
  const field = geneSchemaMap.get(fieldName);
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
