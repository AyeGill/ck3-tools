/**
 * Schema definition for CK3 Chronicle Entries - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const chronicleEntrySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the entry name.',
    example: 'name = "chronicle_entry_great_victory"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "chronicle_entry_great_victory_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this entry.',
    example: 'icon = "gfx/interface/icons/chronicle/great_victory.dds"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of chronicle entry.',
    values: ['battle', 'diplomacy', 'dynasty', 'religion', 'realm', 'personal'],
    example: 'type = battle',
  },

  // Legend
  {
    name: 'legend',
    type: 'string',
    description: 'Associated legend type.',
    example: 'legend = legend_type_warrior',
  },

  // Quality
  {
    name: 'quality_contribution',
    type: 'integer',
    description: 'Contribution to legend quality.',
    example: 'quality_contribution = 10',
  },

  // Text
  {
    name: 'text',
    type: 'string',
    description: 'Chronicle text localization.',
    example: 'text = "chronicle_entry_great_victory_text"',
  },

  // Illustration
  {
    name: 'illustration',
    type: 'string',
    description: 'Illustration to display.',
    example: 'illustration = "gfx/interface/illustrations/chronicle/battle.dds"',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for entry to be added.',
    example: `trigger = {
    is_at_war = yes
    any_war_enemy = {
        is_major_war = yes
    }
}`,
  },

  // Effects
  {
    name: 'on_add',
    type: 'effect',
    description: 'Effects when entry is added.',
    example: `on_add = {
    add_prestige = 100
}`,
  },

  // Weight
  {
    name: 'weight',
    type: 'block',
    description: 'Selection weight.',
    example: `weight = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const chronicleEntrySchemaMap = new Map<string, FieldSchema>(
  chronicleEntrySchema.map((field) => [field.name, field])
);

export function getChronicleEntryFieldNames(): string[] {
  return chronicleEntrySchema.map((field) => field.name);
}

export function getChronicleEntryFieldDocumentation(fieldName: string): string | undefined {
  const field = chronicleEntrySchemaMap.get(fieldName);
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
