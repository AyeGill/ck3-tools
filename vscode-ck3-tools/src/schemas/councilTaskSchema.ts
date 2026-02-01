/**
 * Schema definition for CK3 Council Tasks - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const COUNCIL_POSITIONS = [
  'councillor_chancellor',
  'councillor_marshal',
  'councillor_steward',
  'councillor_spymaster',
  'councillor_court_chaplain',
] as const;

export const councilTaskSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'position',
    type: 'enum',
    description: 'The council position that performs this task.',
    values: [...COUNCIL_POSITIONS],
    required: true,
    example: 'position = councillor_steward',
  },
  {
    name: 'task_type',
    type: 'enum',
    description: 'Type of task (county or character focused).',
    values: ['county', 'character', 'none'],
    example: 'task_type = county',
  },
  {
    name: 'county_target',
    type: 'enum',
    description: 'What counties can be targeted.',
    values: ['realm', 'domain', 'neighbor', 'all'],
    example: 'county_target = realm',
  },
  {
    name: 'task_progress',
    type: 'enum',
    description: 'How task progress works.',
    values: ['standard', 'infinite', 'immediate'],
    example: 'task_progress = standard',
  },
  {
    name: 'default_task',
    type: 'boolean',
    description: 'Whether this is the default task for the position.',
    default: false,
    example: 'default_task = yes',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the task.',
    example: 'icon = "gfx/interface/icons/council_tasks/task_collect_taxes.dds"',
  },

  // Effects
  {
    name: 'effect_desc',
    type: 'string',
    description: 'Localization key for effect description.',
    example: 'effect_desc = task_collect_taxes_effect_desc',
  },
  {
    name: 'monthly_on_action',
    type: 'string',
    description: 'On_action triggered monthly while task is active.',
    example: 'monthly_on_action = task_collect_taxes_monthly',
  },
  {
    name: 'on_start_task',
    type: 'effect',
    description: 'Effects when the task starts.',
    example: `on_start_task = {
    scope:councillor = {
        add_character_flag = performing_task
    }
}`,
  },
  {
    name: 'on_finish_task',
    type: 'effect',
    description: 'Effects when the task completes.',
    example: `on_finish_task = {
    scope:county = { add_county_modifier = developed_county }
}`,
  },
  {
    name: 'on_cancel_task',
    type: 'effect',
    description: 'Effects when the task is cancelled.',
    example: 'on_cancel_task = { }',
  },

  // Progress
  {
    name: 'task_progress_value',
    type: 'block',
    description: 'Monthly progress calculation.',
    example: `task_progress_value = {
    value = scope:councillor.stewardship
    multiply = 0.5
}`,
  },
  {
    name: 'potential_county',
    type: 'trigger',
    description: 'Conditions for a county to be a valid target.',
    example: `potential_county = {
    is_county = yes
    holder = scope:liege
}`,
  },

  // Conditions
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the task to appear.',
    example: `is_shown = {
    scope:liege = { is_ruler = yes }
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the task to remain valid.',
    example: `is_valid = {
    scope:councillor = { is_available = yes }
}`,
  },
  {
    name: 'is_valid_showing_failures_only',
    type: 'trigger',
    description: 'Conditions shown only when failing.',
    example: `is_valid_showing_failures_only = {
    scope:councillor = { NOT = { is_imprisoned = yes } }
}`,
  },

  // Modifiers
  {
    name: 'councillor_modifier',
    type: 'block',
    description: 'Modifiers applied to the councillor.',
    example: `councillor_modifier = {
    monthly_prestige = 0.1
}`,
  },
  {
    name: 'liege_modifier',
    type: 'block',
    description: 'Modifiers applied to the liege.',
    example: `liege_modifier = {
    monthly_income = 0.5
}`,
  },
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to the target county.',
    example: `county_modifier = {
    development_growth_factor = 0.2
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI preference for assigning this task.',
    example: `ai_will_do = {
    value = 100
    if = {
        limit = { gold < 50 }
        add = 100
    }
}`,
  },
  {
    name: 'ai_target_score',
    type: 'block',
    description: 'AI score for selecting a target.',
    example: `ai_target_score = {
    value = 100
    if = {
        limit = { development_level < 20 }
        add = 50
    }
}`,
  },
];

// Map for quick lookup
export const councilTaskSchemaMap = new Map<string, FieldSchema>(
  councilTaskSchema.map((field) => [field.name, field])
);

export function getCouncilTaskFieldNames(): string[] {
  return councilTaskSchema.map((field) => field.name);
}

export function getCouncilTaskFieldDocumentation(fieldName: string): string | undefined {
  const field = councilTaskSchemaMap.get(fieldName);
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
