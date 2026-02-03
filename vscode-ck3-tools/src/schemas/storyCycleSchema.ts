/**
 * Schema definition for CK3 Story Cycles - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const storyCycleSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'on_setup',
    type: 'effect',
    description: 'Effects when the story cycle is set up.',
    example: `on_setup = {
    save_scope_as = story_owner
    set_variable = {
        name = story_progress
        value = 0
    }
}`,
  },
  {
    name: 'on_end',
    type: 'effect',
    description: 'Effects when the story cycle ends.',
    example: `on_end = {
    remove_variable = story_progress
}`,
  },
  {
    name: 'on_owner_death',
    type: 'effect',
    description: 'Effects when the story owner dies.',
    example: `on_owner_death = {
    end_story = yes
}`,
  },

  // Validity
  {
    name: 'is_valid',
    type: 'trigger',
    description: 'Conditions for the story to remain valid.',
    example: `is_valid = {
    exists = story_owner
    story_owner = { is_alive = yes }
}`,
  },

  // Effects
  {
    name: 'effect_group',
    type: 'block',
    description: 'A group of effects that can trigger.',
    example: `effect_group = {
    days = { 30 60 }
    trigger = {
        story_owner = { is_available = yes }
    }
    effect = {
        trigger_event = story_event.001
    }
}`,
  },

];

// Map for quick lookup
export const storyCycleSchemaMap = new Map<string, FieldSchema>(
  storyCycleSchema.map((field) => [field.name, field])
);

export function getStoryCycleFieldNames(): string[] {
  return storyCycleSchema.map((field) => field.name);
}

export function getStoryCycleFieldDocumentation(fieldName: string): string | undefined {
  const field = storyCycleSchemaMap.get(fieldName);
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
