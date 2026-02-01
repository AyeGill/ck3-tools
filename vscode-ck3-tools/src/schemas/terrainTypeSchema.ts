/**
 * Schema definition for CK3 Terrain Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const terrainTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for the terrain on the map.',
    example: 'color = { 0.4 0.6 0.2 }',
  },
  {
    name: 'texture',
    type: 'string',
    description: 'Texture file for the terrain.',
    example: 'texture = "gfx/map/terrain/plains.dds"',
  },

  // Movement
  {
    name: 'movement_speed',
    type: 'float',
    description: 'Movement speed modifier on this terrain.',
    example: 'movement_speed = 1.0',
  },
  {
    name: 'attrition',
    type: 'float',
    description: 'Attrition rate on this terrain.',
    example: 'attrition = 0.5',
  },
  {
    name: 'supply_limit',
    type: 'integer',
    description: 'Base supply limit for this terrain.',
    example: 'supply_limit = 3',
  },

  // Combat
  {
    name: 'combat_width',
    type: 'integer',
    description: 'Combat width modifier for battles on this terrain.',
    example: 'combat_width = -2',
  },
  {
    name: 'defender_advantage',
    type: 'integer',
    description: 'Advantage given to defenders.',
    example: 'defender_advantage = 3',
  },
  {
    name: 'attacker_advantage',
    type: 'integer',
    description: 'Advantage given to attackers.',
    example: 'attacker_advantage = 0',
  },

  // Development
  {
    name: 'development_growth',
    type: 'float',
    description: 'Development growth modifier.',
    example: 'development_growth = -0.2',
  },
  {
    name: 'build_slot_modifier',
    type: 'integer',
    description: 'Modifier to available building slots.',
    example: 'build_slot_modifier = -1',
  },

  // Province Modifiers
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to provinces with this terrain.',
    example: `province_modifier = {
    levy_size = -0.1
    supply_limit_mult = -0.25
}`,
  },

  // Graphical
  {
    name: 'sound',
    type: 'string',
    description: 'Sound effect for this terrain.',
    example: 'sound = "terrain_forest"',
  },
  {
    name: 'is_water',
    type: 'boolean',
    description: 'Whether this is a water terrain.',
    default: false,
    example: 'is_water = yes',
  },
  {
    name: 'is_coastal',
    type: 'boolean',
    description: 'Whether this is a coastal terrain.',
    default: false,
    example: 'is_coastal = yes',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Display priority for overlapping terrains.',
    example: 'priority = 10',
  },
];

// Map for quick lookup
export const terrainTypeSchemaMap = new Map<string, FieldSchema>(
  terrainTypeSchema.map((field) => [field.name, field])
);

export function getTerrainTypeFieldNames(): string[] {
  return terrainTypeSchema.map((field) => field.name);
}

export function getTerrainTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = terrainTypeSchemaMap.get(fieldName);
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
