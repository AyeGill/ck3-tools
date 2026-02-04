/**
 * Schema definition for CK3 Artifact Modifiers - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const artifactModifierSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the modifier name.',
    example: 'name = "artifact_modifier_blessed"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "artifact_modifier_blessed_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this modifier.',
    example: 'icon = "gfx/interface/icons/artifact/modifier_blessed.dds"',
  },

  // Slot
  {
    name: 'slot',
    type: 'enum',
    description: 'Artifact slot this applies to.',
    values: ['primary_armament', 'regalia', 'helmet', 'armor', 'accessory'],
    example: 'slot = primary_armament',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Character modifiers when equipped.',
    example: `character_modifier = {
    monthly_piety = 0.5
    learning = 2
}`,
  },

  // Quality Scaling
  {
    name: 'quality_scaling',
    type: 'block',
    description: 'How modifiers scale with quality.',
    example: `quality_scaling = {
    common = 1.0
    masterwork = 1.5
    famed = 2.0
    illustrious = 3.0
}`,
  },

  // Value
  {
    name: 'value_modifier',
    type: 'float',
    description: 'Modifier to artifact value.',
    example: 'value_modifier = 0.25',
  },

  // Visual
  {
    name: 'visual_effect',
    type: 'string',
    description: 'Visual effect to apply.',
    example: 'visual_effect = "glow_holy"',
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for availability.',
    example: `potential = {
    artifact_rarity >= masterwork
}`,
  },
  {
    name: 'can_apply',
    type: 'trigger',
    description: 'Conditions to apply modifier.',
    example: `can_apply = {
    faith = { has_doctrine = doctrine_armed_clergy }
}`,
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value weight.',
    example: `ai_value = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const artifactModifierSchemaMap = new Map<string, FieldSchema>(
  artifactModifierSchema.map((field) => [field.name, field])
);

export function getArtifactModifierFieldNames(): string[] {
  return artifactModifierSchema.map((field) => field.name);
}

export function getArtifactModifierFieldDocumentation(fieldName: string): string | undefined {
  const field = artifactModifierSchemaMap.get(fieldName);
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
