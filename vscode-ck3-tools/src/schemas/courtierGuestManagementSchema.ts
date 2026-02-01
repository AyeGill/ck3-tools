/**
 * Schema definition for CK3 Courtier/Guest Management - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const courtierGuestManagementSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'management_type',
    type: 'enum',
    description: 'Type of management setting.',
    values: ['courtier', 'guest', 'prisoner'],
    example: 'management_type = courtier',
  },

  // Actions
  {
    name: 'recruit',
    type: 'block',
    description: 'Settings for recruiting.',
    example: `recruit = {
    can_recruit = {
        gold >= 10
    }
    cost = {
        gold = 10
    }
}`,
  },
  {
    name: 'dismiss',
    type: 'block',
    description: 'Settings for dismissing.',
    example: `dismiss = {
    can_dismiss = {
        NOT = { is_spouse_of = root }
    }
}`,
  },
  {
    name: 'imprison',
    type: 'block',
    description: 'Settings for imprisoning.',
    example: `imprison = {
    can_imprison = {
        has_hook = scope:target
    }
}`,
  },

  // Filters
  {
    name: 'list_filter',
    type: 'trigger',
    description: 'Filter for displaying in lists.',
    example: `list_filter = {
    is_adult = yes
}`,
  },
  {
    name: 'sort_order',
    type: 'block',
    description: 'Sorting order settings.',
    example: `sort_order = {
    opinion = yes
    skills = yes
}`,
  },

  // On actions
  {
    name: 'on_join_court',
    type: 'effect',
    description: 'Effects when joining the court.',
    example: `on_join_court = {
    add_opinion = {
        target = scope:liege
        modifier = grateful_to_liege
    }
}`,
  },
  {
    name: 'on_leave_court',
    type: 'effect',
    description: 'Effects when leaving the court.',
    example: `on_leave_court = {
    remove_opinion = {
        target = scope:liege
        modifier = grateful_to_liege
    }
}`,
  },

  // AI
  {
    name: 'ai_will_do',
    type: 'block',
    description: 'AI evaluation for management actions.',
    example: `ai_will_do = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const courtierGuestManagementSchemaMap = new Map<string, FieldSchema>(
  courtierGuestManagementSchema.map((field) => [field.name, field])
);

export function getCourtierGuestManagementFieldNames(): string[] {
  return courtierGuestManagementSchema.map((field) => field.name);
}

export function getCourtierGuestManagementFieldDocumentation(fieldName: string): string | undefined {
  const field = courtierGuestManagementSchemaMap.get(fieldName);
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
