/**
 * Schema definition for CK3 Artifacts - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const ARTIFACT_SLOTS = [
  'primary_armament',
  'armor',
  'regalia',
  'helmet',
  'miscellaneous',
] as const;

export const ARTIFACT_RARITIES = [
  'common',
  'masterwork',
  'famed',
  'illustrious',
] as const;

export const ARTIFACT_TYPES = [
  'weapon',
  'armor',
  'regalia',
  'trinket',
  'book',
  'relic',
] as const;

export const artifactSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'slot',
    type: 'enum',
    description: 'The equipment slot this artifact occupies.',
    values: [...ARTIFACT_SLOTS],
    required: true,
    example: 'slot = primary_armament',
  },
  {
    name: 'rarity',
    type: 'enum',
    description: 'The rarity tier of the artifact.',
    values: [...ARTIFACT_RARITIES],
    example: 'rarity = famed',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon path for the artifact.',
    example: 'icon = "gfx/interface/icons/artifacts/sword.dds"',
  },
  {
    name: 'asset',
    type: 'block',
    description: 'Visual asset for the artifact.',
    example: `asset = {
    type = pdxmesh
    name = "artifact_sword_mesh"
}`,
  },
  {
    name: 'unique',
    type: 'boolean',
    description: 'If yes, only one can exist at a time.',
    default: false,
    example: 'unique = yes',
  },
  {
    name: 'can_be_gifted',
    type: 'boolean',
    description: 'Whether the artifact can be gifted.',
    default: true,
    example: 'can_be_gifted = yes',
  },
  {
    name: 'can_be_stolen',
    type: 'boolean',
    description: 'Whether the artifact can be stolen.',
    default: true,
    example: 'can_be_stolen = yes',
  },
  {
    name: 'can_be_destroyed',
    type: 'boolean',
    description: 'Whether the artifact can be destroyed.',
    default: true,
    example: 'can_be_destroyed = yes',
  },
  {
    name: 'can_be_bought',
    type: 'boolean',
    description: 'Whether the artifact can be bought.',
    default: true,
    example: 'can_be_bought = yes',
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Modifiers applied when the artifact is equipped.',
    example: `modifier = {
    martial = 2
    prowess = 4
    knight_effectiveness_mult = 0.1
}`,
  },
  {
    name: 'court_grandeur_baseline_add',
    type: 'integer',
    description: 'Bonus to court grandeur baseline.',
    example: 'court_grandeur_baseline_add = 5',
  },

  // Triggers
  {
    name: 'can_equip',
    type: 'trigger',
    description: 'Conditions for equipping this artifact.',
    example: `can_equip = {
    is_adult = yes
    NOT = { has_trait = incapable }
}`,
  },
  {
    name: 'can_benefit',
    type: 'trigger',
    description: 'Conditions for gaining benefits from this artifact.',
    example: `can_benefit = {
    is_ruler = yes
}`,
  },

  // Durability
  {
    name: 'max_durability',
    type: 'integer',
    description: 'Maximum durability of the artifact.',
    example: 'max_durability = 100',
  },
  {
    name: 'decaying',
    type: 'boolean',
    description: 'Whether the artifact decays over time.',
    default: false,
    example: 'decaying = yes',
  },
  {
    name: 'decay_rate',
    type: 'float',
    description: 'Rate of decay per year.',
    example: 'decay_rate = 0.5',
  },

  // History
  {
    name: 'history',
    type: 'block',
    description: 'Historical ownership/events.',
    example: `history = {
    type = created
    date = 800.1.1
    actor = character:123
}`,
  },

  // Visuals
  {
    name: 'quality',
    type: 'integer',
    description: 'Visual quality level (1-5).',
    min: 1,
    max: 5,
    example: 'quality = 4',
  },
  {
    name: 'wealth',
    type: 'integer',
    description: 'Visual wealth level (1-5).',
    min: 1,
    max: 5,
    example: 'wealth = 3',
  },
];

// Schema for artifact templates (used for spawning)
export const artifactTemplateSchema: FieldSchema[] = [
  {
    name: 'visuals',
    type: 'block',
    description: 'Visual appearance settings.',
    example: `visuals = {
    type = weapon
    subtype = sword
}`,
  },
  {
    name: 'template',
    type: 'string',
    description: 'Base template to inherit from.',
    example: 'template = sword_template',
  },
  ...artifactSchema,
];

// Map for quick lookup
export const artifactSchemaMap = new Map<string, FieldSchema>(
  artifactSchema.map((field) => [field.name, field])
);

export const artifactTemplateSchemaMap = new Map<string, FieldSchema>(
  artifactTemplateSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getArtifactFieldNames(): string[] {
  return artifactSchema.map((field) => field.name);
}

// Get documentation for a field
export function getArtifactFieldDocumentation(fieldName: string): string | undefined {
  const field = artifactSchemaMap.get(fieldName);
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
