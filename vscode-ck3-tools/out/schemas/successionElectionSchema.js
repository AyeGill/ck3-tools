"use strict";
/**
 * Schema definition for CK3 Succession Election - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.successionElectionSchemaMap = exports.successionElectionSchema = void 0;
exports.getSuccessionElectionFieldNames = getSuccessionElectionFieldNames;
exports.getSuccessionElectionFieldDocumentation = getSuccessionElectionFieldDocumentation;
exports.successionElectionSchema = [
    // Basic Properties
    {
        name: 'candidates',
        type: 'block',
        description: 'Define who can be candidates in the election.',
        example: `candidates = {
    add = {
        type = holder_direct_vassal
        limit = {
            is_landed = yes
        }
    }
}`,
    },
    {
        name: 'electors',
        type: 'block',
        description: 'Define who can vote in the election.',
        example: `electors = {
    add = {
        type = holder_direct_vassal
        limit = {
            highest_held_title_tier >= tier_county
        }
    }
}`,
    },
    // Candidate Score
    {
        name: 'candidate_score',
        type: 'block',
        description: 'Score calculation for candidates.',
        example: `candidate_score = {
    base = 100
    modifier = {
        add = 50
        is_primary_heir_of = scope:holder
    }
}`,
    },
    // Elector Vote Strength
    {
        name: 'elector_vote_strength',
        type: 'block',
        description: 'Vote strength calculation for electors.',
        example: `elector_vote_strength = {
    base = 1
    modifier = {
        add = 1
        highest_held_title_tier >= tier_duchy
    }
}`,
    },
    // Validity
    {
        name: 'is_valid',
        type: 'trigger',
        description: 'Conditions for this election type to be valid.',
        example: `is_valid = {
    scope:holder = { has_government = feudal_government }
}`,
    },
    // Holder vote
    {
        name: 'holder_vote_strength',
        type: 'block',
        description: 'Vote strength of the title holder.',
        example: `holder_vote_strength = {
    base = 3
}`,
    },
];
// Map for quick lookup
exports.successionElectionSchemaMap = new Map(exports.successionElectionSchema.map((field) => [field.name, field]));
function getSuccessionElectionFieldNames() {
    return exports.successionElectionSchema.map((field) => field.name);
}
function getSuccessionElectionFieldDocumentation(fieldName) {
    const field = exports.successionElectionSchemaMap.get(fieldName);
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
//# sourceMappingURL=successionElectionSchema.js.map