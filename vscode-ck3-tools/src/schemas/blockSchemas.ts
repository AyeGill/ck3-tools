/**
 * Schema definitions for special block parameters
 *
 * Replaces the coarse DYNAMIC_KEY_BLOCKS set with fine-grained validation.
 */

import { FieldSchema } from './registry/types';
import { eventOptionSchema } from './eventSchema';

/**
 * How to validate children inside a block
 */
export type ChildValidationMode =
  | 'none'            // Pure dynamic keys - skip all validation
  | 'schema-only'     // Only schema fields allowed, flag unknown fields
  | 'schema+effects'; // Schema fields + effects allowed

/**
 * Configuration for how to validate a block's contents
 */
export interface BlockSchemaConfig {
  childValidation: ChildValidationMode;
  /** Schema fields for this block (used by schema-only and schema+effects) */
  schemaFields?: FieldSchema[];
}

// ============================================================================
// Schema-only block schemas
// ============================================================================

const menAtArmsSchema: FieldSchema[] = [
  { name: 'type', type: 'string', description: 'Men-at-arms regiment type key' },
  { name: 'men', type: 'integer', description: 'Number of men' },
  { name: 'stacks', type: 'integer', description: 'Number of stacks' },
  { name: 'inheritable', type: 'boolean', description: 'Whether the regiment is inheritable' },
];

const leviesSchema: FieldSchema[] = [
  { name: 'value', type: 'integer', description: 'Base value' },
  { name: 'add', type: 'integer', description: 'Value to add' },
  { name: 'multiply', type: 'float', description: 'Multiplier' },
  { name: 'min', type: 'integer', description: 'Minimum value' },
  { name: 'max', type: 'integer', description: 'Maximum value' },
];

const opinionSchema: FieldSchema[] = [
  { name: 'modifier', type: 'string', description: 'Opinion modifier key' },
  { name: 'opinion', type: 'integer', description: 'Opinion value' },
  { name: 'target', type: 'string', description: 'Target character scope' },
  { name: 'years', type: 'integer', description: 'Duration in years' },
  { name: 'months', type: 'integer', description: 'Duration in months' },
  { name: 'days', type: 'integer', description: 'Duration in days' },
  // Script value fields for dynamic opinion calculations
  { name: 'value', type: 'integer', description: 'Base value for script value calculation' },
  { name: 'add', type: 'integer', description: 'Value to add' },
  { name: 'multiply', type: 'float', description: 'Multiplier' },
  { name: 'divide', type: 'float', description: 'Divisor' },
  { name: 'min', type: 'integer', description: 'Minimum value' },
  { name: 'max', type: 'integer', description: 'Maximum value' },
  { name: 'integer_range', type: 'block', description: 'Random integer range' },
];

const historySchema: FieldSchema[] = [
  { name: 'type', type: 'string', description: 'History entry type' },
  { name: 'date', type: 'string', description: 'Date of the event' },
  { name: 'actor', type: 'string', description: 'Actor character scope' },
  { name: 'recipient', type: 'string', description: 'Recipient character scope' },
  { name: 'location', type: 'string', description: 'Location scope' },
];

const subRegionSchema: FieldSchema[] = [
  { name: 'key', type: 'string', description: 'Sub-region key' },
  { name: 'start_phase', type: 'string', description: 'Starting phase' },
  { name: 'geographical_regions', type: 'list', description: 'List of geographical regions' },
  { name: 'map_color', type: 'string', description: 'Color on the map' },
];

const triggeredDescSchema: FieldSchema[] = [
  { name: 'trigger', type: 'trigger', description: 'Condition for this description' },
  { name: 'desc', type: 'string', description: 'Localization key for description' },
];

const descBlockSchema: FieldSchema[] = [
  { name: 'first_valid', type: 'block', description: 'First matching condition block' },
  { name: 'random_valid', type: 'block', description: 'Random selection block' },
  { name: 'triggered_desc', type: 'block', description: 'Conditional description' },
  { name: 'trigger', type: 'trigger', description: 'Condition' },
  { name: 'desc', type: 'string', description: 'Localization key' },
  { name: 'text', type: 'string', description: 'Text/localization key' },
];

const firstValidSchema: FieldSchema[] = [
  { name: 'triggered_desc', type: 'block', description: 'Conditional description' },
  { name: 'desc', type: 'string', description: 'Fallback localization key' },
  { name: 'random_valid', type: 'block', description: 'Nested random selection' },
];

const randomValidSchema: FieldSchema[] = [
  { name: 'triggered_desc', type: 'block', description: 'Conditional description' },
  { name: 'desc', type: 'string', description: 'Fallback localization key' },
];

// ============================================================================
// Block schema registry
// ============================================================================

export const BLOCK_SCHEMAS = new Map<string, BlockSchemaConfig>([
  // Pure dynamic key blocks - skip all validation
  ['stress_impact', { childValidation: 'none' }],
  ['switch', { childValidation: 'none' }],
  ['random_list', { childValidation: 'none' }],
  ['random_traits_list', { childValidation: 'none' }],
  ['participants', { childValidation: 'none' }],
  ['properties', { childValidation: 'none' }],
  ['ai_frequency_by_tier', { childValidation: 'none' }],
  // These need separate investigation later
  ['ai_value_modifier', { childValidation: 'none' }],
  ['compare_value', { childValidation: 'none' }],
  ['value', { childValidation: 'none' }],

  // Schema-only blocks - validate against fixed schema
  ['men_at_arms', { childValidation: 'schema-only', schemaFields: menAtArmsSchema }],
  ['levies', { childValidation: 'schema-only', schemaFields: leviesSchema }],
  ['opinion', { childValidation: 'schema-only', schemaFields: opinionSchema }],
  ['history', { childValidation: 'schema-only', schemaFields: historySchema }],
  ['sub_region', { childValidation: 'schema-only', schemaFields: subRegionSchema }],
  ['triggered_desc', { childValidation: 'schema-only', schemaFields: triggeredDescSchema }],

  // Conditional/localization blocks - validate against schema
  ['desc', { childValidation: 'schema-only', schemaFields: descBlockSchema }],
  ['name', { childValidation: 'schema-only', schemaFields: descBlockSchema }],
  ['first_valid', { childValidation: 'schema-only', schemaFields: firstValidSchema }],
  ['random_valid', { childValidation: 'schema-only', schemaFields: randomValidSchema }],

  // Hybrid blocks - schema fields + effects
  ['option', { childValidation: 'schema+effects', schemaFields: eventOptionSchema }],
]);

/**
 * Get a schema map for quick field lookup in a block
 */
export function getBlockSchemaMap(blockName: string): Map<string, FieldSchema> | undefined {
  const config = BLOCK_SCHEMAS.get(blockName);
  if (!config?.schemaFields) {
    return undefined;
  }
  return new Map(config.schemaFields.map(f => [f.name, f]));
}
