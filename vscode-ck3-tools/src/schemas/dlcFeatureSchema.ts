/**
 * Schema definition for CK3 DLC Features - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const dlcFeatureSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Internal name of the DLC feature.',
    example: 'name = "royal_court"',
  },
  {
    name: 'display_name',
    type: 'string',
    description: 'Localization key for display name.',
    example: 'display_name = "DLC_ROYAL_COURT"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the DLC description.',
    example: 'desc = "DLC_ROYAL_COURT_DESC"',
  },

  // Activation
  {
    name: 'dlc',
    type: 'string',
    description: 'DLC identifier this feature belongs to.',
    example: 'dlc = "Royal Court"',
  },
  {
    name: 'required_dlc',
    type: 'list',
    description: 'List of required DLCs.',
    example: `required_dlc = {
    "Royal Court"
}`,
  },

  // Feature Toggle
  {
    name: 'enabled',
    type: 'boolean',
    description: 'Whether the feature is enabled.',
    default: true,
    example: 'enabled = yes',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the DLC feature.',
    example: 'icon = "gfx/interface/icons/dlc/royal_court.dds"',
  },

  // Category
  {
    name: 'category',
    type: 'enum',
    description: 'Category of DLC feature.',
    values: ['expansion', 'flavor_pack', 'cosmetic', 'music', 'free'],
    example: 'category = expansion',
  },

  // Release
  {
    name: 'release_date',
    type: 'string',
    description: 'Release date of the DLC.',
    example: 'release_date = "2022.02.08"',
  },

  // Steam
  {
    name: 'steam_id',
    type: 'integer',
    description: 'Steam app ID for the DLC.',
    example: 'steam_id = 1234567',
  },
];

// Map for quick lookup
export const dlcFeatureSchemaMap = new Map<string, FieldSchema>(
  dlcFeatureSchema.map((field) => [field.name, field])
);

export function getDlcFeatureFieldNames(): string[] {
  return dlcFeatureSchema.map((field) => field.name);
}

export function getDlcFeatureFieldDocumentation(fieldName: string): string | undefined {
  const field = dlcFeatureSchemaMap.get(fieldName);
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
