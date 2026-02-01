"use strict";
/**
 * CK3 Effect Definitions
 *
 * Effects are commands that modify game state.
 * Each effect has a list of scopes where it can be used.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.effectsMap = exports.allEffects = exports.scopeChangeEffects = exports.controlFlowEffects = exports.iteratorEffects = exports.characterEffects = void 0;
exports.getEffectsForScope = getEffectsForScope;
/**
 * Common character scope effects
 * This is a curated subset - the full list has 400+ effects
 */
exports.characterEffects = [
    // Resource effects
    { name: 'add_gold', description: 'Add or remove gold from a character', supportedScopes: ['character'], syntax: 'add_gold = 100' },
    { name: 'add_prestige', description: 'Add or remove prestige from a character', supportedScopes: ['character'], syntax: 'add_prestige = 100' },
    { name: 'add_piety', description: 'Add or remove piety from a character', supportedScopes: ['character'], syntax: 'add_piety = 100' },
    { name: 'add_stress', description: 'Add or remove stress from a character', supportedScopes: ['character'], syntax: 'add_stress = 10' },
    { name: 'add_dread', description: 'Add or remove dread from a character', supportedScopes: ['character'], syntax: 'add_dread = 25' },
    { name: 'add_tyranny', description: 'Add or remove tyranny from a character', supportedScopes: ['character'], syntax: 'add_tyranny = 10' },
    // Trait effects
    { name: 'add_trait', description: 'Add a trait to the character', supportedScopes: ['character'], syntax: 'add_trait = brave' },
    { name: 'remove_trait', description: 'Remove a trait from the character', supportedScopes: ['character'], syntax: 'remove_trait = craven' },
    { name: 'add_trait_force_tooltip', description: 'Add a trait with forced tooltip display', supportedScopes: ['character'], syntax: 'add_trait_force_tooltip = brave' },
    // Skill effects
    { name: 'add_diplomacy_skill', description: 'Add to diplomacy skill', supportedScopes: ['character'], syntax: 'add_diplomacy_skill = 2' },
    { name: 'add_martial_skill', description: 'Add to martial skill', supportedScopes: ['character'], syntax: 'add_martial_skill = 2' },
    { name: 'add_stewardship_skill', description: 'Add to stewardship skill', supportedScopes: ['character'], syntax: 'add_stewardship_skill = 2' },
    { name: 'add_intrigue_skill', description: 'Add to intrigue skill', supportedScopes: ['character'], syntax: 'add_intrigue_skill = 2' },
    { name: 'add_learning_skill', description: 'Add to learning skill', supportedScopes: ['character'], syntax: 'add_learning_skill = 2' },
    { name: 'add_prowess_skill', description: 'Add to prowess skill', supportedScopes: ['character'], syntax: 'add_prowess_skill = 2' },
    // Opinion effects
    { name: 'add_opinion', description: 'Add opinion modifier between characters', supportedScopes: ['character'], syntax: 'add_opinion = { target = scope:actor modifier = grateful opinion = 20 }' },
    { name: 'reverse_add_opinion', description: 'Add opinion from target to this character', supportedScopes: ['character'], syntax: 'reverse_add_opinion = { target = scope:actor modifier = grateful opinion = 20 }' },
    { name: 'remove_opinion', description: 'Remove an opinion modifier', supportedScopes: ['character'], syntax: 'remove_opinion = { target = scope:actor modifier = grateful }' },
    // Modifier effects
    { name: 'add_character_modifier', description: 'Add a timed modifier to the character', supportedScopes: ['character'], syntax: 'add_character_modifier = { modifier = name years = 10 }' },
    { name: 'remove_character_modifier', description: 'Remove a modifier from the character', supportedScopes: ['character'], syntax: 'remove_character_modifier = modifier_name' },
    // Flag effects
    { name: 'add_character_flag', description: 'Add a flag to the character', supportedScopes: ['character'], syntax: 'add_character_flag = my_flag' },
    { name: 'remove_character_flag', description: 'Remove a flag from the character', supportedScopes: ['character'], syntax: 'remove_character_flag = my_flag' },
    { name: 'set_variable', description: 'Set a variable on the character', supportedScopes: ['character', 'none'], syntax: 'set_variable = { name = my_var value = 5 }' },
    { name: 'change_variable', description: 'Change a variable value', supportedScopes: ['character', 'none'], syntax: 'change_variable = { name = my_var add = 1 }' },
    // Relation effects
    { name: 'set_relation_friend', description: 'Set friend relation with another character', supportedScopes: ['character'], syntax: 'set_relation_friend = scope:target' },
    { name: 'set_relation_rival', description: 'Set rival relation with another character', supportedScopes: ['character'], syntax: 'set_relation_rival = scope:target' },
    { name: 'set_relation_lover', description: 'Set lover relation with another character', supportedScopes: ['character'], syntax: 'set_relation_lover = scope:target' },
    { name: 'set_relation_potential_friend', description: 'Set potential friend relation', supportedScopes: ['character'], syntax: 'set_relation_potential_friend = scope:target' },
    { name: 'set_relation_potential_rival', description: 'Set potential rival relation', supportedScopes: ['character'], syntax: 'set_relation_potential_rival = scope:target' },
    { name: 'remove_relation_friend', description: 'Remove friend relation', supportedScopes: ['character'], syntax: 'remove_relation_friend = scope:target' },
    { name: 'remove_relation_rival', description: 'Remove rival relation', supportedScopes: ['character'], syntax: 'remove_relation_rival = scope:target' },
    // Health/Death effects
    { name: 'death', description: 'Kill the character', supportedScopes: ['character'], syntax: 'death = { death_reason = death_natural }' },
    { name: 'add_health', description: 'Add or subtract health', supportedScopes: ['character'], syntax: 'add_health = -2' },
    { name: 'set_immortal', description: 'Set character immortality', supportedScopes: ['character'], syntax: 'set_immortal = yes' },
    // Title effects
    { name: 'create_title_and_vassal_change', description: 'Begin a title change block', supportedScopes: ['character'], syntax: 'create_title_and_vassal_change = { type = conquest }' },
    { name: 'give_title', description: 'Give a title to a character', supportedScopes: ['character'], syntax: 'give_title = title:c_paris' },
    { name: 'destroy_title', description: 'Destroy a title', supportedScopes: ['character', 'landed_title'], syntax: 'destroy_title = title:k_france' },
    // Event effects
    { name: 'trigger_event', description: 'Trigger an event for the character', supportedScopes: ['character', 'none'], syntax: 'trigger_event = my_events.001' },
    { name: 'save_scope_as', description: 'Save current scope for later reference', supportedScopes: ['character', 'none'], syntax: 'save_scope_as = my_saved_scope' },
    { name: 'save_temporary_scope_as', description: 'Save scope temporarily (event only)', supportedScopes: ['character', 'none'], syntax: 'save_temporary_scope_as = temp_scope' },
    // Interface effects
    { name: 'send_interface_message', description: 'Send a message to the player', supportedScopes: ['character'], syntax: 'send_interface_message = { type = event_generic_neutral title = loc_key }' },
    { name: 'custom_tooltip', description: 'Display custom tooltip text', supportedScopes: ['character', 'none'], syntax: 'custom_tooltip = my_tooltip_loc_key' },
    { name: 'show_as_tooltip', description: 'Show effects as tooltip only (not executed)', supportedScopes: ['character', 'none'], syntax: 'show_as_tooltip = { add_gold = 100 }' },
    // Scheme effects
    { name: 'start_scheme', description: 'Start a scheme against a target', supportedScopes: ['character'], syntax: 'start_scheme = { type = murder target = scope:target }' },
    { name: 'end_scheme', description: 'End an ongoing scheme', supportedScopes: ['scheme'], syntax: 'end_scheme = yes' },
    // War effects
    { name: 'start_war', description: 'Start a war', supportedScopes: ['character'], syntax: 'start_war = { casus_belli = cb_type target = scope:target }' },
    { name: 'end_war', description: 'End a war', supportedScopes: ['war'], syntax: 'end_war = white_peace' },
];
/**
 * Iterator effects that change scope to each matching target
 */
