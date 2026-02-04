/**
 * Schema definition for CK3 Opinion Modifiers - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const opinionModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'opinion',
    type: 'integer',
    description: 'The opinion value (positive or negative).',
    example: 'opinion = 20',
  },
  {
    name: 'decaying',
    type: 'boolean',
    description: 'Whether the modifier decays over time.',
    default: false,
    example: 'decaying = yes',
  },
  {
    name: 'growing',
    type: 'boolean',
    description: 'Whether the modifier grows over time (opposite of decaying).',
    default: false,
    example: 'growing = yes',
  },
  {
    name: 'monthly_change',
    type: 'float',
    description: 'How much the modifier value changes each month (positive number). Used with decaying/growing.',
    example: 'monthly_change = 0.1',
  },
  {
    name: 'years',
    type: 'integer',
    description: 'Duration in years (if not permanent).',
    example: 'years = 10',
  },
  {
    name: 'months',
    type: 'integer',
    description: 'Duration in months (if not permanent).',
    example: 'months = 6',
  },
  {
    name: 'days',
    type: 'integer',
    description: 'Duration in days (if not permanent).',
    example: 'days = 30',
  },

  // Stacking
  {
    name: 'stacking',
    type: 'boolean',
    description: 'Whether multiple instances can stack.',
    default: false,
    example: 'stacking = yes',
  },
  {
    name: 'min',
    type: 'integer',
    description: 'Modifier value cannot be lower than this value.',
    example: 'min = -100',
  },
  {
    name: 'max',
    type: 'integer',
    description: 'Modifier value cannot be higher than this value.',
    example: 'max = 100',
  },

  // Punishment Reasons
  {
    name: 'imprisonment_reason',
    type: 'boolean',
    description: 'Gives the character an imprisonment reason on the target.',
    default: false,
    example: 'imprisonment_reason = yes',
  },
  {
    name: 'banish_reason',
    type: 'boolean',
    description: 'Gives the character a banishment reason on the target.',
    default: false,
    example: 'banish_reason = yes',
  },
  {
    name: 'execute_reason',
    type: 'boolean',
    description: 'Gives the character an execution reason on the target.',
    default: false,
    example: 'execute_reason = yes',
  },
  {
    name: 'revoke_title_reason',
    type: 'boolean',
    description: 'Gives the character a title revocation reason on the target.',
    default: false,
    example: 'revoke_title_reason = yes',
  },
  {
    name: 'divorce_reason',
    type: 'boolean',
    description: 'Gives the character a reason to divorce the target.',
    default: false,
    example: 'divorce_reason = yes',
  },

  // Mechanical Effects
  {
    name: 'obedient',
    type: 'boolean',
    description: 'Makes the character obedient to the opinion target for the duration. Both characters must use Obedience.',
    default: false,
    example: 'obedient = yes',
  },
];

// Map for quick lookup
export const opinionModifierSchemaMap = new Map<string, FieldSchema>(
  opinionModifierSchema.map((field) => [field.name, field])
);

export function getOpinionModifierFieldNames(): string[] {
  return opinionModifierSchema.map((field) => field.name);
}

export function getOpinionModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = opinionModifierSchemaMap.get(fieldName);
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
