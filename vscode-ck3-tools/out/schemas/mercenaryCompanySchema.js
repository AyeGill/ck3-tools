"use strict";
/**
 * Schema definition for CK3 Mercenary Companies - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mercenaryCompanySchemaMap = exports.mercenaryCompanySchema = void 0;
exports.getMercenaryCompanyFieldNames = getMercenaryCompanyFieldNames;
exports.getMercenaryCompanyFieldDocumentation = getMercenaryCompanyFieldDocumentation;
exports.mercenaryCompanySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the company name.',
        example: 'name = "mercenary_company_varangian"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "mercenary_company_varangian_desc"',
    },
    // Icon
    {
        name: 'coat_of_arms',
        type: 'block',
        description: 'Coat of arms for the company.',
        example: `coat_of_arms = {
    pattern = "pattern_solid"
    color1 = "red"
    color2 = "yellow"
}`,
    },
    // Hire Cost
    {
        name: 'hire_cost',
        type: 'integer',
        description: 'Gold cost to hire.',
        example: 'hire_cost = 150',
    },
    {
        name: 'maintenance_cost',
        type: 'float',
        description: 'Monthly maintenance cost multiplier.',
        example: 'maintenance_cost = 1.5',
    },
    // Troops
    {
        name: 'regiment',
        type: 'block',
        description: 'Regiment composition.',
        example: `regiment = {
    type = heavy_infantry
    size = 500
}`,
    },
    {
        name: 'regiments',
        type: 'list',
        description: 'List of regiments.',
        example: `regiments = {
    { type = heavy_infantry size = 300 }
    { type = archers size = 200 }
}`,
    },
    // Location
    {
        name: 'county',
        type: 'string',
        description: 'Home county for the company.',
        example: 'county = c_constantinople',
    },
    {
        name: 'capital',
        type: 'string',
        description: 'Capital barony.',
        example: 'capital = b_constantinople',
    },
    // Requirements
    {
        name: 'can_hire',
        type: 'trigger',
        description: 'Conditions to hire this company.',
        example: `can_hire = {
    gold >= 150
    prestige >= 100
}`,
    },
    // Culture/Religion
    {
        name: 'culture',
        type: 'string',
        description: 'Culture of the company.',
        example: 'culture = norse',
    },
    {
        name: 'religion',
        type: 'string',
        description: 'Religion of the company.',
        example: 'religion = catholic',
    },
    // AI
    {
        name: 'ai_weight',
        type: 'block',
        description: 'AI weight for hiring.',
        example: `ai_weight = {
    base = 100
}`,
    },
    // Leader
    {
        name: 'leader',
        type: 'block',
        description: 'Leader character template.',
        example: `leader = {
    martial = 15
    prowess = 12
}`,
    },
];
// Map for quick lookup
exports.mercenaryCompanySchemaMap = new Map(exports.mercenaryCompanySchema.map((field) => [field.name, field]));
function getMercenaryCompanyFieldNames() {
    return exports.mercenaryCompanySchema.map((field) => field.name);
}
function getMercenaryCompanyFieldDocumentation(fieldName) {
    const field = exports.mercenaryCompanySchemaMap.get(fieldName);
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
//# sourceMappingURL=mercenaryCompanySchema.js.map