import * as vscode from 'vscode';
import { FieldSchema, TRAIT_CATEGORIES, STATS } from '../schemas/traitSchema';

// Import effect and trigger data
import { effectsMap, EffectDefinition } from '../data';
import { triggersMap, TriggerDefinition } from '../data';
// Import weight block definitions
import {
  WEIGHT_BLOCKS,
  WEIGHT_BLOCK_PARAMS,
  TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS,
} from '../utils/scopeContext';
import { getImmediateParentBlock, createGetText } from '../utils/blockParser';
import { getBlockSchemaMap } from '../schemas/blockSchemas';

// Import all schema maps (mirroring ck3CompletionProvider imports)
import { traitSchemaMap } from '../schemas/traitSchema';
import { eventSchemaMap, eventOptionSchemaMap, portraitBlockSchemaMap } from '../schemas/eventSchema';
import { decisionSchemaMap, costBlockSchemaMap } from '../schemas/decisionSchema';
import { interactionSchemaMap } from '../schemas/interactionSchema';
import { buildingSchemaMap } from '../schemas/buildingSchema';
import { onActionSchemaMap } from '../schemas/onActionSchema';
import { schemeSchemaMap } from '../schemas/schemeSchema';
import { menAtArmsSchemaMap } from '../schemas/menAtArmsSchema';
import { casusBelliSchemaMap } from '../schemas/casusBelliSchema';
import { cultureSchemaMap, traditionSchemaMap } from '../schemas/cultureSchema';
import { faithSchemaMap, religionSchemaMap } from '../schemas/faithSchema';
import { scriptedEffectSchemaMap } from '../schemas/scriptedEffectsSchema';
import { scriptedTriggerSchemaMap } from '../schemas/scriptedTriggersSchema';
import { artifactSchemaMap } from '../schemas/artifactSchema';
import { courtPositionSchemaMap } from '../schemas/courtPositionSchema';
import { lifestyleSchemaMap, focusSchemaMap, perkSchemaMap } from '../schemas/lifestyleSchema';
import { dynastyLegacySchemaMap } from '../schemas/dynastyLegacySchema';
import { modifierSchemaMap } from '../schemas/modifierSchema';
import { lawSchemaMap } from '../schemas/lawSchema';
import { governmentSchemaMap } from '../schemas/governmentSchema';
import { factionSchemaMap } from '../schemas/factionSchema';
import { councilTaskSchemaMap } from '../schemas/councilTaskSchema';
import { opinionModifierSchemaMap } from '../schemas/opinionModifierSchema';
import { secretSchemaMap } from '../schemas/secretSchema';
import { nicknameSchemaMap } from '../schemas/nicknameSchema';
import { scriptValueSchemaMap } from '../schemas/scriptValueSchema';
import { hookSchemaMap } from '../schemas/hookSchema';
import { activitySchemaMap } from '../schemas/activitySchema';
import { gameRuleSchemaMap } from '../schemas/gameRuleSchema';
import { bookmarkSchemaMap } from '../schemas/bookmarkSchema';
import { storyCycleSchemaMap } from '../schemas/storyCycleSchema';
import { importantActionSchemaMap } from '../schemas/importantActionSchema';
import { vassalContractSchemaMap } from '../schemas/vassalContractSchema';
import { landedTitleSchemaMap } from '../schemas/landedTitleSchema';
import { coatOfArmsSchemaMap } from '../schemas/coatOfArmsSchema';
import { innovationSchemaMap } from '../schemas/innovationSchema';
import { doctrineSchemaMap } from '../schemas/doctrineSchema';
import { holySiteSchemaMap } from '../schemas/holySiteSchema';
import { holdingSchemaMap } from '../schemas/holdingSchema';
import { dynastySchemaMap } from '../schemas/dynastySchema';
import { characterHistorySchemaMap } from '../schemas/characterHistorySchema';
import { terrainSchemaMap } from '../schemas/terrainSchema';
import { scriptedGuiSchemaMap } from '../schemas/scriptedGuiSchema';
import { customLocalizationSchemaMap } from '../schemas/customLocalizationSchema';
import { flavorizationSchemaMap } from '../schemas/flavorizationSchema';
import { deathreasonsSchemaMap } from '../schemas/deathreasonsSchema';
import { successionElectionSchemaMap } from '../schemas/successionElectionSchema';
import { scriptedRelationSchemaMap } from '../schemas/scriptedRelationSchema';
import { namedColorsSchemaMap } from '../schemas/namedColorsSchema';
import { eventBackgroundSchemaMap } from '../schemas/eventBackgroundSchema';
import { poolSelectorSchemaMap } from '../schemas/poolSelectorSchema';
import { scriptedModifierSchemaMap } from '../schemas/scriptedModifierSchema';
import { scriptedRulesSchemaMap } from '../schemas/scriptedRulesSchema';
import { gameConceptSchemaMap } from '../schemas/gameConceptSchema';
import { messageSchemaMap } from '../schemas/messageSchema';
import { scriptedListSchemaMap } from '../schemas/scriptedListSchema';
import { titleHistorySchemaMap } from '../schemas/titleHistorySchema';
import { accoladeTypeSchemaMap } from '../schemas/accoladeTypeSchema';
import { characterMemorySchemaMap } from '../schemas/characterMemorySchema';
import { courtAmenitySchemaMap } from '../schemas/courtAmenitySchema';
import { dynastyHouseSchemaMap } from '../schemas/dynastyHouseSchema';
import { legendSchemaMap } from '../schemas/legendSchema';
import { travelSchemaMap } from '../schemas/travelSchema';
import { struggleSchemaMap } from '../schemas/struggleSchema';
import { inspirationSchemaMap } from '../schemas/inspirationSchema';
import { diarchySchemaMap } from '../schemas/diarchySchema';
import { domicileSchemaMap } from '../schemas/domicileSchema';
import { greatProjectSchemaMap } from '../schemas/greatProjectSchema';
import { epidemicSchemaMap } from '../schemas/epidemicSchema';
import { houseUnitySchemaMap } from '../schemas/houseUnitySchema';
import { legitimacySchemaMap } from '../schemas/legitimacySchema';
import { taxSlotSchemaMap } from '../schemas/taxSlotSchema';
import { vassalStanceSchemaMap } from '../schemas/vassalStanceSchema';
import { suggestionSchemaMap } from '../schemas/suggestionSchema';
import { scriptedCostSchemaMap } from '../schemas/scriptedCostSchema';
import { scriptedAnimationSchemaMap } from '../schemas/scriptedAnimationSchema';
import { scriptedCharacterTemplateSchemaMap } from '../schemas/scriptedCharacterTemplateSchema';
import { eventThemeSchemaMap } from '../schemas/eventThemeSchema';
import { casusBelliGroupSchemaMap } from '../schemas/casusBelliGroupSchema';
import { aiWarStanceSchemaMap } from '../schemas/aiWarStanceSchema';
import { combatPhaseEventSchemaMap } from '../schemas/combatPhaseEventSchema';
import { bookmarkPortraitSchemaMap } from '../schemas/bookmarkPortraitSchema';
import { guestSystemSchemaMap } from '../schemas/guestSystemSchema';
import { courtierGuestManagementSchemaMap } from '../schemas/courtierGuestManagementSchema';
import { taskContractSchemaMap } from '../schemas/taskContractSchema';
import { subjectContractSchemaMap } from '../schemas/subjectContractSchema';
import { leaseContractSchemaMap } from '../schemas/leaseContractSchema';
import { characterBackgroundSchemaMap } from '../schemas/characterBackgroundSchema';
import { dnaDataSchemaMap } from '../schemas/dnaDataSchema';
import { portraitModifierSchemaMap } from '../schemas/portraitModifierSchema';
import { nicknameRuleSchemaMap } from '../schemas/nicknameRuleSchema';
import { successionLawSchemaMap } from '../schemas/successionLawSchema';
import { warGoalSchemaMap } from '../schemas/warGoalSchema';
import { scriptedIllustrationSchemaMap } from '../schemas/scriptedIllustrationSchema';
import { mapModeSchemaMap } from '../schemas/mapModeSchema';
import { provinceHistorySchemaMap } from '../schemas/provinceHistorySchema';
import { regionSchemaMap } from '../schemas/regionSchema';
import { scriptedScoreValueSchemaMap } from '../schemas/scriptedScoreValueSchema';
import { aiPersonalitySchemaMap } from '../schemas/aiPersonalitySchema';
import { definesSchemaMap } from '../schemas/definesSchema';
import { scriptedLocValueSchemaMap } from '../schemas/scriptedLocValueSchema';
import { interactionCategorySchemaMap } from '../schemas/interactionCategorySchema';
import { countyCultureSchemaMap } from '../schemas/countyCultureSchema';
import { playableDifficultySchemaMap } from '../schemas/playableDifficultySchema';
import { provinceSetupSchemaMap } from '../schemas/provinceSetupSchema';
import { scriptedSpawnSchemaMap } from '../schemas/scriptedSpawnSchema';
import { courtPositionCategorySchemaMap } from '../schemas/courtPositionCategorySchema';
import { activityLocaleSchemaMap } from '../schemas/activityLocaleSchema';
import { cultureEraSchemaMap } from '../schemas/cultureEraSchema';
import { nameListSchemaMap } from '../schemas/nameListSchema';
import { relationFlagSchemaMap } from '../schemas/relationFlagSchema';
import { terrainTypeSchemaMap } from '../schemas/terrainTypeSchema';
import { holdingTypeSchemaMap } from '../schemas/holdingTypeSchema';
import { menAtArmsTypeSchemaMap } from '../schemas/menAtArmsTypeSchema';
import { combatPhaseSchemaMap } from '../schemas/combatPhaseSchema';
import { inspirationTypeSchemaMap } from '../schemas/inspirationTypeSchema';
import { courtTypeSchemaMap } from '../schemas/courtTypeSchema';
import { culturePillarSchemaMap } from '../schemas/culturePillarSchema';
import { heritageSchemaMap } from '../schemas/heritageSchema';
import { languageSchemaMap } from '../schemas/languageSchema';
import { martialCustomSchemaMap } from '../schemas/martialCustomSchema';
import { ethosSchemaMap } from '../schemas/ethosSchema';
import { scriptedGfxSchemaMap } from '../schemas/scriptedGfxSchema';
import { gameStartSchemaMap } from '../schemas/gameStartSchema';
import { characterTemplateSchemaMap } from '../schemas/characterTemplateSchema';
import { triggerLocaleSchemaMap } from '../schemas/triggerLocaleSchema';
import { effectLocaleSchemaMap } from '../schemas/effectLocaleSchema';
import { musicSchemaMap } from '../schemas/musicSchema';
import { soundEffectSchemaMap } from '../schemas/soundEffectSchema';
import { portraitCameraSchemaMap } from '../schemas/portraitCameraSchema';
import { geneSchemaMap } from '../schemas/geneSchema';
import { accessorySchemaMap } from '../schemas/accessorySchema';
import { coaTemplateSchemaMap } from '../schemas/coaTemplateSchema';
import { achievementSchemaMap } from '../schemas/achievementSchema';
import { scriptedTestSchemaMap } from '../schemas/scriptedTestSchema';
import { tutorialSchemaMap } from '../schemas/tutorialSchema';
import { mapObjectSchemaMap } from '../schemas/mapObjectSchema';
import { loadingTipSchemaMap } from '../schemas/loadingTipSchema';
import { guiTypeSchemaMap } from '../schemas/guiTypeSchema';
import { localizationSchemaMap } from '../schemas/localizationSchema';
import { regimentSchemaMap } from '../schemas/regimentSchema';
import { titleColorSchemaMap } from '../schemas/titleColorSchema';
import { characterInteractionCategorySchemaMap } from '../schemas/characterInteractionCategorySchema';
import { dlcFeatureSchemaMap } from '../schemas/dlcFeatureSchema';
import { aiBudgetSchemaMap } from '../schemas/aiBudgetSchema';
import { specialBuildingSchemaMap } from '../schemas/specialBuildingSchema';
import { triggeredTextSchemaMap } from '../schemas/triggeredTextSchema';
import { poolGenerationRuleSchemaMap } from '../schemas/poolGenerationRuleSchema';
import { aiTaskSchemaMap } from '../schemas/aiTaskSchema';
import { artifactTemplateSchemaMap } from '../schemas/artifactTemplateSchema';
import { coaPatternSchemaMap } from '../schemas/coaPatternSchema';
import { coaEmblemSchemaMap } from '../schemas/coaEmblemSchema';
import { cultureNameListSchemaMap } from '../schemas/cultureNameListSchema';
import { artifactVisualSchemaMap } from '../schemas/artifactVisualSchema';
import { artifactRaritySchemaMap } from '../schemas/artifactRaritySchema';
import { climateSchemaMap } from '../schemas/climateSchema';
import { terrainModifierSchemaMap } from '../schemas/terrainModifierSchema';
import { successionVotingSchemaMap } from '../schemas/successionVotingSchema';
import { characterFlagSchemaMap } from '../schemas/characterFlagSchema';
import { titleFlagSchemaMap } from '../schemas/titleFlagSchema';
import { provinceModifierSchemaMap } from '../schemas/provinceModifierSchema';
import { lifestylePerkTreeSchemaMap } from '../schemas/lifestylePerkTreeSchema';
import { buildingSlotSchemaMap } from '../schemas/buildingSlotSchema';
import { artifactSlotSchemaMap } from '../schemas/artifactSlotSchema';
import { mercenaryCompanySchemaMap } from '../schemas/mercenaryCompanySchema';
import { holyOrderSchemaMap } from '../schemas/holyOrderSchema';
import { warContributionSchemaMap } from '../schemas/warContributionSchema';
import { armyTemplateSchemaMap } from '../schemas/armyTemplateSchema';
import { combatEffectSchemaMap } from '../schemas/combatEffectSchema';
import { vassalObligationSchemaMap } from '../schemas/vassalObligationSchema';
import { triggeredOutfitSchemaMap } from '../schemas/triggeredOutfitSchema';
import { portraitTypeSchemaMap } from '../schemas/portraitTypeSchema';
import { courtGrandeurLevelSchemaMap } from '../schemas/courtGrandeurLevelSchema';
import { amenityLevelSchemaMap } from '../schemas/amenityLevelSchema';
import { artifactFeatureSchemaMap } from '../schemas/artifactFeatureSchema';
import { executionMethodSchemaMap } from '../schemas/executionMethodSchema';
import { punishmentSchemaMap } from '../schemas/punishmentSchema';

