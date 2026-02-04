/**
 * Schema definition for CK3 Economy Modifiers - autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const economyModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the modifier name.',
    example: 'name = "economy_modifier_trade_boom"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "economy_modifier_trade_boom_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this modifier.',
    example: 'icon = "gfx/interface/icons/economy/trade_boom.dds"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of economy modifier.',
    values: ['income', 'expense', 'trade', 'development', 'tax', 'production'],
    example: 'type = trade',
  },

  // Scope
  {
    name: 'scope',
    type: 'enum',
    description: 'Scope of the modifier.',
    values: ['character', 'county', 'duchy', 'kingdom', 'empire'],
    example: 'scope = county',
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Economic modifiers.',
    example: `modifier = {
    monthly_income_mult = 0.2
    development_growth = 0.1
}`,
  },

  // Duration
  {
    name: 'duration',
    type: 'integer',
    description: 'Duration in days.',
    example: 'duration = 3650',
  },

  // Stacking
  {
    name: 'stacking',
    type: 'boolean',
    description: 'Whether modifier stacks.',
    default: false,
    example: 'stacking = yes',
  },

  // Effects
  {
    name: 'on_apply',
    type: 'effect',
    description: 'Effects when applied.',
    example: `on_apply = {
    add_gold = 100
}`,
  },
  {
    name: 'on_expire',
    type: 'effect',
    description: 'Effects when expired.',
    example: `on_expire = {
    trigger_event = economy.001
}`,
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for the modifier.',
    example: `trigger = {
    is_at_peace = yes
    development >= 20
}`,
  },

  // AI
  {
    name: 'ai_importance',
    type: 'block',
    description: 'AI weight.',
    example: `ai_importance = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const economyModifierSchemaMap = new Map<string, FieldSchema>(
  economyModifierSchema.map((field) => [field.name, field])
);

export function getEconomyModifierFieldNames(): string[] {
  return economyModifierSchema.map((field) => field.name);
}

export function getEconomyModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = economyModifierSchemaMap.get(fieldName);
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
