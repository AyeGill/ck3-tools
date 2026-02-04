/**
 * Schema definition for CK3 events - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const EVENT_TYPES = [
  'character_event',
  'letter_event',
  'court_event',
  'fullscreen_event',
  'activity_event',
] as const;

export const EVENT_THEMES = [
  // Core themes
  'default',
  'realm',
  'diplomacy',
  'intrigue',
  'martial',
  'stewardship',
  'learning',
  'faith',
  'family',
  'war',
  'death',
  'dread',
  'dungeon',
  'secret',
  'education',
  'healthcare',
  'party',
  'pet',
  'witchcraft',
  'physical_health',
  'mental_health',
  'skull',
  // General/misc
  'administrative',
  'alliance',
  'bastardy',
  'battle',
  'byzantine',
  'coronation',
  'corruption',
  'court',
  'crown',
  'cultural_festival',
  'culture_change',
  'debate',
  'disaster',
  'dynastic_cycle',
  'dynasty',
  'emperor',
  'friendly',
  'unfriendly',
  'harrying',
  'host_dinner',
  'hostage',
  'hunting',
  'imperial_examination',
  'inspiration_complete',
  'laamp',
  'landless_adventurer',
  'legend',
  'legend_terrain',
  'love',
  'lover_relation',
  'friend_relation',
  'rival_relation',
  'mandala',
  'marriage',
  'medicine',
  'memory_intrigue',
  'memory_positive',
  'mental_break',
  'merit',
  'migration',
  'new_royal_court',
  'nomads',
  'plague',
  'pregnancy',
  'prison',
  'raid',
  'recovery',
  'ruler_objectives',
  'seduction',
  'romance',
  'silk_road',
  'tributary',
  'university',
  'vassal',
  'violet_poet',
  // Lifestyle focuses
  'diplomacy_family_focus',
  'diplomacy_foreign_affairs_focus',
  'diplomacy_majesty_focus',
  'intrigue_intimidation_focus',
  'intrigue_skulduggery_focus',
  'intrigue_temptation_focus',
  'learning_medicine_focus',
  'learning_scholarship_focus',
  'learning_theology_focus',
  'martial_authority_focus',
  'martial_chivalry_focus',
  'martial_strategy_focus',
  'stewardship_domain_focus',
  'stewardship_duty_focus',
  'stewardship_wealth_focus',
  'wanderer_destination_focus',
  'wanderer_internal_affairs_focus',
  'wanderer_journey_focus',
  // Schemes
  'befriend_scheme',
  'claim_throne_scheme',
  'fabricate_hook_scheme',
  'generic_intrigue_scheme',
  'murder_scheme',
  'romance_scheme',
  'seduce_scheme',
  'sway_scheme',
  // Activities
  'coronation_activity',
  'feast_activity',
  'festival_activity',
  'funeral_activity',
  'hunt_activity',
  'hunt_activity_camp',
  'journey_activity',
  'murder_feast_activity',
  'playdate_activity',
  'roaming_activity',
  'survey_activity',
  'wedding_banquet_activity',
  'wedding_ceremony_activity',
  'wedding_night_activity',
  'bloody_wedding_banquet',
  'bloody_wedding_ceremony',
  // Travel
  'travel',
  'travel_danger',
  'travel_pilgrimage',
  'travel_sea',
  'travel_tour',
  'widgetless_travel',
  'widgetless_travel_danger',
  // Pilgrimage
  'pilgrimage_activity',
  'pilgrimage_destination',
  'pilgrimage_return',
  // Tours
  'tour_arrival',
  'tour_arrival_turned_away',
  'tour_grounds',
  'tour_stop',
  // Tournaments
  'chariot_race',
  'chariot_race_charioteer',
  'tournament_archery_pivotal',
  'tournament_contest',
  'tournament_grounds',
  'tournament_joust_pivotal',
  'tournament_locale_artisans',
  'tournament_locale_camp',
  'tournament_locale_forge',
  'tournament_locale_tavern',
  'tournament_locale_temple',
  'tournament_locale_village',
  'tournament_melee_pivotal',
  'tournament_outskirts',
  'tournament_wrestling_pivotal',
  // Dev/test (kept for completeness)
  'ep2_video_test',
  'lighting_test',
  'lisp',
] as const;

export const PORTRAIT_ANIMATIONS = [
  'idle',
  'personality_bold',
  'personality_callous',
  'personality_compassionate',
  'personality_content',
  'personality_cynical',
  'personality_dishonorable',
  'personality_forgiving',
  'personality_greedy',
  'personality_honorable',
  'personality_irrational',
  'personality_rational',
  'personality_shameless',
  'personality_vengeful',
  'personality_zealous',
  'anger',
  'boredom',
  'confusion',
  'ecstasy',
  'fear',
  'flirtation',
  'grief',
  'happiness',
  'pain',
  'pensiveness',
  'sadness',
  'schadenfreude',
  'shock',
  'sick',
  'stress',
  'admiration',
  'disgust',
  'dismissal',
  'newborn',
  'war_over_win',
  'war_over_loss',
  'throne_room_over_shoulder',
  'throne_room_face_right',
  'throne_room_kneel',
  'throne_room_bow_1',
  'throne_room_bow_2',
  'knight',
  'commander',
  'rage',
] as const;

export const eventSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'enum',
    description: 'The type of event. Determines how the event is displayed.',
    values: [...EVENT_TYPES],
    default: 'character_event',
    example: 'type = character_event',
  },
  {
    name: 'hidden',
    type: 'boolean',
    description: 'If yes, the event fires without showing any UI.',
    default: false,
    example: 'hidden = yes',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Localization key for the event title. Can also be a first_valid block for dynamic titles.',
    example: 'title = my_event.0001.t',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the event description. Can also be a first_valid/triggered_desc block.',
    example: 'desc = my_event.0001.desc',
  },
  {
    name: 'theme',
    type: 'enum',
    description: 'Visual theme for the event window.',
    values: [...EVENT_THEMES],
    default: 'default',
    example: 'theme = intrigue',
  },
  {
    name: 'override_background',
    type: 'block',
    description: 'Override the background image for the event.',
    example: `override_background = {
    reference = bedchamber
}`,
  },
  {
    name: 'override_icon',
    type: 'block',
    description: 'Override the icon shown in the event.',
    example: `override_icon = {
    reference = "gfx/interface/icons/event_types/type_death.dds"
}`,
  },
  {
    name: 'override_sound',
    type: 'block',
    description: 'Override the sound effect for the event.',
    example: `override_sound = {
    reference = "event:/SFX/Events/Themes/sfx_event_theme_type_death"
}`,
  },

  // Portraits
  {
    name: 'left_portrait',
    type: 'block',
    description: 'Character shown on the left side of the event.',
    example: `left_portrait = {
    character = root
    animation = happiness
}`,
  },
  {
    name: 'right_portrait',
    type: 'block',
    description: 'Character shown on the right side of the event.',
    example: `right_portrait = {
    character = scope:target
    animation = anger
}`,
  },
  {
    name: 'center_portrait',
    type: 'block',
    description: 'Character shown in the center of the event (for fullscreen events).',
    example: `center_portrait = {
    character = root
    animation = idle
}`,
  },
  {
    name: 'lower_left_portrait',
    type: 'block',
    description: 'Character shown in the lower left of the event.',
    example: 'lower_left_portrait = { character = scope:child }',
  },
  {
    name: 'lower_center_portrait',
    type: 'block',
    description: 'Character shown in the lower center of the event.',
    example: 'lower_center_portrait = { character = scope:child }',
  },
  {
    name: 'lower_right_portrait',
    type: 'block',
    description: 'Character shown in the lower right of the event.',
    example: 'lower_right_portrait = { character = scope:spouse }',
  },

  // Artifacts
  {
    name: 'artifact',
    type: 'block',
    description: 'Display an artifact in the event.',
    example: `artifact = {
    target = scope:artifact
    position = lower_center_portrait
}`,
  },

  // Widgets
  {
    name: 'widget',
    type: 'block',
    description: 'Add a custom widget to the event.',
    example: `widget = {
    gui = "event_window_widget_scheme"
    container = "custom_widgets_container"
}`,
  },

  // Trigger and Immediate
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions that must be true for the event to fire. Checked when triggered.',
    example: `trigger = {
    is_adult = yes
    NOT = { has_trait = incapable }
}`,
  },
  {
    name: 'on_trigger_fail',
    type: 'effect',
    description: 'Effects to run if the trigger fails.',
    example: `on_trigger_fail = {
    trigger_event = fallback_event.0001
}`,
  },
  {
    name: 'immediate',
    type: 'effect',
    description: 'Effects to run immediately when the event fires, before options are shown.',
    example: `immediate = {
    play_music_cue = mx_cue_positive_effect
    save_scope_as = actor
}`,
  },
  {
    name: 'after',
    type: 'effect',
    description: 'Effects to run after any option is chosen.',
    example: `after = {
    remove_character_flag = my_flag
}`,
  },

  // Options
  {
    name: 'option',
    type: 'block',
    description: 'An option the player can choose. Multiple options can be defined.',
    example: `option = {
    name = my_event.0001.a
    trigger = { is_ruler = yes }
    add_gold = 100
}`,
  },

  // Cooldowns and Weights
  {
    name: 'cooldown',
    type: 'block',
    description: 'Prevents the event from firing again for a duration.',
    example: 'cooldown = { years = 5 }',
  },
  {
    name: 'weight_multiplier',
    type: 'block',
    description: 'Modifies the weight of this event in random lists.',
    example: `weight_multiplier = {
    base = 1
    modifier = {
        factor = 2
        has_trait = ambitious
    }
}`,
  },

  // Orphan handling
  {
    name: 'orphan',
    type: 'boolean',
    description: 'If yes, event can persist even if the root scope becomes invalid.',
    default: false,
    example: 'orphan = yes',
  },

  // Window customization
  {
    name: 'window',
    type: 'string',
    description: 'Custom window type for the event.',
    example: 'window = event_window_diplomatic',
  },
  {
    name: 'major',
    type: 'boolean',
    description: 'If yes, this is a major event with special UI treatment.',
    default: false,
    example: 'major = yes',
  },
];

// Map for quick lookup
export const eventSchemaMap = new Map<string, FieldSchema>(
  eventSchema.map((field) => [field.name, field])
);

/**
 * Schema for event option blocks
 */
