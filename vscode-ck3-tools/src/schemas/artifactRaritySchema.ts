/**
 * Schema definition for CK3 Artifact Rarities - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const artifactRaritySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the rarity name.',
    example: 'name = "artifact_rarity_famed"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "artifact_rarity_famed_desc"',
  },

  // Visual
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this rarity level.',
    example: 'icon = "gfx/interface/icons/artifact_rarities/famed.dds"',
  },
  {
    name: 'color',
    type: 'block',
    description: 'Color associated with this rarity.',
    example: `color = {
    0.8 0.5 0.1
}`,
  },
  {
    name: 'frame',
    type: 'string',
    description: 'Frame asset for this rarity.',
    example: 'frame = "frame_famed"',
  },

  // Value
  {
    name: 'level',
    type: 'integer',
    description: 'Numeric level of the rarity.',
    example: 'level = 3',
  },
  {
    name: 'min_wealth',
    type: 'integer',
    description: 'Minimum wealth for this rarity.',
    example: 'min_wealth = 50',
  },
  {
    name: 'max_wealth',
    type: 'integer',
    description: 'Maximum wealth for this rarity.',
    example: 'max_wealth = 100',
  },

  // Durability
  {
    name: 'durability_mult',
    type: 'float',
    description: 'Durability multiplier for this rarity.',
    example: 'durability_mult = 1.5',
  },
  {
    name: 'decay_mult',
    type: 'float',
    description: 'Decay rate multiplier.',
    example: 'decay_mult = 0.75',
  },

  // Modifiers
  {
    name: 'modifier_mult',
    type: 'float',
    description: 'Modifier strength multiplier.',
    example: 'modifier_mult = 1.5',
  },

  // AI
  {
    name: 'ai_value_mult',
    type: 'float',
    description: 'AI value multiplier for this rarity.',
    example: 'ai_value_mult = 2.0',
  },

  // Generation
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for random generation.',
    example: `weight = {
    base = 10
    modifier = {
        add = 5
        has_trait = artisan
    }
}`,
  },

  // Order
  {
    name: 'index',
    type: 'integer',
    description: 'Sort order index.',
    example: 'index = 3',
  },
];

// Map for quick lookup
export const artifactRaritySchemaMap = new Map<string, FieldSchema>(
  artifactRaritySchema.map((field) => [field.name, field])
);

export function getArtifactRarityFieldNames(): string[] {
  return artifactRaritySchema.map((field) => field.name);
}

export function getArtifactRarityFieldDocumentation(fieldName: string): string | undefined {
  const field = artifactRaritySchemaMap.get(fieldName);
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
