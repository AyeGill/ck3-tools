/**
 * Schema definition for CK3 Artifact Slots - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const artifactSlotSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the slot name.',
    example: 'name = "artifact_slot_weapon"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "artifact_slot_weapon_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this slot.',
    example: 'icon = "gfx/interface/icons/artifact_slots/weapon.dds"',
  },

  // Slot Type
  {
    name: 'slot_type',
    type: 'enum',
    description: 'Type of artifact slot.',
    values: ['primary_armament', 'armor', 'regalia', 'helmet', 'miscellaneous'],
    example: 'slot_type = primary_armament',
  },

  // Position
  {
    name: 'slot_index',
    type: 'integer',
    description: 'Display order index.',
    example: 'slot_index = 0',
  },

  // Requirements
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for slot availability.',
    example: `potential = {
    is_adult = yes
}`,
  },
  {
    name: 'can_equip',
    type: 'trigger',
    description: 'Conditions to equip in this slot.',
    example: `can_equip = {
    is_ruler = yes
}`,
  },

  // Allowed Types
  {
    name: 'allowed_types',
    type: 'list',
    description: 'Artifact types allowed in this slot.',
    example: `allowed_types = {
    weapon
    sword
}`,
  },

  // Max Artifacts
  {
    name: 'max_artifacts',
    type: 'integer',
    description: 'Maximum artifacts in this slot.',
    default: 1,
    example: 'max_artifacts = 1',
  },

  // Effects
  {
    name: 'on_equip',
    type: 'effect',
    description: 'Effects when equipping to this slot.',
    example: `on_equip = {
    add_prestige = 50
}`,
  },
  {
    name: 'on_unequip',
    type: 'effect',
    description: 'Effects when unequipping from this slot.',
    example: `on_unequip = {
    add_prestige = -25
}`,
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value for equipping in this slot.',
    example: `ai_value = {
    base = 100
}`,
  },

  // Visual
  {
    name: 'display_position',
    type: 'block',
    description: 'Display position in UI.',
    example: `display_position = {
    x = 0
    y = 0
}`,
  },
];

// Map for quick lookup
export const artifactSlotSchemaMap = new Map<string, FieldSchema>(
  artifactSlotSchema.map((field) => [field.name, field])
);

export function getArtifactSlotFieldNames(): string[] {
  return artifactSlotSchema.map((field) => field.name);
}

export function getArtifactSlotFieldDocumentation(fieldName: string): string | undefined {
  const field = artifactSlotSchemaMap.get(fieldName);
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
