"use strict";
/**
 * Schema definition for CK3 decisions - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.costBlockSchemaMap = exports.costBlockSchema = exports.decisionPictureSchemaMap = exports.decisionPictureSchema = exports.decisionSchemaMap = exports.decisionSchema = exports.DECISION_SORT_ORDER = void 0;
exports.getDecisionFieldNames = getDecisionFieldNames;
exports.getDecisionFieldDocumentation = getDecisionFieldDocumentation;
exports.DECISION_SORT_ORDER = [
    'ascending',
    'descending',
];
exports.decisionSchema = [
    // Basic Properties
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the decision description.',
        example: 'desc = my_decision_desc',
    },
    {
        name: 'selection_tooltip',
        type: 'string',
        description: 'Localization key for the tooltip shown when hovering the decision.',
        example: 'selection_tooltip = my_decision_tooltip',
    },
    {
        name: 'confirm_text',
        type: 'string',
        description: 'Localization key for the confirm button text.',
        example: 'confirm_text = my_decision_confirm',
    },
    // Display
    {
        name: 'picture',
        type: 'block',
        description: 'Image shown for the decision. Can have multiple with triggers.',
        example: `picture = {
    reference = "gfx/interface/illustrations/decisions/decision_misc.dds"
}`,
    },
    {
        name: 'sort_order',
        type: 'integer',
        description: 'Sort order in the decision list. Lower numbers appear first.',
        default: 0,
        example: 'sort_order = 10',
    },
    // Conditions
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the decision to appear in the list.',
        example: `is_shown = {
    is_ruler = yes
    NOT = { has_trait = incapable }
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the decision to be clickable.',
        example: `is_valid = {
    gold >= 100
    prestige >= 500
}`,
    },
    {
        name: 'is_valid_showing_failures_only',
        type: 'trigger',
        description: 'Like is_valid, but only shows when conditions fail.',
        example: `is_valid_showing_failures_only = {
    is_adult = yes
    is_imprisoned = no
}`,
    },
    // Cooldown
    {
        name: 'cooldown',
        type: 'block',
        description: 'Prevents taking the decision again for a duration.',
        example: 'cooldown = { years = 10 }',
    },
    // Effect
    {
        name: 'effect',
        type: 'effect',
        description: 'Effects executed when the decision is taken.',
        example: `effect = {
    add_gold = 100
    add_prestige = 500
}`,
    },
    // Cost
    {
        name: 'cost',
        type: 'block',
        description: 'Resources spent when taking the decision.',
        example: `cost = {
    gold = 200
    prestige = 500
    piety = 100
}`,
    },
    {
        name: 'minimum_cost',
        type: 'block',
        description: 'Minimum cost required to take the decision.',
        example: `minimum_cost = {
    gold = 50
}`,
    },
    // AI
    {
        name: 'ai_check_interval',
        type: 'integer',
        description: 'How often AI checks this decision (in days). 0 = never.',
        default: 0,
        example: 'ai_check_interval = 60',
    },
    {
        name: 'ai_potential',
        type: 'trigger',
        description: 'Conditions for AI to consider this decision.',
        example: `ai_potential = {
    is_at_war = no
    gold > 500
}`,
    },
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for taking this decision.',
        example: `ai_will_do = {
    base = 100
    modifier = {
        factor = 0.5
        has_trait = content
    }
}`,
    },
    // Widget
    {
        name: 'widget',
        type: 'block',
        description: 'Custom widget shown in the decision window.',
        example: `widget = {
    gui = "decision_view_widget_generic_list"
    controller = decision_option_list_controller
}`,
    },
];
// Map for quick lookup
exports.decisionSchemaMap = new Map(exports.decisionSchema.map((field) => [field.name, field]));
/**
 * Schema for decision picture blocks
 */
exports.decisionPictureSchema = [
    {
        name: 'reference',
        type: 'string',
        description: 'Path to the image file.',
        required: true,
        example: 'reference = "gfx/interface/illustrations/decisions/decision_misc.dds"',
    },
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Condition for using this picture.',
        example: `trigger = {
    has_religion = religion:islam_religion
}`,
    },
];
exports.decisionPictureSchemaMap = new Map(exports.decisionPictureSchema.map((field) => [field.name, field]));
/**
 * Schema for cost blocks
 */
exports.costBlockSchema = [
    {
        name: 'gold',
        type: 'integer',
        description: 'Gold cost.',
        example: 'gold = 100',
    },
    {
        name: 'prestige',
        type: 'integer',
        description: 'Prestige cost.',
        example: 'prestige = 500',
    },
    {
        name: 'piety',
        type: 'integer',
        description: 'Piety cost.',
        example: 'piety = 200',
    },
    {
        name: 'influence',
        type: 'integer',
        description: 'Influence cost (for landless adventures).',
        example: 'influence = 50',
    },
];
exports.costBlockSchemaMap = new Map(exports.costBlockSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getDecisionFieldNames() {
    return exports.decisionSchema.map((field) => field.name);
}
// Get documentation for a field
function getDecisionFieldDocumentation(fieldName) {
    const field = exports.decisionSchemaMap.get(fieldName);
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
//# sourceMappingURL=decisionSchema.js.map