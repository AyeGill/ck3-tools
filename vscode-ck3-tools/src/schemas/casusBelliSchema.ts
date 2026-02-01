/**
 * Schema definition for CK3 Casus Belli (CB) - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const CB_GROUPS = [
  'conquest',
  'claim',
  'de_jure',
  'religious',
  'event',
  'undirected',
  'other',
] as const;

export const casusBelliSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'group',
    type: 'enum',
    description: 'The category this CB belongs to.',
    values: [...CB_GROUPS],
    example: 'group = conquest',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the casus belli.',
    example: 'icon = conquest',
  },
  {
    name: 'combine_into_one',
    type: 'boolean',
    description: 'If yes, multiple targets combine into single war.',
    default: false,
    example: 'combine_into_one = yes',
  },
  {
    name: 'should_show_war_goal_subview',
    type: 'boolean',
    description: 'Whether to show the war goal selection interface.',
    default: true,
    example: 'should_show_war_goal_subview = yes',
  },
  {
    name: 'mutually_exclusive_titles',
    type: 'boolean',
    description: 'If yes, cannot target titles that would conflict.',
    default: true,
    example: 'mutually_exclusive_titles = yes',
  },

  // Targeting
  {
    name: 'target_titles',
    type: 'enum',
    description: 'What titles can be targeted.',
    values: ['all', 'de_jure', 'neighbor_land', 'neighbor_water', 'none'],
    example: 'target_titles = de_jure',
  },
  {
    name: 'target_title_tier',
    type: 'enum',
    description: 'What tier of title can be targeted.',
    values: ['all', 'county', 'duchy', 'kingdom', 'empire'],
    example: 'target_title_tier = duchy',
  },
  {
    name: 'target_de_jure_regions_above',
    type: 'boolean',
    description: 'Allow targeting de jure regions above the target title.',
    default: false,
    example: 'target_de_jure_regions_above = yes',
  },
  {
    name: 'ignore_effect',
    type: 'enum',
    description: 'Which effect to ignore when calculating valid targets.',
    values: ['none', 'defender_faith', 'attacker_faith'],
    example: 'ignore_effect = defender_faith',
  },

  // Conditions
  {
    name: 'allowed_for_character',
    type: 'trigger',
    description: 'Conditions for the attacker to use this CB.',
    example: `allowed_for_character = {
    is_ruler = yes
    is_independent_ruler = yes
}`,
  },
  {
    name: 'allowed_against_character',
    type: 'trigger',
    description: 'Conditions the defender must meet.',
    example: `allowed_against_character = {
    scope:defender = {
        NOT = { faith = scope:attacker.faith }
    }
}`,
  },
  {
    name: 'valid_to_start',
    type: 'trigger',
    description: 'Additional conditions to start the war.',
    example: `valid_to_start = {
    scope:attacker = {
        has_piety >= 500
    }
}`,
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Resources spent to start the war.',
    example: `cost = {
    piety = 500
    prestige = 200
}`,
  },

  // On Actions
  {
    name: 'on_declaration',
    type: 'effect',
    description: 'Effects when war is declared.',
    example: `on_declaration = {
    scope:attacker = { add_prestige = -100 }
}`,
  },
  {
    name: 'on_victory',
    type: 'effect',
    description: 'Effects when attacker wins.',
    example: `on_victory = {
    scope:attacker = {
        add_prestige = 500
    }
}`,
  },
  {
    name: 'on_defeat',
    type: 'effect',
    description: 'Effects when attacker loses.',
    example: `on_defeat = {
    scope:attacker = {
        add_prestige = -200
    }
}`,
  },
  {
    name: 'on_white_peace',
    type: 'effect',
    description: 'Effects on white peace.',
    example: `on_white_peace = {
    scope:attacker = { add_prestige = -50 }
}`,
  },
  {
    name: 'on_invalidated',
    type: 'effect',
    description: 'Effects when war becomes invalid.',
    example: 'on_invalidated = { }',
  },
  {
    name: 'on_invalidated_desc',
    type: 'string',
    description: 'Localization key for invalidation message.',
    example: 'on_invalidated_desc = msg_religious_war_invalidated',
  },

  // War Score
  {
    name: 'max_attacker_score_from_battles',
    type: 'integer',
    description: 'Maximum war score attacker can get from battles.',
    example: 'max_attacker_score_from_battles = 50',
  },
  {
    name: 'max_defender_score_from_battles',
    type: 'integer',
    description: 'Maximum war score defender can get from battles.',
    example: 'max_defender_score_from_battles = 50',
  },
  {
    name: 'max_attacker_score_from_occupation',
    type: 'integer',
    description: 'Maximum war score attacker can get from occupation.',
    example: 'max_attacker_score_from_occupation = 100',
  },
  {
    name: 'max_defender_score_from_occupation',
    type: 'integer',
    description: 'Maximum war score defender can get from occupation.',
    example: 'max_defender_score_from_occupation = 50',
  },
  {
    name: 'ticking_war_score_targets_entire_realm',
    type: 'boolean',
    description: 'If yes, occupation score considers entire realm.',
    default: false,
    example: 'ticking_war_score_targets_entire_realm = yes',
  },
  {
    name: 'attacker_ticking_warscore',
    type: 'integer',
    description: 'Monthly war score gain for attacker when conditions met.',
    example: 'attacker_ticking_warscore = 0.1',
  },
  {
    name: 'defender_ticking_warscore',
    type: 'integer',
    description: 'Monthly war score gain for defender when conditions met.',
    example: 'defender_ticking_warscore = 0.1',
  },

  // Duration
  {
    name: 'war_length',
    type: 'block',
    description: 'War duration modifiers.',
    example: `war_length = {
    min = { years = 1 }
    max = { years = 10 }
}`,
  },
  {
    name: 'truce_days',
    type: 'integer',
    description: 'Days of truce after war ends.',
    example: 'truce_days = 1825',
  },

  // AI
  {
    name: 'ai_score',
    type: 'block',
    description: 'AI evaluation of using this CB.',
    example: `ai_score = {
    base = 100
    modifier = {
        factor = 0.5
        has_trait = content
    }
}`,
  },
  {
    name: 'ai_chance',
    type: 'block',
    description: 'AI chance to use this CB when available.',
    example: `ai_chance = {
    base = 100
}`,
  },

  // Special
  {
    name: 'interface_priority',
    type: 'integer',
    description: 'Priority in the CB selection interface.',
    example: 'interface_priority = 100',
  },
  {
    name: 'defender_gets_all_war_titles',
    type: 'boolean',
    description: 'If defender wins, they get all contested titles.',
    default: false,
    example: 'defender_gets_all_war_titles = yes',
  },
  {
    name: 'attacker_allies_inherit',
    type: 'boolean',
    description: 'Whether attacker allies inherit war on death.',
    default: true,
    example: 'attacker_allies_inherit = no',
  },
  {
    name: 'defender_allies_inherit',
    type: 'boolean',
    description: 'Whether defender allies inherit war on death.',
    default: true,
    example: 'defender_allies_inherit = no',
  },
];

// Map for quick lookup
export const casusBelliSchemaMap = new Map<string, FieldSchema>(
  casusBelliSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getCasusBelliFieldNames(): string[] {
  return casusBelliSchema.map((field) => field.name);
}

// Get documentation for a field
export function getCasusBelliFieldDocumentation(fieldName: string): string | undefined {
  const field = casusBelliSchemaMap.get(fieldName);
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
