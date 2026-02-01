/**
 * Schema definition for CK3 Map Objects - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const mapObjectSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the map object.',
    example: 'name = "castle_object"',
  },

  // Model
  {
    name: 'entity',
    type: 'string',
    description: 'Entity file for the object.',
    example: 'entity = "castle_entity"',
  },
  {
    name: 'mesh',
    type: 'string',
    description: 'Mesh file for the object.',
    example: 'mesh = "gfx/models/map_objects/castle.mesh"',
  },

  // Position
  {
    name: 'position',
    type: 'block',
    description: 'Position on the map.',
    example: 'position = { 100.0 0.0 200.0 }',
  },
  {
    name: 'rotation',
    type: 'block',
    description: 'Rotation of the object.',
    example: 'rotation = { 0.0 45.0 0.0 }',
  },
  {
    name: 'scale',
    type: 'float',
    description: 'Scale factor.',
    example: 'scale = 1.0',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of map object.',
    values: ['building', 'decoration', 'unit', 'siege', 'terrain_feature'],
    example: 'type = building',
  },

  // Province
  {
    name: 'province',
    type: 'integer',
    description: 'Province ID for the object.',
    example: 'province = 1234',
  },

  // Visibility
  {
    name: 'visible',
    type: 'trigger',
    description: 'Conditions for visibility.',
    example: `visible = {
    province = { has_holding_type = castle_holding }
}`,
  },

  // Animation
  {
    name: 'animation',
    type: 'string',
    description: 'Animation to play.',
    example: 'animation = "idle"',
  },

  // LOD
  {
    name: 'lod_distance',
    type: 'float',
    description: 'Level of detail distance.',
    example: 'lod_distance = 500.0',
  },
];

// Map for quick lookup
export const mapObjectSchemaMap = new Map<string, FieldSchema>(
  mapObjectSchema.map((field) => [field.name, field])
);

export function getMapObjectFieldNames(): string[] {
  return mapObjectSchema.map((field) => field.name);
}

export function getMapObjectFieldDocumentation(fieldName: string): string | undefined {
  const field = mapObjectSchemaMap.get(fieldName);
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
