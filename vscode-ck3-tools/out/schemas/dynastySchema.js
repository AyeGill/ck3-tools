"use strict";
/**
 * Schema definition for CK3 Dynasties and Dynasty Houses - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynastyHouseSchemaMap = exports.dynastySchemaMap = exports.dynastyHouseSchema = exports.dynastySchema = void 0;
exports.getDynastyFieldNames = getDynastyFieldNames;
exports.getDynastyFieldDocumentation = getDynastyFieldDocumentation;
exports.dynastySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the dynasty name.',
        example: 'name = "dynn_Karling"',
    },
    {
        name: 'prefix',
        type: 'string',
        description: 'Localization key for the dynasty prefix.',
        example: 'prefix = "dynnp_von"',
    },
    {
        name: 'culture',
        type: 'string',
        description: 'Default culture for this dynasty.',
        example: 'culture = french',
    },
    {
        name: 'motto',
        type: 'string',
        description: 'Localization key for the dynasty motto.',
        example: 'motto = "motto_karling"',
    },
    {
        name: 'forced_coa_religiongroup',
        type: 'string',
        description: 'Force coat of arms style based on religion group.',
        example: 'forced_coa_religiongroup = "christian"',
    },
];
exports.dynastyHouseSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the house name.',
        example: 'name = "house_capet"',
    },
    {
        name: 'prefix',
        type: 'string',
        description: 'Localization key for the house prefix.',
        example: 'prefix = "dynnp_de"',
    },
    {
        name: 'dynasty',
        type: 'string',
        description: 'Parent dynasty ID.',
        required: true,
        example: 'dynasty = 25',
    },
    {
        name: 'motto',
        type: 'string',
        description: 'Localization key for the house motto.',
        example: 'motto = "motto_capet"',
    },
];
// Map for quick lookup
exports.dynastySchemaMap = new Map(exports.dynastySchema.map((field) => [field.name, field]));
exports.dynastyHouseSchemaMap = new Map(exports.dynastyHouseSchema.map((field) => [field.name, field]));
function getDynastyFieldNames() {
    return exports.dynastySchema.map((field) => field.name);
}
function getDynastyFieldDocumentation(fieldName) {
    const field = exports.dynastySchemaMap.get(fieldName);
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
//# sourceMappingURL=dynastySchema.js.map