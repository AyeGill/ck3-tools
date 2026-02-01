/**
 * Schema definition for CK3 Languages - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const languageSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the language name.',
    example: 'name = "language_anglo_saxon"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the language description.',
    example: 'desc = "language_anglo_saxon_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this language.',
    example: 'icon = "gfx/interface/icons/culture_pillars/language.dds"',
  },

  // Color
  {
    name: 'color',
    type: 'block',
    description: 'RGB color for the language.',
    example: 'color = { 0.7 0.5 0.3 }',
  },

  // Language Family
  {
    name: 'language_family',
    type: 'string',
    description: 'The language family this language belongs to.',
    example: 'language_family = germanic',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters speaking this language.',
    example: `character_modifier = {
    diplomacy = 1
}`,
  },

  // Intelligibility
  {
    name: 'intelligible_to',
    type: 'list',
    description: 'Languages that can understand this language.',
    example: `intelligible_to = {
    language_old_norse
    language_danish
}`,
  },

  // Names
  {
    name: 'name_lists',
    type: 'list',
    description: 'Name lists associated with this language.',
    example: `name_lists = {
    name_list_english
    name_list_anglo_saxon
}`,
  },

  // Parameters
  {
    name: 'parameters',
    type: 'block',
    description: 'Special parameters for this language.',
    example: `parameters = {
    uses_runic_script = yes
}`,
  },
];

// Map for quick lookup
export const languageSchemaMap = new Map<string, FieldSchema>(
  languageSchema.map((field) => [field.name, field])
);

export function getLanguageFieldNames(): string[] {
  return languageSchema.map((field) => field.name);
}

export function getLanguageFieldDocumentation(fieldName: string): string | undefined {
  const field = languageSchemaMap.get(fieldName);
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
