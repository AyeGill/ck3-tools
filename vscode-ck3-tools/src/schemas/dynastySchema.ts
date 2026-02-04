/**
 * Schema definition for CK3 Dynasties and Dynasty Houses - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const dynastySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the dynasty name.',
    example: 'name = "dynn_Karling"',
  },
  {
    name: 'prefix',
    type: 'string',
    description: 'Localization key for the dynasty prefix.',
    example: 'prefix = "dynnp_von"',
  },
  {
    name: 'culture',
    type: 'string',
    description: 'Default culture for this dynasty.',
    example: 'culture = french',
  },
  {
    name: 'motto',
    type: 'string',
    description: 'Localization key for the dynasty motto.',
    example: 'motto = "motto_karling"',
  },
  {
    name: 'forced_coa_religiongroup',
    type: 'string',
    description: 'Force coat of arms style based on religion group.',
    example: 'forced_coa_religiongroup = "christian"',
  },
];

export const dynastyHouseSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the house name.',
    example: 'name = "house_capet"',
  },
  {
    name: 'prefix',
    type: 'string',
    description: 'Localization key for the house prefix.',
    example: 'prefix = "dynnp_de"',
  },
  {
    name: 'dynasty',
    type: 'string',
    description: 'Parent dynasty ID.',
    example: 'dynasty = 25',
  },
  {
    name: 'motto',
    type: 'string',
    description: 'Localization key for the house motto.',
    example: 'motto = "motto_capet"',
  },
];

// Map for quick lookup
export const dynastySchemaMap = new Map<string, FieldSchema>(
  dynastySchema.map((field) => [field.name, field])
);

export const dynastyHouseSchemaMap = new Map<string, FieldSchema>(
  dynastyHouseSchema.map((field) => [field.name, field])
);

export function getDynastyFieldNames(): string[] {
  return dynastySchema.map((field) => field.name);
}

export function getDynastyFieldDocumentation(fieldName: string): string | undefined {
  const field = dynastySchemaMap.get(fieldName);
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
