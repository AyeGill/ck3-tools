/**
 * Schema definition for CK3 Court Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const courtTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the court type name.',
    example: 'name = "court_type_grand"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the court type description.',
    example: 'desc = "court_type_grand_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this court type.',
    example: 'icon = "gfx/interface/icons/court_types/grand.dds"',
  },

  // Requirements
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for this court type to be shown.',
    example: `is_shown = {
    highest_held_title_tier >= tier_kingdom
}`,
  },
  {
    name: 'can_choose',
    type: 'trigger',
    description: 'Conditions to choose this court type.',
    example: `can_choose = {
    prestige_level >= 3
}`,
  },

  // Modifiers
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied to the court owner.',
    example: `owner_modifier = {
    monthly_prestige = 1.0
    court_grandeur_baseline_add = 10
}`,
  },
  {
    name: 'courtier_modifier',
    type: 'block',
    description: 'Modifiers applied to courtiers.',
    example: `courtier_modifier = {
    monthly_prestige = 0.1
}`,
  },
  {
    name: 'guest_modifier',
    type: 'block',
    description: 'Modifiers applied to guests.',
    example: `guest_modifier = {
    monthly_prestige = 0.05
}`,
  },

  // Amenities
  {
    name: 'default_amenity_level',
    type: 'block',
    description: 'Default amenity levels for this court type.',
    example: `default_amenity_level = {
    court_lodging_standards = medium_amenity_level
    court_servants = medium_amenity_level
}`,
  },

  // Cost
  {
    name: 'base_cost',
    type: 'integer',
    description: 'Base cost to maintain this court type.',
    example: 'base_cost = 5',
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to choose this court type.',
    example: `ai_will_do = {
    base = 100
}`,
  },

  // Time
  {
    name: 'time_to_change',
    type: 'integer',
    description: 'Time in days to change to this court type.',
    example: 'time_to_change = 365',
  },
];

// Map for quick lookup
export const courtTypeSchemaMap = new Map<string, FieldSchema>(
  courtTypeSchema.map((field) => [field.name, field])
);

export function getCourtTypeFieldNames(): string[] {
  return courtTypeSchema.map((field) => field.name);
}

export function getCourtTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = courtTypeSchemaMap.get(fieldName);
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
