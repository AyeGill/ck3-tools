"use strict";
/**
 * Schema definition for CK3 Administrative Divisions - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.administrativeDivisionSchemaMap = exports.administrativeDivisionSchema = void 0;
exports.getAdministrativeDivisionFieldNames = getAdministrativeDivisionFieldNames;
exports.getAdministrativeDivisionFieldDocumentation = getAdministrativeDivisionFieldDocumentation;
exports.administrativeDivisionSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the division name.',
        example: 'name = "administrative_division_theme"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "administrative_division_theme_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this division.',
        example: 'icon = "gfx/interface/icons/admin/division_theme.dds"',
    },
    // Tier
    {
        name: 'tier',
        type: 'enum',
        description: 'Administrative tier level.',
        values: ['province', 'county', 'duchy', 'kingdom', 'empire'],
        example: 'tier = duchy',
    },
    // Size
    {
        name: 'min_counties',
        type: 'integer',
        description: 'Minimum counties required.',
        example: 'min_counties = 3',
    },
    {
        name: 'max_counties',
        type: 'integer',
        description: 'Maximum counties allowed.',
        example: 'max_counties = 10',
    },
    // Modifiers
    {
        name: 'governor_modifier',
        type: 'block',
        description: 'Modifiers for the governor.',
        example: `governor_modifier = {
    monthly_prestige = 0.5
    stewardship = 2
}`,
    },
    {
        name: 'province_modifier',
        type: 'block',
        description: 'Modifiers for provinces in division.',
        example: `province_modifier = {
    tax_mult = 0.1
    levy_size = 0.05
}`,
    },
    // Control
    {
        name: 'control_growth',
        type: 'float',
        description: 'Monthly control growth.',
        example: 'control_growth = 0.5',
    },
    {
        name: 'tax_contribution',
        type: 'float',
        description: 'Tax contribution to liege.',
        example: 'tax_contribution = 0.3',
    },
    // Effects
    {
        name: 'on_creation',
        type: 'effect',
        description: 'Effects when division is created.',
        example: `on_creation = {
    add_prestige = 100
}`,
    },
    {
        name: 'on_dissolution',
        type: 'effect',
        description: 'Effects when division is dissolved.',
        example: `on_dissolution = {
    add_prestige = -50
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for division availability.',
        example: `potential = {
    has_government = administrative_government
}`,
    },
    {
        name: 'can_create',
        type: 'trigger',
        description: 'Conditions to create this division.',
        example: `can_create = {
    prestige >= 500
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for this division.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.administrativeDivisionSchemaMap = new Map(exports.administrativeDivisionSchema.map((field) => [field.name, field]));
function getAdministrativeDivisionFieldNames() {
    return exports.administrativeDivisionSchema.map((field) => field.name);
}
function getAdministrativeDivisionFieldDocumentation(fieldName) {
    const field = exports.administrativeDivisionSchemaMap.get(fieldName);
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
//# sourceMappingURL=administrativeDivisionSchema.js.map