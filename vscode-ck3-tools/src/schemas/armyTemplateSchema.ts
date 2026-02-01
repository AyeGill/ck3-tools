/**
 * Schema definition for CK3 Army Templates - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const armyTemplateSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the army template.',
    example: 'name = "army_template_raiders"',
  },

  // Composition
  {
    name: 'regiment',
    type: 'block',
    description: 'Regiment in the template.',
    example: `regiment = {
    type = light_cavalry
    size = 500
}`,
  },
  {
    name: 'regiments',
    type: 'list',
    description: 'List of regiments.',
    example: `regiments = {
    { type = heavy_infantry size = 300 }
    { type = archers size = 200 }
    { type = light_cavalry size = 100 }
}`,
  },

  // Men-at-Arms
  {
    name: 'men_at_arms',
    type: 'list',
    description: 'Men-at-arms types in the template.',
    example: `men_at_arms = {
    heavy_infantry = 2
    archers = 1
}`,
  },

  // Levies
  {
    name: 'levy_ratio',
    type: 'float',
    description: 'Ratio of available levies to use.',
    example: 'levy_ratio = 0.5',
  },

  // Commander
  {
    name: 'commander',
    type: 'block',
    description: 'Commander requirements.',
    example: `commander = {
    martial >= 12
}`,
  },
  {
    name: 'knight_count',
    type: 'integer',
    description: 'Number of knights to include.',
    example: 'knight_count = 5',
  },

  // Purpose
  {
    name: 'purpose',
    type: 'enum',
    description: 'Purpose of the army.',
    values: ['offensive', 'defensive', 'raiding', 'siege', 'balanced'],
    example: 'purpose = offensive',
  },

  // Target
  {
    name: 'target_size',
    type: 'integer',
    description: 'Target army size.',
    example: 'target_size = 1000',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions to use this template.',
    example: `trigger = {
    is_at_war = yes
}`,
  },

  // AI
  {
    name: 'ai_weight',
    type: 'block',
    description: 'AI weight for using this template.',
    example: `ai_weight = {
    base = 100
}`,
  },

  // Reinforcement
  {
    name: 'reinforce_rate',
    type: 'float',
    description: 'Reinforcement rate modifier.',
    example: 'reinforce_rate = 1.0',
  },
];

// Map for quick lookup
export const armyTemplateSchemaMap = new Map<string, FieldSchema>(
  armyTemplateSchema.map((field) => [field.name, field])
);

export function getArmyTemplateFieldNames(): string[] {
  return armyTemplateSchema.map((field) => field.name);
}

export function getArmyTemplateFieldDocumentation(fieldName: string): string | undefined {
  const field = armyTemplateSchemaMap.get(fieldName);
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
