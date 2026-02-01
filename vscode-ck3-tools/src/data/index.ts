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
 *
 * Scope-changing effects (liege, father, etc.) are manually maintained
 * and merged with the generated data.
 */

export * from './scopes';

// Re-export types from generated files
export { EffectDefinition } from './effects.generated';
export { TriggerDefinition } from './triggers.generated';

// Import generated data
import {
  allEffects as generatedEffects,
  getEffectsForScope as generatedGetEffectsForScope,
  effectsMap as generatedEffectsMap,
  EffectDefinition,
} from './effects.generated';

import {
  allTriggers as generatedTriggers,
  getTriggersForScope as generatedGetTriggersForScope,
  triggersMap as generatedTriggersMap,
  TriggerDefinition,
} from './triggers.generated';

import { ScopeType } from './scopes';

/**
 * Scope-changing effects (not iterators, but change scope to a single target)
 * These are manually maintained because OldEnt's data doesn't include them with outputScope
 */
const scopeChangeEffects: EffectDefinition[] = [
  { name: 'liege', description: 'Change scope to liege', supportedScopes: ['character'], outputScope: 'character', syntax: 'liege = { <effects> }' },
  { name: 'father', description: 'Change scope to father', supportedScopes: ['character'], outputScope: 'character', syntax: 'father = { <effects> }' },
  { name: 'mother', description: 'Change scope to mother', supportedScopes: ['character'], outputScope: 'character', syntax: 'mother = { <effects> }' },
  { name: 'primary_spouse', description: 'Change scope to primary spouse', supportedScopes: ['character'], outputScope: 'character', syntax: 'primary_spouse = { <effects> }' },
  { name: 'primary_heir', description: 'Change scope to primary heir', supportedScopes: ['character'], outputScope: 'character', syntax: 'primary_heir = { <effects> }' },
  { name: 'primary_title', description: 'Change scope to primary title', supportedScopes: ['character'], outputScope: 'landed_title', syntax: 'primary_title = { <effects> }' },
  { name: 'capital_county', description: 'Change scope to capital county', supportedScopes: ['character'], outputScope: 'landed_title', syntax: 'capital_county = { <effects> }' },
  { name: 'capital_province', description: 'Change scope to capital province', supportedScopes: ['character'], outputScope: 'province', syntax: 'capital_province = { <effects> }' },
  { name: 'dynasty', description: 'Change scope to dynasty', supportedScopes: ['character'], outputScope: 'dynasty', syntax: 'dynasty = { <effects> }' },
  { name: 'house', description: 'Change scope to house', supportedScopes: ['character'], outputScope: 'dynasty_house', syntax: 'house = { <effects> }' },
  { name: 'faith', description: 'Change scope to faith', supportedScopes: ['character'], outputScope: 'faith', syntax: 'faith = { <effects> }' },
  { name: 'culture', description: 'Change scope to culture', supportedScopes: ['character'], outputScope: 'culture', syntax: 'culture = { <effects> }' },
  { name: 'holder', description: 'Change scope to title holder', supportedScopes: ['landed_title'], outputScope: 'character', syntax: 'holder = { <effects> }' },
  { name: 'de_jure_liege', description: 'Change scope to de jure liege title', supportedScopes: ['landed_title'], outputScope: 'landed_title', syntax: 'de_jure_liege = { <effects> }' },
  { name: 'county', description: 'Change scope to county from province', supportedScopes: ['province'], outputScope: 'landed_title', syntax: 'county = { <effects> }' },
  { name: 'root', description: 'Change scope back to root (event owner)', supportedScopes: ['none'], outputScope: 'character', syntax: 'root = { <effects> }' },
  { name: 'prev', description: 'Change scope to previous scope', supportedScopes: ['none'], syntax: 'prev = { <effects> }' },
  { name: 'this', description: 'Reference current scope explicitly', supportedScopes: ['none'], syntax: 'this = { <effects> }' },
];

