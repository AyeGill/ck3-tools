/**
 * Schema definition for CK3 Levy Definitions - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const levyDefinitionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the levy name.',
    example: 'name = "levy_definition_feudal"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "levy_definition_feudal_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this levy type.',
    example: 'icon = "gfx/interface/icons/levy/feudal.dds"',
  },

  // Levy Size
  {
    name: 'base_levy_size',
    type: 'integer',
    description: 'Base levy size.',
    example: 'base_levy_size = 100',
  },
  {
    name: 'levy_mult',
    type: 'float',
    description: 'Levy multiplier.',
    example: 'levy_mult = 1.0',
  },
  {
    name: 'max_levy_contribution',
    type: 'float',
    description: 'Maximum levy contribution from vassals.',
    example: 'max_levy_contribution = 0.25',
  },

  // Reinforcement
  {
    name: 'reinforcement_rate',
    type: 'float',
    description: 'Monthly reinforcement rate.',
    example: 'reinforcement_rate = 0.1',
  },
  {
    name: 'reinforcement_cost',
    type: 'float',
    description: 'Cost per reinforcement.',
    example: 'reinforcement_cost = 0.5',
  },

  // Maintenance
  {
    name: 'maintenance_mult',
    type: 'float',
    description: 'Maintenance cost multiplier.',
    example: 'maintenance_mult = 1.0',
  },
  {
    name: 'raised_maintenance',
    type: 'float',
    description: 'Additional maintenance when raised.',
    example: 'raised_maintenance = 2.0',
  },

  // Quality
  {
    name: 'quality',
    type: 'float',
    description: 'Base combat quality.',
    example: 'quality = 1.0',
  },
  {
    name: 'damage',
    type: 'integer',
    description: 'Base damage value.',
    example: 'damage = 10',
  },
  {
    name: 'toughness',
    type: 'integer',
    description: 'Base toughness value.',
    example: 'toughness = 10',
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Modifiers for this levy type.',
    example: `modifier = {
    levy_size = 0.1
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for levy definition to apply.',
    example: `potential = {
    has_government = feudal_government
}`,
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value weight.',
    example: `ai_value = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const levyDefinitionSchemaMap = new Map<string, FieldSchema>(
  levyDefinitionSchema.map((field) => [field.name, field])
);

export function getLevyDefinitionFieldNames(): string[] {
  return levyDefinitionSchema.map((field) => field.name);
}

export function getLevyDefinitionFieldDocumentation(fieldName: string): string | undefined {
  const field = levyDefinitionSchemaMap.get(fieldName);
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
