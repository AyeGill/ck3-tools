"use strict";
/**
 * Schema definition for CK3 Story Cycles - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyCycleSchemaMap = exports.storyCycleSchema = void 0;
exports.getStoryCycleFieldNames = getStoryCycleFieldNames;
exports.getStoryCycleFieldDocumentation = getStoryCycleFieldDocumentation;
exports.storyCycleSchema = [
    // Basic Properties
    {
        name: 'on_setup',
        type: 'effect',
        description: 'Effects when the story cycle is set up.',
        example: `on_setup = {
    save_scope_as = story_owner
    set_variable = {
        name = story_progress
        value = 0
    }
}`,
    },
    {
        name: 'on_end',
        type: 'effect',
        description: 'Effects when the story cycle ends.',
        example: `on_end = {
    remove_variable = story_progress
}`,
    },
    {
        name: 'on_owner_death',
        type: 'effect',
        description: 'Effects when the story owner dies.',
        example: `on_owner_death = {
    end_story = yes
}`,
    },
    // Validity
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the story to remain valid.',
        example: `is_valid = {
    exists = story_owner
    story_owner = { is_alive = yes }
}`,
    },
    // Effects
    {
        name: 'effect_group',
        type: 'block',
        description: 'A group of effects that can trigger.',
        example: `effect_group = {
    days = { 30 60 }
    trigger = {
        story_owner = { is_available = yes }
    }
    effect = {
        trigger_event = story_event.001
    }
}`,
    },
];
// Map for quick lookup
exports.storyCycleSchemaMap = new Map(exports.storyCycleSchema.map((field) => [field.name, field]));
function getStoryCycleFieldNames() {
    return exports.storyCycleSchema.map((field) => field.name);
}
function getStoryCycleFieldDocumentation(fieldName) {
    const field = exports.storyCycleSchemaMap.get(fieldName);
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
//# sourceMappingURL=storyCycleSchema.js.map