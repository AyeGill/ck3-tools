/**
 * CK3 Scope Type Definitions
 *
 * Scopes represent the context in which effects and triggers operate.
 * Different effects/triggers are valid in different scope contexts.
 */

export type ScopeType =
  | 'none'              // Global/any scope (no specific context required)
  | 'character'
  | 'landed_title'
  | 'province'
  | 'combat'
  | 'combat_side'
  | 'faith'
  | 'religion'          // Religion family (parent of faiths)
  | 'dynasty'
  | 'dynasty_house'     // Cadet branches
  | 'faction'
  | 'culture'
  | 'culture_group'
  | 'culture_pillar'    // Heritage, language, etc.
  | 'culture_tradition' // Cultural traditions
  | 'army'
  | 'regiment'          // Part of an army
  | 'holy_order'
  | 'mercenary_company'
  | 'artifact'
  | 'inspiration'
  | 'scheme'
  | 'secret'
  | 'story'             // Story cycles
  | 'war'
  | 'casus_belli'
  | 'activity'
  | 'activity_type'     // Activity type definition
  | 'travel_plan'
  | 'council_task'
  | 'great_holy_war'
  | 'ghw'               // Alias for great holy war
  | 'struggle'
  | 'legend'
  | 'legend_seed'
  | 'accolade'
  | 'accolade_type'
  | 'epidemic'
  | 'geographical_region'
  | 'trait'                   // Trait scope (for trait-targeting effects)
  | 'character_memory'        // Memory scope
  | 'decision'                // Decision scope
  | 'doctrine'                // Faith doctrine scope
  | 'government_type'         // Government type scope
  | 'vassal_contract'         // Feudal contract scope
  | 'title_and_vassal_change';// Title transfer change scope

/**
 * Common scope aliases used in documentation
 */
export const SCOPE_ALIASES: Record<string, ScopeType> = {
  'title': 'landed_title',
  'county': 'landed_title',
  'duchy': 'landed_title',
  'kingdom': 'landed_title',
  'empire': 'landed_title',
  'house': 'dynasty_house',
};

/**
 * Parse a scope string from documentation into a ScopeType
 */
export function parseScope(scopeStr: string): ScopeType {
  const normalized = scopeStr.toLowerCase().trim();

  // Check aliases first
  if (SCOPE_ALIASES[normalized]) {
    return SCOPE_ALIASES[normalized];
  }

  // Direct match
  return normalized as ScopeType;
}

/**
 * Parse a comma-separated list of scopes
 */
export function parseScopes(scopesStr: string): ScopeType[] {
  return scopesStr
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(parseScope);
}

/**
 * Check if a scope is valid for a given list of supported scopes
 */
export function isScopeValid(currentScope: ScopeType, supportedScopes: ScopeType[]): boolean {
  // 'none' means any scope is valid
  if (supportedScopes.includes('none')) {
    return true;
  }
  return supportedScopes.includes(currentScope);
}
