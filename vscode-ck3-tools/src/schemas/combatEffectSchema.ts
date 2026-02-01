/**
 * Schema definition for CK3 Combat Effects - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const combatEffectSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the combat effect.',
    example: 'name = "combat_effect_flanking"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "combat_effect_flanking_desc"',
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for the combat effect.',
    example: 'icon = "gfx/interface/icons/combat_effects/flanking.dds"',
  },

  // Combat Modifiers
  {
    name: 'damage',
    type: 'float',
    description: 'Damage modifier.',
    example: 'damage = 0.2',
  },
  {
    name: 'toughness',
    type: 'float',
    description: 'Toughness modifier.',
    example: 'toughness = 0.1',
  },
  {
    name: 'pursuit',
    type: 'float',
    description: 'Pursuit modifier.',
    example: 'pursuit = 0.3',
  },
  {
    name: 'screen',
    type: 'float',
    description: 'Screen modifier.',
    example: 'screen = 0.2',
  },

  // Advantage
  {
    name: 'advantage',
    type: 'integer',
    description: 'Combat advantage bonus.',
    example: 'advantage = 5',
  },

  // Phase
  {
    name: 'phase',
    type: 'enum',
    description: 'Combat phase this applies to.',
    values: ['opening', 'skirmish', 'main', 'pursuit', 'all'],
    example: 'phase = main',
  },

  // Trigger
  {
    name: 'trigger',
    type: 'trigger',
    description: 'Conditions for this effect to apply.',
    example: `trigger = {
    commander = {
        martial >= 15
    }
}`,
  },

  // Duration
  {
    name: 'duration',
    type: 'integer',
    description: 'Duration in days.',
    example: 'duration = 30',
  },

  // Stacking
  {
    name: 'stacking',
    type: 'boolean',
    description: 'Whether this effect stacks.',
    default: false,
    example: 'stacking = no',
  },

  // Target
  {
    name: 'target',
    type: 'enum',
    description: 'Who this effect targets.',
    values: ['self', 'enemy', 'both'],
    example: 'target = self',
  },

  // Casualties
  {
    name: 'casualty_modifier',
    type: 'float',
    description: 'Casualty rate modifier.',
    example: 'casualty_modifier = -0.1',
  },

  // AI
  {
    name: 'ai_value',
    type: 'block',
    description: 'AI value for this effect.',
    example: `ai_value = {
    base = 100
}`,
  },
];

// Map for quick lookup
export const combatEffectSchemaMap = new Map<string, FieldSchema>(
  combatEffectSchema.map((field) => [field.name, field])
);

export function getCombatEffectFieldNames(): string[] {
  return combatEffectSchema.map((field) => field.name);
}

export function getCombatEffectFieldDocumentation(fieldName: string): string | undefined {
  const field = combatEffectSchemaMap.get(fieldName);
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