/**
 * Scope-changing triggers (parallel to effects, used in trigger blocks)
 */
const scopeChangeTriggers: TriggerDefinition[] = [
  { name: 'liege', description: 'Check triggers on liege', supportedScopes: ['character'], outputScope: 'character', syntax: 'liege = { <triggers> }' },
  { name: 'father', description: 'Check triggers on father', supportedScopes: ['character'], outputScope: 'character', syntax: 'father = { <triggers> }' },
  { name: 'mother', description: 'Check triggers on mother', supportedScopes: ['character'], outputScope: 'character', syntax: 'mother = { <triggers> }' },
  { name: 'primary_spouse', description: 'Check triggers on primary spouse', supportedScopes: ['character'], outputScope: 'character', syntax: 'primary_spouse = { <triggers> }' },
  { name: 'primary_heir', description: 'Check triggers on primary heir', supportedScopes: ['character'], outputScope: 'character', syntax: 'primary_heir = { <triggers> }' },
  { name: 'primary_title', description: 'Check triggers on primary title', supportedScopes: ['character'], outputScope: 'landed_title', syntax: 'primary_title = { <triggers> }' },
  { name: 'capital_county', description: 'Check triggers on capital county', supportedScopes: ['character'], outputScope: 'landed_title', syntax: 'capital_county = { <triggers> }' },
  { name: 'capital_province', description: 'Change scope to capital province', supportedScopes: ['character'], outputScope: 'province', syntax: 'capital_province = { <triggers> }' },
  { name: 'dynasty', description: 'Check triggers on dynasty', supportedScopes: ['character'], outputScope: 'dynasty', syntax: 'dynasty = { <triggers> }' },
  { name: 'house', description: 'Check triggers on house', supportedScopes: ['character'], outputScope: 'dynasty_house', syntax: 'house = { <triggers> }' },
  { name: 'faith', description: 'Check triggers on faith', supportedScopes: ['character'], outputScope: 'faith', syntax: 'faith = { <triggers> }' },
  { name: 'culture', description: 'Check triggers on culture', supportedScopes: ['character'], outputScope: 'culture', syntax: 'culture = { <triggers> }' },
  { name: 'holder', description: 'Check triggers on title holder', supportedScopes: ['landed_title'], outputScope: 'character', syntax: 'holder = { <triggers> }' },
  { name: 'de_jure_liege', description: 'Check triggers on de jure liege title', supportedScopes: ['landed_title'], outputScope: 'landed_title', syntax: 'de_jure_liege = { <triggers> }' },
  { name: 'county', description: 'Check triggers on county from province', supportedScopes: ['province'], outputScope: 'landed_title', syntax: 'county = { <triggers> }' },
  { name: 'root', description: 'Check triggers on root (event owner)', supportedScopes: ['none'], outputScope: 'character', syntax: 'root = { <triggers> }' },
  { name: 'prev', description: 'Check triggers on previous scope', supportedScopes: ['none'], syntax: 'prev = { <triggers> }' },
  { name: 'this', description: 'Reference current scope explicitly', supportedScopes: ['none'], syntax: 'this = { <triggers> }' },
  { name: 'exists', description: 'Check if scope exists', supportedScopes: ['none'], valueType: 'boolean', syntax: 'exists = scope:target' },
];

/**
 * Control flow effects (if/else/while/random)
 */
