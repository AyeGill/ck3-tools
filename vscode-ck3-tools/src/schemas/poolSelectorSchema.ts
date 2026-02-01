/**
 * Schema definition for CK3 Pool Character Selectors - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const poolSelectorSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'pool',
    type: 'enum',
    description: 'The character pool to select from.',
    values: ['courtier', 'guest', 'wanderer', 'generated'],
    example: 'pool = courtier',
  },
  {
    name: 'age',
    type: 'block',
    description: 'Age range for selected characters.',
    example: `age = {
    min = 16
    max = 40
}`,
  },
  {
    name: 'gender',
    type: 'enum',
    description: 'Gender filter.',
    values: ['male', 'female', 'any'],
    example: 'gender = female',
  },

  // Filters
  {
    name: 'filter',
    type: 'trigger',
    description: 'Filter conditions for character selection.',
    example: `filter = {
    is_adult = yes
    NOT = { has_trait = incapable }
}`,
  },
  {
    name: 'religion',
    type: 'string',
    description: 'Religion filter.',
    example: 'religion = catholic',
  },
  {
    name: 'culture',
    type: 'string',
    description: 'Culture filter.',
    example: 'culture = french',
  },
  {
    name: 'faith',
    type: 'string',
    description: 'Faith filter.',
    example: 'faith = faith:catholic',
  },

  // Weights
  {
    name: 'weight',
    type: 'block',
    description: 'Selection weight calculation.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        has_trait = genius
    }
}`,
  },

  // Generation
  {
    name: 'template',
    type: 'string',
    description: 'Character template for generation.',
    example: 'template = "generic_knight_template"',
  },
  {
    name: 'create_if_none',
    type: 'boolean',
    description: 'Create a character if none match.',
    default: false,
    example: 'create_if_none = yes',
  },

  // Limits
  {
    name: 'count',
    type: 'block',
    description: 'Number of characters to select.',
    example: `count = {
    min = 1
    max = 3
}`,
  },
];

// Map for quick lookup
export const poolSelectorSchemaMap = new Map<string, FieldSchema>(
  poolSelectorSchema.map((field) => [field.name, field])
);

export function getPoolSelectorFieldNames(): string[] {
  return poolSelectorSchema.map((field) => field.name);
}

export function getPoolSelectorFieldDocumentation(fieldName: string): string | undefined {
  const field = poolSelectorSchemaMap.get(fieldName);
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
