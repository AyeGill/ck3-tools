/**
 * Shared scope tracking utilities for CK3 script analysis
 *
 * Used by both CompletionProvider (for autocomplete) and DiagnosticsProvider (for validation)
 * to track context type (trigger/effect) and scope type (character/landed_title/etc.)
 */

import { ScopeType } from '../data/scopes';
import { effectsMap, triggersMap } from '../data';

/**
 * Block context information - what kind of code we're in and what scope
 */
export interface BlockContext {
  type: 'trigger' | 'effect' | 'weight' | 'unknown';
  scope: ScopeType;  // Use 'unknown' when scope type can't be determined (e.g., inside scope:X blocks)
}

/**
 * Block names that establish trigger context
 */
export const TRIGGER_BLOCKS = new Set([
  'trigger', 'is_shown', 'is_valid', 'is_valid_showing_failures_only',
  'ai_potential', 'can_be_picked', 'can_pick',
  'is_highlighted', 'auto_accept', 'can_send', 'can_be_picked_artifact',
  'show_as_unavailable', // Shows option but grayed out when triggers fail
  'limit', 'alternative_limit', // Trigger blocks that can appear inside effects
  'modifier', // Contains triggers for conditional weight modification
  // Boolean operators - these contain triggers
  'OR', 'AND', 'NOT', 'NOR', 'NAND', 'calc_true_if',
]);

/**
 * Weight calculation blocks (ai_will_do, ai_chance, etc.)
 * These are NOT trigger context - they have their own structure
 */
export const WEIGHT_BLOCKS = new Set([
  'ai_will_do', 'ai_chance', 'ai_accept', 'weight', 'weight_multiplier',
]);

/**
 * Parameters valid directly inside weight blocks
 */
export const WEIGHT_BLOCK_PARAMS = new Set([
  'base', 'modifier', 'opinion_modifier', 'factor', 'add', 'multiply',
]);

/**
 * Blocks that create trigger context AND have extra valid parameters
 * These blocks contain inline triggers plus their own parameters
 */
export const TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS = new Map<string, {
  validIn: 'weight' | 'effect' | 'trigger' | 'any';
  extraParams: Set<string>;
}>([
  ['modifier', { validIn: 'weight', extraParams: new Set(['add', 'factor', 'multiply', 'desc', 'value']) }],
  ['opinion_modifier', { validIn: 'weight', extraParams: new Set(['who', 'opinion_target', 'min', 'max', 'multiplier', 'desc', 'step']) }],
  ['compare_value', { validIn: 'trigger', extraParams: new Set(['value', 'target']) }],
]);

/**
 * Block names that establish effect context
 */
export const EFFECT_BLOCKS = new Set([
  'immediate', 'effect', 'after', 'on_accept', 'on_decline',
  'on_send', 'on_auto_accept', 'option', 'hidden_effect',
  'on_use', 'on_expire', 'on_invalidated', // Hook effect blocks
  'on_discover', 'on_expose', // Secret effect blocks
  'on_start', 'on_end', 'on_monthly', 'on_yearly', // on_action effect blocks
  'on_success', 'on_failure', 'on_progress', // Scheme effect blocks
  'on_complete', 'on_cancel', 'on_ready', // Additional scheme/activity blocks
  'random_list', // Random selection among effects
]);

/**
 * Blocks that contain bare identifiers (list items) instead of key=value pairs.
 * Maps block name to:
 * - Entity type string ('event', 'on_action') for validated lists
 * - null for blocks that allow bare identifiers without entity validation
 */
