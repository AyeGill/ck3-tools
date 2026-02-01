/**
 * Schema definition for CK3 Ethos - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const ethosSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the ethos name.',
    example: 'name = "ethos_bellicose"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the ethos description.',
    example: 'desc = "ethos_bellicose_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this ethos.',
    example: 'icon = "gfx/interface/icons/culture_pillars/ethos_bellicose.dds"',
  },

  // Color
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for the ethos.',
    example: 'color = { 0.8 0.2 0.2 }',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters with this ethos.',
    example: `character_modifier = {
    martial = 2
    prowess = 2
    monthly_prestige_gain_mult = 0.1
}`,
  },
  {
    name: 'culture_modifier',
    type: 'block',
    description: 'Modifiers applied to cultures with this ethos.',
    example: `culture_modifier = {
    cultural_acceptance_gain_mult = -0.1
}`,
  },
  {
    name: 'county_modifier',
    type: 'block',
    description: 'Modifiers applied to counties with this culture.',
    example: `county_modifier = {
    levy_size = 0.1
}`,
  },

  // Parameters
  {
    name: 'parameters',
    type: 'block',
    description: 'Special parameters enabled by this ethos.',
    example: `parameters = {
    can_raid = yes
    allow_looting = yes
}`,
  },

  // Traditions
  {
    name: 'tradition_category_weight',
    type: 'block',
    description: 'Weight modifiers for tradition categories.',
    example: `tradition_category_weight = {
    warfare = 2
    societal = 0.5
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to pick this ethos.',
    example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        has_trait = ambitious
    }
}`,
  },
];

// Map for quick lookup
export const ethosSchemaMap = new Map<string, FieldSchema>(
  ethosSchema.map((field) => [field.name, field])
);

export function getEthosFieldNames(): string[] {
  return ethosSchema.map((field) => field.name);
}

export function getEthosFieldDocumentation(fieldName: string): string | undefined {
  const field = ethosSchemaMap.get(fieldName);
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
