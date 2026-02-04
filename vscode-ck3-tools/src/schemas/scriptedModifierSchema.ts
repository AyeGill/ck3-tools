/**
 * Schema definition for CK3 Scripted Modifiers - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const scriptedModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'base',
    type: 'float',
    description: 'Base value for the modifier calculation.',
    example: 'base = 100',
  },
  {
    name: 'add',
    type: 'float',
    description: 'Add a flat value.',
    example: 'add = 50',
  },
  {
    name: 'multiply',
    type: 'float',
    description: 'Multiply the current value.',
    example: 'multiply = 1.5',
  },
  {
    name: 'min',
    type: 'float',
    description: 'Minimum value floor.',
    example: 'min = 0',
  },
  {
    name: 'max',
    type: 'float',
    description: 'Maximum value cap.',
    example: 'max = 1000',
  },

  // Conditional modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Conditional modifier block.',
    example: `modifier = {
    add = 25
    is_ruler = yes
}`,
  },

  // Opinion modifiers
  {
    name: 'opinion_modifier',
    type: 'block',
    description: 'Opinion-based modifier.',
    example: `opinion_modifier = {
    who = scope:target
    opinion_target = root
    multiplier = 0.5
}`,
  },

  // AI modifiers
  {
    name: 'ai_value_modifier',
    type: 'block',
    description: 'AI value modification block.',
    example: `ai_value_modifier = {
    ai_boldness = 0.5
    ai_greed = -0.25
}`,
  },

  // Comparison
  {
    name: 'compare_modifier',
    type: 'block',
    description: 'Compare two values for modification.',
    example: `compare_modifier = {
    value = scope:target.martial
    multiplier = 2
}`,
  },
  {
    name: 'first_valid',
    type: 'block',
    description: 'Use the first valid modifier from a list.',
  },
  {
    name: 'compatibility_modifier',
    type: 'block',
    description: 'Built-in modifier that calculates compatibility between two characters.',
    example: `compatibility_modifier = {
    who = scope:actor
    compatibility_target = scope:recipient
    multiplier = 0.5
}`,
  },

  // Wildcard: weight blocks can include other scripted modifiers by name
  // e.g., `compatibility_modifier = yes` includes the scripted modifier named "compatibility_modifier"
  {
    name: '*',
    type: 'modifier',
    isWildcard: true,
    description: 'Any scripted modifier can be included by name in a weight block.',
  },
];

// Map for quick lookup
export const scriptedModifierSchemaMap = new Map<string, FieldSchema>(
  scriptedModifierSchema.map((field) => [field.name, field])
);

export function getScriptedModifierFieldNames(): string[] {
  return scriptedModifierSchema.map((field) => field.name);
}

export function getScriptedModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedModifierSchemaMap.get(fieldName);
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
