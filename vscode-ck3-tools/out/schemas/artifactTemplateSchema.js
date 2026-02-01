"use strict";
/**
 * Schema definition for CK3 Artifact Templates - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifactTemplateSchemaMap = exports.artifactTemplateSchema = void 0;
exports.getArtifactTemplateFieldNames = getArtifactTemplateFieldNames;
exports.getArtifactTemplateFieldDocumentation = getArtifactTemplateFieldDocumentation;
exports.artifactTemplateSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the artifact name.',
        example: 'name = "artifact_sword_name"',
    },
    {
        name: 'description',
        type: 'string',
        description: 'Localization key for the artifact description.',
        example: 'description = "artifact_sword_desc"',
    },
    // Visual
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for the artifact.',
        example: 'icon = "gfx/interface/icons/artifacts/sword.dds"',
    },
    {
        name: 'asset',
        type: 'string',
        description: '3D asset for the artifact.',
        example: 'asset = "artifact_sword_mesh"',
    },
    // Rarity
    {
        name: 'rarity',
        type: 'enum',
        description: 'Rarity tier of the artifact.',
        values: ['common', 'masterwork', 'famed', 'illustrious'],
        example: 'rarity = famed',
    },
    // Slot
    {
        name: 'slot',
        type: 'enum',
        description: 'Equipment slot for the artifact.',
        values: ['primary_armament', 'armor', 'regalia', 'helmet', 'miscellaneous'],
        example: 'slot = primary_armament',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of artifact.',
        values: ['weapon', 'armor', 'regalia', 'trinket', 'book', 'religious'],
        example: 'type = weapon',
    },
    // Modifiers
    {
        name: 'modifier',
        type: 'block',
        description: 'Modifiers applied when equipped.',
        example: `modifier = {
    martial = 2
    prowess = 5
    monthly_prestige = 0.5
}`,
    },
    // Durability
    {
        name: 'max_durability',
        type: 'integer',
        description: 'Maximum durability of the artifact.',
        example: 'max_durability = 100',
    },
    {
        name: 'starting_durability',
        type: 'integer',
        description: 'Starting durability of the artifact.',
        example: 'starting_durability = 100',
    },
    {
        name: 'decay',
        type: 'float',
        description: 'Yearly durability decay rate.',
        example: 'decay = 0.1',
    },
    // Requirements
    {
        name: 'can_equip',
        type: 'trigger',
        description: 'Conditions to equip this artifact.',
        example: `can_equip = {
    is_adult = yes
}`,
    },
    {
        name: 'can_benefit',
        type: 'trigger',
        description: 'Conditions to benefit from this artifact.',
        example: `can_benefit = {
    is_ruler = yes
}`,
    },
    // Features
    {
        name: 'features',
        type: 'list',
        description: 'List of artifact features.',
        example: `features = {
    sharp_blade
    jeweled_hilt
}`,
    },
    // Unique
    {
        name: 'unique',
        type: 'boolean',
        description: 'Whether this is a unique artifact.',
        default: false,
        example: 'unique = yes',
    },
    // Wealth
    {
        name: 'wealth',
        type: 'integer',
        description: 'Wealth value of the artifact.',
        example: 'wealth = 50',
    },
    // Quality
    {
        name: 'quality',
        type: 'integer',
        description: 'Quality level of the artifact.',
        example: 'quality = 3',
    },
];
// Map for quick lookup
exports.artifactTemplateSchemaMap = new Map(exports.artifactTemplateSchema.map((field) => [field.name, field]));
function getArtifactTemplateFieldNames() {
    return exports.artifactTemplateSchema.map((field) => field.name);
}
function getArtifactTemplateFieldDocumentation(fieldName) {
    const field = exports.artifactTemplateSchemaMap.get(fieldName);
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
//# sourceMappingURL=artifactTemplateSchema.js.map