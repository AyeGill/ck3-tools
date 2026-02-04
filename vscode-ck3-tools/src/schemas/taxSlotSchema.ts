/**
 * Schema definition for CK3 Tax Slots - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const taxSlotSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'slot_type',
    type: 'string',
    description: 'Type of tax slot.',
    example: 'slot_type = "noble_obligations"',
  },
  {
    name: 'max_level',
    type: 'integer',
    description: 'Maximum level for this tax slot.',
    example: 'max_level = 5',
  },

  // Levels
  {
    name: 'levels',
    type: 'block',
    description: 'Define levels for this tax slot.',
    example: `levels = {
    level_1 = {
        tax_contribution = 0.1
        vassal_opinion = -5
    }
    level_2 = {
        tax_contribution = 0.2
        vassal_opinion = -10
    }
}`,
  },

  // Requirements
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for the tax slot to be shown.',
    example: `is_shown = {
    has_government = feudal_government
}`,
  },
  {
    name: 'can_change',
    type: 'trigger',
    description: 'Conditions for changing the tax level.',
    example: `can_change = {
    NOT = { is_at_war = yes }
}`,
  },

  // Modifiers per level
  {
    name: 'tax_contribution',
    type: 'float',
    description: 'Tax contribution at this level.',
    example: 'tax_contribution = 0.15',
  },
  {
    name: 'levy_contribution',
    type: 'float',
    description: 'Levy contribution at this level.',
    example: 'levy_contribution = 0.1',
  },
  {
    name: 'vassal_opinion',
    type: 'integer',
    description: 'Vassal opinion modifier.',
    example: 'vassal_opinion = -10',
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI likelihood to choose this tax level.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const taxSlotSchemaMap = new Map<string, FieldSchema>(
  taxSlotSchema.map((field) => [field.name, field])
);

export function getTaxSlotFieldNames(): string[] {
  return taxSlotSchema.map((field) => field.name);
}

export function getTaxSlotFieldDocumentation(fieldName: string): string | undefined {
  const field = taxSlotSchemaMap.get(fieldName);
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
