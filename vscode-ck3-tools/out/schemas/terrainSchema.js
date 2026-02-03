"use strict";
/**
 * Schema definition for CK3 Terrain Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.terrainSchemaMap = exports.terrainSchema = void 0;
exports.getTerrainFieldNames = getTerrainFieldNames;
exports.getTerrainFieldDocumentation = getTerrainFieldDocumentation;
exports.terrainSchema = [
    // Basic Properties
    {
        name: 'color',
        type: 'block',
        description: 'RGB color for this terrain type on the map.',
        example: 'color = { 128 128 64 }',
    },
    {
        name: 'movement_speed',
        type: 'float',
        description: 'Movement speed modifier.',
        example: 'movement_speed = 0.8',
    },
    {
        name: 'combat_width',
        type: 'float',
        description: 'Combat width modifier.',
        example: 'combat_width = 0.75',
    },
    {
        name: 'audio_parameter',
        type: 'float',
        description: 'Audio parameter for sound effects.',
        example: 'audio_parameter = 0.5',
    },
    // Province Modifier
    {
        name: 'province_modifier',
        type: 'block',
        description: 'Modifiers applied to provinces with this terrain.',
        example: `province_modifier = {
    garrison_size = -0.25
    levy_size = -0.1
}`,
    },
];
// Map for quick lookup
exports.terrainSchemaMap = new Map(exports.terrainSchema.map((field) => [field.name, field]));
function getTerrainFieldNames() {
    return exports.terrainSchema.map((field) => field.name);
}
function getTerrainFieldDocumentation(fieldName) {
    const field = exports.terrainSchemaMap.get(fieldName);
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
//# sourceMappingURL=terrainSchema.js.map