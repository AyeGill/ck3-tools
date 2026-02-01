/**
 * Schema definition for CK3 Accolade Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const ACCOLADE_CATEGORIES = [
  'arena',
  'commander',
  'duelist',
  'hunter',
  'jousting',
  'tourney',
] as const;

export const accoladeTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'category',
    type: 'enum',
    description: 'Category of the accolade.',
    values: [...ACCOLADE_CATEGORIES],
    example: 'category = commander',
  },
  {
    name: 'rank',
    type: 'integer',
    description: 'Rank level of the accolade (1-3).',
    example: 'rank = 2',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the accolade.',
    example: 'icon = "gfx/interface/icons/accolades/accolade_icon.dds"',
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for the accolade to be available.',
    example: `potential = {
    has_trait = brave
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the accolade to remain valid.',
    example: `is_valid = {
    is_alive = yes
}`,
  },

  // Knight effects
  {
    name: 'knight_modifier',
    type: 'block',
    description: 'Modifiers applied to knights with this accolade.',
    example: `knight_modifier = {
    knight_effectiveness_mult = 0.2
}`,
  },
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied to the accolade owner.',
    example: `owner_modifier = {
    monthly_prestige = 0.5
}`,
  },

  // Glory
  {
    name: 'glory_gain',
    type: 'block',
    description: 'Amount of glory gained.',
    example: `glory_gain = {
    base = 10
}`,
  },
  {
    name: 'glory_per_rank',
    type: 'integer',
    description: 'Glory required per rank.',
    example: 'glory_per_rank = 100',
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to use this accolade type.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const accoladeTypeSchemaMap = new Map<string, FieldSchema>(
  accoladeTypeSchema.map((field) => [field.name, field])
);

export function getAccoladeTypeFieldNames(): string[] {
  return accoladeTypeSchema.map((field) => field.name);
}

export function getAccoladeTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = accoladeTypeSchemaMap.get(fieldName);
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
