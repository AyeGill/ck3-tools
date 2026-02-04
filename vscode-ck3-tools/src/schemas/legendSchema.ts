/**
 * Schema definition for CK3 Legends (Royal Court DLC) - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const LEGEND_TYPES = [
  'heroic',
  'holy',
  'legitimizing',
] as const;

export const legendSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'enum',
    description: 'Type of legend.',
    values: [...LEGEND_TYPES],
    example: 'type = heroic',
  },
  {
    name: 'quality',
    type: 'enum',
    description: 'Quality level of the legend.',
    values: ['famed', 'illustrious', 'mythical'],
    example: 'quality = famed',
  },

  // Localization
  {
    name: 'title',
    type: 'string',
    description: 'Localization key for the legend title.',
    example: 'title = "LEGEND_TITLE_KEY"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the legend description.',
    example: 'desc = "LEGEND_DESC_KEY"',
  },

  // Chronicle entries
  {
    name: 'chronicle',
    type: 'block',
    description: 'Chronicle entry for the legend.',
    example: `chronicle = {
    entry_1 = {
        text = "CHRONICLE_ENTRY_1"
        trigger = { always = yes }
    }
}`,
  },

  // Requirements
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the legend to be visible.',
    example: `is_shown = {
    has_royal_court = yes
}`,
  },
  {
    name: 'can_create',
    type: 'trigger',
    description: 'Conditions for being able to create this legend.',
    example: `can_create = {
    prestige >= 1000
}`,
  },

  // Effects
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when the legend is started.',
    example: `on_start = {
    add_prestige = 100
}`,
  },
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when the legend is completed.',
    example: `on_complete = {
    add_prestige = 1000
}`,
  },
  {
    name: 'spread_bonus',
    type: 'block',
    description: 'Modifiers that affect legend spread.',
    example: `spread_bonus = {
    base = 0.1
}`,
  },

  // Modifiers
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied to the legend owner.',
    example: `owner_modifier = {
    monthly_prestige = 1.0
}`,
  },
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to provinces where the legend is known.',
    example: `province_modifier = {
    development_growth_factor = 0.1
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to create this legend.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const legendSchemaMap = new Map<string, FieldSchema>(
  legendSchema.map((field) => [field.name, field])
);

export function getLegendFieldNames(): string[] {
  return legendSchema.map((field) => field.name);
}

export function getLegendFieldDocumentation(fieldName: string): string | undefined {
  const field = legendSchemaMap.get(fieldName);
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
