"use strict";
/**
 * Schema definition for CK3 Domicile Buildings - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.domicileBuildingSchemaMap = exports.domicileBuildingSchema = void 0;
exports.getDomicileBuildingFieldNames = getDomicileBuildingFieldNames;
exports.getDomicileBuildingFieldDocumentation = getDomicileBuildingFieldDocumentation;
exports.domicileBuildingSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the building name.',
        example: 'name = "domicile_building_tent"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "domicile_building_tent_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this building.',
        example: 'icon = "gfx/interface/icons/domicile/building_tent.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of domicile building.',
        values: ['housing', 'storage', 'production', 'defense', 'special'],
        example: 'type = housing',
    },
    // Slot
    {
        name: 'slot',
        type: 'integer',
        description: 'Building slot index.',
        example: 'slot = 1',
    },
    // Cost
    {
        name: 'build_cost',
        type: 'integer',
        description: 'Gold cost to build.',
        example: 'build_cost = 100',
    },
    {
        name: 'build_time',
        type: 'integer',
        description: 'Construction time in days.',
        example: 'build_time = 30',
    },
    // Modifiers
    {
        name: 'owner_modifier',
        type: 'block',
        description: 'Modifiers applied to owner.',
        example: `owner_modifier = {
    monthly_prestige = 0.2
}`,
    },
    {
        name: 'domicile_modifier',
        type: 'block',
        description: 'Modifiers applied to domicile.',
        example: `domicile_modifier = {
    supplies_capacity = 50
}`,
    },
    // Supplies
    {
        name: 'supplies_production',
        type: 'float',
        description: 'Monthly supplies production.',
        example: 'supplies_production = 5.0',
    },
    {
        name: 'supplies_capacity_add',
        type: 'integer',
        description: 'Additional supplies capacity.',
        example: 'supplies_capacity_add = 50',
    },
    // Requirements
    {
        name: 'prerequisite',
        type: 'string',
        description: 'Required building prerequisite.',
        example: 'prerequisite = "domicile_building_basic"',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for building availability.',
        example: `potential = {
    domicile_type = camp
}`,
    },
    {
        name: 'can_construct',
        type: 'trigger',
        description: 'Conditions to construct.',
        example: `can_construct = {
    gold >= 100
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for this building.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.domicileBuildingSchemaMap = new Map(exports.domicileBuildingSchema.map((field) => [field.name, field]));
function getDomicileBuildingFieldNames() {
    return exports.domicileBuildingSchema.map((field) => field.name);
}
function getDomicileBuildingFieldDocumentation(fieldName) {
    const field = exports.domicileBuildingSchemaMap.get(fieldName);
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
//# sourceMappingURL=domicileBuildingSchema.js.map