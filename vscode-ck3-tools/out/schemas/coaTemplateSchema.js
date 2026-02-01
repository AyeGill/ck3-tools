"use strict";
/**
 * Schema definition for CK3 Coat of Arms Templates - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.coaTemplateSchemaMap = exports.coaTemplateSchema = void 0;
exports.getCoaTemplateFieldNames = getCoaTemplateFieldNames;
exports.getCoaTemplateFieldDocumentation = getCoaTemplateFieldDocumentation;
exports.coaTemplateSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name identifier for the CoA template.',
        example: 'name = "coa_template_kingdom"',
    },
    // Pattern
    {
        name: 'pattern',
        type: 'string',
        description: 'Pattern file for the coat of arms.',
        example: 'pattern = "pattern_solid.dds"',
    },
    // Colors
    {
        name: 'color1',
        type: 'string',
        description: 'Primary color.',
        example: 'color1 = "red"',
    },
    {
        name: 'color2',
        type: 'string',
        description: 'Secondary color.',
        example: 'color2 = "yellow"',
    },
    {
        name: 'color3',
        type: 'string',
        description: 'Tertiary color.',
        example: 'color3 = "white"',
    },
    // Emblems
    {
        name: 'emblem',
        type: 'block',
        description: 'Emblem definition.',
        example: `emblem = {
    texture = "eagle_01.dds"
    color1 = "yellow"
    instance = { position = { 0.5 0.5 } scale = { 0.8 0.8 } }
}`,
    },
    // Colored Emblems
    {
        name: 'colored_emblem',
        type: 'block',
        description: 'Colored emblem definition.',
        example: `colored_emblem = {
    texture = "ce_lion.dds"
    color1 = "yellow"
    color2 = "red"
    instance = { position = { 0.5 0.5 } }
}`,
    },
    // Textured Emblems
    {
        name: 'textured_emblem',
        type: 'block',
        description: 'Textured emblem definition.',
        example: `textured_emblem = {
    texture = "te_cross.dds"
    instance = { position = { 0.5 0.5 } }
}`,
    },
    // Sub Coat of Arms
    {
        name: 'sub',
        type: 'block',
        description: 'Sub coat of arms for quartering.',
        example: `sub = {
    pattern = "pattern_solid.dds"
    color1 = "blue"
    instance = { position = { 0.25 0.25 } scale = { 0.5 0.5 } }
}`,
    },
    // Conditions
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for using this template.',
        example: `trigger = {
    highest_held_title_tier >= tier_kingdom
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
exports.coaTemplateSchemaMap = new Map(exports.coaTemplateSchema.map((field) => [field.name, field]));
function getCoaTemplateFieldNames() {
    return exports.coaTemplateSchema.map((field) => field.name);
}
function getCoaTemplateFieldDocumentation(fieldName) {
    const field = exports.coaTemplateSchemaMap.get(fieldName);
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
//# sourceMappingURL=coaTemplateSchema.js.map