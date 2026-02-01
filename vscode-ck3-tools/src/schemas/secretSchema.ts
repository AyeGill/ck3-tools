/**
 * Schema definition for CK3 Secret Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const SECRET_CATEGORIES = [
  'adultery',
  'murder',
  'crime',
  'religious',
  'other',
] as const;

export const secretSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'category',
    type: 'enum',
    description: 'Category of the secret.',
    values: [...SECRET_CATEGORIES],
    example: 'category = adultery',
  },
  {
    name: 'is_shunned',
    type: 'boolean',
    description: 'Whether this secret causes shunning if revealed.',
    default: false,
    example: 'is_shunned = yes',
  },
  {
    name: 'is_criminal',
    type: 'boolean',
    description: 'Whether this secret is a crime.',
    default: false,
    example: 'is_criminal = yes',
  },

  // Exposure
  {
    name: 'on_expose',
    type: 'effect',
    description: 'Effects when the secret is exposed.',
    example: `on_expose = {
    scope:owner = {
        add_stress = 50
    }
    scope:target = {
        add_opinion = {
            target = scope:owner
            modifier = exposed_secret_opinion
        }
    }
}`,
  },
  {
    name: 'on_discover',
    type: 'effect',
    description: 'Effects when someone discovers the secret.',
    example: `on_discover = {
    scope:discoverer = {
        add_hook = {
            type = hook_secret
            target = scope:owner
            secret = scope:secret
        }
    }
}`,
  },
  {
    name: 'on_owner_death',
    type: 'effect',
    description: 'Effects when the secret owner dies.',
    example: 'on_owner_death = { }',
  },

  // Validity
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the secret to remain valid.',
    example: `is_valid = {
    scope:owner = { is_alive = yes }
    scope:target = { is_alive = yes }
}`,
  },
  {
    name: 'is_known',
    type: 'trigger',
    description: 'Conditions for the secret to be public knowledge.',
    example: `is_known = {
    scope:owner = {
        has_character_flag = publicly_known_adultery
    }
}`,
  },

  // Blackmail
  {
    name: 'blackmail_valid',
    type: 'trigger',
    description: 'Conditions for blackmail to be valid.',
    example: `blackmail_valid = {
    scope:blackmailer = {
        NOT = { this = scope:owner }
    }
}`,
  },

  // AI
  {
    name: 'ai_will_expose',
    type: 'trigger',
    description: 'AI decision to expose the secret.',
    example: `ai_will_expose = {
    scope:exposer = {
        opinion = { target = scope:owner value < -50 }
    }
}`,
  },
];

// Map for quick lookup
export const secretSchemaMap = new Map<string, FieldSchema>(
  secretSchema.map((field) => [field.name, field])
);

export function getSecretFieldNames(): string[] {
  return secretSchema.map((field) => field.name);
}

export function getSecretFieldDocumentation(fieldName: string): string | undefined {
  const field = secretSchemaMap.get(fieldName);
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
