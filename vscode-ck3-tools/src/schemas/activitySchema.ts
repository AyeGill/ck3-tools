/**
 * Schema definition for CK3 Activities - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const ACTIVITY_TYPES = [
  'activity_hunt',
  'activity_feast',
  'activity_pilgrimage',
  'activity_tour',
  'activity_wedding',
  'activity_grand_wedding',
] as const;

export const activitySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the activity to appear as an option.',
    example: `is_shown = {
    is_ruler = yes
    highest_held_title_tier >= tier_county
}`,
  },
  {
    name: 'can_start',
    type: 'trigger',
    description: 'Conditions to start the activity.',
    example: `can_start = {
    is_available = yes
    gold >= activity_hunt_cost
}`,
  },
  {
    name: 'can_start_showing_failures_only',
    type: 'trigger',
    description: 'Conditions shown only when failing.',
    example: `can_start_showing_failures_only = {
    is_imprisoned = no
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the activity to remain valid.',
    example: `is_valid = {
    is_alive = yes
    is_imprisoned = no
}`,
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Cost to start the activity.',
    example: `cost = {
    gold = {
        value = 50
        multiply = activity_cost_mult
    }
}`,
  },

  // Location
  {
    name: 'province_filter',
    type: 'trigger',
    description: 'Filter for valid activity locations.',
    example: `province_filter = {
    is_sea = no
    holder = root
}`,
  },
  // Guests
  {
    name: 'guest_invite_rules',
    type: 'block',
    description: 'Rules for inviting guests.',
    example: `guest_invite_rules = {
    max_guests = 10

    rules = {
        2 = activity_invite_rule_friends
        3 = activity_invite_rule_close_family
    }
}`,
  },
  {
    name: 'max_guests',
    type: 'integer',
    description: 'Maximum number of guests.',
    example: 'max_guests = 20',
  },
  // Effects
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when the activity starts.',
    example: `on_start = {
    add_character_flag = hosting_activity
}`,
  },
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when the activity completes.',
    example: `on_complete = {
    add_prestige = 100
}`,
  },
  {
    name: 'on_invalidated',
    type: 'effect',
    description: 'Effects when the activity becomes invalid.',
    example: 'on_invalidated = { }',
  },
  // Phases
  {
    name: 'phases',
    type: 'block',
    description: 'Activity phases configuration.',
    example: `phases = {
    preparation = {
        duration = { days = 30 }
        on_phase_start = { }
        on_phase_end = { }
    }
    activity = {
        duration = { days = 14 }
        on_phase_start = { }
    }
}`,
  },

  // UI
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the activity.',
    example: 'icon = "gfx/interface/icons/activities/activity_hunt.dds"',
  },
  {
    name: 'background',
    type: 'string',
    description: 'Background image for the activity.',
    example: 'background = "gfx/interface/illustrations/activities/hunt.dds"',
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI preference for starting this activity.',
    example: `ai_will_do = {
    value = 100
    if = {
        limit = { stress >= 50 }
        add = 50
    }
}`,
  },
  {
    name: 'ai_check_interval',
    type: 'integer',
    description: 'How often AI checks to start this activity (in months).',
    example: 'ai_check_interval = 12',
  },

  // Activity type and grouping
  {
    name: 'activity_group_type',
    type: 'string',
    description: 'The activity group this activity belongs to.',
  },
  {
    name: 'sort_order',
    type: 'integer',
    description: 'Sort order for display in lists.',
  },
  {
    name: 'gui_tags',
    type: 'block',
    description: 'GUI tags for filtering and display.',
  },

  // AI configuration
  {
    name: 'ai_check_interval_by_tier',
    type: 'block',
    description: 'AI check interval based on character tier.',
  },
  {
    name: 'ai_province_filter',
    type: 'trigger',
    description: 'AI filter for selecting provinces.',
  },
  {
    name: 'ai_select_num_provinces',
    type: 'integer',
    description: 'Number of provinces AI should select.',
  },
  {
    name: 'ai_target_quick_trigger',
    type: 'trigger',
    description: 'Quick trigger for AI target selection.',
  },
  {
    name: 'ai_target_score',
    type: 'block',
    description: 'Score calculation for AI target selection.',
  },
  {
    name: 'ai_targets',
    type: 'block',
    description: 'Configuration for AI targets.',
  },
  {
    name: 'ai_will_select_province',
    type: 'trigger',
    description: 'Conditions for AI to select a province.',
  },

  // Planning and configuration
  {
    name: 'can_plan',
    type: 'trigger',
    description: 'Conditions for being able to plan this activity.',
  },
  {
    name: 'can_always_plan',
    type: 'boolean',
    description: 'Whether the activity can always be planned.',
  },
  {
    name: 'planner_type',
    type: 'string',
    description: 'Type of activity planner to use.',
  },
  {
    name: 'activity_planner_widgets',
    type: 'block',
    description: 'Widgets for the activity planner UI.',
  },
  {
    name: 'activity_window_widgets',
    type: 'block',
    description: 'Widgets for the activity window UI.',
  },

  // Guest configuration
  {
    name: 'can_be_activity_guest',
    type: 'trigger',
    description: 'Conditions for a character to be a guest.',
  },
  {
    name: 'allow_zero_guest_invites',
    type: 'boolean',
    description: 'Whether zero guest invites are allowed.',
  },
  {
    name: 'guest_description',
    type: 'string',
    description: 'Description shown for guests.',
  },
  {
    name: 'guest_intents',
    type: 'block',
    description: 'Intent configuration for guests.',
  },
  {
    name: 'guest_join_chance',
    type: 'block',
    description: 'Chance calculation for guest joining.',
  },
  {
    name: 'guest_subsets',
    type: 'block',
    description: 'Subsets of potential guests.',
  },
  {
    name: 'special_guests',
    type: 'block',
    description: 'Configuration for special guests.',
  },
  {
    name: 'max_guest_arrival_delay_time',
    type: 'integer',
    description: 'Maximum delay for guest arrival.',
  },

  // Host configuration
  {
    name: 'host_description',
    type: 'string',
    description: 'Description shown for the host.',
  },
  {
    name: 'host_intents',
    type: 'block',
    description: 'Intent configuration for the host.',
  },

  // Location and travel
  {
    name: 'is_location_valid',
    type: 'trigger',
    description: 'Conditions for a location to be valid.',
  },
  {
    name: 'is_single_location',
    type: 'boolean',
    description: 'Whether the activity occurs at a single location.',
  },
  {
    name: 'is_target_valid',
    type: 'trigger',
    description: 'Conditions for a target to be valid.',
  },
  {
    name: 'travel_entourage_selection',
    type: 'block',
    description: 'Configuration for travel entourage selection.',
  },
  {
    name: 'max_route_deviation_mult',
    type: 'float',
    description: 'Maximum route deviation multiplier.',
  },

  // Locale configuration
  {
    name: 'locales',
    type: 'block',
    description: 'Available locales for the activity.',
  },
  {
    name: 'locale_background',
    type: 'string',
    description: 'Background for the locale.',
  },
  {
    name: 'locale_cooldown',
    type: 'block',
    description: 'Cooldown for locale selection.',
  },
  {
    name: 'auto_select_locale_cooldown',
    type: 'block',
    description: 'Cooldown for auto-selecting locales.',
  },
  {
    name: 'early_locale_opening_duration',
    type: 'block',
    description: 'Duration for early locale opening.',
  },
  {
    name: 'on_enter_locale',
    type: 'effect',
    description: 'Effects when entering a locale.',
  },

  // Province configuration
  {
    name: 'province_description',
    type: 'string',
    description: 'Description for province selection.',
  },
  {
    name: 'province_score',
    type: 'block',
    description: 'Score calculation for province selection.',
  },
  {
    name: 'num_pickable_phases',
    type: 'integer',
    description: 'Number of phases that can be picked.',
  },
  {
    name: 'max_pickable_phases_per_province',
    type: 'integer',
    description: 'Maximum pickable phases per province.',
  },
  {
    name: 'max_province_icons',
    type: 'integer',
    description: 'Maximum province icons to display.',
  },

  // State and pulse events
  {
    name: 'on_enter_active_state',
    type: 'effect',
    description: 'Effects when entering active state.',
  },
  {
    name: 'on_enter_passive_state',
    type: 'effect',
    description: 'Effects when entering passive state.',
  },
  {
    name: 'on_enter_travel_state',
    type: 'effect',
    description: 'Effects when entering travel state.',
  },
  {
    name: 'on_leave_travel_state',
    type: 'effect',
    description: 'Effects when leaving travel state.',
  },
  {
    name: 'on_active_state_pulse',
    type: 'effect',
    description: 'Effects on active state pulse.',
  },
  {
    name: 'on_passive_state_pulse',
    type: 'effect',
    description: 'Effects on passive state pulse.',
  },
  {
    name: 'on_travel_state_pulse',
    type: 'effect',
    description: 'Effects on travel state pulse.',
  },
  {
    name: 'pulse_actions',
    type: 'block',
    description: 'Pulse action configuration.',
  },

  // Other events
  {
    name: 'on_host_death',
    type: 'effect',
    description: 'Effects when the host dies.',
  },
  {
    name: 'on_target_invalidated',
    type: 'effect',
    description: 'Effects when target becomes invalid.',
  },

  // Timing
  {
    name: 'cooldown',
    type: 'block',
    description: 'Cooldown before activity can be started again.',
  },
  {
    name: 'wait_time_before_start',
    type: 'block',
    description: 'Wait time before the activity starts.',
  },
  {
    name: 'auto_complete',
    type: 'boolean',
    description: 'Whether the activity auto-completes.',
  },

  // UI and visuals
  {
    name: 'visuals',
    type: 'block',
    description: 'Visual configuration for the activity.',
  },
  {
    name: 'map_entity',
    type: 'string',
    description: 'Map entity for the activity.',
  },
  {
    name: 'scripted_animation',
    type: 'string',
    description: 'Scripted animation for the activity.',
  },
  {
    name: 'window_characters',
    type: 'block',
    description: 'Characters to display in the window.',
  },
  {
    name: 'conclusion_description',
    type: 'string',
    description: 'Description shown at activity conclusion.',
  },
  {
    name: 'ui_predicted_cost',
    type: 'block',
    description: 'Predicted cost shown in UI.',
  },

  // Options and special features
  {
    name: 'options',
    type: 'block',
    description: 'Activity options configuration.',
  },
  {
    name: 'special_option_category',
    type: 'string',
    description: 'Category for special options.',
  },
  {
    name: 'open_invite',
    type: 'boolean',
    description: 'Whether the activity has open invites.',
  },
  {
    name: 'notify_player_can_join_activity',
    type: 'boolean',
    description: 'Whether to notify player they can join.',
  },
  {
    name: 'chance',
    type: 'block',
    description: 'Chance calculation for the activity.',
  },
];

// Map for quick lookup
export const activitySchemaMap = new Map<string, FieldSchema>(
  activitySchema.map((field) => [field.name, field])
);

export function getActivityFieldNames(): string[] {
  return activitySchema.map((field) => field.name);
}

export function getActivityFieldDocumentation(fieldName: string): string | undefined {
  const field = activitySchemaMap.get(fieldName);
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
