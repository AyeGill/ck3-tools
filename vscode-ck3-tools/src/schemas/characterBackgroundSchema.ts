/**
 * Schema definition for CK3 Character Backgrounds - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const characterBackgroundSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'background',
    type: 'string',
    description: 'The background type identifier.',
    example: 'background = "noble"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon path for the background.',
    example: 'icon = "gfx/interface/icons/backgrounds/noble.dds"',
  },

  // Requirements
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this background to be available.',
    example: `trigger = {
    is_adult = yes
    is_landed = no
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the background to remain valid.',
    example: `is_valid = {
    NOT = { has_trait = incapable }
}`,
  },

  // Effects
  {
    name: 'on_apply',
    type: 'effect',
    description: 'Effects when the background is applied.',
    example: `on_apply = {
    add_trait = education_diplomacy_3
}`,
  },
  {
    name: 'effect',
    type: 'effect',
    description: 'Effects of having this background.',
    example: `effect = {
    add_skill = diplomacy 2
}`,
  },

  // Modifiers
  {
    name: 'modifier',
    type: 'block',
    description: 'Modifiers applied by this background.',
    example: `modifier = {
    diplomacy = 2
    monthly_prestige = 0.1
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Weight for random selection.',
    example: `weight = {
    base = 100
    modifier = {
        add = 50
        has_trait = ambitious
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to choose this background.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const characterBackgroundSchemaMap = new Map<string, FieldSchema>(
  characterBackgroundSchema.map((field) => [field.name, field])
);

export function getCharacterBackgroundFieldNames(): string[] {
  return characterBackgroundSchema.map((field) => field.name);
}

export function getCharacterBackgroundFieldDocumentation(fieldName: string): string | undefined {
  const field = characterBackgroundSchemaMap.get(fieldName);
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
