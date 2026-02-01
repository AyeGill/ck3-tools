"use strict";
/**
 * Schema definition for CK3 Province Setup - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceSetupSchemaMap = exports.provinceSetupSchema = void 0;
exports.getProvinceSetupFieldNames = getProvinceSetupFieldNames;
exports.getProvinceSetupFieldDocumentation = getProvinceSetupFieldDocumentation;
exports.provinceSetupSchema = [
    // Basic Properties
    {
        name: 'terrain',
        type: 'string',
        description: 'Terrain type of the province.',
        example: 'terrain = plains',
    },
    {
        name: 'province',
        type: 'integer',
        description: 'Province ID.',
        example: 'province = 1234',
    },
    // Culture and Religion
    {
        name: 'culture',
        type: 'string',
        description: 'Default culture of the province.',
        example: 'culture = english',
    },
    {
        name: 'religion',
        type: 'string',
        description: 'Default religion of the province.',
        example: 'religion = catholic',
    },
    // Holding
    {
        name: 'holding',
        type: 'enum',
        description: 'Type of holding in this province.',
        values: ['castle_holding', 'city_holding', 'church_holding', 'tribal_holding', 'none'],
        example: 'holding = castle_holding',
    },
    {
        name: 'max_slots',
        type: 'integer',
        description: 'Maximum building slots.',
        example: 'max_slots = 6',
    },
    // Special
    {
        name: 'special_building_slot',
        type: 'string',
        description: 'Special building slot for unique buildings.',
        example: 'special_building_slot = jerusalem_temple',
    },
    {
        name: 'holy_site',
        type: 'string',
        description: 'Holy site in this province.',
        example: 'holy_site = jerusalem_hs',
    },
    // Modifiers
    {
        name: 'winter',
        type: 'enum',
        description: 'Winter severity in this province.',
        values: ['no_winter', 'mild_winter', 'normal_winter', 'severe_winter'],
        example: 'winter = mild_winter',
    },
    // Development
    {
        name: 'development_level',
        type: 'integer',
        description: 'Starting development level.',
        example: 'development_level = 10',
    },
];
// Map for quick lookup
exports.provinceSetupSchemaMap = new Map(exports.provinceSetupSchema.map((field) => [field.name, field]));
function getProvinceSetupFieldNames() {
    return exports.provinceSetupSchema.map((field) => field.name);
}
function getProvinceSetupFieldDocumentation(fieldName) {
    const field = exports.provinceSetupSchemaMap.get(fieldName);
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
//# sourceMappingURL=provinceSetupSchema.js.map