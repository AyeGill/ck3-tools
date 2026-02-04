/**
 * Schema definition for CK3 County Culture - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const countyCultureSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'culture',
    type: 'string',
    description: 'The culture of this county.',
    example: 'culture = english',
  },
  {
    name: 'faith',
    type: 'string',
    description: 'The faith of this county.',
    example: 'faith = catholic',
  },

  // Date-based Changes
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects to apply at this date.',
    example: `effect = {
    set_county_culture = norman
}`,
  },

  // Development
  {
    name: 'development_level',
    type: 'integer',
    description: 'Starting development level.',
    example: 'development_level = 15',
  },

  // Holdings
  {
    name: 'holding',
    type: 'string',
    description: 'Holding type for the county capital.',
    example: 'holding = castle_holding',
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Modifiers applied to the county.',
    example: `modifier = {
    county_opinion_add = 10
}`,
  },
];

// Map for quick lookup
export const countyCultureSchemaMap = new Map<string, FieldSchema>(
  countyCultureSchema.map((field) => [field.name, field])
);

export function getCountyCultureFieldNames(): string[] {
  return countyCultureSchema.map((field) => field.name);
}

export function getCountyCultureFieldDocumentation(fieldName: string): string | undefined {
  const field = countyCultureSchemaMap.get(fieldName);
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
