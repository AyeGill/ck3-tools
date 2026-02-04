/**
 * Schema definition for CK3 Diarchies (Roads to Power DLC) - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const diarchySchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'diarch_type',
    type: 'enum',
    description: 'Type of diarch relationship.',
    values: ['regency', 'co_ruler', 'designated_regent'],
    example: 'diarch_type = regency',
  },

  // Triggers
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the diarchy type to be shown.',
    example: `is_shown = {
    has_government = feudal_government
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the diarchy to be valid.',
    example: `is_valid = {
    exists = scope:diarch
    scope:diarch = { is_alive = yes }
}`,
  },
  {
    name: 'can_be_diarch',
    type: 'trigger',
    description: 'Conditions for a character to be a valid diarch.',
    example: `can_be_diarch = {
    is_adult = yes
    NOT = { is_incapable_trigger = yes }
}`,
  },

  // Power distribution
  {
    name: 'liege_mandate',
    type: 'block',
    description: 'Mandate powers retained by the liege.',
    example: `liege_mandate = {
    realm_laws = yes
    diplomacy = no
}`,
  },
  {
    name: 'diarch_mandate',
    type: 'block',
    description: 'Mandate powers given to the diarch.',
    example: `diarch_mandate = {
    warfare = yes
    vassal_management = yes
}`,
  },

  // Modifiers
  {
    name: 'liege_modifier',
    type: 'block',
    description: 'Modifiers applied to the liege.',
    example: `liege_modifier = {
    monthly_prestige = -0.5
}`,
  },
  {
    name: 'diarch_modifier',
    type: 'block',
    description: 'Modifiers applied to the diarch.',
    example: `diarch_modifier = {
    monthly_prestige = 0.5
    diplomacy = 2
}`,
  },

  // On actions
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when the diarchy starts.',
    example: `on_start = {
    trigger_event = diarchy_events.001
}`,
  },
  {
    name: 'on_end',
    type: 'effect',
    description: 'Effects when the diarchy ends.',
    example: `on_end = {
    scope:diarch = { add_prestige = -100 }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to choose this diarchy type.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const diarchySchemaMap = new Map<string, FieldSchema>(
  diarchySchema.map((field) => [field.name, field])
);

export function getDiarchyFieldNames(): string[] {
  return diarchySchema.map((field) => field.name);
}

export function getDiarchyFieldDocumentation(fieldName: string): string | undefined {
  const field = diarchySchemaMap.get(fieldName);
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
