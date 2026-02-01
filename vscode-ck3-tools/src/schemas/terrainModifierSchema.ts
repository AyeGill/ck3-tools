/**
 * Schema definition for CK3 Terrain Modifiers - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const terrainModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the terrain modifier.',
    example: 'name = "high_altitude"',
  },

  // Combat Modifiers
  {
    name: 'attacker',
    type: 'block',
    description: 'Modifiers applied to attackers.',
    example: `attacker = {
    damage = -0.2
    pursuit = -0.1
}`,
  },
  {
    name: 'defender',
    type: 'block',
    description: 'Modifiers applied to defenders.',
    example: `defender = {
    damage = 0.1
    advantage = 5
}`,
  },

  // Combat Specifics
  {
    name: 'combat_width',
    type: 'integer',
    description: 'Combat width modifier.',
    example: 'combat_width = -5',
  },
  {
    name: 'hard_casualty_modifier',
    type: 'float',
    description: 'Hard casualty modifier.',
    example: 'hard_casualty_modifier = 0.1',
  },
  {
    name: 'retreat_losses',
    type: 'float',
    description: 'Losses when retreating.',
    example: 'retreat_losses = 0.1',
  },

  // Movement
  {
    name: 'movement_speed',
    type: 'float',
    description: 'Movement speed modifier.',
    example: 'movement_speed = -0.3',
  },

  // Supply
  {
    name: 'supply_limit',
    type: 'float',
    description: 'Supply limit modifier.',
    example: 'supply_limit = -0.2',
  },
  {
    name: 'attrition',
    type: 'float',
    description: 'Army attrition.',
    example: 'attrition = 0.02',
  },

  // Province Modifiers
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to the province.',
    example: `province_modifier = {
    development_growth = -0.1
}`,
  },

  // Siege
  {
    name: 'siege_tier',
    type: 'integer',
    description: 'Siege tier modifier.',
    example: 'siege_tier = 1',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this modifier to apply.',
    example: `trigger = {
    has_building = mountain_roads
}`,
  },

  // Unit Modifiers
  {
    name: 'archer_damage_mult',
    type: 'float',
    description: 'Archer damage multiplier.',
    example: 'archer_damage_mult = 0.8',
  },
  {
    name: 'cavalry_damage_mult',
    type: 'float',
    description: 'Cavalry damage multiplier.',
    example: 'cavalry_damage_mult = 0.5',
  },
  {
    name: 'infantry_damage_mult',
    type: 'float',
    description: 'Infantry damage multiplier.',
    example: 'infantry_damage_mult = 1.0',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this terrain modifier.',
    example: 'icon = "gfx/interface/icons/terrain_modifiers/mountains.dds"',
  },
];

// Map for quick lookup
export const terrainModifierSchemaMap = new Map<string, FieldSchema>(
  terrainModifierSchema.map((field) => [field.name, field])
);

export function getTerrainModifierFieldNames(): string[] {
  return terrainModifierSchema.map((field) => field.name);
}

export function getTerrainModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = terrainModifierSchemaMap.get(fieldName);
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
