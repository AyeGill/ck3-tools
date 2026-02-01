/**
 * Schema definition for CK3 Script Values - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const scriptValueSchema: FieldSchema[] = [
  // Basic value types - script values are essentially math expressions
  {
    name: 'value',
    type: 'integer',
    description: 'Base value or reference to another value.',
    example: 'value = 100',
  },
  {
    name: 'add',
    type: 'block',
    description: 'Add a value.',
    example: `add = {
    value = stewardship
    multiply = 5
}`,
  },
  {
    name: 'subtract',
    type: 'block',
    description: 'Subtract a value.',
    example: 'subtract = 10',
  },
  {
    name: 'multiply',
    type: 'float',
    description: 'Multiply the current value.',
    example: 'multiply = 1.5',
  },
  {
    name: 'divide',
    type: 'float',
    description: 'Divide the current value.',
    example: 'divide = 2',
  },
  {
    name: 'modulo',
    type: 'integer',
    description: 'Get remainder after division.',
    example: 'modulo = 10',
  },
  {
    name: 'min',
    type: 'integer',
    description: 'Set minimum value.',
    example: 'min = 0',
  },
  {
    name: 'max',
    type: 'integer',
    description: 'Set maximum value.',
    example: 'max = 100',
  },
  {
    name: 'round',
    type: 'boolean',
    description: 'Round to nearest integer.',
    example: 'round = yes',
  },
  {
    name: 'floor',
    type: 'boolean',
    description: 'Round down to integer.',
    example: 'floor = yes',
  },
  {
    name: 'ceiling',
    type: 'boolean',
    description: 'Round up to integer.',
    example: 'ceiling = yes',
  },

  // Conditional
  {
    name: 'if',
    type: 'block',
    description: 'Conditional value modification.',
    example: `if = {
    limit = { martial >= 15 }
    add = 50
}`,
  },
  {
    name: 'else_if',
    type: 'block',
    description: 'Else-if conditional.',
    example: `else_if = {
    limit = { martial >= 10 }
    add = 25
}`,
  },
  {
    name: 'else',
    type: 'block',
    description: 'Else conditional.',
    example: `else = {
    add = 10
}`,
  },

  // Scope references
  {
    name: 'scope:value',
    type: 'string',
    description: 'Reference a saved scope value.',
    example: 'value = scope:target.martial',
  },

  // Fixed point
  {
    name: 'fixed_range',
    type: 'block',
    description: 'Clamp value to a range.',
    example: `fixed_range = {
    min = 0
    max = 100
}`,
  },

  // Format
  {
    name: 'format',
    type: 'string',
    description: 'How to display the value.',
    example: 'format = "0.0"',
  },

  // Description
  {
    name: 'desc',
    type: 'string',
    description: 'Description shown in tooltips.',
    example: 'desc = my_script_value_desc',
  },
];

// Map for quick lookup
export const scriptValueSchemaMap = new Map<string, FieldSchema>(
  scriptValueSchema.map((field) => [field.name, field])
);

export function getScriptValueFieldNames(): string[] {
  return scriptValueSchema.map((field) => field.name);
}

export function getScriptValueFieldDocumentation(fieldName: string): string | undefined {
  const field = scriptValueSchemaMap.get(fieldName);
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
