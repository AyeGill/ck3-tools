/**
 * Schema definition for CK3 Epidemics - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const epidemicSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'trait',
    type: 'string',
    description: 'The disease trait applied by this epidemic.',
    example: 'trait = bubonic_plague',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the epidemic.',
    example: 'icon = "gfx/interface/icons/epidemics/plague.dds"',
  },

  // Spread
  {
    name: 'spread_speed',
    type: 'float',
    description: 'Base speed of epidemic spread.',
    example: 'spread_speed = 1.0',
  },
  {
    name: 'spread_chance',
    type: 'block',
    description: 'Chance for the epidemic to spread.',
    example: `spread_chance = {
    base = 0.5
    modifier = {
        add = 0.2
        development_level >= 20
    }
}`,
  },
  {
    name: 'spread_through_water',
    type: 'boolean',
    description: 'Whether the epidemic spreads through water.',
    default: true,
    example: 'spread_through_water = yes',
  },
  {
    name: 'spread_through_land',
    type: 'boolean',
    description: 'Whether the epidemic spreads through land routes.',
    default: true,
    example: 'spread_through_land = yes',
  },

  // Duration
  {
    name: 'duration',
    type: 'block',
    description: 'Duration of the epidemic in a province.',
    example: `duration = {
    months = 12
}`,
  },

  // Effects
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to affected provinces.',
    example: `province_modifier = {
    tax_mult = -0.3
    levy_size = -0.5
}`,
  },
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to affected counties.',
    example: `county_modifier = {
    development_growth_factor = -0.5
}`,
  },

  // Infection
  {
    name: 'infection_chance',
    type: 'block',
    description: 'Chance for characters to become infected.',
    example: `infection_chance = {
    base = 0.1
    modifier = {
        add = -0.05
        has_trait = robust
    }
}`,
  },
  {
    name: 'mortality_rate',
    type: 'block',
    description: 'Death rate for infected characters.',
    example: `mortality_rate = {
    base = 0.3
    modifier = {
        add = -0.1
        has_court_physician_trigger = yes
    }
}`,
  },

  // Triggers
  {
    name: 'can_spread_to',
    type: 'trigger',
    description: 'Conditions for spreading to a province.',
    example: `can_spread_to = {
    NOT = { has_province_modifier = quarantine }
}`,
  },
  {
    name: 'can_infect',
    type: 'trigger',
    description: 'Conditions for infecting a character.',
    example: `can_infect = {
    is_alive = yes
    NOT = { has_trait = immune_to_disease }
}`,
  },

  // On actions
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when the epidemic starts in a province.',
    example: `on_start = {
    set_variable = { name = epidemic_start_date value = current_date }
}`,
  },
  {
    name: 'on_end',
    type: 'effect',
    description: 'Effects when the epidemic ends in a province.',
    example: `on_end = {
    remove_province_modifier = epidemic_panic
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI evaluation for epidemic responses.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const epidemicSchemaMap = new Map<string, FieldSchema>(
  epidemicSchema.map((field) => [field.name, field])
);

export function getEpidemicFieldNames(): string[] {
  return epidemicSchema.map((field) => field.name);
}

export function getEpidemicFieldDocumentation(fieldName: string): string | undefined {
  const field = epidemicSchemaMap.get(fieldName);
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
