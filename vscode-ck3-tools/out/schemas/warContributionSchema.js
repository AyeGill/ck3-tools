"use strict";
/**
 * Schema definition for CK3 War Contributions - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.warContributionSchemaMap = exports.warContributionSchema = void 0;
exports.getWarContributionFieldNames = getWarContributionFieldNames;
exports.getWarContributionFieldDocumentation = getWarContributionFieldDocumentation;
exports.warContributionSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the contribution type.',
        example: 'name = "war_contribution_battles"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "war_contribution_battles_desc"',
    },
    // Contribution Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of war contribution.',
        values: ['battles', 'sieges', 'occupation', 'gold', 'prestige', 'piety'],
        example: 'type = battles',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this contribution type.',
        example: 'icon = "gfx/interface/icons/war_contribution/battles.dds"',
    },
    // Weight
    {
        name: 'weight',
        type: 'block',
        description: 'Weight for contribution calculation.',
        example: `weight = {
    base = 100
    modifier = {
        add = 50
        is_primary_war_participant = yes
    }
}`,
    },
    // Score
    {
        name: 'score_per_unit',
        type: 'float',
        description: 'Score per unit of contribution.',
        example: 'score_per_unit = 1.0',
    },
    {
        name: 'max_score',
        type: 'integer',
        description: 'Maximum contribution score.',
        example: 'max_score = 1000',
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this contribution to count.',
        example: `trigger = {
    is_at_war = yes
}`,
    },
    // Effects
    {
        name: 'on_contribution',
        type: 'effect',
        description: 'Effects when contribution is made.',
        example: `on_contribution = {
    add_prestige = 10
}`,
    },
    // Rewards
    {
        name: 'reward_modifier',
        type: 'float',
        description: 'Reward multiplier based on contribution.',
        example: 'reward_modifier = 1.5',
    },
    // Display
    {
        name: 'show_in_ui',
        type: 'boolean',
        description: 'Whether to show in the war UI.',
        default: true,
        example: 'show_in_ui = yes',
    },
];
// Map for quick lookup
exports.warContributionSchemaMap = new Map(exports.warContributionSchema.map((field) => [field.name, field]));
function getWarContributionFieldNames() {
    return exports.warContributionSchema.map((field) => field.name);
}
function getWarContributionFieldDocumentation(fieldName) {
    const field = exports.warContributionSchemaMap.get(fieldName);
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
//# sourceMappingURL=warContributionSchema.js.map