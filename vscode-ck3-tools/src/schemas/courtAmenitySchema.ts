/**
 * Schema definition for CK3 Court Amenities - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const AMENITY_TYPES = [
  'court_lodging',
  'court_food',
  'court_fashion',
  'court_servants',
] as const;

export const courtAmenitySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'enum',
    description: 'Type of court amenity.',
    values: [...AMENITY_TYPES],
    example: 'type = court_lodging',
  },
  {
    name: 'default',
    type: 'boolean',
    description: 'Whether this is the default setting.',
    default: false,
    example: 'default = yes',
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Cost to maintain this amenity level.',
    example: `cost = {
    gold = {
        value = 2
        multiply = court_grandeur_level
    }
}`,
  },

  // Requirements
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the amenity option to be shown.',
    example: `is_shown = {
    has_royal_court = yes
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the amenity option to be available.',
    example: `is_valid = {
    gold >= 10
}`,
  },

  // Effects
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied to the court owner.',
    example: `owner_modifier = {
    monthly_prestige = 0.5
}`,
  },
  {
    name: 'courtier_guest_modifier',
    type: 'block',
    description: 'Modifiers applied to courtiers and guests.',
    example: `courtier_guest_modifier = {
    opinion = 10
}`,
  },
  {
    name: 'court_grandeur_contribution',
    type: 'block',
    description: 'Contribution to court grandeur.',
    example: `court_grandeur_contribution = {
    base = 5
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to select this amenity level.',
    example: `ai_will_do = {
    base = 100
    modifier = {
        add = -50
        gold < 50
    }
}`,
  },
];

// Map for quick lookup
export const courtAmenitySchemaMap = new Map<string, FieldSchema>(
  courtAmenitySchema.map((field) => [field.name, field])
);

export function getCourtAmenityFieldNames(): string[] {
  return courtAmenitySchema.map((field) => field.name);
}

export function getCourtAmenityFieldDocumentation(fieldName: string): string | undefined {
  const field = courtAmenitySchemaMap.get(fieldName);
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
