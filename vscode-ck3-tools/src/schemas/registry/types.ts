/**
 * Unified schema registry types
 *
 * These types define the interface for the centralized schema registry
 * that replaces the three separate implementations in CompletionProvider,
 * DiagnosticsProvider, and HoverProvider.
 */

import { ScopeType } from '../../data/scopes';

/**
 * Schema definition for a single field - powers autocomplete and hover documentation
 */
export interface FieldSchema {
  name: string;
  type: 'boolean' | 'integer' | 'float' | 'string' | 'enum' | 'block' | 'trigger' | 'effect' | 'modifier' | 'list';
  description: string;
  values?: string[];
  default?: string | number | boolean;
  min?: number;
  max?: number;
  required?: boolean;
  children?: FieldSchema[];
  example?: string;
  /**
   * If true, this is a "wildcard" entry allowing any valid item of this type.
   * Use with type: 'trigger' to accept any trigger, or type: 'effect' to accept any effect.
   * The 'name' field is ignored for wildcard entries during validation.
   */
  isWildcard?: boolean;
}

/**
 * Configuration for a registered file type
 */
export interface SchemaRegistryEntry {
  /** Unique file type identifier */
  fileType: string;

  /** File path patterns that match this type (e.g., '/common/traits/') */
  patterns: string[];

  /** Schema array (for completion iteration) - schemaMap derived on demand */
  schema: FieldSchema[];

  /** Initial scope for this file type (default: 'character') */
  initialScope?: ScopeType;

  /**
   * Optional context-aware schema resolver for nested blocks.
   * Called when blockPath is non-empty to get the schema for a specific
   * nested context (e.g., event options, decision costs).
   */
  getSchemaForContext?: (blockPath: string[]) => FieldSchema[];
}

/**
 * Result of a schema lookup
 */
export interface SchemaLookupResult {
  /** The matched file type */
  fileType: string;

  /** Schema array for iteration/completion */
  schema: FieldSchema[];

  /** Schema map for O(1) field lookup (derived from schema array) */
  schemaMap: Map<string, FieldSchema>;

  /** Initial scope for this file type */
  initialScope: ScopeType;

  /** Context resolver if available */
  getSchemaForContext?: (blockPath: string[]) => FieldSchema[];
}
