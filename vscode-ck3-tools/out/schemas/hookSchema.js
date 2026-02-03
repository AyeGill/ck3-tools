"use strict";
/**
 * Schema definition for CK3 Hook Types - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hookSchemaMap = exports.hookSchema = void 0;
exports.getHookFieldNames = getHookFieldNames;
exports.getHookFieldDocumentation = getHookFieldDocumentation;
exports.hookSchema = [
    {
        name: 'strong',
        type: 'boolean',
        description: 'Whether this is a strong hook. Strong hooks can force acceptance of interactions. If no/absent, it is a weak hook.',
        default: false,
        example: 'strong = yes',
    },
    {
        name: 'expiration_days',
        type: 'integer',
        description: 'Number of days until the hook expires. Use -1 for no expiration.',
        example: 'expiration_days = 3650',
    },
    {
        name: 'perpetual',
        type: 'boolean',
        description: 'Whether the hook is perpetual (never expires).',
        default: false,
        example: 'perpetual = yes',
    },
    {
        name: 'requires_secret',
        type: 'boolean',
        description: 'Whether this hook type requires an associated secret (for blackmail hooks).',
        default: false,
        example: 'requires_secret = yes',
    },
    {
        name: 'on_used',
        type: 'effect',
        description: 'Effects when the hook is used. Scope: character using the hook. scope:target is the hook target.',
        example: `on_used = {
    send_interface_toast = {
        type = event_toast_effect_bad
        title = on_hook_used.tt.best_friend_stress
        left_icon = scope:target
        add_stress = major_stress_gain
    }
}`,
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