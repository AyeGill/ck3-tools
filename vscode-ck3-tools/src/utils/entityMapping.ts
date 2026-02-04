/**
 * Shared mapping from effect/trigger supportedTargets values to EntityType
 * Used by both diagnostics (validation) and completion providers
 */

import { EntityType } from '../providers/workspaceIndex';

/**
 * Mapping from effect/trigger supportedTargets values to EntityType
 * Only includes target types that we can actually validate against the workspace index
 */
export const TARGET_TO_ENTITY_TYPE: Partial<Record<string, EntityType>> = {
  // Core scripting
  'scripted_effect': 'scripted_effect',
  'scripted_trigger': 'scripted_trigger',
  'scripted_modifier': 'scripted_modifier',
  // Character-related
  'trait': 'trait',
  'secret': 'secret_type',
  'scheme': 'scheme',
  // Events and decisions
  'event': 'event',
  'decision': 'decision',
  // Activities
  'activity': 'activity',
  'activity_type': 'activity', // Same as activity
  // Culture
  'culture': 'culture',
  'culture_tradition': 'culture_tradition',
  'culture_innovation': 'culture_innovation',
  'culture_pillar': 'culture_pillar',
  // Religion
  // Note: doctrine is excluded because doctrines are nested inside religion files
  // and can't be easily indexed with our simple top-level parser
  // Titles and holdings
  'landed_title': 'landed_title',
  'holding_type': 'holding_type',
  'government_type': 'government_type',
  // Dynasties
  'dynasty': 'dynasty',
  'dynasty_house': 'dynasty_house',
  // War
  'casus_belli_type': 'casus_belli_type',
  'faction': 'faction',
  // DLC features
  'legend': 'legend',
  'legend_type': 'legend', // Same folder
  'inspiration': 'inspiration',
  'struggle': 'struggle',
  'epidemic': 'epidemic',
  'epidemic_type': 'epidemic', // Same folder
  'great_project': 'great_project',
  'great_project_type': 'great_project', // Same folder
  'accolade': 'accolade_type',
  'accolade_type': 'accolade_type',
  'situation': 'situation',
  'story': 'story_cycle',
  'court_position_type': 'court_position_type',
  'artifact': 'artifact',
};
