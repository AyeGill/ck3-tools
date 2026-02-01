"use strict";
/**
 * Schema definition for CK3 Triggered Outfits - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggeredOutfitSchemaMap = exports.triggeredOutfitSchema = void 0;
exports.getTriggeredOutfitFieldNames = getTriggeredOutfitFieldNames;
exports.getTriggeredOutfitFieldDocumentation = getTriggeredOutfitFieldDocumentation;
exports.triggeredOutfitSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name identifier for the triggered outfit.',
        example: 'name = "triggered_outfit_winter"',
    },
    // Outfit
    {
        name: 'outfit',
        type: 'string',
        description: 'Outfit to apply.',
        example: 'outfit = "winter_clothes"',
    },
    {
        name: 'outfit_tags',
        type: 'list',
        description: 'Tags for outfit selection.',
        example: `outfit_tags = {
    winter
    heavy
}`,
    },
    // Trigger
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for this outfit to apply.',
        example: `trigger = {
    location = {
        has_province_modifier = winter_modifier
    }
}`,
    },
    // Priority
    {
        name: 'weight',
        type: 'block',
        description: 'Weight for outfit selection.',
        example: `weight = {
    base = 100
    modifier = {
        add = 50
        has_trait = lifestyle_blademaster
    }
}`,
    },
    {
        name: 'priority',
        type: 'integer',
        description: 'Priority for outfit selection.',
        example: 'priority = 10',
    },
    // Scope
    {
        name: 'scope',
        type: 'enum',
        description: 'Scope where outfit applies.',
        values: ['character', 'portrait', 'court', 'event'],
        example: 'scope = character',
    },
    // Override
    {
        name: 'override_default',
        type: 'boolean',
        description: 'Whether to override default outfit.',
        default: false,
        example: 'override_default = yes',
    },
    // Animation
    {
        name: 'animation',
        type: 'string',
        description: 'Animation to use with outfit.',
        example: 'animation = "idle_warrior"',
    },
    // Color
    {
        name: 'color_override',
        type: 'block',
        description: 'Color overrides for outfit.',
        example: `color_override = {
    primary = { 0.5 0.5 0.5 }
}`,
    },
];
// Map for quick lookup
exports.triggeredOutfitSchemaMap = new Map(exports.triggeredOutfitSchema.map((field) => [field.name, field]));
function getTriggeredOutfitFieldNames() {
    return exports.triggeredOutfitSchema.map((field) => field.name);
}
function getTriggeredOutfitFieldDocumentation(fieldName) {
    const field = exports.triggeredOutfitSchemaMap.get(fieldName);
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
//# sourceMappingURL=triggeredOutfitSchema.js.map