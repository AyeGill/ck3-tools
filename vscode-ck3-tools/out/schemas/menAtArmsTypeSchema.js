"use strict";
/**
 * Schema definition for CK3 Men-at-Arms Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.menAtArmsTypeSchemaMap = exports.menAtArmsTypeSchema = void 0;
exports.getMenAtArmsTypeFieldNames = getMenAtArmsTypeFieldNames;
exports.getMenAtArmsTypeFieldDocumentation = getMenAtArmsTypeFieldDocumentation;
exports.menAtArmsTypeSchema = [
    // Basic Properties
    {
        name: 'type',
        type: 'enum',
        description: 'Base type of men-at-arms unit.',
        values: ['light_infantry', 'heavy_infantry', 'pikemen', 'archers', 'light_cavalry', 'heavy_cavalry', 'siege', 'skirmishers'],
        example: 'type = heavy_infantry',
    },
    {
        name: 'can_recruit',
        type: 'trigger',
        description: 'Conditions to recruit this unit type.',
        example: `can_recruit = {
    culture = { has_innovation = innovation_housecarls }
}`,
    },
    // Combat Stats
    {
        name: 'damage',
        type: 'integer',
        description: 'Base damage dealt by this unit.',
        example: 'damage = 30',
    },
    {
        name: 'toughness',
        type: 'integer',
        description: 'Base toughness (health) of this unit.',
        example: 'toughness = 25',
    },
    {
        name: 'pursuit',
        type: 'integer',
        description: 'Pursuit stat for chasing fleeing enemies.',
        example: 'pursuit = 10',
    },
    {
        name: 'screen',
        type: 'integer',
        description: 'Screen stat for protecting from pursuit.',
        example: 'screen = 15',
    },
    // Counter System
    {
        name: 'counters',
        type: 'list',
        description: 'Unit types this unit counters.',
        example: `counters = {
    light_cavalry
    archers
}`,
    },
    // Costs
    {
        name: 'buy_cost',
        type: 'block',
        description: 'Cost to recruit this unit.',
        example: `buy_cost = {
    gold = 150
    prestige = 50
}`,
    },
    {
        name: 'low_maintenance_cost',
        type: 'block',
        description: 'Maintenance cost when not raised.',
        example: `low_maintenance_cost = {
    gold = 1.0
}`,
    },
    {
        name: 'high_maintenance_cost',
        type: 'block',
        description: 'Maintenance cost when raised.',
        example: `high_maintenance_cost = {
    gold = 3.0
}`,
    },
    // Stack
    {
        name: 'stack',
        type: 'integer',
        description: 'Number of soldiers per regiment.',
        example: 'stack = 100',
    },
    {
        name: 'max_sub_regiments',
        type: 'integer',
        description: 'Maximum number of regiments that can be recruited.',
        example: 'max_sub_regiments = 5',
    },
    // Terrain
    {
        name: 'terrain_bonus',
        type: 'block',
        description: 'Combat bonuses in specific terrains.',
        example: `terrain_bonus = {
    mountains = { damage = 10 }
    hills = { damage = 5 }
}`,
    },
    // Winter
    {
        name: 'winter_bonus',
        type: 'block',
        description: 'Combat bonuses in winter.',
        example: `winter_bonus = {
    harsh_winter = { damage = 5 toughness = 5 }
}`,
    },
    // Siege
    {
        name: 'siege_value',
        type: 'float',
        description: 'Siege contribution of this unit.',
        example: 'siege_value = 0.1',
    },
    // Graphics
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this unit type.',
        example: 'icon = "maa_housecarls"',
    },
    // Allowed for AI
    {
        name: 'ai_quality',
        type: 'block',
        description: 'AI weighting for this unit type.',
        example: `ai_quality = {
    value = 1.5
}`,
    },
];
// Map for quick lookup
exports.menAtArmsTypeSchemaMap = new Map(exports.menAtArmsTypeSchema.map((field) => [field.name, field]));
function getMenAtArmsTypeFieldNames() {
    return exports.menAtArmsTypeSchema.map((field) => field.name);
}
function getMenAtArmsTypeFieldDocumentation(fieldName) {
    const field = exports.menAtArmsTypeSchemaMap.get(fieldName);
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
//# sourceMappingURL=menAtArmsTypeSchema.js.map