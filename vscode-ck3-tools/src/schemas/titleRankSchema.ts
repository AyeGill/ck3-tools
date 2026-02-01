/**
 * Schema definition for CK3 Title Ranks - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const titleRankSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the rank name.',
    example: 'name = "title_rank_duke"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "title_rank_duke_desc"',
  },

  // Tier
  {
    name: 'tier',
    type: 'integer',
    description: 'Numeric tier level.',
    example: 'tier = 3',
  },
  {
    name: 'tier_name',
    type: 'string',
    description: 'Name of this tier.',
    example: 'tier_name = "duke"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this rank.',
    example: 'icon = "gfx/interface/icons/titles/duke.dds"',
  },

  // Frame
  {
    name: 'frame',
    type: 'string',
    description: 'Frame graphic for portraits.',
    example: 'frame = "gfx/interface/portraits/frame_duke.dds"',
  },

  // Prestige
  {
    name: 'prestige',
    type: 'integer',
    description: 'Monthly prestige gain.',
    example: 'prestige = 1',
  },
  {
    name: 'prestige_from_titles',
    type: 'float',
    description: 'Prestige multiplier from titles.',
    example: 'prestige_from_titles = 1.5',
  },

  // Opinion
  {
    name: 'vassal_opinion',
    type: 'integer',
    description: 'Opinion modifier from vassals.',
    example: 'vassal_opinion = 5',
  },
  {
    name: 'same_rank_opinion',
    type: 'integer',
    description: 'Opinion modifier from same rank.',
    example: 'same_rank_opinion = 0',
  },

  // De Jure
  {
    name: 'de_jure_drift_years',
    type: 'integer',
    description: 'Years for de jure drift.',
    example: 'de_jure_drift_years = 100',
  },

  // Vassal Limit
  {
    name: 'vassal_limit',
    type: 'integer',
    description: 'Base vassal limit contribution.',
    example: 'vassal_limit = 10',
  },

  // Domain Limit
  {
    name: 'domain_limit',
    type: 'integer',
    description: 'Domain limit contribution.',
    example: 'domain_limit = 2',
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for rank availability.',
    example: `potential = {
    always = yes
}`,
  },

  // Color
  {
    name: 'color',
    type: 'block',
    description: 'Color for this rank.',
    example: `color = {
    0.5 0.3 0.8
}`,
  },
];

// Map for quick lookup
export const titleRankSchemaMap = new Map<string, FieldSchema>(
  titleRankSchema.map((field) => [field.name, field])
);

export function getTitleRankFieldNames(): string[] {
  return titleRankSchema.map((field) => field.name);
}

export function getTitleRankFieldDocumentation(fieldName: string): string | undefined {
  const field = titleRankSchemaMap.get(fieldName);
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
