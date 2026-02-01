"use strict";
/**
 * Schema definition for CK3 Lease Contracts - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaseContractSchemaMap = exports.leaseContractSchema = void 0;
exports.getLeaseContractFieldNames = getLeaseContractFieldNames;
exports.getLeaseContractFieldDocumentation = getLeaseContractFieldDocumentation;
exports.leaseContractSchema = [
    // Basic Properties
    {
        name: 'lease_type',
        type: 'enum',
        description: 'Type of lease.',
        values: ['county', 'barony', 'building'],
        example: 'lease_type = county',
    },
    {
        name: 'duration',
        type: 'block',
        description: 'Duration of the lease.',
        example: `duration = {
    years = 10
}`,
    },
    // Cost
    {
        name: 'initial_cost',
        type: 'block',
        description: 'Initial cost for the lease.',
        example: `initial_cost = {
    gold = 200
}`,
    },
    {
        name: 'yearly_cost',
        type: 'block',
        description: 'Yearly payment for the lease.',
        example: `yearly_cost = {
    gold = 20
}`,
    },
    // Requirements
    {
        name: 'can_lease',
        type: 'trigger',
        description: 'Conditions for leasing.',
        example: `can_lease = {
    gold >= 200
    NOT = { is_at_war = yes }
}`,
    },
    {
        name: 'lessee_requirements',
        type: 'trigger',
        description: 'Requirements for the lessee.',
        example: `lessee_requirements = {
    is_ruler = no
    is_landed = no
}`,
    },
    // Effects
    {
        name: 'on_lease_start',
        type: 'effect',
        description: 'Effects when the lease starts.',
        example: `on_lease_start = {
    add_gold = -200
}`,
    },
    {
        name: 'on_lease_end',
        type: 'effect',
        description: 'Effects when the lease ends.',
        example: `on_lease_end = {
    trigger_event = lease_events.001
}`,
    },
    {
        name: 'on_lease_break',
        type: 'effect',
        description: 'Effects when the lease is broken.',
        example: `on_lease_break = {
    add_opinion = {
        target = scope:lessor
        modifier = broke_lease_opinion
    }
}`,
    },
    // Modifiers
    {
        name: 'lessee_modifier',
        type: 'block',
        description: 'Modifiers applied to the lessee.',
        example: `lessee_modifier = {
    monthly_income = 5
}`,
    },
    {
        name: 'lessor_modifier',
        type: 'block',
        description: 'Modifiers applied to the lessor.',
        example: `lessor_modifier = {
    monthly_income = -2
}`,
    },
    // AI
    {
        name: 'ai_will_do',
        type: 'block',
        description: 'AI likelihood to accept this lease.',
        example: `ai_will_do = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.leaseContractSchemaMap = new Map(exports.leaseContractSchema.map((field) => [field.name, field]));
function getLeaseContractFieldNames() {
    return exports.leaseContractSchema.map((field) => field.name);
}
function getLeaseContractFieldDocumentation(fieldName) {
    const field = exports.leaseContractSchemaMap.get(fieldName);
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
//# sourceMappingURL=leaseContractSchema.js.map