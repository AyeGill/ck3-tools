"use strict";
/**
 * Schema definition for CK3 Sound Effects - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.soundEffectSchemaMap = exports.soundEffectSchema = void 0;
exports.getSoundEffectFieldNames = getSoundEffectFieldNames;
exports.getSoundEffectFieldDocumentation = getSoundEffectFieldDocumentation;
exports.soundEffectSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Name identifier for the sound effect.',
        example: 'name = "my_sound_effect"',
    },
    {
        name: 'file',
        type: 'string',
        description: 'Path to the sound file.',
        example: 'file = "sound/sfx/my_sound.wav"',
    },
    // Playback
    {
        name: 'volume',
        type: 'float',
        description: 'Volume level (0.0 to 1.0).',
        example: 'volume = 0.8',
    },
    {
        name: 'playback_rate',
        type: 'float',
        description: 'Playback speed multiplier.',
        example: 'playback_rate = 1.0',
    },
    {
        name: 'max_instances',
        type: 'integer',
        description: 'Maximum simultaneous instances.',
        example: 'max_instances = 3',
    },
    // 3D Sound
    {
        name: 'is_3d',
        type: 'boolean',
        description: 'Whether this is a 3D positional sound.',
        default: false,
        example: 'is_3d = yes',
    },
    {
        name: 'min_distance',
        type: 'float',
        description: 'Minimum distance for 3D sound.',
        example: 'min_distance = 10.0',
    },
    {
        name: 'max_distance',
        type: 'float',
        description: 'Maximum distance for 3D sound.',
        example: 'max_distance = 100.0',
    },
    // Type
    {
        name: 'sound_type',
        type: 'enum',
        description: 'Type of sound effect.',
        values: ['sfx', 'ui', 'ambient', 'voice', 'music'],
        example: 'sound_type = sfx',
    },
    // Random
    {
        name: 'random_sounds',
        type: 'list',
        description: 'List of random sound files to choose from.',
        example: `random_sounds = {
    "sound/sfx/hit_01.wav"
    "sound/sfx/hit_02.wav"
}`,
    },
    // Priority
    {
        name: 'priority',
        type: 'integer',
        description: 'Sound priority for mixing.',
        example: 'priority = 50',
    },
];
// Map for quick lookup
exports.soundEffectSchemaMap = new Map(exports.soundEffectSchema.map((field) => [field.name, field]));
function getSoundEffectFieldNames() {
    return exports.soundEffectSchema.map((field) => field.name);
}
function getSoundEffectFieldDocumentation(fieldName) {
    const field = exports.soundEffectSchemaMap.get(fieldName);
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
//# sourceMappingURL=soundEffectSchema.js.map