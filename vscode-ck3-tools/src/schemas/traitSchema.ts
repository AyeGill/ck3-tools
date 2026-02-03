/**
 * Schema definition for CK3 traits - powers autocomplete and hover documentation
 */

import { characterModifiers, countyModifiers, provinceModifiers } from '../data';

export interface FieldSchema {
  name: string;
  type: 'boolean' | 'integer' | 'float' | 'string' | 'enum' | 'block' | 'trigger' | 'effect' | 'modifier' | 'list';
  description: string;
  values?: string[];
  default?: string | number | boolean;
  min?: number;
  max?: number;
  required?: boolean;
  children?: FieldSchema[];
  example?: string;
}

export const TRAIT_CATEGORIES = [
  'personality',
  'education',
  'childhood',
  'commander',
  'winter_commander',
  'lifestyle',
  'court_type',
  'fame',
  'health',
] as const;

export const STATS = [
  'diplomacy',
  'martial',
  'stewardship',
  'intrigue',
  'learning',
  'prowess',
] as const;

export const SEX_VALUES = ['male', 'female', 'all'] as const;

export const INHERITANCE_BLOCKER_VALUES = ['all', 'dynasty', 'none'] as const;

export const traitSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'category',
    type: 'enum',
    description: 'The category of the trait. Determines behavior and constraints.',
    values: [...TRAIT_CATEGORIES],
    required: true,
    example: 'category = personality',
  },
  {
    name: 'minimum_age',
    type: 'integer',
    description: 'Minimum age required to have this trait.',
    min: 0,
    max: 100,
    example: 'minimum_age = 16',
  },
  {
    name: 'maximum_age',
    type: 'integer',
    description: 'Maximum age after which the trait cannot be held.',
    min: 0,
    max: 100,
    example: 'maximum_age = 15',
  },

  // Stats - direct modifiers
  ...STATS.map((stat) => ({
    name: stat,
    type: 'integer' as const,
    description: `Modifier to the character's ${stat} stat.`,
    min: -20,
    max: 20,
    example: `${stat} = 2`,
  })),

  // Monthly modifiers
  {
    name: 'monthly_prestige',
    type: 'float',
    description: 'Monthly prestige gain/loss.',
    example: 'monthly_prestige = 0.5',
  },
  {
    name: 'monthly_piety',
    type: 'float',
    description: 'Monthly piety gain/loss.',
    example: 'monthly_piety = 0.3',
  },
  // Validation and Restrictions
  {
    name: 'valid_sex',
    type: 'enum',
    description: 'Restrict trait to specific sex.',
    values: [...SEX_VALUES],
    default: 'all',
    example: 'valid_sex = male',
  },
  {
    name: 'potential',
    type: 'trigger',
    description: 'Trigger conditions that must be met for the trait to be assigned.',
    example: `potential = {
    is_adult = yes
    NOT = { has_trait = content }
}`,
  },

  // Flags and Special Behaviors
  {
    name: 'genetic',
    type: 'boolean',
    description: 'Makes the trait inheritable genetically. Active traits have 100% inheritance, inactive 50%.',
    example: 'genetic = yes',
  },
  {
    name: 'good',
    type: 'boolean',
    description: 'Marks a genetic trait as positive (affects inheritance rules).',
    example: 'good = yes',
  },
  {
    name: 'physical',
    type: 'boolean',
    description: 'Indicates the trait represents a physical characteristic.',
    example: 'physical = yes',
  },
  {
    name: 'incapacitating',
    type: 'boolean',
    description: 'Character cannot rule directly and requires a regent.',
    example: 'incapacitating = yes',
  },
  {
    name: 'immortal',
    type: 'boolean',
    description: 'Prevents aging and natural death.',
    example: 'immortal = yes',
  },
  {
    name: 'disables_combat_leadership',
    type: 'boolean',
    description: 'Prevents the character from being a commander.',
    example: 'disables_combat_leadership = yes',
  },
  {
    name: 'can_have_children',
    type: 'boolean',
    description: 'Controls fertility.',
    default: true,
    example: 'can_have_children = no',
  },
  {
    name: 'enables_inbred',
    type: 'boolean',
    description: 'Enables risk of inbred children.',
    example: 'enables_inbred = yes',
  },

  // Inheritance
  {
    name: 'inherit_chance',
    type: 'integer',
    description: 'Manual inheritance percentage (0-100). Cannot be used with genetic traits.',
    min: 0,
    max: 100,
    example: 'inherit_chance = 50',
  },
  {
    name: 'both_parent_has_trait_inherit_chance',
    type: 'integer',
    description: 'Inheritance percentage when both parents have the trait.',
    min: 0,
    max: 100,
    example: 'both_parent_has_trait_inherit_chance = 75',
  },
  {
    name: 'parent_inheritance_sex',
    type: 'enum',
    description: 'Which parent sex can pass on the trait.',
    values: ['male', 'female', 'all'],
    example: 'parent_inheritance_sex = male',
  },
  {
    name: 'child_inheritance_sex',
    type: 'enum',
    description: 'Which child sex can receive the trait.',
    values: ['male', 'female', 'all'],
    example: 'child_inheritance_sex = female',
  },
  {
    name: 'inheritance_blocker',
    type: 'enum',
    description: 'Prevents inheriting titles.',
    values: [...INHERITANCE_BLOCKER_VALUES],
    default: 'none',
    example: 'inheritance_blocker = all',
  },

  // Random Generation
  {
    name: 'birth',
    type: 'integer',
    description: 'Chance (0-100) for randomly generated characters to have this trait at birth.',
    min: 0,
    max: 100,
    example: 'birth = 5',
  },
  {
    name: 'random_creation',
    type: 'integer',
    description: 'Chance for generated (not born) characters to have this trait.',
    min: 0,
    max: 100,
    example: 'random_creation = 10',
  },
  {
    name: 'random_creation_weight',
    type: 'integer',
    description: 'Weight for random selection (used for personality/education/childhood).',
    example: 'random_creation_weight = 20',
  },

  // Visual
  {
    name: 'icon',
    type: 'string',
    description: 'Path to the trait icon. Can be dynamic with triggered_desc.',
    example: 'icon = "gfx/interface/icons/traits/my_trait.dds"',
  },

  // Localization
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the trait name. Can be dynamic with triggered_desc.',
    example: 'name = trait_ambitious',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for trait description. Can be dynamic with triggered_desc.',
    example: 'desc = trait_ambitious_desc',
  },

  // Opinion and Compatibility
  {
    name: 'same_opinion',
    type: 'integer',
    description: 'Opinion modifier between characters who share this trait.',
    example: 'same_opinion = 10',
  },
  {
    name: 'same_opinion_if_same_faith',
    type: 'integer',
    description: 'Opinion modifier if both characters have the trait AND same faith.',
    example: 'same_opinion_if_same_faith = 20',
  },
  {
    name: 'opposite_opinion',
    type: 'integer',
    description: 'Opinion modifier if characters have opposite traits.',
    example: 'opposite_opinion = -20',
  },
  {
    name: 'attraction_opinion',
    type: 'integer',
    description: 'Opinion modifier for attraction (romantic contexts).',
    example: 'attraction_opinion = 10',
  },
  {
    name: 'triggered_opinion',
    type: 'block',
    description: 'Conditional opinion effects.',
    example: `triggered_opinion = {
    opinion_modifier = opinion_witchcraft
    parameter = witchcraft_accepted
    check_missing = yes
    same_faith = yes
}`,
  },
  {
    name: 'compatibility',
    type: 'block',
    description: 'Used by compatibility calculations (not direct opinion).',
    example: `compatibility = {
    gluttonous = 20
    drunkard = 10
}`,
  },

  // Groups and Levels
  {
    name: 'group',
    type: 'string',
    description: 'Trait group for inheritance and equivalence. Characters can only have one trait from each group.',
    example: 'group = education_intrigue',
  },
  {
    name: 'level',
    type: 'integer',
    description: 'Level within the trait group.',
    min: 1,
    example: 'level = 1',
  },
  {
    name: 'group_equivalence',
    type: 'string',
    description: 'Separate grouping for equivalence only.',
    example: 'group_equivalence = personality_bold',
  },
  {
    name: 'group_inheritance',
    type: 'string',
    description: 'Separate grouping for inheritance only.',
    example: 'group_inheritance = education',
  },
  {
    name: 'opposites',
    type: 'block',
    description: 'Traits that cannot coexist with this trait.',
    example: `opposites = {
    content
    lazy
}`,
  },

  // Tracks (XP-based leveling)
  {
    name: 'track',
    type: 'block',
    description: 'Single track for XP-based leveling with bonuses at thresholds.',
    example: `track = {
    20 = { diplomacy = 1 }
    40 = { diplomacy = 2 }
    60 = { diplomacy = 3 }
}`,
  },
  {
    name: 'tracks',
    type: 'block',
    description: 'Multiple named tracks for XP-based leveling.',
    example: `tracks = {
    combat_track = {
        30 = { martial = 1 }
        70 = { martial = 2 }
    }
}`,
  },
  {
    name: 'monthly_track_xp_degradation',
    type: 'block',
    description: 'Configures XP degradation over time.',
    example: `monthly_track_xp_degradation = {
    min = 20
    change = 5
}`,
  },

  // Portrait Effects
  {
    name: 'genetic_constraint_all',
    type: 'string',
    description: 'Applies genetic constraint from common/genes/ to all characters.',
    example: 'genetic_constraint_all = beauty',
  },
  {
    name: 'genetic_constraint_men',
    type: 'string',
    description: 'Applies genetic constraint to male characters only.',
    example: 'genetic_constraint_men = male_beauty',
  },
  {
    name: 'genetic_constraint_women',
    type: 'string',
    description: 'Applies genetic constraint to female characters only.',
    example: 'genetic_constraint_women = female_beauty',
  },
  {
    name: 'portrait_extremity_shift',
    type: 'float',
    description: 'Shifts all morph genes toward extremes (0 or 1).',
    min: 0,
    max: 1,
    example: 'portrait_extremity_shift = 0.25',
  },

  // Conditional Modifiers
  {
    name: 'culture_modifier',
    type: 'block',
    description: 'Modifiers applied if character\'s culture has specified parameter.',
    example: `culture_modifier = {
    parameter = can_blind_prisoners
    diplomacy = 5
}`,
  },
  {
    name: 'faith_modifier',
    type: 'block',
    description: 'Modifiers applied if character\'s faith has specified doctrine parameter.',
    example: `faith_modifier = {
    parameter = great_holy_wars_active
    stewardship = 1
}`,
  },

  // Ruler Designer
  {
    name: 'ruler_designer_cost',
    type: 'integer',
    description: 'Cost in ruler designer points. Positive for good traits, negative for bad.',
    example: 'ruler_designer_cost = 50',
  },
  {
    name: 'shown_in_ruler_designer',
    type: 'boolean',
    description: 'Whether to show in ruler designer.',
    default: true,
    example: 'shown_in_ruler_designer = no',
  },

  // Miscellaneous
  {
    name: 'flag',
    type: 'string',
    description: 'Custom flag for use in triggers with has_trait_flag. Can have multiple.',
    example: 'flag = level_1_education',
  },
  {
    name: 'shown_in_encyclopedia',
    type: 'boolean',
    description: 'Whether to show in the encyclopedia.',
    default: true,
    example: 'shown_in_encyclopedia = no',
  },
  {
    name: 'culture_succession_prio',
    type: 'string',
    description: 'Children with this trait are prioritized in succession for cultures with matching parameter.',
    example: 'culture_succession_prio = children_can_be_born_in_the_purple',
  },

  // AI
  {
    name: 'ai_rationality',
    type: 'integer',
    description: 'Modifier to AI rationality.',
    example: 'ai_rationality = 10',
  },
  {
    name: 'ai_energy',
    type: 'integer',
    description: 'Modifier to AI energy/activity level.',
    example: 'ai_energy = 10',
  },
  {
    name: 'ai_boldness',
    type: 'integer',
    description: 'Modifier to AI boldness in decisions.',
    example: 'ai_boldness = 20',
  },
  {
    name: 'ai_compassion',
    type: 'integer',
    description: 'Modifier to AI compassion.',
    example: 'ai_compassion = -10',
  },
  {
    name: 'ai_greed',
    type: 'integer',
    description: 'Modifier to AI greed.',
    example: 'ai_greed = 15',
  },
  {
    name: 'ai_honor',
    type: 'integer',
    description: 'Modifier to AI honor/integrity.',
    example: 'ai_honor = 20',
  },
  {
    name: 'ai_sociability',
    type: 'integer',
    description: 'Modifier to AI sociability.',
    example: 'ai_sociability = -10',
  },
  {
    name: 'ai_vengefulness',
    type: 'integer',
    description: 'Modifier to AI vengefulness.',
    example: 'ai_vengefulness = 30',
  },
  {
    name: 'ai_zeal',
    type: 'integer',
    description: 'Modifier to AI religious zeal.',
    example: 'ai_zeal = 20',
  },

  // Include all character modifiers at the top level
  // These can be used directly in traits (e.g., fertility = 0.1, attraction_opinion = 10)
  ...characterModifiers
    .filter(mod => !['diplomacy', 'martial', 'stewardship', 'intrigue', 'learning', 'prowess',
                     'monthly_prestige', 'monthly_piety', 'ai_boldness', 'ai_compassion',
                     'ai_greed', 'ai_honor', 'ai_rationality', 'ai_sociability',
                     'ai_vengefulness', 'ai_zeal', 'ai_energy'].includes(mod.name)) // Avoid duplicates
    .map(mod => ({
      name: mod.name,
      type: 'float' as const,
      description: `Character modifier: ${mod.name.replace(/_/g, ' ')}`,
      example: `${mod.name} = 0.1`,
    })),
];

