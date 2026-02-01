/**
 * Schema definition for CK3 Dynasty Perks - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const dynastyPerkSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the perk name.',
    example: 'name = "dynasty_perk_legacy_warriors"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "dynasty_perk_legacy_warriors_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this perk.',
    example: 'icon = "gfx/interface/icons/dynasty/perk_warriors.dds"',
  },

  // Legacy
  {
    name: 'legacy',
    type: 'string',
    description: 'Dynasty legacy this belongs to.',
    example: 'legacy = legacy_warfare',
  },

  // Position
  {
    name: 'position',
    type: 'integer',
    description: 'Position in the legacy tree.',
    example: 'position = 1',
  },

  // Cost
  {
    name: 'renown_cost',
    type: 'integer',
    description: 'Renown cost to unlock.',
    example: 'renown_cost = 1000',
  },

  // Prerequisites
  {
    name: 'prerequisite',
    type: 'string',
    description: 'Required previous perk.',
    example: 'prerequisite = dynasty_perk_warriors_1',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Character modifiers.',
    example: `character_modifier = {
    knight_effectiveness_mult = 0.15
    prowess = 2
}`,
  },
  {
    name: 'dynasty_modifier',
    type: 'block',
    description: 'Dynasty-wide modifiers.',
    example: `dynasty_modifier = {
    dynasty_prestige_mult = 0.1
}`,
  },

  // Effects
  {
    name: 'on_unlock',
    type: 'effect',
    description: 'Effects when unlocked.',
    example: `on_unlock = {
    add_prestige = 200
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for availability.',
    example: `potential = {
    always = yes
}`,
  },
  {
    name: 'can_unlock',
    type: 'trigger',
    description: 'Conditions to unlock.',
    example: `can_unlock = {
    dynasty = {
        dynasty_renown >= 1000
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI weight.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const dynastyPerkSchemaMap = new Map<string, FieldSchema>(
  dynastyPerkSchema.map((field) => [field.name, field])
);

export function getDynastyPerkFieldNames(): string[] {
  return dynastyPerkSchema.map((field) => field.name);
}

export function getDynastyPerkFieldDocumentation(fieldName: string): string | undefined {
  const field = dynastyPerkSchemaMap.get(fieldName);
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