export const LIST_BLOCKS: Record<string, 'event' | 'on_action' | null> = {
  // Event/on_action lists - validate against workspace index
  'events': 'event',
  'first_valid': 'event',
  'on_actions': 'on_action',
  'first_valid_on_action': 'on_action',
  'random_on_action': 'on_action',
  // Casus belli lists - no validation (too many CB types)
  'cb': null,
  // Title target lists - contains scope references
  'target_titles': null,
  // Skill stat blocks in create_character/scripted_character_templates
  // These contain numeric ranges OR template identifiers
  'martial': null,
  'diplomacy': null,
  'stewardship': null,
  'intrigue': null,
  'learning': null,
  'prowess': null,
  // Skills block in duel - contains skill names as bare identifiers
  'skills': null,
};

/**
 * Check if a block name is a scope:X pattern (saved scope reference)
 * These have unknown target scope until runtime
 */
export function isScopeReference(block: string): boolean {
  return /^scope:[a-zA-Z_][a-zA-Z0-9_]*$/.test(block);
}

/**
 * Check if a string is a numeric block name (e.g., "50" in track = { 50 = { } })
 */
export function isNumericBlock(block: string): boolean {
  return /^\d+$/.test(block);
}

/**
 * Analyze blockPath to determine the current context type and scope.
 * Walks through the block path, tracking scope changes from iterators.
 *
 * @param blockPath Array of block names from outermost to innermost
 * @param initialScope The scope to start with (typically 'character' for events)
 * @returns Object with context type ('trigger' or 'effect') and current scope
 */
export function analyzeBlockContext(
  blockPath: string[],
  initialScope: ScopeType = 'character'
): BlockContext {
  let contextType: 'trigger' | 'effect' | 'weight' | 'unknown' = 'unknown';
  let currentScope: ScopeType = initialScope;

  for (const block of blockPath) {
    // Check if this block establishes a context
    if (WEIGHT_BLOCKS.has(block)) {
      contextType = 'weight';
    } else if (TRIGGER_BLOCKS.has(block)) {
      contextType = 'trigger';
    } else if (EFFECT_BLOCKS.has(block)) {
      contextType = 'effect';
    } else {
      // Check for blocks that create trigger context with extra params
      const blockConfig = TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.get(block);
      if (blockConfig && (blockConfig.validIn === 'any' || blockConfig.validIn === contextType)) {
        contextType = 'trigger'; // These blocks create trigger context inside
      }
    }

    // Check if this is a scope:X reference - we can't determine the target scope
    if (isScopeReference(block)) {
      currentScope = 'unknown';
      continue;
    }

    // Check if this block is a scope-changing trigger or effect
    // Look up in triggers first (for any_* iterators in trigger blocks)
    const trigger = triggersMap.get(block);
    if (trigger?.outputScope) {
      currentScope = trigger.outputScope;
      continue;
    }

    // Look up in effects (for every_* iterators in effect blocks)
    const effect = effectsMap.get(block);
    if (effect?.outputScope) {
      currentScope = effect.outputScope;
    }
  }

  return { type: contextType, scope: currentScope };
}

/**
 * Known scope changers with their output scope types
 * This is a comprehensive list that supplements the effectsMap/triggersMap
 * Exported so DiagnosticsProvider can also use it
 */
