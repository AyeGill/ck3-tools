/**
 * Schema definition for CK3 Vassal Contracts - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const vassalContractSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'vassal_obligation_level',
    type: 'block',
    description: 'Define an obligation level.',
    example: `vassal_obligation_level = {
    default = yes

    tax_contribution = 0.1
    levy_contribution = 0.1

    vassal_opinion = -5
}`,
  },
  {
    name: 'default',
    type: 'boolean',
    description: 'Whether this is the default obligation level.',
    default: false,
    example: 'default = yes',
  },

  // Contributions
  {
    name: 'tax_contribution',
    type: 'float',
    description: 'Tax contribution percentage (0.0-1.0).',
    example: 'tax_contribution = 0.2',
  },
  {
    name: 'levy_contribution',
    type: 'float',
    description: 'Levy contribution percentage (0.0-1.0).',
    example: 'levy_contribution = 0.25',
  },

  // Opinion
  {
    name: 'vassal_opinion',
    type: 'integer',
    description: 'Opinion modifier from this obligation.',
    example: 'vassal_opinion = -10',
  },

  // Conditions
  {
    name: 'is_shown',
    type: 'trigger',
    description: 'Conditions for this contract type to be shown.',
    example: `is_shown = {
    scope:vassal = { is_landed = yes }
}`,
  },
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for this contract to be valid.',
    example: `is_valid = {
    scope:liege = { government_has_flag = government_is_feudal }
}`,
  },
  {
    name: 'can_change',
    type: 'trigger',
    description: 'Conditions for being able to change this contract.',
    example: `can_change = {
    NOT = { scope:vassal = { has_character_flag = contract_locked } }
}`,
  },

  // Flags
  {
    name: 'flag',
    type: 'string',
    description: 'Flag set when this contract is active.',
    example: 'flag = has_special_contract',
  },

  // Effects
  {
    name: 'on_change',
    type: 'effect',
    description: 'Effects when the contract is changed.',
    example: `on_change = {
    scope:vassal = {
        add_opinion = {
            target = scope:liege
            modifier = changed_contract_opinion
        }
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI preference for this contract level.',
    example: `ai_will_do = {
    value = 100
    if = {
        limit = { scope:liege = { is_at_war = yes } }
        add = 50
    }
}`,
  },
];

// Schema for vassal obligation types
export const vassalObligationSchema: FieldSchema[] = [
  {
    name: 'level',
    type: 'block',
    description: 'An obligation level.',
    example: `level = {
    tax_contribution = 0.0
    levy_contribution = 0.0
    vassal_opinion = 0
}`,
  },
  {
    name: 'can_select',
    type: 'trigger',
    description: 'Conditions to select this obligation.',
    example: `can_select = {
    NOT = { has_hook = scope:vassal }
}`,
  },
];

// Map for quick lookup
export const vassalContractSchemaMap = new Map<string, FieldSchema>(
  vassalContractSchema.map((field) => [field.name, field])
);

export const vassalObligationSchemaMap = new Map<string, FieldSchema>(
  vassalObligationSchema.map((field) => [field.name, field])
);

export function getVassalContractFieldNames(): string[] {
  return vassalContractSchema.map((field) => field.name);
}

export function getVassalContractFieldDocumentation(fieldName: string): string | undefined {
  const field = vassalContractSchemaMap.get(fieldName);
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
