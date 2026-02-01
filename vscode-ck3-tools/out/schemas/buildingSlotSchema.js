"use strict";
/**
 * Schema definition for CK3 Building Slots - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildingSlotSchemaMap = exports.buildingSlotSchema = void 0;
exports.getBuildingSlotFieldNames = getBuildingSlotFieldNames;
exports.getBuildingSlotFieldDocumentation = getBuildingSlotFieldDocumentation;
exports.buildingSlotSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the slot name.',
        example: 'name = "castle_building_slot"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "castle_building_slot_desc"',
    },
    // Holding Type
    {
        name: 'holding_type',
        type: 'enum',
        description: 'Holding type this slot belongs to.',
        values: ['castle_holding', 'city_holding', 'church_holding', 'tribal_holding'],
        example: 'holding_type = castle_holding',
    },
    // Slot Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of building slot.',
        values: ['regular', 'special', 'duchy', 'unique'],
        example: 'type = regular',
    },
    // Slot Index
    {
        name: 'slot_index',
        type: 'integer',
        description: 'Index position of the slot.',
        example: 'slot_index = 0',
    },
    // Requirements
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for slot availability.',
        example: `potential = {
    has_building = castle_01
}`,
    },
    // Allowed Buildings
    {
        name: 'allowed_buildings',
        type: 'list',
        description: 'Buildings allowed in this slot.',
        example: `allowed_buildings = {
    castle_01
    castle_02
    walls_01
}`,
    },
    // Blocked Buildings
    {
        name: 'blocked_buildings',
        type: 'list',
        description: 'Buildings blocked from this slot.',
        example: `blocked_buildings = {
    special_building_01
}`,
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this slot.',
        example: 'icon = "gfx/interface/icons/building_slots/castle.dds"',
    },
    // Cost Modifier
    {
        name: 'build_cost_modifier',
        type: 'float',
        description: 'Build cost modifier for this slot.',
        example: 'build_cost_modifier = 1.0',
    },
    {
        name: 'build_time_modifier',
        type: 'float',
        description: 'Build time modifier for this slot.',
        example: 'build_time_modifier = 1.0',
    },
    // AI
    {
        name: 'ai_value',
        type: 'block',
        description: 'AI value for building in this slot.',
        example: `ai_value = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.buildingSlotSchemaMap = new Map(exports.buildingSlotSchema.map((field) => [field.name, field]));
function getBuildingSlotFieldNames() {
    return exports.buildingSlotSchema.map((field) => field.name);
}
function getBuildingSlotFieldDocumentation(fieldName) {
    const field = exports.buildingSlotSchemaMap.get(fieldName);
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
//# sourceMappingURL=buildingSlotSchema.js.map