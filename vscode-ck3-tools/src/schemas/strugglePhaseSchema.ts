/**
 * Schema definition for CK3 Struggle Phases - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const strugglePhaseSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the phase name.',
    example: 'name = "struggle_phase_hostility"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "struggle_phase_hostility_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this phase.',
    example: 'icon = "gfx/interface/icons/struggle/phase_hostility.dds"',
  },

  // Background
  {
    name: 'background',
    type: 'string',
    description: 'Background image for this phase.',
    example: 'background = "gfx/interface/illustrations/struggle/hostility.dds"',
  },

  // Transitions
  {
    name: 'next_phases',
    type: 'list',
    description: 'Phases that can follow this one.',
    example: `next_phases = {
    struggle_phase_tension
    struggle_phase_compromise
}`,
  },
  {
    name: 'transition_threshold',
    type: 'float',
    description: 'Progress threshold for transition.',
    example: 'transition_threshold = 100',
  },

  // Modifiers
  {
    name: 'involved_modifier',
    type: 'block',
    description: 'Modifiers for involved characters.',
    example: `involved_modifier = {
    monthly_prestige = 0.5
}`,
  },
  {
    name: 'interloper_modifier',
    type: 'block',
    description: 'Modifiers for interlopers.',
    example: `interloper_modifier = {
    monthly_prestige = -0.2
}`,
  },

  // Catalyst Weights
  {
    name: 'catalyst_multipliers',
    type: 'block',
    description: 'Catalyst weight multipliers for this phase.',
    example: `catalyst_multipliers = {
    catalyst_war = 2.0
    catalyst_marriage = 0.5
}`,
  },

  // Effects
  {
    name: 'on_phase_start',
    type: 'effect',
    description: 'Effects when phase starts.',
    example: `on_phase_start = {
    trigger_event = struggle_events.1000
}`,
  },
  {
    name: 'on_phase_end',
    type: 'effect',
    description: 'Effects when phase ends.',
    example: `on_phase_end = {
    add_prestige = 100
}`,
  },

  // Decisions
  {
    name: 'available_decisions',
    type: 'list',
    description: 'Decisions available in this phase.',
    example: `available_decisions = {
    decision_hostility_action
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for phase to be active.',
    example: `potential = {
    struggle_progress >= 50
}`,
  },

  // AI
  {
    name: 'ai_desire',
    type: 'block',
    description: 'AI desire for this phase.',
    example: `ai_desire = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const strugglePhaseSchemaMap = new Map<string, FieldSchema>(
  strugglePhaseSchema.map((field) => [field.name, field])
);

export function getStrugglePhaseFieldNames(): string[] {
  return strugglePhaseSchema.map((field) => field.name);
}

export function getStrugglePhaseFieldDocumentation(fieldName: string): string | undefined {
  const field = strugglePhaseSchemaMap.get(fieldName);
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
