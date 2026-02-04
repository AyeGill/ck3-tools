/**
 * Schema definition for CK3 Task Contracts - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const taskContractSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'contract_type',
    type: 'string',
    description: 'Type of task contract.',
    example: 'contract_type = "mercenary"',
  },
  {
    name: 'duration',
    type: 'block',
    description: 'Duration of the contract.',
    example: `duration = {
    years = 2
}`,
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Cost to establish the contract.',
    example: `cost = {
    gold = 100
}`,
  },
  {
    name: 'monthly_cost',
    type: 'block',
    description: 'Monthly upkeep cost.',
    example: `monthly_cost = {
    gold = 10
}`,
  },

  // Requirements
  {
    name: 'can_establish',
    type: 'trigger',
    description: 'Conditions for establishing the contract.',
    example: `can_establish = {
    gold >= 200
}`,
  },
  {
    name: 'can_terminate',
    type: 'trigger',
    description: 'Conditions for terminating the contract.',
    example: `can_terminate = {
    NOT = { is_at_war = yes }
}`,
  },

  // Effects
  {
    name: 'on_establish',
    type: 'effect',
    description: 'Effects when establishing the contract.',
    example: `on_establish = {
    add_gold = -100
}`,
  },
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when completing the contract.',
    example: `on_complete = {
    add_prestige = 50
}`,
  },
  {
    name: 'on_terminate',
    type: 'effect',
    description: 'Effects when terminating the contract.',
    example: `on_terminate = {
    add_opinion = {
        target = scope:contractor
        modifier = broke_contract_opinion
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to accept this contract.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const taskContractSchemaMap = new Map<string, FieldSchema>(
  taskContractSchema.map((field) => [field.name, field])
);

export function getTaskContractFieldNames(): string[] {
  return taskContractSchema.map((field) => field.name);
}

export function getTaskContractFieldDocumentation(fieldName: string): string | undefined {
  const field = taskContractSchemaMap.get(fieldName);
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
