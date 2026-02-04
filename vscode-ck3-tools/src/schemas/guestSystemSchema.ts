/**
 * Schema definition for CK3 Guest System - powers autocomplete and hover documentation
 */

import { FieldSchema } from './registry/types';

export const guestSystemSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'guest_arrival_chance',
    type: 'block',
    description: 'Chance for a guest to arrive.',
    example: `guest_arrival_chance = {
    base = 0.5
    modifier = {
        add = 0.2
        has_perk = gracious_host_perk
    }
}`,
  },
  {
    name: 'guest_departure_chance',
    type: 'block',
    description: 'Chance for a guest to depart.',
    example: `guest_departure_chance = {
    base = 0.1
    modifier = {
        add = 0.2
        has_negative_opinion_modifier = yes
    }
}`,
  },

  // Guest generation
  {
    name: 'guest_types',
    type: 'list',
    description: 'Types of guests that can be generated.',
    example: `guest_types = {
    wanderer
    pilgrim
    scholar
}`,
  },

  // Triggers
  {
    name: 'can_receive_guests',
    type: 'trigger',
    description: 'Conditions for being able to receive guests.',
    example: `can_receive_guests = {
    is_ruler = yes
    is_landed = yes
}`,
  },
  {
    name: 'guest_pool_filter',
    type: 'trigger',
    description: 'Filter for the guest pool.',
    example: `guest_pool_filter = {
    is_adult = yes
    is_alive = yes
}`,
  },

  // On actions
  {
    name: 'on_guest_arrival',
    type: 'effect',
    description: 'Effects when a guest arrives.',
    example: `on_guest_arrival = {
    trigger_event = guest_events.001
}`,
  },
  {
    name: 'on_guest_departure',
    type: 'effect',
    description: 'Effects when a guest departs.',
    example: `on_guest_departure = {
    trigger_event = guest_events.100
}`,
  },

  // Guest quality
  {
    name: 'guest_quality_weight',
    type: 'block',
    description: 'Weight for guest quality.',
    example: `guest_quality_weight = {
    base = 100
    modifier = {
        add = 50
        prestige >= 1000
    }
}`,
  },
];

// Map for quick lookup
export const guestSystemSchemaMap = new Map<string, FieldSchema>(
  guestSystemSchema.map((field) => [field.name, field])
);

export function getGuestSystemFieldNames(): string[] {
  return guestSystemSchema.map((field) => field.name);
}

export function getGuestSystemFieldDocumentation(fieldName: string): string | undefined {
  const field = guestSystemSchemaMap.get(fieldName);
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
