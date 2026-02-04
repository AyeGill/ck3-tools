/**
 * Schema definition for CK3 Important Actions - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const IMPORTANT_ACTION_TYPES = [
  'action_type_alert',
  'action_type_interaction',
  'action_type_decision',
  'action_type_scheme',
] as const;

export const importantActionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'enum',
    description: 'Type of important action.',
    values: [...IMPORTANT_ACTION_TYPES],
    example: 'type = action_type_alert',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the action.',
    example: 'icon = "gfx/interface/icons/alerts/alert_icon.dds"',
  },
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority in the action list (higher = more prominent).',
    example: 'priority = 100',
  },

  // Display
  {
    name: 'check_create_action',
    type: 'trigger',
    description: 'Conditions to show the action.',
    example: `check_create_action = {
    is_ruler = yes
    any_vassal = {
        count >= 1
        has_character_flag = needs_attention
    }
}`,
  },
  {
    name: 'is_dangerous',
    type: 'boolean',
    description: 'Whether this action represents a danger.',
    default: false,
    example: 'is_dangerous = yes',
  },

  // Effect
  {
    name: 'effect',
    type: 'effect',
    description: 'Effect when the action is clicked.',
    example: `effect = {
    open_view_data = {
        view = character
        player = root
    }
}`,
  },

  // Unimportant
  {
    name: 'unimportant',
    type: 'trigger',
    description: 'Conditions for the action to be considered unimportant.',
    example: `unimportant = {
    has_character_flag = dismissed_action
}`,
  },

  // Combining
  {
    name: 'combine_into_one',
    type: 'boolean',
    description: 'Whether multiple instances combine into one.',
    default: false,
    example: 'combine_into_one = yes',
  },
];

// Map for quick lookup
export const importantActionSchemaMap = new Map<string, FieldSchema>(
  importantActionSchema.map((field) => [field.name, field])
);

export function getImportantActionFieldNames(): string[] {
  return importantActionSchema.map((field) => field.name);
}

export function getImportantActionFieldDocumentation(fieldName: string): string | undefined {
  const field = importantActionSchemaMap.get(fieldName);
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
