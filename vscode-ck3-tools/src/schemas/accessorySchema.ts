/**
 * Schema definition for CK3 Accessories - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const accessorySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the accessory.',
    example: 'name = "crown_01"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of accessory.',
    values: ['headgear', 'clothing', 'jewelry', 'weapon', 'held_item', 'background'],
    example: 'type = headgear',
  },

  // Model
  {
    name: 'entity',
    type: 'string',
    description: 'Entity file for the accessory.',
    example: 'entity = "crown_entity"',
  },
  {
    name: 'mesh',
    type: 'string',
    description: 'Mesh file for the accessory.',
    example: 'mesh = "gfx/models/accessories/crown.mesh"',
  },

  // Attachment
  {
    name: 'attach_node',
    type: 'string',
    description: 'Node to attach the accessory to.',
    example: 'attach_node = "head_node"',
  },
  {
    name: 'offset',
    type: 'block',
    description: 'Position offset for the accessory.',
    example: 'offset = { 0.0 0.1 0.0 }',
  },
  {
    name: 'rotation',
    type: 'block',
    description: 'Rotation offset for the accessory.',
    example: 'rotation = { 0.0 0.0 0.0 }',
  },
  {
    name: 'scale',
    type: 'float',
    description: 'Scale factor for the accessory.',
    example: 'scale = 1.0',
  },

  // Conditions
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for showing this accessory.',
    example: `trigger = {
    is_ruler = yes
    highest_held_title_tier >= tier_kingdom
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Display priority for this accessory.',
    example: 'priority = 100',
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for random selection.',
    example: `weight = {
    base = 10
}`,
  },

  // Culture/Religion
  {
    name: 'culture_group',
    type: 'string',
    description: 'Culture group for this accessory.',
    example: 'culture_group = germanic',
  },
  {
    name: 'religion',
    type: 'string',
    description: 'Religion for this accessory.',
    example: 'religion = christianity_religion',
  },
];

// Map for quick lookup
export const accessorySchemaMap = new Map<string, FieldSchema>(
  accessorySchema.map((field) => [field.name, field])
);

export function getAccessoryFieldNames(): string[] {
  return accessorySchema.map((field) => field.name);
}

export function getAccessoryFieldDocumentation(fieldName: string): string | undefined {
  const field = accessorySchemaMap.get(fieldName);
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
