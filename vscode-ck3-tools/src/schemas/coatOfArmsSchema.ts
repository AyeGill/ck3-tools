/**
 * Schema definition for CK3 Coat of Arms - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const coatOfArmsSchema: FieldSchema[] = [
  // Pattern
  {
    name: 'pattern',
    type: 'string',
    description: 'The pattern/background for the coat of arms.',
    example: 'pattern = "pattern_solid.dds"',
  },
  {
    name: 'color1',
    type: 'string',
    description: 'Primary color (named color or RGB).',
    example: 'color1 = red',
  },
  {
    name: 'color2',
    type: 'string',
    description: 'Secondary color (named color or RGB).',
    example: 'color2 = yellow',
  },
  {
    name: 'color3',
    type: 'string',
    description: 'Tertiary color (named color or RGB).',
    example: 'color3 = white',
  },
  {
    name: 'color4',
    type: 'string',
    description: 'Quaternary color (named color or RGB).',
    example: 'color4 = black',
  },
  {
    name: 'color5',
    type: 'string',
    description: 'Fifth color (named color or RGB).',
    example: 'color5 = blue',
  },

  // Emblems
  {
    name: 'colored_emblem',
    type: 'block',
    description: 'A colored emblem to overlay on the coat of arms.',
    example: `colored_emblem = {
    instance = {
        position = { 0.5 0.5 }
        scale = { 1.0 1.0 }
    }
    texture = "ce_lion_rampant.dds"
    color1 = yellow
    color2 = red
}`,
  },
  {
    name: 'textured_emblem',
    type: 'block',
    description: 'A textured emblem to overlay.',
    example: `textured_emblem = {
    instance = {
        position = { 0.5 0.5 }
        scale = { 0.8 0.8 }
    }
    texture = "ce_dragon.dds"
}`,
  },

  // Sub-blocks
  {
    name: 'sub',
    type: 'block',
    description: 'A sub coat of arms (for quartering etc).',
    example: `sub = {
    instance = {
        position = { 0.25 0.25 }
        scale = { 0.5 0.5 }
    }
    pattern = "pattern_solid.dds"
    color1 = blue
}`,
  },

  // Instance properties (inside emblems)
  {
    name: 'instance',
    type: 'block',
    description: 'Instance placement properties.',
    example: `instance = {
    position = { 0.5 0.5 }
    scale = { 1.0 1.0 }
    rotation = 0
}`,
  },
  {
    name: 'texture',
    type: 'string',
    description: 'Texture file for the emblem.',
    example: 'texture = "ce_lion_rampant.dds"',
  },
  {
    name: 'position',
    type: 'block',
    description: 'Position of emblem (x, y from 0-1).',
    example: 'position = { 0.5 0.5 }',
  },
  {
    name: 'scale',
    type: 'block',
    description: 'Scale of emblem (x, y).',
    example: 'scale = { 1.0 1.0 }',
  },
  {
    name: 'rotation',
    type: 'integer',
    description: 'Rotation in degrees.',
    example: 'rotation = 45',
  },
  {
    name: 'depth',
    type: 'float',
    description: 'Depth/layer for rendering order.',
    example: 'depth = 1.0',
  },
  {
    name: 'mask',
    type: 'block',
    description: 'Mask indices for the emblem.',
    example: 'mask = { 1 2 }',
  },
];

// Schema for CoA template definitions
export const coaTemplateSchema: FieldSchema[] = [
  {
    name: 'parent',
    type: 'string',
    description: 'Parent template to inherit from.',
    example: 'parent = "base_coat_of_arms"',
  },
  {
    name: 'pattern',
    type: 'list',
    description: 'List of possible patterns to randomly select.',
    example: `pattern = {
    "pattern_solid.dds"
    "pattern_quartered.dds"
}`,
  },
  {
    name: 'color1',
    type: 'list',
    description: 'List of possible primary colors.',
    example: `color1 = {
    red yellow blue
}`,
  },
  {
    name: 'colored_emblem',
    type: 'block',
    description: 'Colored emblem configuration.',
    example: `colored_emblem = {
    texture = "ce_lion.dds"
    color1 = color1
}`,
  },
];

// Map for quick lookup
export const coatOfArmsSchemaMap = new Map<string, FieldSchema>(
  coatOfArmsSchema.map((field) => [field.name, field])
);

export const coaTemplateSchemaMap = new Map<string, FieldSchema>(
  coaTemplateSchema.map((field) => [field.name, field])
);

export function getCoatOfArmsFieldNames(): string[] {
  return coatOfArmsSchema.map((field) => field.name);
}

export function getCoatOfArmsFieldDocumentation(fieldName: string): string | undefined {
  const field = coatOfArmsSchemaMap.get(fieldName);
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
