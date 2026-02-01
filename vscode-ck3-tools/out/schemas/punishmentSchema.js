"use strict";
/**
 * Schema definition for CK3 Punishments - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.punishmentSchemaMap = exports.punishmentSchema = void 0;
exports.getPunishmentFieldNames = getPunishmentFieldNames;
exports.getPunishmentFieldDocumentation = getPunishmentFieldDocumentation;
exports.punishmentSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the punishment name.',
        example: 'name = "punishment_imprisonment"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "punishment_imprisonment_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this punishment.',
        example: 'icon = "gfx/interface/icons/punishments/imprisonment.dds"',
    },
    // Severity
    {
        name: 'severity',
        type: 'enum',
        description: 'Severity level of the punishment.',
        values: ['minor', 'moderate', 'major', 'severe', 'extreme'],
        example: 'severity = major',
    },
    // Effects
    {
        name: 'on_execute',
        type: 'effect',
        description: 'Effects when punishment is executed.',
        example: `on_execute = {
    imprison = {
        target = scope:recipient
        imprisoner = scope:actor
    }
}`,
    },
    {
        name: 'immediate_effect',
        type: 'effect',
        description: 'Immediate effects.',
        example: `immediate_effect = {
    add_tyranny = 10
}`,
    },
    // Opinion
    {
        name: 'opinion_modifier',
        type: 'string',
        description: 'Opinion modifier to apply.',
        example: 'opinion_modifier = punished_me_opinion',
    },
    {
        name: 'general_opinion',
        type: 'integer',
        description: 'General opinion impact.',
        example: 'general_opinion = -10',
    },
    // Tyranny
    {
        name: 'tyranny',
        type: 'integer',
        description: 'Tyranny gained.',
        example: 'tyranny = 20',
    },
    {
        name: 'legal_tyranny',
        type: 'integer',
        description: 'Tyranny when legally justified.',
        example: 'legal_tyranny = 0',
    },
    // Dread
    {
        name: 'dread',
        type: 'integer',
        description: 'Dread gained.',
        example: 'dread = 15',
    },
    // Piety/Prestige
    {
        name: 'piety_cost',
        type: 'integer',
        description: 'Piety cost.',
        example: 'piety_cost = 50',
    },
    {
        name: 'prestige_cost',
        type: 'integer',
        description: 'Prestige cost.',
        example: 'prestige_cost = 100',
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for punishment availability.',
        example: `potential = {
    is_imprisoned = yes
}`,
    },
    {
        name: 'can_use',
        type: 'trigger',
        description: 'Conditions to use this punishment.',
        example: `can_use = {
    NOT = { has_relation_friend = scope:recipient }
}`,
    },
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions to show this punishment.',
        example: `is_shown = {
    always = yes
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI weight for this punishment.',
        example: `ai_will_do = {
    base = 100
    modifier = {
        add = 50
        has_trait = cruel
    }
}`,
    },
];
// Map for quick lookup
exports.punishmentSchemaMap = new Map(exports.punishmentSchema.map((field) => [field.name, field]));
function getPunishmentFieldNames() {
    return exports.punishmentSchema.map((field) => field.name);
}
function getPunishmentFieldDocumentation(fieldName) {
    const field = exports.punishmentSchemaMap.get(fieldName);
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
//# sourceMappingURL=punishmentSchema.js.map