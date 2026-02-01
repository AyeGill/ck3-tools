/**
 * CK3 Data Layer
 *
 * This module provides structured data about CK3 scripting elements:
 * - Scopes (context types like character, title, etc.)
 * - Effects (commands that modify game state)
 * - Triggers (conditions that evaluate to true/false)
 *
 * Data is auto-generated from OldEnt's documentation repository.
 * Run `npx ts-node src/data/parser/parseOldEnt.ts` to regenerate.
 */

export * from './scopes';
export * from './effects.generated';
export * from './triggers.generated';
