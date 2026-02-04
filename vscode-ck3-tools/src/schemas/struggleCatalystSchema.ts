/**
 * Schema definition for CK3 Struggle Catalysts - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const struggleCatalystSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the catalyst name.',
    example: 'name = "struggle_catalyst_war_declared"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "struggle_catalyst_war_declared_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this catalyst.',
    example: 'icon = "gfx/interface/icons/struggle/catalyst_war.dds"',
  },

  // Struggle Parameters
  {
    name: 'struggle',
    type: 'string',
    description: 'Which struggle this catalyst applies to.',
    example: 'struggle = iberian_struggle',
  },

  // Progress
  {
    name: 'progress_change',
    type: 'float',
    description: 'Change to struggle progress.',
    example: 'progress_change = 5.0',
  },
  {
    name: 'catalyst_direction',
    type: 'enum',
    description: 'Direction this catalyst pushes.',
    values: ['towards_ending', 'away_from_ending', 'neutral'],
    example: 'catalyst_direction = towards_ending',
  },

  // Phase Effects
  {
    name: 'phase_weights',
    type: 'block',
    description: 'Weight modifiers by phase.',
    example: `phase_weights = {
    hostility = 1.5
    tension = 1.0
    compromise = 0.5
}`,
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for catalyst to fire.',
    example: `trigger = {
    is_at_war = yes
}`,
  },
  {
    name: 'involved_character_trigger',
    type: 'trigger',
    description: 'Conditions for involved characters.',
    example: `involved_character_trigger = {
    is_involved_in_struggle = yes
}`,
  },

  // Effect
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects when catalyst fires.',
    example: `effect = {
    add_prestige = 50
}`,
  },

  // Cooldown
  {
    name: 'cooldown',
    type: 'integer',
    description: 'Cooldown in days.',
    example: 'cooldown = 365',
  },
  {
    name: 'character_cooldown',
    type: 'integer',
    description: 'Per-character cooldown.',
    example: 'character_cooldown = 180',
  },

  // On Action
  {
    name: 'on_action',
    type: 'string',
    description: 'On action to trigger.',
    example: 'on_action = struggle_catalyst_fired',
  },

  // Visibility
  {
    name: 'is_visible',
    type: 'trigger',
    description: 'Conditions for visibility.',
    example: `is_visible = {
    is_involved_in_struggle = yes
}`,
  },

  // AI
  {
    name: 'ai_chance',
    type: 'block',
    description: 'AI chance to trigger.',
    example: `ai_chance = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const struggleCatalystSchemaMap = new Map<string, FieldSchema>(
  struggleCatalystSchema.map((field) => [field.name, field])
);

export function getStruggleCatalystFieldNames(): string[] {
  return struggleCatalystSchema.map((field) => field.name);
}

export function getStruggleCatalystFieldDocumentation(fieldName: string): string | undefined {
  const field = struggleCatalystSchemaMap.get(fieldName);
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
