"use strict";
/**
 * Schema definition for CK3 Holdings - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.holdingSchemaMap = exports.holdingSchema = exports.HOLDING_TYPES = void 0;
exports.getHoldingFieldNames = getHoldingFieldNames;
exports.getHoldingFieldDocumentation = getHoldingFieldDocumentation;
exports.HOLDING_TYPES = [
    'castle_holding',
    'city_holding',
    'church_holding',
    'tribal_holding',
];
exports.holdingSchema = [
    // Basic Properties
    {
        name: 'primary_building',
        type: 'string',
        description: 'The primary building type for this holding.',
        example: 'primary_building = castle_01',
    },
    {
        name: 'buildings',
        type: 'list',
        description: 'List of available building types for this holding.',
        example: `buildings = {
    castle_walls
    barracks
    stables
}`,
    },
    // Flags
    {
        name: 'flag',
        type: 'string',
        description: 'Flag identifier for this holding type.',
        example: 'flag = castle',
    },
    {
        name: 'can_be_inherited',
        type: 'boolean',
        description: 'Whether this holding can be inherited.',
        default: true,
        example: 'can_be_inherited = no',
    },
    // Graphics
    {
        name: 'gfx_settings',
        type: 'block',
        description: 'Graphics settings for this holding type.',
        example: `gfx_settings = {
    holding_type = castle
}`,
    },
    // Modifiers
    {
        name: 'county_modifier',
        type: 'block',
        description: 'Modifiers applied to the county.',
        example: `county_modifier = {
    tax_mult = 0.1
}`,
    },
    {
        name: 'province_modifier',
        type: 'block',
        description: 'Modifiers applied to the province.',
        example: `province_modifier = {
    garrison_size = 500
}`,
    },
    {
        name: 'holder_modifier',
        type: 'block',
        description: 'Modifiers applied to the holder.',
        example: `holder_modifier = {
    monthly_prestige = 0.5
}`,
    },
    // Requirements
    {
        name: 'can_construct',
        type: 'trigger',
        description: 'Conditions to construct this holding.',
        example: `can_construct = {
    holder = { government_has_flag = government_is_feudal }
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for this holding to be valid.',
        example: `is_valid = {
    province = { has_building = castle_01 }
}`,
    },
];
// Map for quick lookup
exports.holdingSchemaMap = new Map(exports.holdingSchema.map((field) => [field.name, field]));
function getHoldingFieldNames() {
    return exports.holdingSchema.map((field) => field.name);
}
function getHoldingFieldDocumentation(fieldName) {
    const field = exports.holdingSchemaMap.get(fieldName);
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
//# sourceMappingURL=holdingSchema.js.map