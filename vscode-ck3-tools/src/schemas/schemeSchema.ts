/**
 * Schema definition for CK3 schemes - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const SCHEME_CATEGORIES = [
  'hostile',
  'personal',
  'friendly',
  // Additional categories from game files
  'contract',
  'political',
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
    type: 'block',
    description: 'Whether the scheme uses secrecy mechanics. Can be a trigger block for conditional checks.',
    example: `use_secrecy = no
# or with conditions:
use_secrecy = { always = yes }`,
  },

  // Additional scheme properties
  {
    name: 'base_secrecy',
    type: 'integer',
    description: 'Base secrecy value for the scheme.',
  },
  {
    name: 'minimum_secrecy',
    type: 'integer',
    description: 'Minimum secrecy percentage the scheme can have.',
  },
  {
    name: 'minimum_success',
    type: 'integer',
    description: 'Minimum success chance percentage.',
  },
  {
    name: 'is_basic',
    type: 'boolean',
    description: 'Whether this is a basic scheme type.',
  },
  {
    name: 'hide_target_name',
    type: 'boolean',
    description: 'Whether to hide the target name in UI.',
  },
  {
    name: 'uses_resistance',
    type: 'boolean',
    description: 'Whether the scheme uses resistance mechanics.',
  },

  // Frame and visuals
  {
    name: 'frame',
    type: 'string',
    description: 'UI frame type for the scheme.',
  },
  {
    name: 'hud_text',
    type: 'string',
    description: 'Text displayed in the HUD for this scheme.',
  },

  // Contribution system
  {
    name: 'contribution',
    type: 'block',
    description: 'Contribution configuration for the scheme.',
  },
  {
    name: 'contribution_type',
    type: 'string',
    description: 'Type of contribution for the scheme.',
  },

  // Travel interaction
  {
    name: 'freeze_scheme_when_traveling',
    type: 'boolean',
    description: 'Whether the scheme freezes when the owner is traveling.',
  },
  {
    name: 'freeze_scheme_when_traveling_target',
    type: 'boolean',
    description: 'Whether the scheme freezes when the target is traveling.',
  },

  // Speed modifiers
  {
    name: 'spymaster_speed_per_skill_point',
    type: 'string',
    description: 'Speed modifier per spymaster skill point (script value).',
  },
  {
    name: 'target_spymaster_speed_per_skill_point',
    type: 'string',
    description: 'Speed modifier per target spymaster skill point (script value).',
  },
  {
    name: 'tier_speed',
    type: 'block',
    description: 'Speed modifiers per tier.',
  },

  // Agent slots
  {
    name: 'starting_agent_slots',
    type: 'integer',
    description: 'Number of agent slots available at start.',
  },
  {
    name: 'valid_agent_for_slot',
    type: 'trigger',
    description: 'Conditions for a character to fill a specific agent slot.',
  },

  // Modifiers and parameters
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied to the scheme owner.',
  },
  {
    name: 'parameters',
    type: 'block',
    description: 'Additional parameters for the scheme.',
  },

  // Events
  {
    name: 'on_activate',
    type: 'effect',
    description: 'Effects when the scheme is activated.',
  },
  {
    name: 'on_hud_click',
    type: 'effect',
    description: 'Effects when the HUD element is clicked.',
  },
  {
    name: 'on_semiyearly',
    type: 'effect',
    description: 'Effects that trigger semi-yearly.',
  },
  {
    name: 'pulse_actions',
    type: 'block',
    description: 'Pulse action configuration for the scheme.',
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
