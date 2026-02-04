/**
 * Schema definition for CK3 Pool Generation Rules - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const poolGenerationRuleSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the pool generation rule.',
    example: 'name = "courtier_generation"',
  },

  // Character Generation
  {
    name: 'age',
    type: 'block',
    description: 'Age range for generated characters.',
    example: `age = {
    min = 16
    max = 45
}`,
  },
  {
    name: 'gender',
    type: 'enum',
    description: 'Gender of generated characters.',
    values: ['male', 'female', 'any'],
    example: 'gender = any',
  },
  {
    name: 'faith',
    type: 'string',
    description: 'Faith for generated characters.',
    example: 'faith = scope:employer.faith',
  },
  {
    name: 'culture',
    type: 'string',
    description: 'Culture for generated characters.',
    example: 'culture = scope:employer.culture',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this rule to apply.',
    example: `trigger = {
    is_adult = yes
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for character generation.',
    example: `weight = {
    base = 100
}`,
  },

  // Traits
  {
    name: 'traits',
    type: 'block',
    description: 'Traits to assign to generated characters.',
    example: `traits = {
    education_diplomacy_3
    ambitious
}`,
  },
  {
    name: 'random_traits',
    type: 'boolean',
    description: 'Whether to assign random traits.',
    default: true,
    example: 'random_traits = yes',
  },

  // Skills
  {
    name: 'diplomacy',
    type: 'block',
    description: 'Diplomacy skill range.',
    example: `diplomacy = {
    min = 5
    max = 15
}`,
  },
  {
    name: 'martial',
    type: 'block',
    description: 'Martial skill range.',
    example: `martial = {
    min = 5
    max = 15
}`,
  },
  {
    name: 'stewardship',
    type: 'block',
    description: 'Stewardship skill range.',
    example: `stewardship = {
    min = 5
    max = 15
}`,
  },
  {
    name: 'intrigue',
    type: 'block',
    description: 'Intrigue skill range.',
    example: `intrigue = {
    min = 5
    max = 15
}`,
  },
  {
    name: 'learning',
    type: 'block',
    description: 'Learning skill range.',
    example: `learning = {
    min = 5
    max = 15
}`,
  },
  {
    name: 'prowess',
    type: 'block',
    description: 'Prowess skill range.',
    example: `prowess = {
    min = 5
    max = 15
}`,
  },

  // Dynasty
  {
    name: 'dynasty',
    type: 'string',
    description: 'Dynasty for generated characters.',
    example: 'dynasty = none',
  },

  // Effects
  {
    name: 'on_created',
    type: 'effect',
    description: 'Effects when character is created.',
    example: `on_created = {
    add_gold = 50
}`,
  },
];

// Map for quick lookup
export const poolGenerationRuleSchemaMap = new Map<string, FieldSchema>(
  poolGenerationRuleSchema.map((field) => [field.name, field])
);

export function getPoolGenerationRuleFieldNames(): string[] {
  return poolGenerationRuleSchema.map((field) => field.name);
}

export function getPoolGenerationRuleFieldDocumentation(fieldName: string): string | undefined {
  const field = poolGenerationRuleSchemaMap.get(fieldName);
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
