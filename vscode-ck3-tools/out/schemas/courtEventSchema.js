"use strict";
/**
 * Schema definition for CK3 Court Events - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.courtEventSchemaMap = exports.courtEventSchema = void 0;
exports.getCourtEventFieldNames = getCourtEventFieldNames;
exports.getCourtEventFieldDocumentation = getCourtEventFieldDocumentation;
exports.courtEventSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the event name.',
        example: 'name = "court_event_grand_feast"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "court_event_grand_feast_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this event.',
        example: 'icon = "gfx/interface/icons/court/event_feast.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of court event.',
        values: ['petition', 'celebration', 'crisis', 'diplomatic', 'special'],
        example: 'type = celebration',
    },
    // Court Type
    {
        name: 'court_type',
        type: 'string',
        description: 'Required court type.',
        example: 'court_type = royal_court',
    },
    // Cost
    {
        name: 'cost',
        type: 'block',
        description: 'Cost to trigger event.',
        example: `cost = {
    gold = 100
    prestige = 50
}`,
    },
    // Grandeur
    {
        name: 'grandeur_requirement',
        type: 'integer',
        description: 'Minimum grandeur required.',
        example: 'grandeur_requirement = 50',
    },
    {
        name: 'grandeur_gain',
        type: 'integer',
        description: 'Grandeur gained from event.',
        example: 'grandeur_gain = 10',
    },
    // Effects
    {
        name: 'on_start',
        type: 'effect',
        description: 'Effects when event starts.',
        example: `on_start = {
    trigger_event = court_events.1000
}`,
    },
    {
        name: 'on_complete',
        type: 'effect',
        description: 'Effects on completion.',
        example: `on_complete = {
    add_prestige = 200
}`,
    },
    // Duration
    {
        name: 'duration',
        type: 'integer',
        description: 'Duration in days.',
        example: 'duration = 30',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for availability.',
        example: `potential = {
    has_royal_court = yes
}`,
    },
    {
        name: 'can_trigger',
        type: 'trigger',
        description: 'Conditions to trigger.',
        example: `can_trigger = {
    gold >= 100
}`,
    },
    // Cooldown
    {
        name: 'cooldown',
        type: 'integer',
        description: 'Cooldown in days.',
        example: 'cooldown = 365',
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
exports.courtEventSchemaMap = new Map(exports.courtEventSchema.map((field) => [field.name, field]));
function getCourtEventFieldNames() {
    return exports.courtEventSchema.map((field) => field.name);
}
function getCourtEventFieldDocumentation(fieldName) {
    const field = exports.courtEventSchemaMap.get(fieldName);
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
//# sourceMappingURL=courtEventSchema.js.map