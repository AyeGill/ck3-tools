"use strict";
/**
 * CK3 Trigger Definitions
 *
 * Triggers are conditions that evaluate to true or false.
 * Each trigger has a list of scopes where it can be used.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggersMap = exports.allTriggers = exports.specialTriggers = exports.scopeChangeTriggers = exports.logicalTriggers = exports.iteratorTriggers = exports.characterTriggers = void 0;
exports.getTriggersForScope = getTriggersForScope;
/**
 * Common character scope triggers
 */
exports.characterTriggers = [
    // Basic state triggers
    { name: 'is_alive', description: 'Check if character is alive', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_alive = yes' },
    { name: 'is_adult', description: 'Check if character is adult (16+)', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_adult = yes' },
    { name: 'is_ruler', description: 'Check if character is a ruler', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_ruler = yes' },
    { name: 'is_landed', description: 'Check if character holds land', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_landed = yes' },
    { name: 'is_imprisoned', description: 'Check if character is imprisoned', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_imprisoned = yes' },
    { name: 'is_at_war', description: 'Check if character is at war', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_at_war = yes' },
    { name: 'is_available', description: 'Character is available for activities', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_available = yes' },
    { name: 'is_busy_in_events_localised', description: 'Check if character is busy in events', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_busy_in_events_localised = yes' },
    // Gender/Sexuality triggers
    { name: 'is_male', description: 'Check if character is male', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_male = yes' },
    { name: 'is_female', description: 'Check if character is female', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_female = yes' },
    { name: 'is_attracted_to_men', description: 'Check if attracted to men', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_attracted_to_men = yes' },
    { name: 'is_attracted_to_women', description: 'Check if attracted to women', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_attracted_to_women = yes' },
    // Age triggers
    { name: 'age', description: 'Compare character age', supportedScopes: ['character'], valueType: 'comparison', syntax: 'age >= 16' },
    // Resource comparison triggers
    { name: 'gold', description: 'Compare gold amount', supportedScopes: ['character'], valueType: 'comparison', syntax: 'gold >= 100' },
    { name: 'prestige', description: 'Compare prestige amount', supportedScopes: ['character'], valueType: 'comparison', syntax: 'prestige >= 500' },
    { name: 'piety', description: 'Compare piety amount', supportedScopes: ['character'], valueType: 'comparison', syntax: 'piety >= 500' },
    { name: 'stress', description: 'Compare stress level', supportedScopes: ['character'], valueType: 'comparison', syntax: 'stress >= 50' },
    { name: 'dread', description: 'Compare dread amount', supportedScopes: ['character'], valueType: 'comparison', syntax: 'dread >= 50' },
    { name: 'tyranny', description: 'Compare tyranny amount', supportedScopes: ['character'], valueType: 'comparison', syntax: 'tyranny >= 20' },
    // Skill comparison triggers
    { name: 'diplomacy', description: 'Compare diplomacy skill', supportedScopes: ['character'], valueType: 'comparison', syntax: 'diplomacy >= 10' },
    { name: 'martial', description: 'Compare martial skill', supportedScopes: ['character'], valueType: 'comparison', syntax: 'martial >= 10' },
    { name: 'stewardship', description: 'Compare stewardship skill', supportedScopes: ['character'], valueType: 'comparison', syntax: 'stewardship >= 10' },
    { name: 'intrigue', description: 'Compare intrigue skill', supportedScopes: ['character'], valueType: 'comparison', syntax: 'intrigue >= 10' },
    { name: 'learning', description: 'Compare learning skill', supportedScopes: ['character'], valueType: 'comparison', syntax: 'learning >= 10' },
    { name: 'prowess', description: 'Compare prowess skill', supportedScopes: ['character'], valueType: 'comparison', syntax: 'prowess >= 10' },
    // Trait triggers
    { name: 'has_trait', description: 'Check if character has a trait', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_trait = brave' },
    { name: 'num_of_bad_genetic_traits', description: 'Count of bad genetic traits', supportedScopes: ['character'], valueType: 'comparison', syntax: 'num_of_bad_genetic_traits >= 1' },
    { name: 'num_of_good_genetic_traits', description: 'Count of good genetic traits', supportedScopes: ['character'], valueType: 'comparison', syntax: 'num_of_good_genetic_traits >= 1' },
    { name: 'has_personality_trait_trigger', description: 'Has any personality trait', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_personality_trait_trigger = yes' },
    // Relationship triggers
    { name: 'is_spouse_of', description: 'Check if spouse of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_spouse_of = scope:target' },
    { name: 'is_child_of', description: 'Check if child of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_child_of = scope:target' },
    { name: 'is_parent_of', description: 'Check if parent of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_parent_of = scope:target' },
    { name: 'is_sibling_of', description: 'Check if sibling of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_sibling_of = scope:target' },
    { name: 'is_close_family_of', description: 'Check if close family of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_close_family_of = scope:target' },
    { name: 'is_courtier_of', description: 'Check if courtier of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_courtier_of = scope:target' },
    { name: 'is_vassal_of', description: 'Check if vassal of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_vassal_of = scope:target' },
    { name: 'is_liege_or_above_of', description: 'Check if liege or above of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_liege_or_above_of = scope:target' },
    // Relation triggers
    { name: 'has_relation_friend', description: 'Check if friend of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_relation_friend = scope:target' },
    { name: 'has_relation_rival', description: 'Check if rival of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_relation_rival = scope:target' },
    { name: 'has_relation_lover', description: 'Check if lover of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_relation_lover = scope:target' },
    { name: 'has_relation_best_friend', description: 'Check if best friend of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_relation_best_friend = scope:target' },
    { name: 'has_relation_nemesis', description: 'Check if nemesis of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_relation_nemesis = scope:target' },
    { name: 'has_relation_soulmate', description: 'Check if soulmate of target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_relation_soulmate = scope:target' },
    // Opinion triggers
    { name: 'opinion', description: 'Check opinion towards target', supportedScopes: ['character'], valueType: 'block', syntax: 'opinion = { target = scope:target value >= 50 }' },
    { name: 'reverse_opinion', description: 'Check target opinion towards this', supportedScopes: ['character'], valueType: 'block', syntax: 'reverse_opinion = { target = scope:target value >= 50 }' },
    { name: 'has_opinion_modifier', description: 'Check for specific opinion modifier', supportedScopes: ['character'], valueType: 'block', syntax: 'has_opinion_modifier = { target = scope:target modifier = grateful }' },
    // Flag triggers
    { name: 'has_character_flag', description: 'Check if character has flag', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_character_flag = my_flag' },
    { name: 'has_variable', description: 'Check if variable exists', supportedScopes: ['character', 'none'], valueType: 'boolean', syntax: 'has_variable = my_var' },
    // Title triggers
    { name: 'highest_held_title_tier', description: 'Compare highest title tier', supportedScopes: ['character'], valueType: 'comparison', syntax: 'highest_held_title_tier >= tier_duchy' },
    { name: 'has_title', description: 'Check if holds specific title', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_title = title:k_france' },
    { name: 'has_claim_on', description: 'Check if has claim on title', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_claim_on = title:k_france' },
    // Faith triggers
    { name: 'has_same_faith_as', description: 'Check if same faith as target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_same_faith_as = scope:target' },
    { name: 'faith_hostility_level', description: 'Check faith hostility', supportedScopes: ['character'], valueType: 'block', syntax: 'faith_hostility_level = { target = scope:target value >= 2 }' },
    // Culture triggers
    { name: 'has_same_culture_as', description: 'Check if same culture as target', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_same_culture_as = scope:target' },
    { name: 'has_culture', description: 'Check if has specific culture', supportedScopes: ['character'], valueType: 'boolean', syntax: 'has_culture = culture:english' },
    // Health triggers
    { name: 'health', description: 'Compare health value', supportedScopes: ['character'], valueType: 'comparison', syntax: 'health >= 4' },
    { name: 'is_immortal', description: 'Check if immortal', supportedScopes: ['character'], valueType: 'boolean', syntax: 'is_immortal = yes' },
];
/**
 * Iterator triggers (any_, all_)
 */
exports.iteratorTriggers = [
    { name: 'any_vassal', description: 'Check if any vassal matches', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'any_vassal = { <triggers> }' },
    { name: 'any_child', description: 'Check if any child matches', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'any_child = { <triggers> }' },
    { name: 'any_spouse', description: 'Check if any spouse matches', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'any_spouse = { <triggers> }' },
    { name: 'any_sibling', description: 'Check if any sibling matches', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'any_sibling = { <triggers> }' },
    { name: 'any_courtier', description: 'Check if any courtier matches', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'any_courtier = { <triggers> }' },
    { name: 'any_realm_county', description: 'Check if any realm county matches', supportedScopes: ['character'], supportedTargets: ['landed_title'], outputScope: 'landed_title', isIterator: true, syntax: 'any_realm_county = { <triggers> }' },
    { name: 'any_held_title', description: 'Check if any held title matches', supportedScopes: ['character'], supportedTargets: ['landed_title'], outputScope: 'landed_title', isIterator: true, syntax: 'any_held_title = { <triggers> }' },
    { name: 'any_claim', description: 'Check if any claim matches', supportedScopes: ['character'], supportedTargets: ['landed_title'], outputScope: 'landed_title', isIterator: true, syntax: 'any_claim = { <triggers> }' },
    { name: 'any_in_list', description: 'Check if any in list matches', supportedScopes: ['none'], isIterator: true, syntax: 'any_in_list = { list = list_name <triggers> }' },
    { name: 'all_vassal', description: 'Check if all vassals match', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'all_vassal = { <triggers> }' },
    { name: 'all_child', description: 'Check if all children match', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'all_child = { <triggers> }' },
];
/**
 * Logical triggers
 */
exports.logicalTriggers = [
    { name: 'NOT', description: 'Negate a trigger', supportedScopes: ['none'], valueType: 'block', syntax: 'NOT = { <triggers> }' },
    { name: 'AND', description: 'All triggers must be true', supportedScopes: ['none'], valueType: 'block', syntax: 'AND = { <triggers> }' },
    { name: 'OR', description: 'At least one trigger must be true', supportedScopes: ['none'], valueType: 'block', syntax: 'OR = { <triggers> }' },
    { name: 'NOR', description: 'No triggers can be true', supportedScopes: ['none'], valueType: 'block', syntax: 'NOR = { <triggers> }' },
    { name: 'NAND', description: 'Not all triggers are true', supportedScopes: ['none'], valueType: 'block', syntax: 'NAND = { <triggers> }' },
    { name: 'trigger_if', description: 'Conditional trigger evaluation', supportedScopes: ['none'], valueType: 'block', syntax: 'trigger_if = { limit = { <display_triggers> } <triggers> }' },
    { name: 'trigger_else', description: 'Else branch for trigger_if', supportedScopes: ['none'], valueType: 'block', syntax: 'trigger_else = { <triggers> }' },
    { name: 'trigger_else_if', description: 'Else-if branch', supportedScopes: ['none'], valueType: 'block', syntax: 'trigger_else_if = { limit = { <display_triggers> } <triggers> }' },
];
/**
 * Scope-changing triggers
 */
exports.scopeChangeTriggers = [
    { name: 'liege', description: 'Check triggers on liege', supportedScopes: ['character'], outputScope: 'character', syntax: 'liege = { <triggers> }' },
    { name: 'father', description: 'Check triggers on father', supportedScopes: ['character'], outputScope: 'character', syntax: 'father = { <triggers> }' },
    { name: 'mother', description: 'Check triggers on mother', supportedScopes: ['character'], outputScope: 'character', syntax: 'mother = { <triggers> }' },
    { name: 'primary_spouse', description: 'Check triggers on primary spouse', supportedScopes: ['character'], outputScope: 'character', syntax: 'primary_spouse = { <triggers> }' },
    { name: 'primary_title', description: 'Check triggers on primary title', supportedScopes: ['character'], outputScope: 'landed_title', syntax: 'primary_title = { <triggers> }' },
    { name: 'capital_county', description: 'Check triggers on capital county', supportedScopes: ['character'], outputScope: 'landed_title', syntax: 'capital_county = { <triggers> }' },
    { name: 'dynasty', description: 'Check triggers on dynasty', supportedScopes: ['character'], outputScope: 'dynasty', syntax: 'dynasty = { <triggers> }' },
    { name: 'faith', description: 'Check triggers on faith', supportedScopes: ['character'], outputScope: 'faith', syntax: 'faith = { <triggers> }' },
    { name: 'culture', description: 'Check triggers on culture', supportedScopes: ['character'], outputScope: 'culture', syntax: 'culture = { <triggers> }' },
    { name: 'holder', description: 'Check triggers on title holder', supportedScopes: ['landed_title'], outputScope: 'character', syntax: 'holder = { <triggers> }' },
    { name: 'exists', description: 'Check if scope exists', supportedScopes: ['none'], valueType: 'boolean', syntax: 'exists = scope:target' },
];
/**
 * Special triggers
 */
exports.specialTriggers = [
    { name: 'always', description: 'Always true or false', supportedScopes: ['none'], valueType: 'boolean', syntax: 'always = yes' },
    { name: 'is_target_in_global_variable_list', description: 'Check if in global variable list', supportedScopes: ['none'], valueType: 'block', syntax: 'is_target_in_global_variable_list = { name = list_name target = scope:target }' },
    { name: 'debug_only', description: 'Only true in debug mode', supportedScopes: ['none'], valueType: 'boolean', syntax: 'debug_only = yes' },
    { name: 'game_start_date', description: 'Compare to game start date', supportedScopes: ['none'], valueType: 'comparison', syntax: 'game_start_date = 1066.9.15' },
    { name: 'current_date', description: 'Compare to current date', supportedScopes: ['none'], valueType: 'comparison', syntax: 'current_date >= 1100.1.1' },
];
/**
 * All triggers combined
 */
exports.allTriggers = [
    ...exports.characterTriggers,
    ...exports.iteratorTriggers,
    ...exports.logicalTriggers,
    ...exports.scopeChangeTriggers,
    ...exports.specialTriggers,
];
/**
 * Get triggers valid for a specific scope
 */
function getTriggersForScope(scope) {
    return exports.allTriggers.filter(trigger => {
        // 'none' scope means it works everywhere
        if (trigger.supportedScopes.includes('none'))
            return true;
        return trigger.supportedScopes.includes(scope);
    });
}
/**
 * Build a map for quick lookup
 */
exports.triggersMap = new Map(exports.allTriggers.map(t => [t.name, t]));
//# sourceMappingURL=triggers.js.map