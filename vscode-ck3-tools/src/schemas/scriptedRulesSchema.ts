/**
 * Schema definition for CK3 Scripted Rules - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const scriptedRulesSchema: FieldSchema[] = [
  // These are essentially trigger blocks that return yes/no
  // Common scripted rules patterns
  {
    name: 'trigger',
    type: 'trigger',
    description: 'The trigger conditions for this rule.',
    example: `trigger = {
    is_ruler = yes
    is_adult = yes
}`,
  },
  {
    name: 'AND',
    type: 'trigger',
    description: 'All conditions must be true.',
    example: `AND = {
    is_ruler = yes
    is_adult = yes
}`,
  },
  {
    name: 'OR',
    type: 'trigger',
    description: 'At least one condition must be true.',
    example: `OR = {
    is_ruler = yes
    is_heir = yes
}`,
  },
  {
    name: 'NOT',
    type: 'trigger',
    description: 'Negates the condition.',
    example: `NOT = {
    has_trait = incapable
}`,
  },
  {
    name: 'NOR',
    type: 'trigger',
    description: 'None of the conditions can be true.',
    example: `NOR = {
    has_trait = incapable
    has_trait = infirm
}`,
  },
  {
    name: 'NAND',
    type: 'trigger',
    description: 'Not all conditions can be true.',
    example: `NAND = {
    is_ruler = yes
    is_at_war = yes
}`,
  },
  {
    name: 'always',
    type: 'boolean',
    description: 'Always return this value.',
    example: 'always = yes',
  },
];

// Map for quick lookup
export const scriptedRulesSchemaMap = new Map<string, FieldSchema>(
  scriptedRulesSchema.map((field) => [field.name, field])
);

export function getScriptedRulesFieldNames(): string[] {
  return scriptedRulesSchema.map((field) => field.name);
}

export function getScriptedRulesFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptedRulesSchemaMap.get(fieldName);
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
