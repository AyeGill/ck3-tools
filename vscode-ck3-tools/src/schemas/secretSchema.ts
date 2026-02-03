/**
 * Schema definition for CK3 Secret Types - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const SECRET_CATEGORIES = [
  'adultery',
  'civil',
  'deviancy',
  'merit',
  'murder',
  'raid',
  'religious',
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

  // Validity and conditions (trigger blocks)
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the secret to remain valid. If false, the secret is removed.',
    example: `is_valid = {
    secret_lover_is_valid_trigger = {
        OWNER = scope:secret_owner
    }
}`,
  },
  {
    name: 'is_shunned',
    type: 'trigger',
    description: 'Trigger block that determines if this secret causes shunning when exposed. Usually checks faith doctrines.',
    example: `is_shunned = {
    secret_lover_is_shunned_trigger = {
        OWNER = scope:secret_owner
    }
}`,
  },
  {
    name: 'is_criminal',
    type: 'trigger',
    description: 'Trigger block that determines if this secret is criminal when exposed. Usually checks faith doctrines.',
    example: `is_criminal = {
    secret_lover_is_criminal_trigger = {
        OWNER = scope:secret_owner
    }
}`,
  },

  // Effect blocks
  {
    name: 'on_expose',
    type: 'effect',
    description: 'Effects when the secret is exposed. Scope: secret. Common scopes: scope:secret_owner, scope:secret_exposer.',
    example: `on_expose = {
    save_scope_as = secret
    scope:secret_owner = {
        trigger_event = secrets.0001
    }
    secret_exposed_notification_effect = yes
}`,
  },
  {
    name: 'on_discover',
    type: 'effect',
    description: 'Effects when someone discovers the secret. Scope: secret. Common scopes: scope:secret_owner, scope:discoverer.',
    example: `on_discover = {
    scope:discoverer = {
        add_hook = {
            type = hook_secret
            target = scope:secret_owner
            secret = scope:secret
        }
    }
}`,
  },
  {
    name: 'on_owner_death',
    type: 'effect',
    description: 'Effects when the secret owner dies.',
    example: `on_owner_death = {
    # Handle inheritance or cleanup
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
