"use strict";
/**
 * Schema definition for CK3 Vassal Powers - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.vassalPowerSchemaMap = exports.vassalPowerSchema = void 0;
exports.getVassalPowerFieldNames = getVassalPowerFieldNames;
exports.getVassalPowerFieldDocumentation = getVassalPowerFieldDocumentation;
exports.vassalPowerSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the power name.',
        example: 'name = "vassal_power_military_autonomy"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "vassal_power_military_autonomy_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this power.',
        example: 'icon = "gfx/interface/icons/vassal/power_military.dds"',
    },
    // Category
    {
        name: 'category',
        type: 'enum',
        description: 'Category of vassal power.',
        values: ['military', 'economic', 'legal', 'religious', 'administrative'],
        example: 'category = military',
    },
    // Power Level
    {
        name: 'power_level',
        type: 'integer',
        description: 'Power level (1-5).',
        example: 'power_level = 3',
    },
    // Modifiers
    {
        name: 'vassal_modifier',
        type: 'block',
        description: 'Modifiers for the vassal.',
        example: `vassal_modifier = {
    levy_contribution_mult = -0.2
    monthly_prestige = 0.1
}`,
    },
    {
        name: 'liege_modifier',
        type: 'block',
        description: 'Modifiers for the liege.',
        example: `liege_modifier = {
    vassal_opinion = -10
}`,
    },
    // Contract Effect
    {
        name: 'contract_effect',
        type: 'block',
        description: 'Effect on vassal contract.',
        example: `contract_effect = {
    levy_contribution = -0.1
}`,
    },
    // Cost
    {
        name: 'grant_cost',
        type: 'block',
        description: 'Cost to grant power.',
        example: `grant_cost = {
    prestige = 100
}`,
    },
    {
        name: 'revoke_cost',
        type: 'block',
        description: 'Cost to revoke power.',
        example: `revoke_cost = {
    tyranny = 20
}`,
    },
    // Effects
    {
        name: 'on_grant',
        type: 'effect',
        description: 'Effects when granted.',
        example: `on_grant = {
    add_opinion = {
        target = scope:vassal
        modifier = granted_power
    }
}`,
    },
    {
        name: 'on_revoke',
        type: 'effect',
        description: 'Effects when revoked.',
        example: `on_revoke = {
    add_opinion = {
        target = scope:vassal
        modifier = revoked_power
    }
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    is_powerful_vassal = yes
}`,
    },
    {
        name: 'can_grant',
        type: 'trigger',
        description: 'Conditions to grant.',
        example: `can_grant = {
    prestige >= 100
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
exports.vassalPowerSchemaMap = new Map(exports.vassalPowerSchema.map((field) => [field.name, field]));
function getVassalPowerFieldNames() {
    return exports.vassalPowerSchema.map((field) => field.name);
}
function getVassalPowerFieldDocumentation(fieldName) {
    const field = exports.vassalPowerSchemaMap.get(fieldName);
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
//# sourceMappingURL=vassalPowerSchema.js.map