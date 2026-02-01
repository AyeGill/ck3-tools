/**
 * Schema definition for CK3 Terrain Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const terrainSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for this terrain type on the map.',
    example: 'color = { 128 128 64 }',
  },
  {
    name: 'movement_speed',
    type: 'float',
    description: 'Movement speed modifier.',
    example: 'movement_speed = 0.8',
  },
  {
    name: 'combat_width',
    type: 'float',
    description: 'Combat width modifier.',
    example: 'combat_width = 0.75',
  },
  {
    name: 'audio_parameter',
    type: 'float',
    description: 'Audio parameter for sound effects.',
    example: 'audio_parameter = 0.5',
  },
  {
    name: 'supply_limit',
    type: 'integer',
    description: 'Base supply limit in this terrain.',
    example: 'supply_limit = 3',
  },
  {
    name: 'development_growth',
    type: 'float',
    description: 'Development growth modifier.',
    example: 'development_growth = -0.2',
  },

  // Combat Modifiers
  {
    name: 'attacker_hard_casualty',
    type: 'float',
    description: 'Casualty modifier for attackers (hard).',
    example: 'attacker_hard_casualty = 0.1',
  },
  {
    name: 'attacker_retreat_losses',
    type: 'float',
    description: 'Retreat losses for attackers.',
    example: 'attacker_retreat_losses = 0.1',
  },
  {
    name: 'defender_hard_casualty',
    type: 'float',
    description: 'Casualty modifier for defenders (hard).',
    example: 'defender_hard_casualty = -0.05',
  },
  {
    name: 'defender_advantage',
    type: 'integer',
    description: 'Advantage bonus for defenders.',
    example: 'defender_advantage = 5',
  },

  // Province Modifier
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to provinces with this terrain.',
    example: `province_modifier = {
    garrison_size = -0.25
    levy_size = -0.1
}`,
  },

  // Graphics
  {
    name: 'graphical_name',
    type: 'string',
    description: 'Graphical name for rendering.',
    example: 'graphical_name = "plains"',
  },
];

// Map for quick lookup
export const terrainSchemaMap = new Map<string, FieldSchema>(
  terrainSchema.map((field) => [field.name, field])
);

export function getTerrainFieldNames(): string[] {
  return terrainSchema.map((field) => field.name);
}

export function getTerrainFieldDocumentation(fieldName: string): string | undefined {
  const field = terrainSchemaMap.get(fieldName);
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
