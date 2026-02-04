/**
 * Schema definition for CK3 AI Budgets - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const aiBudgetSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the AI budget.',
    example: 'name = "ai_budget_war"',
  },

  // Budget Allocation
  {
    name: 'gold',
    type: 'block',
    description: 'Gold budget allocation.',
    example: `gold = {
    base = 100
    modifier = {
        add = 50
        is_at_war = yes
    }
}`,
  },
  {
    name: 'prestige',
    type: 'block',
    description: 'Prestige budget allocation.',
    example: `prestige = {
    base = 50
}`,
  },
  {
    name: 'piety',
    type: 'block',
    description: 'Piety budget allocation.',
    example: `piety = {
    base = 25
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'block',
    description: 'Priority for this budget.',
    example: `priority = {
    base = 100
}`,
  },

  // Conditions
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for this budget to be considered.',
    example: `potential = {
    is_at_war = yes
}`,
  },
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Additional conditions for budget use.',
    example: `trigger = {
    gold >= 100
}`,
  },

  // Effects
  {
    name: 'on_use',
    type: 'effect',
    description: 'Effects when budget is used.',
    example: `on_use = {
    add_gold = -100
}`,
  },

  // Reserved
  {
    name: 'reserved_gold',
    type: 'integer',
    description: 'Minimum gold to keep in reserve.',
    example: 'reserved_gold = 50',
  },
];

// Map for quick lookup
export const aiBudgetSchemaMap = new Map<string, FieldSchema>(
  aiBudgetSchema.map((field) => [field.name, field])
);

export function getAiBudgetFieldNames(): string[] {
  return aiBudgetSchema.map((field) => field.name);
}

export function getAiBudgetFieldDocumentation(fieldName: string): string | undefined {
  const field = aiBudgetSchemaMap.get(fieldName);
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