export const eventOptionSchema: FieldSchema[] = [
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the option text.',
    example: 'name = my_event.0001.a',
  },
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this option to be available.',
    example: `trigger = {
    is_ruler = yes
}`,
  },
  {
    name: 'show_as_unavailable',
    type: 'trigger',
    description: 'Show the option greyed out when this is true but trigger is false.',
    example: `show_as_unavailable = {
    gold < 100
}`,
  },
  {
    name: 'highlight_portrait',
    type: 'string',
    description: 'Highlight a portrait when hovering this option.',
    example: 'highlight_portrait = left_portrait',
  },
  {
    name: 'skill',
    type: 'enum',
    description: 'Show a skill check for this option.',
    values: ['diplomacy', 'martial', 'stewardship', 'intrigue', 'learning', 'prowess'],
    example: 'skill = intrigue',
  },
  {
    name: 'ai_chance',
    type: 'block',
    description: 'AI weight for choosing this option.',
    example: `ai_chance = {
    base = 100
    modifier = {
        factor = 0
        is_ai = no
    }
}`,
  },
  {
    name: 'fallback',
    type: 'boolean',
    description: 'If yes, this is the fallback option when no others are valid.',
    example: 'fallback = yes',
  },
  {
    name: 'exclusive',
    type: 'boolean',
    description: 'If yes, only this option shows when valid.',
    example: 'exclusive = yes',
  },
  {
    name: 'first_valid',
    type: 'block',
    description: 'First valid sub-block determines the option content.',
    example: `first_valid = {
    triggered_desc = { trigger = { ... } desc = option_a }
    desc = option_default
}`,
  },
  {
    name: 'flavor',
    type: 'block',
    description: 'Flavor text block shown with the option.',
    example: `flavor = {
    text = flavor_text_key
    trigger = { ... }
}`,
  },
  {
    name: 'trait',
    type: 'string',
    description: 'Trait to show as associated with this option.',
    example: 'trait = brave',
  },
  {
    name: 'clicksound',
    type: 'string',
    description: 'Sound effect to play when option is clicked.',
    example: 'clicksound = event_button_sound',
  },
  {
    name: 'custom_tooltip',
    type: 'string',
    description: 'Custom tooltip localization key.',
    example: 'custom_tooltip = my_custom_tooltip',
  },
];

