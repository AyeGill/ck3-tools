"use strict";
/**
 * Schema definition for CK3 War Goals - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.warGoalSchemaMap = exports.warGoalSchema = void 0;
exports.getWarGoalFieldNames = getWarGoalFieldNames;
exports.getWarGoalFieldDocumentation = getWarGoalFieldDocumentation;
exports.warGoalSchema = [
    // Basic Properties
    {
        name: 'war_goal_type',
        type: 'enum',
        description: 'The type of war goal.',
        values: ['take_title', 'take_county', 'independence', 'dejure', 'claim', 'religious'],
        example: 'war_goal_type = take_title',
    },
    {
        name: 'casus_belli',
        type: 'string',
        description: 'The casus belli this war goal belongs to.',
        example: 'casus_belli = conquest_cb',
    },
    // Targets
    {
        name: 'target_titles',
        type: 'trigger',
        description: 'Which titles can be targeted.',
        example: `target_titles = {
    tier >= tier_county
    holder = scope:defender
}`,
    },
    {
        name: 'target_characters',
        type: 'trigger',
        description: 'Which characters can be targeted.',
        example: `target_characters = {
    is_landed = yes
    NOT = { this = scope:attacker }
}`,
    },
    // Victory Conditions
    {
        name: 'on_victory',
        type: 'effect',
        description: 'Effects when the attacker wins.',
        example: `on_victory = {
    scope:attacker = {
        add_prestige = 200
    }
    create_title_and_vassal_change = {
        type = conquest
        save_scope_as = change
    }
}`,
    },
    {
        name: 'on_white_peace',
        type: 'effect',
        description: 'Effects on white peace.',
        example: `on_white_peace = {
    scope:attacker = {
        add_prestige = -100
    }
}`,
    },
    {
        name: 'on_defeat',
        type: 'effect',
        description: 'Effects when the attacker loses.',
        example: `on_defeat = {
    scope:attacker = {
        add_prestige = -300
        pay_short_term_gold = {
            target = scope:defender
            gold = 150
        }
    }
}`,
    },
    {
        name: 'on_invalidated',
        type: 'effect',
        description: 'Effects when the war is invalidated.',
        example: `on_invalidated = {
    scope:attacker = {
        add_prestige = -50
    }
}`,
    },
    // War Score
    {
        name: 'attacker_war_score_bonus',
        type: 'integer',
        description: 'Starting war score bonus for attacker.',
        example: 'attacker_war_score_bonus = 0',
    },
    {
        name: 'defender_war_score_bonus',
        type: 'integer',
        description: 'Starting war score bonus for defender.',
        example: 'defender_war_score_bonus = 0',
    },
    {
        name: 'full_occupation_score',
        type: 'integer',
        description: 'War score from full occupation.',
        example: 'full_occupation_score = 100',
    },
    {
        name: 'battle_warscore_mult',
        type: 'float',
        description: 'Multiplier for war score from battles.',
        example: 'battle_warscore_mult = 1.0',
    },
    // Ticking War Score
    {
        name: 'ticking_war_score',
        type: 'block',
        description: 'War score that ticks over time.',
        example: `ticking_war_score = {
    attacker = 0.5
    defender = 0
}`,
    },
    // Valid Trigger
    {
        name: 'valid_to_start',
        type: 'trigger',
        description: 'Conditions to start the war.',
        example: `valid_to_start = {
    NOT = { is_allied_in_war = scope:defender }
}`,
    },
    {
        name: 'valid',
        type: 'trigger',
        description: 'Conditions for the war to remain valid.',
        example: `valid = {
    scope:defender = { is_alive = yes }
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to pursue this war goal.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.warGoalSchemaMap = new Map(exports.warGoalSchema.map((field) => [field.name, field]));
function getWarGoalFieldNames() {
    return exports.warGoalSchema.map((field) => field.name);
}
function getWarGoalFieldDocumentation(fieldName) {
    const field = exports.warGoalSchemaMap.get(fieldName);
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
//# sourceMappingURL=warGoalSchema.js.map