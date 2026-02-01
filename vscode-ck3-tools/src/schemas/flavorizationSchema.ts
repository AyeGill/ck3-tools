/**
 * Schema definition for CK3 Flavorization - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const FLAVORIZATION_TYPES = [
  'character',
  'title',
  'province',
  'faith',
  'culture',
] as const;

export const FLAVORIZATION_PRIORITY = [
  '1',
  '10',
  '20',
  '50',
  '100',
  '1000',
] as const;

export const flavorizationSchema: FieldSchema[] = [
  // Type and Priority
  {
    name: 'type',
    type: 'enum',
    description: 'The scope type this flavorization applies to.',
    values: [...FLAVORIZATION_TYPES],
    example: 'type = character',
  },
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority for flavorization selection (higher = more important).',
    example: 'priority = 100',
  },

  // Conditions
  {
    name: 'gender',
    type: 'enum',
    description: 'Gender requirement.',
    values: ['male', 'female'],
    example: 'gender = female',
  },
  {
    name: 'special',
    type: 'enum',
    description: 'Special type of flavorization.',
    values: ['holder', 'ruler', 'liege', 'councillor', 'head_of_faith'],
    example: 'special = ruler',
  },
  {
    name: 'tier',
    type: 'enum',
    description: 'Title tier requirement.',
    values: ['baron', 'count', 'duke', 'king', 'emperor'],
    example: 'tier = king',
  },
  {
    name: 'council_position',
    type: 'enum',
    description: 'Council position requirement.',
    values: ['councillor_chancellor', 'councillor_marshal', 'councillor_steward', 'councillor_spymaster', 'councillor_court_chaplain'],
    example: 'council_position = councillor_chancellor',
  },
  {
    name: 'top_liege',
    type: 'boolean',
    description: 'Require being a top liege.',
    default: false,
    example: 'top_liege = yes',
  },
  {
    name: 'only_independent',
    type: 'boolean',
    description: 'Require being independent.',
    default: false,
    example: 'only_independent = yes',
  },
  {
    name: 'only_holder',
    type: 'boolean',
    description: 'Only apply to title holders.',
    default: false,
    example: 'only_holder = yes',
  },

  // Scope filters
  {
    name: 'governments',
    type: 'list',
    description: 'Government types this applies to.',
    example: 'governments = { feudal_government clan_government }',
  },
  {
    name: 'religions',
    type: 'list',
    description: 'Religions this applies to.',
    example: 'religions = { religion:christianity_religion }',
  },
  {
    name: 'faiths',
    type: 'list',
    description: 'Faiths this applies to.',
    example: 'faiths = { faith:catholic faith:orthodox }',
  },
  {
    name: 'cultures',
    type: 'list',
    description: 'Cultures this applies to.',
    example: 'cultures = { culture:french culture:norman }',
  },
  {
    name: 'heritages',
    type: 'list',
    description: 'Cultural heritages this applies to.',
    example: 'heritages = { heritage_west_germanic }',
  },
  {
    name: 'titles',
    type: 'list',
    description: 'Specific titles this applies to.',
    example: 'titles = { k_france e_hre }',
  },
  {
    name: 'de_jure_liege',
    type: 'string',
    description: 'De jure liege title requirement.',
    example: 'de_jure_liege = e_hre',
  },

  // Name
  {
    name: 'name',
    type: 'string',
    description: 'Localization key prefix for the name.',
    example: 'name = "FLAV_KAISER"',
  },
  {
    name: 'prefix',
    type: 'boolean',
    description: 'Whether this is a prefix.',
    default: false,
    example: 'prefix = yes',
  },
  {
    name: 'suffix',
    type: 'boolean',
    description: 'Whether this is a suffix.',
    default: false,
    example: 'suffix = yes',
  },
];

// Map for quick lookup
export const flavorizationSchemaMap = new Map<string, FieldSchema>(
  flavorizationSchema.map((field) => [field.name, field])
);

export function getFlavorizationFieldNames(): string[] {
  return flavorizationSchema.map((field) => field.name);
}

export function getFlavorizationFieldDocumentation(fieldName: string): string | undefined {
  const field = flavorizationSchemaMap.get(fieldName);
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
