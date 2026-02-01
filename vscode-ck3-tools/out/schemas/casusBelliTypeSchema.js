"use strict";
/**
 * Schema definition for CK3 Casus Belli Types - autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.casusBelliTypeSchemaMap = exports.casusBelliTypeSchema = void 0;
exports.getCasusBelliTypeFieldNames = getCasusBelliTypeFieldNames;
exports.getCasusBelliTypeFieldDocumentation = getCasusBelliTypeFieldDocumentation;
exports.casusBelliTypeSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the casus belli type name.',
        example: 'name = "casus_belli_type_conquest"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "casus_belli_type_conquest_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this casus belli type.',
        example: 'icon = "gfx/interface/icons/casus_belli/conquest.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'War type category.',
        values: ['conquest', 'claim', 'holy_war', 'independence', 'subjugation', 'civil_war', 'special'],
        example: 'type = conquest',
    },
    // Priority
    {
        name: 'priority',
        type: 'integer',
        description: 'Display priority.',
        example: 'priority = 100',
    },
    // Group
    {
        name: 'group',
        type: 'string',
        description: 'Casus belli group.',
        example: 'group = conquest_casus_belli_group',
    },
    // Cost
    {
        name: 'cost',
        type: 'block',
        description: 'Cost to declare.',
        example: `cost = {
    piety = 500
    prestige = 200
}`,
    },
    // War Score
    {
        name: 'war_score_from_battles',
        type: 'float',
        description: 'War score gained from battles.',
        example: 'war_score_from_battles = 1.0',
    },
    {
        name: 'war_score_from_occupation',
        type: 'float',
        description: 'War score from occupation.',
        example: 'war_score_from_occupation = 1.0',
    },
    // Modifiers
    {
        name: 'attacker_modifier',
        type: 'block',
        description: 'Modifiers for attacker.',
        example: `attacker_modifier = {
    army_damage_mult = 0.1
}`,
    },
    {
        name: 'defender_modifier',
        type: 'block',
        description: 'Modifiers for defender.',
        example: `defender_modifier = {
    defender_advantage = 5
}`,
    },
    // Effects
    {
        name: 'on_declare',
        type: 'effect',
        description: 'Effects when declared.',
        example: `on_declare = {
    add_prestige = -100
}`,
    },
    {
        name: 'on_victory',
        type: 'effect',
        description: 'Effects on victory.',
        example: `on_victory = {
    add_prestige = 500
}`,
    },
    {
        name: 'on_defeat',
        type: 'effect',
        description: 'Effects on defeat.',
        example: `on_defeat = {
    add_prestige = -200
}`,
    },
    {
        name: 'on_white_peace',
        type: 'effect',
        description: 'Effects on white peace.',
        example: `on_white_peace = {
    add_prestige = -50
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    highest_held_title_tier >= tier_duchy
}`,
    },
    {
        name: 'can_declare',
        type: 'trigger',
        description: 'Conditions to declare.',
        example: `can_declare = {
    has_claim_on = scope:target
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.casusBelliTypeSchemaMap = new Map(exports.casusBelliTypeSchema.map((field) => [field.name, field]));
function getCasusBelliTypeFieldNames() {
    return exports.casusBelliTypeSchema.map((field) => field.name);
}
function getCasusBelliTypeFieldDocumentation(fieldName) {
    const field = exports.casusBelliTypeSchemaMap.get(fieldName);
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
//# sourceMappingURL=casusBelliTypeSchema.js.map