"use strict";
/**
 * Schema definition for CK3 Scripted Effects - powers autocomplete and hover documentation
 *
 * Scripted effects are reusable effect blocks that can be called from other scripts.
 * They can take parameters and are defined in common/scripted_effects/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedEffectSchemaMap = exports.scriptedEffectSchema = exports.COMMON_EFFECTS = void 0;
exports.getScriptedEffectFieldNames = getScriptedEffectFieldNames;
exports.getScriptedEffectFieldDocumentation = getScriptedEffectFieldDocumentation;
// Common effect commands available in CK3
exports.COMMON_EFFECTS = [
    // Character Effects
    'add_gold',
    'remove_short_term_gold',
    'add_prestige',
    'add_piety',
    'add_stress',
    'add_trait',
    'remove_trait',
    'add_character_flag',
    'remove_character_flag',
    'set_variable',
    'change_variable',
    'add_opinion',
    'reverse_add_opinion',
    'remove_opinion',
    'add_hook',
    'remove_hook',
    'make_pregnant',
    'death',
    'imprison',
    'release_from_prison',
    'add_dread',
    'add_tyranny',
    'add_claim',
    'remove_claim',
    'create_title_and_vassal_change',
    'give_title',
    // Scope Changes
    'every_character',
    'random_character',
    'every_vassal',
    'every_courtier',
    'every_knight',
    'every_child',
    'every_spouse',
    'every_realm_county',
    'every_realm_province',
    'every_held_title',
    // Title Effects
    'set_de_jure_liege_title',
    'set_capital_county',
    'set_county_faith',
    'set_county_culture',
    // War Effects
    'start_war',
    'end_war',
    'add_war_contribution',
    // Event Effects
    'trigger_event',
    'save_scope_as',
    'save_temporary_scope_as',
    // Conditional
    'if',
    'else_if',
    'else',
    'switch',
    'while',
    // Lists
    'add_to_list',
    'remove_from_list',
    'every_in_list',
    'random_in_list',
    // Memory/AI
    'add_to_temporary_list',
    'set_memory',
];
// Schema for scripted effects - shows common top-level patterns
exports.scriptedEffectSchema = [
    // These are common effect commands that will work inside any effect block
    {
        name: 'add_gold',
        type: 'integer',
        description: 'Add or remove gold from the character.',
        example: 'add_gold = 100',
    },
    {
        name: 'add_prestige',
        type: 'integer',
        description: 'Add or remove prestige from the character.',
        example: 'add_prestige = 500',
    },
    {
        name: 'add_piety',
        type: 'integer',
        description: 'Add or remove piety from the character.',
        example: 'add_piety = 200',
    },
    {
        name: 'add_stress',
        type: 'integer',
        description: 'Add or remove stress from the character.',
        example: 'add_stress = 25',
    },
    {
        name: 'add_dread',
        type: 'integer',
        description: 'Add or remove dread from the character.',
        example: 'add_dread = 10',
    },
    {
        name: 'add_tyranny',
        type: 'integer',
        description: 'Add or remove tyranny from the character.',
        example: 'add_tyranny = 15',
    },
    {
        name: 'add_trait',
        type: 'string',
        description: 'Add a trait to the character.',
        example: 'add_trait = brave',
    },
    {
        name: 'remove_trait',
        type: 'string',
        description: 'Remove a trait from the character.',
        example: 'remove_trait = craven',
    },
    {
        name: 'add_character_flag',
        type: 'block',
        description: 'Add a flag to the character.',
        example: `add_character_flag = {
    flag = my_flag
    days = 365
}`,
    },
    {
        name: 'remove_character_flag',
        type: 'string',
        description: 'Remove a flag from the character.',
        example: 'remove_character_flag = my_flag',
    },
    {
        name: 'add_opinion',
        type: 'block',
        description: 'Add an opinion modifier towards a target.',
        example: `add_opinion = {
    target = scope:other_character
    modifier = grateful_opinion
    opinion = 20
}`,
    },
    {
        name: 'reverse_add_opinion',
        type: 'block',
        description: 'Add an opinion modifier from target towards this character.',
        example: `reverse_add_opinion = {
    target = scope:other_character
    modifier = grateful_opinion
}`,
    },
    {
        name: 'add_hook',
        type: 'block',
        description: 'Add a hook on a character.',
        example: `add_hook = {
    type = favor_hook
    target = scope:target_character
}`,
    },
    {
        name: 'trigger_event',
        type: 'block',
        description: 'Trigger an event for the character.',
        example: `trigger_event = {
    id = my_event.0001
    days = 5
}`,
    },
    {
        name: 'save_scope_as',
        type: 'string',
        description: 'Save the current scope with a name.',
        example: 'save_scope_as = my_saved_character',
    },
    {
        name: 'save_temporary_scope_as',
        type: 'string',
        description: 'Save the current scope temporarily (cleared after event chain).',
        example: 'save_temporary_scope_as = temp_character',
    },
    {
        name: 'if',
        type: 'block',
        description: 'Conditional effect block.',
        example: `if = {
    limit = { gold >= 100 }
    add_gold = -100
}`,
    },
    {
        name: 'else_if',
        type: 'block',
        description: 'Else-if conditional block.',
        example: `else_if = {
    limit = { gold >= 50 }
    add_gold = -50
}`,
    },
    {
        name: 'else',
        type: 'block',
        description: 'Else conditional block.',
        example: `else = {
    add_stress = 10
}`,
    },
    {
        name: 'every_vassal',
        type: 'block',
        description: 'Iterate over all vassals.',
        example: `every_vassal = {
    add_opinion = { target = root modifier = grateful }
}`,
    },
    {
        name: 'every_courtier',
        type: 'block',
        description: 'Iterate over all courtiers.',
        example: `every_courtier = {
    limit = { is_adult = yes }
    add_gold = 10
}`,
    },
    {
        name: 'random_vassal',
        type: 'block',
        description: 'Select a random vassal.',
        example: `random_vassal = {
    limit = { is_powerful_vassal = yes }
    add_hook = { type = favor_hook target = root }
}`,
    },
    {
        name: 'death',
        type: 'block',
        description: 'Kill the character.',
        example: `death = {
    death_reason = death_murder_known
    killer = scope:killer
}`,
    },
    {
        name: 'imprison',
        type: 'block',
        description: 'Imprison the character.',
        example: `imprison = {
    target = scope:criminal
    type = dungeon
}`,
    },
    {
        name: 'set_variable',
        type: 'block',
        description: 'Set a variable on the scope.',
        example: `set_variable = {
    name = my_counter
    value = 0
}`,
    },
    {
        name: 'change_variable',
        type: 'block',
        description: 'Change a variable value.',
        example: `change_variable = {
    name = my_counter
    add = 1
}`,
    },
    {
        name: 'create_character',
        type: 'block',
        description: 'Create a new character.',
        example: `create_character = {
    name = "John"
    age = 25
    culture = culture:english
    faith = faith:catholic
    save_scope_as = new_character
}`,
    },
    {
        name: 'spawn_army',
        type: 'block',
        description: 'Spawn an army for the character.',
        example: `spawn_army = {
    levies = 1000
    men_at_arms = {
        type = pikemen
        stacks = 5
    }
    location = root.capital_province
}`,
    },
];
// Map for quick lookup
exports.scriptedEffectSchemaMap = new Map(exports.scriptedEffectSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getScriptedEffectFieldNames() {
    return exports.scriptedEffectSchema.map((field) => field.name);
}
// Get documentation for a field
function getScriptedEffectFieldDocumentation(fieldName) {
    const field = exports.scriptedEffectSchemaMap.get(fieldName);
    if (!field)
        return undefined;
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
//# sourceMappingURL=scriptedEffectsSchema.js.map