/**
 * Schema definition for CK3 Regiments - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const regimentSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'string',
    description: 'Men-at-arms type for this regiment.',
    example: 'type = heavy_infantry',
  },
  {
    name: 'men',
    type: 'integer',
    description: 'Number of men in the regiment.',
    example: 'men = 100',
  },

  // Owner
  {
    name: 'owner',
    type: 'string',
    description: 'Character or title owning this regiment.',
    example: 'owner = character:12345',
  },

  // Location
  {
    name: 'location',
    type: 'integer',
    description: 'Province ID where regiment is stationed.',
    example: 'location = 1234',
  },

  // Experience
  {
    name: 'experience',
    type: 'float',
    description: 'Experience level of the regiment.',
    example: 'experience = 0.5',
  },

  // Morale
  {
    name: 'morale',
    type: 'float',
    description: 'Current morale level.',
    example: 'morale = 1.0',
  },

  // Reinforcement
  {
    name: 'reinforcement_rate',
    type: 'float',
    description: 'Rate of reinforcement.',
    example: 'reinforcement_rate = 0.1',
  },

  // State
  {
    name: 'raised',
    type: 'boolean',
    description: 'Whether the regiment is raised.',
    default: false,
    example: 'raised = yes',
  },

  // Army
  {
    name: 'army',
    type: 'integer',
    description: 'Army ID this regiment belongs to.',
    example: 'army = 1',
  },
];

// Map for quick lookup
export const regimentSchemaMap = new Map<string, FieldSchema>(
  regimentSchema.map((field) => [field.name, field])
);

export function getRegimentFieldNames(): string[] {
  return regimentSchema.map((field) => field.name);
}

export function getRegimentFieldDocumentation(fieldName: string): string | undefined {
  const field = regimentSchemaMap.get(fieldName);
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
