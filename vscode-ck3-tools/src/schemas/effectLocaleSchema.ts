/**
 * Schema definition for CK3 Effect Locales - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const effectLocaleSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the effect locale name.',
    example: 'name = "effect_locale_name"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the effect locale description.',
    example: 'desc = "effect_locale_desc"',
  },

  // Effect
  {
    name: 'effect',
    type: 'effect',
    description: 'The effect to execute.',
    example: `effect = {
    add_gold = 100
    add_prestige = 50
}`,
  },

  // Localization
  {
    name: 'text',
    type: 'string',
    description: 'Text to display for this effect.',
    example: 'text = "EFFECT_TEXT"',
  },
  {
    name: 'tooltip',
    type: 'string',
    description: 'Tooltip text for this effect.',
    example: 'tooltip = "EFFECT_TOOLTIP"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of effect locale.',
    values: ['generic', 'character', 'title', 'province', 'war', 'artifact'],
    example: 'type = character',
  },

  // Context
  {
    name: 'root_scope',
    type: 'string',
    description: 'The root scope for this effect locale.',
    example: 'root_scope = character',
  },

  // Formatting
  {
    name: 'format',
    type: 'string',
    description: 'Format string for display.',
    example: 'format = "outcome"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this effect.',
    example: 'icon = "gfx/interface/icons/effects/gold.dds"',
  },
];

// Map for quick lookup
export const effectLocaleSchemaMap = new Map<string, FieldSchema>(
  effectLocaleSchema.map((field) => [field.name, field])
);

export function getEffectLocaleFieldNames(): string[] {
  return effectLocaleSchema.map((field) => field.name);
}

export function getEffectLocaleFieldDocumentation(fieldName: string): string | undefined {
  const field = effectLocaleSchemaMap.get(fieldName);
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
