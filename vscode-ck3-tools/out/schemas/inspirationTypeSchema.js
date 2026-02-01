"use strict";
/**
 * Schema definition for CK3 Inspiration Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspirationTypeSchemaMap = exports.inspirationTypeSchema = void 0;
exports.getInspirationTypeFieldNames = getInspirationTypeFieldNames;
exports.getInspirationTypeFieldDocumentation = getInspirationTypeFieldDocumentation;
exports.inspirationTypeSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the inspiration name.',
        example: 'name = "inspiration_weapon"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the inspiration description.',
        example: 'desc = "inspiration_weapon_desc"',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the inspiration.',
        example: 'icon = "gfx/interface/icons/inspirations/weapon.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of artifact this inspiration creates.',
        values: ['weapon', 'armor', 'regalia', 'book', 'trinket', 'wall_banner', 'sculpture'],
        example: 'type = weapon',
    },
    // Requirements
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for this inspiration to be available.',
        example: `potential = {
    has_court_position = court_smith_court_position
}`,
    },
    {
        name: 'can_sponsor',
        type: 'trigger',
        description: 'Conditions for a character to sponsor this inspiration.',
        example: `can_sponsor = {
    gold >= 100
}`,
    },
    // Progress
    {
        name: 'base_progress',
        type: 'integer',
        description: 'Base progress per month.',
        example: 'base_progress = 10',
    },
    {
        name: 'skill_progress',
        type: 'block',
        description: 'Progress based on relevant skill.',
        example: `skill_progress = {
    skill = learning
    value = 0.5
}`,
    },
    {
        name: 'progress_chance',
        type: 'block',
        description: 'Chance for progress events.',
        example: `progress_chance = {
    base = 10
}`,
    },
    // Costs
    {
        name: 'gold_cost',
        type: 'integer',
        description: 'Gold cost to sponsor this inspiration.',
        example: 'gold_cost = 150',
    },
    {
        name: 'monthly_gold_cost',
        type: 'float',
        description: 'Monthly gold cost while active.',
        example: 'monthly_gold_cost = 1.0',
    },
    // Quality
    {
        name: 'base_quality',
        type: 'integer',
        description: 'Base quality of the created artifact.',
        example: 'base_quality = 50',
    },
    {
        name: 'quality_modifier',
        type: 'block',
        description: 'Modifiers affecting artifact quality.',
        example: `quality_modifier = {
    add = 10
    has_trait = genius
}`,
    },
    // Events
    {
        name: 'on_start',
        type: 'effect',
        description: 'Effects when the inspiration begins.',
        example: `on_start = {
    add_gold = -100
}`,
    },
    {
        name: 'on_complete',
        type: 'effect',
        description: 'Effects when the inspiration completes.',
        example: `on_complete = {
    create_artifact = { type = weapon }
}`,
    },
    {
        name: 'on_cancel',
        type: 'effect',
        description: 'Effects when the inspiration is cancelled.',
        example: `on_cancel = {
    add_prestige = -50
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to sponsor this inspiration.',
        example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        has_trait = ambitious
    }
}`,
    },
    // Weight
    {
        name: 'weight',
        type: 'block',
        description: 'Weight for random selection.',
        example: `weight = {
    base = 10
}`,
    },
];
// Map for quick lookup
exports.inspirationTypeSchemaMap = new Map(exports.inspirationTypeSchema.map((field) => [field.name, field]));
function getInspirationTypeFieldNames() {
    return exports.inspirationTypeSchema.map((field) => field.name);
}
function getInspirationTypeFieldDocumentation(fieldName) {
    const field = exports.inspirationTypeSchemaMap.get(fieldName);
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
//# sourceMappingURL=inspirationTypeSchema.js.map