export const eventOptionSchemaMap = new Map<string, FieldSchema>(
  eventOptionSchema.map((field) => [field.name, field])
);

/**
 * Schema for portrait blocks
 */
export const portraitBlockSchema: FieldSchema[] = [
  {
    name: 'character',
    type: 'string',
    description: 'The character to display (scope reference).',
    example: 'character = root',
  },
  {
    name: 'animation',
    type: 'enum',
    description: 'Animation to play for the portrait.',
    values: [...PORTRAIT_ANIMATIONS],
    default: 'idle',
    example: 'animation = happiness',
  },
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for showing this portrait.',
    example: `trigger = {
    exists = scope:target
}`,
  },
  {
    name: 'camera',
    type: 'string',
    description: 'Camera angle for the portrait.',
    example: 'camera = camera_event_right',
  },
  {
    name: 'hide_info',
    type: 'boolean',
    description: 'Hide the character info tooltip.',
    example: 'hide_info = yes',
  },
  {
    name: 'scripted_animation',
    type: 'string',
    description: 'Use a scripted animation instead of a standard one.',
    example: 'scripted_animation = throne_room_kneel',
  },
];

export const portraitBlockSchemaMap = new Map<string, FieldSchema>(
  portraitBlockSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getEventFieldNames(): string[] {
  return eventSchema.map((field) => field.name);
}

// Get documentation for a field
export function getEventFieldDocumentation(fieldName: string): string | undefined {
  const field = eventSchemaMap.get(fieldName);
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
