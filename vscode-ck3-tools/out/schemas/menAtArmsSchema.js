"use strict";
/**
 * Schema definition for CK3 Men-at-Arms - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.menAtArmsSchemaMap = exports.menAtArmsSchema = exports.TERRAIN_TYPES = exports.MAA_TYPES = void 0;
exports.getMenAtArmsFieldNames = getMenAtArmsFieldNames;
exports.getMenAtArmsFieldDocumentation = getMenAtArmsFieldDocumentation;
exports.MAA_TYPES = [
    'light_cavalry',
    'heavy_cavalry',
    'pikemen',
    'heavy_infantry',
    'light_infantry',
    'archers',
    'skirmishers',
    'siege_weapon',
    'special',
];
exports.TERRAIN_TYPES = [
    'plains',
    'farmlands',
    'hills',
    'mountains',
    'desert',
    'desert_mountains',
    'oasis',
    'jungle',
    'forest',
    'taiga',
    'wetlands',
    'steppe',
    'floodplains',
    'drylands',
];
exports.menAtArmsSchema = [
    // Basic Properties
    {
        name: 'type',
        type: 'enum',
        description: 'The base type of the men-at-arms regiment.',
        values: [...exports.MAA_TYPES],
        example: 'type = heavy_infantry',
    },
    {
        name: 'can_recruit',
        type: 'trigger',
        description: 'Conditions for when this regiment can be recruited.',
        example: `can_recruit = {
    culture = { has_cultural_parameter = can_recruit_varangian_veterans }
}`,
    },
    {
        name: 'max',
        type: 'integer',
        description: 'Maximum number of regiments that can be raised.',
        example: 'max = 5',
    },
    {
        name: 'buy_cost',
        type: 'block',
        description: 'Cost to create/buy a regiment.',
        example: `buy_cost = {
    gold = 150
}`,
    },
    {
        name: 'low_maintenance_cost',
        type: 'block',
        description: 'Monthly upkeep cost when not raised.',
        example: `low_maintenance_cost = {
    gold = 1.0
}`,
    },
    {
        name: 'high_maintenance_cost',
        type: 'block',
        description: 'Monthly upkeep cost when raised.',
        example: `high_maintenance_cost = {
    gold = 5.0
}`,
    },
    {
        name: 'stack',
        type: 'integer',
        description: 'Number of soldiers per regiment.',
        default: 100,
        example: 'stack = 100',
    },
    // Combat Stats
    {
        name: 'damage',
        type: 'integer',
        description: 'Base damage dealt in combat.',
        example: 'damage = 25',
    },
    {
        name: 'toughness',
        type: 'integer',
        description: 'Base toughness (health) in combat.',
        example: 'toughness = 15',
    },
    {
        name: 'pursuit',
        type: 'integer',
        description: 'Pursuit value (damage during enemy retreat).',
        example: 'pursuit = 50',
    },
    {
        name: 'screen',
        type: 'integer',
        description: 'Screen value (reduces pursuit damage taken).',
        example: 'screen = 25',
    },
    {
        name: 'siege_value',
        type: 'float',
        description: 'Siege progress contribution.',
        example: 'siege_value = 0.1',
    },
    // Counters
    {
        name: 'counters',
        type: 'block',
        description: 'Which unit types this regiment is strong against.',
        example: `counters = {
    pikemen = 1
    heavy_infantry = 1
}`,
    },
    // Terrain Modifiers
    {
        name: 'terrain_bonus',
        type: 'block',
        description: 'Combat bonuses/penalties in specific terrains.',
        example: `terrain_bonus = {
    plains = { damage = 10 }
    hills = { damage = -5 toughness = -5 }
}`,
    },
    {
        name: 'winter_bonus',
        type: 'block',
        description: 'Combat bonuses/penalties in winter.',
        example: `winter_bonus = {
    normal_winter = { damage = -5 }
    harsh_winter = { damage = -10 }
}`,
    },
    // Visual
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the regiment type.',
        example: 'icon = heavy_infantry',
    },
    // Era/Technology
    {
        name: 'era_pick_chance',
        type: 'integer',
        description: 'Chance of being available in random picks for this era.',
        example: 'era_pick_chance = 100',
    },
    // Culture Parameters
    {
        name: 'allowed_cultures',
        type: 'block',
        description: 'List of cultures that can recruit this regiment.',
        example: `allowed_cultures = {
    norse
    danish
    swedish
    norwegian
}`,
    },
    // Modifiers
    {
        name: 'regiment_cap_modifier',
        type: 'block',
        description: 'Modifiers that affect regiment capacity.',
        example: `regiment_cap_modifier = {
    prestige = 0.1
}`,
    },
    // AI
    {
        name: 'ai_quality',
        type: 'block',
        description: 'AI evaluation of regiment quality.',
        example: `ai_quality = {
    base = 100
    modifier = {
        factor = 1.5
        has_cultural_parameter = forest_fighters
    }
}`,
    },
];
// Map for quick lookup
exports.menAtArmsSchemaMap = new Map(exports.menAtArmsSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getMenAtArmsFieldNames() {
    return exports.menAtArmsSchema.map((field) => field.name);
}
// Get documentation for a field
function getMenAtArmsFieldDocumentation(fieldName) {
    const field = exports.menAtArmsSchemaMap.get(fieldName);
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
//# sourceMappingURL=menAtArmsSchema.js.map