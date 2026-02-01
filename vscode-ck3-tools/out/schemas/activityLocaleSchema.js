"use strict";
/**
 * Schema definition for CK3 Activity Locales - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityLocaleSchemaMap = exports.activityLocaleSchema = void 0;
exports.getActivityLocaleFieldNames = getActivityLocaleFieldNames;
exports.getActivityLocaleFieldDocumentation = getActivityLocaleFieldDocumentation;
exports.activityLocaleSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the locale name.',
        example: 'name = "activity_locale_castle"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the locale description.',
        example: 'desc = "activity_locale_castle_desc"',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the locale.',
        example: 'icon = "gfx/interface/icons/activity_locales/castle.dds"',
    },
    // Background
    {
        name: 'background',
        type: 'string',
        description: 'Background image for the locale.',
        example: 'background = "gfx/interface/illustrations/activity_locales/castle_bg.dds"',
    },
    // Trigger
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for this locale to be available.',
        example: `is_valid = {
    scope:host = {
        any_held_title = {
            tier >= tier_county
        }
    }
}`,
    },
    {
        name: 'is_shown',
        type: 'trigger',
        description: 'Conditions for showing this locale.',
        example: `is_shown = {
    always = yes
}`,
    },
    // Weight
    {
        name: 'weight',
        type: 'block',
        description: 'Selection weight for this locale.',
        example: `weight = {
    base = 100
    modifier = {
        add = 50
        scope:host = { has_trait = gregarious }
    }
}`,
    },
    // Modifiers
    {
        name: 'modifier',
        type: 'block',
        description: 'Modifiers while using this locale.',
        example: `modifier = {
    activity_opinion = 10
}`,
    },
    // On Actions
    {
        name: 'on_select',
        type: 'effect',
        description: 'Effects when this locale is selected.',
        example: `on_select = {
    add_prestige = 50
}`,
    },
];
// Map for quick lookup
exports.activityLocaleSchemaMap = new Map(exports.activityLocaleSchema.map((field) => [field.name, field]));
function getActivityLocaleFieldNames() {
    return exports.activityLocaleSchema.map((field) => field.name);
}
function getActivityLocaleFieldDocumentation(fieldName) {
    const field = exports.activityLocaleSchemaMap.get(fieldName);
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
//# sourceMappingURL=activityLocaleSchema.js.map