/**
 * Schema definition for CK3 Portrait Modifiers - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const portraitModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'usage',
    type: 'enum',
    description: 'When this modifier should be used.',
    values: ['game', 'editor', 'both'],
    example: 'usage = game',
  },
  {
    name: 'selection_weight',
    type: 'block',
    description: 'Weight for random selection.',
    example: `selection_weight = {
    base = 1
}`,
  },

  // Gene Overrides
  {
    name: 'dna_modifiers',
    type: 'block',
    description: 'DNA modifications applied by this modifier.',
    example: `dna_modifiers = {
    accessory = {
        mode = add
        gene = gene_hairstyles
        template = bald
        value = 1.0
    }
}`,
  },

  // Accessory Block
  {
    name: 'accessory',
    type: 'block',
    description: 'Accessory modification.',
    example: `accessory = {
    mode = add
    gene = gene_headgear
    template = crown
    value = 1.0
}`,
  },
  {
    name: 'morph',
    type: 'block',
    description: 'Morph modification.',
    example: `morph = {
    mode = add
    gene = gene_chin
    template = chin_forward
    value = 0.5
}`,
  },

  // Mode Types
  {
    name: 'mode',
    type: 'enum',
    description: 'How the modifier is applied.',
    values: ['add', 'replace', 'modify', 'set'],
    example: 'mode = add',
  },
  {
    name: 'gene',
    type: 'string',
    description: 'Gene to modify.',
    example: 'gene = gene_hairstyles',
  },

  // Value Settings
  {
    name: 'value',
    type: 'float',
    description: 'Value to apply (0.0 to 1.0).',
    example: 'value = 0.8',
  },
  {
    name: 'range',
    type: 'block',
    description: 'Range of values to apply.',
    example: 'range = { 0.3 0.7 }',
  },

  // Color Modifications
  {
    name: 'color',
    type: 'block',
    description: 'Color modification.',
    example: `color = {
    mode = replace
    gene = gene_hair_color
    value = { 255 255 255 255 }
}`,
  },

  // Trigger
  {
    name: 'is_valid_custom',
    type: 'trigger',
    description: 'Custom validity conditions.',
    example: `is_valid_custom = {
    has_trait = old
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Application priority (higher = later).',
    example: 'priority = 100',
  },
];

// Map for quick lookup
export const portraitModifierSchemaMap = new Map<string, FieldSchema>(
  portraitModifierSchema.map((field) => [field.name, field])
);

export function getPortraitModifierFieldNames(): string[] {
  return portraitModifierSchema.map((field) => field.name);
}

export function getPortraitModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = portraitModifierSchemaMap.get(fieldName);
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
