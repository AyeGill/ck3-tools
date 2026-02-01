"use strict";
/**
 * Schema definition for CK3 Opinion Modifiers - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.opinionModifierSchemaMap = exports.opinionModifierSchema = void 0;
exports.getOpinionModifierFieldNames = getOpinionModifierFieldNames;
exports.getOpinionModifierFieldDocumentation = getOpinionModifierFieldDocumentation;
exports.opinionModifierSchema = [
    // Basic Properties
    {
        name: 'opinion',
        type: 'integer',
        description: 'The opinion value (positive or negative).',
        required: true,
        example: 'opinion = 20',
    },
    {
        name: 'decaying',
        type: 'boolean',
        description: 'Whether the modifier decays over time.',
        default: false,
        example: 'decaying = yes',
    },
    {
        name: 'decay',
        type: 'float',
        description: 'Rate of decay per year (if decaying).',
        example: 'decay = 1.0',
    },
    {
        name: 'years',
        type: 'integer',
        description: 'Duration in years (if not permanent).',
        example: 'years = 10',
    },
    {
        name: 'months',
        type: 'integer',
        description: 'Duration in months (if not permanent).',
        example: 'months = 6',
    },
    {
        name: 'days',
        type: 'integer',
        description: 'Duration in days (if not permanent).',
        example: 'days = 30',
    },
    // Stacking
    {
        name: 'stacking',
        type: 'boolean',
        description: 'Whether multiple instances can stack.',
        default: false,
        example: 'stacking = yes',
    },
    {
        name: 'non_extendable',
        type: 'boolean',
        description: 'Whether duration cannot be extended.',
        default: false,
        example: 'non_extendable = yes',
    },
    // Inheritance
    {
        name: 'inherit',
        type: 'boolean',
        description: 'Whether the modifier is inherited on death.',
        default: false,
        example: 'inherit = yes',
    },
    {
        name: 'enemy_inherit',
        type: 'boolean',
        description: 'Whether enemies inherit this modifier.',
        default: false,
        example: 'enemy_inherit = no',
    },
    // Crime
    {
        name: 'crime',
        type: 'boolean',
        description: 'Whether this modifier represents a crime.',
        default: false,
        example: 'crime = yes',
    },
    // Prison
    {
        name: 'prison_reason',
        type: 'boolean',
        description: 'Whether this gives a valid imprisonment reason.',
        default: false,
        example: 'prison_reason = yes',
    },
    {
        name: 'execute_reason',
        type: 'boolean',
        description: 'Whether this gives a valid execution reason.',
        default: false,
        example: 'execute_reason = yes',
    },
    {
        name: 'revoke_reason',
        type: 'boolean',
        description: 'Whether this gives a valid title revocation reason.',
        default: false,
        example: 'revoke_reason = yes',
    },
    {
        name: 'divorce_reason',
        type: 'boolean',
        description: 'Whether this gives a valid divorce reason.',
        default: false,
        example: 'divorce_reason = yes',
    },
];
// Map for quick lookup
exports.opinionModifierSchemaMap = new Map(exports.opinionModifierSchema.map((field) => [field.name, field]));
function getOpinionModifierFieldNames() {
    return exports.opinionModifierSchema.map((field) => field.name);
}
function getOpinionModifierFieldDocumentation(fieldName) {
    const field = exports.opinionModifierSchemaMap.get(fieldName);
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
//# sourceMappingURL=opinionModifierSchema.js.map