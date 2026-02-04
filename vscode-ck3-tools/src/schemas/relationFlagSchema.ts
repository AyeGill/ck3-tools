/**
 * Schema definition for CK3 Relation Flags - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const relationFlagSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the flag name.',
    example: 'name = "relation_flag_rival"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the flag description.',
    example: 'desc = "relation_flag_rival_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the relation flag.',
    example: 'icon = "gfx/interface/icons/relation_flags/rival.dds"',
  },

  // Type
  {
    name: 'relation_type',
    type: 'enum',
    description: 'Type of relation this flag represents.',
    values: ['positive', 'negative', 'neutral', 'special'],
    example: 'relation_type = negative',
  },

  // Mutual
  {
    name: 'mutual',
    type: 'boolean',
    description: 'Whether this relation is mutual.',
    default: false,
    example: 'mutual = yes',
  },

  // Opinion
  {
    name: 'opinion',
    type: 'integer',
    description: 'Opinion modifier from this relation.',
    example: 'opinion = -25',
  },

  // Duration
  {
    name: 'duration',
    type: 'block',
    description: 'Duration of the relation.',
    example: `duration = {
    years = 10
}`,
  },
  {
    name: 'permanent',
    type: 'boolean',
    description: 'Whether this relation is permanent.',
    default: false,
    example: 'permanent = yes',
  },

  // Trigger
  {
    name: 'can_add',
    type: 'trigger',
    description: 'Conditions for adding this relation.',
    example: `can_add = {
    NOT = { has_relation_friend = scope:target }
}`,
  },
  {
    name: 'can_remove',
    type: 'trigger',
    description: 'Conditions for removing this relation.',
    example: `can_remove = {
    opinion = { target = scope:target value >= 50 }
}`,
  },

  // Effects
  {
    name: 'on_add',
    type: 'effect',
    description: 'Effects when this relation is added.',
    example: `on_add = {
    add_opinion = {
        target = scope:target
        modifier = new_rival_opinion
    }
}`,
  },
  {
    name: 'on_remove',
    type: 'effect',
    description: 'Effects when this relation is removed.',
    example: `on_remove = {
    remove_opinion = {
        target = scope:target
        modifier = rival_opinion
    }
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Display priority.',
    example: 'priority = 100',
  },
];

// Map for quick lookup
export const relationFlagSchemaMap = new Map<string, FieldSchema>(
  relationFlagSchema.map((field) => [field.name, field])
);

export function getRelationFlagFieldNames(): string[] {
  return relationFlagSchema.map((field) => field.name);
}

export function getRelationFlagFieldDocumentation(fieldName: string): string | undefined {
  const field = relationFlagSchemaMap.get(fieldName);
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
