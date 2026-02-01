/**
 * Schema definition for CK3 Governments - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const GOVERNMENT_TYPES = [
  'feudal_government',
  'clan_government',
  'tribal_government',
  'republic_government',
  'theocracy_government',
  'mercenary_company',
  'holy_order',
] as const;

export const governmentSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'create_cadet_branches',
    type: 'boolean',
    description: 'Whether rulers can create cadet branches.',
    default: true,
    example: 'create_cadet_branches = yes',
  },
  {
    name: 'rulers_should_have_dynasty',
    type: 'boolean',
    description: 'Whether rulers should have a dynasty.',
    default: true,
    example: 'rulers_should_have_dynasty = yes',
  },
  {
    name: 'dynasty_named_realms',
    type: 'boolean',
    description: 'Whether realms are named after dynasties.',
    default: false,
    example: 'dynasty_named_realms = yes',
  },
  {
    name: 'royal_court',
    type: 'boolean',
    description: 'Whether this government has royal courts.',
    default: true,
    example: 'royal_court = yes',
  },
  {
    name: 'council',
    type: 'boolean',
    description: 'Whether this government has a council.',
    default: true,
    example: 'council = yes',
  },
  {
    name: 'fallback',
    type: 'integer',
    description: 'Fallback priority (lower = more preferred).',
    example: 'fallback = 1',
  },
  {
    name: 'primary_holding',
    type: 'string',
    description: 'The primary holding type for this government.',
    example: 'primary_holding = castle_holding',
  },
  {
    name: 'required_county_holdings',
    type: 'list',
    description: 'Holdings required in counties.',
    example: `required_county_holdings = {
    castle_holding
    city_holding
}`,
  },
  {
    name: 'valid_holdings',
    type: 'list',
    description: 'Holdings this government can use.',
    example: `valid_holdings = {
    castle_holding
    city_holding
    church_holding
}`,
  },

  // Conditions
  {
    name: 'can_get_government',
    type: 'trigger',
    description: 'Conditions for a character to get this government.',
    example: `can_get_government = {
    is_adult = yes
    is_landed = yes
}`,
  },
  {
    name: 'can_hold_other_titles',
    type: 'boolean',
    description: 'Whether rulers can hold non-primary titles.',
    default: true,
    example: 'can_hold_other_titles = no',
  },

  // Vassal Management
  {
    name: 'vassal_limit',
    type: 'integer',
    description: 'Base vassal limit.',
    example: 'vassal_limit = 20',
  },
  {
    name: 'vassal_contract',
    type: 'string',
    description: 'Default vassal contract type.',
    example: 'vassal_contract = feudal_contract',
  },
  {
    name: 'tax_slot_type',
    type: 'string',
    description: 'Type of tax slot used.',
    example: 'tax_slot_type = feudal_tax_slot',
  },

  // Combat/Military
  {
    name: 'supply_limit_mult',
    type: 'float',
    description: 'Multiplier to supply limits.',
    example: 'supply_limit_mult = 1.0',
  },
  {
    name: 'prestige_opinion_override',
    type: 'block',
    description: 'Override prestige-based opinion.',
    example: `prestige_opinion_override = {
    once = yes
}`,
  },

  // Flags
  {
    name: 'flag',
    type: 'string',
    description: 'Government flag for triggers.',
    example: 'flag = government_is_feudal',
  },

  // Character Modifier
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to rulers.',
    example: `character_modifier = {
    domain_limit = 2
}`,
  },

  // AI
  {
    name: 'ai_primary_priority',
    type: 'block',
    description: 'AI priority calculation.',
    example: `ai_primary_priority = {
    base = 100
}`,
  },
  {
    name: 'house_unity',
    type: 'string',
    description: 'House unity rules for clans.',
    example: 'house_unity = clan_house_unity',
  },
];

// Map for quick lookup
export const governmentSchemaMap = new Map<string, FieldSchema>(
  governmentSchema.map((field) => [field.name, field])
);

export function getGovernmentFieldNames(): string[] {
  return governmentSchema.map((field) => field.name);
}

export function getGovernmentFieldDocumentation(fieldName: string): string | undefined {
  const field = governmentSchemaMap.get(fieldName);
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
