/**
 * Schema definition for CK3 Nickname Rules - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const nicknameRuleSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'is_prefix',
    type: 'boolean',
    description: 'Whether the nickname appears before the name.',
    default: 'no',
    example: 'is_prefix = yes',
  },
  {
    name: 'is_bad',
    type: 'boolean',
    description: 'Whether this is considered a negative nickname.',
    default: 'no',
    example: 'is_bad = yes',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for getting this nickname.',
    example: `trigger = {
    martial >= 20
    any_held_title = { tier = tier_kingdom }
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for keeping this nickname.',
    example: `is_valid = {
    is_alive = yes
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for selection among valid nicknames.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        martial >= 25
    }
}`,
  },

  // Localization
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the nickname.',
    example: 'name = "nickname_the_great"',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority when multiple nicknames are valid.',
    example: 'priority = 10',
  },

  // Requirements
  {
    name: 'gender',
    type: 'enum',
    description: 'Gender restriction for the nickname.',
    values: ['male', 'female', 'any'],
    example: 'gender = male',
  },
  {
    name: 'can_give_to_others',
    type: 'boolean',
    description: 'Whether this nickname can be given to others.',
    default: 'no',
    example: 'can_give_to_others = yes',
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to give this nickname.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const nicknameRuleSchemaMap = new Map<string, FieldSchema>(
  nicknameRuleSchema.map((field) => [field.name, field])
);

export function getNicknameRuleFieldNames(): string[] {
  return nicknameRuleSchema.map((field) => field.name);
}

export function getNicknameRuleFieldDocumentation(fieldName: string): string | undefined {
  const field = nicknameRuleSchemaMap.get(fieldName);
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
