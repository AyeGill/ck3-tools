/**
 * Schema definition for CK3 House Unity - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const houseUnitySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'unity_stage',
    type: 'string',
    description: 'The unity stage identifier.',
    example: 'unity_stage = "high_unity"',
  },
  {
    name: 'unity_value',
    type: 'block',
    description: 'Unity value thresholds.',
    example: `unity_value = {
    min = 75
    max = 100
}`,
  },

  // Modifiers
  {
    name: 'house_modifier',
    type: 'block',
    description: 'Modifiers applied to all house members.',
    example: `house_modifier = {
    diplomacy = 2
    monthly_prestige = 0.5
}`,
  },
  {
    name: 'head_modifier',
    type: 'block',
    description: 'Modifiers applied to the house head.',
    example: `head_modifier = {
    monthly_prestige = 1.0
}`,
  },

  // Parameters
  {
    name: 'parameters',
    type: 'block',
    description: 'Special parameters enabled at this unity level.',
    example: `parameters = {
    house_can_demand_conversion = yes
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI evaluation for unity actions.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const houseUnitySchemaMap = new Map<string, FieldSchema>(
  houseUnitySchema.map((field) => [field.name, field])
);

export function getHouseUnityFieldNames(): string[] {
  return houseUnitySchema.map((field) => field.name);
}

export function getHouseUnityFieldDocumentation(fieldName: string): string | undefined {
  const field = houseUnitySchemaMap.get(fieldName);
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
