/**
 * Schema definition for CK3 Great Projects (Special Buildings) - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const greatProjectSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'type',
    type: 'enum',
    description: 'Type of great project.',
    values: ['wonder', 'special_building'],
    example: 'type = wonder',
  },
  {
    name: 'construction_time',
    type: 'integer',
    description: 'Time to construct in days.',
    example: 'construction_time = 3650',
  },

  // Location
  {
    name: 'province',
    type: 'integer',
    description: 'Province ID where the project is located.',
    example: 'province = 1234',
  },
  {
    name: 'county',
    type: 'string',
    description: 'County where the project can be built.',
    example: 'county = c_rome',
  },
  {
    name: 'barony',
    type: 'string',
    description: 'Barony where the project is located.',
    example: 'barony = b_roma',
  },

  // Costs
  {
    name: 'build_cost',
    type: 'block',
    description: 'Cost to build the project.',
    example: `build_cost = {
    gold = 2000
    prestige = 500
}`,
  },
  {
    name: 'upgrade_cost',
    type: 'block',
    description: 'Cost to upgrade the project.',
    example: `upgrade_cost = {
    gold = 1000
}`,
  },

  // Requirements
  {
    name: 'can_construct',
    type: 'trigger',
    description: 'Conditions for constructing the project.',
    example: `can_construct = {
    holder = {
        gold >= 1000
        prestige >= 500
    }
}`,
  },
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the project to be shown.',
    example: `is_shown = {
    always = yes
}`,
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to the holder.',
    example: `character_modifier = {
    monthly_prestige = 1.0
    diplomacy = 2
}`,
  },
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers applied to the province.',
    example: `province_modifier = {
    tax_mult = 0.2
    levy_size = 0.1
}`,
  },
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to the county.',
    example: `county_modifier = {
    development_growth_factor = 0.1
}`,
  },

  // Tiers
  {
    name: 'tiers',
    type: 'block',
    description: 'Define upgrade tiers for the project.',
    example: `tiers = {
    tier_1 = {
        character_modifier = { monthly_prestige = 0.5 }
    }
    tier_2 = {
        character_modifier = { monthly_prestige = 1.0 }
    }
}`,
  },

  // Graphics
  {
    name: 'asset',
    type: 'string',
    description: 'Visual asset for the project.',
    example: 'asset = "special_building_colosseum"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the project.',
    example: 'icon = "gfx/interface/icons/great_projects/colosseum.dds"',
  },

  // On actions
  {
    name: 'on_complete',
    type: 'effect',
    description: 'Effects when construction completes.',
    example: `on_complete = {
    add_prestige = 500
    trigger_event = wonder_events.001
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to build this project.',
    example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        gold >= 3000
    }
}`,
  },
];

// Map for quick lookup
export const greatProjectSchemaMap = new Map<string, FieldSchema>(
  greatProjectSchema.map((field) => [field.name, field])
);

export function getGreatProjectFieldNames(): string[] {
  return greatProjectSchema.map((field) => field.name);
}

export function getGreatProjectFieldDocumentation(fieldName: string): string | undefined {
  const field = greatProjectSchemaMap.get(fieldName);
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
