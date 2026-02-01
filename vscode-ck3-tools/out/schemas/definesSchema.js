"use strict";
/**
 * Schema definition for CK3 Defines - powers autocomplete and hover documentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.definesSchemaMap = exports.definesSchema = void 0;
exports.getDefinesFieldNames = getDefinesFieldNames;
exports.getDefinesFieldDocumentation = getDefinesFieldDocumentation;
exports.definesSchema = [
    // Common Define Categories
    {
        name: 'NGame',
        type: 'block',
        description: 'Game-related defines.',
        example: `NGame = {
    START_DATE = "867.1.1"
    END_DATE = "1453.1.1"
}`,
    },
    {
        name: 'NCharacter',
        type: 'block',
        description: 'Character-related defines.',
        example: `NCharacter = {
    BASE_FERTILITY = 0.5
    MAX_AGE = 100
}`,
    },
    {
        name: 'NAI',
        type: 'block',
        description: 'AI behavior defines.',
        example: `NAI = {
    WAR_ACCEPTION_THRESHOLD = 50
}`,
    },
    {
        name: 'NEconomy',
        type: 'block',
        description: 'Economy-related defines.',
        example: `NEconomy = {
    BASE_TAX_INCOME = 1.0
}`,
    },
    {
        name: 'NMilitary',
        type: 'block',
        description: 'Military-related defines.',
        example: `NMilitary = {
    BASE_LEVY_SIZE = 100
}`,
    },
    {
        name: 'NDiplomacy',
        type: 'block',
        description: 'Diplomacy-related defines.',
        example: `NDiplomacy = {
    ALLIANCE_BREAK_PRESTIGE_COST = 100
}`,
    },
    {
        name: 'NReligion',
        type: 'block',
        description: 'Religion-related defines.',
        example: `NReligion = {
    BASE_PIETY_GAIN = 1.0
}`,
    },
    {
        name: 'NCulture',
        type: 'block',
        description: 'Culture-related defines.',
        example: `NCulture = {
    TRADITION_COST_BASE = 1000
}`,
    },
    {
        name: 'NTitle',
        type: 'block',
        description: 'Title-related defines.',
        example: `NTitle = {
    EMPEROR_TITLE_PRESTIGE = 5.0
}`,
    },
    {
        name: 'NCourtScene',
        type: 'block',
        description: 'Court scene defines.',
        example: `NCourtScene = {
    MAX_GUESTS = 20
}`,
    },
    {
        name: 'NGraphics',
        type: 'block',
        description: 'Graphics-related defines.',
        example: `NGraphics = {
    PORTRAIT_RENDER_WIDTH = 512
}`,
    },
    {
        name: 'NInterface',
        type: 'block',
        description: 'Interface-related defines.',
        example: `NInterface = {
    TOOLTIP_DELAY = 0.5
}`,
    },
];
// Map for quick lookup
exports.definesSchemaMap = new Map(exports.definesSchema.map((field) => [field.name, field]));
function getDefinesFieldNames() {
    return exports.definesSchema.map((field) => field.name);
}
function getDefinesFieldDocumentation(fieldName) {
    const field = exports.definesSchemaMap.get(fieldName);
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
//# sourceMappingURL=definesSchema.js.map