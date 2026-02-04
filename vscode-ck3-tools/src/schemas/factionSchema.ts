/**
 * Schema definition for CK3 Factions - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const FACTION_TYPES = [
  'independence_faction',
  'liberty_faction',
  'populist_faction',
  'claimant_faction',
  'dissolution_faction',
] as const;

export const factionSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'casus_belli',
    type: 'string',
    description: 'The casus belli used when the faction presses demands.',
    example: 'casus_belli = independence_faction_war',
  },
  {
    name: 'sort_order',
    type: 'integer',
    description: 'Order in the faction list UI.',
    example: 'sort_order = 1',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for faction name.',
    example: 'name = FACTION_INDEPENDENCE_NAME',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Localization key for faction description.',
    example: 'description = FACTION_INDEPENDENCE_DESC',
  },
  {
    name: 'short_effect_desc',
    type: 'string',
    description: 'Short description of faction effect.',
    example: 'short_effect_desc = FACTION_INDEPENDENCE_SHORT_EFFECT',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the faction.',
    example: 'icon = "gfx/interface/icons/factions/independence.dds"',
  },

  // Power Calculation
  {
    name: 'power_threshold',
    type: 'float',
    description: 'Military power threshold to press demands (as ratio to liege).',
    default: 0.8,
    example: 'power_threshold = 0.8',
  },
  {
    name: 'leaders_allowed_to_join',
    type: 'boolean',
    description: 'Whether faction leaders can join other factions.',
    default: false,
    example: 'leaders_allowed_to_join = no',
  },
  {
    name: 'character_allow_join',
    type: 'boolean',
    description: 'Whether characters can freely join.',
    default: true,
    example: 'character_allow_join = yes',
  },

  // Conditions
  {
    name: 'can_create',
    type: 'trigger',
    description: 'Conditions to create this faction type.',
    example: `can_create = {
    is_landed = yes
    is_independent_ruler = no
}`,
  },
  {
    name: 'can_join',
    type: 'trigger',
    description: 'Conditions to join this faction.',
    example: `can_join = {
    NOT = { this = scope:faction.faction_leader }
    is_imprisoned = no
}`,
  },
  {
    name: 'can_create_if_vassals',
    type: 'boolean',
    description: 'Can only create if there are valid vassals.',
    default: true,
    example: 'can_create_if_vassals = yes',
  },

  // Target
  {
    name: 'valid_target',
    type: 'trigger',
    description: 'Conditions for a valid faction target.',
    example: `valid_target = {
    scope:target = {
        is_landed = yes
        highest_held_title_tier >= tier_duchy
    }
}`,
  },
  {
    name: 'county_target',
    type: 'trigger',
    description: 'Conditions for county-targeted factions.',
    example: `county_target = {
    scope:county = { NOT = { county_opinion < -20 } }
}`,
  },

  // Demands
  {
    name: 'demand',
    type: 'block',
    description: 'The demand the faction makes.',
    example: `demand = {
    type = independence
}`,
  },
  {
    name: 'on_war_start',
    type: 'effect',
    description: 'Effects when faction war starts.',
    example: 'on_war_start = { }',
  },
  {
    name: 'on_demand_accept',
    type: 'effect',
    description: 'Effects when demand is accepted.',
    example: `on_demand_accept = {
    scope:faction_target = { add_prestige = -500 }
}`,
  },

  // AI
  {
    name: 'ai_create_score',
    type: 'block',
    description: 'AI score for creating this faction.',
    example: `ai_create_score = {
    base = 50
    modifier = {
        add = 50
        opinion = { target = liege value < -50 }
    }
}`,
  },
  {
    name: 'ai_join_score',
    type: 'block',
    description: 'AI score for joining this faction.',
    example: `ai_join_score = {
    base = 0
    modifier = {
        add = 25
        opinion = { target = liege value < -25 }
    }
}`,
  },
  {
    name: 'ai_demand_chance',
    type: 'block',
    description: 'AI chance to press demands.',
    example: `ai_demand_chance = {
    base = 0
    modifier = {
        add = 100
        faction_power >= 1.5
    }
}`,
  },

  // Discontent
  {
    name: 'discontent_progress',
    type: 'block',
    description: 'Monthly discontent progress calculation.',
    example: `discontent_progress = {
    base = 1
    modifier = {
        add = 1
        liege = { is_at_war = yes }
    }
}`,
  },

  // Special
  {
    name: 'special_character_title',
    type: 'string',
    description: 'Special title for faction members.',
    example: 'special_character_title = claimant_faction_special_title',
  },
  {
    name: 'requires_leader',
    type: 'boolean',
    description: 'Whether the faction requires a leader.',
    default: true,
    example: 'requires_leader = yes',
  },
  {
    name: 'requires_character',
    type: 'boolean',
    description: 'Whether the faction needs an associated character (e.g., claimant).',
    default: false,
    example: 'requires_character = yes',
  },
];

// Map for quick lookup
export const factionSchemaMap = new Map<string, FieldSchema>(
  factionSchema.map((field) => [field.name, field])
);

export function getFactionFieldNames(): string[] {
  return factionSchema.map((field) => field.name);
}

export function getFactionFieldDocumentation(fieldName: string): string | undefined {
  const field = factionSchemaMap.get(fieldName);
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
