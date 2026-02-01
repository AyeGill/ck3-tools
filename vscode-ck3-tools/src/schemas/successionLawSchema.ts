/**
 * Schema definition for CK3 Succession Laws - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const successionLawSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'succession_type',
    type: 'enum',
    description: 'The type of succession.',
    values: ['partition', 'single_heir', 'elective'],
    example: 'succession_type = partition',
  },
  {
    name: 'gender_law',
    type: 'enum',
    description: 'Gender inheritance rules.',
    values: ['male_only', 'male_preference', 'equal', 'female_preference', 'female_only'],
    example: 'gender_law = male_preference',
  },

  // Triggers
  {
    name: 'can_have',
    type: 'trigger',
    description: 'Conditions for having this succession law available.',
    example: `can_have = {
    has_government = feudal_government
}`,
  },
  {
    name: 'can_keep',
    type: 'trigger',
    description: 'Conditions to maintain this law.',
    example: `can_keep = {
    has_government = feudal_government
}`,
  },
  {
    name: 'can_pass',
    type: 'trigger',
    description: 'Conditions to pass (enable) this law.',
    example: `can_pass = {
    prestige_level >= 2
}`,
  },
  {
    name: 'should_show',
    type: 'trigger',
    description: 'Conditions to show this law in UI.',
    example: `should_show = {
    has_government = feudal_government
}`,
  },

  // Effects
  {
    name: 'pass_cost',
    type: 'block',
    description: 'Cost to pass this law.',
    example: `pass_cost = {
    prestige = 500
}`,
  },
  {
    name: 'on_pass',
    type: 'effect',
    description: 'Effects when passing this law.',
    example: `on_pass = {
    add_prestige = -100
}`,
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Modifiers while this law is active.',
    example: `modifier = {
    vassal_opinion = -10
}`,
  },
  {
    name: 'flag',
    type: 'string',
    description: 'Flag set by this law.',
    example: 'flag = partition_succession',
  },

  // Title Requirements
  {
    name: 'title_tier_targets',
    type: 'list',
    description: 'Title tiers this law can apply to.',
    example: `title_tier_targets = {
    tier_kingdom
    tier_empire
}`,
  },

  // Heir Selection
  {
    name: 'order_of_succession',
    type: 'block',
    description: 'How heirs are ordered.',
    example: `order_of_succession = {
    default = {
        order_by_claim = yes
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to choose this law.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const successionLawSchemaMap = new Map<string, FieldSchema>(
  successionLawSchema.map((field) => [field.name, field])
);

export function getSuccessionLawFieldNames(): string[] {
  return successionLawSchema.map((field) => field.name);
}

export function getSuccessionLawFieldDocumentation(fieldName: string): string | undefined {
  const field = successionLawSchemaMap.get(fieldName);
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
