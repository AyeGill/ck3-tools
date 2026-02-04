/**
 * Schema definition for CK3 Dynasty Legacies - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const LEGACY_TRACKS = [
  'warfare',
  'law',
  'guile',
  'blood',
  'erudition',
  'glory',
  'kin',
] as const;

export const dynastyLegacySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'track',
    type: 'string',
    description: 'The legacy track this legacy belongs to.',
    example: 'track = warfare',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the legacy.',
    example: 'icon = "gfx/interface/icons/dynasty_legacies/legacy_warfare_1.dds"',
  },
  {
    name: 'order',
    type: 'integer',
    description: 'Order within the track (determines unlock sequence).',
    example: 'order = 1',
  },

  // Cost
  {
    name: 'cost',
    type: 'block',
    description: 'Renown cost to unlock this legacy.',
    example: `cost = {
    renown = 1000
}`,
  },

  // Requirements
  {
    name: 'can_be_picked',
    type: 'trigger',
    description: 'Conditions for being able to select this legacy.',
    example: `can_be_picked = {
    dynasty = {
        has_dynasty_perk = legacy_warfare_1
    }
}`,
  },
  {
    name: 'is_visible',
    type: 'trigger',
    description: 'Conditions for this legacy to be visible.',
    example: `is_visible = {
    always = yes
}`,
  },

  // Effects
  {
    name: 'effect',
    type: 'effect',
    description: 'One-time effects when the legacy is unlocked.',
    example: `effect = {
    every_dynasty_member = {
        trigger_event = dynasty_event.0001
    }
}`,
  },
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to all dynasty members.',
    example: `character_modifier = {
    men_at_arms_maintenance = -0.05
    knight_effectiveness_mult = 0.1
}`,
  },

  // AI
  {
    name: 'ai_chance',
    type: 'block',
    description: 'AI preference for unlocking this legacy.',
    example: `ai_chance = {
    value = 100
    if = {
        limit = { martial >= 15 }
        add = 50
    }
}`,
  },
];

// Schema for dynasty legacy tracks
export const legacyTrackSchema: FieldSchema[] = [
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the legacy track.',
    example: 'icon = "gfx/interface/icons/dynasty_legacies/track_warfare.dds"',
  },
  {
    name: 'legacies',
    type: 'list',
    description: 'List of legacies in this track.',
    example: `legacies = {
    legacy_warfare_1
    legacy_warfare_2
    legacy_warfare_3
    legacy_warfare_4
    legacy_warfare_5
}`,
  },
];

// Map for quick lookup
export const dynastyLegacySchemaMap = new Map<string, FieldSchema>(
  dynastyLegacySchema.map((field) => [field.name, field])
);

export const legacyTrackSchemaMap = new Map<string, FieldSchema>(
  legacyTrackSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getDynastyLegacyFieldNames(): string[] {
  return dynastyLegacySchema.map((field) => field.name);
}

// Get documentation for a field
export function getDynastyLegacyFieldDocumentation(fieldName: string): string | undefined {
  const field = dynastyLegacySchemaMap.get(fieldName);
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
