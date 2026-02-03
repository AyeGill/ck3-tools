"use strict";
/**
 * Shared scope tracking utilities for CK3 script analysis
 *
 * Used by both CompletionProvider (for autocomplete) and DiagnosticsProvider (for validation)
 * to track context type (trigger/effect) and scope type (character/landed_title/etc.)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KNOWN_SCOPE_CHANGERS = exports.EFFECT_BLOCKS = exports.TRIGGER_BLOCKS = void 0;
exports.isScopeReference = isScopeReference;
exports.isNumericBlock = isNumericBlock;
exports.analyzeBlockContext = analyzeBlockContext;
exports.validateScopePath = validateScopePath;
exports.splitScopePath = splitScopePath;
exports.getOutputScopeForPath = getOutputScopeForPath;
exports.looksLikeScopePath = looksLikeScopePath;
const data_1 = require("../data");
/**
 * Block names that establish trigger context
 */
exports.TRIGGER_BLOCKS = new Set([
    'trigger', 'is_shown', 'is_valid', 'is_valid_showing_failures_only',
    'ai_potential', 'ai_will_do', 'can_be_picked', 'can_pick',
    'is_highlighted', 'auto_accept', 'can_send', 'can_be_picked_artifact',
    'limit', 'modifier', // limit and modifier inside effects also contain triggers
]);
/**
 * Block names that establish effect context
 */
exports.EFFECT_BLOCKS = new Set([
    'immediate', 'effect', 'after', 'on_accept', 'on_decline',
    'on_send', 'on_auto_accept', 'option', 'hidden_effect',
    'on_use', 'on_expire', 'on_invalidated', // Hook effect blocks
    'on_discover', 'on_expose', // Secret effect blocks
    'on_start', 'on_end', 'on_monthly', 'on_yearly', // on_action effect blocks
]);
/**
 * Check if a block name is a scope:X pattern (saved scope reference)
 * These have unknown target scope until runtime
 */
function isScopeReference(block) {
    return /^scope:[a-zA-Z_][a-zA-Z0-9_]*$/.test(block);
}
/**
 * Check if a string is a numeric block name (e.g., "50" in track = { 50 = { } })
 */
function isNumericBlock(block) {
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
function analyzeBlockContext(blockPath, initialScope = 'character') {
    let contextType = 'unknown';
    let currentScope = initialScope;
    let unknownScope = false;
    for (const block of blockPath) {
        // Check if this block establishes a trigger or effect context
        if (exports.TRIGGER_BLOCKS.has(block)) {
            contextType = 'trigger';
        }
        else if (exports.EFFECT_BLOCKS.has(block)) {
            contextType = 'effect';
        }
        // Check if this is a scope:X reference - we can't determine the target scope
        if (isScopeReference(block)) {
            unknownScope = true;
            continue;
        }
        // Check if this block is a scope-changing trigger or effect
        // Look up in triggers first (for any_* iterators in trigger blocks)
        const trigger = data_1.triggersMap.get(block);
        if (trigger?.outputScope) {
            currentScope = trigger.outputScope;
            unknownScope = false; // Known scope again
            continue;
        }
        // Look up in effects (for every_* iterators in effect blocks)
        const effect = data_1.effectsMap.get(block);
        if (effect?.outputScope) {
            currentScope = effect.outputScope;
            unknownScope = false; // Known scope again
        }
    }
    return { type: contextType, scope: currentScope, unknownScope };
}
/**
 * Known scope changers with their output scope types
 * This is a comprehensive list that supplements the effectsMap/triggersMap
 * Exported so DiagnosticsProvider can also use it
 */
exports.KNOWN_SCOPE_CHANGERS = new Map([
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
    ['combat_side', 'combat_side'],
    ['enemy_side', 'combat_side'],
    // Other common scope changers
    ['target', 'character'],
    ['candidate', 'character'],
    ['suzerain', 'character'],
    ['diarch', 'character'],
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
function validateScopePath(path, startScope) {
    // Split on dots, but handle scope:X references which contain colons
    // e.g., "scope:actor.liege" -> ["scope:actor", "liege"]
    const segments = splitScopePath(path);
    if (segments.length === 0) {
        return { valid: false, finalScope: null };
    }
    let currentScope = startScope;
    for (const segment of segments) {
        // Check for scope:X references - they point to unknown scopes
        if (isScopeReference(segment)) {
            // We can't validate further - assume it works
            // Return character as a reasonable default
            return { valid: true, finalScope: 'character' };
        }
        // First check the comprehensive KNOWN_SCOPE_CHANGERS map
        const knownOutput = exports.KNOWN_SCOPE_CHANGERS.get(segment);
        if (knownOutput) {
            currentScope = knownOutput;
            continue;
        }
        // Then look up the scope changer in effectsMap/triggersMap
        const trigger = data_1.triggersMap.get(segment);
        const effect = data_1.effectsMap.get(segment);
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
function splitScopePath(path) {
    const segments = [];
    let current = '';
    for (let i = 0; i < path.length; i++) {
        const char = path[i];
        if (char === '.') {
            if (current) {
                segments.push(current);
                current = '';
            }
        }
        else if (char === ':' && current === 'scope') {
            // Start of scope:X reference - consume until next dot
            current += ':';
            i++;
            while (i < path.length && path[i] !== '.') {
                current += path[i];
                i++;
            }
            segments.push(current);
            current = '';
        }
        else {
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
function getOutputScopeForPath(path, startScope) {
    const result = validateScopePath(path, startScope);
    return result.finalScope;
}
/**
 * Check if a field name looks like a scope path (contains dots)
 */
function looksLikeScopePath(fieldName) {
    return fieldName.includes('.');
}
//# sourceMappingURL=scopeContext.js.map