// Map for quick lookup
export const traitSchemaMap = new Map<string, FieldSchema>(
  traitSchema.map((field) => [field.name, field])
);

/**
 * Schema for description blocks (desc = { })
 * Used when desc takes a block form for dynamic/conditional descriptions
 */
export const descriptionBlockSchema: FieldSchema[] = [
  {
    name: 'first_valid',
    type: 'block',
    description: 'Returns the first description whose trigger evaluates to true. Evaluated in order.',
    example: `first_valid = {
    triggered_desc = {
        trigger = { has_trait = brave }
        desc = brave_character_desc
    }
    desc = default_desc
}`,
  },
  {
    name: 'random_valid',
    type: 'block',
    description: 'Picks a random description from valid options.',
    example: `random_valid = {
    triggered_desc = {
        trigger = { is_adult = yes }
        desc = adult_desc_1
    }
    triggered_desc = {
        trigger = { is_adult = yes }
        desc = adult_desc_2
    }
}`,
  },
  {
    name: 'triggered_desc',
    type: 'block',
    description: 'A conditional description with a trigger. If trigger passes, this description is used.',
    example: `triggered_desc = {
    trigger = { has_trait = brave }
    desc = brave_character_desc
}`,
  },
  {
    name: 'desc',
    type: 'string',
    description: 'A localization key for the description text. Used as fallback or inside first_valid/random_valid.',
    example: 'desc = my_trait_desc',
  },
];

