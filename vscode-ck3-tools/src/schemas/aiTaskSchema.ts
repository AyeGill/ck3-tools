/**
 * Schema definition for CK3 AI Tasks - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const aiTaskSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the AI task.',
    example: 'name = "ai_task_war"',
  },

  // Activation
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for this task to be considered.',
    example: `potential = {
    is_at_war = yes
}`,
  },
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Additional conditions for task activation.',
    example: `trigger = {
    gold >= 100
}`,
  },

  // Priority
  {
    name: 'weight',
    type: 'block',
    description: 'Weight/priority for this task.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        is_at_war = yes
    }
}`,
  },

  // Effects
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects when task is performed.',
    example: `effect = {
    add_gold = -50
}`,
  },
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when task starts.',
    example: `on_start = {
    set_variable = { name = task_started value = yes }
}`,
  },
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when task completes.',
    example: `on_complete = {
    add_prestige = 100
}`,
  },

  // Target
  {
    name: 'target',
    type: 'block',
    description: 'Target selection for this task.',
    example: `target = {
    random_vassal = {
        limit = { is_adult = yes }
        save_scope_as = target
    }
}`,
  },
  {
    name: 'target_score',
    type: 'block',
    description: 'Scoring for target selection.',
    example: `target_score = {
    base = 100
    modifier = {
        add = 50
        opinion > 50
    }
}`,
  },

  // Duration
  {
    name: 'duration',
    type: 'integer',
    description: 'Duration in days.',
    example: 'duration = 365',
  },

  // AI Categories
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for task to remain valid.',
    example: `is_valid = {
    is_alive = yes
}`,
  },
];

// Map for quick lookup
export const aiTaskSchemaMap = new Map<string, FieldSchema>(
  aiTaskSchema.map((field) => [field.name, field])
);

export function getAiTaskFieldNames(): string[] {
  return aiTaskSchema.map((field) => field.name);
}

export function getAiTaskFieldDocumentation(fieldName: string): string | undefined {
  const field = aiTaskSchemaMap.get(fieldName);
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
