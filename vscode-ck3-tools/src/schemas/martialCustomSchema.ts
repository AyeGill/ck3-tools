/**
 * Schema definition for CK3 Martial Customs - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const martialCustomSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the martial custom name.',
    example: 'name = "martial_custom_male_only"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the martial custom description.',
    example: 'desc = "martial_custom_male_only_desc"',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this martial custom.',
    example: 'icon = "gfx/interface/icons/culture_pillars/martial_custom.dds"',
  },

  // Type
  {
    name: 'martial_custom',
    type: 'enum',
    description: 'Type of martial custom.',
    values: ['martial_custom_male_only', 'martial_custom_female_only', 'martial_custom_equal'],
    example: 'martial_custom = martial_custom_male_only',
  },

  // Modifiers
  {
    name: 'character_modifier',
    type: 'block',
    description: 'Modifiers applied to characters with this custom.',
    example: `character_modifier = {
    prowess = 2
}`,
  },

  // Parameters
  {
    name: 'parameters',
    type: 'block',
    description: 'Special parameters enabled by this custom.',
    example: `parameters = {
    women_can_be_knights = no
    men_can_be_knights = yes
}`,
  },

  // Knight Rules
  {
    name: 'can_be_knight',
    type: 'trigger',
    description: 'Conditions for a character to be a knight.',
    example: `can_be_knight = {
    is_male = yes
}`,
  },
  {
    name: 'can_be_commander',
    type: 'trigger',
    description: 'Conditions for a character to be a commander.',
    example: `can_be_commander = {
    is_male = yes
}`,
  },

  // Combat
  {
    name: 'can_fight_in_combat',
    type: 'trigger',
    description: 'Conditions for a character to fight in combat.',
    example: `can_fight_in_combat = {
    OR = {
        is_male = yes
        has_trait = shieldmaiden
    }
}`,
  },
];

// Map for quick lookup
export const martialCustomSchemaMap = new Map<string, FieldSchema>(
  martialCustomSchema.map((field) => [field.name, field])
);

export function getMartialCustomFieldNames(): string[] {
  return martialCustomSchema.map((field) => field.name);
}

export function getMartialCustomFieldDocumentation(fieldName: string): string | undefined {
  const field = martialCustomSchemaMap.get(fieldName);
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
