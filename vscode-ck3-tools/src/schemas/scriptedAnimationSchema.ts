/**
 * Schema definition for CK3 Scripted Animations - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const scriptedAnimationSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'animation',
    type: 'string',
    description: 'The animation to play.',
    example: 'animation = "personality_bold"',
  },
  {
    name: 'duration',
    type: 'float',
    description: 'Duration of the animation in seconds.',
    example: 'duration = 2.5',
  },

  // Conditions
  {
    name: 'triggered_animation',
    type: 'block',
    description: 'Animation triggered by conditions.',
    example: `triggered_animation = {
    trigger = { has_trait = brave }
    animation = personality_bold
}`,
  },

  // Portrait animations
  {
    name: 'idle',
    type: 'string',
    description: 'Idle animation.',
    example: 'idle = "idle"',
  },
  {
    name: 'idle_2',
    type: 'string',
    description: 'Secondary idle animation.',
    example: 'idle_2 = "idle_2"',
  },

  // Emotion animations
  {
    name: 'happiness',
    type: 'string',
    description: 'Happiness animation.',
    example: 'happiness = "happiness"',
  },
  {
    name: 'anger',
    type: 'string',
    description: 'Anger animation.',
    example: 'anger = "anger"',
  },
  {
    name: 'sadness',
    type: 'string',
    description: 'Sadness animation.',
    example: 'sadness = "sadness"',
  },
  {
    name: 'fear',
    type: 'string',
    description: 'Fear animation.',
    example: 'fear = "fear"',
  },
  {
    name: 'disgust',
    type: 'string',
    description: 'Disgust animation.',
    example: 'disgust = "disgust"',
  },

  // Custom animations
  {
    name: 'war',
    type: 'string',
    description: 'War/combat animation.',
    example: 'war = "war"',
  },
  {
    name: 'scheme',
    type: 'string',
    description: 'Scheming animation.',
    example: 'scheme = "scheme"',
  },
  {
    name: 'flirtation',
    type: 'string',
    description: 'Flirtation animation.',
    example: 'flirtation = "flirtation"',
  },
  {
    name: 'personality_bold',
    type: 'string',
    description: 'Bold personality animation.',
    example: 'personality_bold = "personality_bold"',
  },
  {
    name: 'personality_content',
    type: 'string',
    description: 'Content personality animation.',
    example: 'personality_content = "personality_content"',
  },
];

// Map for quick lookup
export const scriptedAnimationSchemaMap = new Map<string, FieldSchema>(
  scriptedAnimationSchema.map((field) => [field.name, field])
);

export function getScriptedAnimationFieldNames(): string[] {
  return scriptedAnimationSchema.map((field) => field.name);
}

export function getScriptedAnimationFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedAnimationSchemaMap.get(fieldName);
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