export const KNOWN_SCOPE_CHANGERS: Map<string, ScopeType> = new Map([
  // Generic scope references (always valid, scope depends on context)
  // Include uppercase versions for case-insensitivity
  ['root', 'character'],
  ['ROOT', 'character'],
  ['prev', 'character'],
  ['PREV', 'character'],
  ['this', 'character'],
  ['THIS', 'character'],
  ['from', 'character'],
  ['FROM', 'character'],

  // Character to character scope changers
  ['liege', 'character'],
  ['top_liege', 'character'],
  ['host', 'character'],
  ['employer', 'character'],
  ['father', 'character'],
  ['mother', 'character'],
  ['real_father', 'character'],
  ['primary_spouse', 'character'],
  ['betrothed', 'character'],
  ['primary_heir', 'character'],
  ['player_heir', 'character'],
  ['designated_heir', 'character'],
  ['killer', 'character'],
  ['imprisoner', 'character'],
  ['warden', 'character'],
  ['court_owner', 'character'],
  ['involved_activity', 'activity'],

  // Character to dynasty/house
  ['dynasty', 'dynasty'],
  ['house', 'dynasty_house'],

  // Dynasty scope changers
  ['dynast', 'character'],
  ['house_head', 'character'],

  // Character to faith/culture
  ['faith', 'faith'],
  ['culture', 'culture'],

  // Faith scope changers
  ['religion', 'religion'],
  ['religious_head', 'character'],

  // Character to location
  ['location', 'province'],
  ['capital_province', 'province'],
  ['capital_county', 'landed_title'],
  ['capital_barony', 'landed_title'],
  ['primary_title', 'landed_title'],
  ['home_court', 'province'],

  // Province/title scope changers
  ['holder', 'character'],
  ['barony', 'landed_title'],
  ['county', 'landed_title'],
  ['duchy', 'landed_title'],
  ['kingdom', 'landed_title'],
  ['empire', 'landed_title'],
  ['de_jure_liege', 'landed_title'],
  ['title_province', 'province'],
  ['province', 'province'],

  // War/combat scope changers
  ['attacker', 'character'],
  ['defender', 'character'],
  ['war', 'war'],
  ['casus_belli', 'casus_belli'],

  // Scheme scope changers
  ['scheme_owner', 'character'],
  ['scheme_target', 'character'],

  // Activity scope changers
  ['activity_owner', 'character'],
  ['activity_location', 'province'],

  // Story cycle scope changers
  ['story_owner', 'character'],

  // Secret scope changers
  ['secret_owner', 'character'],
  ['secret_target', 'character'],

  // Artifact scope changers
  ['artifact', 'artifact'],
  ['artifact_owner', 'character'],

  // Combat scope changers
  ['combat', 'combat'],
  ['combat_side', 'combat_side'],
  ['enemy_side', 'combat_side'],

  // Other common scope changers
  ['target', 'character'],
  ['candidate', 'character'],
  ['suzerain', 'character'],
  ['diarch', 'character'],

  // Travel system (EP3)
  ['current_travel_plan', 'travel_plan'],

  // Court and governance
  ['liege_or_court_owner', 'character'],

  // Domicile/landless (EP3)
  ['domicile', 'character'],

  // Councillors
  ['every_normal_councillor', 'character'],
  ['any_normal_councillor', 'character'],

  // War/military
  ['every_pledged_attacker', 'character'],
  ['regiment_owner', 'character'],

  // Inspiration/artisan (Royal Court)
  ['inspiration', 'inspiration'],

  // Dynasty/house
  ['leading_house', 'dynasty_house'],

  // Location/geography
  ['province_owner', 'character'],

  // Situation/struggle
  ['ordered_situation_group_participant', 'character'],

  // Feudal relationships
  ['overlord', 'character'],
  ['lessee', 'character'],

  // Religion
  ['secret_faith', 'faith'],

  // Task contracts (EP3)
  ['task_contract', 'character'],
  ['task_contract_employer', 'character'],
  ['task_contract_location', 'province'],
  ['task_contract_taker', 'character'],
  ['task_contract_target', 'character'],
  ['task_contract_destination', 'province'],

  // Titles
  ['title', 'landed_title'],
  ['any_held_county', 'landed_title'],

  // Grand projects
  ['contribution_is_funded', 'character'],
  ['contribution_is_required', 'character'],

  // Legends (Roads to Power)
  ['promoted_legend', 'legend'],

  // Accolades (Tours & Tournaments)
  ['accolade', 'accolade'],
  ['accolade_owner', 'character'],

  // Confederations
  ['confederation', 'character'],

  // Additional iterators that may be missing
  ['participant', 'character'],
  ['participants', 'character'],

  // Character collections
  ['skills', 'none'],
  ['tags', 'none'],
  ['theme', 'none'],
  ['leader', 'character'],
  ['character', 'character'],

  // Activity-specific scopes
  ['activity_host', 'character'],
  ['activity_owner', 'character'],
  ['activity_location', 'province'],
  ['intent_target', 'character'],
  ['special_guest', 'character'],

  // Scheme-specific scopes
  ['scheme_target_character', 'character'],

  // Combat scopes (winner/loser)
  ['winner', 'character'],
  ['loser', 'character'],

  // Generic owner scope (works in many contexts)
  ['owner', 'character'],

  // Interaction scopes
  ['recipient', 'character'],
  ['actor', 'character'],

  // Animal companion scopes (output type uncertain)
  ['animal_type', 'unknown'],

  // Landless adventurer scopes (Roads to Power)
  ['new_landless_adventurer', 'character'],

  // Dynastic cycle/situation scopes (output type uncertain)
  ['dynastic_cycle', 'unknown'],

  // Historical character references
  ['historical_character', 'character'],

  // Relationship/reason scopes (output type uncertain)
  ['reason', 'unknown'],
  ['house_feud_reason', 'unknown'],

  // Artifact/item scopes (output type uncertain)
  ['regional_mythical_creature_trinket', 'unknown'],

  // Activity specific
  ['activity', 'activity'],

  // Culture scopes
  ['culture_head', 'character'],

  // Dynasty/house scopes
  ['house_confederation', 'confederation'],

  // Inspiration scopes
  ['inspiration_sponsor', 'character'],

  // Legend scopes
  ['legend_owner', 'character'],

  // Faction scopes
  ['faction_leader', 'character'],
  ['faction_war', 'war'],
  ['joined_faction', 'faction'],

  // Great Holy War scopes
  ['ghw_beneficiary', 'character'],
  ['great_holy_war', 'great_holy_war'],

  // Title holder scopes
  ['previous_holder', 'character'],
  ['previous_owner', 'character'],

  // War/combat scopes
  ['primary_attacker', 'character'],
  ['primary_defender', 'character'],
  ['primary_partner', 'character'],
  ['army_commander', 'character'],
  ['army_owner', 'character'],
  ['commanding_army', 'army'],
  ['knight_army', 'army'],
  ['side_commander', 'character'],

  // Scheme scopes
  ['scheme_defender', 'character'],
  ['scheme_target_culture', 'culture'],
  ['scheme_target_faith', 'faith'],
  ['scheme_target_title', 'landed_title'],

  // Travel scopes
  ['travel_leader', 'character'],
  ['next_destination_province', 'province'],

  // Succession/heir scopes
  ['current_heir', 'character'],
  ['designated_diarch', 'character'],
  ['diarchy_successor', 'character'],

  // Special/misc scopes
  ['special_character', 'character'],
  ['special_title', 'landed_title'],
  ['title_capital_county', 'landed_title'],
  ['title_domicile', 'domicile'],
  ['top_overlord', 'character'],
  ['top_suzerain', 'character'],
  ['creator', 'character'],
  ['councillor_task_target', 'unknown'],
  ['acclaimed_knight', 'character'],

  // Location scopes
  ['domicile_location', 'province'],
  ['situation_center_province', 'province'],

  // Inspiration scopes (Royal Court DLC)
  ['inspiration_owner', 'character'],

  // Legend scopes (Legends of the Dead DLC)
  ['legend_protagonist', 'character'],
  ['legend_type', 'legend'],

  // Combat/war scopes - additional
  ['side_primary_participant', 'character'],
  ['involved_combat_side', 'combat_side'],

  // Travel scopes (Roads to Power DLC) - additional
  ['travel_plan_owner', 'character'],
  ['travel_plan_activity', 'activity'],
  ['current_location', 'province'],
  ['final_destination_province', 'province'],
  ['departure_location', 'province'],

  // Faction scopes - additional
  ['faction_target', 'character'],

  // Family/pregnancy scopes
  ['pregnancy_real_father', 'character'],

  // Special/hypothetical character scopes
  ['dummy_male', 'character'],
  ['dummy_female', 'character'],
  ['dreaded_character', 'character'],

  // Title/regiment scopes
  ['regiment_owning_title', 'landed_title'],
  ['regiment_controlling_title', 'landed_title'],
  ['county_controller', 'character'],
  ['great_project_owner', 'character'],

  // Court/position scopes
  ['court_position', 'court_position'],
  ['holy_order_patron', 'character'],

  // Culture/domicile scopes
  ['domicile_culture', 'culture'],

  // Memory scopes
  ['memory_owner', 'character'],

  // DLC-specific scopes (EP3/Roads to Power)
  ['obedience_target', 'character'],
  ['tax_slot', 'tax_slot'],
  ['situation_top_sub_region', 'province'],
  ['epidemic_type', 'epidemic'],
]);

