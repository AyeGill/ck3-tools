"use strict";
/**
 * Schema definition for CK3 Scripted Triggers - powers autocomplete and hover documentation
 *
 * Scripted triggers are reusable condition blocks that can be checked from other scripts.
 * They return true/false and are defined in common/scripted_triggers/
 *
 * Note: Any valid trigger from the triggers database is allowed in a scripted trigger.
 * The wildcard entry below tells the completion/validation system to accept all triggers.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scriptedTriggerSchemaMap = exports.scriptedTriggerSchema = void 0;
exports.hasWildcard = hasWildcard;
exports.getScriptedTriggerFieldNames = getScriptedTriggerFieldNames;
exports.getScriptedTriggerFieldDocumentation = getScriptedTriggerFieldDocumentation;
// Schema for scripted triggers
// The wildcard entry means any trigger is valid at top level
exports.scriptedTriggerSchema = [
    // Wildcard: any trigger is valid in a scripted trigger
    {
        name: '*',
        type: 'trigger',
        isWildcard: true,
        description: 'Any valid trigger can be used in a scripted trigger.',
    },
    // Structural fields that may not be in the triggers database
    {
        name: 'custom_tooltip',
        type: 'block',
        description: 'Wrap triggers with a custom tooltip.',
        example: `custom_tooltip = {
    text = my_custom_tooltip_key
    has_trait = brave
}`,
    },
];
// Map for quick lookup
exports.scriptedTriggerSchemaMap = new Map(exports.scriptedTriggerSchema.filter(f => !f.isWildcard).map((field) => [field.name, field]));
/**
 * Check if the schema has a wildcard entry of a given type
 */
function hasWildcard(schema, type) {
    return schema.some(f => f.isWildcard && f.type === type);
}
// Get all field names for completion (non-wildcard only, triggers come from data)
function getScriptedTriggerFieldNames() {
    return exports.scriptedTriggerSchema.filter(f => !f.isWildcard).map((field) => field.name);
}
// Get documentation for a field
function getScriptedTriggerFieldDocumentation(fieldName) {
    const field = exports.scriptedTriggerSchemaMap.get(fieldName);
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
//# sourceMappingURL=scriptedTriggersSchema.js.map