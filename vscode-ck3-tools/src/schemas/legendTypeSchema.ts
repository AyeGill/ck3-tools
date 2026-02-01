/**
 * Schema definition for CK3 Legend Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const legendTypeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the legend type name.',
    example: 'name = "legend_type_warrior"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "legend_type_warrior_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this legend type.',
    example: 'icon = "gfx/interface/icons/legend/type_warrior.dds"',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of legend.',
    values: ['martial', 'diplomatic', 'intrigue', 'stewardship', 'learning', 'religious'],
    example: 'category = martial',
  },

  // Quality Levels
  {
    name: 'quality_levels',
    type: 'block',
    description: 'Quality level thresholds.',
    example: `quality_levels = {
    famed = 25
    illustrious = 50
    legendary = 100
}`,
  },

  // Spread
  {
    name: 'base_spread_rate',
    type: 'float',
    description: 'Base rate of legend spread.',
    example: 'base_spread_rate = 1.0',
  },
  {
    name: 'max_provinces',
    type: 'integer',
    description: 'Maximum provinces legend can spread to.',
    example: 'max_provinces = 100',
  },

  // Modifiers
  {
    name: 'owner_modifier',
    type: 'block',
    description: 'Modifiers for legend owner.',
    example: `owner_modifier = {
    monthly_prestige = 1.0
    martial = 2
}`,
  },
  {
    name: 'province_modifier',
    type: 'block',
    description: 'Modifiers for provinces with this legend.',
    example: `province_modifier = {
    levy_size = 0.1
}`,
  },

  // Effects
  {
    name: 'on_promote',
    type: 'effect',
    description: 'Effects when legend is promoted.',
    example: `on_promote = {
    add_prestige = 200
}`,
  },
  {
    name: 'on_spread',
    type: 'effect',
    description: 'Effects when legend spreads.',
    example: `on_spread = {
    scope:province = {
        add_modifier = legendary_site
    }
}`,
  },

  // Chronicle
  {
    name: 'chronicle_entries',
    type: 'list',
    description: 'Chronicle entry types for this legend.',
    example: `chronicle_entries = {
    great_battle
    famous_duel
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for legend type availability.',
    example: `potential = {
    martial >= 15
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI weight for this legend type.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const legendTypeSchemaMap = new Map<string, FieldSchema>(
  legendTypeSchema.map((field) => [field.name, field])
);

export function getLegendTypeFieldNames(): string[] {
  return legendTypeSchema.map((field) => field.name);
}

export function getLegendTypeFieldDocumentation(fieldName: string): string | undefined {
  const field = legendTypeSchemaMap.get(fieldName);
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
