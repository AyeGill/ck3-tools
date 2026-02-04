/**
 * Schema definition for CK3 Death Reasons - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const deathreasonsSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this death reason.',
    example: 'icon = "gfx/interface/icons/death_reasons/death_natural.dds"',
  },
  {
    name: 'default',
    type: 'boolean',
    description: 'Whether this is the default death reason.',
    default: false,
    example: 'default = yes',
  },
  {
    name: 'natural',
    type: 'boolean',
    description: 'Whether this is a natural death.',
    default: false,
    example: 'natural = yes',
  },
  {
    name: 'killer_claim',
    type: 'boolean',
    description: 'Whether the killer gets a claim.',
    default: false,
    example: 'killer_claim = yes',
  },
  {
    name: 'public_knowledge',
    type: 'boolean',
    description: 'Whether the death reason is public knowledge.',
    default: true,
    example: 'public_knowledge = no',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority for death reason selection.',
    example: 'priority = 100',
  },

  // Conditions
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for this death reason to be valid.',
    example: `is_valid = {
    has_trait = disease
}`,
  },
];

// Map for quick lookup
export const deathreasonsSchemaMap = new Map<string, FieldSchema>(
  deathreasonsSchema.map((field) => [field.name, field])
);

export function getDeathreasonsFieldNames(): string[] {
  return deathreasonsSchema.map((field) => field.name);
}

export function getDeathreasonsFieldDocumentation(fieldName: string): string | undefined {
  const field = deathreasonsSchemaMap.get(fieldName);
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
