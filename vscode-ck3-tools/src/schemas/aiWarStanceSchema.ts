/**
 * Schema definition for CK3 AI War Stances - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const aiWarStanceSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'stance_type',
    type: 'enum',
    description: 'Type of war stance.',
    values: ['aggressive', 'defensive', 'balanced', 'cautious'],
    example: 'stance_type = aggressive',
  },

  // Behavior
  {
    name: 'pursue_battles',
    type: 'boolean',
    description: 'Whether to actively pursue battles.',
    example: 'pursue_battles = yes',
  },
  {
    name: 'avoid_battles',
    type: 'boolean',
    description: 'Whether to avoid battles when possible.',
    example: 'avoid_battles = no',
  },
  {
    name: 'siege_priority',
    type: 'float',
    description: 'Priority for sieging enemy holdings.',
    example: 'siege_priority = 1.5',
  },
  {
    name: 'defend_priority',
    type: 'float',
    description: 'Priority for defending own holdings.',
    example: 'defend_priority = 1.0',
  },

  // Conditions
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for adopting this stance.',
    example: `trigger = {
    war_score >= 50
}`,
  },

  // Weights
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for AI to choose this stance.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        has_trait = brave
    }
}`,
  },

  // Army behavior
  {
    name: 'minimum_army_size',
    type: 'float',
    description: 'Minimum army size ratio before engaging.',
    example: 'minimum_army_size = 0.8',
  },
  {
    name: 'max_debt_threshold',
    type: 'integer',
    description: 'Maximum debt before changing stance.',
    example: 'max_debt_threshold = 500',
  },
];

// Map for quick lookup
export const aiWarStanceSchemaMap = new Map<string, FieldSchema>(
  aiWarStanceSchema.map((field) => [field.name, field])
);

export function getAiWarStanceFieldNames(): string[] {
  return aiWarStanceSchema.map((field) => field.name);
}

export function getAiWarStanceFieldDocumentation(fieldName: string): string | undefined {
  const field = aiWarStanceSchemaMap.get(fieldName);
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
