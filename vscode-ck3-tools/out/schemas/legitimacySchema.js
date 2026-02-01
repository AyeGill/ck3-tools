"use strict";
/**
 * Schema definition for CK3 Legitimacy - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.legitimacySchemaMap = exports.legitimacySchema = void 0;
exports.getLegitimacyFieldNames = getLegitimacyFieldNames;
exports.getLegitimacyFieldDocumentation = getLegitimacyFieldDocumentation;
exports.legitimacySchema = [
    // Basic Properties
    {
        name: 'legitimacy_level',
        type: 'string',
        description: 'The legitimacy level identifier.',
        example: 'legitimacy_level = "high_legitimacy"',
    },
    {
        name: 'threshold',
        type: 'integer',
        description: 'Threshold value for this legitimacy level.',
        example: 'threshold = 75',
    },
    // Visual
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this legitimacy level.',
        example: 'icon = "gfx/interface/icons/legitimacy/legitimacy_high.dds"',
    },
    {
        name: 'color',
        type: 'block',
        description: 'Color for the legitimacy level.',
        example: 'color = { 0.8 0.7 0.2 }',
    },
    // Modifiers
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Modifiers applied to the character.',
        example: `character_modifier = {
    monthly_prestige = 1.0
    vassal_opinion = 10
}`,
    },
    {
        name: 'tax_modifier',
        type: 'block',
        description: 'Tax modifiers at this legitimacy level.',
        example: `tax_modifier = {
    tax_mult = 0.1
}`,
    },
    {
        name: 'levy_modifier',
        type: 'block',
        description: 'Levy modifiers at this legitimacy level.',
        example: `levy_modifier = {
    levy_size = 0.1
}`,
    },
    // Parameters
    {
        name: 'parameters',
        type: 'block',
        description: 'Special parameters enabled at this level.',
        example: `parameters = {
    can_revoke_without_tyranny = yes
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI evaluation for legitimacy actions.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.legitimacySchemaMap = new Map(exports.legitimacySchema.map((field) => [field.name, field]));
function getLegitimacyFieldNames() {
    return exports.legitimacySchema.map((field) => field.name);
}
function getLegitimacyFieldDocumentation(fieldName) {
    const field = exports.legitimacySchemaMap.get(fieldName);
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
//# sourceMappingURL=legitimacySchema.js.map