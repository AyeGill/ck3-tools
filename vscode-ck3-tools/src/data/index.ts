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
 * Parameter overrides for effects where generated data is incomplete
 * These override the parameters array from effects.generated.ts
 */
const effectParameterOverrides: Record<string, string[]> = {
  // Variable effects
  'set_variable': ['name', 'value', 'days', 'months', 'weeks', 'years'],
  'set_local_variable': ['name', 'value', 'days', 'months', 'weeks', 'years'],
  'set_global_variable': ['name', 'value', 'days', 'months', 'weeks', 'years'],
  'change_variable': ['name', 'add', 'subtract', 'multiply', 'divide', 'min', 'max'],
  'change_local_variable': ['name', 'add', 'subtract', 'multiply', 'divide', 'min', 'max'],
  'change_global_variable': ['name', 'add', 'subtract', 'multiply', 'divide', 'min', 'max'],

  // Event effects
  'trigger_event': ['id', 'on_action', 'days', 'months', 'weeks', 'years', 'delayed'],

  // Random effects
  'random': ['chance', 'modifier'],
  'random_list': ['modifier', 'desc'],

  // Interface effects
  'custom_tooltip': ['text', 'subject', 'object'],
  'custom_description': ['text'],
  'send_interface_message': ['type', 'title', 'desc', 'tooltip', 'left_icon', 'right_icon', 'goto'],
  'send_interface_toast': ['type', 'title', 'desc', 'left_icon', 'right_icon'],

  // Death effect
  'death': ['death_reason', 'killer'],

  // Opinion effects
  'add_opinion': ['target', 'modifier', 'opinion', 'years', 'months', 'days', 'weeks'],
  'reverse_add_opinion': ['target', 'modifier', 'opinion', 'years', 'months', 'days', 'weeks'],

  // List/iteration
  'every_in_list': ['list', 'variable', 'custom'],
  'random_in_list': ['list', 'variable', 'weight'],
  'ordered_in_list': ['list', 'variable', 'order_by', 'position', 'min', 'max', 'check_range_bounds'],
  'any_in_list': ['list', 'variable', 'count'],
  'add_to_list': ['name', 'value', 'list', 'variable'],
  'add_to_temporary_list': ['name', 'value', 'list', 'variable'],

  // Casus belli
  'start_war': ['casus_belli', 'cb', 'target', 'claimant', 'target_title'],

  // Scheme effects
  'start_scheme': ['type', 'target'],

  // Create character (includes skill names which are also triggers)
  'create_character': ['template', 'name', 'age', 'gender', 'culture', 'faith', 'dynasty', 'dynasty_house', 'location', 'employer', 'trait', 'save_scope_as', 'save_temporary_scope_as', 'mother', 'father', 'real_father', 'random_traits', 'health', 'fertility', 'ethnicity', 'after_creation', 'martial', 'diplomacy', 'intrigue', 'stewardship', 'learning', 'prowess'],

  // Modifier effects
  'add_scheme_modifier': ['type', 'days', 'months', 'weeks', 'years'],
  'add_character_modifier': ['modifier', 'days', 'months', 'weeks', 'years', 'desc'],
  'add_county_modifier': ['modifier', 'days', 'months', 'weeks', 'years', 'desc'],
  'add_province_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_realm_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_dynasty_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_house_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_culture_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_faith_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_activity_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],
  'add_travel_modifier': ['modifier', 'days', 'months', 'weeks', 'years'],

  // Flag effects
  'add_character_flag': ['flag', 'days', 'months', 'weeks', 'years'],
  'add_dynasty_flag': ['flag', 'days', 'months', 'weeks', 'years'],
  'add_house_flag': ['flag', 'days', 'months', 'weeks', 'years'],
  'add_title_flag': ['flag', 'days', 'months', 'weeks', 'years'],

  // Save scope
  'save_scope_as': [],  // Takes just a name, not block params
  'save_scope_value_as': ['name', 'value'],
  'save_temporary_scope_as': [],
  'save_temporary_scope_value_as': ['name', 'value'],

  // Spawn effects
  'spawn_army': ['name', 'levies', 'men_at_arms', 'location', 'inheritable', 'uses_supply', 'save_scope_as', 'war'],

  // Truce effects
  'add_truce_one_way': ['character', 'years', 'months', 'days', 'weeks', 'name'],
  'add_truce_both_ways': ['character', 'years', 'months', 'days', 'weeks', 'name'],
  'remove_truce': ['character'],

  // Script value math (used inside script values)
  'add': ['value', 'min', 'max'],
  'subtract': ['value', 'min', 'max'],
  'multiply': ['value', 'min', 'max'],
  'divide': ['value', 'min', 'max'],
  'min': ['value'],
  'max': ['value'],
  'floor': ['value'],
  'round': ['value'],

  // Show portrait
  'show_portrait': ['character', 'trigger', 'animation', 'camera'],

  // Assert effects (for debugging)
  'assert_if': ['limit', 'text'],
  'assert_read': ['target', 'text'],

  // Duel effects
  'duel': ['target', 'skill', 'value', 'on_success', 'on_fail', 'localization', 'desc'],

  // Dynasty effects
  'add_dynasty_perk': ['perk'],
  'add_dynasty_prestige_level': [],

  // Secret effects
  'expose_secret': ['secret', 'target'],
  'add_secret': ['type', 'target'],

  // Activity effects
  'complete_activity': [],
  'cancel_activity': [],
  'set_activity_location': ['province'],

  // Struggle effects
  'activate_struggle_catalyst': ['catalyst', 'character'],
  'set_struggle_phase': ['struggle_type', 'phase'],

  // Culture/faith effects
  'set_culture': ['culture', 'save_scope_as'],
  'set_faith': ['faith', 'save_scope_as'],
  'convert_family_to_faith': ['faith'],

  // Memory effects
  'add_memory': ['type', 'participants', 'priority'],

  // Focus effects
  'set_focus': ['focus'],
  'set_education_focus': ['focus'],

  // Trait effects (complex form)
  'add_trait': ['trait', 'track', 'value'],
  'remove_trait': ['trait', 'track'],

  // Court position effects
  'appoint_court_position': ['recipient', 'court_position'],

  // Inventory effects
  'create_artifact': ['name', 'type', 'template', 'rarity', 'save_scope_as', 'modifier', 'decaying', 'history', 'visuals', 'description', 'wealth', 'quality'],

  // Title effects
  'change_title_holder': ['holder', 'change'],
  'create_title_and_vassal_change': ['type', 'save_scope_as', 'add_claim_on_loss'],

  // More list effects
  'every_in_local_list': ['list', 'variable'],
  'random_in_local_list': ['list', 'variable', 'weight'],
  'any_in_local_list': ['list', 'variable', 'count'],
  'ordered_in_local_list': ['list', 'variable', 'order_by', 'position', 'min', 'max'],
  'add_to_local_list': ['list', 'variable'],
  'add_to_variable_list': ['name', 'target', 'years', 'months', 'days', 'weeks'],
  'add_to_global_variable_list': ['name', 'target'],
  'remove_list_variable': ['name', 'target'],
  'remove_list_global_variable': ['name', 'target'],
  'while': ['limit', 'count', 'list'],

  // Math effects (when used as block with value)
  'add_legitimacy': ['value', 'divide', 'subtract', 'multiply', 'min', 'max'],
  'add_piety': ['value', 'divide', 'subtract', 'multiply', 'min', 'max'],
  'add_prestige': ['value', 'divide', 'subtract', 'multiply', 'min', 'max'],
  'add_gold': ['value', 'divide', 'subtract', 'multiply', 'min', 'max'],
  'add_dynasty_prestige': ['value', 'divide', 'subtract', 'multiply', 'min', 'max'],
  'add_scheme_progress': ['value', 'subtract', 'add'],
  'remove_short_term_gold': ['value', 'divide', 'subtract', 'multiply', 'min', 'max'],
  'pay_short_term_gold': ['target', 'gold'],
  'add_treasury_or_gold': ['value', 'min', 'max'],
  'change_development_level': ['value', 'divide', 'floor', 'subtract', 'multiply'],
  'change_influence': ['value', 'round', 'add', 'subtract'],
  'change_fervor': ['value', 'desc'],
  'change_cultural_acceptance': ['value', 'target', 'desc'],
  'change_merit': ['value'],
  'change_opportunities': ['value'],
  'pay_herd': ['value', 'target'],
  'add_trait_xp': ['value', 'track', 'trait'],

  // Relation effects
  'set_relation_lover': ['target', 'reason', 'province', 'copy_reason'],
  'set_relation_rival': ['target', 'reason', 'copy_reason'],
  'set_relation_friend': ['target', 'reason', 'copy_reason'],
  'set_relation_nemesis': ['target', 'reason', 'copy_reason'],
  'set_relation_grudge': ['target', 'reason', 'copy_reason'],
  'remove_relation_flag': ['target', 'relation', 'flag'],
  'remove_opinion': ['target', 'modifier', 'single'],
  'remove_hook': ['target', 'type'],

  // Character effects
  'imprison': ['target', 'type'],
  'change_liege': ['liege', 'change', 'LIEGE', 'CHANGE'],
  'becomes_independent': ['change'],
  'change_trait_rank': ['trait', 'rank', 'max', 'value'],

  // Faction/war effects
  'create_faction': ['type', 'target', 'special_character', 'special_title'],

  // Region iteration
  'every_county_in_region': ['region', 'custom'],
  'every_vassal': ['custom', 'even_if_dead'],
  'every_close_family_member': ['custom', 'even_if_dead'],
  'every_relation': ['type', 'custom'],
  'random_relation': ['type', 'weight'],
  'every_character_struggle': ['involvement', 'custom'],
  'random_court_position_holder': ['type', 'weight'],

  // Activity effects
  'add_activity_log_entry': ['key', 'character', 'target', 'artifact', 'scope', 'tags', 'score'],

  // Dynasty effects
  'create_cadet_branch': ['prefix', 'founder', 'name'],
  'vassal_contract_set_obligation_level': ['type', 'level'],
  'set_appointment_timeout': ['years', 'months', 'days', 'weeks'],

  // More iterators with custom parameter
  'every_attending_character': ['custom'],
  'every_close_or_extended_family_member': ['custom', 'even_if_dead'],
  'every_vassal_or_below': ['custom', 'even_if_dead'],
  'every_courtier': ['custom', 'even_if_dead'],
  'every_in_de_jure_hierarchy': ['custom'],
  'every_pool_character': ['province', 'custom'],
  'every_ruler': ['custom'],
  'every_independent_ruler': ['custom'],
  'every_court_position_holder': ['type', 'custom'],
  'every_knight': ['custom', 'even_if_dead'],
  'every_faction_member': ['custom'],
  'every_courtier_or_guest': ['custom'],
  'every_child': ['custom', 'even_if_dead'],
  'every_councillor': ['custom'],
  'every_traveling_family_member': ['custom'],
  'every_in_global_list': ['list', 'variable', 'custom'],
  'random_in_global_list': ['list', 'variable', 'weight'],
  'random_pool_character': ['province', 'weight'],
  'random_county_in_region': ['region', 'weight'],
  'ordered_relation': ['type', 'order_by', 'position', 'min', 'max'],

  // More value effects
  'add_durability': ['value'],
  'add_dread': ['value', 'min', 'max'],
  'add_stress': ['value', 'min', 'max', 'type'],
  'add_unity_value': ['value', 'character', 'desc'],
  'change_herd': ['value'],
  'change_county_control': ['value'],
  'pay_treasury_or_gold': ['value', 'target'],
  'pay_gold_to_treasury': ['value', 'target'],
  'pay_long_term_gold': ['target', 'gold'],
  'add_martial_lifestyle_xp': ['value'],

  // Interface effects (unique additions)
  'open_view_data': ['data', 'view', 'player'],
  'save_opinion_value_as': ['name', 'target'],

  // Control flow (parameters)
  'if': ['limit', 'text'],

  // Trait rank effects
  'set_trait_rank': ['trait', 'rank'],

  // Claim iterators
  'every_claim': ['explicit', 'pressed', 'custom'],
  'random_claim': ['explicit', 'pressed', 'weight'],

  // Struggle iterators
  'random_character_struggle': ['involvement', 'weight'],

  // Task contracts (docs have typo "task_task_contract_tier", game uses "task_contract_tier")
  'create_task_contract': ['task_contract_tier', 'employer', 'employee', 'task_contract_target', 'task_contract_destination'],
};

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
 * Apply parameter overrides where needed
 */