/**
 * Schema for triggered_desc blocks
 */
export const triggeredDescSchema: FieldSchema[] = [
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions that must be true for this description to be used.',
    example: `trigger = {
    has_trait = brave
    is_adult = yes
}`,
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description text when trigger passes.',
    example: 'desc = brave_character_desc',
  },
];

/**
 * Schema for first_valid / random_valid blocks
 */
export const validDescListSchema: FieldSchema[] = [
  {
    name: 'triggered_desc',
    type: 'block',
    description: 'A conditional description with a trigger.',
    example: `triggered_desc = {
    trigger = { has_trait = brave }
    desc = brave_character_desc
}`,
  },
  {
    name: 'desc',
    type: 'string',
    description: 'A fallback description (typically last in the list).',
    example: 'desc = default_desc',
  },
];

/**
 * Schema for trigger blocks (common triggers)
 */
export const triggerBlockSchema: FieldSchema[] = [
  {
    name: 'has_trait',
    type: 'string',
    description: 'Check if the character has a specific trait.',
    example: 'has_trait = brave',
  },
  {
    name: 'NOT',
    type: 'block',
    description: 'Negates the enclosed triggers.',
    example: 'NOT = { has_trait = craven }',
  },
  {
    name: 'AND',
    type: 'block',
    description: 'All enclosed triggers must be true.',
    example: `AND = {
    is_adult = yes
    has_trait = brave
}`,
  },
  {
    name: 'OR',
    type: 'block',
    description: 'At least one enclosed trigger must be true.',
    example: `OR = {
    has_trait = brave
    has_trait = ambitious
}`,
  },
  {
    name: 'is_adult',
    type: 'boolean',
    description: 'Check if the character is an adult.',
    example: 'is_adult = yes',
  },
  {
    name: 'is_ruler',
    type: 'boolean',
    description: 'Check if the character is a ruler.',
    example: 'is_ruler = yes',
  },
  {
    name: 'is_male',
    type: 'boolean',
    description: 'Check if the character is male.',
    example: 'is_male = yes',
  },
  {
    name: 'is_female',
    type: 'boolean',
    description: 'Check if the character is female.',
    example: 'is_female = yes',
  },
  {
    name: 'age',
    type: 'integer',
    description: 'Check character age (use with >= or <= operators).',
    example: 'age >= 16',
  },
  {
    name: 'has_character_flag',
    type: 'string',
    description: 'Check if the character has a specific flag.',
    example: 'has_character_flag = my_flag',
  },
  {
    name: 'has_trait_flag',
    type: 'string',
    description: 'Check if any of the character\'s traits have a specific flag.',
    example: 'has_trait_flag = education_trait',
  },
];

