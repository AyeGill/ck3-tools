/**
 * Schema definition for CK3 Realm Succession - autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const realmSuccessionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the succession name.',
    example: 'name = "realm_succession_primogeniture"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "realm_succession_primogeniture_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this succession type.',
    example: 'icon = "gfx/interface/icons/succession/primogeniture.dds"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of succession.',
    values: ['partition', 'single_heir', 'elective', 'house', 'open'],
    example: 'type = single_heir',
  },

  // Gender Law
  {
    name: 'gender_law',
    type: 'enum',
    description: 'Gender preference.',
    values: ['male_only', 'male_preference', 'equal', 'female_preference', 'female_only'],
    example: 'gender_law = male_preference',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Selection priority.',
    example: 'priority = 100',
  },

  // Modifiers
  {
    name: 'realm_modifier',
    type: 'block',
    description: 'Modifiers applied to the realm.',
    example: `realm_modifier = {
    vassal_opinion = -10
    domain_limit = 1
}`,
  },

  // Heir Effects
  {
    name: 'heir_score',
    type: 'block',
    description: 'Scoring for heir selection.',
    example: `heir_score = {
    base = 100
    modifier = {
        add = 50
        is_primary_heir = yes
    }
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for availability.',
    example: `potential = {
    has_realm_law = law_succession_enabled
}`,
  },
  {
    name: 'can_use',
    type: 'trigger',
    description: 'Conditions to use this succession.',
    example: `can_use = {
    highest_held_title_tier >= tier_duchy
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
export const realmSuccessionSchemaMap = new Map<string, FieldSchema>(
  realmSuccessionSchema.map((field) => [field.name, field])
);

export function getRealmSuccessionFieldNames(): string[] {
  return realmSuccessionSchema.map((field) => field.name);
}

export function getRealmSuccessionFieldDocumentation(fieldName: string): string | undefined {
  const field = realmSuccessionSchemaMap.get(fieldName);
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
