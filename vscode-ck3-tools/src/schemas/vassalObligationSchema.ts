/**
 * Schema definition for CK3 Vassal Obligations - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const vassalObligationSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the obligation name.',
    example: 'name = "vassal_obligation_tax"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "vassal_obligation_tax_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the obligation.',
    example: 'icon = "gfx/interface/icons/vassal_obligations/tax.dds"',
  },

  // Type
  {
    name: 'type',
    type: 'enum',
    description: 'Type of vassal obligation.',
    values: ['tax', 'levy', 'special', 'religious', 'feudal'],
    example: 'type = tax',
  },

  // Levels
  {
    name: 'levels',
    type: 'list',
    description: 'Obligation levels.',
    example: `levels = {
    { tax_contribution = 0.0 levy_contribution = 0.5 }
    { tax_contribution = 0.25 levy_contribution = 0.25 }
    { tax_contribution = 0.5 levy_contribution = 0.0 }
}`,
  },

  // Default Level
  {
    name: 'default_level',
    type: 'integer',
    description: 'Default obligation level.',
    example: 'default_level = 1',
  },

  // Tax Contribution
  {
    name: 'tax_contribution',
    type: 'float',
    description: 'Tax contribution percentage.',
    example: 'tax_contribution = 0.25',
  },

  // Levy Contribution
  {
    name: 'levy_contribution',
    type: 'float',
    description: 'Levy contribution percentage.',
    example: 'levy_contribution = 0.25',
  },

  // Opinion
  {
    name: 'vassal_opinion',
    type: 'integer',
    description: 'Opinion modifier for vassal.',
    example: 'vassal_opinion = -10',
  },
  {
    name: 'liege_opinion',
    type: 'integer',
    description: 'Opinion modifier for liege.',
    example: 'liege_opinion = 5',
  },

  // Requirements
  {
    name: 'can_set',
    type: 'trigger',
    description: 'Conditions to set this obligation.',
    example: `can_set = {
    has_hook = scope:vassal
}`,
  },
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for obligation availability.',
    example: `potential = {
    government = feudal_government
}`,
  },

  // AI
  {
    name: 'ai_preference',
    type: 'block',
    description: 'AI preference for this obligation.',
    example: `ai_preference = {
    base = 100
}`,
  },

  // Effects
  {
    name: 'on_set',
    type: 'effect',
    description: 'Effects when obligation is set.',
    example: `on_set = {
    add_tyranny = 10
}`,
  },
];

// Map for quick lookup
export const vassalObligationSchemaMap = new Map<string, FieldSchema>(
  vassalObligationSchema.map((field) => [field.name, field])
);

export function getVassalObligationFieldNames(): string[] {
  return vassalObligationSchema.map((field) => field.name);
}

export function getVassalObligationFieldDocumentation(fieldName: string): string | undefined {
  const field = vassalObligationSchemaMap.get(fieldName);
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
