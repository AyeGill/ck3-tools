"use strict";
/**
 * Schema definition for CK3 Culture Groups - autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cultureGroupSchemaMap = exports.cultureGroupSchema = void 0;
exports.getCultureGroupFieldNames = getCultureGroupFieldNames;
exports.getCultureGroupFieldDocumentation = getCultureGroupFieldDocumentation;
exports.cultureGroupSchema = [
    // Basic Properties
    {
        name: 'name',
        type: 'string',
        description: 'Localization key for the group name.',
        example: 'name = "culture_group_north_germanic"',
    },
    {
        name: 'desc',
        type: 'string',
        description: 'Localization key for the description.',
        example: 'desc = "culture_group_north_germanic_desc"',
    },
    // Color
    {
        name: 'color',
        type: 'block',
        description: 'Color for the culture group on maps.',
        example: 'color = { 0.8 0.4 0.2 }',
    },
    // Graphical Culture
    {
        name: 'graphical_culture',
        type: 'string',
        description: 'Graphical culture for visuals.',
        example: 'graphical_culture = western_gfx',
    },
    // Mercenary Names
    {
        name: 'mercenary_names',
        type: 'list',
        description: 'Names for mercenary companies.',
        example: `mercenary_names = {
    { name = "the_varangian_guard" }
    { name = "the_jomsvikings" }
}`,
    },
    // Male Names
    {
        name: 'male_names',
        type: 'list',
        description: 'Male names for this culture group.',
        example: `male_names = {
    Erik Harald Olaf Sven
}`,
    },
    // Female Names
    {
        name: 'female_names',
        type: 'list',
        description: 'Female names for this culture group.',
        example: `female_names = {
    Astrid Freya Ingrid Sigrid
}`,
    },
    // Dynasty Names
    {
        name: 'dynasty_names',
        type: 'list',
        description: 'Dynasty name patterns.',
        example: `dynasty_names = {
    "af {0}" "von {0}"
}`,
    },
    // Cadet Dynasty Names
    {
        name: 'cadet_dynasty_names',
        type: 'list',
        description: 'Cadet dynasty name patterns.',
        example: `cadet_dynasty_names = {
    "af {0}" "von {0}"
}`,
    },
    // Traditions
    {
        name: 'traditions',
        type: 'list',
        description: 'Default traditions for cultures in this group.',
        example: `traditions = {
    tradition_seafaring
    tradition_warrior_culture
}`,
    },
    // Trigger
    {
        name: 'can_join',
        type: 'trigger',
        description: 'Conditions to join this culture group.',
        example: `can_join = {
    always = yes
}`,
    },
];
// Map for quick lookup
exports.cultureGroupSchemaMap = new Map(exports.cultureGroupSchema.map((field) => [field.name, field]));
function getCultureGroupFieldNames() {
    return exports.cultureGroupSchema.map((field) => field.name);
}
function getCultureGroupFieldDocumentation(fieldName) {
    const field = exports.cultureGroupSchemaMap.get(fieldName);
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
//# sourceMappingURL=cultureGroupSchema.js.map