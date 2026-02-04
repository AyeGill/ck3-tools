/**
 * Schema definition for CK3 Nicknames - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const nicknameSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'is_prefix',
    type: 'boolean',
    description: 'Whether the nickname appears before the name.',
    default: false,
    example: 'is_prefix = yes',
  },
  {
    name: 'is_bad',
    type: 'boolean',
    description: 'Whether this is a negative/shameful nickname.',
    default: false,
    example: 'is_bad = yes',
  },
];

// Map for quick lookup
export const nicknameSchemaMap = new Map<string, FieldSchema>(
  nicknameSchema.map((field) => [field.name, field])
);

export function getNicknameFieldNames(): string[] {
  return nicknameSchema.map((field) => field.name);
}

export function getNicknameFieldDocumentation(fieldName: string): string | undefined {
  const field = nicknameSchemaMap.get(fieldName);
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
