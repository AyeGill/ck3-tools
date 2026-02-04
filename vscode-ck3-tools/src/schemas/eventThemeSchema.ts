/**
 * Schema definition for CK3 Event Themes - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const eventThemeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the event theme.',
    example: 'icon = "gfx/interface/icons/event_themes/theme_intrigue.dds"',
  },
  {
    name: 'background',
    type: 'string',
    description: 'Background image for the event.',
    example: 'background = "gfx/interface/event_window/event_bg_intrigue.dds"',
  },
  {
    name: 'sound',
    type: 'string',
    description: 'Sound effect for the theme.',
    example: 'sound = "event:/SFX/Events/Themes/sfx_event_theme_intrigue"',
  },

  // Colors
  {
    name: 'color',
    type: 'block',
    description: 'Primary color for the theme.',
    example: 'color = { 0.6 0.2 0.4 }',
  },
  {
    name: 'accent_color',
    type: 'block',
    description: 'Accent color for the theme.',
    example: 'accent_color = { 0.8 0.3 0.5 }',
  },

  // Conditions
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for when this theme applies.',
    example: `trigger = {
    has_trait = intrigue_education_trait
}`,
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Priority of the theme when multiple match.',
    example: 'priority = 100',
  },
];

// Map for quick lookup
export const eventThemeSchemaMap = new Map<string, FieldSchema>(
  eventThemeSchema.map((field) => [field.name, field])
);

export function getEventThemeFieldNames(): string[] {
  return eventThemeSchema.map((field) => field.name);
}

export function getEventThemeFieldDocumentation(fieldName: string): string | undefined {
  const field = eventThemeSchemaMap.get(fieldName);
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
