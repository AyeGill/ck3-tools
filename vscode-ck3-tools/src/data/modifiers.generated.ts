/**
 * CK3 Modifier Definitions (Auto-generated)
 *
 * Modifiers are static bonuses that can be applied to characters, provinces, or counties.
 * Each modifier has a list of use areas where it can be applied.
 *
 * Source: OldEnt repository (version 1.10.2)
 */

export type ModifierCategory = 'character' | 'province' | 'county' | 'scheme' | 'travel' | 'culture' | 'faith';

export interface ModifierDefinition {
  name: string;
  description?: string;
  categories: ModifierCategory[];
}

// Import the raw parsed data and filter it
import modifiersData from './parser/modifiers.json';

/**
 * Process raw modifier data, filtering out templates
 */
function processModifiers(): ModifierDefinition[] {
  const result: ModifierDefinition[] = [];

  for (const mod of modifiersData as { name: string; useAreas: string[] }[]) {
    // Skip template modifiers (contain $)
    if (mod.name.includes('$')) continue;

    // Map use areas to categories
    const categories: ModifierCategory[] = mod.useAreas.map(area => {
      const lower = area.toLowerCase();
      if (lower === 'character') return 'character';
      if (lower === 'province') return 'province';
      if (lower === 'county') return 'county';
      if (lower === 'scheme') return 'scheme';
      if (lower === 'travel') return 'travel';
      if (lower === 'culture') return 'culture';
      if (lower === 'faith') return 'faith';
      return 'character'; // Default
    }) as ModifierCategory[];

    result.push({
      name: mod.name,
      categories: [...new Set(categories)], // Dedupe
    });
  }

  return result;
}

export const allModifiers = processModifiers();

/**
 * Get modifiers for a specific category (e.g., 'character' for traits)
 */
export function getModifiersForCategory(category: ModifierCategory): ModifierDefinition[] {
  return allModifiers.filter(m => m.categories.includes(category));
}

/**
 * Character modifiers (used in traits, character_modifier blocks, etc.)
 */
export const characterModifiers = getModifiersForCategory('character');

/**
 * Province modifiers (used in province_modifier blocks)
 */
export const provinceModifiers = getModifiersForCategory('province');

/**
 * County modifiers (used in county_modifier blocks)
 */
export const countyModifiers = getModifiersForCategory('county');

/**
 * Map for quick lookup
 */
export const modifiersMap = new Map<string, ModifierDefinition>(
  allModifiers.map(m => [m.name, m])
);