exports.iteratorEffects = [
    // Character iterators
    { name: 'every_vassal', description: 'Iterate through all direct vassals', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_vassal = { limit = { <triggers> } <effects> }' },
    { name: 'random_vassal', description: 'Select a random direct vassal', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'random_vassal = { limit = { <triggers> } <effects> }' },
    { name: 'every_child', description: 'Iterate through all children', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_child = { limit = { <triggers> } <effects> }' },
    { name: 'random_child', description: 'Select a random child', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'random_child = { limit = { <triggers> } <effects> }' },
    { name: 'every_spouse', description: 'Iterate through all spouses', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_spouse = { limit = { <triggers> } <effects> }' },
    { name: 'every_sibling', description: 'Iterate through all siblings', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_sibling = { limit = { <triggers> } <effects> }' },
    { name: 'every_courtier', description: 'Iterate through all courtiers', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_courtier = { limit = { <triggers> } <effects> }' },
    { name: 'every_prisoner', description: 'Iterate through all prisoners', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_prisoner = { limit = { <triggers> } <effects> }' },
    { name: 'every_knight', description: 'Iterate through all knights', supportedScopes: ['character'], supportedTargets: ['character'], outputScope: 'character', isIterator: true, syntax: 'every_knight = { limit = { <triggers> } <effects> }' },
    { name: 'every_realm_county', description: 'Iterate through all counties in realm', supportedScopes: ['character'], supportedTargets: ['landed_title'], outputScope: 'landed_title', isIterator: true, syntax: 'every_realm_county = { limit = { <triggers> } <effects> }' },
    { name: 'every_held_title', description: 'Iterate through all held titles', supportedScopes: ['character'], supportedTargets: ['landed_title'], outputScope: 'landed_title', isIterator: true, syntax: 'every_held_title = { limit = { <triggers> } <effects> }' },
    { name: 'every_claim', description: 'Iterate through all claims', supportedScopes: ['character'], supportedTargets: ['landed_title'], outputScope: 'landed_title', isIterator: true, syntax: 'every_claim = { limit = { <triggers> } <effects> }' },
    // General iterators
    { name: 'every_in_list', description: 'Iterate through items in a saved list', supportedScopes: ['none'], outputScope: 'none', isIterator: true, syntax: 'every_in_list = { list = list_name <effects> }' },
    { name: 'random_in_list', description: 'Select random item from a saved list', supportedScopes: ['none'], outputScope: 'none', isIterator: true, syntax: 'random_in_list = { list = list_name <effects> }' },
];
/**
 * Control flow effects
 */
exports.controlFlowEffects = [
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
 * Scope-changing effects (non-iterators)
 */
exports.scopeChangeEffects = [
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
];
/**
 * All effects combined
 */
exports.allEffects = [
    ...exports.characterEffects,
    ...exports.iteratorEffects,
    ...exports.controlFlowEffects,
    ...exports.scopeChangeEffects,
];
/**
 * Get effects valid for a specific scope
 */
function getEffectsForScope(scope) {
    return exports.allEffects.filter(effect => {
        // 'none' scope means it works everywhere
        if (effect.supportedScopes.includes('none'))
            return true;
        return effect.supportedScopes.includes(scope);
    });
}
/**
 * Build a map for quick lookup
 */
exports.effectsMap = new Map(exports.allEffects.map(e => [e.name, e]));
//# sourceMappingURL=effects.js.map