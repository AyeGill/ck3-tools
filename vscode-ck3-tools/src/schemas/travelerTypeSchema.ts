/**
 * Schema definition for CK3 Traveler Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const travelerTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the traveler type name.',
    example: 'name = "traveler_type_merchant"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "traveler_type_merchant_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this traveler type.',
    example: 'icon = "gfx/interface/icons/travel/traveler_merchant.dds"',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of traveler.',
    values: ['entourage', 'escort', 'companion', 'servant', 'special'],
    example: 'category = entourage',
  },

  // Capacity
  {
    name: 'size',
    type: 'integer',
    description: 'Entourage size contribution.',
    example: 'size = 5',
  },
  {
    name: 'max_count',
    type: 'integer',
    description: 'Maximum number allowed.',
    example: 'max_count = 3',
  },

  // Travel Effects
  {
    name: 'travel_speed',
    type: 'float',
    description: 'Travel speed modifier.',
    example: 'travel_speed = -0.1',
  },
  {
    name: 'travel_safety',
    type: 'float',
    description: 'Travel safety modifier.',
    example: 'travel_safety = 0.2',
  },

  // Cost
  {
    name: 'gold_cost',
    type: 'integer',
    description: 'Gold cost to hire.',
    example: 'gold_cost = 25',
  },
  {
    name: 'maintenance',
    type: 'float',
    description: 'Monthly maintenance cost.',
    example: 'maintenance = 0.5',
  },

  // Modifiers
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied during travel.',
    example: `owner_modifier = {
    monthly_prestige = 0.1
}`,
  },

  // Effects
  {
    name: 'on_hire',
    type: 'effect',
    description: 'Effects when hired.',
    example: `on_hire = {
    add_gold = -25
}`,
  },
  {
    name: 'on_dismiss',
    type: 'effect',
    description: 'Effects when dismissed.',
    example: `on_dismiss = {
    add_prestige = -10
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for traveler availability.',
    example: `potential = {
    gold >= 25
}`,
  },
  {
    name: 'can_hire',
    type: 'trigger',
    description: 'Conditions to hire.',
    example: `can_hire = {
    is_traveling = yes
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI weight for this traveler type.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const travelerTypeSchemaMap = new Map<string, FieldSchema>(
  travelerTypeSchema.map((field) => [field.name, field])
);

export function getTravelerTypeFieldNames(): string[] {
  return travelerTypeSchema.map((field) => field.name);
}

export function getTravelerTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = travelerTypeSchemaMap.get(fieldName);
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
