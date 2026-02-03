/**
 * Schema definition for CK3 Artifacts - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const ARTIFACT_SLOTS = [
  'primary_armament',
  'armor',
  'regalia',
  'helmet',
  'miscellaneous',
  // Court artifact slots
  'book',
  'journal',
  'pedestal',
  'sculpture',
  'throne',
  'wall_big',
  'wall_small',
] as const;

export const ARTIFACT_RARITIES = [
  'common',
  'masterwork',
  'famed',
  'illustrious',
] as const;

export const ARTIFACT_TYPES = [
  'weapon',
  'armor',
  'regalia',
  'trinket',
  'book',
  'relic',
] as const;

export const artifactSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'slot',
    type: 'enum',
    description: 'The equipment slot this artifact occupies.',
    values: [...ARTIFACT_SLOTS],
    required: true,
    example: 'slot = primary_armament',
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Icon path for the artifact.',
    example: 'icon = "gfx/interface/icons/artifacts/sword.dds"',
  },
  {
    name: 'asset',
    type: 'block',
    description: 'Visual asset for the artifact.',
    example: `asset = {
    type = pdxmesh
    name = "artifact_sword_mesh"
}`,
  },
  {
    name: 'unique',
    type: 'boolean',
    description: 'If yes, only one can exist at a time.',
    default: false,
    example: 'unique = yes',
  },
  // Modifiers
  {
    name: 'court_grandeur_baseline_add',
    type: 'integer',
    description: 'Bonus to court grandeur baseline.',
    example: 'court_grandeur_baseline_add = 5',
  },

  // Triggers
  {
    name: 'can_equip',
    type: 'trigger',
    description: 'Conditions for equipping this artifact.',
    example: `can_equip = {
    is_adult = yes
    NOT = { has_trait = incapable }
}`,
  },
  {
    name: 'can_benefit',
    type: 'trigger',
    description: 'Conditions for gaining benefits from this artifact.',
    example: `can_benefit = {
    is_ruler = yes
}`,
  },

  // Artifact type and category
  {
    name: 'type',
    type: 'string',
    description: 'The type of artifact.',
  },
  {
    name: 'category',
    type: 'string',
    description: 'The category of artifact.',
  },
  {
    name: 'group',
    type: 'string',
    description: 'The artifact group for categorization.',
  },

  // Repair and reforge
  {
    name: 'can_repair',
    type: 'boolean',
    description: 'Whether the artifact can be repaired.',
  },
  {
    name: 'can_reforge',
    type: 'boolean',
    description: 'Whether the artifact can be reforged.',
  },

  // Visual configuration
  {
    name: 'default_type',
    type: 'string',
    description: 'Default visual type for the artifact.',
  },
  {
    name: 'default_visuals',
    type: 'string',
    description: 'Default visual configuration for the artifact.',
  },
  {
    name: 'in_type',
    type: 'string',
    description: 'Input type for artifact transformation.',
  },
  {
    name: 'in_visuals',
    type: 'string',
    description: 'Input visuals for artifact transformation.',
  },
  {
    name: 'out_type',
    type: 'string',
    description: 'Output type for artifact transformation.',
  },
  {
    name: 'out_visuals',
    type: 'string',
    description: 'Output visuals for artifact transformation.',
  },
  {
    name: 'pedestal',
    type: 'string',
    description: 'Pedestal type for displaying the artifact in court.',
  },
  {
    name: 'support_type',
    type: 'string',
    description: 'Support type for the artifact visual.',
  },
  {
    name: 'fallback',
    type: 'string',
    description: 'Fallback artifact type if conditions are not met.',
  },

  // Features and modifiers
  {
    name: 'required_features',
    type: 'block',
    description: 'Features required for this artifact.',
  },
  {
    name: 'optional_features',
    type: 'block',
    description: 'Optional features for this artifact.',
  },
  {
    name: 'disallowed_modifiers',
    type: 'block',
    description: 'Modifiers that cannot be applied to this artifact.',
  },
  {
    name: 'replacement_modifiers',
    type: 'block',
    description: 'Replacement modifiers for this artifact.',
  },
];

// Schema for artifact templates (used for spawning)
export const artifactTemplateSchema: FieldSchema[] = [
  ...artifactSchema,
];

// Map for quick lookup
export const artifactSchemaMap = new Map<string, FieldSchema>(
  artifactSchema.map((field) => [field.name, field])
);

export const artifactTemplateSchemaMap = new Map<string, FieldSchema>(
  artifactTemplateSchema.map((field) => [field.name, field])
);

// Get all field names for completion
export function getArtifactFieldNames(): string[] {
  return artifactSchema.map((field) => field.name);
}

// Get documentation for a field
export function getArtifactFieldDocumentation(fieldName: string): string | undefined {
  const field = artifactSchemaMap.get(fieldName);
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
