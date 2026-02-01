"use strict";
/**
 * Schema definition for CK3 Siege Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.siegeTypeSchemaMap = exports.siegeTypeSchema = void 0;
exports.getSiegeTypeFieldNames = getSiegeTypeFieldNames;
exports.getSiegeTypeFieldDocumentation = getSiegeTypeFieldDocumentation;
exports.siegeTypeSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the siege type name.',
        example: 'name = "siege_type_assault"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "siege_type_assault_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this siege type.',
        example: 'icon = "gfx/interface/icons/siege/assault.dds"',
    },
    // Type
    {
        name: 'category',
        type: 'enum',
        description: 'Category of siege.',
        values: ['assault', 'blockade', 'bombardment', 'mining', 'special'],
        example: 'category = assault',
    },
    // Speed
    {
        name: 'siege_progress',
        type: 'float',
        description: 'Siege progress rate.',
        example: 'siege_progress = 1.0',
    },
    {
        name: 'siege_progress_mult',
        type: 'float',
        description: 'Siege progress multiplier.',
        example: 'siege_progress_mult = 0.2',
    },
    // Casualties
    {
        name: 'attacker_casualties',
        type: 'float',
        description: 'Attacker casualty rate.',
        example: 'attacker_casualties = 0.5',
    },
    {
        name: 'defender_casualties',
        type: 'float',
        description: 'Defender casualty rate.',
        example: 'defender_casualties = 0.1',
    },
    // Requirements
    {
        name: 'min_army_size',
        type: 'integer',
        description: 'Minimum army size required.',
        example: 'min_army_size = 1000',
    },
    {
        name: 'siege_weapon_requirement',
        type: 'string',
        description: 'Required siege weapon.',
        example: 'siege_weapon_requirement = "trebuchet"',
    },
    // Effects
    {
        name: 'on_success',
        type: 'effect',
        description: 'Effects on successful siege.',
        example: `on_success = {
    add_prestige = 100
}`,
    },
    {
        name: 'on_fail',
        type: 'effect',
        description: 'Effects on failed siege.',
        example: `on_fail = {
    add_prestige = -50
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    has_siege_weapon = yes
}`,
    },
    {
        name: 'can_use',
        type: 'trigger',
        description: 'Conditions to use.',
        example: `can_use = {
    army_size >= 1000
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
exports.siegeTypeSchemaMap = new Map(exports.siegeTypeSchema.map((field) => [field.name, field]));
function getSiegeTypeFieldNames() {
    return exports.siegeTypeSchema.map((field) => field.name);
}
function getSiegeTypeFieldDocumentation(fieldName) {
    const field = exports.siegeTypeSchemaMap.get(fieldName);
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
//# sourceMappingURL=siegeTypeSchema.js.map