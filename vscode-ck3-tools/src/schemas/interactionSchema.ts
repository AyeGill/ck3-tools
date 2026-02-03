/**
 * Schema definition for CK3 character interactions - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const INTERACTION_CATEGORIES = [
  'interaction_category_diplomacy',
  'interaction_category_friendly',
  'interaction_category_hostile',
  'interaction_category_vassal',
  'interaction_category_religion',
  'interaction_category_prison',
  'interaction_category_scheme',
  'interaction_category_uncategorized',
  // Additional categories from game files
  'contract',
  'interaction_category_diarch',
  'interaction_category_laamp',
  'interaction_category_succession',
  'interaction_category_romance',
  'political',
  // Debug categories
  'interaction_debug_admin',
  'interaction_debug_main',
  'interaction_debug_mpo',
  'interaction_debug_tgp',
] as const;

export const GREETING_TYPES = [
  'positive',
  'negative',
  'neutral',
] as const;

export const AI_RECIPIENT_TYPES = [
  'all',
  'neighboring_rulers',
  'realm_characters',
  'courtiers',
  'dynasty_members',
  'house_members',
  'children',
  'spouses',
  'vassals',
  'head_of_faith',
  'close_family',
  'extended_family',
  'guests',
] as const;

export const interactionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'category',
    type: 'enum',
    description: 'UI category for the interaction.',
    values: [...INTERACTION_CATEGORIES],
    example: 'category = interaction_category_hostile',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the interaction.',
    example: 'icon = icon_scheme',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the interaction description.',
    example: 'desc = my_interaction_desc',
  },
  {
    name: 'greeting',
    type: 'enum',
    description: 'Tone of the interaction (affects AI response).',
    values: [...GREETING_TYPES],
    default: 'neutral',
    example: 'greeting = positive',
  },
  {
    name: 'notification_text',
    type: 'string',
    description: 'Localization key for the notification text.',
    example: 'notification_text = MY_INTERACTION_NOTIFICATION',
  },

  // Conditions
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the interaction to appear. Use scope:actor and scope:recipient.',
    example: `is_shown = {
    scope:actor = { is_ruler = yes }
    scope:recipient = {
        NOT = { this = scope:actor }
    }
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the interaction to be selectable.',
    example: `is_valid = {
    scope:actor = { gold >= 100 }
}`,
  },
  {
    name: 'is_valid_showing_failures_only',
    type: 'trigger',
    description: 'Conditions shown only when failing.',
    example: `is_valid_showing_failures_only = {
    scope:recipient = { is_imprisoned = no }
}`,
  },
  {
    name: 'can_be_blocked',
    type: 'trigger',
    description: 'Conditions under which the recipient can decline.',
    example: `can_be_blocked = {
    scope:recipient = { is_ruler = yes }
}`,
  },
  {
    name: 'can_be_picked',
    type: 'trigger',
    description: 'Additional checks for when the interaction can be initiated.',
    example: `can_be_picked = {
    is_at_war = no
}`,
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Resources spent when initiating the interaction.',
    example: `cost = {
    gold = 50
    prestige = 100
}`,
  },

  // Effect
  {
    name: 'on_accept',
    type: 'effect',
    description: 'Effects when the recipient accepts.',
    example: `on_accept = {
    scope:actor = { add_gold = -50 }
    scope:recipient = { add_gold = 50 }
}`,
  },
  {
    name: 'on_decline',
    type: 'effect',
    description: 'Effects when the recipient declines.',
    example: `on_decline = {
    scope:actor = {
        add_opinion = {
            target = scope:recipient
            modifier = refused_my_request
        }
    }
}`,
  },
  {
    name: 'on_send',
    type: 'effect',
    description: 'Effects when the interaction is sent (before response).',
    example: `on_send = {
    scope:actor = {
        add_character_flag = {
            flag = sent_interaction
            days = 30
        }
    }
}`,
  },
  {
    name: 'on_auto_accept',
    type: 'effect',
    description: 'Effects when auto-accepted (for interactions that skip acceptance).',
    example: 'on_auto_accept = { add_prestige = 100 }',
  },
  {
    name: 'on_blocked_effect',
    type: 'effect',
    description: 'Effects when the interaction is blocked.',
    example: 'on_blocked_effect = { add_stress = 10 }',
  },
  // Auto-accept
  {
    name: 'auto_accept',
    type: 'boolean',
    description: 'If yes, the interaction is automatically accepted.',
    default: false,
    example: 'auto_accept = yes',
  },
  {
    name: 'hidden',
    type: 'boolean',
    description: 'If yes, the interaction does not appear in the UI.',
    default: false,
    example: 'hidden = yes',
  },
  {
    name: 'use_diplomatic_range',
    type: 'boolean',
    description: 'If yes, requires diplomatic range to target.',
    default: true,
    example: 'use_diplomatic_range = no',
  },

  // AI
  {
    name: 'ai_targets',
    type: 'block',
    description: 'Define AI targeting for this interaction.',
    example: `ai_targets = {
    ai_recipients = neighboring_rulers
}`,
  },
  {
    name: 'ai_target_quick_trigger',
    type: 'trigger',
    description: 'Quick filter for AI targets (checked first).',
    example: `ai_target_quick_trigger = {
    adult = yes
}`,
  },
  {
    name: 'ai_frequency',
    type: 'integer',
    description: 'How often AI considers this interaction (in months).',
    default: 12,
    example: 'ai_frequency = 6',
  },
  {
    name: 'ai_frequency_by_tier',
    type: 'block',
    description: 'AI frequency based on character tier.',
    example: `ai_frequency_by_tier = {
    county = 0
    duchy = 12
    kingdom = 12
    empire = 12
}`,
  },
  {
    name: 'ai_potential',
    type: 'trigger',
    description: 'Conditions for AI to consider initiating.',
    example: `ai_potential = {
    gold > 100
}`,
  },
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI weight for initiating the interaction.',
    example: `ai_will_do = {
    base = 100
    modifier = {
        factor = 0.5
        has_trait = shy
    }
}`,
  },
  {
    name: 'ai_accept',
    type: 'block',
    description: 'AI acceptance calculation.',
    example: `ai_accept = {
    base = -50
    opinion_modifier = {
        opinion_target = scope:actor
        multiplier = 1
    }
}`,
  },
  {
    name: 'ai_min_reply_days',
    type: 'integer',
    description: 'Minimum days before AI responds.',
    example: 'ai_min_reply_days = 3',
  },
  {
    name: 'ai_max_reply_days',
    type: 'integer',
    description: 'Maximum days before AI responds.',
    example: 'ai_max_reply_days = 10',
  },

  // Cooldown
  {
    name: 'cooldown',
    type: 'block',
    description: 'Prevents using the interaction again for a duration.',
    example: 'cooldown = { years = 1 }',
  },
  {
    name: 'cooldown_against_recipient',
    type: 'block',
    description: 'Cooldown against the specific recipient.',
    example: 'cooldown_against_recipient = { months = 6 }',
  },

  // Options
  {
    name: 'send_option',
    type: 'block',
    description: 'Additional option the player can toggle when sending.',
    example: `send_option = {
    flag = my_option
    localization = MY_OPTION_LOC
    current_description = MY_OPTION_DESC
}`,
  },
  {
    name: 'send_options_exclusive',
    type: 'boolean',
    description: 'If yes, send options are mutually exclusive.',
    default: false,
    example: 'send_options_exclusive = yes',
  },

  // Targeting
  {
    name: 'target_type',
    type: 'string',
    description: 'Type of target for the interaction.',
    example: 'target_type = artifact',
  },
  {
    name: 'target_filter',
    type: 'string',
    description: 'Filter for valid targets.',
    example: 'target_filter = recipient_courtiers',
  },

  // Interface
  {
    name: 'interface_priority',
    type: 'integer',
    description: 'Priority in the interaction list (higher = more prominent).',
    example: 'interface_priority = 100',
  },
  {
    name: 'common_interaction',
    type: 'boolean',
    description: 'If yes, shown in the common interactions menu.',
    default: false,
    example: 'common_interaction = yes',
  },
  {
    name: 'needs_recipient_to_open',
    type: 'boolean',
    description: 'If yes, requires a recipient before opening the interface.',
    default: true,
    example: 'needs_recipient_to_open = no',
  },

  // Extra
  {
    name: 'popup_on_receive',
    type: 'boolean',
    description: 'If yes, shows a popup to the recipient.',
    default: true,
    example: 'popup_on_receive = no',
  },
  {
    name: 'should_use_extra_icon',
    type: 'block',
    description: 'Conditions for showing an extra icon.',
    example: `should_use_extra_icon = {
    scope:actor = { has_hook = scope:recipient }
}`,
  },
  {
    name: 'extra_icon',
    type: 'string',
    description: 'Path to the extra icon.',
    example: 'extra_icon = "gfx/interface/icons/character_interactions/hook_icon.dds"',
  },
];

// Map for quick lookup
export const interactionSchemaMap = new Map<string, FieldSchema>(
  interactionSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getInteractionFieldNames(): string[] {
  return interactionSchema.map((field) => field.name);
}

// Get documentation for a field
export function getInteractionFieldDocumentation(fieldName: string): string | undefined {
  const field = interactionSchemaMap.get(fieldName);
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
