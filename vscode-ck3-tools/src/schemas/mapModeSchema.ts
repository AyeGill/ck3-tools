/**
 * Schema definition for CK3 Map Modes - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const mapModeSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the map mode name.',
    example: 'name = "map_mode_terrain"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the map mode button.',
    example: 'icon = "gfx/interface/icons/map_modes/terrain.dds"',
  },

  // Color Configuration
  {
    name: 'color',
    type: 'block',
    description: 'Color settings for provinces.',
    example: `color = {
    value = terrain_color
}`,
  },
  {
    name: 'default_color',
    type: 'block',
    description: 'Default color when no specific color applies.',
    example: 'default_color = { 128 128 128 }',
  },

  // Province Coloring
  {
    name: 'province_color',
    type: 'block',
    description: 'How provinces are colored in this map mode.',
    example: `province_color = {
    trigger = { is_coastal = yes }
    color = { 0 100 200 }
}`,
  },

  // Tooltip
  {
    name: 'tooltip',
    type: 'string',
    description: 'Tooltip localization key.',
    example: 'tooltip = "map_mode_terrain_tooltip"',
  },

  // Shortcut
  {
    name: 'shortcut',
    type: 'string',
    description: 'Keyboard shortcut for the map mode.',
    example: 'shortcut = "t"',
  },

  // Priority
  {
    name: 'priority',
    type: 'integer',
    description: 'Display order priority.',
    example: 'priority = 10',
  },

  // Visibility
  {
    name: 'is_visible',
    type: 'trigger',
    description: 'Conditions for this map mode to be visible.',
    example: `is_visible = {
    has_dlc = "Royal Court"
}`,
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of map mode.',
    values: ['terrain', 'political', 'diplomatic', 'realm', 'custom'],
    example: 'type = political',
  },
];

// Map for quick lookup
export const mapModeSchemaMap = new Map<string, FieldSchema>(
  mapModeSchema.map((field) => [field.name, field])
);

export function getMapModeFieldNames(): string[] {
  return mapModeSchema.map((field) => field.name);
}

export function getMapModeFieldDocumentation(fieldName: string): string | undefined {
  const field = mapModeSchemaMap.get(fieldName);
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
