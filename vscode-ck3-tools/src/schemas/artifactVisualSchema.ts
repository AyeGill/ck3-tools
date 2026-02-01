/**
 * Schema definition for CK3 Artifact Visuals - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const artifactVisualSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the artifact visual.',
    example: 'name = "sword_visual"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon path for the artifact.',
    example: 'icon = "gfx/interface/icons/artifacts/sword.dds"',
  },

  // 3D Asset
  {
    name: 'asset',
    type: 'string',
    description: '3D asset for the artifact.',
    example: 'asset = "artifact_sword_mesh"',
  },
  {
    name: 'pedestal',
    type: 'string',
    description: 'Pedestal asset for display.',
    example: 'pedestal = "pedestal_weapon"',
  },

  // Texture
  {
    name: 'texture',
    type: 'string',
    description: 'Texture path for the artifact.',
    example: 'texture = "gfx/models/artifacts/sword_diffuse.dds"',
  },
  {
    name: 'normal_map',
    type: 'string',
    description: 'Normal map texture path.',
    example: 'normal_map = "gfx/models/artifacts/sword_normal.dds"',
  },

  // Colors
  {
    name: 'color1',
    type: 'block',
    description: 'Primary color of the artifact.',
    example: `color1 = {
    0.8 0.6 0.2
}`,
  },
  {
    name: 'color2',
    type: 'block',
    description: 'Secondary color of the artifact.',
    example: `color2 = {
    0.3 0.3 0.3
}`,
  },

  // Animation
  {
    name: 'animation',
    type: 'string',
    description: 'Animation to play.',
    example: 'animation = "idle"',
  },

  // Scale
  {
    name: 'scale',
    type: 'float',
    description: 'Scale factor for the visual.',
    example: 'scale = 1.0',
  },
  {
    name: 'position_offset',
    type: 'block',
    description: 'Position offset for the visual.',
    example: `position_offset = {
    x = 0
    y = 0.1
    z = 0
}`,
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of artifact visual.',
    values: ['weapon', 'armor', 'regalia', 'trinket', 'book'],
    example: 'type = weapon',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for using this visual.',
    example: `trigger = {
    artifact_rarity >= illustrious
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for visual selection.',
    example: `weight = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const artifactVisualSchemaMap = new Map<string, FieldSchema>(
  artifactVisualSchema.map((field) => [field.name, field])
);

export function getArtifactVisualFieldNames(): string[] {
  return artifactVisualSchema.map((field) => field.name);
}

export function getArtifactVisualFieldDocumentation(fieldName: string): string | undefined {
  const field = artifactVisualSchemaMap.get(fieldName);
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
