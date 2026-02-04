/**
 * Schema definition for CK3 Game Concepts - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const gameConceptSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'alias',
    type: 'list',
    description: 'Alternative names that link to this concept.',
    example: `alias = {
    "gold"
    "wealth"
    "money"
}`,
  },
  {
    name: 'parent',
    type: 'string',
    description: 'Parent concept for hierarchical organization.',
    example: 'parent = "resources"',
  },
  {
    name: 'texture',
    type: 'string',
    description: 'Icon texture for the concept.',
    example: 'texture = "gfx/interface/icons/game_concepts/gold.dds"',
  },
  {
    name: 'framesize',
    type: 'block',
    description: 'Frame size for the icon.',
    example: 'framesize = { 60 60 }',
  },
  {
    name: 'frame',
    type: 'integer',
    description: 'Frame index in the texture.',
    example: 'frame = 1',
  },

  // Requires DLC
  {
    name: 'requires_dlc_flag',
    type: 'string',
    description: 'DLC flag required for this concept.',
    example: 'requires_dlc_flag = "royal_court"',
  },

  // Not Shown
  {
    name: 'not_shown_in_encyclopedia',
    type: 'boolean',
    description: 'Hide from the encyclopedia.',
    default: false,
    example: 'not_shown_in_encyclopedia = yes',
  },
];

// Map for quick lookup
export const gameConceptSchemaMap = new Map<string, FieldSchema>(
  gameConceptSchema.map((field) => [field.name, field])
);

export function getGameConceptFieldNames(): string[] {
  return gameConceptSchema.map((field) => field.name);
}

export function getGameConceptFieldDocumentation(fieldName: string): string | undefined {
  const field = gameConceptSchemaMap.get(fieldName);
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
