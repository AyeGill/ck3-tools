"use strict";
/**
 * Schema definition for CK3 Travel Options - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelOptionSchemaMap = exports.travelOptionSchema = void 0;
exports.getTravelOptionFieldNames = getTravelOptionFieldNames;
exports.getTravelOptionFieldDocumentation = getTravelOptionFieldDocumentation;
exports.travelOptionSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the travel option name.',
        example: 'name = "travel_option_fast_travel"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "travel_option_fast_travel_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this travel option.',
        example: 'icon = "gfx/interface/icons/travel/fast_travel.dds"',
    },
    // Category
    {
        name: 'category',
        type: 'enum',
        description: 'Category of travel option.',
        values: ['speed', 'safety', 'comfort', 'stealth', 'special'],
        example: 'category = speed',
    },
    // Speed
    {
        name: 'travel_speed',
        type: 'float',
        description: 'Speed modifier.',
        example: 'travel_speed = 1.5',
    },
    {
        name: 'travel_speed_mult',
        type: 'float',
        description: 'Multiplicative speed modifier.',
        example: 'travel_speed_mult = 0.2',
    },
    // Safety
    {
        name: 'travel_safety',
        type: 'float',
        description: 'Safety modifier.',
        example: 'travel_safety = 0.5',
    },
    {
        name: 'danger_reduction',
        type: 'integer',
        description: 'Danger reduction value.',
        example: 'danger_reduction = 10',
    },
    // Cost
    {
        name: 'gold_cost',
        type: 'integer',
        description: 'Gold cost.',
        example: 'gold_cost = 50',
    },
    {
        name: 'prestige_cost',
        type: 'integer',
        description: 'Prestige cost.',
        example: 'prestige_cost = 25',
    },
    {
        name: 'monthly_cost',
        type: 'float',
        description: 'Monthly maintenance cost.',
        example: 'monthly_cost = 1.0',
    },
    // Entourage
    {
        name: 'entourage_modifier',
        type: 'block',
        description: 'Modifiers to entourage.',
        example: `entourage_modifier = {
    max_entourage_size = 10
}`,
    },
    // Effects
    {
        name: 'on_select',
        type: 'effect',
        description: 'Effects when option is selected.',
        example: `on_select = {
    add_gold = -50
}`,
    },
    {
        name: 'travel_modifier',
        type: 'block',
        description: 'Modifiers during travel.',
        example: `travel_modifier = {
    monthly_prestige = 0.5
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for option availability.',
        example: `potential = {
    gold >= 50
}`,
    },
    {
        name: 'can_select',
        type: 'trigger',
        description: 'Conditions to select option.',
        example: `can_select = {
    NOT = { is_at_war = yes }
}`,
    },
    // Mutual Exclusivity
    {
        name: 'mutually_exclusive_with',
        type: 'list',
        description: 'Options that cannot be combined.',
        example: `mutually_exclusive_with = {
    travel_option_stealth
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for this option.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.travelOptionSchemaMap = new Map(exports.travelOptionSchema.map((field) => [field.name, field]));
function getTravelOptionFieldNames() {
    return exports.travelOptionSchema.map((field) => field.name);
}
function getTravelOptionFieldDocumentation(fieldName) {
    const field = exports.travelOptionSchemaMap.get(fieldName);
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
//# sourceMappingURL=travelOptionSchema.js.map