/**
 * Registry mapping file path patterns to their schema maps.
 * Order matters - more specific patterns should come before general ones.
 */
interface SchemaRegistryEntry {
  pattern: string;
  schemaMap: Map<string, FieldSchema>;
}

const SCHEMA_REGISTRY: SchemaRegistryEntry[] = [
  // Events (before common/ patterns)
  { pattern: '/events/', schemaMap: eventSchemaMap },

  // History files
  { pattern: '/history/characters/', schemaMap: characterHistorySchemaMap },
  { pattern: '/history/titles/', schemaMap: titleHistorySchemaMap },
  { pattern: '/history/provinces/', schemaMap: provinceHistorySchemaMap },

  // Map data
  { pattern: '/map_data/regions/', schemaMap: regionSchemaMap },
  { pattern: '/map_data/', schemaMap: mapObjectSchemaMap },

  // GFX patterns (before common/)
  { pattern: '/gfx/portraits/portrait_modifiers/', schemaMap: portraitModifierSchemaMap },
  { pattern: '/gfx/portraits/scripted_illustrations/', schemaMap: scriptedIllustrationSchemaMap },
  { pattern: '/gfx/portraits/cameras/', schemaMap: portraitCameraSchemaMap },
  { pattern: '/gfx/portraits/genes/', schemaMap: geneSchemaMap },
  { pattern: '/gfx/portraits/accessories/', schemaMap: accessorySchemaMap },
  { pattern: '/gfx/scripted/', schemaMap: scriptedGfxSchemaMap },

  // Coat of arms patterns (specific before general)
  { pattern: '/coat_of_arms/patterns/', schemaMap: coaPatternSchemaMap },
  { pattern: '/coat_of_arms/emblems/', schemaMap: coaEmblemSchemaMap },
  { pattern: '/common/coat_of_arms/templates/', schemaMap: coaTemplateSchemaMap },
  { pattern: '/common/coat_of_arms/colors/', schemaMap: coatOfArmsSchemaMap },
  { pattern: '/common/coat_of_arms/', schemaMap: coatOfArmsSchemaMap },

  // Culture subfolders (specific before general)
  { pattern: '/common/culture/cultures/', schemaMap: cultureSchemaMap },
  { pattern: '/common/culture/traditions/', schemaMap: traditionSchemaMap },
  { pattern: '/common/culture/innovations/', schemaMap: innovationSchemaMap },
  { pattern: '/common/culture/eras/', schemaMap: cultureEraSchemaMap },
  { pattern: '/common/culture/name_lists/', schemaMap: nameListSchemaMap },
  { pattern: '/common/culture/pillars/', schemaMap: culturePillarSchemaMap },
  { pattern: '/common/culture/heritage/', schemaMap: heritageSchemaMap },
  { pattern: '/common/culture/languages/', schemaMap: languageSchemaMap },
  { pattern: '/common/culture/martial_customs/', schemaMap: martialCustomSchemaMap },
  { pattern: '/common/culture/ethos/', schemaMap: ethosSchemaMap },

  // Religion subfolders (specific before general)
  { pattern: '/common/religion/religions/', schemaMap: religionSchemaMap },
  { pattern: '/common/religion/doctrines/', schemaMap: doctrineSchemaMap },
  { pattern: '/common/religion/holy_sites/', schemaMap: holySiteSchemaMap },

  // Men at arms (specific before general)
  { pattern: '/common/men_at_arms_types/definitions/', schemaMap: menAtArmsTypeSchemaMap },
  { pattern: '/common/men_at_arms_types/', schemaMap: menAtArmsSchemaMap },

  // All other common/ patterns (alphabetical order)
  { pattern: '/common/achievements/', schemaMap: achievementSchemaMap },
  { pattern: '/common/accolade_types/', schemaMap: accoladeTypeSchemaMap },
  { pattern: '/common/activities/', schemaMap: activitySchemaMap },
  { pattern: '/common/activity_locales/', schemaMap: activityLocaleSchemaMap },
  { pattern: '/common/ai_budgets/', schemaMap: aiBudgetSchemaMap },
  { pattern: '/common/ai_personalities/', schemaMap: aiPersonalitySchemaMap },
  { pattern: '/common/ai_tasks/', schemaMap: aiTaskSchemaMap },
  { pattern: '/common/ai_war_stances/', schemaMap: aiWarStanceSchemaMap },
  { pattern: '/common/amenity_levels/', schemaMap: amenityLevelSchemaMap },
  { pattern: '/common/army_templates/', schemaMap: armyTemplateSchemaMap },
  { pattern: '/common/artifact_features/', schemaMap: artifactFeatureSchemaMap },
  { pattern: '/common/artifact_rarities/', schemaMap: artifactRaritySchemaMap },
  { pattern: '/common/artifact_slots/', schemaMap: artifactSlotSchemaMap },
  { pattern: '/common/artifact_templates/', schemaMap: artifactTemplateSchemaMap },
  { pattern: '/common/artifact_visuals/', schemaMap: artifactVisualSchemaMap },
  { pattern: '/common/artifacts/', schemaMap: artifactSchemaMap },
  { pattern: '/common/bookmark_portraits/', schemaMap: bookmarkPortraitSchemaMap },
  { pattern: '/common/bookmarks/', schemaMap: bookmarkSchemaMap },
  { pattern: '/common/building_slots/', schemaMap: buildingSlotSchemaMap },
  { pattern: '/common/buildings/', schemaMap: buildingSchemaMap },
  { pattern: '/common/casus_belli_groups/', schemaMap: casusBelliGroupSchemaMap },
  { pattern: '/common/casus_belli_types/', schemaMap: casusBelliSchemaMap },
  { pattern: '/common/character_backgrounds/', schemaMap: characterBackgroundSchemaMap },
  { pattern: '/common/character_flags/', schemaMap: characterFlagSchemaMap },
  { pattern: '/common/character_interaction_categories/', schemaMap: characterInteractionCategorySchemaMap },
  { pattern: '/common/character_interactions/', schemaMap: interactionSchemaMap },
  { pattern: '/common/character_memory_types/', schemaMap: characterMemorySchemaMap },
  { pattern: '/common/character_templates/', schemaMap: characterTemplateSchemaMap },
  { pattern: '/common/climate/', schemaMap: climateSchemaMap },
  { pattern: '/common/combat_effects/', schemaMap: combatEffectSchemaMap },
  { pattern: '/common/combat_phase_events/', schemaMap: combatPhaseEventSchemaMap },
  { pattern: '/common/combat_phase_types/', schemaMap: combatPhaseSchemaMap },
  { pattern: '/common/council_tasks/', schemaMap: councilTaskSchemaMap },
  { pattern: '/common/county_culture/', schemaMap: countyCultureSchemaMap },
  { pattern: '/common/court_amenities/', schemaMap: courtAmenitySchemaMap },
  { pattern: '/common/court_grandeur_levels/', schemaMap: courtGrandeurLevelSchemaMap },
  { pattern: '/common/court_position_categories/', schemaMap: courtPositionCategorySchemaMap },
  { pattern: '/common/court_positions/', schemaMap: courtPositionSchemaMap },
  { pattern: '/common/court_types/', schemaMap: courtTypeSchemaMap },
  { pattern: '/common/courtier_guest_management/', schemaMap: courtierGuestManagementSchemaMap },
  { pattern: '/common/culture_name_lists/', schemaMap: cultureNameListSchemaMap },
  { pattern: '/common/customizable_localization/', schemaMap: customLocalizationSchemaMap },
  { pattern: '/common/deathreasons/', schemaMap: deathreasonsSchemaMap },
  { pattern: '/common/decisions/', schemaMap: decisionSchemaMap },
  { pattern: '/common/defines/', schemaMap: definesSchemaMap },
  { pattern: '/common/diarchies/', schemaMap: diarchySchemaMap },
  { pattern: '/common/dlc_features/', schemaMap: dlcFeatureSchemaMap },
  { pattern: '/common/dna_data/', schemaMap: dnaDataSchemaMap },
  { pattern: '/common/domiciles/', schemaMap: domicileSchemaMap },
  { pattern: '/common/dynasties/', schemaMap: dynastySchemaMap },
  { pattern: '/common/dynasty_houses/', schemaMap: dynastyHouseSchemaMap },
  { pattern: '/common/dynasty_legacies/', schemaMap: dynastyLegacySchemaMap },
  { pattern: '/common/effect_localization/', schemaMap: effectLocaleSchemaMap },
  { pattern: '/common/epidemics/', schemaMap: epidemicSchemaMap },
  { pattern: '/common/event_backgrounds/', schemaMap: eventBackgroundSchemaMap },
  { pattern: '/common/event_themes/', schemaMap: eventThemeSchemaMap },
  { pattern: '/common/execution_methods/', schemaMap: executionMethodSchemaMap },
  { pattern: '/common/factions/', schemaMap: factionSchemaMap },
  { pattern: '/common/flavorization/', schemaMap: flavorizationSchemaMap },
  { pattern: '/common/focuses/', schemaMap: focusSchemaMap },
  { pattern: '/common/game_concepts/', schemaMap: gameConceptSchemaMap },
  { pattern: '/common/game_rules/', schemaMap: gameRuleSchemaMap },
  { pattern: '/common/game_starts/', schemaMap: gameStartSchemaMap },
  { pattern: '/common/governments/', schemaMap: governmentSchemaMap },
  { pattern: '/common/great_projects/', schemaMap: greatProjectSchemaMap },
  { pattern: '/common/guest_system/', schemaMap: guestSystemSchemaMap },
  { pattern: '/common/holding_types/', schemaMap: holdingTypeSchemaMap },
  { pattern: '/common/holdings/', schemaMap: holdingSchemaMap },
  { pattern: '/common/holy_orders/', schemaMap: holyOrderSchemaMap },
  { pattern: '/common/hook_types/', schemaMap: hookSchemaMap },
  { pattern: '/common/house_unities/', schemaMap: houseUnitySchemaMap },
  { pattern: '/common/important_actions/', schemaMap: importantActionSchemaMap },
  { pattern: '/common/inspiration_types/', schemaMap: inspirationTypeSchemaMap },
  { pattern: '/common/inspirations/', schemaMap: inspirationSchemaMap },
  { pattern: '/common/landed_titles/', schemaMap: landedTitleSchemaMap },
  { pattern: '/common/laws/', schemaMap: lawSchemaMap },
  { pattern: '/common/lease_contracts/', schemaMap: leaseContractSchemaMap },
  { pattern: '/common/legends/', schemaMap: legendSchemaMap },
  { pattern: '/common/legitimacy/', schemaMap: legitimacySchemaMap },
  { pattern: '/common/lifestyle_perk_trees/', schemaMap: lifestylePerkTreeSchemaMap },
  { pattern: '/common/lifestyles/', schemaMap: lifestyleSchemaMap },
  { pattern: '/common/loading_tips/', schemaMap: loadingTipSchemaMap },
  { pattern: '/common/map_modes/', schemaMap: mapModeSchemaMap },
  { pattern: '/common/mercenary_companies/', schemaMap: mercenaryCompanySchemaMap },
  { pattern: '/common/messages/', schemaMap: messageSchemaMap },
  { pattern: '/common/modifiers/', schemaMap: modifierSchemaMap },
  { pattern: '/common/named_colors/', schemaMap: namedColorsSchemaMap },
  { pattern: '/common/nickname_rules/', schemaMap: nicknameRuleSchemaMap },
  { pattern: '/common/nicknames/', schemaMap: nicknameSchemaMap },
  { pattern: '/common/on_actions/', schemaMap: onActionSchemaMap },
  { pattern: '/common/opinion_modifiers/', schemaMap: opinionModifierSchemaMap },
  { pattern: '/common/perks/', schemaMap: perkSchemaMap },
  { pattern: '/common/playable_difficulties/', schemaMap: playableDifficultySchemaMap },
  { pattern: '/common/pool_character_selectors/', schemaMap: poolSelectorSchemaMap },
  { pattern: '/common/pool_generation_rules/', schemaMap: poolGenerationRuleSchemaMap },
  { pattern: '/common/portrait_types/', schemaMap: portraitTypeSchemaMap },
  { pattern: '/common/province_modifiers/', schemaMap: provinceModifierSchemaMap },
  { pattern: '/common/province_setup/', schemaMap: provinceSetupSchemaMap },
  { pattern: '/common/punishments/', schemaMap: punishmentSchemaMap },
  { pattern: '/common/regiments/', schemaMap: regimentSchemaMap },
  { pattern: '/common/relation_flags/', schemaMap: relationFlagSchemaMap },
  { pattern: '/common/schemes/', schemaMap: schemeSchemaMap },
  { pattern: '/common/script_values/', schemaMap: scriptValueSchemaMap },
  { pattern: '/common/scripted_animations/', schemaMap: scriptedAnimationSchemaMap },
  { pattern: '/common/scripted_character_templates/', schemaMap: scriptedCharacterTemplateSchemaMap },
  { pattern: '/common/scripted_costs/', schemaMap: scriptedCostSchemaMap },
  { pattern: '/common/scripted_effects/', schemaMap: scriptedEffectSchemaMap },
  { pattern: '/common/scripted_guis/', schemaMap: scriptedGuiSchemaMap },
  { pattern: '/common/scripted_lists/', schemaMap: scriptedListSchemaMap },
  { pattern: '/common/scripted_loc_values/', schemaMap: scriptedLocValueSchemaMap },
  { pattern: '/common/scripted_modifiers/', schemaMap: scriptedModifierSchemaMap },
  { pattern: '/common/scripted_relations/', schemaMap: scriptedRelationSchemaMap },
  { pattern: '/common/scripted_rules/', schemaMap: scriptedRulesSchemaMap },
  { pattern: '/common/scripted_score_values/', schemaMap: scriptedScoreValueSchemaMap },
  { pattern: '/common/scripted_spawns/', schemaMap: scriptedSpawnSchemaMap },
  { pattern: '/common/scripted_triggers/', schemaMap: scriptedTriggerSchemaMap },
  { pattern: '/common/secret_types/', schemaMap: secretSchemaMap },
  { pattern: '/common/special_buildings/', schemaMap: specialBuildingSchemaMap },
  { pattern: '/common/story_cycles/', schemaMap: storyCycleSchemaMap },
  { pattern: '/common/struggle/', schemaMap: struggleSchemaMap },
  { pattern: '/common/subject_contracts/', schemaMap: subjectContractSchemaMap },
  { pattern: '/common/succession_election/', schemaMap: successionElectionSchemaMap },
  { pattern: '/common/succession_laws/', schemaMap: successionLawSchemaMap },
  { pattern: '/common/succession_voting/', schemaMap: successionVotingSchemaMap },
  { pattern: '/common/suggestions/', schemaMap: suggestionSchemaMap },
  { pattern: '/common/task_contracts/', schemaMap: taskContractSchemaMap },
  { pattern: '/common/tax_slots/', schemaMap: taxSlotSchemaMap },
  { pattern: '/common/terrain_modifiers/', schemaMap: terrainModifierSchemaMap },
  { pattern: '/common/terrain_types/', schemaMap: terrainTypeSchemaMap },
  { pattern: '/common/title_colors/', schemaMap: titleColorSchemaMap },
  { pattern: '/common/title_flags/', schemaMap: titleFlagSchemaMap },
  { pattern: '/common/traits/', schemaMap: traitSchemaMap },
  { pattern: '/common/travel/', schemaMap: travelSchemaMap },
  { pattern: '/common/trigger_localization/', schemaMap: triggerLocaleSchemaMap },
  { pattern: '/common/triggered_outfits/', schemaMap: triggeredOutfitSchemaMap },
  { pattern: '/common/triggered_text/', schemaMap: triggeredTextSchemaMap },
  { pattern: '/common/tutorials/', schemaMap: tutorialSchemaMap },
  { pattern: '/common/vassal_contracts/', schemaMap: vassalContractSchemaMap },
  { pattern: '/common/vassal_obligations/', schemaMap: vassalObligationSchemaMap },
  { pattern: '/common/vassal_stances/', schemaMap: vassalStanceSchemaMap },
  { pattern: '/common/war_contributions/', schemaMap: warContributionSchemaMap },
  { pattern: '/common/war_goals/', schemaMap: warGoalSchemaMap },

  // Other directories
  { pattern: '/gui/', schemaMap: guiTypeSchemaMap },
  { pattern: '/localization/', schemaMap: localizationSchemaMap },
  { pattern: '/music/', schemaMap: musicSchemaMap },
  { pattern: '/sound/', schemaMap: soundEffectSchemaMap },
  { pattern: '/tests/', schemaMap: scriptedTestSchemaMap },
];

