/**
 * Schema definition for CK3 Laws - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const LAW_GROUPS = [
  'crown_authority',
  'succession',
  'gender',
  'realm',
  'vassal_contract',
  'religious',
] as const;

export const lawSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'group',
    type: 'string',
    description: 'The law group this law belongs to.',
    example: 'group = crown_authority',
  },
  {
    name: 'default',
    type: 'boolean',
    description: 'Whether this is the default law in its group.',
    default: false,
    example: 'default = yes',
  },
  {
    name: 'flag',
    type: 'string',
    description: 'Flag set when this law is active.',
    example: 'flag = has_high_crown_authority',
  },
  {
    name: 'show_in_outliner',
    type: 'boolean',
    description: 'Whether to show this law in the outliner.',
    default: true,
    example: 'show_in_outliner = yes',
  },

  // Conditions
  {
    name: 'can_have',
    type: 'trigger',
    description: 'Conditions for a title to be able to have this law.',
    example: `can_have = {
    government_has_flag = government_is_feudal
}`,
  },
  {
    name: 'can_keep',
    type: 'trigger',
    description: 'Conditions for keeping this law (checked periodically).',
    example: `can_keep = {
    NOT = { government_has_flag = government_is_tribal }
}`,
  },
  {
    name: 'can_pass',
    type: 'trigger',
    description: 'Conditions for being able to pass this law.',
    example: `can_pass = {
    has_realm_law = crown_authority_2
    prestige >= 500
}`,
  },
  {
    name: 'should_show_for_title',
    type: 'trigger',
    description: 'Conditions for showing this law option for a title.',
    example: `should_show_for_title = {
    tier >= tier_kingdom
}`,
  },

  // Cost
  {
    name: 'pass_cost',
    type: 'block',
    description: 'Cost to pass this law.',
    example: `pass_cost = {
    prestige = 500
}`,
  },
  {
    name: 'revoke_cost',
    type: 'block',
    description: 'Cost to revoke this law.',
    example: `revoke_cost = {
    prestige = 250
}`,
  },

  // Effects
  {
    name: 'on_pass',
    type: 'effect',
    description: 'Effects when the law is passed.',
    example: `on_pass = {
    add_prestige = -100
}`,
  },
  {
    name: 'on_revoke',
    type: 'effect',
    description: 'Effects when the law is revoked.',
    example: `on_revoke = {
    every_vassal = {
        add_opinion = { target = root modifier = grateful_opinion }
    }
}`,
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Modifiers applied while this law is active.',
    example: `modifier = {
    vassal_levy_contribution_mult = 0.1
    vassal_tax_contribution_mult = 0.1
}`,
  },
  {
    name: 'title_modifier',
    type: 'block',
    description: 'Modifiers applied to the title holding this law.',
    example: `title_modifier = {
    monthly_prestige = 0.5
}`,
  },

  // Succession
  {
    name: 'succession',
    type: 'block',
    description: 'Succession rules for this law.',
    example: `succession = {
    order_of_succession = eldest_first
    traversal_order = children
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI preference for passing this law.',
    example: `ai_will_do = {
    value = 100
    if = {
        limit = { has_trait = ambitious }
        add = 50
    }
}`,
  },
];

// Schema for succession laws specifically
export const successionLawSchema: FieldSchema[] = [
  {
    name: 'order_of_succession',
    type: 'enum',
    description: 'Order for succession among valid heirs.',
    values: ['eldest_first', 'youngest_first', 'seniority'],
    example: 'order_of_succession = eldest_first',
  },
  {
    name: 'traversal_order',
    type: 'enum',
    description: 'How to traverse the family tree.',
    values: ['children', 'dynasty'],
    example: 'traversal_order = children',
  },
  {
    name: 'gender',
    type: 'enum',
    description: 'Gender preference for succession.',
    values: ['male_only', 'male_preference', 'equal', 'female_preference', 'female_only'],
    example: 'gender = male_preference',
  },
  {
    name: 'title_division',
    type: 'enum',
    description: 'How titles are divided among heirs.',
    values: ['partition', 'single_heir'],
    example: 'title_division = partition',
  },
];

// Map for quick lookup
export const lawSchemaMap = new Map<string, FieldSchema>(
  lawSchema.map((field) => [field.name, field])
);

export const successionLawSchemaMap = new Map<string, FieldSchema>(
  successionLawSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getLawFieldNames(): string[] {
  return lawSchema.map((field) => field.name);
}

// Get documentation for a field
export function getLawFieldDocumentation(fieldName: string): string | undefined {
  const field = lawSchemaMap.get(fieldName);
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
