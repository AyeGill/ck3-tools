"use strict";
/**
 * Schema definition for CK3 Hook Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookSchemaMap = exports.hookSchema = void 0;
exports.getHookFieldNames = getHookFieldNames;
exports.getHookFieldDocumentation = getHookFieldDocumentation;
exports.hookSchema = [
    // Basic Properties
    {
        name: 'strong',
        type: 'boolean',
        description: 'Whether this is a strong hook. If no/absent, it is a weak hook.',
        default: false,
        example: 'strong = yes',
    },
    {
        name: 'duration',
        type: 'block',
        description: 'Duration of the hook.',
        example: `duration = {
    years = 10
}`,
    },
    {
        name: 'decay_rate',
        type: 'float',
        description: 'Rate at which the hook decays.',
        example: 'decay_rate = 0.1',
    },
    // Interaction modifiers
    {
        name: 'acceptance_bonus',
        type: 'integer',
        description: 'Bonus to interaction acceptance when using hook.',
        example: 'acceptance_bonus = 50',
    },
    {
        name: 'interaction_use_cost',
        type: 'block',
        description: 'Cost to use the hook in an interaction.',
        example: `interaction_use_cost = {
    prestige = 50
}`,
    },
    // Conditions
    {
        name: 'can_be_used_in_interactions',
        type: 'trigger',
        description: 'Conditions for using in interactions.',
        example: `can_be_used_in_interactions = {
    scope:hook_target = { is_imprisoned = no }
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the hook to remain valid.',
        example: `is_valid = {
    scope:hook_owner = { is_alive = yes }
    scope:hook_target = { is_alive = yes }
}`,
    },
    // Effects
    {
        name: 'on_use',
        type: 'effect',
        description: 'Effects when the hook is used.',
        example: `on_use = {
    scope:hook_target = {
        add_opinion = {
            target = scope:hook_owner
            modifier = used_hook_opinion
        }
    }
}`,
    },
    {
        name: 'on_expire',
        type: 'effect',
        description: 'Effects when the hook expires.',
        example: 'on_expire = { }',
    },
    {
        name: 'on_invalidated',
        type: 'effect',
        description: 'Effects when the hook becomes invalid.',
        example: 'on_invalidated = { }',
    },
    // Special
    {
        name: 'requires_secret',
        type: 'boolean',
        description: 'Whether the hook requires a secret.',
        default: false,
        example: 'requires_secret = yes',
    },
    {
        name: 'is_permanent',
        type: 'boolean',
        description: 'Whether the hook is permanent.',
        default: false,
        example: 'is_permanent = no',
    },
    {
        name: 'can_be_extended',
        type: 'boolean',
        description: 'Whether duration can be extended.',
        default: true,
        example: 'can_be_extended = yes',
    },
];
// Map for quick lookup
exports.hookSchemaMap = new Map(exports.hookSchema.map((field) => [field.name, field]));
function getHookFieldNames() {
    return exports.hookSchema.map((field) => field.name);
}
function getHookFieldDocumentation(fieldName) {
    const field = exports.hookSchemaMap.get(fieldName);
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
//# sourceMappingURL=hookSchema.js.map