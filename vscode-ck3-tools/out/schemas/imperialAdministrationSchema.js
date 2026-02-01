"use strict";
/**
 * Schema definition for CK3 Imperial Administration - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.imperialAdministrationSchemaMap = exports.imperialAdministrationSchema = void 0;
exports.getImperialAdministrationFieldNames = getImperialAdministrationFieldNames;
exports.getImperialAdministrationFieldDocumentation = getImperialAdministrationFieldDocumentation;
exports.imperialAdministrationSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the administration name.',
        example: 'name = "imperial_administration_theme"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "imperial_administration_theme_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this administration.',
        example: 'icon = "gfx/interface/icons/admin/theme.dds"',
    },
    // Tier
    {
        name: 'tier',
        type: 'integer',
        description: 'Administrative tier.',
        example: 'tier = 2',
    },
    // Structure
    {
        name: 'governor_title',
        type: 'string',
        description: 'Title for the governor.',
        example: 'governor_title = "strategos"',
    },
    {
        name: 'subdivisions',
        type: 'list',
        description: 'Subdivision types allowed.',
        example: `subdivisions = {
    turma
    bandon
}`,
    },
    // Modifiers
    {
        name: 'realm_modifier',
        type: 'block',
        description: 'Modifiers for the realm.',
        example: `realm_modifier = {
    tax_mult = 0.1
    levy_size = 0.05
}`,
    },
    {
        name: 'governor_modifier',
        type: 'block',
        description: 'Modifiers for governors.',
        example: `governor_modifier = {
    monthly_prestige = 0.5
}`,
    },
    // Control
    {
        name: 'centralization_cost',
        type: 'integer',
        description: 'Cost to centralize.',
        example: 'centralization_cost = 500',
    },
    {
        name: 'decentralization_cost',
        type: 'integer',
        description: 'Cost to decentralize.',
        example: 'decentralization_cost = 250',
    },
    // Effects
    {
        name: 'on_establish',
        type: 'effect',
        description: 'Effects when establishing.',
        example: `on_establish = {
    add_prestige = 200
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    has_government = administrative_government
}`,
    },
    {
        name: 'can_use',
        type: 'trigger',
        description: 'Conditions to use.',
        example: `can_use = {
    realm_size >= 20
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.imperialAdministrationSchemaMap = new Map(exports.imperialAdministrationSchema.map((field) => [field.name, field]));
function getImperialAdministrationFieldNames() {
    return exports.imperialAdministrationSchema.map((field) => field.name);
}
function getImperialAdministrationFieldDocumentation(fieldName) {
    const field = exports.imperialAdministrationSchemaMap.get(fieldName);
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
//# sourceMappingURL=imperialAdministrationSchema.js.map