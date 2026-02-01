/**
 * Schema definition for CK3 Combat Phase Events - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const combatPhaseEventSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'phase',
    type: 'enum',
    description: 'Combat phase when this event can occur.',
    values: ['opening', 'skirmish', 'melee', 'pursuit', 'retreat'],
    example: 'phase = melee',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for the event to fire.',
    example: `trigger = {
    scope:combat_side = {
        side_strength >= 1000
    }
}`,
  },
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for the event to be selected.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        scope:commander = { has_trait = brave }
    }
}`,
  },

  // Effects
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects when the event fires.',
    example: `effect = {
    scope:combat_side = {
        add_combat_modifier = flanking_bonus
    }
}`,
  },

  // Localization
  {
    name: 'title',
    type: 'string',
    description: 'Title localization key.',
    example: 'title = "COMBAT_EVENT_TITLE"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Description localization key.',
    example: 'desc = "COMBAT_EVENT_DESC"',
  },

  // Combat modifiers
  {
    name: 'damage_mult',
    type: 'float',
    description: 'Damage multiplier for this phase.',
    example: 'damage_mult = 1.2',
  },
  {
    name: 'toughness_mult',
    type: 'float',
    description: 'Toughness multiplier for this phase.',
    example: 'toughness_mult = 1.1',
  },
  {
    name: 'pursuit_mult',
    type: 'float',
    description: 'Pursuit multiplier for this phase.',
    example: 'pursuit_mult = 1.5',
  },
  {
    name: 'screen_mult',
    type: 'float',
    description: 'Screen multiplier for this phase.',
    example: 'screen_mult = 1.0',
  },

  // Duration
  {
    name: 'duration',
    type: 'integer',
    description: 'Duration of the effect in days.',
    example: 'duration = 3',
  },
];

// Map for quick lookup
export const combatPhaseEventSchemaMap = new Map<string, FieldSchema>(
  combatPhaseEventSchema.map((field) => [field.name, field])
);

export function getCombatPhaseEventFieldNames(): string[] {
  return combatPhaseEventSchema.map((field) => field.name);
}

export function getCombatPhaseEventFieldDocumentation(fieldName: string): string | undefined {
  const field = combatPhaseEventSchemaMap.get(fieldName);
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
