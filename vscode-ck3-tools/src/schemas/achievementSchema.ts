/**
 * Schema definition for CK3 Achievements - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const achievementSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the achievement name.',
    example: 'name = "achievement_name"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the achievement description.',
    example: 'desc = "achievement_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the achievement.',
    example: 'icon = "gfx/interface/icons/achievements/achievement.dds"',
  },

  // Platform
  {
    name: 'steam_id',
    type: 'integer',
    description: 'Steam achievement ID.',
    example: 'steam_id = 12345',
  },
  {
    name: 'gog_id',
    type: 'string',
    description: 'GOG achievement ID.',
    example: 'gog_id = "ACH_001"',
  },

  // Requirements
  {
    name: 'possible',
    type: 'trigger',
    description: 'Conditions for the achievement to be possible.',
    example: `possible = {
    is_ironman = yes
    NOT = { has_game_rule = easy_difficulty }
}`,
  },
  {
    name: 'happened',
    type: 'trigger',
    description: 'Conditions that must be met to unlock.',
    example: `happened = {
    realm_size >= 100
    prestige_level >= 5
}`,
  },

  // Start Conditions
  {
    name: 'start_trigger',
    type: 'trigger',
    description: 'Conditions at game start for achievement eligibility.',
    example: `start_trigger = {
    has_government = feudal_government
}`,
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of achievement.',
    values: ['easy', 'medium', 'hard', 'very_hard', 'insane'],
    example: 'category = hard',
  },

  // Hidden
  {
    name: 'hidden',
    type: 'boolean',
    description: 'Whether the achievement is hidden until unlocked.',
    default: false,
    example: 'hidden = no',
  },

  // DLC
  {
    name: 'dlc',
    type: 'string',
    description: 'Required DLC for this achievement.',
    example: 'dlc = "Royal Court"',
  },

  // Sound
  {
    name: 'sound',
    type: 'string',
    description: 'Sound to play when achievement is unlocked.',
    example: 'sound = "achievement_unlocked"',
  },
];

// Map for quick lookup
export const achievementSchemaMap = new Map<string, FieldSchema>(
  achievementSchema.map((field) => [field.name, field])
);

export function getAchievementFieldNames(): string[] {
  return achievementSchema.map((field) => field.name);
}

export function getAchievementFieldDocumentation(fieldName: string): string | undefined {
  const field = achievementSchemaMap.get(fieldName);
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
