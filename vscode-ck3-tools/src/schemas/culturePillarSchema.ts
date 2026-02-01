/**
 * Schema definition for CK3 Culture Pillars - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const culturePillarSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the pillar name.',
    example: 'name = "culture_pillar_name"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the pillar description.',
    example: 'desc = "culture_pillar_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this pillar.',
    example: 'icon = "gfx/interface/icons/culture_pillars/pillar.dds"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of culture pillar.',
    values: ['ethos', 'heritage', 'language', 'martial_custom', 'regional'],
    example: 'type = heritage',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters with this pillar.',
    example: `character_modifier = {
    martial = 2
    prowess = 2
}`,
  },
  {
    name: 'culture_modifier',
    type: 'block',
    description: 'Modifiers applied to cultures with this pillar.',
    example: `culture_modifier = {
    cultural_acceptance_gain_mult = 0.1
}`,
  },
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to counties with this culture.',
    example: `county_modifier = {
    development_growth_factor = 0.1
}`,
  },

  // Parameters
  {
    name: 'parameters',
    type: 'block',
    description: 'Special parameters enabled by this pillar.',
    example: `parameters = {
    can_raid_at_sea = yes
    allow_looting = yes
}`,
  },

  // Requirements
  {
    name: 'can_pick',
    type: 'trigger',
    description: 'Conditions to pick this pillar.',
    example: `can_pick = {
    culture_pillar:ethos_bellicose = no
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to pick this pillar.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const culturePillarSchemaMap = new Map<string, FieldSchema>(
  culturePillarSchema.map((field) => [field.name, field])
);

export function getCulturePillarFieldNames(): string[] {
  return culturePillarSchema.map((field) => field.name);
}

export function getCulturePillarFieldDocumentation(fieldName: string): string | undefined {
  const field = culturePillarSchemaMap.get(fieldName);
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
