"use strict";
/**
 * Schema definition for CK3 Combat Phases - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.combatPhaseSchemaMap = exports.combatPhaseSchema = void 0;
exports.getCombatPhaseFieldNames = getCombatPhaseFieldNames;
exports.getCombatPhaseFieldDocumentation = getCombatPhaseFieldDocumentation;
exports.combatPhaseSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the phase name.',
        example: 'name = "combat_phase_skirmish"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the phase description.',
        example: 'desc = "combat_phase_skirmish_desc"',
    },
    // Duration
    {
        name: 'duration',
        type: 'integer',
        description: 'Duration of the phase in days.',
        example: 'duration = 3',
    },
    {
        name: 'days_until_next_phase',
        type: 'integer',
        description: 'Days until the next phase begins.',
        example: 'days_until_next_phase = 5',
    },
    // Combat Modifiers
    {
        name: 'damage_multiplier',
        type: 'float',
        description: 'Multiplier to damage dealt during this phase.',
        example: 'damage_multiplier = 0.5',
    },
    {
        name: 'pursuit_multiplier',
        type: 'float',
        description: 'Multiplier to pursuit during this phase.',
        example: 'pursuit_multiplier = 1.0',
    },
    {
        name: 'screen_multiplier',
        type: 'float',
        description: 'Multiplier to screen during this phase.',
        example: 'screen_multiplier = 1.0',
    },
    // Unit Type Bonuses
    {
        name: 'unit_type_modifier',
        type: 'block',
        description: 'Modifiers for specific unit types during this phase.',
        example: `unit_type_modifier = {
    archers = {
        damage_multiplier = 1.5
    }
}`,
    },
    // Phase Order
    {
        name: 'order',
        type: 'integer',
        description: 'Order of this phase in combat.',
        example: 'order = 1',
    },
    // Transition
    {
        name: 'next_phase',
        type: 'string',
        description: 'Phase to transition to after this one.',
        example: 'next_phase = "melee_phase"',
    },
    {
        name: 'retreat_chance',
        type: 'float',
        description: 'Chance for army to retreat during this phase.',
        example: 'retreat_chance = 0.1',
    },
    // Special Conditions
    {
        name: 'can_occur',
        type: 'trigger',
        description: 'Conditions for this phase to occur.',
        example: `can_occur = {
    army_size >= 1000
}`,
    },
    // Graphics
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this combat phase.',
        example: 'icon = "combat_skirmish"',
    },
];
// Map for quick lookup
exports.combatPhaseSchemaMap = new Map(exports.combatPhaseSchema.map((field) => [field.name, field]));
function getCombatPhaseFieldNames() {
    return exports.combatPhaseSchema.map((field) => field.name);
}
function getCombatPhaseFieldDocumentation(fieldName) {
    const field = exports.combatPhaseSchemaMap.get(fieldName);
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
//# sourceMappingURL=combatPhaseSchema.js.map