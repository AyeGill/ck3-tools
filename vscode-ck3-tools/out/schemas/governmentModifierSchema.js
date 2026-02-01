"use strict";
/**
 * Schema definition for CK3 Government Modifiers - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.governmentModifierSchemaMap = exports.governmentModifierSchema = void 0;
exports.getGovernmentModifierFieldNames = getGovernmentModifierFieldNames;
exports.getGovernmentModifierFieldDocumentation = getGovernmentModifierFieldDocumentation;
exports.governmentModifierSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the modifier name.',
        example: 'name = "government_modifier_centralized"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "government_modifier_centralized_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this modifier.',
        example: 'icon = "gfx/interface/icons/government/modifier_centralized.dds"',
    },
    // Government
    {
        name: 'government',
        type: 'string',
        description: 'Government type this applies to.',
        example: 'government = feudal_government',
    },
    // Modifiers
    {
        name: 'character_modifier',
        type: 'block',
        description: 'Character modifiers.',
        example: `character_modifier = {
    domain_limit = 2
    vassal_limit = -5
}`,
    },
    {
        name: 'county_modifier',
        type: 'block',
        description: 'County modifiers.',
        example: `county_modifier = {
    tax_mult = 0.1
    levy_size = 0.05
}`,
    },
    // Duration
    {
        name: 'duration',
        type: 'integer',
        description: 'Duration in days (-1 for permanent).',
        example: 'duration = -1',
    },
    // Stacking
    {
        name: 'stacking',
        type: 'boolean',
        description: 'Whether this modifier stacks.',
        default: false,
        example: 'stacking = no',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    has_government = feudal_government
}`,
    },
    // Effects
    {
        name: 'on_gain',
        type: 'effect',
        description: 'Effects when gained.',
        example: `on_gain = {
    add_prestige = 100
}`,
    },
    {
        name: 'on_lose',
        type: 'effect',
        description: 'Effects when lost.',
        example: `on_lose = {
    add_prestige = -50
}`,
    },
];
// Map for quick lookup
exports.governmentModifierSchemaMap = new Map(exports.governmentModifierSchema.map((field) => [field.name, field]));
function getGovernmentModifierFieldNames() {
    return exports.governmentModifierSchema.map((field) => field.name);
}
function getGovernmentModifierFieldDocumentation(fieldName) {
    const field = exports.governmentModifierSchemaMap.get(fieldName);
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
//# sourceMappingURL=governmentModifierSchema.js.map