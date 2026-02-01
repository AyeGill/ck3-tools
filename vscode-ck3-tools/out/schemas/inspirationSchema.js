"use strict";
/**
 * Schema definition for CK3 Inspirations (Royal Court DLC) - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.inspirationSchemaMap = exports.inspirationSchema = exports.INSPIRATION_TYPES = void 0;
exports.getInspirationFieldNames = getInspirationFieldNames;
exports.getInspirationFieldDocumentation = getInspirationFieldDocumentation;
exports.INSPIRATION_TYPES = [
    'weapon',
    'armor',
    'regalia',
    'book',
    'wall_art',
    'sculpture',
];
exports.inspirationSchema = [
    // Basic Properties
    {
        name: 'type',
        type: 'enum',
        description: 'The type of artifact this inspiration creates.',
        values: [...exports.INSPIRATION_TYPES],
        example: 'type = weapon',
    },
    {
        name: 'gold_cost',
        type: 'block',
        description: 'Gold cost to sponsor the inspiration.',
        example: `gold_cost = {
    value = 200
    multiply = {
        value = inspired_character.inspiration_level
    }
}`,
    },
    // Requirements
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the inspiration to be valid.',
        example: `is_valid = {
    has_royal_court = yes
}`,
    },
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the inspiration to be shown.',
        example: `is_shown = {
    has_dlc = "Royal Court"
}`,
    },
    // Character triggers
    {
        name: 'sponsor_trigger',
        type: 'trigger',
        description: 'Conditions for a character to sponsor this inspiration.',
        example: `sponsor_trigger = {
    gold >= 100
    has_royal_court = yes
}`,
    },
    {
        name: 'inspired_character_trigger',
        type: 'trigger',
        description: 'Conditions for a character to have this inspiration.',
        example: `inspired_character_trigger = {
    is_adult = yes
    has_skill = 15 martial
}`,
    },
    // On actions
    {
        name: 'on_creation',
        type: 'effect',
        description: 'Effects when the inspiration is created.',
        example: `on_creation = {
    add_prestige = 50
}`,
    },
    {
        name: 'on_sponsor',
        type: 'effect',
        description: 'Effects when the inspiration is sponsored.',
        example: `on_sponsor = {
    scope:sponsor = { add_gold = -200 }
}`,
    },
    {
        name: 'on_complete',
        type: 'effect',
        description: 'Effects when the inspiration is completed.',
        example: `on_complete = {
    create_artifact = {
        name = artifact_inspired_weapon
        type = weapon
    }
}`,
    },
    {
        name: 'on_timeout',
        type: 'effect',
        description: 'Effects when the inspiration times out.',
        example: `on_timeout = {
    scope:owner = { add_stress = 25 }
}`,
    },
    // Progress
    {
        name: 'progress_chance',
        type: 'block',
        description: 'Chance for progress on the inspiration.',
        example: `progress_chance = {
    base = 5
    modifier = {
        add = 2
        has_trait = diligent
    }
}`,
    },
    {
        name: 'base_progress',
        type: 'integer',
        description: 'Base progress per tick.',
        example: 'base_progress = 10',
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to seek this inspiration.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.inspirationSchemaMap = new Map(exports.inspirationSchema.map((field) => [field.name, field]));
function getInspirationFieldNames() {
    return exports.inspirationSchema.map((field) => field.name);
}
function getInspirationFieldDocumentation(fieldName) {
    const field = exports.inspirationSchemaMap.get(fieldName);
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
//# sourceMappingURL=inspirationSchema.js.map