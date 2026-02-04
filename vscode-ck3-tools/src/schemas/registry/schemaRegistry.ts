/**
 * Unified Schema Registry
 *
 * This module provides a centralized registry for mapping file paths to their
 * corresponding schemas. It replaces the three separate implementations that
 * existed in CompletionProvider, DiagnosticsProvider, and HoverProvider.
 *
 * Key features:
 * - Pattern-based file type detection
 * - Derives schemaMap from schema array (with caching)
 * - Supports context-aware schema selection for nested blocks
 */

import { FieldSchema, SchemaRegistryEntry, SchemaLookupResult } from './types';

// Import all schemas (arrays, not maps - maps are derived)
import { traitSchema } from '../traitSchema';
import { eventSchema, eventOptionSchema, portraitBlockSchema } from '../eventSchema';
import { decisionSchema, costBlockSchema } from '../decisionSchema';
import { interactionSchema } from '../interactionSchema';
import { buildingSchema } from '../buildingSchema';
import { onActionSchema } from '../onActionSchema';
import { schemeSchema } from '../schemeSchema';
import { menAtArmsSchema } from '../menAtArmsSchema';
import { casusBelliSchema } from '../casusBelliSchema';
import { cultureSchema, traditionSchema } from '../cultureSchema';
import { faithSchema, religionSchema } from '../faithSchema';
import { scriptedEffectSchema } from '../scriptedEffectsSchema';
import { scriptedTriggerSchema } from '../scriptedTriggersSchema';
import { artifactSchema } from '../artifactSchema';
import { courtPositionSchema } from '../courtPositionSchema';
import { lifestyleSchema, focusSchema, perkSchema } from '../lifestyleSchema';
import { dynastyLegacySchema } from '../dynastyLegacySchema';
import { modifierSchema } from '../modifierSchema';
import { lawSchema } from '../lawSchema';
import { governmentSchema } from '../governmentSchema';
import { factionSchema } from '../factionSchema';
import { councilTaskSchema } from '../councilTaskSchema';
import { opinionModifierSchema } from '../opinionModifierSchema';
import { secretSchema } from '../secretSchema';
import { nicknameSchema } from '../nicknameSchema';
import { scriptValueSchema } from '../scriptValueSchema';
import { hookSchema } from '../hookSchema';
import { activitySchema } from '../activitySchema';
import { gameRuleSchema } from '../gameRuleSchema';
import { bookmarkSchema } from '../bookmarkSchema';
import { storyCycleSchema } from '../storyCycleSchema';
import { importantActionSchema } from '../importantActionSchema';
import { vassalContractSchema } from '../vassalContractSchema';
import { landedTitleSchema } from '../landedTitleSchema';
import { coatOfArmsSchema } from '../coatOfArmsSchema';
import { innovationSchema } from '../innovationSchema';
import { doctrineSchema } from '../doctrineSchema';
import { holySiteSchema } from '../holySiteSchema';
import { holdingSchema } from '../holdingSchema';
import { dynastySchema } from '../dynastySchema';
import { characterHistorySchema } from '../characterHistorySchema';
import { terrainSchema } from '../terrainSchema';
import { scriptedGuiSchema } from '../scriptedGuiSchema';
import { customLocalizationSchema } from '../customLocalizationSchema';
import { flavorizationSchema } from '../flavorizationSchema';
import { deathreasonsSchema } from '../deathreasonsSchema';
import { successionElectionSchema } from '../successionElectionSchema';
import { scriptedRelationSchema } from '../scriptedRelationSchema';
import { namedColorsSchema } from '../namedColorsSchema';
import { eventBackgroundSchema } from '../eventBackgroundSchema';
import { poolSelectorSchema } from '../poolSelectorSchema';
import { scriptedModifierSchema } from '../scriptedModifierSchema';
import { scriptedRulesSchema } from '../scriptedRulesSchema';
import { gameConceptSchema } from '../gameConceptSchema';
import { messageSchema } from '../messageSchema';
import { scriptedListSchema } from '../scriptedListSchema';
import { titleHistorySchema } from '../titleHistorySchema';
import { accoladeTypeSchema } from '../accoladeTypeSchema';
import { characterMemorySchema } from '../characterMemorySchema';
import { courtAmenitySchema } from '../courtAmenitySchema';
import { dynastyHouseSchema } from '../dynastyHouseSchema';
import { legendSchema } from '../legendSchema';
import { travelSchema } from '../travelSchema';
import { struggleSchema } from '../struggleSchema';
import { inspirationSchema } from '../inspirationSchema';
import { diarchySchema } from '../diarchySchema';
import { domicileSchema } from '../domicileSchema';
import { greatProjectSchema } from '../greatProjectSchema';
import { epidemicSchema } from '../epidemicSchema';
import { houseUnitySchema } from '../houseUnitySchema';
import { legitimacySchema } from '../legitimacySchema';
import { taxSlotSchema } from '../taxSlotSchema';
import { vassalStanceSchema } from '../vassalStanceSchema';
import { suggestionSchema } from '../suggestionSchema';
import { scriptedCostSchema } from '../scriptedCostSchema';
import { scriptedAnimationSchema } from '../scriptedAnimationSchema';
import { scriptedCharacterTemplateSchema } from '../scriptedCharacterTemplateSchema';
import { eventThemeSchema } from '../eventThemeSchema';
import { casusBelliGroupSchema } from '../casusBelliGroupSchema';
import { aiWarStanceSchema } from '../aiWarStanceSchema';
import { combatPhaseEventSchema } from '../combatPhaseEventSchema';
import { bookmarkPortraitSchema } from '../bookmarkPortraitSchema';
import { guestSystemSchema } from '../guestSystemSchema';
import { courtierGuestManagementSchema } from '../courtierGuestManagementSchema';
import { taskContractSchema } from '../taskContractSchema';
import { subjectContractSchema } from '../subjectContractSchema';
import { leaseContractSchema } from '../leaseContractSchema';
import { characterBackgroundSchema } from '../characterBackgroundSchema';
import { dnaDataSchema } from '../dnaDataSchema';
import { portraitModifierSchema } from '../portraitModifierSchema';
import { nicknameRuleSchema } from '../nicknameRuleSchema';
import { successionLawSchema } from '../successionLawSchema';
import { warGoalSchema } from '../warGoalSchema';
import { scriptedIllustrationSchema } from '../scriptedIllustrationSchema';
import { mapModeSchema } from '../mapModeSchema';
import { provinceHistorySchema } from '../provinceHistorySchema';
import { regionSchema } from '../regionSchema';
import { scriptedScoreValueSchema } from '../scriptedScoreValueSchema';
import { aiPersonalitySchema } from '../aiPersonalitySchema';
import { definesSchema } from '../definesSchema';
import { scriptedLocValueSchema } from '../scriptedLocValueSchema';
import { interactionCategorySchema } from '../interactionCategorySchema';
import { countyCultureSchema } from '../countyCultureSchema';
import { playableDifficultySchema } from '../playableDifficultySchema';
import { provinceSetupSchema } from '../provinceSetupSchema';
import { scriptedSpawnSchema } from '../scriptedSpawnSchema';
import { courtPositionCategorySchema } from '../courtPositionCategorySchema';
import { activityLocaleSchema } from '../activityLocaleSchema';
import { cultureEraSchema } from '../cultureEraSchema';
import { nameListSchema } from '../nameListSchema';
import { relationFlagSchema } from '../relationFlagSchema';
import { terrainTypeSchema } from '../terrainTypeSchema';
import { holdingTypeSchema } from '../holdingTypeSchema';
import { menAtArmsTypeSchema } from '../menAtArmsTypeSchema';
import { combatPhaseSchema } from '../combatPhaseSchema';
import { inspirationTypeSchema } from '../inspirationTypeSchema';
import { courtTypeSchema } from '../courtTypeSchema';
import { culturePillarSchema } from '../culturePillarSchema';
import { heritageSchema } from '../heritageSchema';
import { languageSchema } from '../languageSchema';
import { martialCustomSchema } from '../martialCustomSchema';
import { ethosSchema } from '../ethosSchema';
import { scriptedGfxSchema } from '../scriptedGfxSchema';
import { gameStartSchema } from '../gameStartSchema';
import { characterTemplateSchema } from '../characterTemplateSchema';
import { triggerLocaleSchema } from '../triggerLocaleSchema';
import { effectLocaleSchema } from '../effectLocaleSchema';
import { musicSchema } from '../musicSchema';
import { soundEffectSchema } from '../soundEffectSchema';
import { portraitCameraSchema } from '../portraitCameraSchema';
import { geneSchema } from '../geneSchema';
import { accessorySchema } from '../accessorySchema';
import { coaTemplateSchema } from '../coaTemplateSchema';
import { achievementSchema } from '../achievementSchema';
import { scriptedTestSchema } from '../scriptedTestSchema';
import { tutorialSchema } from '../tutorialSchema';
import { mapObjectSchema } from '../mapObjectSchema';
import { loadingTipSchema } from '../loadingTipSchema';
import { guiTypeSchema } from '../guiTypeSchema';
import { localizationSchema } from '../localizationSchema';
import { regimentSchema } from '../regimentSchema';
import { titleColorSchema } from '../titleColorSchema';
import { characterInteractionCategorySchema } from '../characterInteractionCategorySchema';
import { dlcFeatureSchema } from '../dlcFeatureSchema';
import { aiBudgetSchema } from '../aiBudgetSchema';
import { specialBuildingSchema } from '../specialBuildingSchema';
import { triggeredTextSchema } from '../triggeredTextSchema';
import { poolGenerationRuleSchema } from '../poolGenerationRuleSchema';
import { aiTaskSchema } from '../aiTaskSchema';
import { artifactTemplateSchema } from '../artifactTemplateSchema';
import { coaPatternSchema } from '../coaPatternSchema';
import { coaEmblemSchema } from '../coaEmblemSchema';
import { cultureNameListSchema } from '../cultureNameListSchema';
import { artifactVisualSchema } from '../artifactVisualSchema';
import { artifactRaritySchema } from '../artifactRaritySchema';
import { climateSchema } from '../climateSchema';
import { terrainModifierSchema } from '../terrainModifierSchema';
import { successionVotingSchema } from '../successionVotingSchema';
import { characterFlagSchema } from '../characterFlagSchema';
import { titleFlagSchema } from '../titleFlagSchema';
import { provinceModifierSchema } from '../provinceModifierSchema';
import { lifestylePerkTreeSchema } from '../lifestylePerkTreeSchema';
import { buildingSlotSchema } from '../buildingSlotSchema';
import { artifactSlotSchema } from '../artifactSlotSchema';
import { mercenaryCompanySchema } from '../mercenaryCompanySchema';
import { holyOrderSchema } from '../holyOrderSchema';
import { warContributionSchema } from '../warContributionSchema';
import { armyTemplateSchema } from '../armyTemplateSchema';
import { combatEffectSchema } from '../combatEffectSchema';
import { vassalObligationSchema } from '../vassalObligationSchema';
import { triggeredOutfitSchema } from '../triggeredOutfitSchema';
import { portraitTypeSchema } from '../portraitTypeSchema';
import { courtGrandeurLevelSchema } from '../courtGrandeurLevelSchema';
import { amenityLevelSchema } from '../amenityLevelSchema';
import { artifactFeatureSchema } from '../artifactFeatureSchema';
import { executionMethodSchema } from '../executionMethodSchema';
import { punishmentSchema } from '../punishmentSchema';

