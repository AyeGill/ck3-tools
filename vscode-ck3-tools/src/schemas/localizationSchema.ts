/**
 * Schema definition for CK3 Localization - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const localizationSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'l_english',
    type: 'block',
    description: 'English localization entries.',
    example: `l_english:
 MY_KEY:0 "My text"`,
  },
  {
    name: 'l_french',
    type: 'block',
    description: 'French localization entries.',
    example: `l_french:
 MY_KEY:0 "Mon texte"`,
  },
  {
    name: 'l_german',
    type: 'block',
    description: 'German localization entries.',
    example: `l_german:
 MY_KEY:0 "Mein Text"`,
  },
  {
    name: 'l_spanish',
    type: 'block',
    description: 'Spanish localization entries.',
    example: `l_spanish:
 MY_KEY:0 "Mi texto"`,
  },
  {
    name: 'l_russian',
    type: 'block',
    description: 'Russian localization entries.',
    example: `l_russian:
 MY_KEY:0 "Мой текст"`,
  },
  {
    name: 'l_korean',
    type: 'block',
    description: 'Korean localization entries.',
    example: `l_korean:
 MY_KEY:0 "내 텍스트"`,
  },
  {
    name: 'l_simp_chinese',
    type: 'block',
    description: 'Simplified Chinese localization entries.',
    example: `l_simp_chinese:
 MY_KEY:0 "我的文字"`,
  },

  // Version
  {
    name: 'version',
    type: 'integer',
    description: 'Localization version number (after colon).',
    example: 'MY_KEY:1 "Updated text"',
  },

  // Concepts
  {
    name: 'concept',
    type: 'string',
    description: 'Link to a game concept.',
    example: '"[concept|E|prestige]"',
  },

  // Variables
  {
    name: 'variable',
    type: 'string',
    description: 'Variable reference in localization.',
    example: '"[Character.GetName]"',
  },

  // Formatting
  {
    name: 'color',
    type: 'string',
    description: 'Color formatting tag.',
    example: '"#high This is highlighted#!"',
  },
  {
    name: 'bold',
    type: 'string',
    description: 'Bold formatting tag.',
    example: '"#bold Bold text#!"',
  },
  {
    name: 'italic',
    type: 'string',
    description: 'Italic formatting tag.',
    example: '"#italic Italic text#!"',
  },
];

// Map for quick lookup
export const localizationSchemaMap = new Map<string, FieldSchema>(
  localizationSchema.map((field) => [field.name, field])
);

export function getLocalizationFieldNames(): string[] {
  return localizationSchema.map((field) => field.name);
}

export function getLocalizationFieldDocumentation(fieldName: string): string | undefined {
  const field = localizationSchemaMap.get(fieldName);
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
