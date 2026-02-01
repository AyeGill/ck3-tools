"use strict";
/**
 * Schema definition for CK3 Lifestyles and Perks - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.perkSchemaMap = exports.focusSchemaMap = exports.lifestyleSchemaMap = exports.perkSchema = exports.focusSchema = exports.lifestyleSchema = exports.LIFESTYLE_SKILLS = void 0;
exports.getLifestyleFieldNames = getLifestyleFieldNames;
exports.getFocusFieldNames = getFocusFieldNames;
exports.getPerkFieldNames = getPerkFieldNames;
exports.getLifestyleFieldDocumentation = getLifestyleFieldDocumentation;
exports.LIFESTYLE_SKILLS = [
    'diplomacy',
    'martial',
    'stewardship',
    'intrigue',
    'learning',
];
exports.lifestyleSchema = [
    // Basic Properties
    {
        name: 'skill',
        type: 'enum',
        description: 'The skill associated with this lifestyle.',
        values: [...exports.LIFESTYLE_SKILLS],
        required: true,
        example: 'skill = martial',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the lifestyle.',
        example: 'icon = "gfx/interface/icons/lifestyles/martial.dds"',
    },
    {
        name: 'xp_per_level',
        type: 'integer',
        description: 'XP required per focus level.',
        example: 'xp_per_level = 1000',
    },
    {
        name: 'base_xp_gain',
        type: 'float',
        description: 'Base XP gained per month.',
        example: 'base_xp_gain = 30',
    },
    // Focuses
    {
        name: 'focuses',
        type: 'list',
        description: 'List of available focuses for this lifestyle.',
        example: `focuses = {
    martial_chivalry_focus
    martial_strategy_focus
    martial_authority_focus
}`,
    },
    // Perk Trees
    {
        name: 'perk_trees',
        type: 'list',
        description: 'List of perk trees in this lifestyle.',
        example: `perk_trees = {
    chivalry
    strategy
    authority
}`,
    },
];
// Schema for lifestyle focuses
exports.focusSchema = [
    {
        name: 'skill',
        type: 'enum',
        description: 'The skill this focus improves.',
        values: [...exports.LIFESTYLE_SKILLS],
        example: 'skill = martial',
    },
    {
        name: 'lifestyle',
        type: 'string',
        description: 'The lifestyle this focus belongs to.',
        example: 'lifestyle = martial_lifestyle',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the focus.',
        example: 'icon = "gfx/interface/icons/focuses/martial_chivalry_focus.dds"',
    },
    {
        name: 'is_default',
        type: 'boolean',
        description: 'Whether this is the default focus for the lifestyle.',
        default: false,
        example: 'is_default = yes',
    },
    {
        name: 'modifier',
        type: 'block',
        description: 'Modifiers applied while this focus is active.',
        example: `modifier = {
    prowess = 1
    knight_effectiveness_mult = 0.1
}`,
    },
    {
        name: 'auto_selection_weight',
        type: 'block',
        description: 'AI weight for automatically selecting this focus.',
        example: `auto_selection_weight = {
    value = 100
    if = {
        limit = { has_trait = brave }
        add = 50
    }
}`,
    },
];
// Schema for perks
exports.perkSchema = [
    {
        name: 'lifestyle',
        type: 'string',
        description: 'The lifestyle this perk belongs to.',
        example: 'lifestyle = martial_lifestyle',
    },
    {
        name: 'tree',
        type: 'string',
        description: 'The perk tree this perk belongs to.',
        example: 'tree = chivalry',
    },
    {
        name: 'position',
        type: 'block',
        description: 'Position in the perk tree UI.',
        example: `position = {
    x = 0
    y = 0
}`,
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the perk.',
        example: 'icon = "gfx/interface/icons/perks/gallant.dds"',
    },
    {
        name: 'effect',
        type: 'effect',
        description: 'Effects applied when the perk is unlocked.',
        example: `effect = {
    add_character_modifier = {
        modifier = gallant_modifier
    }
}`,
    },
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Permanent modifiers while the perk is active.',
        example: `character_modifier = {
    prowess = 2
    attraction_opinion = 10
}`,
    },
    {
        name: 'can_be_picked',
        type: 'trigger',
        description: 'Conditions for being able to select this perk.',
        example: `can_be_picked = {
    NOT = { has_perk = rival_perk }
}`,
    },
    {
        name: 'parent',
        type: 'list',
        description: 'Required parent perks (any one of them).',
        example: `parent = {
    chivalry_1
    chivalry_2
}`,
    },
    {
        name: 'auto_selection_weight',
        type: 'block',
        description: 'AI weight for selecting this perk.',
        example: `auto_selection_weight = {
    value = 100
}`,
    },
];
// Map for quick lookup
exports.lifestyleSchemaMap = new Map(exports.lifestyleSchema.map((field) => [field.name, field]));
exports.focusSchemaMap = new Map(exports.focusSchema.map((field) => [field.name, field]));
exports.perkSchemaMap = new Map(exports.perkSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getLifestyleFieldNames() {
    return exports.lifestyleSchema.map((field) => field.name);
}
function getFocusFieldNames() {
    return exports.focusSchema.map((field) => field.name);
}
function getPerkFieldNames() {
    return exports.perkSchema.map((field) => field.name);
}
// Get documentation for a field
function getLifestyleFieldDocumentation(fieldName) {
    const field = exports.lifestyleSchemaMap.get(fieldName);
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
//# sourceMappingURL=lifestyleSchema.js.map