/**
 * Schema definition for CK3 Character Memory Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const characterMemorySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'category',
    type: 'string',
    description: 'Category of the memory.',
    example: 'category = "diplomatic"',
  },
  {
    name: 'type',
    type: 'enum',
    description: 'Type of memory.',
    values: ['positive', 'negative', 'neutral'],
    example: 'type = positive',
  },

  // Duration
  {
    name: 'duration',
    type: 'block',
    description: 'How long the memory lasts.',
    example: `duration = {
    years = 10
}`,
  },
  {
    name: 'permanent',
    type: 'boolean',
    description: 'Whether the memory is permanent.',
    default: false,
    example: 'permanent = yes',
  },

  // Effects
  {
    name: 'on_creation',
    type: 'effect',
    description: 'Effects when the memory is created.',
    example: `on_creation = {
    add_opinion = {
        target = scope:target
        modifier = friendly_memory_opinion
    }
}`,
  },
  {
    name: 'on_expire',
    type: 'effect',
    description: 'Effects when the memory expires.',
    example: `on_expire = {
    remove_opinion = {
        target = scope:target
        modifier = friendly_memory_opinion
    }
}`,
  },

  // Visibility
  {
    name: 'hidden',
    type: 'boolean',
    description: 'Whether the memory is hidden from the player.',
    default: false,
    example: 'hidden = yes',
  },
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the memory to be visible.',
    example: `is_shown = {
    NOT = { has_trait = shy }
}`,
  },

  // Opinion
  {
    name: 'opinion_modifier',
    type: 'string',
    description: 'Opinion modifier applied by this memory.',
    example: 'opinion_modifier = memory_positive_opinion',
  },

  // Participants
  {
    name: 'participants',
    type: 'block',
    description: 'Define memory participants.',
    example: `participants = {
    target = {
        scope_type = character
    }
}`,
  },

  // Localization
  {
    name: 'title',
    type: 'string',
    description: 'Localization key for the memory title.',
    example: 'title = "MEMORY_TITLE_KEY"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the memory description.',
    example: 'desc = "MEMORY_DESC_KEY"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the memory.',
    example: 'icon = "gfx/interface/icons/memories/memory_icon.dds"',
  },
];

// Map for quick lookup
export const characterMemorySchemaMap = new Map<string, FieldSchema>(
  characterMemorySchema.map((field) => [field.name, field])
);

export function getCharacterMemoryFieldNames(): string[] {
  return characterMemorySchema.map((field) => field.name);
}

export function getCharacterMemoryFieldDocumentation(fieldName: string): string | undefined {
  const field = characterMemorySchemaMap.get(fieldName);
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
