"use strict";
/**
 * Schema definition for CK3 Trigger Locales - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerLocaleSchemaMap = exports.triggerLocaleSchema = void 0;
exports.getTriggerLocaleFieldNames = getTriggerLocaleFieldNames;
exports.getTriggerLocaleFieldDocumentation = getTriggerLocaleFieldDocumentation;
exports.triggerLocaleSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the trigger locale name.',
        example: 'name = "trigger_locale_name"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the trigger locale description.',
        example: 'desc = "trigger_locale_desc"',
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'The trigger condition to check.',
        example: `trigger = {
    is_ruler = yes
    gold >= 100
}`,
    },
    // Localization
    {
        name: 'text',
        type: 'string',
        description: 'Text to display when trigger is true.',
        example: 'text = "TRIGGER_TRUE_TEXT"',
    },
    {
        name: 'fail_text',
        type: 'string',
        description: 'Text to display when trigger is false.',
        example: 'fail_text = "TRIGGER_FALSE_TEXT"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of trigger locale.',
        values: ['generic', 'character', 'title', 'province', 'war', 'artifact'],
        example: 'type = character',
    },
    // Context
    {
        name: 'root_scope',
        type: 'string',
        description: 'The root scope for this trigger locale.',
        example: 'root_scope = character',
    },
    // Formatting
    {
        name: 'format',
        type: 'string',
        description: 'Format string for display.',
        example: 'format = "requirement"',
    },
];
// Map for quick lookup
exports.triggerLocaleSchemaMap = new Map(exports.triggerLocaleSchema.map((field) => [field.name, field]));
function getTriggerLocaleFieldNames() {
    return exports.triggerLocaleSchema.map((field) => field.name);
}
function getTriggerLocaleFieldDocumentation(fieldName) {
    const field = exports.triggerLocaleSchemaMap.get(fieldName);
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
//# sourceMappingURL=triggerLocaleSchema.js.map