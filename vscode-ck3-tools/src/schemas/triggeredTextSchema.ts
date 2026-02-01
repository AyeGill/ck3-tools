/**
 * Schema definition for CK3 Triggered Text - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const triggeredTextSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'key',
    type: 'string',
    description: 'Localization key for the triggered text.',
    example: 'key = "my_triggered_text"',
  },
  {
    name: 'text',
    type: 'string',
    description: 'Direct text to display.',
    example: 'text = "This is my text"',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this text to be selected.',
    example: `trigger = {
    is_male = yes
}`,
  },

  // Fallback
  {
    name: 'fallback',
    type: 'string',
    description: 'Fallback text if no triggers match.',
    example: 'fallback = "my_fallback_text"',
  },

  // Priority
  {
    name: 'weight_multiplier',
    type: 'block',
    description: 'Weight multiplier for text selection.',
    example: `weight_multiplier = {
    base = 1
    modifier = {
        add = 0.5
        has_trait = ambitious
    }
}`,
  },

  // First Valid
  {
    name: 'first_valid',
    type: 'block',
    description: 'List of text options, first valid is used.',
    example: `first_valid = {
    triggered_text = {
        trigger = { is_male = yes }
        text = "male_text"
    }
    triggered_text = {
        trigger = { is_female = yes }
        text = "female_text"
    }
}`,
  },

  // Random Valid
  {
    name: 'random_valid',
    type: 'block',
    description: 'List of text options, random valid is used.',
    example: `random_valid = {
    triggered_text = {
        trigger = { always = yes }
        text = "option_1"
    }
    triggered_text = {
        trigger = { always = yes }
        text = "option_2"
    }
}`,
  },
];

// Map for quick lookup
export const triggeredTextSchemaMap = new Map<string, FieldSchema>(
  triggeredTextSchema.map((field) => [field.name, field])
);

export function getTriggeredTextFieldNames(): string[] {
  return triggeredTextSchema.map((field) => field.name);
}

export function getTriggeredTextFieldDocumentation(fieldName: string): string | undefined {
  const field = triggeredTextSchemaMap.get(fieldName);
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
