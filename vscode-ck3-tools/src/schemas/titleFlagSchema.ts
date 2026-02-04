/**
 * Schema definition for CK3 Title Flags - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const titleFlagSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'flag',
    type: 'string',
    description: 'The flag identifier.',
    example: 'flag = "my_title_flag"',
  },

  // Duration
  {
    name: 'days',
    type: 'integer',
    description: 'Duration in days before flag expires.',
    example: 'days = 365',
  },
  {
    name: 'months',
    type: 'integer',
    description: 'Duration in months before flag expires.',
    example: 'months = 12',
  },
  {
    name: 'years',
    type: 'integer',
    description: 'Duration in years before flag expires.',
    example: 'years = 5',
  },

  // Value
  {
    name: 'value',
    type: 'integer',
    description: 'Value to set for the flag.',
    example: 'value = 1',
  },

  // Persistence
  {
    name: 'persist',
    type: 'boolean',
    description: 'Whether the flag persists when title changes hands.',
    default: false,
    example: 'persist = yes',
  },

  // Description
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the flag description.',
    example: 'desc = "flag_my_title_flag_desc"',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this flag to be valid.',
    example: `trigger = {
    tier >= tier_duchy
}`,
  },

  // Title Requirement
  {
    name: 'title_tier',
    type: 'enum',
    description: 'Required title tier for this flag.',
    values: ['barony', 'county', 'duchy', 'kingdom', 'empire'],
    example: 'title_tier = kingdom',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the flag.',
    example: 'icon = "gfx/interface/icons/title_flags/flag.dds"',
  },
];

// Map for quick lookup
export const titleFlagSchemaMap = new Map<string, FieldSchema>(
  titleFlagSchema.map((field) => [field.name, field])
);

export function getTitleFlagFieldNames(): string[] {
  return titleFlagSchema.map((field) => field.name);
}

export function getTitleFlagFieldDocumentation(fieldName: string): string | undefined {
  const field = titleFlagSchemaMap.get(fieldName);
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
