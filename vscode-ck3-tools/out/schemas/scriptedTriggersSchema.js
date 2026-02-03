"use strict";
/**
 * Schema definition for CK3 Scripted Triggers - powers autocomplete and hover documentation
 *
 * Scripted triggers are reusable condition blocks that can be checked from other scripts.
 * They return true/false and are defined in common/scripted_triggers/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedTriggerSchemaMap = exports.scriptedTriggerSchema = exports.COMMON_TRIGGERS = void 0;
exports.getScriptedTriggerFieldNames = getScriptedTriggerFieldNames;
exports.getScriptedTriggerFieldDocumentation = getScriptedTriggerFieldDocumentation;
// Common trigger commands available in CK3
exports.COMMON_TRIGGERS = [
    // Character Triggers
    'is_alive',
    'is_adult',
    'is_ruler',
    'is_independent_ruler',
    'is_landed',
    'is_imprisoned',
    'is_at_war',
    'is_in_army',
    'is_knight',
    'is_councillor',
    'is_married',
    'is_pregnant',
    'is_male',
    'is_female',
    'has_trait',
    'has_character_flag',
    'has_character_modifier',
    'has_variable',
    'has_claim',
    'has_opinion',
    'has_hook',
    'has_relation_lover',
    'has_relation_friend',
    'has_relation_rival',
    // Comparisons
    'age',
    'gold',
    'prestige',
    'piety',
    'stress',
    'dread',
    'diplomacy',
    'martial',
    'stewardship',
    'intrigue',
    'learning',
    'prowess',
    'opinion',
    // Scope Triggers
    'exists',
    'this',
    'any_vassal',
    'any_courtier',
    'any_child',
    'any_spouse',
    'any_realm_county',
    'any_held_title',
    // Logic
    'AND',
    'OR',
    'NOT',
    'NOR',
    'NAND',
    // Conditional
    'if',
    'trigger_if',
    'trigger_else_if',
    'trigger_else',
    // Lists
    'any_in_list',
    'is_in_list',
    // Culture/Faith
    'faith',
    'culture',
    'has_culture',
    'has_faith',
    'has_religion',
    // Title
    'has_title',
    'highest_held_title_tier',
    'primary_title',
    // Misc
    'always',
    'is_ai',
    'is_local_player',
    'year',
    'current_date',
];
// Schema for scripted triggers
exports.scriptedTriggerSchema = [
    // Logic operators
    {
        name: 'AND',
        type: 'block',
        description: 'All conditions must be true.',
        example: `AND = {
    is_adult = yes
    is_ruler = yes
}`,
    },
    {
        name: 'OR',
        type: 'block',
        description: 'At least one condition must be true.',
        example: `OR = {
    has_trait = brave
    has_trait = ambitious
}`,
    },
    {
        name: 'NOT',
        type: 'block',
        description: 'The condition must be false.',
        example: `NOT = {
    has_trait = craven
}`,
    },
    {
        name: 'NOR',
        type: 'block',
        description: 'None of the conditions must be true.',
        example: `NOR = {
    has_trait = craven
    has_trait = content
}`,
    },
    {
        name: 'NAND',
        type: 'block',
        description: 'Not all conditions are true (at least one false).',
        example: `NAND = {
    is_ruler = yes
    is_independent_ruler = yes
}`,
    },
    // Character state triggers
    {
        name: 'is_alive',
        type: 'boolean',
        description: 'Check if the character is alive.',
        example: 'is_alive = yes',
    },
    {
        name: 'is_adult',
        type: 'boolean',
        description: 'Check if the character is an adult.',
        example: 'is_adult = yes',
    },
    {
        name: 'is_ruler',
        type: 'boolean',
        description: 'Check if the character is a ruler.',
        example: 'is_ruler = yes',
    },
    {
        name: 'is_independent_ruler',
        type: 'boolean',
        description: 'Check if the character is an independent ruler.',
        example: 'is_independent_ruler = yes',
    },
    {
        name: 'is_landed',
        type: 'boolean',
        description: 'Check if the character has landed titles.',
        example: 'is_landed = yes',
    },
    {
        name: 'is_imprisoned',
        type: 'boolean',
        description: 'Check if the character is imprisoned.',
        example: 'is_imprisoned = no',
    },
    {
        name: 'is_at_war',
        type: 'boolean',
        description: 'Check if the character is at war.',
        example: 'is_at_war = yes',
    },
    {
        name: 'is_married',
        type: 'boolean',
        description: 'Check if the character is married.',
        example: 'is_married = yes',
    },
    {
        name: 'is_pregnant',
        type: 'boolean',
        description: 'Check if the character is pregnant.',
        example: 'is_pregnant = yes',
    },
    {
        name: 'is_male',
        type: 'boolean',
        description: 'Check if the character is male.',
        example: 'is_male = yes',
    },
    {
        name: 'is_female',
        type: 'boolean',
        description: 'Check if the character is female.',
        example: 'is_female = yes',
    },
    // Trait triggers
    {
        name: 'has_trait',
        type: 'string',
        description: 'Check if the character has a specific trait.',
        example: 'has_trait = brave',
    },
    {
        name: 'has_character_flag',
        type: 'string',
        description: 'Check if the character has a specific flag.',
        example: 'has_character_flag = my_flag',
    },
    {
        name: 'has_variable',
        type: 'string',
        description: 'Check if the scope has a specific variable.',
        example: 'has_variable = my_variable',
    },
    // Numeric comparisons
    {
        name: 'age',
        type: 'integer',
        description: 'Compare character age. Use >=, <=, >, <, =.',
        example: 'age >= 16',
    },
    {
        name: 'gold',
        type: 'integer',
        description: 'Compare gold amount. Use >=, <=, >, <, =.',
        example: 'gold >= 100',
    },
    {
        name: 'prestige',
        type: 'integer',
        description: 'Compare prestige amount.',
        example: 'prestige >= 500',
    },
    {
        name: 'piety',
        type: 'integer',
        description: 'Compare piety amount.',
        example: 'piety >= 200',
    },
    {
        name: 'stress',
        type: 'integer',
        description: 'Compare stress level.',
        example: 'stress < 50',
    },
    {
        name: 'dread',
        type: 'integer',
        description: 'Compare dread level.',
        example: 'dread >= 25',
    },
    {
        name: 'diplomacy',
        type: 'integer',
        description: 'Compare diplomacy skill.',
        example: 'diplomacy >= 12',
    },
    {
        name: 'martial',
        type: 'integer',
        description: 'Compare martial skill.',
        example: 'martial >= 15',
    },
    {
        name: 'stewardship',
        type: 'integer',
        description: 'Compare stewardship skill.',
        example: 'stewardship >= 10',
    },
    {
        name: 'intrigue',
        type: 'integer',
        description: 'Compare intrigue skill.',
        example: 'intrigue >= 14',
    },
    {
        name: 'learning',
        type: 'integer',
        description: 'Compare learning skill.',
        example: 'learning >= 12',
    },
    {
        name: 'prowess',
        type: 'integer',
        description: 'Compare prowess skill.',
        example: 'prowess >= 10',
    },
    // Scope triggers
    {
        name: 'exists',
        type: 'string',
        description: 'Check if a scope exists.',
        example: 'exists = scope:target',
    },
    {
        name: 'any_vassal',
        type: 'block',
        description: 'Check if any vassal matches conditions.',
        example: `any_vassal = {
    has_trait = ambitious
}`,
    },
    {
        name: 'any_courtier',
        type: 'block',
        description: 'Check if any courtier matches conditions.',
        example: `any_courtier = {
    intrigue >= 15
}`,
    },
    {
        name: 'any_child',
        type: 'block',
        description: 'Check if any child matches conditions.',
        example: `any_child = {
    is_adult = yes
}`,
    },
    {
        name: 'any_spouse',
        type: 'block',
        description: 'Check if any spouse matches conditions.',
        example: `any_spouse = {
    diplomacy >= 10
}`,
    },
    // Culture/Faith triggers
    {
        name: 'has_culture',
        type: 'string',
        description: 'Check if the character has a specific culture.',
        example: 'has_culture = culture:english',
    },
    {
        name: 'has_faith',
        type: 'string',
        description: 'Check if the character has a specific faith.',
        example: 'has_faith = faith:catholic',
    },
    {
        name: 'has_religion',
        type: 'string',
        description: 'Check if the character has a specific religion.',
        example: 'has_religion = religion:christianity_religion',
    },
    // Title triggers
    {
        name: 'has_title',
        type: 'string',
        description: 'Check if the character holds a specific title.',
        example: 'has_title = title:k_england',
    },
    {
        name: 'highest_held_title_tier',
        type: 'enum',
        description: 'Check the highest title tier held.',
        values: [
            'barony', 'county', 'duchy', 'kingdom', 'empire',
            // Also valid with tier_ prefix
            'tier_barony', 'tier_county', 'tier_duchy', 'tier_kingdom', 'tier_empire',
        ],
        example: 'highest_held_title_tier >= tier_kingdom',
    },
    // Conditional triggers
    {
        name: 'trigger_if',
        type: 'block',
        description: 'Conditional trigger (if condition met, check inner triggers).',
        example: `trigger_if = {
    limit = { is_ruler = yes }
    gold >= 100
}`,
    },
    {
        name: 'trigger_else_if',
        type: 'block',
        description: 'Else-if conditional trigger.',
        example: `trigger_else_if = {
    limit = { is_landed = yes }
    gold >= 50
}`,
    },
    {
        name: 'trigger_else',
        type: 'block',
        description: 'Else conditional trigger.',
        example: `trigger_else = {
    always = yes
}`,
    },
    // Special triggers
    {
        name: 'always',
        type: 'boolean',
        description: 'Always true or always false.',
        example: 'always = yes',
    },
    {
        name: 'is_ai',
        type: 'boolean',
        description: 'Check if the character is AI-controlled.',
        example: 'is_ai = yes',
    },
    {
        name: 'is_local_player',
        type: 'boolean',
        description: 'Check if the character is the local player.',
        example: 'is_local_player = yes',
    },
    {
        name: 'custom_tooltip',
        type: 'block',
        description: 'Wrap triggers with a custom tooltip.',
        example: `custom_tooltip = {
    text = my_custom_tooltip_key
    has_trait = brave
}`,
    },
];
// Map for quick lookup
exports.scriptedTriggerSchemaMap = new Map(exports.scriptedTriggerSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getScriptedTriggerFieldNames() {
    return exports.scriptedTriggerSchema.map((field) => field.name);
}
// Get documentation for a field
function getScriptedTriggerFieldDocumentation(fieldName) {
    const field = exports.scriptedTriggerSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedTriggersSchema.js.map