/**
 * Validate a scope path like "liege.primary_title.holder"
 *
 * Checks each segment to see if it's a valid scope changer for the current scope.
 *
 * @param path The dotted path to validate (e.g., "liege.primary_title.holder")
 * @param startScope The scope we're starting from
 * @returns Object with valid boolean and final scope if valid
 */
export function validateScopePath(
  path: string,
  startScope: ScopeType
): { valid: boolean; finalScope: ScopeType | null; invalidSegment?: string } {
  // Split on dots, but handle scope:X references which contain colons
  // e.g., "scope:actor.liege" -> ["scope:actor", "liege"]
  const segments = splitScopePath(path);

  if (segments.length === 0) {
    return { valid: false, finalScope: null };
  }

  let currentScope: ScopeType = startScope;

  for (const segment of segments) {
    // Check for scope:X references - they point to unknown scopes
    if (isScopeReference(segment)) {
      // We can't validate further - assume it works
      // Return character as a reasonable default
      return { valid: true, finalScope: 'character' };
    }

    // First check the comprehensive KNOWN_SCOPE_CHANGERS map
    const knownOutput = KNOWN_SCOPE_CHANGERS.get(segment);
    if (knownOutput) {
      currentScope = knownOutput;
      continue;
    }

    // Then look up the scope changer in effectsMap/triggersMap
    const trigger = triggersMap.get(segment);
    const effect = effectsMap.get(segment);
    const scopeChanger = trigger || effect;

    if (scopeChanger?.outputScope) {
      currentScope = scopeChanger.outputScope;
      continue;
    }

    // Not a known scope changer - this segment is invalid
    return { valid: false, finalScope: null, invalidSegment: segment };
  }

  return { valid: true, finalScope: currentScope };
}

