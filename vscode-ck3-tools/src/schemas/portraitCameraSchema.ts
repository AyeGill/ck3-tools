/**
 * Schema definition for CK3 Portrait Cameras - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const portraitCameraSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the portrait camera.',
    example: 'name = "camera_head"',
  },

  // Position
  {
    name: 'position',
    type: 'block',
    description: 'Camera position in 3D space.',
    example: 'position = { 0.0 1.6 2.0 }',
  },
  {
    name: 'look_at',
    type: 'block',
    description: 'Point the camera looks at.',
    example: 'look_at = { 0.0 1.5 0.0 }',
  },

  // Rotation
  {
    name: 'rotation',
    type: 'block',
    description: 'Camera rotation (pitch, yaw, roll).',
    example: 'rotation = { 0.0 0.0 0.0 }',
  },

  // Field of View
  {
    name: 'fov',
    type: 'float',
    description: 'Field of view in degrees.',
    example: 'fov = 45.0',
  },

  // Near/Far
  {
    name: 'near',
    type: 'float',
    description: 'Near clipping plane.',
    example: 'near = 0.1',
  },
  {
    name: 'far',
    type: 'float',
    description: 'Far clipping plane.',
    example: 'far = 100.0',
  },

  // Zoom
  {
    name: 'zoom',
    type: 'float',
    description: 'Camera zoom level.',
    example: 'zoom = 1.0',
  },
  {
    name: 'min_zoom',
    type: 'float',
    description: 'Minimum zoom level.',
    example: 'min_zoom = 0.5',
  },
  {
    name: 'max_zoom',
    type: 'float',
    description: 'Maximum zoom level.',
    example: 'max_zoom = 2.0',
  },

  // Animation
  {
    name: 'animation_curve',
    type: 'string',
    description: 'Animation curve for camera movement.',
    example: 'animation_curve = "smooth"',
  },

  // Type
  {
    name: 'camera_type',
    type: 'enum',
    description: 'Type of portrait camera.',
    values: ['head', 'body', 'full', 'bust', 'custom'],
    example: 'camera_type = head',
  },
];

// Map for quick lookup
export const portraitCameraSchemaMap = new Map<string, FieldSchema>(
  portraitCameraSchema.map((field) => [field.name, field])
);

export function getPortraitCameraFieldNames(): string[] {
  return portraitCameraSchema.map((field) => field.name);
}

export function getPortraitCameraFieldDocumentation(fieldName: string): string | undefined {
  const field = portraitCameraSchemaMap.get(fieldName);
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
