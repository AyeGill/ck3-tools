/**
 * Schema definition for CK3 Travel Danger Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const travelDangerTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the danger type name.',
    example: 'name = "travel_danger_bandits"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "travel_danger_bandits_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this danger type.',
    example: 'icon = "gfx/interface/icons/travel/danger_bandits.dds"',
  },

  // Danger Level
  {
    name: 'danger_level',
    type: 'enum',
    description: 'Base danger level.',
    values: ['low', 'medium', 'high', 'extreme'],
    example: 'danger_level = medium',
  },
  {
    name: 'danger_value',
    type: 'integer',
    description: 'Numeric danger contribution.',
    example: 'danger_value = 20',
  },

  // Terrain
  {
    name: 'terrain_types',
    type: 'list',
    description: 'Terrain types where this danger occurs.',
    example: `terrain_types = {
    forest
    mountains
    jungle
}`,
  },

  // Effects
  {
    name: 'on_encounter',
    type: 'effect',
    description: 'Effects when danger is encountered.',
    example: `on_encounter = {
    trigger_event = travel_danger.0001
}`,
  },
  {
    name: 'on_escape',
    type: 'effect',
    description: 'Effects when escaping danger.',
    example: `on_escape = {
    add_prestige = 25
}`,
  },

  // Event Weight
  {
    name: 'event_weight',
    type: 'block',
    description: 'Weight for danger events.',
    example: `event_weight = {
    base = 100
    modifier = {
        add = 50
        terrain = forest
    }
}`,
  },

  // Mitigation
  {
    name: 'mitigation_factors',
    type: 'block',
    description: 'Factors that reduce danger.',
    example: `mitigation_factors = {
    has_trait_brave = -10
    army_size = -0.5
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for danger type availability.',
    example: `potential = {
    is_at_war = yes
}`,
  },
  {
    name: 'province_trigger',
    type: 'trigger',
    description: 'Province conditions for danger.',
    example: `province_trigger = {
    development_level < 10
}`,
  },

  // Season
  {
    name: 'seasonal_modifier',
    type: 'block',
    description: 'Seasonal danger modifiers.',
    example: `seasonal_modifier = {
    winter = 1.5
    summer = 0.8
}`,
  },

  // AI
  {
    name: 'ai_avoidance',
    type: 'block',
    description: 'AI avoidance weight.',
    example: `ai_avoidance = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const travelDangerTypeSchemaMap = new Map<string, FieldSchema>(
  travelDangerTypeSchema.map((field) => [field.name, field])
);

export function getTravelDangerTypeFieldNames(): string[] {
  return travelDangerTypeSchema.map((field) => field.name);
}

export function getTravelDangerTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = travelDangerTypeSchemaMap.get(fieldName);
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
