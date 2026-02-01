/**
 * Schema definition for CK3 Government Type Modifiers - autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const governmentTypeModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the modifier name.',
    example: 'name = "government_type_modifier_centralized"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "government_type_modifier_centralized_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this modifier.',
    example: 'icon = "gfx/interface/icons/government/centralized.dds"',
  },

  // Government Type
  {
    name: 'government_type',
    type: 'string',
    description: 'Government type this modifies.',
    example: 'government_type = feudal_government',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of modifier.',
    values: ['administration', 'military', 'economy', 'law', 'succession'],
    example: 'category = administration',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Character modifiers.',
    example: `character_modifier = {
    domain_limit = 2
    vassal_limit = 5
}`,
  },
  {
    name: 'realm_modifier',
    type: 'block',
    description: 'Realm-wide modifiers.',
    example: `realm_modifier = {
    development_growth = 0.1
}`,
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Cost to apply modifier.',
    example: `cost = {
    prestige = 500
}`,
  },

  // Effects
  {
    name: 'on_apply',
    type: 'effect',
    description: 'Effects when applied.',
    example: `on_apply = {
    add_prestige = 100
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for availability.',
    example: `potential = {
    government_has_flag = feudal
}`,
  },
  {
    name: 'can_apply',
    type: 'trigger',
    description: 'Conditions to apply.',
    example: `can_apply = {
    prestige >= 500
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
export const governmentTypeModifierSchemaMap = new Map<string, FieldSchema>(
  governmentTypeModifierSchema.map((field) => [field.name, field])
);

export function getGovernmentTypeModifierFieldNames(): string[] {
  return governmentTypeModifierSchema.map((field) => field.name);
}

export function getGovernmentTypeModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = governmentTypeModifierSchemaMap.get(fieldName);
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
