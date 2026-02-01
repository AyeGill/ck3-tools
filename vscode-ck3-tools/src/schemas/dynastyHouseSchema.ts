/**
 * Schema definition for CK3 Dynasty Houses - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const dynastyHouseSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the house name.',
    example: 'name = "dynn_house_Example"',
  },
  {
    name: 'prefix',
    type: 'string',
    description: 'Localization key for the house prefix.',
    example: 'prefix = "dynnp_house_"',
  },
  {
    name: 'dynasty',
    type: 'integer',
    description: 'The parent dynasty ID.',
    example: 'dynasty = 1000',
  },

  // Motto
  {
    name: 'motto',
    type: 'string',
    description: 'House motto localization key.',
    example: 'motto = "HOUSE_MOTTO_KEY"',
  },

  // Coat of Arms
  {
    name: 'coat_of_arms',
    type: 'block',
    description: 'Custom coat of arms for the house.',
    example: `coat_of_arms = {
    pattern = "pattern_solid.dds"
    color1 = red
    color2 = yellow
}`,
  },

  // Forced Crest
  {
    name: 'forced_crest_texture',
    type: 'string',
    description: 'Forced crest texture override.',
    example: 'forced_crest_texture = "gfx/coat_of_arms/houses/house_crest.dds"',
  },
];

// Map for quick lookup
export const dynastyHouseSchemaMap = new Map<string, FieldSchema>(
  dynastyHouseSchema.map((field) => [field.name, field])
);

export function getDynastyHouseFieldNames(): string[] {
  return dynastyHouseSchema.map((field) => field.name);
}

export function getDynastyHouseFieldDocumentation(fieldName: string): string | undefined {
  const field = dynastyHouseSchemaMap.get(fieldName);
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
