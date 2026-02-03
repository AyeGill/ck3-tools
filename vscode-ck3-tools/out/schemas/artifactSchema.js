"use strict";
/**
 * Schema definition for CK3 Artifacts - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifactTemplateSchemaMap = exports.artifactSchemaMap = exports.artifactTemplateSchema = exports.artifactSchema = exports.ARTIFACT_TYPES = exports.ARTIFACT_RARITIES = exports.ARTIFACT_SLOTS = void 0;
exports.getArtifactFieldNames = getArtifactFieldNames;
exports.getArtifactFieldDocumentation = getArtifactFieldDocumentation;
exports.ARTIFACT_SLOTS = [
    'primary_armament',
    'armor',
    'regalia',
    'helmet',
    'miscellaneous',
    // Court artifact slots
    'book',
    'journal',
    'pedestal',
    'sculpture',
    'throne',
    'wall_big',
    'wall_small',
];
exports.ARTIFACT_RARITIES = [
    'common',
    'masterwork',
    'famed',
    'illustrious',
];
exports.ARTIFACT_TYPES = [
    'weapon',
    'armor',
    'regalia',
    'trinket',
    'book',
    'relic',
];
exports.artifactSchema = [
    // Basic Properties
    {
        name: 'slot',
        type: 'enum',
        description: 'The equipment slot this artifact occupies.',
        values: [...exports.ARTIFACT_SLOTS],
        required: true,
        example: 'slot = primary_armament',
    },
    {
        name: 'icon',
        type: 'string',
        description: 'Icon path for the artifact.',
        example: 'icon = "gfx/interface/icons/artifacts/sword.dds"',
    },
    {
        name: 'asset',
        type: 'block',
        description: 'Visual asset for the artifact.',
        example: `asset = {
    type = pdxmesh
    name = "artifact_sword_mesh"
}`,
    },
    {
        name: 'unique',
        type: 'boolean',
        description: 'If yes, only one can exist at a time.',
        default: false,
        example: 'unique = yes',
    },
    // Modifiers
    {
        name: 'court_grandeur_baseline_add',
        type: 'integer',
        description: 'Bonus to court grandeur baseline.',
        example: 'court_grandeur_baseline_add = 5',
    },
    // Triggers
    {
        name: 'can_equip',
        type: 'trigger',
        description: 'Conditions for equipping this artifact.',
        example: `can_equip = {
    is_adult = yes
    NOT = { has_trait = incapable }
}`,
    },
    {
        name: 'can_benefit',
        type: 'trigger',
        description: 'Conditions for gaining benefits from this artifact.',
        example: `can_benefit = {
    is_ruler = yes
}`,
    },
];
// Schema for artifact templates (used for spawning)
exports.artifactTemplateSchema = [
    ...exports.artifactSchema,
];
// Map for quick lookup
exports.artifactSchemaMap = new Map(exports.artifactSchema.map((field) => [field.name, field]));
exports.artifactTemplateSchemaMap = new Map(exports.artifactTemplateSchema.map((field) => [field.name, field]));
// Get all field names for completion
function getArtifactFieldNames() {
    return exports.artifactSchema.map((field) => field.name);
}
// Get documentation for a field
function getArtifactFieldDocumentation(fieldName) {
    const field = exports.artifactSchemaMap.get(fieldName);
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
//# sourceMappingURL=artifactSchema.js.map