/**
 * Schema registry entries - maps file path patterns to schemas.
 * Patterns are checked in order, so more specific patterns come first.
 */
const SCHEMA_ENTRIES: SchemaRegistryEntry[] = [
  // Events (before /common/ patterns)
  {
    fileType: 'event',
    patterns: ['/events/'],
    schema: eventSchema,
    initialScope: 'character',
    getSchemaForContext: (blockPath) => {
      const lastBlock = blockPath[blockPath.length - 1];
      if (lastBlock === 'option') {
        return eventOptionSchema;
      }
      if (['left_portrait', 'right_portrait', 'center_portrait', 'lower_left_portrait', 'lower_center_portrait', 'lower_right_portrait'].includes(lastBlock)) {
        return portraitBlockSchema;
      }
      return eventSchema;
    },
  },

  // History files
  { fileType: 'character_history', patterns: ['/history/characters/'], schema: characterHistorySchema, initialScope: 'character' },
  { fileType: 'title_history', patterns: ['/history/titles/'], schema: titleHistorySchema, initialScope: 'landed_title' },
  { fileType: 'province_history', patterns: ['/history/provinces/'], schema: provinceHistorySchema, initialScope: 'province' },

  // Map data
  { fileType: 'region', patterns: ['/map_data/regions/'], schema: regionSchema },
  { fileType: 'map_object', patterns: ['/map_data/'], schema: mapObjectSchema },

  // GFX patterns (before /common/)
  { fileType: 'portrait_modifier', patterns: ['/gfx/portraits/portrait_modifiers/'], schema: portraitModifierSchema },
  { fileType: 'scripted_illustration', patterns: ['/gfx/portraits/scripted_illustrations/'], schema: scriptedIllustrationSchema },
  { fileType: 'portrait_camera', patterns: ['/gfx/portraits/cameras/'], schema: portraitCameraSchema },
  { fileType: 'gene', patterns: ['/gfx/portraits/genes/'], schema: geneSchema },
  { fileType: 'accessory', patterns: ['/gfx/portraits/accessories/'], schema: accessorySchema },
  { fileType: 'scripted_gfx', patterns: ['/gfx/scripted/'], schema: scriptedGfxSchema },

  // Coat of arms (specific before general)
  { fileType: 'coa_pattern', patterns: ['/coat_of_arms/patterns/'], schema: coaPatternSchema },
  { fileType: 'coa_emblem', patterns: ['/coat_of_arms/emblems/'], schema: coaEmblemSchema },
  { fileType: 'coa_template', patterns: ['/common/coat_of_arms/templates/'], schema: coaTemplateSchema },
  { fileType: 'coat_of_arms', patterns: ['/common/coat_of_arms/colors/', '/common/coat_of_arms/'], schema: coatOfArmsSchema },

  // Culture subfolders (specific before general)
  { fileType: 'culture', patterns: ['/common/culture/cultures/'], schema: cultureSchema },
  { fileType: 'tradition', patterns: ['/common/culture/traditions/'], schema: traditionSchema },
  { fileType: 'innovation', patterns: ['/common/culture/innovations/'], schema: innovationSchema },
  { fileType: 'culture_era', patterns: ['/common/culture/eras/'], schema: cultureEraSchema },
  { fileType: 'name_list', patterns: ['/common/culture/name_lists/'], schema: nameListSchema },
  { fileType: 'culture_pillar', patterns: ['/common/culture/pillars/'], schema: culturePillarSchema },
  { fileType: 'heritage', patterns: ['/common/culture/heritage/'], schema: heritageSchema },
  { fileType: 'language', patterns: ['/common/culture/languages/'], schema: languageSchema },
  { fileType: 'martial_custom', patterns: ['/common/culture/martial_customs/'], schema: martialCustomSchema },
  { fileType: 'ethos', patterns: ['/common/culture/ethos/'], schema: ethosSchema },

  // Religion subfolders (specific before general)
  {
    fileType: 'religion',
    patterns: ['/common/religion/religions/'],
    schema: religionSchema,
    getSchemaForContext: (blockPath) => {
      // Inside faiths block, use faith schema
      if (blockPath.includes('faiths')) {
        return faithSchema;
      }
      return religionSchema;
    },
  },
  { fileType: 'doctrine', patterns: ['/common/religion/doctrines/'], schema: doctrineSchema },
  { fileType: 'holy_site', patterns: ['/common/religion/holy_sites/'], schema: holySiteSchema },

  // Men at arms (specific before general)
  { fileType: 'men_at_arms_type', patterns: ['/common/men_at_arms_types/definitions/'], schema: menAtArmsTypeSchema },
  { fileType: 'men_at_arms', patterns: ['/common/men_at_arms_types/'], schema: menAtArmsSchema },

  // All other /common/ patterns (alphabetical order)
  { fileType: 'achievement', patterns: ['/common/achievements/'], schema: achievementSchema },
  { fileType: 'accolade_type', patterns: ['/common/accolade_types/'], schema: accoladeTypeSchema },
  { fileType: 'activity', patterns: ['/common/activities/'], schema: activitySchema },
  { fileType: 'activity_locale', patterns: ['/common/activity_locales/'], schema: activityLocaleSchema },
  { fileType: 'ai_budget', patterns: ['/common/ai_budgets/'], schema: aiBudgetSchema },
  { fileType: 'ai_personality', patterns: ['/common/ai_personalities/'], schema: aiPersonalitySchema },
  { fileType: 'ai_task', patterns: ['/common/ai_tasks/'], schema: aiTaskSchema },
  { fileType: 'ai_war_stance', patterns: ['/common/ai_war_stances/'], schema: aiWarStanceSchema },
  { fileType: 'amenity_level', patterns: ['/common/amenity_levels/'], schema: amenityLevelSchema },
  { fileType: 'army_template', patterns: ['/common/army_templates/'], schema: armyTemplateSchema },
  { fileType: 'artifact_feature', patterns: ['/common/artifact_features/'], schema: artifactFeatureSchema },
  { fileType: 'artifact_rarity', patterns: ['/common/artifact_rarities/'], schema: artifactRaritySchema },
  { fileType: 'artifact_slot', patterns: ['/common/artifact_slots/'], schema: artifactSlotSchema },
  { fileType: 'artifact_template', patterns: ['/common/artifact_templates/'], schema: artifactTemplateSchema },
  { fileType: 'artifact_visual', patterns: ['/common/artifact_visuals/'], schema: artifactVisualSchema },
  { fileType: 'artifact', patterns: ['/common/artifacts/'], schema: artifactSchema },
  { fileType: 'bookmark_portrait', patterns: ['/common/bookmark_portraits/'], schema: bookmarkPortraitSchema },
  { fileType: 'bookmark', patterns: ['/common/bookmarks/'], schema: bookmarkSchema },
  { fileType: 'building_slot', patterns: ['/common/building_slots/'], schema: buildingSlotSchema },
  { fileType: 'building', patterns: ['/common/buildings/'], schema: buildingSchema },
  { fileType: 'casus_belli_group', patterns: ['/common/casus_belli_groups/'], schema: casusBelliGroupSchema },
  { fileType: 'casus_belli', patterns: ['/common/casus_belli_types/'], schema: casusBelliSchema },
  { fileType: 'character_background', patterns: ['/common/character_backgrounds/'], schema: characterBackgroundSchema },
  { fileType: 'character_flag', patterns: ['/common/character_flags/'], schema: characterFlagSchema },
  { fileType: 'character_interaction_category', patterns: ['/common/character_interaction_categories/'], schema: characterInteractionCategorySchema },
  { fileType: 'interaction', patterns: ['/common/character_interactions/'], schema: interactionSchema, initialScope: 'character' },
  { fileType: 'character_memory', patterns: ['/common/character_memory_types/'], schema: characterMemorySchema },
  { fileType: 'character_template', patterns: ['/common/character_templates/'], schema: characterTemplateSchema },
  { fileType: 'climate', patterns: ['/common/climate/'], schema: climateSchema },
  { fileType: 'combat_effect', patterns: ['/common/combat_effects/'], schema: combatEffectSchema },
  { fileType: 'combat_phase_event', patterns: ['/common/combat_phase_events/'], schema: combatPhaseEventSchema },
  { fileType: 'combat_phase', patterns: ['/common/combat_phase_types/'], schema: combatPhaseSchema },
  { fileType: 'council_task', patterns: ['/common/council_tasks/'], schema: councilTaskSchema },
  { fileType: 'county_culture', patterns: ['/common/county_culture/'], schema: countyCultureSchema },
  { fileType: 'court_amenity', patterns: ['/common/court_amenities/'], schema: courtAmenitySchema },
  { fileType: 'court_grandeur_level', patterns: ['/common/court_grandeur_levels/'], schema: courtGrandeurLevelSchema },
  { fileType: 'court_position_category', patterns: ['/common/court_position_categories/'], schema: courtPositionCategorySchema },
  { fileType: 'court_position', patterns: ['/common/court_positions/'], schema: courtPositionSchema },
  { fileType: 'court_type', patterns: ['/common/court_types/'], schema: courtTypeSchema },
  { fileType: 'courtier_guest_management', patterns: ['/common/courtier_guest_management/'], schema: courtierGuestManagementSchema },
  { fileType: 'culture_name_list', patterns: ['/common/culture_name_lists/'], schema: cultureNameListSchema },
  { fileType: 'custom_localization', patterns: ['/common/customizable_localization/'], schema: customLocalizationSchema },
  { fileType: 'deathreasons', patterns: ['/common/deathreasons/'], schema: deathreasonsSchema },
  {
    fileType: 'decision',
    patterns: ['/common/decisions/'],
    schema: decisionSchema,
    getSchemaForContext: (blockPath) => {
      const lastBlock = blockPath[blockPath.length - 1];
      if (lastBlock === 'cost' || lastBlock === 'minimum_cost') {
        return costBlockSchema;
      }
      return decisionSchema;
    },
  },
  { fileType: 'defines', patterns: ['/common/defines/'], schema: definesSchema },
  { fileType: 'diarchy', patterns: ['/common/diarchies/'], schema: diarchySchema },
  { fileType: 'dlc_feature', patterns: ['/common/dlc_features/'], schema: dlcFeatureSchema },
  { fileType: 'dna_data', patterns: ['/common/dna_data/'], schema: dnaDataSchema },
  { fileType: 'domicile', patterns: ['/common/domiciles/'], schema: domicileSchema },
  { fileType: 'dynasty', patterns: ['/common/dynasties/'], schema: dynastySchema },
  { fileType: 'dynasty_house', patterns: ['/common/dynasty_houses/'], schema: dynastyHouseSchema },
  { fileType: 'dynasty_legacy', patterns: ['/common/dynasty_legacies/'], schema: dynastyLegacySchema },
  { fileType: 'effect_locale', patterns: ['/common/effect_localization/'], schema: effectLocaleSchema },
  { fileType: 'epidemic', patterns: ['/common/epidemics/'], schema: epidemicSchema },
  { fileType: 'event_background', patterns: ['/common/event_backgrounds/'], schema: eventBackgroundSchema },
  { fileType: 'event_theme', patterns: ['/common/event_themes/'], schema: eventThemeSchema },
  { fileType: 'execution_method', patterns: ['/common/execution_methods/'], schema: executionMethodSchema },
  { fileType: 'faction', patterns: ['/common/factions/'], schema: factionSchema },
  { fileType: 'flavorization', patterns: ['/common/flavorization/'], schema: flavorizationSchema },
  { fileType: 'focus', patterns: ['/common/focuses/'], schema: focusSchema },
  { fileType: 'game_concept', patterns: ['/common/game_concepts/'], schema: gameConceptSchema },
  { fileType: 'game_rule', patterns: ['/common/game_rules/'], schema: gameRuleSchema },
  { fileType: 'game_start', patterns: ['/common/game_starts/'], schema: gameStartSchema },
  { fileType: 'government', patterns: ['/common/governments/'], schema: governmentSchema },
  { fileType: 'great_project', patterns: ['/common/great_projects/'], schema: greatProjectSchema },
  { fileType: 'guest_system', patterns: ['/common/guest_system/'], schema: guestSystemSchema },
  { fileType: 'holding_type', patterns: ['/common/holding_types/'], schema: holdingTypeSchema },
  { fileType: 'holding', patterns: ['/common/holdings/'], schema: holdingSchema },
  { fileType: 'holy_order', patterns: ['/common/holy_orders/'], schema: holyOrderSchema },
  { fileType: 'hook', patterns: ['/common/hook_types/'], schema: hookSchema },
  { fileType: 'house_unity', patterns: ['/common/house_unities/'], schema: houseUnitySchema },
  { fileType: 'important_action', patterns: ['/common/important_actions/'], schema: importantActionSchema },
  { fileType: 'inspiration_type', patterns: ['/common/inspiration_types/'], schema: inspirationTypeSchema },
  { fileType: 'inspiration', patterns: ['/common/inspirations/'], schema: inspirationSchema },
  { fileType: 'landed_title', patterns: ['/common/landed_titles/'], schema: landedTitleSchema, initialScope: 'landed_title' },
  { fileType: 'law', patterns: ['/common/laws/'], schema: lawSchema },
  { fileType: 'lease_contract', patterns: ['/common/lease_contracts/'], schema: leaseContractSchema },
  { fileType: 'legend', patterns: ['/common/legends/'], schema: legendSchema },
  { fileType: 'legitimacy', patterns: ['/common/legitimacy/'], schema: legitimacySchema },
  { fileType: 'lifestyle_perk_tree', patterns: ['/common/lifestyle_perk_trees/'], schema: lifestylePerkTreeSchema },
  { fileType: 'lifestyle', patterns: ['/common/lifestyles/'], schema: lifestyleSchema },
  { fileType: 'loading_tip', patterns: ['/common/loading_tips/'], schema: loadingTipSchema },
  { fileType: 'map_mode', patterns: ['/common/map_modes/'], schema: mapModeSchema },
  { fileType: 'mercenary_company', patterns: ['/common/mercenary_companies/'], schema: mercenaryCompanySchema },
  { fileType: 'message', patterns: ['/common/messages/'], schema: messageSchema },
  { fileType: 'modifier', patterns: ['/common/modifiers/'], schema: modifierSchema },
  { fileType: 'named_colors', patterns: ['/common/named_colors/'], schema: namedColorsSchema },
  { fileType: 'nickname_rule', patterns: ['/common/nickname_rules/'], schema: nicknameRuleSchema },
  { fileType: 'nickname', patterns: ['/common/nicknames/'], schema: nicknameSchema },
  { fileType: 'on_action', patterns: ['/common/on_actions/', '/common/on_action/'], schema: onActionSchema },
  { fileType: 'opinion_modifier', patterns: ['/common/opinion_modifiers/'], schema: opinionModifierSchema },
  { fileType: 'perk', patterns: ['/common/perks/'], schema: perkSchema },
  { fileType: 'playable_difficulty', patterns: ['/common/playable_difficulties/'], schema: playableDifficultySchema },
  { fileType: 'pool_selector', patterns: ['/common/pool_character_selectors/'], schema: poolSelectorSchema },
  { fileType: 'pool_generation_rule', patterns: ['/common/pool_generation_rules/'], schema: poolGenerationRuleSchema },
  { fileType: 'portrait_type', patterns: ['/common/portrait_types/'], schema: portraitTypeSchema },
  { fileType: 'province_modifier', patterns: ['/common/province_modifiers/'], schema: provinceModifierSchema },
  { fileType: 'province_setup', patterns: ['/common/province_setup/'], schema: provinceSetupSchema },
  { fileType: 'punishment', patterns: ['/common/punishments/'], schema: punishmentSchema },
  { fileType: 'regiment', patterns: ['/common/regiments/'], schema: regimentSchema },
  { fileType: 'relation_flag', patterns: ['/common/relation_flags/'], schema: relationFlagSchema },
  { fileType: 'scheme', patterns: ['/common/schemes/'], schema: schemeSchema },
  { fileType: 'script_value', patterns: ['/common/script_values/'], schema: scriptValueSchema },
  { fileType: 'scripted_animation', patterns: ['/common/scripted_animations/'], schema: scriptedAnimationSchema },
  { fileType: 'scripted_character_template', patterns: ['/common/scripted_character_templates/'], schema: scriptedCharacterTemplateSchema },
  { fileType: 'scripted_cost', patterns: ['/common/scripted_costs/'], schema: scriptedCostSchema },
  { fileType: 'scripted_effect', patterns: ['/common/scripted_effects/'], schema: scriptedEffectSchema },
  { fileType: 'scripted_gui', patterns: ['/common/scripted_guis/'], schema: scriptedGuiSchema },
  { fileType: 'scripted_list', patterns: ['/common/scripted_lists/'], schema: scriptedListSchema },
  { fileType: 'scripted_loc_value', patterns: ['/common/scripted_loc_values/'], schema: scriptedLocValueSchema },
  { fileType: 'scripted_modifier', patterns: ['/common/scripted_modifiers/'], schema: scriptedModifierSchema },
  { fileType: 'scripted_relation', patterns: ['/common/scripted_relations/'], schema: scriptedRelationSchema },
  { fileType: 'scripted_rules', patterns: ['/common/scripted_rules/'], schema: scriptedRulesSchema },
  { fileType: 'scripted_score_value', patterns: ['/common/scripted_score_values/'], schema: scriptedScoreValueSchema },
  { fileType: 'scripted_spawn', patterns: ['/common/scripted_spawns/'], schema: scriptedSpawnSchema },
  { fileType: 'scripted_trigger', patterns: ['/common/scripted_triggers/'], schema: scriptedTriggerSchema },
  { fileType: 'secret', patterns: ['/common/secret_types/'], schema: secretSchema },
  { fileType: 'special_building', patterns: ['/common/special_buildings/'], schema: specialBuildingSchema },
  { fileType: 'story_cycle', patterns: ['/common/story_cycles/'], schema: storyCycleSchema },
  { fileType: 'struggle', patterns: ['/common/struggle/'], schema: struggleSchema },
  { fileType: 'subject_contract', patterns: ['/common/subject_contracts/'], schema: subjectContractSchema },
  { fileType: 'succession_election', patterns: ['/common/succession_election/'], schema: successionElectionSchema },
  { fileType: 'succession_law', patterns: ['/common/succession_laws/'], schema: successionLawSchema },
  { fileType: 'succession_voting', patterns: ['/common/succession_voting/'], schema: successionVotingSchema },
  { fileType: 'suggestion', patterns: ['/common/suggestions/'], schema: suggestionSchema },
  { fileType: 'task_contract', patterns: ['/common/task_contracts/'], schema: taskContractSchema },
  { fileType: 'tax_slot', patterns: ['/common/tax_slots/'], schema: taxSlotSchema },
  { fileType: 'terrain_modifier', patterns: ['/common/terrain_modifiers/'], schema: terrainModifierSchema },
  { fileType: 'terrain_type', patterns: ['/common/terrain_types/'], schema: terrainTypeSchema },
  { fileType: 'title_color', patterns: ['/common/title_colors/'], schema: titleColorSchema },
  { fileType: 'title_flag', patterns: ['/common/title_flags/'], schema: titleFlagSchema },
  { fileType: 'trait', patterns: ['/common/traits/'], schema: traitSchema, initialScope: 'character' },
  { fileType: 'travel', patterns: ['/common/travel/'], schema: travelSchema },
  { fileType: 'trigger_locale', patterns: ['/common/trigger_localization/'], schema: triggerLocaleSchema },
  { fileType: 'triggered_outfit', patterns: ['/common/triggered_outfits/'], schema: triggeredOutfitSchema },
  { fileType: 'triggered_text', patterns: ['/common/triggered_text/'], schema: triggeredTextSchema },
  { fileType: 'tutorial', patterns: ['/common/tutorials/'], schema: tutorialSchema },
  { fileType: 'vassal_contract', patterns: ['/common/vassal_contracts/'], schema: vassalContractSchema },
  { fileType: 'vassal_obligation', patterns: ['/common/vassal_obligations/'], schema: vassalObligationSchema },
  { fileType: 'vassal_stance', patterns: ['/common/vassal_stances/'], schema: vassalStanceSchema },
  { fileType: 'war_contribution', patterns: ['/common/war_contributions/'], schema: warContributionSchema },
  { fileType: 'war_goal', patterns: ['/common/war_goals/'], schema: warGoalSchema },

  // Other directories
  { fileType: 'gui_type', patterns: ['/gui/'], schema: guiTypeSchema },
  { fileType: 'localization', patterns: ['/localization/'], schema: localizationSchema },
  { fileType: 'music', patterns: ['/music/'], schema: musicSchema },
  { fileType: 'sound_effect', patterns: ['/sound/'], schema: soundEffectSchema },
  { fileType: 'scripted_test', patterns: ['/tests/'], schema: scriptedTestSchema },
];

