/**
 * Schema definition for CK3 Bookmarks - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const bookmarkSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'start_date',
    type: 'string',
    description: 'The start date for this bookmark.',
    example: 'start_date = "867.1.1"',
  },
  {
    name: 'is_playable',
    type: 'boolean',
    description: 'Whether this bookmark is playable.',
    default: true,
    example: 'is_playable = yes',
  },
  {
    name: 'recommended',
    type: 'boolean',
    description: 'Whether this bookmark is recommended for new players.',
    default: false,
    example: 'recommended = yes',
  },

  // Display
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the bookmark name.',
    example: 'name = "BOOKMARK_867_NAME"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the bookmark description.',
    example: 'desc = "BOOKMARK_867_DESC"',
  },
  {
    name: 'group',
    type: 'string',
    description: 'Bookmark group for UI organization.',
    example: 'group = "bm_group_867"',
  },

  // Characters
  {
    name: 'character',
    type: 'block',
    description: 'A featured character for this bookmark.',
    example: `character = {
    name = "BOOKMARK_ALFRED"
    dynasty = 806
    dynasty_splendor_level = 2
    type = bookmark_playable_character
    title = k_england
    government = feudal_government
    position = { 650 650 }
    animation = personality_bold
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for bookmark selection.',
    example: `weight = {
    value = 100
}`,
  },
];

// Schema for bookmark characters
export const bookmarkCharacterSchema: FieldSchema[] = [
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the character name.',
    example: 'name = "BOOKMARK_CHARACTER_NAME"',
  },
  {
    name: 'dynasty',
    type: 'integer',
    description: 'Dynasty ID.',
    example: 'dynasty = 806',
  },
  {
    name: 'dynasty_splendor_level',
    type: 'integer',
    description: 'Dynasty splendor level.',
    example: 'dynasty_splendor_level = 2',
  },
  {
    name: 'type',
    type: 'enum',
    description: 'Type of bookmark character.',
    values: ['bookmark_playable_character', 'bookmark_important_character'],
    example: 'type = bookmark_playable_character',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Primary title held.',
    example: 'title = k_england',
  },
  {
    name: 'government',
    type: 'string',
    description: 'Government type.',
    example: 'government = feudal_government',
  },
  {
    name: 'position',
    type: 'block',
    description: 'Position on the map.',
    example: 'position = { 650 650 }',
  },
  {
    name: 'animation',
    type: 'string',
    description: 'Portrait animation.',
    example: 'animation = personality_bold',
  },
  {
    name: 'difficulty',
    type: 'enum',
    description: 'Difficulty rating.',
    values: ['easy', 'normal', 'hard', 'very_hard'],
    example: 'difficulty = "normal"',
  },
  {
    name: 'history_id',
    type: 'integer',
    description: 'Character history ID.',
    example: 'history_id = 163110',
  },
];

// Map for quick lookup
export const bookmarkSchemaMap = new Map<string, FieldSchema>(
  bookmarkSchema.map((field) => [field.name, field])
);

export const bookmarkCharacterSchemaMap = new Map<string, FieldSchema>(
  bookmarkCharacterSchema.map((field) => [field.name, field])
);

export function getBookmarkFieldNames(): string[] {
  return bookmarkSchema.map((field) => field.name);
}

export function getBookmarkFieldDocumentation(fieldName: string): string | undefined {
  const field = bookmarkSchemaMap.get(fieldName);
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
