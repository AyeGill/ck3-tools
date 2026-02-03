/**
 * Schema definition for CK3 schemes - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const SCHEME_CATEGORIES = [
  'hostile',
  'personal',
  'friendly',
] as const;

export const SCHEME_SKILLS = [
  'diplomacy',
  'martial',
  'stewardship',
  'intrigue',
  'learning',
  'prowess',
] as const;

export const schemeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'skill',
    type: 'enum',
    description: 'The skill used for this scheme.',
    values: [...SCHEME_SKILLS],
    required: true,
    example: 'skill = intrigue',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the scheme description.',
    example: 'desc = murder_desc_general',
  },
  {
    name: 'success_desc',
    type: 'string',
    description: 'Localization key for success description.',
    example: 'success_desc = "MURDER_SUCCESS_DESC"',
  },
  {
    name: 'discovery_desc',
    type: 'string',
    description: 'Localization key for discovery description.',
    example: 'discovery_desc = "MURDER_DISCOVERY_DESC"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the scheme.',
    example: 'icon = icon_scheme_murder',
  },
  {
    name: 'illustration',
    type: 'string',
    description: 'Illustration image path.',
    example: 'illustration = "gfx/interface/illustrations/event_scenes/corridor.dds"',
  },
  {
    name: 'category',
    type: 'enum',
    description: 'Category of the scheme (affects AI behavior and UI).',
    values: [...SCHEME_CATEGORIES],
    example: 'category = hostile',
  },
  {
    name: 'target_type',
    type: 'string',
    description: 'Type of target (character, title, etc.).',
    example: 'target_type = character',
  },
  {
    name: 'is_secret',
    type: 'boolean',
    description: 'Whether the scheme is secret until discovered.',
    default: false,
    example: 'is_secret = yes',
  },
  {
    name: 'maximum_breaches',
    type: 'integer',
    description: 'Maximum number of breaches before discovery.',
    example: 'maximum_breaches = 5',
  },
  {
    name: 'cooldown',
    type: 'block',
    description: 'Cooldown before scheme can be used again.',
    example: 'cooldown = { years = 10 }',
  },

  // Parameters
  {
    name: 'speed_per_skill_point',
    type: 'string',
    description: 'Speed modifier per owner skill point (script value).',
    example: 'speed_per_skill_point = t2_spsp_owner_value',
  },
  {
    name: 'speed_per_target_skill_point',
    type: 'string',
    description: 'Speed modifier per target skill point (script value).',
    example: 'speed_per_target_skill_point = t2_spsp_target_value',
  },
  {
    name: 'base_progress_goal',
    type: 'string',
    description: 'Base progress needed to complete (script value).',
    example: 'base_progress_goal = t2_base_phase_length_value',
  },
  {
    name: 'maximum_secrecy',
    type: 'integer',
    description: 'Maximum secrecy percentage (0-100).',
    min: 0,
    max: 100,
    example: 'maximum_secrecy = 95',
  },
  {
    name: 'base_maximum_success',
    type: 'string',
    description: 'Base maximum success chance (script value).',
    example: 'base_maximum_success = t2_base_max_success_value',
  },
  {
    name: 'phases_per_agent_charge',
    type: 'integer',
    description: 'Number of phases per agent charge.',
    example: 'phases_per_agent_charge = 1',
  },
  {
    name: 'success_chance_growth_per_skill_point',
    type: 'string',
    description: 'Success chance growth per skill point (script value).',
    example: 'success_chance_growth_per_skill_point = t2_scgpsp_value',
  },

  // Core Triggers
  {
    name: 'allow',
    type: 'trigger',
    description: 'Conditions for the scheme to be available to start.',
    example: `allow = {
    age >= 14
    is_imprisoned = no
}`,
  },
  {
    name: 'valid',
    type: 'trigger',
    description: 'Conditions for the scheme to remain valid.',
    example: `valid = {
    is_incapable = no
    scope:target = { is_alive = yes }
}`,
  },
  // Agents
  {
    name: 'agent_leave_threshold',
    type: 'integer',
    description: 'Opinion threshold below which agents leave.',
    example: 'agent_leave_threshold = -25',
  },
  {
    name: 'agent_join_chance',
    type: 'block',
    description: 'Calculation for agent join chance.',
    example: `agent_join_chance = {
    base = 0
    ai_agent_join_chance_basic_suite_modifier = yes
}`,
  },
  {
    name: 'agent_groups_owner_perspective',
    type: 'block',
    description: 'Groups of potential agents from owner perspective.',
    example: 'agent_groups_owner_perspective = { courtiers guests scripted_relations }',
  },
  {
    name: 'agent_groups_target_character_perspective',
    type: 'block',
    description: 'Groups of potential agents from target perspective.',
    example: 'agent_groups_target_character_perspective = { courtiers vassals }',
  },
  {
    name: 'valid_agent',
    type: 'trigger',
    description: 'Conditions for a character to be a valid agent.',
    example: 'valid_agent = { is_valid_agent_standard_trigger = yes }',
  },

  // Success/Failure
  {
    name: 'base_success_chance',
    type: 'block',
    description: 'Base success chance calculation.',
    example: `base_success_chance = {
    base = 0
    scheme_type_skill_success_chance_modifier = { SKILL = INTRIGUE }
}`,
  },
  {
    name: 'odds_prediction',
    type: 'block',
    description: 'Odds prediction calculation for UI.',
    example: `odds_prediction = {
    add = hostile_scheme_base_odds_prediction_target_is_char_value
    min = 0
}`,
  },

  // Events
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when the scheme starts.',
    example: `on_start = {
    add_character_flag = has_scheme
}`,
  },
  {
    name: 'on_phase_completed',
    type: 'effect',
    description: 'Effects when a phase is completed.',
    example: 'on_phase_completed = { }',
  },
  {
    name: 'on_invalidated',
    type: 'effect',
    description: 'Effects when the scheme becomes invalid.',
    example: 'on_invalidated = { }',
  },
  {
    name: 'on_monthly',
    type: 'effect',
    description: 'Monthly effects while scheme is active.',
    example: 'on_monthly = { }',
  },

  // UI
  {
    name: 'use_secrecy',
    type: 'boolean',
    description: 'Whether the scheme uses secrecy mechanics.',
    default: true,
    example: 'use_secrecy = no',
  },
];

// Map for quick lookup
export const schemeSchemaMap = new Map<string, FieldSchema>(
  schemeSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getSchemeFieldNames(): string[] {
  return schemeSchema.map((field) => field.name);
}

// Get documentation for a field
export function getSchemeFieldDocumentation(fieldName: string): string | undefined {
  const field = schemeSchemaMap.get(fieldName);
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
