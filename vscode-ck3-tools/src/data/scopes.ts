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
  | 'culture_innovation' // Cultural innovations
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
  | 'casus_belli_type'  // CB type definition
  | 'activity'
  | 'activity_type'     // Activity type definition
  | 'travel_plan'
  | 'council_task'
  | 'great_holy_war'
  | 'ghw'               // Alias for great holy war
  | 'struggle'
  | 'legend'
  | 'legend_seed'
  | 'legend_type'       // Legend type definition
  | 'accolade'
  | 'accolade_type'
  | 'epidemic'
  | 'epidemic_type'     // Epidemic type definition
  | 'geographical_region'
  | 'trait'                   // Trait scope (for trait-targeting effects)
  | 'character_memory'        // Memory scope
  | 'decision'                // Decision scope
  | 'doctrine'                // Faith doctrine scope
  | 'government_type'         // Government type scope
  | 'vassal_contract'         // Feudal contract scope
  | 'title_and_vassal_change' // Title transfer change scope
  // Roads to Power DLC scopes
  | 'task_contract'           // Task contracts
  | 'task_contract_type'      // Task contract type definition
  | 'situation'               // Situations (administrative)
  | 'situation_sub_region'    // Situation sub-regions
  | 'situation_participant_group' // Situation participant groups
  | 'tax_slot'                // Tax slot scope
  | 'domicile'                // Domicile scope
  | 'domicile_type'           // Domicile type definition
  | 'great_project'           // Great projects
  | 'great_project_type'      // Great project type definition
  | 'confederation'           // Confederation scope
  | 'confederation_type'      // Confederation type definition
  | 'house_relation'          // Dynasty house relations
  | 'house_relation_type'     // House relation type
  | 'house_relation_level'    // House relation level
  | 'house_aspiration'        // House aspiration scope
  | 'agent_slot'              // Agent slot in schemes
  | 'court_position_type'     // Court position type definition
  | 'holding_type'            // Holding type definition
  | 'project_contribution';   // Great project contribution scope

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
