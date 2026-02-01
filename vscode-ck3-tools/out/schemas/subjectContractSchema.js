"use strict";
/**
 * Schema definition for CK3 Subject Contracts - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectContractSchemaMap = exports.subjectContractSchema = void 0;
exports.getSubjectContractFieldNames = getSubjectContractFieldNames;
exports.getSubjectContractFieldDocumentation = getSubjectContractFieldDocumentation;
exports.subjectContractSchema = [
    // Basic Properties
    {
        name: 'contract_type',
        type: 'string',
        description: 'Type of subject contract.',
        example: 'contract_type = "tributary"',
    },
    // Obligations
    {
        name: 'tax_obligation',
        type: 'block',
        description: 'Tax obligation level.',
        example: `tax_obligation = {
    level_1 = {
        contribution = 0.1
        opinion = -5
    }
    level_2 = {
        contribution = 0.2
        opinion = -10
    }
}`,
    },
    {
        name: 'levy_obligation',
        type: 'block',
        description: 'Levy obligation level.',
        example: `levy_obligation = {
    level_1 = {
        contribution = 0.1
        opinion = -5
    }
}`,
    },
    // Special terms
    {
        name: 'special_contract_terms',
        type: 'list',
        description: 'Special contract terms available.',
        example: `special_contract_terms = {
    forced_partition
    guaranteed_council_seat
}`,
    },
    // Requirements
    {
        name: 'can_change',
        type: 'trigger',
        description: 'Conditions for changing the contract.',
        example: `can_change = {
    has_hook = scope:vassal
}`,
    },
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for the contract to be valid.',
        example: `is_valid = {
    is_vassal_of = scope:liege
}`,
    },
    // Modifiers
    {
        name: 'liege_modifier',
        type: 'block',
        description: 'Modifiers applied to the liege.',
        example: `liege_modifier = {
    monthly_income = 10
}`,
    },
    {
        name: 'vassal_modifier',
        type: 'block',
        description: 'Modifiers applied to the vassal.',
        example: `vassal_modifier = {
    monthly_income = -5
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to accept changes.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.subjectContractSchemaMap = new Map(exports.subjectContractSchema.map((field) => [field.name, field]));
function getSubjectContractFieldNames() {
    return exports.subjectContractSchema.map((field) => field.name);
}
function getSubjectContractFieldDocumentation(fieldName) {
    const field = exports.subjectContractSchemaMap.get(fieldName);
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
//# sourceMappingURL=subjectContractSchema.js.map