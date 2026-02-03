"use strict";
/**
 * Schema definition for CK3 Holy Sites - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.holySiteSchemaMap = exports.holySiteSchema = void 0;
exports.getHolySiteFieldNames = getHolySiteFieldNames;
exports.getHolySiteFieldDocumentation = getHolySiteFieldDocumentation;
exports.holySiteSchema = [
    // Basic Properties
    {
        name: 'county',
        type: 'string',
        description: 'The county where this holy site is located.',
        required: true,
        example: 'county = c_roma',
    },
    {
        name: 'barony',
        type: 'string',
        description: 'The specific barony of the holy site (optional).',
        example: 'barony = b_roma',
    },
    // Effects
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Modifiers applied to characters who control this holy site.',
        example: `character_modifier = {
    monthly_piety_gain_mult = 0.1
    clergy_opinion = 5
}`,
    },
    // Flags
    {
        name: 'flag',
        type: 'string',
        description: 'Flag set for characters controlling this holy site.',
        example: 'flag = controls_rome_holy_site',
    },
    // Special Properties
    {
        name: 'is_active',
        type: 'trigger',
        description: 'Conditions for this holy site to be active.',
        example: `is_active = {
    holder = {
        faith = faith:catholic
    }
}`,
    },
];
// Map for quick lookup
exports.holySiteSchemaMap = new Map(exports.holySiteSchema.map((field) => [field.name, field]));
function getHolySiteFieldNames() {
    return exports.holySiteSchema.map((field) => field.name);
}
function getHolySiteFieldDocumentation(fieldName) {
    const field = exports.holySiteSchemaMap.get(fieldName);
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
//# sourceMappingURL=holySiteSchema.js.map