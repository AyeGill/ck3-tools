"use strict";
/**
 * Schema definition for CK3 Execution Methods - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.executionMethodSchemaMap = exports.executionMethodSchema = void 0;
exports.getExecutionMethodFieldNames = getExecutionMethodFieldNames;
exports.getExecutionMethodFieldDocumentation = getExecutionMethodFieldDocumentation;
exports.executionMethodSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the method name.',
        example: 'name = "execution_method_beheading"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "execution_method_beheading_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this method.',
        example: 'icon = "gfx/interface/icons/execution/beheading.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of execution.',
        values: ['honorable', 'cruel', 'religious', 'traditional', 'unique'],
        example: 'type = honorable',
    },
    // Effects
    {
        name: 'on_execute',
        type: 'effect',
        description: 'Effects when execution occurs.',
        example: `on_execute = {
    add_dread = 10
}`,
    },
    // Opinion
    {
        name: 'general_opinion',
        type: 'integer',
        description: 'General opinion modifier.',
        example: 'general_opinion = -10',
    },
    {
        name: 'clergy_opinion',
        type: 'integer',
        description: 'Clergy opinion modifier.',
        example: 'clergy_opinion = -5',
    },
    {
        name: 'dynasty_opinion',
        type: 'integer',
        description: 'Dynasty opinion modifier.',
        example: 'dynasty_opinion = -20',
    },
    // Dread
    {
        name: 'dread_gain',
        type: 'integer',
        description: 'Dread gained from execution.',
        example: 'dread_gain = 15',
    },
    // Piety
    {
        name: 'piety_cost',
        type: 'integer',
        description: 'Piety cost.',
        example: 'piety_cost = 50',
    },
    {
        name: 'piety_gain',
        type: 'integer',
        description: 'Piety gained.',
        example: 'piety_gain = 25',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for method availability.',
        example: `potential = {
    has_trait = sadistic
}`,
    },
    {
        name: 'can_use',
        type: 'trigger',
        description: 'Conditions to use this method.',
        example: `can_use = {
    prestige >= 100
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for using this method.',
        example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        has_trait = cruel
    }
}`,
    },
    // Animation
    {
        name: 'animation',
        type: 'string',
        description: 'Animation to play.',
        example: 'animation = "execution_beheading"',
    },
];
// Map for quick lookup
exports.executionMethodSchemaMap = new Map(exports.executionMethodSchema.map((field) => [field.name, field]));
function getExecutionMethodFieldNames() {
    return exports.executionMethodSchema.map((field) => field.name);
}
function getExecutionMethodFieldDocumentation(fieldName) {
    const field = exports.executionMethodSchemaMap.get(fieldName);
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
//# sourceMappingURL=executionMethodSchema.js.map