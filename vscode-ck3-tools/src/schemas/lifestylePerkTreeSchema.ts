/**
 * Schema definition for CK3 Lifestyle Perk Trees - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const lifestylePerkTreeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the perk tree name.',
    example: 'name = "diplomacy_perk_tree"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "diplomacy_perk_tree_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this perk tree.',
    example: 'icon = "gfx/interface/icons/lifestyle/diplomacy.dds"',
  },

  // Lifestyle
  {
    name: 'lifestyle',
    type: 'string',
    description: 'The lifestyle this tree belongs to.',
    example: 'lifestyle = diplomacy_lifestyle',
  },

  // Position
  {
    name: 'tree_index',
    type: 'integer',
    description: 'Position index in the lifestyle.',
    example: 'tree_index = 0',
  },

  // Perks
  {
    name: 'perks',
    type: 'list',
    description: 'List of perks in this tree.',
    example: `perks = {
    diplomacy_perk_1
    diplomacy_perk_2
}`,
  },

  // Completion Trait
  {
    name: 'completion_trait',
    type: 'string',
    description: 'Trait awarded when tree is completed.',
    example: 'completion_trait = diplomat',
  },

  // Visibility
  {
    name: 'visible',
    type: 'trigger',
    description: 'Conditions for tree visibility.',
    example: `visible = {
    has_dlc_feature = royal_court
}`,
  },

  // AI
  {
    name: 'ai_selection_weight',
    type: 'block',
    description: 'AI weight for selecting this tree.',
    example: `ai_selection_weight = {
    base = 100
    modifier = {
        add = 50
        diplomacy >= 12
    }
}`,
  },

  // Color
  {
    name: 'color',
    type: 'block',
    description: 'Color for the perk tree.',
    example: `color = {
    0.2 0.5 0.8
}`,
  },
];

// Map for quick lookup
export const lifestylePerkTreeSchemaMap = new Map<string, FieldSchema>(
  lifestylePerkTreeSchema.map((field) => [field.name, field])
);

export function getLifestylePerkTreeFieldNames(): string[] {
  return lifestylePerkTreeSchema.map((field) => field.name);
}

export function getLifestylePerkTreeFieldDocumentation(fieldName: string): string | undefined {
  const field = lifestylePerkTreeSchemaMap.get(fieldName);
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
