"use strict";
/**
 * Schema definition for CK3 Nicknames - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.nicknameSchemaMap = exports.nicknameSchema = void 0;
exports.getNicknameFieldNames = getNicknameFieldNames;
exports.getNicknameFieldDocumentation = getNicknameFieldDocumentation;
exports.nicknameSchema = [
    // Basic Properties
    {
        name: 'is_prefix',
        type: 'boolean',
        description: 'Whether the nickname appears before the name.',
        default: false,
        example: 'is_prefix = yes',
    },
    {
        name: 'is_bad',
        type: 'boolean',
        description: 'Whether this is a negative/shameful nickname.',
        default: false,
        example: 'is_bad = yes',
    },
    // Conditions
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the nickname to be valid.',
        example: `is_valid = {
    martial >= 15
    has_trait = brave
}`,
    },
    // AI
    {
        name: 'ai_will_give',
        type: 'trigger',
        description: 'AI conditions to give this nickname.',
        example: `ai_will_give = {
    prestige >= 2000
    has_trait = brave
}`,
    },
    {
        name: 'weight',
        type: 'block',
        description: 'Weight calculation for nickname selection.',
        example: `weight = {
    base = 100
    modifier = {
        add = 50
        martial >= 20
    }
}`,
    },
];
// Map for quick lookup
exports.nicknameSchemaMap = new Map(exports.nicknameSchema.map((field) => [field.name, field]));
function getNicknameFieldNames() {
    return exports.nicknameSchema.map((field) => field.name);
}
function getNicknameFieldDocumentation(fieldName) {
    const field = exports.nicknameSchemaMap.get(fieldName);
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
//# sourceMappingURL=nicknameSchema.js.map