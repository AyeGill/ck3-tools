/**
 * Schema definition for CK3 Tutorials - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const tutorialSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the tutorial name.',
    example: 'name = "tutorial_basics"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the tutorial description.',
    example: 'desc = "tutorial_basics_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the tutorial.',
    example: 'icon = "gfx/interface/icons/tutorials/basics.dds"',
  },

  // Steps
  {
    name: 'step',
    type: 'block',
    description: 'A tutorial step definition.',
    example: `step = {
    name = "step_1"
    desc = "step_1_desc"
    highlight = "character_window"
    trigger = { is_ruler = yes }
}`,
  },

  // Trigger
  {
    name: 'start_trigger',
    type: 'trigger',
    description: 'Conditions to start the tutorial.',
    example: `start_trigger = {
    is_tutorial_active = no
    is_ai = no
}`,
  },
  {
    name: 'complete_trigger',
    type: 'trigger',
    description: 'Conditions to complete the tutorial.',
    example: `complete_trigger = {
    has_completed_all_steps = yes
}`,
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of tutorial.',
    values: ['basics', 'warfare', 'intrigue', 'diplomacy', 'dynasty', 'religion', 'culture'],
    example: 'category = basics',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Display priority.',
    example: 'priority = 100',
  },

  // Effects
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when tutorial starts.',
    example: `on_start = {
    pause_game = yes
}`,
  },
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when tutorial completes.',
    example: `on_complete = {
    add_prestige = 100
}`,
  },

  // UI
  {
    name: 'window',
    type: 'string',
    description: 'Window to display tutorial in.',
    example: 'window = "tutorial_window"',
  },
];

// Map for quick lookup
export const tutorialSchemaMap = new Map<string, FieldSchema>(
  tutorialSchema.map((field) => [field.name, field])
);

export function getTutorialFieldNames(): string[] {
  return tutorialSchema.map((field) => field.name);
}

export function getTutorialFieldDocumentation(fieldName: string): string | undefined {
  const field = tutorialSchemaMap.get(fieldName);
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
