/**
 * Schema definition for CK3 Named Colors - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const namedColorsSchema: FieldSchema[] = [
  // Color definitions are simple: name = { r g b } or name = hsv { h s v }
  // This schema is minimal as colors are straightforward
  {
    name: 'rgb',
    type: 'block',
    description: 'RGB color values (0-255 or 0.0-1.0).',
    example: 'my_color = rgb { 128 64 192 }',
  },
  {
    name: 'hsv',
    type: 'block',
    description: 'HSV color values (0.0-1.0).',
    example: 'my_color = hsv { 0.5 0.8 0.9 }',
  },
  {
    name: 'hsv360',
    type: 'block',
    description: 'HSV color values with 360-degree hue.',
    example: 'my_color = hsv360 { 180 80 90 }',
  },
  {
    name: 'hex',
    type: 'string',
    description: 'Hexadecimal color value.',
    example: 'my_color = hex { 8040c0ff }',
  },
];

// Map for quick lookup
export const namedColorsSchemaMap = new Map<string, FieldSchema>(
  namedColorsSchema.map((field) => [field.name, field])
);

export function getNamedColorsFieldNames(): string[] {
  return namedColorsSchema.map((field) => field.name);
}

export function getNamedColorsFieldDocumentation(fieldName: string): string | undefined {
  const field = namedColorsSchemaMap.get(fieldName);
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
