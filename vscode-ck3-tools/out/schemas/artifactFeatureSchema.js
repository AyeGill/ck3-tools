"use strict";
/**
 * Schema definition for CK3 Artifact Features - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.artifactFeatureSchemaMap = exports.artifactFeatureSchema = void 0;
exports.getArtifactFeatureFieldNames = getArtifactFeatureFieldNames;
exports.getArtifactFeatureFieldDocumentation = getArtifactFeatureFieldDocumentation;
exports.artifactFeatureSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the feature name.',
        example: 'name = "artifact_feature_jeweled"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "artifact_feature_jeweled_desc"',
    },
    // Icon
    {
        name: 'icon',
        type: 'string',
        description: 'Icon for this feature.',
        example: 'icon = "gfx/interface/icons/artifact_features/jeweled.dds"',
    },
    // Type
    {
        name: 'type',
        type: 'enum',
        description: 'Type of artifact feature.',
        values: ['visual', 'modifier', 'quality', 'material', 'enchantment'],
        example: 'type = visual',
    },
    // Modifiers
    {
        name: 'modifier',
        type: 'block',
        description: 'Modifiers from this feature.',
        example: `modifier = {
    monthly_prestige = 0.5
    diplomacy = 1
}`,
    },
    // Value
    {
        name: 'wealth_bonus',
        type: 'integer',
        description: 'Bonus to artifact wealth.',
        example: 'wealth_bonus = 10',
    },
    {
        name: 'quality_bonus',
        type: 'integer',
        description: 'Bonus to artifact quality.',
        example: 'quality_bonus = 1',
    },
    // Visual
    {
        name: 'visual_effect',
        type: 'string',
        description: 'Visual effect to apply.',
        example: 'visual_effect = "glow_golden"',
    },
    {
        name: 'color',
        type: 'block',
        description: 'Color modification.',
        example: `color = {
    0.8 0.6 0.2
}`,
    },
    // Rarity
    {
        name: 'rarity_weight',
        type: 'block',
        description: 'Weight by rarity.',
        example: `rarity_weight = {
    common = 100
    masterwork = 50
    famed = 25
    illustrious = 10
}`,
    },
    // Slot Compatibility
    {
        name: 'valid_slots',
        type: 'list',
        description: 'Valid artifact slots.',
        example: `valid_slots = {
    primary_armament
    regalia
}`,
    },
    // Trigger
    {
        name: 'potential',
        type: 'trigger',
        description: 'Conditions for feature availability.',
        example: `potential = {
    artifact_rarity >= masterwork
}`,
    },
    // AI
    {
        name: 'ai_value',
        type: 'block',
        description: 'AI value for this feature.',
        example: `ai_value = {
    base = 100
}`,
    },
];
// Map for quick lookup
exports.artifactFeatureSchemaMap = new Map(exports.artifactFeatureSchema.map((field) => [field.name, field]));
function getArtifactFeatureFieldNames() {
    return exports.artifactFeatureSchema.map((field) => field.name);
}
function getArtifactFeatureFieldDocumentation(fieldName) {
    const field = exports.artifactFeatureSchemaMap.get(fieldName);
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
//# sourceMappingURL=artifactFeatureSchema.js.map