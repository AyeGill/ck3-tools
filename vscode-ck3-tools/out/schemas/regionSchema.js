"use strict";
/**
 * Schema definition for CK3 Regions - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionSchemaMap = exports.regionSchema = void 0;
exports.getRegionFieldNames = getRegionFieldNames;
exports.getRegionFieldDocumentation = getRegionFieldDocumentation;
exports.regionSchema = [
    // Geographic Areas
    {
        name: 'duchies',
        type: 'list',
        description: 'Duchies included in this region.',
        example: `duchies = {
    d_normandy
    d_brittany
    d_anjou
}`,
    },
    {
        name: 'counties',
        type: 'list',
        description: 'Counties included in this region.',
        example: `counties = {
    c_paris
    c_orleans
}`,
    },
    {
        name: 'provinces',
        type: 'list',
        description: 'Province IDs included in this region.',
        example: `provinces = {
    1234
    1235
    1236
}`,
    },
    // Nested Regions
    {
        name: 'regions',
        type: 'list',
        description: 'Sub-regions included in this region.',
        example: `regions = {
    world_europe_west_francia
    world_europe_west_burgundy
}`,
    },
    // Graphical Culture
    {
        name: 'graphical_culture',
        type: 'string',
        description: 'Default graphical culture for this region.',
        example: 'graphical_culture = western_building_gfx',
    },
    // Color
    {
        name: 'color',
        type: 'block',
        description: 'Color for this region on maps.',
        example: 'color = { 0.8 0.2 0.2 }',
    },
    // Sea Region Properties
    {
        name: 'sea_zones',
        type: 'list',
        description: 'Sea zones included in this region.',
        example: `sea_zones = {
    RANGE { 1000 1050 }
}`,
    },
];
// Map for quick lookup
exports.regionSchemaMap = new Map(exports.regionSchema.map((field) => [field.name, field]));
function getRegionFieldNames() {
    return exports.regionSchema.map((field) => field.name);
}
function getRegionFieldDocumentation(fieldName) {
    const field = exports.regionSchemaMap.get(fieldName);
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
//# sourceMappingURL=regionSchema.js.map