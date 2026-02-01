"use strict";
/**
 * Schema definition for CK3 Domiciles (Roads to Power DLC) - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.domicileSchemaMap = exports.domicileSchema = exports.DOMICILE_TYPES = void 0;
exports.getDomicileFieldNames = getDomicileFieldNames;
exports.getDomicileFieldDocumentation = getDomicileFieldDocumentation;
exports.DOMICILE_TYPES = [
    'manor',
    'estate',
    'villa',
    'palace',
];
exports.domicileSchema = [
    // Basic Properties
    {
        name: 'type',
        type: 'enum',
        description: 'Type of domicile.',
        values: [...exports.DOMICILE_TYPES],
        example: 'type = manor',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the domicile.',
        example: 'icon = "gfx/interface/icons/domiciles/manor.dds"',
    },
    // Building slots
    {
        name: 'building_slots',
        type: 'integer',
        description: 'Number of building slots available.',
        example: 'building_slots = 4',
    },
    {
        name: 'available_buildings',
        type: 'list',
        description: 'Buildings that can be constructed.',
        example: `available_buildings = {
    domicile_garden
    domicile_library
    domicile_barracks
}`,
    },
    // Requirements
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the domicile to be shown.',
        example: `is_shown = {
    NOT = { is_landed = yes }
}`,
    },
    {
        name: 'can_own',
        type: 'trigger',
        description: 'Conditions for owning this domicile.',
        example: `can_own = {
    gold >= 100
}`,
    },
    // Costs
    {
        name: 'cost',
        type: 'block',
        description: 'Cost to acquire or upgrade the domicile.',
        example: `cost = {
    gold = 500
}`,
    },
    {
        name: 'monthly_cost',
        type: 'block',
        description: 'Monthly upkeep cost.',
        example: `monthly_cost = {
    gold = 2
}`,
    },
    // Modifiers
    {
        name: 'owner_modifier',
        type: 'block',
        description: 'Modifiers applied to the domicile owner.',
        example: `owner_modifier = {
    monthly_prestige = 0.3
    stress_loss_mult = 0.1
}`,
    },
    {
        name: 'guest_modifier',
        type: 'block',
        description: 'Modifiers applied to guests.',
        example: `guest_modifier = {
    opinion_of_host = 10
}`,
    },
    // On actions
    {
        name: 'on_acquire',
        type: 'effect',
        description: 'Effects when acquiring the domicile.',
        example: `on_acquire = {
    add_prestige = 100
}`,
    },
    {
        name: 'on_lose',
        type: 'effect',
        description: 'Effects when losing the domicile.',
        example: `on_lose = {
    add_stress = 50
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to choose this domicile.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.domicileSchemaMap = new Map(exports.domicileSchema.map((field) => [field.name, field]));
function getDomicileFieldNames() {
    return exports.domicileSchema.map((field) => field.name);
}
function getDomicileFieldDocumentation(fieldName) {
    const field = exports.domicileSchemaMap.get(fieldName);
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
//# sourceMappingURL=domicileSchema.js.map