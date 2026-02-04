/**
 * Schema definition for CK3 Court Positions - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const COURT_POSITION_CATEGORIES = [
  'court_position_category_common',
  'court_position_category_special',
  'court_position_category_religious',
] as const;

export const courtPositionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'skill',
    type: 'enum',
    description: 'The primary skill for this court position.',
    values: ['diplomacy', 'martial', 'stewardship', 'intrigue', 'learning'],
    example: 'skill = stewardship',
  },
  {
    name: 'max_available_positions',
    type: 'integer',
    description: 'Maximum number of characters that can hold this position.',
    default: 1,
    example: 'max_available_positions = 3',
  },
  {
    name: 'category',
    type: 'enum',
    description: 'Category for UI organization.',
    values: [...COURT_POSITION_CATEGORIES],
    example: 'category = court_position_category_common',
  },
  {
    name: 'minimum_rank',
    type: 'enum',
    description: 'Minimum title rank required to have this position.',
    values: ['county', 'duchy', 'kingdom', 'empire'],
    example: 'minimum_rank = duchy',
  },

  // Opinion
  {
    name: 'opinion',
    type: 'block',
    description: 'Opinion modifiers for holding this position.',
    example: `opinion = {
    value = 10
    enabled_if = { always = yes }
}`,
  },

  // Salary
  {
    name: 'salary',
    type: 'block',
    description: 'Salary paid to the position holder.',
    example: `salary = {
    round = yes
    gold = {
        value = 1
        multiply = liege.court_position_salary_mult
    }
}`,
  },

  // Conditions
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the position to be shown.',
    example: `is_shown = {
    highest_held_title_tier >= tier_duchy
}`,
  },
  {
    name: 'valid_position',
    type: 'trigger',
    description: 'Conditions for the position to be valid.',
    example: `valid_position = {
    is_ruler = yes
}`,
  },
  {
    name: 'is_shown_character',
    type: 'trigger',
    description: 'Conditions for a character to be shown as a candidate.',
    example: `is_shown_character = {
    is_adult = yes
    NOT = { is_ruler = yes }
}`,
  },
  {
    name: 'valid_character',
    type: 'trigger',
    description: 'Conditions for a character to be valid for the position.',
    example: `valid_character = {
    can_be_employed_in_any_court_trigger = yes
    stewardship >= 8
}`,
  },

  // Effects
  {
    name: 'on_court_position_received',
    type: 'effect',
    description: 'Effects when someone receives this position.',
    example: `on_court_position_received = {
    add_opinion = { target = liege modifier = grateful_opinion }
}`,
  },
  {
    name: 'on_court_position_revoked',
    type: 'effect',
    description: 'Effects when someone loses this position.',
    example: `on_court_position_revoked = {
    add_opinion = { target = liege modifier = offended_opinion }
}`,
  },
  {
    name: 'on_court_position_invalidated',
    type: 'effect',
    description: 'Effects when the position becomes invalid.',
    example: 'on_court_position_invalidated = { }',
  },

  // Modifiers
  {
    name: 'holder_modifier',
    type: 'block',
    description: 'Modifiers applied to the position holder.',
    example: `holder_modifier = {
    monthly_prestige = 0.5
    stewardship = 1
}`,
  },
  {
    name: 'liege_modifier',
    type: 'block',
    description: 'Modifiers applied to the liege.',
    example: `liege_modifier = {
    domain_tax_mult = 0.05
}`,
  },
  {
    name: 'court_modifier',
    type: 'block',
    description: 'Modifiers applied to the entire court.',
    example: `court_modifier = {
    court_grandeur_baseline_add = 2
}`,
  },

  // Aptitude
  {
    name: 'aptitude',
    type: 'block',
    description: 'Calculate aptitude score for candidates.',
    example: `aptitude = {
    value = stewardship
    add = {
        value = learning
        multiply = 0.5
    }
}`,
  },

  // Search
  {
    name: 'candidate_score',
    type: 'block',
    description: 'Score calculation for candidate selection.',
    example: `candidate_score = {
    value = aptitude:value
    add = {
        value = 20
        if = { limit = { has_trait = diligent } }
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI evaluation for creating/filling this position.',
    example: `ai_will_do = {
    value = 100
    if = {
        limit = { gold < 50 }
        multiply = 0
    }
}`,
  },
];

// Map for quick lookup
export const courtPositionSchemaMap = new Map<string, FieldSchema>(
  courtPositionSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getCourtPositionFieldNames(): string[] {
  return courtPositionSchema.map((field) => field.name);
}

// Get documentation for a field
export function getCourtPositionFieldDocumentation(fieldName: string): string | undefined {
  const field = courtPositionSchemaMap.get(fieldName);
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
