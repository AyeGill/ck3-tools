/**
 * Schema definition for CK3 on_actions - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const onActionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions that must be true for this on_action to execute.',
    example: `trigger = {
    is_adult = yes
    NOT = { has_trait = incapable }
}`,
  },
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects to execute when this on_action fires.',
    example: `effect = {
    add_prestige = 100
    trigger_event = my_event.0001
}`,
  },
  {
    name: 'on_actions',
    type: 'list',
    description: 'List of other on_actions to trigger (in order).',
    example: `on_actions = {
    on_birthday_childhood
    on_birthday_adulthood
}`,
  },
  {
    name: 'first_valid_on_action',
    type: 'list',
    description: 'List of on_actions where only the first valid one fires.',
    example: `first_valid_on_action = {
    on_3rd_birthday
    on_6th_birthday
    on_10th_birthday
}`,
  },
  {
    name: 'random_on_action',
    type: 'list',
    description: 'Randomly select one on_action from the list to fire.',
    example: `random_on_action = {
    on_action_option_1
    on_action_option_2
    on_action_option_3
}`,
  },
  {
    name: 'events',
    type: 'list',
    description: 'List of events to fire directly.',
    example: `events = {
    my_event.0001
    my_event.0002
}`,
  },
  {
    name: 'random_events',
    type: 'block',
    description: 'Weighted random selection of events.',
    example: `random_events = {
    chance_to_happen = 50
    100 = my_event.0001
    50 = my_event.0002
    0 = 0 # Nothing happens
}`,
  },
  {
    name: 'first_valid',
    type: 'block',
    description: 'Fire the first valid event from the list.',
    example: `first_valid = {
    my_event.0001
    my_event.0002
    fallback_event.0001
}`,
  },
  {
    name: 'fallback',
    type: 'string',
    description: 'Event to fire if no other events are valid.',
    example: 'fallback = fallback_event.0001',
  },
];

// Map for quick lookup
export const onActionSchemaMap = new Map<string, FieldSchema>(
  onActionSchema.map((field) => [field.name, field])
);

/**
 * Schema for random_events blocks
 */
export const randomEventsSchema: FieldSchema[] = [
  {
    name: 'chance_to_happen',
    type: 'integer',
    description: 'Percentage chance for any event to fire (0-100).',
    min: 0,
    max: 100,
    example: 'chance_to_happen = 50',
  },
  {
    name: 'chance_of_no_event',
    type: 'block',
    description: 'Weighted chance for nothing to happen.',
    example: `chance_of_no_event = {
    base = 50
    modifier = {
        add = 25
        has_trait = unlucky
    }
}`,
  },
];

export const randomEventsSchemaMap = new Map<string, FieldSchema>(
  randomEventsSchema.map((field) => [field.name, field])
);

// Common on_action names for reference
export const COMMON_ON_ACTIONS = [
  // Character lifecycle
  'on_birth_child',
  'on_birth_mother',
  'on_birth_father',
  'on_death',
  'on_natural_death_second_chance',
  'on_birthday',
  'on_marriage',
  'on_divorce',
  'on_concubinage',
  'on_concubinage_end',
  'on_adult',

  // Ruling
  'on_primary_heir_gained',
  'on_title_gain',
  'on_title_lost',
  'on_realm_capital_change',
  'on_county_faith_change',
  'on_county_culture_change',
  'on_vassal_gained',
  'on_vassal_lost',

  // War
  'on_war_started',
  'on_war_ended',
  'on_war_won_attacker',
  'on_war_won_defender',
  'on_war_white_peace',
  'on_siege_completion',
  'on_siege_looting',
  'on_raid_action_start',
  'on_raid_action_completion',
  'on_knight_combat_won',
  'on_knight_combat_lost',

  // Schemes
  'on_scheme_discovered',
  'on_scheme_succeeded',
  'on_scheme_failed',

  // Court
  'on_join_court',
  'on_leave_court',
  'on_imprison',
  'on_release_from_prison',

  // Religion
  'on_faith_conversion',
  'on_faith_created',
  'on_faith_reformed',

  // Culture
  'on_culture_conversion',
  'on_culture_created',

  // Misc
  'on_game_start',
  'on_game_start_after_lobby',
  'yearly_global_pulse',
  'yearly_playable_pulse',
  'three_year_playable_pulse',
  'five_year_playable_pulse',
  'random_yearly_playable_pulse',
  'quarterly_playable_pulse',
  'monthly_playable_pulse',
  'weekly_playable_pulse',
  'daily_playable_pulse',
] as const;

// Get all field names for completion
export function getOnActionFieldNames(): string[] {
  return onActionSchema.map((field) => field.name);
}

// Get documentation for a field
export function getOnActionFieldDocumentation(fieldName: string): string | undefined {
  const field = onActionSchemaMap.get(fieldName);
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
