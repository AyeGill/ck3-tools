"use strict";
/**
 * Schema definition for CK3 Struggles (Fate of Iberia DLC) - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.struggleSchemaMap = exports.struggleSchema = exports.STRUGGLE_PHASES = void 0;
exports.getStruggleFieldNames = getStruggleFieldNames;
exports.getStruggleFieldDocumentation = getStruggleFieldDocumentation;
exports.STRUGGLE_PHASES = [
    'struggle_phase_opportunity',
    'struggle_phase_compromise',
    'struggle_phase_hostility',
    'struggle_phase_conciliation',
];
exports.struggleSchema = [
    // Basic Properties
    {
        name: 'start_phase',
        type: 'string',
        description: 'The initial phase of the struggle.',
        example: 'start_phase = struggle_phase_opportunity',
    },
    // Region
    {
        name: 'region',
        type: 'string',
        description: 'The geographical region where the struggle takes place.',
        example: 'region = world_europe_west_iberia',
    },
    // Involvement
    {
        name: 'involvement',
        type: 'block',
        description: 'Define involvement criteria for characters.',
        example: `involvement = {
    involved = {
        trigger = {
            capital_province = { geographical_region = world_europe_west_iberia }
        }
    }
    interloper = {
        trigger = {
            any_held_title = { tier >= tier_county }
        }
    }
}`,
    },
    // Phases
    {
        name: 'phases',
        type: 'block',
        description: 'Define the phases of the struggle.',
        example: `phases = {
    struggle_phase_opportunity = {
        background = "gfx/interface/illustrations/struggle_phase_bg.dds"
        future_phases = {
            struggle_phase_hostility = {
                catalysts = { catalyst_example = 10 }
            }
        }
    }
}`,
    },
    // Catalysts
    {
        name: 'catalysts',
        type: 'block',
        description: 'Define catalysts that affect struggle progress.',
        example: `catalysts = {
    catalyst_war_declared = {
        on_actions = { on_war_declared }
    }
}`,
    },
    // Ending conditions
    {
        name: 'ending_decisions',
        type: 'list',
        description: 'Decisions that can end the struggle.',
        example: `ending_decisions = {
    decision_struggle_end_compromise
    decision_struggle_end_conquest
}`,
    },
    // On actions
    {
        name: 'on_start',
        type: 'effect',
        description: 'Effects when the struggle starts.',
        example: `on_start = {
    trigger_event = struggle_events.001
}`,
    },
    {
        name: 'on_end',
        type: 'effect',
        description: 'Effects when the struggle ends.',
        example: `on_end = {
    every_player = {
        trigger_event = struggle_events.100
    }
}`,
    },
    {
        name: 'on_phase_change',
        type: 'effect',
        description: 'Effects when the struggle changes phase.',
        example: `on_phase_change = {
    trigger_event = struggle_events.050
}`,
    },
    // AI
    {
        name: 'ai_chance',
        type: 'block',
        description: 'AI evaluation for struggle decisions.',
        example: `ai_chance = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.struggleSchemaMap = new Map(exports.struggleSchema.map((field) => [field.name, field]));
function getStruggleFieldNames() {
    return exports.struggleSchema.map((field) => field.name);
}
function getStruggleFieldDocumentation(fieldName) {
    const field = exports.struggleSchemaMap.get(fieldName);
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
//# sourceMappingURL=struggleSchema.js.map