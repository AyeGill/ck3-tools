"use strict";
/**
 * Schema definition for CK3 Culture Eras - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cultureEraSchemaMap = exports.cultureEraSchema = void 0;
exports.getCultureEraFieldNames = getCultureEraFieldNames;
exports.getCultureEraFieldDocumentation = getCultureEraFieldDocumentation;
exports.cultureEraSchema = [
    // Basic Properties
    {
        name: 'year',
        type: 'integer',
        description: 'Year when this era starts.',
        example: 'year = 1000',
    },
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the era name.',
        example: 'name = "culture_era_high_medieval"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the era description.',
        example: 'desc = "culture_era_high_medieval_desc"',
    },
    // Innovations
    {
        name: 'innovations',
        type: 'list',
        description: 'Innovations available in this era.',
        example: `innovations = {
    innovation_castle_curtain_walls
    innovation_heavier_cavalry
}`,
    },
    {
        name: 'innovation_cost',
        type: 'integer',
        description: 'Base cost for innovations in this era.',
        example: 'innovation_cost = 1000',
    },
    // Requirements
    {
        name: 'can_enter',
        type: 'trigger',
        description: 'Conditions to enter this era.',
        example: `can_enter = {
    culture_has_x_percent_innovations = {
        era = culture_era_early_medieval
        percent = 0.5
    }
}`,
    },
    // Modifiers
    {
        name: 'modifier',
        type: 'block',
        description: 'Modifiers applied to cultures in this era.',
        example: `modifier = {
    development_growth_factor = 0.1
}`,
    },
    // Color
    {
        name: 'color',
        type: 'block',
        description: 'Color representing this era.',
        example: 'color = { 0.6 0.4 0.2 }',
    },
    // Order
    {
        name: 'order',
        type: 'integer',
        description: 'Era progression order.',
        example: 'order = 3',
    },
];
// Map for quick lookup
exports.cultureEraSchemaMap = new Map(exports.cultureEraSchema.map((field) => [field.name, field]));
function getCultureEraFieldNames() {
    return exports.cultureEraSchema.map((field) => field.name);
}
function getCultureEraFieldDocumentation(fieldName) {
    const field = exports.cultureEraSchemaMap.get(fieldName);
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
//# sourceMappingURL=cultureEraSchema.js.map