/**
 * Split a scope path into segments, handling scope:X references
 *
 * e.g., "scope:actor.liege.primary_title" -> ["scope:actor", "liege", "primary_title"]
 */
export function splitScopePath(path: string): string[] {
  const segments: string[] = [];
  let current = '';

  for (let i = 0; i < path.length; i++) {
    const char = path[i];

    if (char === '.') {
      if (current) {
        segments.push(current);
        current = '';
      }
    } else if (char === ':' && current === 'scope') {
      // Start of scope:X reference - consume until next dot
      current += ':';
      i++;
      while (i < path.length && path[i] !== '.') {
        current += path[i];
        i++;
      }
      segments.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current) {
    segments.push(current);
  }

  return segments;
}

/**
 * Get the output scope for a scope path, or null if invalid
 *
 * @param path The dotted path (e.g., "liege.primary_title.holder")
 * @param startScope The scope we're starting from
 * @returns The final scope type, or null if the path is invalid
 */
export function getOutputScopeForPath(
  path: string,
  startScope: ScopeType
): ScopeType | null {
  const result = validateScopePath(path, startScope);
  return result.finalScope;
}

/**
 * Check if a field name looks like a scope path (contains dots)
 */
export function looksLikeScopePath(fieldName: string): boolean {
  return fieldName.includes('.');
}
