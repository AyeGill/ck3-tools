/**
 * Schema definition for CK3 Scripted Triggers - powers autocomplete and hover documentation
 *
 * Scripted triggers are reusable condition blocks that can be checked from other scripts.
 * They return true/false and are defined in common/scripted_triggers/
 *
 * Note: Any valid trigger from the triggers database is allowed in a scripted trigger.
 * The wildcard entry below tells the completion/validation system to accept all triggers.
 */

import { FieldSchema } from './registry/types';

// Schema for scripted triggers
// The wildcard entry means any trigger is valid at top level
export const scriptedTriggerSchema: FieldSchema[] = [
  // Wildcard: any trigger is valid in a scripted trigger
  {
    name: '*',
    type: 'trigger',
    isWildcard: true,
    description: 'Any valid trigger can be used in a scripted trigger.',
  },

  // Structural fields that may not be in the triggers database
  {
    name: 'custom_tooltip',
    type: 'block',
    description: 'Wrap triggers with a custom tooltip.',
    example: `custom_tooltip = {
    text = my_custom_tooltip_key
    has_trait = brave
}`,
  },
];

// Map for quick lookup
export const scriptedTriggerSchemaMap = new Map<string, FieldSchema>(
  scriptedTriggerSchema.filter(f => !f.isWildcard).map((field) => [field.name, field])
);

/**
 * Check if the schema has a wildcard entry of a given type
 */
export function hasWildcard(schema: FieldSchema[], type: 'trigger' | 'effect'): boolean {
  return schema.some(f => f.isWildcard && f.type === type);
}

// Get all field names for completion (non-wildcard only, triggers come from data)
export function getScriptedTriggerFieldNames(): string[] {
  return scriptedTriggerSchema.filter(f => !f.isWildcard).map((field) => field.name);
}

// Get documentation for a field
export function getScriptedTriggerFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedTriggerSchemaMap.get(fieldName);
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
