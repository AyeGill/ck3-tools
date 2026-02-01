"use strict";
/**
 * Schema definition for CK3 Bookmark Portraits - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkPortraitSchemaMap = exports.bookmarkPortraitSchema = void 0;
exports.getBookmarkPortraitFieldNames = getBookmarkPortraitFieldNames;
exports.getBookmarkPortraitFieldDocumentation = getBookmarkPortraitFieldDocumentation;
exports.bookmarkPortraitSchema = [
    // Basic Properties
    {
        name: 'character',
        type: 'integer',
        description: 'Character ID for the portrait.',
        example: 'character = 12345',
    },
    {
        name: 'title',
        type: 'string',
        description: 'Title for display.',
        example: 'title = k_england',
    },
    // Position
    {
        name: 'position',
        type: 'block',
        description: 'Position of the portrait on the map.',
        example: 'position = { 650 350 }',
    },
    // Animation
    {
        name: 'animation',
        type: 'enum',
        description: 'Animation for the portrait.',
        values: ['idle', 'personality_bold', 'personality_content', 'happiness', 'anger'],
        example: 'animation = personality_bold',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of bookmark portrait.',
        values: ['bookmark_playable_character', 'bookmark_suggested_character'],
        example: 'type = bookmark_playable_character',
    },
    // Name
    {
        name: 'name',
        type: 'string',
        description: 'Display name localization key.',
        example: 'name = "CHARACTER_NAME_KEY"',
    },
    // Government
    {
        name: 'government',
        type: 'string',
        description: 'Government type for this character.',
        example: 'government = feudal_government',
    },
    // Difficulty
    {
        name: 'difficulty',
        type: 'enum',
        description: 'Difficulty rating for this character.',
        values: ['easy', 'medium', 'hard', 'very_hard'],
        example: 'difficulty = medium',
    },
];
// Map for quick lookup
exports.bookmarkPortraitSchemaMap = new Map(exports.bookmarkPortraitSchema.map((field) => [field.name, field]));
function getBookmarkPortraitFieldNames() {
    return exports.bookmarkPortraitSchema.map((field) => field.name);
}
function getBookmarkPortraitFieldDocumentation(fieldName) {
    const field = exports.bookmarkPortraitSchemaMap.get(fieldName);
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
//# sourceMappingURL=bookmarkPortraitSchema.js.map