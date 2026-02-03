/**
 * Schema definition for CK3 Static Modifiers - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const MODIFIER_TYPES = [
  'character',
  'province',
  'county',
  'title',
  'scheme',
  'travel',
  'activity',
] as const;

// Common modifier values that can be used
export const COMMON_MODIFIERS = [
  // Skills
  'diplomacy',
  'martial',
  'stewardship',
  'intrigue',
  'learning',
  'prowess',

  // Resources
  'monthly_income',
  'monthly_prestige',
  'monthly_piety',
  'monthly_dynasty_prestige',

  // Military
  'levy_size',
  'levy_reinforcement_rate',
  'garrison_size',
  'men_at_arms_maintenance',
  'knight_effectiveness_mult',
  'army_maintenance_mult',
  'supply_limit_mult',

  // Domain
  'domain_tax_mult',
  'domain_limit',
  'building_slot_add',
  'development_growth_factor',
  'build_speed',
  'build_gold_cost',

  // Opinion
  'general_opinion',
  'vassal_opinion',
  'same_religion_opinion',
  'different_religion_opinion',
  'attraction_opinion',
  'dynasty_opinion',

  // Combat
  'damage',
  'toughness',
  'pursuit',
  'screen',
  'advantage',

  // Stress
  'stress_gain_mult',
  'stress_loss_mult',

  // Health
  'health',
  'negate_health_penalty_add',
  'years_of_fertility',

  // Scheme
  'scheme_power_add',
  'scheme_secrecy_add',
  'hostile_scheme_power_add',
  'hostile_scheme_resistance_add',

  // Court
  'court_grandeur_baseline_add',
  'monthly_court_grandeur_change',
] as const;

export const modifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the modifier.',
    example: 'icon = "gfx/interface/icons/modifiers/my_modifier.dds"',
  },
  {
    name: 'stacking',
    type: 'boolean',
    description: 'Whether multiple instances of this modifier can stack.',
    default: true,
    example: 'stacking = no',
  },
  {
    name: 'hide_effects',
    type: 'boolean',
    description: 'Whether to hide the effects in tooltips.',
    default: false,
    example: 'hide_effects = yes',
  },

  // Character modifiers
  {
    name: 'diplomacy',
    type: 'integer',
    description: 'Bonus to diplomacy skill.',
    example: 'diplomacy = 2',
  },
  {
    name: 'martial',
    type: 'integer',
    description: 'Bonus to martial skill.',
    example: 'martial = 3',
  },
  {
    name: 'stewardship',
    type: 'integer',
    description: 'Bonus to stewardship skill.',
    example: 'stewardship = 2',
  },
  {
    name: 'intrigue',
    type: 'integer',
    description: 'Bonus to intrigue skill.',
    example: 'intrigue = 2',
  },
  {
    name: 'learning',
    type: 'integer',
    description: 'Bonus to learning skill.',
    example: 'learning = 2',
  },
  {
    name: 'prowess',
    type: 'integer',
    description: 'Bonus to prowess skill.',
    example: 'prowess = 4',
  },

  // Monthly resources
  {
    name: 'monthly_prestige',
    type: 'float',
    description: 'Monthly prestige gain.',
    example: 'monthly_prestige = 0.5',
  },
  {
    name: 'monthly_piety',
    type: 'float',
    description: 'Monthly piety gain.',
    example: 'monthly_piety = 0.3',
  },
  {
    name: 'monthly_income',
    type: 'float',
    description: 'Monthly gold income.',
    example: 'monthly_income = 1.0',
  },

  // Multipliers
  {
    name: 'levy_size',
    type: 'float',
    description: 'Levy size multiplier.',
    example: 'levy_size = 0.1',
  },
  {
    name: 'domain_tax_mult',
    type: 'float',
    description: 'Domain tax multiplier.',
    example: 'domain_tax_mult = 0.05',
  },
  {
    name: 'knight_effectiveness_mult',
    type: 'float',
    description: 'Knight effectiveness multiplier.',
    example: 'knight_effectiveness_mult = 0.15',
  },
  {
    name: 'men_at_arms_maintenance',
    type: 'float',
    description: 'Men-at-arms maintenance cost multiplier.',
    example: 'men_at_arms_maintenance = -0.1',
  },
  {
    name: 'development_growth_factor',
    type: 'float',
    description: 'Development growth factor.',
    example: 'development_growth_factor = 0.1',
  },

  // Opinion
  {
    name: 'general_opinion',
    type: 'integer',
    description: 'General opinion modifier.',
    example: 'general_opinion = 10',
  },
  {
    name: 'vassal_opinion',
    type: 'integer',
    description: 'Vassal opinion modifier.',
    example: 'vassal_opinion = 5',
  },
  {
    name: 'attraction_opinion',
    type: 'integer',
    description: 'Attraction opinion modifier.',
    example: 'attraction_opinion = 15',
  },

  // Health
  {
    name: 'health',
    type: 'float',
    description: 'Health modifier.',
    example: 'health = 0.5',
  },
  {
    name: 'stress_gain_mult',
    type: 'float',
    description: 'Stress gain multiplier.',
    example: 'stress_gain_mult = -0.2',
  },
  {
    name: 'fertility',
    type: 'float',
    description: 'Fertility modifier.',
    example: 'fertility = 0.1',
  },

  // Combat
  {
    name: 'advantage',
    type: 'integer',
    description: 'Advantage in combat.',
    example: 'advantage = 5',
  },
  {
    name: 'siege_phase_time',
    type: 'float',
    description: 'Siege phase time multiplier.',
    example: 'siege_phase_time = -0.1',
  },

  // Scheme
  {
    name: 'hostile_scheme_power_add',
    type: 'integer',
    description: 'Hostile scheme power bonus.',
    example: 'hostile_scheme_power_add = 10',
  },
  {
    name: 'hostile_scheme_resistance_add',
    type: 'integer',
    description: 'Hostile scheme resistance bonus.',
    example: 'hostile_scheme_resistance_add = 15',
  },

  // Domain
  {
    name: 'domain_limit',
    type: 'integer',
    description: 'Domain limit modifier.',
    example: 'domain_limit = 1',
  },
  {
    name: 'building_slot_add',
    type: 'integer',
    description: 'Additional building slots.',
    example: 'building_slot_add = 1',
  },

  // Wildcard: accept any valid modifier from the game's modifier database
  // This covers the hundreds of modifiers not explicitly listed above
  {
    name: '*',
    type: 'modifier',
    isWildcard: true,
    description: 'Any valid modifier from the game can be used in static modifier definitions.',
  },
];

// Map for quick lookup
export const modifierSchemaMap = new Map<string, FieldSchema>(
  modifierSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getModifierFieldNames(): string[] {
  return modifierSchema.map((field) => field.name);
}

// Get documentation for a field
export function getModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = modifierSchemaMap.get(fieldName);
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
