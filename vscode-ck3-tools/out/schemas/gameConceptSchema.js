"use strict";
/**
 * Schema definition for CK3 Game Concepts - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameConceptSchemaMap = exports.gameConceptSchema = void 0;
exports.getGameConceptFieldNames = getGameConceptFieldNames;
exports.getGameConceptFieldDocumentation = getGameConceptFieldDocumentation;
exports.gameConceptSchema = [
    // Basic Properties
    {
        name: 'alias',
        type: 'list',
        description: 'Alternative names that link to this concept.',
        example: `alias = {
    "gold"
    "wealth"
    "money"
}`,
    },
    {
        name: 'parent',
        type: 'string',
        description: 'Parent concept for hierarchical organization.',
        example: 'parent = "resources"',
    },
    {
        name: 'texture',
        type: 'string',
        description: 'Icon texture for the concept.',
        example: 'texture = "gfx/interface/icons/game_concepts/gold.dds"',
    },
    {
        name: 'framesize',
        type: 'block',
        description: 'Frame size for the icon.',
        example: 'framesize = { 60 60 }',
    },
    {
        name: 'frame',
        type: 'integer',
        description: 'Frame index in the texture.',
        example: 'frame = 1',
    },
    // Requires DLC
    {
        name: 'requires_dlc_flag',
        type: 'string',
        description: 'DLC flag required for this concept.',
        example: 'requires_dlc_flag = "royal_court"',
    },
    // Not Shown
    {
        name: 'not_shown_in_encyclopedia',
        type: 'boolean',
        description: 'Hide from the encyclopedia.',
        default: false,
        example: 'not_shown_in_encyclopedia = yes',
    },
];
// Map for quick lookup
exports.gameConceptSchemaMap = new Map(exports.gameConceptSchema.map((field) => [field.name, field]));
function getGameConceptFieldNames() {
    return exports.gameConceptSchema.map((field) => field.name);
}
function getGameConceptFieldDocumentation(fieldName) {
    const field = exports.gameConceptSchemaMap.get(fieldName);
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
//# sourceMappingURL=gameConceptSchema.js.map