// Maps for quick lookup of nested schemas
export const descriptionBlockSchemaMap = new Map<string, FieldSchema>(
  descriptionBlockSchema.map((field) => [field.name, field])
);

export const triggeredDescSchemaMap = new Map<string, FieldSchema>(
  triggeredDescSchema.map((field) => [field.name, field])
);

export const validDescListSchemaMap = new Map<string, FieldSchema>(
  validDescListSchema.map((field) => [field.name, field])
);

export const triggerBlockSchemaMap = new Map<string, FieldSchema>(
  triggerBlockSchema.map((field) => [field.name, field])
);

/**
 * Schema for modifier blocks (character modifiers used in traits)
 * Generated from OldEnt's modifier data
 */
export const modifierBlockSchema: FieldSchema[] = characterModifiers.map(mod => ({
  name: mod.name,
  type: 'float' as const,
  description: `Character modifier: ${mod.name.replace(/_/g, ' ')}`,
  example: `${mod.name} = 0.1`,
}));

/**
 * Schema for county modifier VALUES (the stat modifiers inside county_modifier blocks)
 */
export const countyModifierValuesSchema: FieldSchema[] = countyModifiers.map(mod => ({
  name: mod.name,
  type: 'float' as const,
  description: `County modifier: ${mod.name.replace(/_/g, ' ')}`,
  example: `${mod.name} = 0.1`,
}));

