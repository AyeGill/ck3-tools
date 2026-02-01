/**
 * Schema definition for CK3 Court Grandeur Levels - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const courtGrandeurLevelSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the level name.',
    example: 'name = "court_grandeur_level_5"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "court_grandeur_level_5_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this grandeur level.',
    example: 'icon = "gfx/interface/icons/court_grandeur/level_5.dds"',
  },

  // Level
  {
    name: 'level',
    type: 'integer',
    description: 'Numeric level.',
    example: 'level = 5',
  },
  {
    name: 'threshold',
    type: 'integer',
    description: 'Grandeur threshold for this level.',
    example: 'threshold = 50',
  },

  // Modifiers
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers applied to court owner.',
    example: `owner_modifier = {
    monthly_prestige = 2.0
    diplomacy = 2
}`,
  },
  {
    name: 'courtier_modifier',
    type: 'block',
    description: 'Modifiers applied to courtiers.',
    example: `courtier_modifier = {
    monthly_prestige = 0.5
}`,
  },
  {
    name: 'court_modifier',
    type: 'block',
    description: 'Modifiers applied to the court.',
    example: `court_modifier = {
    court_grandeur_baseline_add = 5
}`,
  },

  // Cost
  {
    name: 'maintenance_cost',
    type: 'float',
    description: 'Monthly maintenance cost.',
    example: 'maintenance_cost = 5.0',
  },

  // Visual
  {
    name: 'court_scene',
    type: 'string',
    description: 'Court scene to use at this level.',
    example: 'court_scene = "throne_room_5"',
  },

  // AI
  {
    name: 'ai_target',
    type: 'boolean',
    description: 'Whether AI should target this level.',
    default: true,
    example: 'ai_target = yes',
  },
];

// Map for quick lookup
export const courtGrandeurLevelSchemaMap = new Map<string, FieldSchema>(
  courtGrandeurLevelSchema.map((field) => [field.name, field])
);

export function getCourtGrandeurLevelFieldNames(): string[] {
  return courtGrandeurLevelSchema.map((field) => field.name);
}

export function getCourtGrandeurLevelFieldDocumentation(fieldName: string): string | undefined {
  const field = courtGrandeurLevelSchemaMap.get(fieldName);
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
