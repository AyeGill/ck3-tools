/**
 * Schema definition for CK3 Commander Traits - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const commanderTraitSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the trait name.',
    example: 'name = "commander_trait_aggressive"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "commander_trait_aggressive_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this trait.',
    example: 'icon = "gfx/interface/icons/traits/commander_aggressive.dds"',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of commander trait.',
    values: ['tactical', 'strategic', 'leadership', 'personality', 'special'],
    example: 'category = tactical',
  },

  // Combat Modifiers
  {
    name: 'advantage',
    type: 'integer',
    description: 'Combat advantage bonus.',
    example: 'advantage = 5',
  },
  {
    name: 'damage',
    type: 'float',
    description: 'Damage modifier.',
    example: 'damage = 0.15',
  },
  {
    name: 'toughness',
    type: 'float',
    description: 'Toughness modifier.',
    example: 'toughness = 0.1',
  },
  {
    name: 'pursuit',
    type: 'float',
    description: 'Pursuit modifier.',
    example: 'pursuit = 0.2',
  },
  {
    name: 'screen',
    type: 'float',
    description: 'Screen modifier.',
    example: 'screen = 0.1',
  },

  // Army Modifiers
  {
    name: 'army_modifier',
    type: 'block',
    description: 'Modifiers for the army.',
    example: `army_modifier = {
    levy_reinforcement_rate = 0.1
    army_maintenance_mult = -0.05
}`,
  },

  // Terrain
  {
    name: 'terrain_bonuses',
    type: 'block',
    description: 'Bonuses for specific terrains.',
    example: `terrain_bonuses = {
    mountains = { advantage = 5 }
    forest = { advantage = 3 }
}`,
  },

  // Counter
  {
    name: 'counters',
    type: 'list',
    description: 'Traits this counters.',
    example: `counters = {
    commander_trait_defensive
}`,
  },

  // Effects
  {
    name: 'on_battle_win',
    type: 'effect',
    description: 'Effects on battle victory.',
    example: `on_battle_win = {
    add_prestige = 25
}`,
  },
  {
    name: 'on_battle_lose',
    type: 'effect',
    description: 'Effects on battle loss.',
    example: `on_battle_lose = {
    add_prestige = -10
}`,
  },

  // Requirements
  {
    name: 'martial_requirement',
    type: 'integer',
    description: 'Minimum martial skill.',
    example: 'martial_requirement = 12',
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions to gain trait.',
    example: `potential = {
    martial >= 12
    is_commander = yes
}`,
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value weight.',
    example: `ai_value = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const commanderTraitSchemaMap = new Map<string, FieldSchema>(
  commanderTraitSchema.map((field) => [field.name, field])
);

export function getCommanderTraitFieldNames(): string[] {
  return commanderTraitSchema.map((field) => field.name);
}

export function getCommanderTraitFieldDocumentation(fieldName: string): string | undefined {
  const field = commanderTraitSchemaMap.get(fieldName);
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
