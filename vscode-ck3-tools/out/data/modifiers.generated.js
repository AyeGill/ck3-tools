"use strict";
/**
 * CK3 Modifier Definitions (Auto-generated)
 *
 * Modifiers are static bonuses that can be applied to characters, provinces, or counties.
 * Each modifier has a list of use areas where it can be applied.
 *
 * Source: OldEnt repository (version 1.10.2)
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifiersMap = exports.countyModifiers = exports.provinceModifiers = exports.characterModifiers = exports.allModifiers = void 0;
exports.getModifiersForCategory = getModifiersForCategory;
// Import the raw parsed data and filter it
const modifiers_json_1 = __importDefault(require("./parser/modifiers.json"));
/**
 * Process raw modifier data, filtering out templates
 */
function processModifiers() {
    const result = [];
    for (const mod of modifiers_json_1.default) {
        // Skip template modifiers (contain $)
        if (mod.name.includes('$'))
            continue;
        // Map use areas to categories
        const categories = mod.useAreas.map(area => {
            const lower = area.toLowerCase();
            if (lower === 'character')
                return 'character';
            if (lower === 'province')
                return 'province';
            if (lower === 'county')
                return 'county';
            if (lower === 'scheme')
                return 'scheme';
            if (lower === 'travel')
                return 'travel';
            if (lower === 'culture')
                return 'culture';
            if (lower === 'faith')
                return 'faith';
            return 'character'; // Default
        });
        result.push({
            name: mod.name,
            categories: [...new Set(categories)], // Dedupe
        });
    }
    return result;
}
exports.allModifiers = processModifiers();
/**
 * Get modifiers for a specific category (e.g., 'character' for traits)
 */
function getModifiersForCategory(category) {
    return exports.allModifiers.filter(m => m.categories.includes(category));
}
/**
 * Character modifiers (used in traits, character_modifier blocks, etc.)
 */
exports.characterModifiers = getModifiersForCategory('character');
/**
 * Province modifiers (used in province_modifier blocks)
 */
exports.provinceModifiers = getModifiersForCategory('province');
/**
 * County modifiers (used in county_modifier blocks)
 */
exports.countyModifiers = getModifiersForCategory('county');
/**
 * Map for quick lookup
 */
exports.modifiersMap = new Map(exports.allModifiers.map(m => [m.name, m]));
//# sourceMappingURL=modifiers.generated.js.map