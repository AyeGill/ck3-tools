/**
 * Schema definition for CK3 Diarchy Mandates - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const diarchyMandateSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the mandate name.',
    example: 'name = "diarchy_mandate_military"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "diarchy_mandate_military_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this mandate.',
    example: 'icon = "gfx/interface/icons/diarchy/mandate_military.dds"',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of mandate.',
    values: ['military', 'diplomatic', 'economic', 'religious', 'administrative'],
    example: 'category = military',
  },

  // Swing
  {
    name: 'swing_impact',
    type: 'integer',
    description: 'Impact on diarchy swing.',
    example: 'swing_impact = 5',
  },
  {
    name: 'swing_direction',
    type: 'enum',
    description: 'Direction of swing change.',
    values: ['towards_liege', 'towards_regent', 'neutral'],
    example: 'swing_direction = towards_regent',
  },

  // Modifiers
  {
    name: 'liege_modifier',
    type: 'block',
    description: 'Modifiers applied to liege.',
    example: `liege_modifier = {
    levy_reinforcement_rate = -0.1
}`,
  },
  {
    name: 'regent_modifier',
    type: 'block',
    description: 'Modifiers applied to regent.',
    example: `regent_modifier = {
    monthly_prestige = 0.5
}`,
  },
  {
    name: 'realm_modifier',
    type: 'block',
    description: 'Modifiers applied to realm.',
    example: `realm_modifier = {
    army_maintenance_mult = -0.1
}`,
  },

  // Effects
  {
    name: 'on_activate',
    type: 'effect',
    description: 'Effects when mandate activates.',
    example: `on_activate = {
    add_prestige = 50
}`,
  },
  {
    name: 'on_deactivate',
    type: 'effect',
    description: 'Effects when mandate deactivates.',
    example: `on_deactivate = {
    add_prestige = -25
}`,
  },
  {
    name: 'on_action',
    type: 'string',
    description: 'Monthly on action.',
    example: 'on_action = mandate_military_pulse',
  },

  // Actions
  {
    name: 'allowed_actions',
    type: 'list',
    description: 'Actions allowed under this mandate.',
    example: `allowed_actions = {
    raise_armies
    declare_war
}`,
  },
  {
    name: 'forbidden_actions',
    type: 'list',
    description: 'Actions forbidden under this mandate.',
    example: `forbidden_actions = {
    grant_titles
    revoke_titles
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for mandate availability.',
    example: `potential = {
    has_diarchy_type = regency
}`,
  },
  {
    name: 'can_activate',
    type: 'trigger',
    description: 'Conditions to activate mandate.',
    example: `can_activate = {
    is_at_war = no
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI weight for this mandate.',
    example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        is_at_war = yes
    }
}`,
  },
];

// Map for quick lookup
export const diarchyMandateSchemaMap = new Map<string, FieldSchema>(
  diarchyMandateSchema.map((field) => [field.name, field])
);

export function getDiarchyMandateFieldNames(): string[] {
  return diarchyMandateSchema.map((field) => field.name);
}

export function getDiarchyMandateFieldDocumentation(fieldName: string): string | undefined {
  const field = diarchyMandateSchemaMap.get(fieldName);
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
