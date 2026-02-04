/**
 * Schema definition for CK3 Holdings - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const HOLDING_TYPES = [
  'castle_holding',
  'city_holding',
  'church_holding',
  'tribal_holding',
] as const;

export const holdingSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'primary_building',
    type: 'string',
    description: 'The primary building type for this holding.',
    example: 'primary_building = castle_01',
  },
  {
    name: 'buildings',
    type: 'list',
    description: 'List of available building types for this holding.',
    example: `buildings = {
    castle_walls
    barracks
    stables
}`,
  },

  // Flags
  {
    name: 'can_be_inherited',
    type: 'boolean',
    description: 'Whether this holding can be inherited.',
    default: true,
    example: 'can_be_inherited = no',
  },

];

// Map for quick lookup
export const holdingSchemaMap = new Map<string, FieldSchema>(
  holdingSchema.map((field) => [field.name, field])
);

export function getHoldingFieldNames(): string[] {
  return holdingSchema.map((field) => field.name);
}

export function getHoldingFieldDocumentation(fieldName: string): string | undefined {
  const field = holdingSchemaMap.get(fieldName);
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