export const effectsMap = new Map<string, EffectDefinition>(
  allEffects.map(e => {
    const override = effectParameterOverrides[e.name];
    if (override) {
      return [e.name, { ...e, parameters: override }];
    }
    return [e.name, e];
  })
);

/**
 * Parameter overrides for triggers where generated data is incomplete
 */
const triggerParameterOverrides: Record<string, string[]> = {
  // List iteration triggers
  'any_in_list': ['list', 'variable', 'count', 'percent'],
  'any_in_local_list': ['list', 'variable', 'count'],
  'any_in_global_list': ['list', 'variable', 'count'],

  // Claim triggers
  'any_claim': ['explicit', 'pressed', 'count', 'percent'],

  // Struggle triggers
  'any_character_struggle': ['involvement'],

  // Relation triggers
  'any_relation': ['type'],

  // Court position triggers
  'any_court_position_holder': ['type'],

  // Variable triggers
  'has_variable': ['name', 'value'],
  'has_local_variable': ['name', 'value'],
  'has_global_variable': ['name', 'value'],
  'has_variable_list': ['name'],
  'has_local_variable_list': ['name'],
  'has_global_variable_list': ['name'],

  // Compare triggers
  'compare_value': ['value', 'target'],

  // Iterator triggers that take count/percent
  'any_consort': ['count', 'percent'],
  'any_spouse': ['count', 'percent'],
  'any_child': ['count', 'percent'],
  'any_parent': ['count', 'percent'],
  'any_sibling': ['count', 'percent'],
  'any_courtier': ['count', 'percent', 'even_if_dead'],
  'any_courtier_or_guest': ['count', 'percent'],
  'any_vassal': ['count', 'percent', 'even_if_dead'],
  'any_held_title': ['count', 'percent'],
  'any_heir_title': ['count', 'percent'],
  'any_heir': ['count', 'percent'],
  'any_faction_member': ['count', 'percent'],
  'any_scheme_agent_character': ['count', 'percent'],
  'any_scheme_agent_slot': ['count', 'percent'],
  'any_secret_knower': ['count', 'percent'],
  'any_killed_character': ['count', 'percent'],
  'any_entourage_character': ['count', 'percent'],
  'any_attending_character': ['count', 'percent'],
  'any_close_family_member': ['count', 'percent', 'even_if_dead'],
  'any_dynasty_member': ['count', 'percent'],
  'any_culture_county': ['count', 'percent'],
  'any_province_epidemic': ['count', 'percent'],
  'any_knight': ['count', 'percent'],
  'any_held_county': ['count', 'percent'],
  'any_sub_realm_county': ['count', 'percent'],
  'any_targeting_faction': ['count', 'percent'],
  'any_faith': ['count', 'percent'],
  'any_leased_title': ['count', 'percent'],
  'any_martial_councillor': ['count', 'percent'],

  // Region iteration triggers
  'any_county_in_region': ['region', 'count', 'percent'],
  'every_county_in_region': ['region'],
  'random_county_in_region': ['region', 'weight'],

  // Opinion modifier trigger
  'opinion_modifier': ['who', 'opinion', 'multiplier', 'step', 'min', 'max', 'factor'],
  'compare_modifier': ['value', 'multiplier', 'min', 'max'],

  // Dread level trigger
  'has_dread_level_towards': ['target', 'level'],

  // Ordered triggers
  'ordered_in_list': ['list', 'variable', 'order_by', 'position', 'min', 'max', 'check_range_bounds'],

  // Trait-related triggers
  'has_trait_rank': ['trait', 'rank', 'value'],
  'trait_is_same_or_worse': ['trait', 'target'],

  // Character flag triggers
  'has_character_flag': ['flag', 'days', 'months', 'years', 'weeks'],

  // Numeric comparison blocks
  'add': ['value', 'min', 'max', 'floor', 'ceiling'],
  'multiply': ['value', 'min', 'max'],
  'divide': ['value', 'min', 'max'],
  'subtract': ['value', 'min', 'max'],
  'order_by': ['value'],

  // Desc block for conditional descriptions
  'desc': ['desc', 'trigger', 'first_valid', 'triggered_desc'],
  'triggered_desc': ['desc', 'trigger'],

  // Duel trigger
  'duel': ['skill', 'target', 'value', 'localization'],

  // Relation flag triggers
  'has_relation_flag': ['target', 'relation', 'flag'],
  'set_relation_flag': ['target', 'relation', 'flag'],
  'remove_relation_flag': ['target', 'relation', 'flag'],

  // More iterator triggers with count
  'any_pool_character': ['province', 'count', 'percent'],
  'any_ruler': ['count', 'percent'],
  'any_independent_ruler': ['count', 'percent'],
  'any_living_character': ['count', 'percent'],
  'any_player': ['count', 'percent'],
  'any_de_jure_county': ['count', 'percent'],
  'any_de_jure_county_holder': ['count', 'percent'],
  'any_neighboring_county': ['count', 'percent'],
  'any_neighboring_province': ['count', 'percent'],
  'any_activity_guest': ['count', 'percent'],
  'any_activity_participant': ['count', 'percent'],
  'any_activity_spectator': ['count', 'percent'],
  'any_war_participant': ['count', 'percent'],
  'any_war_enemy': ['count', 'percent'],
  'any_war_ally': ['count', 'percent'],

  // XP track triggers
  'has_trait_xp': ['trait', 'track', 'value'],

  // Scheme triggers
  'is_scheming_against': ['target', 'type', 'skill'],

  // Men-at-arms triggers
  'number_maa_regiments_of_base_type': ['type', 'value'],
  'max_number_maa_soldiers_of_base_type': ['type', 'value'],

  // Value comparison triggers
  'number_of_personality_traits_in_common': ['target', 'value'],
  'number_of_traits_in_common': ['target', 'value'],
  'tier_difference': ['target', 'value'],
  'faith_hostility_level': ['target', 'value'],
  'player_heir_position': ['value'],
  'tax_collector_aptitude': ['value'],

  // Hook triggers
  'has_hook_of_type': ['target', 'type'],

  // Court position triggers
  'is_court_position_employer': ['court_position', 'who'],
};

/**
 * Build a map for quick lookup (includes scope changers)
 */
export const triggersMap = new Map<string, TriggerDefinition>(
  allTriggers.map(t => {
    const override = triggerParameterOverrides[t.name];
    if (override) {
      return [t.name, { ...t, parameters: override }];
    }
    return [t.name, t];
  })
);

// Export modifiers
export * from './modifiers.generated';
