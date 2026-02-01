"use strict";
/**
 * Schema definition for CK3 Holy Orders - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.holyOrderSchemaMap = exports.holyOrderSchema = void 0;
exports.getHolyOrderFieldNames = getHolyOrderFieldNames;
exports.getHolyOrderFieldDocumentation = getHolyOrderFieldDocumentation;
exports.holyOrderSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the holy order name.',
        example: 'name = "holy_order_knights_templar"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "holy_order_knights_templar_desc"',
    },
    // Icon
    {
        name: 'coat_of_arms',
        type: 'block',
        description: 'Coat of arms for the order.',
        example: `coat_of_arms = {
    pattern = "pattern_solid"
    color1 = "white"
    color2 = "red"
}`,
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the holy order.',
        example: 'icon = "gfx/interface/icons/holy_orders/templar.dds"',
    },
    // Religion
    {
        name: 'religion',
        type: 'string',
        description: 'Religion the order serves.',
        example: 'religion = christianity_religion',
    },
    {
        name: 'faith',
        type: 'string',
        description: 'Specific faith the order serves.',
        example: 'faith = catholic',
    },
    // Hire Cost
    {
        name: 'hire_cost',
        type: 'integer',
        description: 'Piety cost to hire.',
        example: 'hire_cost = 300',
    },
    {
        name: 'maintenance_cost',
        type: 'float',
        description: 'Monthly maintenance cost.',
        example: 'maintenance_cost = 1.0',
    },
    // Troops
    {
        name: 'regiment',
        type: 'block',
        description: 'Regiment composition.',
        example: `regiment = {
    type = heavy_cavalry
    size = 500
}`,
    },
    // Location
    {
        name: 'county',
        type: 'string',
        description: 'Home county for the order.',
        example: 'county = c_jerusalem',
    },
    {
        name: 'barony',
        type: 'string',
        description: 'Home barony.',
        example: 'barony = b_jerusalem',
    },
    // Requirements
    {
        name: 'can_hire',
        type: 'trigger',
        description: 'Conditions to hire this order.',
        example: `can_hire = {
    piety >= 300
    faith = faith:catholic
}`,
    },
    {
        name: 'can_be_created',
        type: 'trigger',
        description: 'Conditions for creation.',
        example: `can_be_created = {
    has_holy_site = yes
}`,
    },
    // Creation
    {
        name: 'creation_cost',
        type: 'integer',
        description: 'Piety cost to create.',
        example: 'creation_cost = 1000',
    },
    // Leader
    {
        name: 'leader',
        type: 'block',
        description: 'Leader character template.',
        example: `leader = {
    martial = 15
    learning = 10
}`,
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
];
// Map for quick lookup
exports.holyOrderSchemaMap = new Map(exports.holyOrderSchema.map((field) => [field.name, field]));
function getHolyOrderFieldNames() {
    return exports.holyOrderSchema.map((field) => field.name);
}
function getHolyOrderFieldDocumentation(fieldName) {
    const field = exports.holyOrderSchemaMap.get(fieldName);
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
//# sourceMappingURL=holyOrderSchema.js.map