/**
 * Schema definition for CK3 Doctrines - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const DOCTRINE_GROUPS = [
  'main_group',
  'marriage_doctrines',
  'crimes_group',
  'clergy_group',
  'special_doctrines',
] as const;

export const doctrineSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'group',
    type: 'string',
    description: 'The doctrine group this doctrine belongs to.',
    example: 'group = "marriage_doctrines"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the doctrine.',
    example: 'icon = "gfx/interface/icons/faith_doctrines/doctrine_example.dds"',
  },
  {
    name: 'visible',
    type: 'boolean',
    description: 'Whether the doctrine is visible in the interface.',
    default: true,
    example: 'visible = no',
  },

  // Piety Cost
  {
    name: 'piety_cost',
    type: 'block',
    description: 'Piety cost to adopt this doctrine.',
    example: `piety_cost = {
    value = 500
    if = {
        limit = { has_doctrine = doctrine_polygamy }
        add = 500
    }
}`,
  },

  // Conditions
  {
    name: 'can_pick',
    type: 'trigger',
    description: 'Conditions for selecting this doctrine when creating/reforming a faith.',
    example: `can_pick = {
    NOT = { has_doctrine = doctrine_polygamy }
}`,
  },
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for this doctrine to be visible.',
    example: `is_shown = {
    always = yes
}`,
  },

  // Parameters
  {
    name: 'parameters',
    type: 'block',
    description: 'Faith parameters set by this doctrine.',
    example: `parameters = {
    hostility_override = faith_astray
    pluralism_fundamentalist = yes
}`,
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters of faiths with this doctrine.',
    example: `character_modifier = {
    clergy_opinion = 10
    monthly_piety_gain_mult = 0.1
}`,
  },

  // Traits
  {
    name: 'traits',
    type: 'block',
    description: 'Virtue/sin trait modifications.',
    example: `traits = {
    virtues = { brave just temperate }
    sins = { craven arbitrary gluttonous }
}`,
  },
  {
    name: 'virtues',
    type: 'list',
    description: 'Traits considered virtues by this doctrine.',
    example: 'virtues = { brave just temperate }',
  },
  {
    name: 'sins',
    type: 'list',
    description: 'Traits considered sins by this doctrine.',
    example: 'sins = { craven arbitrary gluttonous }',
  },

  // Clergy
  {
    name: 'number_of_spouses',
    type: 'integer',
    description: 'Number of spouses allowed.',
    example: 'number_of_spouses = 4',
  },
  {
    name: 'number_of_consorts',
    type: 'integer',
    description: 'Number of consorts/concubines allowed.',
    example: 'number_of_consorts = 3',
  },
];

// Schema for doctrine groups
export const doctrineGroupSchema: FieldSchema[] = [
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the group name.',
    example: 'name = doctrine_group_example',
  },
  {
    name: 'number_of_picks',
    type: 'integer',
    description: 'Number of doctrines that must be picked from this group.',
    example: 'number_of_picks = 1',
  },
];

// Map for quick lookup
export const doctrineSchemaMap = new Map<string, FieldSchema>(
  doctrineSchema.map((field) => [field.name, field])
);

export const doctrineGroupSchemaMap = new Map<string, FieldSchema>(
  doctrineGroupSchema.map((field) => [field.name, field])
);

export function getDoctrineFieldNames(): string[] {
  return doctrineSchema.map((field) => field.name);
}

export function getDoctrineFieldDocumentation(fieldName: string): string | undefined {
  const field = doctrineSchemaMap.get(fieldName);
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
