/**
 * Schema definition for CK3 Music - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const musicSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Name identifier for the music track.',
    example: 'name = "my_custom_music"',
  },
  {
    name: 'file',
    type: 'string',
    description: 'Path to the music file.',
    example: 'file = "music/my_track.ogg"',
  },

  // Playback
  {
    name: 'volume',
    type: 'float',
    description: 'Volume level for the track (0.0 to 1.0).',
    example: 'volume = 0.8',
  },
  {
    name: 'loop',
    type: 'boolean',
    description: 'Whether the track loops.',
    default: true,
    example: 'loop = yes',
  },

  // Conditions
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this music to play.',
    example: `trigger = {
    is_at_war = yes
}`,
  },
  {
    name: 'can_play',
    type: 'trigger',
    description: 'Conditions for the music to be playable.',
    example: `can_play = {
    has_dlc = "Royal Court"
}`,
  },

  // Type
  {
    name: 'music_type',
    type: 'enum',
    description: 'Type of music.',
    values: ['event', 'ambient', 'combat', 'menu', 'cue'],
    example: 'music_type = combat',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority for music selection.',
    example: 'priority = 100',
  },

  // Mood
  {
    name: 'mood',
    type: 'enum',
    description: 'Mood of the music.',
    values: ['peaceful', 'tense', 'triumphant', 'sad', 'dramatic', 'neutral'],
    example: 'mood = triumphant',
  },

  // Culture/Region
  {
    name: 'culture_group',
    type: 'string',
    description: 'Culture group for this music.',
    example: 'culture_group = germanic',
  },
  {
    name: 'region',
    type: 'string',
    description: 'Region for this music.',
    example: 'region = western_europe',
  },

  // Fade
  {
    name: 'fade_in',
    type: 'float',
    description: 'Fade in duration in seconds.',
    example: 'fade_in = 2.0',
  },
  {
    name: 'fade_out',
    type: 'float',
    description: 'Fade out duration in seconds.',
    example: 'fade_out = 3.0',
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for random selection.',
    example: `weight = {
    base = 10
}`,
  },
];

// Map for quick lookup
export const musicSchemaMap = new Map<string, FieldSchema>(
  musicSchema.map((field) => [field.name, field])
);

export function getMusicFieldNames(): string[] {
  return musicSchema.map((field) => field.name);
}

export function getMusicFieldDocumentation(fieldName: string): string | undefined {
  const field = musicSchemaMap.get(fieldName);
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
