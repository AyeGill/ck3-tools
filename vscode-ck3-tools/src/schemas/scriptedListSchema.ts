/**
 * Schema definition for CK3 Scripted Lists - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const scriptedListSchema: FieldSchema[] = [
  // List building
  {
    name: 'add',
    type: 'block',
    description: 'Add elements to the list.',
    example: `add = {
    trait:brave
    trait:just
    trait:honest
}`,
  },
  {
    name: 'remove',
    type: 'block',
    description: 'Remove elements from the list.',
    example: `remove = {
    trait:craven
}`,
  },

  // Conditional add
  {
    name: 'add_if',
    type: 'block',
    description: 'Conditionally add elements.',
    example: `add_if = {
    limit = {
        has_dlc = "Royal Court"
    }
    trait:court_grandeur_1
}`,
  },

  // Include other lists
  {
    name: 'include',
    type: 'string',
    description: 'Include another scripted list.',
    example: 'include = base_personality_traits',
  },

  // Random
  {
    name: 'random',
    type: 'block',
    description: 'Randomly select from elements.',
    example: `random = {
    trait:brave
    trait:craven
    trait:calm
}`,
  },
];

// Map for quick lookup
export const scriptedListSchemaMap = new Map<string, FieldSchema>(
  scriptedListSchema.map((field) => [field.name, field])
);

export function getScriptedListFieldNames(): string[] {
  return scriptedListSchema.map((field) => field.name);
}

export function getScriptedListFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedListSchemaMap.get(fieldName);
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