/**
 * Provides hover information for CK3 entity fields across all file types
 */
export class CK3HoverProvider implements vscode.HoverProvider {

  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    const wordRange = document.getWordRangeAtPosition(position, /[\w_]+/);
    if (!wordRange) {
      return null;
    }

    const word = document.getText(wordRange);
    const lineText = document.lineAt(position).text;

    // Get the appropriate schema map for this file (may be null)
    const schemaMap = this.getSchemaMapForFile(document.fileName);

    // Check schema fields first (if we have a schema)
    if (schemaMap) {
      // Check if this is a field name (before =)
      const fieldMatch = lineText.match(/^\s*(\w+)\s*=/);
      if (fieldMatch && fieldMatch[1] === word) {
        const fieldHover = this.getFieldHover(word, schemaMap);
        if (fieldHover) return fieldHover;
      }

      // Check if this is a value (after =)
      const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
      if (valueMatch && valueMatch[2] === word) {
        const valueHover = this.getValueHover(valueMatch[1], word, schemaMap);
        if (valueHover) return valueHover;
      }

      // Generic field lookup
      const field = schemaMap.get(word);
      if (field) {
        return this.getFieldHover(word, schemaMap);
      }
    }

    // Trait-specific hovers (categories and stats)
    const normalizedPath = document.fileName.replace(/\\/g, '/');
    if (normalizedPath.includes('/common/traits/')) {
      if (TRAIT_CATEGORIES.includes(word as any)) {
        return this.getTraitCategoryHover(word);
      }
      if (STATS.includes(word as any)) {
        // Check if this is a stat value (after =) or just the stat name
        const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
        if (valueMatch && valueMatch[1] === word) {
          // This is the field name, not a value
          return this.getStatHover(word);
        }
        if (valueMatch && STATS.includes(valueMatch[1] as any) && valueMatch[2] === word) {
          // This is a stat value
          return this.getStatValueHover(valueMatch[1], word);
        }
        return this.getStatHover(word);
      }
    }

