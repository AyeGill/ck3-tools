/**
 * Schema definition for CK3 Scripted Tests - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const scriptedTestSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the test.',
    example: 'name = "test_character_creation"',
  },

  // Setup
  {
    name: 'setup',
    type: 'effect',
    description: 'Effects to run before the test.',
    example: `setup = {
    create_character = {
        name = "Test Character"
    }
}`,
  },

  // Test
  {
    name: 'test',
    type: 'trigger',
    description: 'The test condition to verify.',
    example: `test = {
    any_character = {
        has_trait = brave
    }
}`,
  },

  // Cleanup
  {
    name: 'cleanup',
    type: 'effect',
    description: 'Effects to run after the test.',
    example: `cleanup = {
    every_character = {
        limit = { is_test_character = yes }
        death = natural
    }
}`,
  },

  // Tags
  {
    name: 'tags',
    type: 'list',
    description: 'Tags for categorizing tests.',
    example: `tags = {
    "character"
    "trait"
    "unit_test"
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Run order priority.',
    example: 'priority = 100',
  },

  // Expected Result
  {
    name: 'expected_result',
    type: 'boolean',
    description: 'Expected test result.',
    default: true,
    example: 'expected_result = yes',
  },
];

// Map for quick lookup
export const scriptedTestSchemaMap = new Map<string, FieldSchema>(
  scriptedTestSchema.map((field) => [field.name, field])
);

export function getScriptedTestFieldNames(): string[] {
  return scriptedTestSchema.map((field) => field.name);
}

export function getScriptedTestFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedTestSchemaMap.get(fieldName);
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