// Cache for schemaMap derivation
const schemaMaps = new WeakMap<FieldSchema[], Map<string, FieldSchema>>();

/**
 * Derive schemaMap from schema array (with caching)
 */
function getSchemaMap(schema: FieldSchema[]): Map<string, FieldSchema> {
  let map = schemaMaps.get(schema);
  if (!map) {
    map = new Map(schema.map(f => [f.name, f]));
    schemaMaps.set(schema, map);
  }
  return map;
}

/**
 * Unified schema registry class
 */
class SchemaRegistry {
  private entries: SchemaRegistryEntry[];
  private pathCache = new Map<string, SchemaRegistryEntry | null>();

  constructor() {
    this.entries = SCHEMA_ENTRIES;
  }

  /**
   * Get schema info for a file path
   */
  getForFile(filePath: string): SchemaLookupResult | null {
    const normalized = filePath.replace(/\\/g, '/');

    // Check cache
    if (this.pathCache.has(normalized)) {
      const cached = this.pathCache.get(normalized);
      return cached ? this.entryToResult(cached) : null;
    }

    // Find matching entry (patterns are ordered, first match wins)
    for (const entry of this.entries) {
      for (const pattern of entry.patterns) {
        if (normalized.includes(pattern)) {
          this.pathCache.set(normalized, entry);
          return this.entryToResult(entry);
        }
      }
    }

    this.pathCache.set(normalized, null);
    return null;
  }

