"use strict";
/**
 * Schema definition for CK3 Realm Law Categories - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.realmLawCategorySchemaMap = exports.realmLawCategorySchema = void 0;
exports.getRealmLawCategoryFieldNames = getRealmLawCategoryFieldNames;
exports.getRealmLawCategoryFieldDocumentation = getRealmLawCategoryFieldDocumentation;
exports.realmLawCategorySchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the category name.',
        example: 'name = "realm_law_category_succession"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "realm_law_category_succession_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this category.',
        example: 'icon = "gfx/interface/icons/law/category_succession.dds"',
    },
    // Sort Order
    {
        name: 'sort_order',
        type: 'integer',
        description: 'Display sort order.',
        example: 'sort_order = 10',
    },
    // Laws
    {
        name: 'laws',
        type: 'list',
        description: 'Laws in this category.',
        example: `laws = {
    succession_law_01
    succession_law_02
}`,
    },
    // Requirements
    {
        name: 'government_requirement',
        type: 'list',
        description: 'Required government types.',
        example: `government_requirement = {
    feudal_government
    clan_government
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    is_independent_ruler = yes
}`,
    },
    // AI
    {
        name: 'ai_priority',
        type: 'block',
        description: 'AI priority weight.',
        example: `ai_priority = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.realmLawCategorySchemaMap = new Map(exports.realmLawCategorySchema.map((field) => [field.name, field]));
function getRealmLawCategoryFieldNames() {
    return exports.realmLawCategorySchema.map((field) => field.name);
}
function getRealmLawCategoryFieldDocumentation(fieldName) {
    const field = exports.realmLawCategorySchemaMap.get(fieldName);
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
//# sourceMappingURL=realmLawCategorySchema.js.map