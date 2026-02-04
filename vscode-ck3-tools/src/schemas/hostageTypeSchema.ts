/**
 * Schema definition for CK3 Hostage Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const hostageTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the hostage type name.',
    example: 'name = "hostage_type_diplomatic"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "hostage_type_diplomatic_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this hostage type.',
    example: 'icon = "gfx/interface/icons/hostage/diplomatic.dds"',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of hostage.',
    values: ['diplomatic', 'prisoner', 'ward', 'tribute'],
    example: 'category = diplomatic',
  },

  // Duration
  {
    name: 'duration',
    type: 'integer',
    description: 'Duration in days.',
    example: 'duration = 3650',
  },
  {
    name: 'indefinite',
    type: 'boolean',
    description: 'Whether hostage is indefinite.',
    default: false,
    example: 'indefinite = no',
  },

  // Modifiers
  {
    name: 'hostage_modifier',
    type: 'block',
    description: 'Modifiers applied to hostage.',
    example: `hostage_modifier = {
    monthly_prestige = -0.1
}`,
  },
  {
    name: 'holder_modifier',
    type: 'block',
    description: 'Modifiers applied to holder.',
    example: `holder_modifier = {
    monthly_prestige = 0.2
}`,
  },
  {
    name: 'home_ruler_modifier',
    type: 'block',
    description: 'Modifiers to hostage home ruler.',
    example: `home_ruler_modifier = {
    vassal_opinion = 5
}`,
  },

  // Opinion
  {
    name: 'opinion_modifier',
    type: 'string',
    description: 'Opinion modifier to apply.',
    example: 'opinion_modifier = hostage_opinion',
  },

  // Effects
  {
    name: 'on_start',
    type: 'effect',
    description: 'Effects when hostage starts.',
    example: `on_start = {
    trigger_event = hostage_events.0001
}`,
  },
  {
    name: 'on_end',
    type: 'effect',
    description: 'Effects when hostage ends.',
    example: `on_end = {
    add_prestige = 50
}`,
  },
  {
    name: 'on_return',
    type: 'effect',
    description: 'Effects when hostage is returned.',
    example: `on_return = {
    add_opinion = {
        modifier = returned_hostage
        target = scope:holder
    }
}`,
  },

  // Release Conditions
  {
    name: 'can_release',
    type: 'trigger',
    description: 'Conditions to release hostage.',
    example: `can_release = {
    is_at_war = no
}`,
  },
  {
    name: 'release_cost',
    type: 'block',
    description: 'Cost to release hostage.',
    example: `release_cost = {
    gold = 100
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for hostage type availability.',
    example: `potential = {
    is_adult = no
}`,
  },
  {
    name: 'valid_hostage',
    type: 'trigger',
    description: 'Conditions for valid hostages.',
    example: `valid_hostage = {
    is_landed = no
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI weight for this hostage type.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const hostageTypeSchemaMap = new Map<string, FieldSchema>(
  hostageTypeSchema.map((field) => [field.name, field])
);

export function getHostageTypeFieldNames(): string[] {
  return hostageTypeSchema.map((field) => field.name);
}

export function getHostageTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = hostageTypeSchemaMap.get(fieldName);
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
