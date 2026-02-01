/**
 * Schema definition for CK3 AI Personalities - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const aiPersonalitySchema: FieldSchema[] = [
  // Behavior Weights
  {
    name: 'aggression',
    type: 'float',
    description: 'How aggressive this AI personality is.',
    example: 'aggression = 1.5',
  },
  {
    name: 'boldness',
    type: 'float',
    description: 'How bold/risk-taking this AI is.',
    example: 'boldness = 1.2',
  },
  {
    name: 'compassion',
    type: 'float',
    description: 'How compassionate this AI is.',
    example: 'compassion = 0.5',
  },
  {
    name: 'greed',
    type: 'float',
    description: 'How greedy this AI is.',
    example: 'greed = 1.8',
  },
  {
    name: 'honor',
    type: 'float',
    description: 'How honorable this AI is.',
    example: 'honor = 0.3',
  },
  {
    name: 'rationality',
    type: 'float',
    description: 'How rational this AI is.',
    example: 'rationality = 1.0',
  },
  {
    name: 'energy',
    type: 'float',
    description: 'How energetic/active this AI is.',
    example: 'energy = 1.5',
  },
  {
    name: 'sociability',
    type: 'float',
    description: 'How social this AI is.',
    example: 'sociability = 0.8',
  },
  {
    name: 'vengefulness',
    type: 'float',
    description: 'How vengeful this AI is.',
    example: 'vengefulness = 2.0',
  },
  {
    name: 'zeal',
    type: 'float',
    description: 'How zealous this AI is about religion.',
    example: 'zeal = 1.5',
  },

  // War Preferences
  {
    name: 'war_chance',
    type: 'float',
    description: 'Multiplier for war declaration chance.',
    example: 'war_chance = 1.2',
  },
  {
    name: 'war_exhaustion_tolerance',
    type: 'float',
    description: 'Tolerance for war exhaustion.',
    example: 'war_exhaustion_tolerance = 1.5',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this personality to apply.',
    example: `trigger = {
    has_trait = ambitious
    has_trait = brave
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Selection weight for this personality.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        has_trait = wrathful
    }
}`,
  },

  // Priorities
  {
    name: 'scheme_priority',
    type: 'block',
    description: 'Priority multipliers for schemes.',
    example: `scheme_priority = {
    murder = 2.0
    seduce = 0.5
}`,
  },
  {
    name: 'focus_priority',
    type: 'block',
    description: 'Priority multipliers for lifestyle focuses.',
    example: `focus_priority = {
    martial = 1.5
    intrigue = 2.0
}`,
  },
];

// Map for quick lookup
export const aiPersonalitySchemaMap = new Map<string, FieldSchema>(
  aiPersonalitySchema.map((field) => [field.name, field])
);

export function getAiPersonalityFieldNames(): string[] {
  return aiPersonalitySchema.map((field) => field.name);
}

export function getAiPersonalityFieldDocumentation(fieldName: string): string | undefined {
  const field = aiPersonalitySchemaMap.get(fieldName);
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
