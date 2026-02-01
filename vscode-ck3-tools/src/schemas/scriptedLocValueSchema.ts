/**
 * Schema definition for CK3 Scripted Localization Values - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const scriptedLocValueSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'enum',
    description: 'The type of localization value.',
    values: ['character', 'title', 'faith', 'culture', 'artifact', 'dynasty', 'house'],
    example: 'type = character',
  },

  // Text Output
  {
    name: 'text',
    type: 'block',
    description: 'Text output based on conditions.',
    example: `text = {
    trigger = { is_female = yes }
    localization_key = "she"
}`,
  },
  {
    name: 'localization_key',
    type: 'string',
    description: 'The localization key to use.',
    example: 'localization_key = "character_name_format"',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this localization to apply.',
    example: `trigger = {
    has_trait = ruler
}`,
  },

  // Fallback
  {
    name: 'fallback',
    type: 'string',
    description: 'Fallback localization key if trigger fails.',
    example: 'fallback = "default_name"',
  },

  // Random
  {
    name: 'random_valid',
    type: 'boolean',
    description: 'Whether to pick randomly from valid options.',
    default: false,
    example: 'random_valid = yes',
  },

  // First Valid
  {
    name: 'first_valid',
    type: 'block',
    description: 'Use the first valid text block.',
    example: `first_valid = {
    text = {
        trigger = { is_ruler = yes }
        localization_key = "ruler_title"
    }
    text = {
        localization_key = "commoner_title"
    }
}`,
  },

  // Random List
  {
    name: 'random_list',
    type: 'block',
    description: 'Randomly select from weighted options.',
    example: `random_list = {
    10 = { localization_key = "option_a" }
    20 = { localization_key = "option_b" }
}`,
  },
];

// Map for quick lookup
export const scriptedLocValueSchemaMap = new Map<string, FieldSchema>(
  scriptedLocValueSchema.map((field) => [field.name, field])
);

export function getScriptedLocValueFieldNames(): string[] {
  return scriptedLocValueSchema.map((field) => field.name);
}

export function getScriptedLocValueFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedLocValueSchemaMap.get(fieldName);
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
