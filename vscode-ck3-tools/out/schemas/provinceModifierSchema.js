"use strict";
/**
 * Schema definition for CK3 Province Modifiers - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.provinceModifierSchemaMap = exports.provinceModifierSchema = void 0;
exports.getProvinceModifierFieldNames = getProvinceModifierFieldNames;
exports.getProvinceModifierFieldDocumentation = getProvinceModifierFieldDocumentation;
exports.provinceModifierSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the modifier name.',
        example: 'name = "province_modifier_prosperous"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "province_modifier_prosperous_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this modifier.',
        example: 'icon = "gfx/interface/icons/province_modifiers/prosperous.dds"',
    },
    // Duration
    {
        name: 'days',
        type: 'integer',
        description: 'Duration in days.',
        example: 'days = 365',
    },
    {
        name: 'months',
        type: 'integer',
        description: 'Duration in months.',
        example: 'months = 12',
    },
    {
        name: 'years',
        type: 'integer',
        description: 'Duration in years.',
        example: 'years = 5',
    },
    // Province Effects
    {
        name: 'garrison_size',
        type: 'float',
        description: 'Garrison size modifier.',
        example: 'garrison_size = 0.2',
    },
    {
        name: 'fort_level',
        type: 'integer',
        description: 'Fort level modifier.',
        example: 'fort_level = 1',
    },
    {
        name: 'supply_limit',
        type: 'float',
        description: 'Supply limit modifier.',
        example: 'supply_limit = 0.25',
    },
    // Development
    {
        name: 'development_growth',
        type: 'float',
        description: 'Development growth modifier.',
        example: 'development_growth = 0.1',
    },
    {
        name: 'development_growth_factor',
        type: 'float',
        description: 'Development growth factor.',
        example: 'development_growth_factor = 0.2',
    },
    // Tax
    {
        name: 'tax_mult',
        type: 'float',
        description: 'Tax multiplier.',
        example: 'tax_mult = 0.1',
    },
    {
        name: 'levy_size',
        type: 'float',
        description: 'Levy size modifier.',
        example: 'levy_size = 0.1',
    },
    // Control
    {
        name: 'monthly_county_control_growth_add',
        type: 'float',
        description: 'Monthly county control growth.',
        example: 'monthly_county_control_growth_add = 0.1',
    },
    {
        name: 'monthly_county_control_growth_factor',
        type: 'float',
        description: 'County control growth factor.',
        example: 'monthly_county_control_growth_factor = 0.2',
    },
    // Stacking
    {
        name: 'stacking',
        type: 'boolean',
        description: 'Whether this modifier stacks.',
        default: true,
        example: 'stacking = no',
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this modifier to apply.',
        example: `trigger = {
    development >= 20
}`,
    },
];
// Map for quick lookup
exports.provinceModifierSchemaMap = new Map(exports.provinceModifierSchema.map((field) => [field.name, field]));
function getProvinceModifierFieldNames() {
    return exports.provinceModifierSchema.map((field) => field.name);
}
function getProvinceModifierFieldDocumentation(fieldName) {
    const field = exports.provinceModifierSchemaMap.get(fieldName);
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
//# sourceMappingURL=provinceModifierSchema.js.map