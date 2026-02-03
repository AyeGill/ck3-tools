/**
 * Schema definition for CK3 Scripted Effects - powers autocomplete and hover documentation
 *
 * Scripted effects are reusable effect blocks that can be called from other scripts.
 * They can take parameters and are defined in common/scripted_effects/
 *
 * Note: Any valid effect from the effects database is allowed in a scripted effect.
 * The wildcard entry below tells the completion/validation system to accept all effects.
 */

import { FieldSchema } from './traitSchema';

// Schema for scripted effects
// The wildcard entry means any effect is valid at top level
export const scriptedEffectSchema: FieldSchema[] = [
  // Wildcard: any effect is valid in a scripted effect
  {
    name: '*',
    type: 'effect',
    isWildcard: true,
    description: 'Any valid effect can be used in a scripted effect.',
  },

  // Structural fields that may not be in the effects database
  {
    name: 'custom_tooltip',
    type: 'block',
    description: 'Wrap effects with a custom tooltip.',
    example: `custom_tooltip = {
    text = my_custom_tooltip_key
    add_gold = 100
}`,
  },
  {
    name: 'hidden_effect',
    type: 'block',
    description: 'Effects that run without showing tooltips.',
    example: `hidden_effect = {
    add_character_flag = my_hidden_flag
}`,
  },
  {
    name: 'show_as_tooltip',
    type: 'block',
    description: 'Show effects as tooltip without executing them.',
    example: `show_as_tooltip = {
    add_gold = 100
}`,
  },
];

// Map for quick lookup (excluding wildcard entries)
export const scriptedEffectSchemaMap = new Map<string, FieldSchema>(
  scriptedEffectSchema.filter(f => !f.isWildcard).map((field) => [field.name, field])
);

// Get all field names for completion (non-wildcard only, effects come from data)
export function getScriptedEffectFieldNames(): string[] {
  return scriptedEffectSchema.filter(f => !f.isWildcard).map((field) => field.name);
}

// Get documentation for a field
export function getScriptedEffectFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedEffectSchemaMap.get(fieldName);
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