const controlFlowEffects: EffectDefinition[] = [
  { name: 'if', description: 'Execute effects if condition is true', supportedScopes: ['none'], syntax: 'if = { limit = { <triggers> } <effects> }' },
  { name: 'else', description: 'Execute effects if previous if was false', supportedScopes: ['none'], syntax: 'else = { <effects> }' },
  { name: 'else_if', description: 'Execute effects if previous conditions false and this is true', supportedScopes: ['none'], syntax: 'else_if = { limit = { <triggers> } <effects> }' },
  { name: 'switch', description: 'Switch between multiple cases', supportedScopes: ['none'], syntax: 'switch = { trigger = has_trait 1 = { <effects> } 2 = { <effects> } }' },
  { name: 'while', description: 'Loop while condition is true', supportedScopes: ['none'], syntax: 'while = { limit = { <triggers> } <effects> }' },
  { name: 'random', description: 'Execute effects with random chance', supportedScopes: ['none'], syntax: 'random = { chance = 50 <effects> }' },
  { name: 'random_list', description: 'Randomly select from weighted list', supportedScopes: ['none'], syntax: 'random_list = { 10 = { <effects> } 20 = { <effects> } }' },
  { name: 'hidden_effect', description: 'Execute effects without showing in tooltip', supportedScopes: ['none'], syntax: 'hidden_effect = { <effects> }' },
];

/**
 * Logical triggers (NOT/AND/OR)
 */
const logicalTriggers: TriggerDefinition[] = [
  { name: 'NOT', description: 'Negate a trigger', supportedScopes: ['none'], valueType: 'block', syntax: 'NOT = { <triggers> }' },
  { name: 'AND', description: 'All triggers must be true', supportedScopes: ['none'], valueType: 'block', syntax: 'AND = { <triggers> }' },
  { name: 'OR', description: 'At least one trigger must be true', supportedScopes: ['none'], valueType: 'block', syntax: 'OR = { <triggers> }' },
  { name: 'NOR', description: 'No triggers can be true', supportedScopes: ['none'], valueType: 'block', syntax: 'NOR = { <triggers> }' },
  { name: 'NAND', description: 'Not all triggers are true', supportedScopes: ['none'], valueType: 'block', syntax: 'NAND = { <triggers> }' },
  { name: 'trigger_if', description: 'Conditional trigger evaluation', supportedScopes: ['none'], valueType: 'block', syntax: 'trigger_if = { limit = { <display_triggers> } <triggers> }' },
  { name: 'trigger_else', description: 'Else branch for trigger_if', supportedScopes: ['none'], valueType: 'block', syntax: 'trigger_else = { <triggers> }' },
  { name: 'trigger_else_if', description: 'Else-if branch', supportedScopes: ['none'], valueType: 'block', syntax: 'trigger_else_if = { limit = { <display_triggers> } <triggers> }' },
  { name: 'always', description: 'Always true or false', supportedScopes: ['none'], valueType: 'boolean', syntax: 'always = yes' },
];

/**
 * All effects combined (generated + manual scope changers + control flow)
 */
export const allEffects: EffectDefinition[] = [
  ...generatedEffects,
  ...scopeChangeEffects,
  ...controlFlowEffects,
];

/**
 * All triggers combined (generated + manual scope changers + logical)
 */
export const allTriggers: TriggerDefinition[] = [
  ...generatedTriggers,
  ...scopeChangeTriggers,
  ...logicalTriggers,
];

/**
 * Get effects valid for a specific scope
 */
export function getEffectsForScope(scope: ScopeType): EffectDefinition[] {
  return allEffects.filter(effect => {
    if (effect.supportedScopes.includes('none')) return true;
    return effect.supportedScopes.includes(scope);
  });
}

/**
 * Get triggers valid for a specific scope
 */
export function getTriggersForScope(scope: ScopeType): TriggerDefinition[] {
  return allTriggers.filter(trigger => {
    if (trigger.supportedScopes.includes('none')) return true;
    return trigger.supportedScopes.includes(scope);
  });
}

/**
 * Build a map for quick lookup (includes scope changers)
 */
export const effectsMap = new Map<string, EffectDefinition>(
  allEffects.map(e => [e.name, e])
);

/**
 * Build a map for quick lookup (includes scope changers)
 */
export const triggersMap = new Map<string, TriggerDefinition>(
  allTriggers.map(t => [t.name, t])
);

// Export modifiers
export * from './modifiers.generated';
