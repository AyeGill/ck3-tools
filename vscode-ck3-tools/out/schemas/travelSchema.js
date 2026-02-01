"use strict";
/**
 * Schema definition for CK3 Travel System - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelSchemaMap = exports.travelSchema = void 0;
exports.getTravelFieldNames = getTravelFieldNames;
exports.getTravelFieldDocumentation = getTravelFieldDocumentation;
exports.travelSchema = [
    // Basic Properties
    {
        name: 'travel_plan_type',
        type: 'string',
        description: 'Type of travel plan.',
        example: 'travel_plan_type = "pilgrimage"',
    },
    // Destinations
    {
        name: 'destination',
        type: 'block',
        description: 'Define the travel destination.',
        example: `destination = {
    province = scope:target_province
}`,
    },
    {
        name: 'on_arrival',
        type: 'effect',
        description: 'Effects when arriving at destination.',
        example: `on_arrival = {
    add_prestige = 100
}`,
    },
    {
        name: 'on_departure',
        type: 'effect',
        description: 'Effects when departing.',
        example: `on_departure = {
    trigger_event = travel_events.001
}`,
    },
    // Travel options
    {
        name: 'travel_speed',
        type: 'block',
        description: 'Speed modifiers for travel.',
        example: `travel_speed = {
    base = 1.0
    multiply = {
        value = 1.2
        if = {
            limit = { has_trait = athletic }
        }
    }
}`,
    },
    {
        name: 'travel_safety',
        type: 'block',
        description: 'Safety modifiers for travel.',
        example: `travel_safety = {
    base = 50
    add = {
        value = 20
        if = {
            limit = { num_of_knights >= 5 }
        }
    }
}`,
    },
    // Companions
    {
        name: 'entourage',
        type: 'block',
        description: 'Define who travels with the character.',
        example: `entourage = {
    spouse = yes
    children = yes
    courtiers = 3
}`,
    },
    // Triggers
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for the travel option to be shown.',
        example: `is_shown = {
    is_ruler = yes
}`,
    },
    {
        name: 'can_start',
        type: 'trigger',
        description: 'Conditions for starting the travel.',
        example: `can_start = {
    is_available = yes
    gold >= 50
}`,
    },
    // Cost
    {
        name: 'cost',
        type: 'block',
        description: 'Cost to start the travel.',
        example: `cost = {
    gold = 100
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to use this travel option.',
        example: `ai_will_do = {
    base = 100
    modifier = {
        add = -50
        gold < 200
    }
}`,
    },
    // Travel danger
    {
        name: 'danger_types',
        type: 'list',
        description: 'Types of dangers during travel.',
        example: `danger_types = {
    bandits
    weather
    disease
}`,
    },
    {
        name: 'on_travel_danger',
        type: 'effect',
        description: 'Effects when a travel danger occurs.',
        example: `on_travel_danger = {
    trigger_event = travel_danger_events.001
}`,
    },
];
// Map for quick lookup
exports.travelSchemaMap = new Map(exports.travelSchema.map((field) => [field.name, field]));
function getTravelFieldNames() {
    return exports.travelSchema.map((field) => field.name);
}
function getTravelFieldDocumentation(fieldName) {
    const field = exports.travelSchemaMap.get(fieldName);
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
//# sourceMappingURL=travelSchema.js.map