/**
 * Schema for province modifier VALUES (the stat modifiers inside province_modifier blocks)
 */
export const provinceModifierValuesSchema: FieldSchema[] = provinceModifiers.map(mod => ({
  name: mod.name,
  type: 'float' as const,
  description: `Province modifier: ${mod.name.replace(/_/g, ' ')}`,
  example: `${mod.name} = 0.1`,
}));

export const modifierBlockSchemaMap = new Map<string, FieldSchema>(
  modifierBlockSchema.map((field) => [field.name, field])
);

/**
 * Check if a block name is a numeric XP threshold (e.g., "50", "100")
 */
function isNumericBlock(block: string): boolean {
  return /^\d+$/.test(block);
}

/**
 * Blocks that establish a character modifier context
 */
const MODIFIER_CONTEXT_BLOCKS = new Set([
  'modifier',
  'character_modifier',
  'culture_modifier',
  'faith_modifier',
  'track',  // XP track blocks contain modifiers
]);

/**
 * Get the appropriate schema for a given block context
 * @param blockPath Array of field names representing the nesting path (e.g., ['desc', 'first_valid'])
 * @returns The schema to use for completions in this context
 */
export function getSchemaForContext(blockPath: string[]): FieldSchema[] {
  if (blockPath.length === 0) {
    return traitSchema;
  }

  const currentBlock = blockPath[blockPath.length - 1];

  // Check for modifier context by walking the path
  // If any ancestor block establishes modifier context, and we're inside it
  // (possibly inside numeric XP threshold blocks), return modifier schema
  let inModifierContext = false;
  for (const block of blockPath) {
    if (MODIFIER_CONTEXT_BLOCKS.has(block)) {
      inModifierContext = true;
    }
    // Numeric blocks (XP thresholds) inside a modifier context stay in that context
    if (isNumericBlock(block) && inModifierContext) {
      continue;
    }
    // Trigger/potential blocks exit modifier context
    if (block === 'trigger' || block === 'potential') {
      inModifierContext = false;
    }
  }

  if (inModifierContext) {
    return modifierBlockSchema;
  }

  // Check what kind of block we're in
  switch (currentBlock) {
    case 'desc':
    case 'name':
    case 'icon':
      // These fields can have description blocks when they take block form
      return descriptionBlockSchema;

    case 'triggered_desc':
      return triggeredDescSchema;

    case 'first_valid':
    case 'random_valid':
      return validDescListSchema;

    case 'trigger':
    case 'potential':
      return triggerBlockSchema;

    case 'NOT':
    case 'AND':
    case 'OR':
    case 'NAND':
    case 'NOR':
      // Logic operators contain more triggers
      return triggerBlockSchema;

    default:
      // For unknown blocks at depth 1, show trait fields
      // For deeper unknown blocks, show empty (let user type freely)
      if (blockPath.length === 1) {
        return traitSchema;
      }
      return [];
  }
}

/**
 * Get the schema map for a given block context
 */
export function getSchemaMapForContext(blockPath: string[]): Map<string, FieldSchema> {
  const schema = getSchemaForContext(blockPath);
  return new Map(schema.map((field) => [field.name, field]));
}

// Get all field names for completion
export function getTraitFieldNames(): string[] {
  return traitSchema.map((field) => field.name);
}

// Get completions for a specific field's values (if enum)
export function getFieldValues(fieldName: string): string[] | undefined {
  const field = traitSchemaMap.get(fieldName);
  if (field?.type === 'enum' && field.values) {
    return field.values;
  }
  return undefined;
}

// Get documentation for a field
export function getFieldDocumentation(fieldName: string): string | undefined {
  const field = traitSchemaMap.get(fieldName);
  if (!field) return undefined;

  let doc = field.description;
  if (field.type === 'enum' && field.values) {
    doc += `\n\nValid values: ${field.values.join(', ')}`;
  }
  if (field.default !== undefined) {
    doc += `\n\nDefault: ${field.default}`;
  }
  if (field.example) {
    doc += `\n\nExample:\n${field.example}`;
  }
  return doc;
}
