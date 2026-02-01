/**
 * Schema definition for CK3 Activities - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

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

  // Duration
  {
    name: 'max_days',
    type: 'integer',
    description: 'Maximum duration in days.',
    example: 'max_days = 180',
  },
  {
    name: 'min_days',
    type: 'integer',
    description: 'Minimum duration in days.',
    example: 'min_days = 30',
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
  {
    name: 'ai_province_score',
    type: 'block',
    description: 'AI score for selecting a province.',
    example: `ai_province_score = {
    value = 100
    if = {
        limit = { this = root.capital_province }
        add = 50
    }
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
  {
    name: 'min_guests',
    type: 'integer',
    description: 'Minimum number of guests.',
    example: 'min_guests = 5',
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
  {
    name: 'on_monthly',
    type: 'effect',
    description: 'Monthly effects during the activity.',
    example: 'on_monthly = { }',
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

  // Special Options
  {
    name: 'special_options',
    type: 'block',
    description: 'Special activity options.',
    example: `special_options = {
    option_key = {
        cost = { gold = 100 }
        effect = { add_prestige = 50 }
    }
}`,
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