    // Check if this is a parameter of an effect/trigger block
    const parameterHover = this.getParameterHover(document, position, word);
    if (parameterHover) {
      return parameterHover;
    }

    // Always check for effects and triggers (works in any CK3 file)
    const effectHover = this.getEffectHover(word);
    if (effectHover) {
      return effectHover;
    }

    const triggerHover = this.getTriggerHover(word);
    if (triggerHover) {
      return triggerHover;
    }

    return null;
  }

  /**
   * Get the schema map for a file based on its path
   */
  private getSchemaMapForFile(fileName: string): Map<string, FieldSchema> | null {
    // Normalize path separators
    const normalizedPath = fileName.replace(/\\/g, '/');

    // Find the first matching pattern in the registry
    for (const entry of SCHEMA_REGISTRY) {
      if (normalizedPath.includes(entry.pattern)) {
        return entry.schemaMap;
      }
    }

    return null;
  }

  private getFieldHover(fieldName: string, schemaMap: Map<string, FieldSchema>): vscode.Hover | null {
    const field = schemaMap.get(fieldName);
    if (!field) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${fieldName}\n\n`);
    markdown.appendMarkdown(`**Type:** \`${field.type || 'unknown'}\`\n\n`);

    if (field.required) {
      markdown.appendMarkdown(`**Required field**\n\n`);
    }

    markdown.appendMarkdown(`${field.description || ''}\n\n`);

    if (field.type === 'enum' && field.values) {
      markdown.appendMarkdown(`**Valid values:**\n`);
      for (const val of field.values) {
        markdown.appendMarkdown(`- \`${val}\`\n`);
      }
      markdown.appendMarkdown('\n');
    }

    if (field.default !== undefined) {
      markdown.appendMarkdown(`**Default:** \`${field.default}\`\n\n`);
    }

    if (field.min !== undefined || field.max !== undefined) {
      markdown.appendMarkdown(`**Range:** ${field.min ?? '-inf'} to ${field.max ?? 'inf'}\n\n`);
    }

    if (field.example) {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\n${field.example}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  private getValueHover(fieldName: string, value: string, schemaMap: Map<string, FieldSchema>): vscode.Hover | null {
    const field = schemaMap.get(fieldName);
    if (!field) return null;

    const markdown = new vscode.MarkdownString();

    // Generic value description
    if (field.type === 'enum' && field.values?.includes(value)) {
      markdown.appendMarkdown(`**${value}**\n\n`);
      markdown.appendMarkdown(`Valid value for \`${fieldName}\`\n`);
      return new vscode.Hover(markdown);
    }

    if (field.type === 'boolean') {
      markdown.appendMarkdown(`**${value}**\n\n`);
      markdown.appendMarkdown(value === 'yes' ? 'Enables this option' : 'Disables this option');
      return new vscode.Hover(markdown);
    }

    // Numeric value hover
    if (field.type === 'integer' || field.type === 'float') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        markdown.appendMarkdown(`**${fieldName}: ${value}**\n\n`);

        if (field.min !== undefined && numValue < field.min) {
          markdown.appendMarkdown(`Warning: Below minimum value (${field.min})\n\n`);
        }
        if (field.max !== undefined && numValue > field.max) {
          markdown.appendMarkdown(`Warning: Above maximum value (${field.max})\n\n`);
        }

        return new vscode.Hover(markdown);
      }
    }

    return null;
  }

  /**
   * Get hover documentation for an effect
   */
  private getEffectHover(name: string): vscode.Hover | null {
    const effect = effectsMap.get(name);
    if (!effect) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${name}\n\n`);
    markdown.appendMarkdown(`**Effect** - `);

    if (effect.isIterator) {
      markdown.appendMarkdown(`*Iterator*\n\n`);
    } else {
      markdown.appendMarkdown(`*Command*\n\n`);
    }

    markdown.appendMarkdown(`${effect.description}\n\n`);

    // Show supported scopes
    const scopes = effect.supportedScopes.join(', ');
    markdown.appendMarkdown(`**Scopes:** \`${scopes}\`\n\n`);

    // Show supported targets for iterators
    if (effect.supportedTargets && effect.supportedTargets.length > 0) {
      const targets = effect.supportedTargets.join(', ');
      markdown.appendMarkdown(`**Targets:** \`${targets}\`\n\n`);
    }

    // Show output scope if it changes scope
    if (effect.outputScope) {
      markdown.appendMarkdown(`**Output scope:** \`${effect.outputScope}\`\n\n`);
    }

    // Show syntax example
    if (effect.syntax) {
      markdown.appendMarkdown(`**Syntax:**\n\`\`\`\n${effect.syntax}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover documentation for a trigger
   */
  private getTriggerHover(name: string): vscode.Hover | null {
    const trigger = triggersMap.get(name);
    if (!trigger) return null;

    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${name}\n\n`);
    markdown.appendMarkdown(`**Trigger** - `);

    if (trigger.isIterator) {
      markdown.appendMarkdown(`*Iterator*\n\n`);
    } else if (trigger.valueType === 'boolean') {
      markdown.appendMarkdown(`*Boolean*\n\n`);
    } else if (trigger.valueType === 'comparison') {
      markdown.appendMarkdown(`*Comparison*\n\n`);
    } else {
      markdown.appendMarkdown(`*Condition*\n\n`);
    }

    markdown.appendMarkdown(`${trigger.description}\n\n`);

    // Show supported scopes
    const scopes = trigger.supportedScopes.join(', ');
    markdown.appendMarkdown(`**Scopes:** \`${scopes}\`\n\n`);

    // Show supported targets for iterators
    if (trigger.supportedTargets && trigger.supportedTargets.length > 0) {
      const targets = trigger.supportedTargets.join(', ');
      markdown.appendMarkdown(`**Targets:** \`${targets}\`\n\n`);
    }

    // Show output scope if it changes scope
    if (trigger.outputScope) {
      markdown.appendMarkdown(`**Output scope:** \`${trigger.outputScope}\`\n\n`);
    }

    // Show syntax example
    if (trigger.syntax) {
      markdown.appendMarkdown(`**Syntax:**\n\`\`\`\n${trigger.syntax}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for trait category values
   */
  private getTraitCategoryHover(category: string): vscode.Hover {
    const descriptions: Record<string, string> = {
      personality: 'Core personality traits that define character behavior. Generated with characters and affect AI decisions.',
      education: 'Education traits representing the character\'s upbringing. One per character, acquired at age 16.',
      childhood: 'Child personality traits that grow into adult traits when the character comes of age.',
      commander: 'Combat leadership traits that affect battlefield performance.',
      winter_commander: 'Specialized commander traits for winter warfare.',
      lifestyle: 'Traits gained through lifestyle focus progress.',
      court_type: 'Royal court type traits (requires Royal Court DLC).',
      fame: 'Fame and prestige-related traits.',
      health: 'Health conditions and physical states.',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## Category: ${category}\n\n`);
    markdown.appendMarkdown(descriptions[category] || 'A trait category.');

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for stat names (diplomacy, martial, etc.)
   */
  private getStatHover(stat: string): vscode.Hover {
    const descriptions: Record<string, string> = {
      diplomacy: 'Diplomacy affects relations, vassals, and negotiation. Used for diplomatic actions and schemes.',
      martial: 'Martial affects military performance, levy size, and army effectiveness.',
      stewardship: 'Stewardship affects domain limit, tax income, and economic actions.',
      intrigue: 'Intrigue affects schemes, secrets, and covert actions.',
      learning: 'Learning affects research speed, piety, and religious/cultural actions.',
      prowess: 'Prowess affects personal combat ability in duels and battles.',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${stat.charAt(0).toUpperCase() + stat.slice(1)}\n\n`);
    markdown.appendMarkdown(descriptions[stat] || 'A character stat.');

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for stat values (shows magnitude interpretation)
   */
  private getStatValueHover(stat: string, value: string): vscode.Hover {
    const numValue = parseInt(value);
    const markdown = new vscode.MarkdownString();

    markdown.appendMarkdown(`## ${stat} modifier: ${value}\n\n`);

    if (!isNaN(numValue)) {
      if (numValue > 0) {
        markdown.appendMarkdown(`Grants **+${numValue}** to ${stat}.\n\n`);
      } else if (numValue < 0) {
        markdown.appendMarkdown(`Reduces ${stat} by **${Math.abs(numValue)}**.\n\n`);
      } else {
        markdown.appendMarkdown(`No effect on ${stat}.\n\n`);
      }

      // Context for the value
      if (Math.abs(numValue) <= 1) {
        markdown.appendMarkdown('*Minor modifier*');
      } else if (Math.abs(numValue) <= 3) {
        markdown.appendMarkdown('*Moderate modifier*');
      } else if (Math.abs(numValue) <= 5) {
        markdown.appendMarkdown('*Significant modifier*');
      } else {
        markdown.appendMarkdown('*Major modifier*');
      }
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover documentation for a parameter of an effect/trigger
   */
  private getParameterHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    word: string
  ): vscode.Hover | null {
    // Find the parent block by scanning backwards using unified parser
    const getText = createGetText(document);
    const parentBlock = getImmediateParentBlock(getText, position.line, position.character);
    if (!parentBlock) return null;

    // Check BLOCK_SCHEMAS for structural block fields (triggered_desc, desc, men_at_arms, etc.)
    const blockSchemaMap = getBlockSchemaMap(parentBlock);
    if (blockSchemaMap) {
      const fieldSchema = blockSchemaMap.get(word);
      if (fieldSchema) {
        return this.getBlockSchemaFieldHover(fieldSchema, parentBlock);
      }
    }

    // Check if this is a weight block parameter
    if (WEIGHT_BLOCKS.has(parentBlock) && WEIGHT_BLOCK_PARAMS.has(word)) {
      return this.getWeightParamHover(word, parentBlock);
    }

    // Check if this is a parameter of a trigger-context block with extra params
    const blockConfig = TRIGGER_CONTEXT_BLOCKS_WITH_PARAMS.get(parentBlock);
    if (blockConfig && blockConfig.extraParams.has(word)) {
      return this.getTriggerContextBlockParamHover(word, parentBlock, blockConfig.extraParams);
    }

    // Check if this word is a parameter of the parent block
    const effect = effectsMap.get(parentBlock);
    const trigger = triggersMap.get(parentBlock);

    const effectDef = effect as EffectDefinition | undefined;
    const triggerDef = trigger as TriggerDefinition | undefined;

    const isEffectParam = effectDef?.parameters?.includes(word);
    const isTriggerParam = triggerDef?.parameters?.includes(word);

    if (!isEffectParam && !isTriggerParam) return null;

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${word}\n\n`);
    markdown.appendMarkdown(`**Parameter of** \`${parentBlock}\`\n\n`);

    // Try to extract description from the syntax
    const def = effectDef || triggerDef;
    if (def?.syntax) {
      const paramDesc = this.extractParameterDescription(word, def.syntax);
      if (paramDesc) {
        markdown.appendMarkdown(`${paramDesc}\n\n`);
      }
    }

    // Show the full syntax as reference
    if (def?.syntax) {
      markdown.appendMarkdown(`**Full syntax:**\n\`\`\`\n${def.syntax}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for weight block parameters (base, modifier, factor, etc.)
   */
  private getWeightParamHover(param: string, parentBlock: string): vscode.Hover {
    const descriptions: Record<string, string> = {
      base: 'The starting weight value before modifiers are applied.',
      modifier: 'A conditional weight modifier block. Contains inline triggers that, if true, apply the adjustment (add/factor/multiply).',
      opinion_modifier: 'An opinion-based weight modifier. Adjusts weight based on opinion between characters.',
      factor: 'Multiplies the current weight by this value.',
      add: 'Adds this value to the current weight.',
      multiply: 'Multiplies the current weight by this value (alias for factor).',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${param}\n\n`);
    markdown.appendMarkdown(`**Weight block parameter** in \`${parentBlock}\`\n\n`);
    markdown.appendMarkdown(`${descriptions[param] || 'A weight calculation parameter.'}\n\n`);

    // Show example syntax for the whole weight block
    markdown.appendMarkdown(`**Example:**\n\`\`\`\n${parentBlock} = {\n    base = 100\n    modifier = {\n        add = 50\n        has_trait = ambitious\n    }\n}\n\`\`\`\n`);

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for extra parameters in trigger-context blocks (like modifier inside weight)
   */
  private getTriggerContextBlockParamHover(
    param: string,
    parentBlock: string,
    extraParams: Set<string>
  ): vscode.Hover {
    // Descriptions for modifier block params
    const modifierParamDescriptions: Record<string, string> = {
      add: 'Adds this value to the weight when the inline triggers are satisfied.',
      factor: 'Multiplies the weight by this value when the inline triggers are satisfied.',
      multiply: 'Multiplies the weight by this value when the inline triggers are satisfied (alias for factor).',
      desc: 'A localization key or string describing what this modifier does.',
      value: 'The value to use for this modifier.',
    };

    // Descriptions for opinion_modifier block params
    const opinionModifierParamDescriptions: Record<string, string> = {
      who: 'The character whose opinion is being checked.',
      opinion_target: 'The character the opinion is towards.',
      min: 'Minimum opinion value to consider.',
      max: 'Maximum opinion value to consider.',
      multiplier: 'Multiplies the opinion value by this factor.',
      desc: 'A localization key or string describing what this modifier does.',
      step: 'Step size for opinion value increments.',
    };

    // Descriptions for compare_value block params
    const compareValueParamDescriptions: Record<string, string> = {
      value: 'The value to compare against.',
      target: 'The target value or scope to compare.',
    };

    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${param}\n\n`);
    markdown.appendMarkdown(`**Parameter of** \`${parentBlock}\`\n\n`);

    // Get description based on parent block
    let description: string | undefined;
    if (parentBlock === 'modifier') {
      description = modifierParamDescriptions[param];
    } else if (parentBlock === 'opinion_modifier') {
      description = opinionModifierParamDescriptions[param];
    } else if (parentBlock === 'compare_value') {
      description = compareValueParamDescriptions[param];
    }

    markdown.appendMarkdown(`${description || 'A block parameter.'}\n\n`);

    // Show all valid params for this block
    const paramList = Array.from(extraParams).join(', ');
    markdown.appendMarkdown(`**Valid parameters:** \`${paramList}\`\n\n`);

    // Block-specific example
    if (parentBlock === 'modifier') {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\nmodifier = {\n    add = 50\n    has_trait = ambitious\n}\n\`\`\`\n`);
    } else if (parentBlock === 'opinion_modifier') {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\nopinion_modifier = {\n    who = root\n    opinion_target = scope:target\n    multiplier = 0.5\n}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Get hover for a field from BLOCK_SCHEMAS (structural blocks like triggered_desc, men_at_arms, etc.)
   */
  private getBlockSchemaFieldHover(fieldSchema: FieldSchema, parentBlock: string): vscode.Hover {
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`## ${fieldSchema.name}\n\n`);
    markdown.appendMarkdown(`**Field of** \`${parentBlock}\` block\n\n`);

    if (fieldSchema.description) {
      markdown.appendMarkdown(`${fieldSchema.description}\n\n`);
    }

    // Show type information
    if (fieldSchema.type) {
      markdown.appendMarkdown(`**Type:** \`${fieldSchema.type}\`\n\n`);
    }

    // Show valid values for enums
    if (fieldSchema.values && fieldSchema.values.length > 0) {
      const valuesList = fieldSchema.values.slice(0, 10).join(', ');
      const suffix = fieldSchema.values.length > 10 ? `, ... (${fieldSchema.values.length} total)` : '';
      markdown.appendMarkdown(`**Valid values:** ${valuesList}${suffix}\n\n`);
    }

    // Show required status
    if (fieldSchema.required) {
      markdown.appendMarkdown(`*Required field*\n\n`);
    }

    // Show example if available
    if (fieldSchema.example) {
      markdown.appendMarkdown(`**Example:**\n\`\`\`\n${fieldSchema.example}\n\`\`\`\n`);
    }

    return new vscode.Hover(markdown);
  }

  /**
   * Extract a parameter's description from the syntax documentation
   */
  private extractParameterDescription(param: string, syntax: string): string | null {
    // Look for lines like "param = description" or "param = value # comment"
    const lines = syntax.split('\n');
    for (const line of lines) {
      // Match patterns like: "param = value # description" or "param = value - description"
      const paramPattern = new RegExp(`^\\s*${param}\\s*=\\s*(.*)$`, 'i');
      const match = line.match(paramPattern);
      if (match) {
        let desc = match[1].trim();
        // Extract comment/description from # or after the value
        const commentMatch = desc.match(/#\s*(.*)$/);
        if (commentMatch) {
          return commentMatch[1].trim();
        }
        // Return the whole value description if no comment
        if (desc && desc.length < 100) { // Sanity check
          return desc;
        }
      }
    }
    return null;
  }
}