  /**
   * Get schema for a specific file type
   */
  getForFileType(fileType: string): SchemaLookupResult | null {
    const entry = this.entries.find(e => e.fileType === fileType);
    return entry ? this.entryToResult(entry) : null;
  }

  /**
   * Get context-aware schema for a file path and block path
   */
  getSchemaForContext(filePath: string, blockPath: string[]): FieldSchema[] {
    const result = this.getForFile(filePath);
    if (!result) return [];

    // If entry has custom context resolver, use it
    if (result.getSchemaForContext && blockPath.length > 0) {
      return result.getSchemaForContext(blockPath);
    }

    return result.schema;
  }

  /**
   * Get just the schemaMap for a file (for hover/validation lookups)
   */
  getSchemaMapForFile(filePath: string): Map<string, FieldSchema> | null {
    const result = this.getForFile(filePath);
    return result?.schemaMap ?? null;
  }

  private entryToResult(entry: SchemaRegistryEntry): SchemaLookupResult {
    return {
      fileType: entry.fileType,
      schema: entry.schema,
      schemaMap: getSchemaMap(entry.schema),
      initialScope: entry.initialScope || 'character',
      getSchemaForContext: entry.getSchemaForContext,
    };
  }
}

// Singleton instance
export const schemaRegistry = new SchemaRegistry();
