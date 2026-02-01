/**
 * Schema definition for CK3 Scripted Relations - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const scriptedRelationSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'opinion',
    type: 'integer',
    description: 'Base opinion modifier for this relation.',
    example: 'opinion = 20',
  },
  {
    name: 'reciprocal',
    type: 'boolean',
    description: 'Whether the relation is reciprocal (both directions).',
    default: true,
    example: 'reciprocal = yes',
  },
  {
    name: 'hidden',
    type: 'boolean',
    description: 'Whether the relation is hidden from the interface.',
    default: false,
    example: 'hidden = yes',
  },
  {
    name: 'special_guest',
    type: 'boolean',
    description: 'Mark as a special guest relation.',
    default: false,
    example: 'special_guest = yes',
  },

  // Modifiers
  {
    name: 'relation_modifier',
    type: 'block',
    description: 'Modifiers applied while in this relation.',
    example: `relation_modifier = {
    monthly_prestige = 0.1
}`,
  },

  // Conditions
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the relation to be valid.',
    example: `is_valid = {
    is_adult = yes
    NOT = { is_close_family_of = scope:target }
}`,
  },
  {
    name: 'can_have',
    type: 'trigger',
    description: 'Conditions for being able to have this relation.',
    example: `can_have = {
    is_landed = yes
}`,
  },

  // Flags
  {
    name: 'flag',
    type: 'string',
    description: 'Flag set when this relation exists.',
    example: 'flag = has_friend_relation',
  },

  // Effects
  {
    name: 'on_add',
    type: 'effect',
    description: 'Effects when the relation is added.',
    example: `on_add = {
    add_opinion = {
        target = scope:target
        modifier = new_friend_opinion
    }
}`,
  },
  {
    name: 'on_remove',
    type: 'effect',
    description: 'Effects when the relation is removed.',
    example: `on_remove = {
    remove_opinion = {
        target = scope:target
        modifier = new_friend_opinion
    }
}`,
  },
];

// Map for quick lookup
export const scriptedRelationSchemaMap = new Map<string, FieldSchema>(
  scriptedRelationSchema.map((field) => [field.name, field])
);

export function getScriptedRelationFieldNames(): string[] {
  return scriptedRelationSchema.map((field) => field.name);
}

export function getScriptedRelationFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedRelationSchemaMap.get(fieldName);
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
