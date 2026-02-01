"use strict";
/**
 * Schema definition for CK3 Loading Tips - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingTipSchemaMap = exports.loadingTipSchema = void 0;
exports.getLoadingTipFieldNames = getLoadingTipFieldNames;
exports.getLoadingTipFieldDocumentation = getLoadingTipFieldDocumentation;
exports.loadingTipSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the loading tip.',
        example: 'name = "loading_tip_warfare"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the tip description.',
        example: 'desc = "loading_tip_warfare_desc"',
    },
    // Category
    {
        name: 'category',
        type: 'enum',
        description: 'Category of the tip.',
        values: ['gameplay', 'warfare', 'intrigue', 'diplomacy', 'dynasty', 'religion', 'culture', 'economy', 'hint'],
        example: 'category = warfare',
    },
    // Conditions
    {
        name: 'trigger',
        type: 'trigger',
        description: 'Conditions for showing this tip.',
        example: `trigger = {
    has_dlc = "Royal Court"
}`,
    },
    // Weight
    {
        name: 'weight',
        type: 'block',
        description: 'Weight for random selection.',
        example: `weight = {
    base = 10
    modifier = {
        add = 5
        is_at_war = yes
    }
}`,
    },
    // Priority
    {
        name: 'priority',
        type: 'integer',
        description: 'Display priority.',
        example: 'priority = 100',
    },
    // DLC
    {
        name: 'dlc',
        type: 'string',
        description: 'Required DLC for this tip.',
        example: 'dlc = "Royal Court"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the tip.',
        example: 'icon = "gfx/interface/icons/tips/warfare.dds"',
    },
];
// Map for quick lookup
exports.loadingTipSchemaMap = new Map(exports.loadingTipSchema.map((field) => [field.name, field]));
function getLoadingTipFieldNames() {
    return exports.loadingTipSchema.map((field) => field.name);
}
function getLoadingTipFieldDocumentation(fieldName) {
    const field = exports.loadingTipSchemaMap.get(fieldName);
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
//# sourceMappingURL=loadingTipSchema.js.map