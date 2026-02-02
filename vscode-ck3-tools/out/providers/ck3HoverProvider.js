"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CK3HoverProvider = void 0;
const vscode = __importStar(require("vscode"));
const traitSchema_1 = require("../schemas/traitSchema");
// Import effect and trigger data
const data_1 = require("../data");
const data_2 = require("../data");
// Import all schema maps (mirroring ck3CompletionProvider imports)
const traitSchema_2 = require("../schemas/traitSchema");
const eventSchema_1 = require("../schemas/eventSchema");
const decisionSchema_1 = require("../schemas/decisionSchema");
const interactionSchema_1 = require("../schemas/interactionSchema");
const buildingSchema_1 = require("../schemas/buildingSchema");
const onActionSchema_1 = require("../schemas/onActionSchema");
const schemeSchema_1 = require("../schemas/schemeSchema");
const menAtArmsSchema_1 = require("../schemas/menAtArmsSchema");
const casusBelliSchema_1 = require("../schemas/casusBelliSchema");
const cultureSchema_1 = require("../schemas/cultureSchema");
const faithSchema_1 = require("../schemas/faithSchema");
const scriptedEffectsSchema_1 = require("../schemas/scriptedEffectsSchema");
const scriptedTriggersSchema_1 = require("../schemas/scriptedTriggersSchema");
const artifactSchema_1 = require("../schemas/artifactSchema");
const courtPositionSchema_1 = require("../schemas/courtPositionSchema");
const lifestyleSchema_1 = require("../schemas/lifestyleSchema");
const dynastyLegacySchema_1 = require("../schemas/dynastyLegacySchema");
const modifierSchema_1 = require("../schemas/modifierSchema");
const lawSchema_1 = require("../schemas/lawSchema");
const governmentSchema_1 = require("../schemas/governmentSchema");
const factionSchema_1 = require("../schemas/factionSchema");
const councilTaskSchema_1 = require("../schemas/councilTaskSchema");
const opinionModifierSchema_1 = require("../schemas/opinionModifierSchema");
const secretSchema_1 = require("../schemas/secretSchema");
const nicknameSchema_1 = require("../schemas/nicknameSchema");
const scriptValueSchema_1 = require("../schemas/scriptValueSchema");
const hookSchema_1 = require("../schemas/hookSchema");
const activitySchema_1 = require("../schemas/activitySchema");
const gameRuleSchema_1 = require("../schemas/gameRuleSchema");
const bookmarkSchema_1 = require("../schemas/bookmarkSchema");
const storyCycleSchema_1 = require("../schemas/storyCycleSchema");
const importantActionSchema_1 = require("../schemas/importantActionSchema");
const vassalContractSchema_1 = require("../schemas/vassalContractSchema");
const landedTitleSchema_1 = require("../schemas/landedTitleSchema");
const coatOfArmsSchema_1 = require("../schemas/coatOfArmsSchema");
const innovationSchema_1 = require("../schemas/innovationSchema");
const doctrineSchema_1 = require("../schemas/doctrineSchema");
const holySiteSchema_1 = require("../schemas/holySiteSchema");
const holdingSchema_1 = require("../schemas/holdingSchema");
const dynastySchema_1 = require("../schemas/dynastySchema");
const characterHistorySchema_1 = require("../schemas/characterHistorySchema");
const scriptedGuiSchema_1 = require("../schemas/scriptedGuiSchema");
const customLocalizationSchema_1 = require("../schemas/customLocalizationSchema");
const flavorizationSchema_1 = require("../schemas/flavorizationSchema");
const deathreasonsSchema_1 = require("../schemas/deathreasonsSchema");
const successionElectionSchema_1 = require("../schemas/successionElectionSchema");
const scriptedRelationSchema_1 = require("../schemas/scriptedRelationSchema");
const namedColorsSchema_1 = require("../schemas/namedColorsSchema");
const eventBackgroundSchema_1 = require("../schemas/eventBackgroundSchema");
const poolSelectorSchema_1 = require("../schemas/poolSelectorSchema");
const scriptedModifierSchema_1 = require("../schemas/scriptedModifierSchema");
const scriptedRulesSchema_1 = require("../schemas/scriptedRulesSchema");
const gameConceptSchema_1 = require("../schemas/gameConceptSchema");
const messageSchema_1 = require("../schemas/messageSchema");
const scriptedListSchema_1 = require("../schemas/scriptedListSchema");
const titleHistorySchema_1 = require("../schemas/titleHistorySchema");
const accoladeTypeSchema_1 = require("../schemas/accoladeTypeSchema");
const characterMemorySchema_1 = require("../schemas/characterMemorySchema");
const courtAmenitySchema_1 = require("../schemas/courtAmenitySchema");
const dynastyHouseSchema_1 = require("../schemas/dynastyHouseSchema");
const legendSchema_1 = require("../schemas/legendSchema");
const travelSchema_1 = require("../schemas/travelSchema");
const struggleSchema_1 = require("../schemas/struggleSchema");
const inspirationSchema_1 = require("../schemas/inspirationSchema");
const diarchySchema_1 = require("../schemas/diarchySchema");
const domicileSchema_1 = require("../schemas/domicileSchema");
const greatProjectSchema_1 = require("../schemas/greatProjectSchema");
const epidemicSchema_1 = require("../schemas/epidemicSchema");
const houseUnitySchema_1 = require("../schemas/houseUnitySchema");
const legitimacySchema_1 = require("../schemas/legitimacySchema");
const taxSlotSchema_1 = require("../schemas/taxSlotSchema");
const vassalStanceSchema_1 = require("../schemas/vassalStanceSchema");
const suggestionSchema_1 = require("../schemas/suggestionSchema");
const scriptedCostSchema_1 = require("../schemas/scriptedCostSchema");
const scriptedAnimationSchema_1 = require("../schemas/scriptedAnimationSchema");
const scriptedCharacterTemplateSchema_1 = require("../schemas/scriptedCharacterTemplateSchema");
const eventThemeSchema_1 = require("../schemas/eventThemeSchema");
const casusBelliGroupSchema_1 = require("../schemas/casusBelliGroupSchema");
const aiWarStanceSchema_1 = require("../schemas/aiWarStanceSchema");
const combatPhaseEventSchema_1 = require("../schemas/combatPhaseEventSchema");
const bookmarkPortraitSchema_1 = require("../schemas/bookmarkPortraitSchema");
const guestSystemSchema_1 = require("../schemas/guestSystemSchema");
const courtierGuestManagementSchema_1 = require("../schemas/courtierGuestManagementSchema");
const taskContractSchema_1 = require("../schemas/taskContractSchema");
const subjectContractSchema_1 = require("../schemas/subjectContractSchema");
const leaseContractSchema_1 = require("../schemas/leaseContractSchema");
const characterBackgroundSchema_1 = require("../schemas/characterBackgroundSchema");
const dnaDataSchema_1 = require("../schemas/dnaDataSchema");
const portraitModifierSchema_1 = require("../schemas/portraitModifierSchema");
const nicknameRuleSchema_1 = require("../schemas/nicknameRuleSchema");
const successionLawSchema_1 = require("../schemas/successionLawSchema");
const warGoalSchema_1 = require("../schemas/warGoalSchema");
const scriptedIllustrationSchema_1 = require("../schemas/scriptedIllustrationSchema");
const mapModeSchema_1 = require("../schemas/mapModeSchema");
const provinceHistorySchema_1 = require("../schemas/provinceHistorySchema");
const regionSchema_1 = require("../schemas/regionSchema");
const scriptedScoreValueSchema_1 = require("../schemas/scriptedScoreValueSchema");
const aiPersonalitySchema_1 = require("../schemas/aiPersonalitySchema");
const definesSchema_1 = require("../schemas/definesSchema");
const scriptedLocValueSchema_1 = require("../schemas/scriptedLocValueSchema");
const countyCultureSchema_1 = require("../schemas/countyCultureSchema");
const playableDifficultySchema_1 = require("../schemas/playableDifficultySchema");
const provinceSetupSchema_1 = require("../schemas/provinceSetupSchema");
const scriptedSpawnSchema_1 = require("../schemas/scriptedSpawnSchema");
const courtPositionCategorySchema_1 = require("../schemas/courtPositionCategorySchema");
const activityLocaleSchema_1 = require("../schemas/activityLocaleSchema");
const cultureEraSchema_1 = require("../schemas/cultureEraSchema");
const nameListSchema_1 = require("../schemas/nameListSchema");
const relationFlagSchema_1 = require("../schemas/relationFlagSchema");
const terrainTypeSchema_1 = require("../schemas/terrainTypeSchema");
const holdingTypeSchema_1 = require("../schemas/holdingTypeSchema");
const menAtArmsTypeSchema_1 = require("../schemas/menAtArmsTypeSchema");
const combatPhaseSchema_1 = require("../schemas/combatPhaseSchema");
const inspirationTypeSchema_1 = require("../schemas/inspirationTypeSchema");
const courtTypeSchema_1 = require("../schemas/courtTypeSchema");
const culturePillarSchema_1 = require("../schemas/culturePillarSchema");
const heritageSchema_1 = require("../schemas/heritageSchema");
const languageSchema_1 = require("../schemas/languageSchema");
const martialCustomSchema_1 = require("../schemas/martialCustomSchema");
const ethosSchema_1 = require("../schemas/ethosSchema");
const scriptedGfxSchema_1 = require("../schemas/scriptedGfxSchema");
const gameStartSchema_1 = require("../schemas/gameStartSchema");
const characterTemplateSchema_1 = require("../schemas/characterTemplateSchema");
const triggerLocaleSchema_1 = require("../schemas/triggerLocaleSchema");
const effectLocaleSchema_1 = require("../schemas/effectLocaleSchema");
const musicSchema_1 = require("../schemas/musicSchema");
const soundEffectSchema_1 = require("../schemas/soundEffectSchema");
const portraitCameraSchema_1 = require("../schemas/portraitCameraSchema");
const geneSchema_1 = require("../schemas/geneSchema");
const accessorySchema_1 = require("../schemas/accessorySchema");
const coaTemplateSchema_1 = require("../schemas/coaTemplateSchema");
const achievementSchema_1 = require("../schemas/achievementSchema");
const scriptedTestSchema_1 = require("../schemas/scriptedTestSchema");
const tutorialSchema_1 = require("../schemas/tutorialSchema");
const mapObjectSchema_1 = require("../schemas/mapObjectSchema");
const loadingTipSchema_1 = require("../schemas/loadingTipSchema");
const guiTypeSchema_1 = require("../schemas/guiTypeSchema");
const localizationSchema_1 = require("../schemas/localizationSchema");
const regimentSchema_1 = require("../schemas/regimentSchema");
const titleColorSchema_1 = require("../schemas/titleColorSchema");
const characterInteractionCategorySchema_1 = require("../schemas/characterInteractionCategorySchema");
const dlcFeatureSchema_1 = require("../schemas/dlcFeatureSchema");
const aiBudgetSchema_1 = require("../schemas/aiBudgetSchema");
const specialBuildingSchema_1 = require("../schemas/specialBuildingSchema");
const triggeredTextSchema_1 = require("../schemas/triggeredTextSchema");
const poolGenerationRuleSchema_1 = require("../schemas/poolGenerationRuleSchema");
const aiTaskSchema_1 = require("../schemas/aiTaskSchema");
const artifactTemplateSchema_1 = require("../schemas/artifactTemplateSchema");
const coaPatternSchema_1 = require("../schemas/coaPatternSchema");
const coaEmblemSchema_1 = require("../schemas/coaEmblemSchema");
const cultureNameListSchema_1 = require("../schemas/cultureNameListSchema");
const artifactVisualSchema_1 = require("../schemas/artifactVisualSchema");
const artifactRaritySchema_1 = require("../schemas/artifactRaritySchema");
const climateSchema_1 = require("../schemas/climateSchema");
const terrainModifierSchema_1 = require("../schemas/terrainModifierSchema");
const successionVotingSchema_1 = require("../schemas/successionVotingSchema");
const characterFlagSchema_1 = require("../schemas/characterFlagSchema");
const titleFlagSchema_1 = require("../schemas/titleFlagSchema");
const provinceModifierSchema_1 = require("../schemas/provinceModifierSchema");
const lifestylePerkTreeSchema_1 = require("../schemas/lifestylePerkTreeSchema");
const buildingSlotSchema_1 = require("../schemas/buildingSlotSchema");
const artifactSlotSchema_1 = require("../schemas/artifactSlotSchema");
const mercenaryCompanySchema_1 = require("../schemas/mercenaryCompanySchema");
const holyOrderSchema_1 = require("../schemas/holyOrderSchema");
const warContributionSchema_1 = require("../schemas/warContributionSchema");
const armyTemplateSchema_1 = require("../schemas/armyTemplateSchema");
const combatEffectSchema_1 = require("../schemas/combatEffectSchema");
const vassalObligationSchema_1 = require("../schemas/vassalObligationSchema");
const triggeredOutfitSchema_1 = require("../schemas/triggeredOutfitSchema");
const portraitTypeSchema_1 = require("../schemas/portraitTypeSchema");
const courtGrandeurLevelSchema_1 = require("../schemas/courtGrandeurLevelSchema");
const amenityLevelSchema_1 = require("../schemas/amenityLevelSchema");
const artifactFeatureSchema_1 = require("../schemas/artifactFeatureSchema");
const executionMethodSchema_1 = require("../schemas/executionMethodSchema");
const punishmentSchema_1 = require("../schemas/punishmentSchema");
const SCHEMA_REGISTRY = [
    // Events (before common/ patterns)
    { pattern: '/events/', schemaMap: eventSchema_1.eventSchemaMap },
    // History files
    { pattern: '/history/characters/', schemaMap: characterHistorySchema_1.characterHistorySchemaMap },
    { pattern: '/history/titles/', schemaMap: titleHistorySchema_1.titleHistorySchemaMap },
    { pattern: '/history/provinces/', schemaMap: provinceHistorySchema_1.provinceHistorySchemaMap },
    // Map data
    { pattern: '/map_data/regions/', schemaMap: regionSchema_1.regionSchemaMap },
    { pattern: '/map_data/', schemaMap: mapObjectSchema_1.mapObjectSchemaMap },
    // GFX patterns (before common/)
    { pattern: '/gfx/portraits/portrait_modifiers/', schemaMap: portraitModifierSchema_1.portraitModifierSchemaMap },
    { pattern: '/gfx/portraits/scripted_illustrations/', schemaMap: scriptedIllustrationSchema_1.scriptedIllustrationSchemaMap },
    { pattern: '/gfx/portraits/cameras/', schemaMap: portraitCameraSchema_1.portraitCameraSchemaMap },
    { pattern: '/gfx/portraits/genes/', schemaMap: geneSchema_1.geneSchemaMap },
    { pattern: '/gfx/portraits/accessories/', schemaMap: accessorySchema_1.accessorySchemaMap },
    { pattern: '/gfx/scripted/', schemaMap: scriptedGfxSchema_1.scriptedGfxSchemaMap },
    // Coat of arms patterns (specific before general)
    { pattern: '/coat_of_arms/patterns/', schemaMap: coaPatternSchema_1.coaPatternSchemaMap },
    { pattern: '/coat_of_arms/emblems/', schemaMap: coaEmblemSchema_1.coaEmblemSchemaMap },
    { pattern: '/common/coat_of_arms/templates/', schemaMap: coaTemplateSchema_1.coaTemplateSchemaMap },
    { pattern: '/common/coat_of_arms/colors/', schemaMap: coatOfArmsSchema_1.coatOfArmsSchemaMap },
    { pattern: '/common/coat_of_arms/', schemaMap: coatOfArmsSchema_1.coatOfArmsSchemaMap },
    // Culture subfolders (specific before general)
    { pattern: '/common/culture/cultures/', schemaMap: cultureSchema_1.cultureSchemaMap },
    { pattern: '/common/culture/traditions/', schemaMap: cultureSchema_1.traditionSchemaMap },
    { pattern: '/common/culture/innovations/', schemaMap: innovationSchema_1.innovationSchemaMap },
    { pattern: '/common/culture/eras/', schemaMap: cultureEraSchema_1.cultureEraSchemaMap },
    { pattern: '/common/culture/name_lists/', schemaMap: nameListSchema_1.nameListSchemaMap },
    { pattern: '/common/culture/pillars/', schemaMap: culturePillarSchema_1.culturePillarSchemaMap },
    { pattern: '/common/culture/heritage/', schemaMap: heritageSchema_1.heritageSchemaMap },
    { pattern: '/common/culture/languages/', schemaMap: languageSchema_1.languageSchemaMap },
    { pattern: '/common/culture/martial_customs/', schemaMap: martialCustomSchema_1.martialCustomSchemaMap },
    { pattern: '/common/culture/ethos/', schemaMap: ethosSchema_1.ethosSchemaMap },
    // Religion subfolders (specific before general)
    { pattern: '/common/religion/religions/', schemaMap: faithSchema_1.religionSchemaMap },
    { pattern: '/common/religion/doctrines/', schemaMap: doctrineSchema_1.doctrineSchemaMap },
    { pattern: '/common/religion/holy_sites/', schemaMap: holySiteSchema_1.holySiteSchemaMap },
    // Men at arms (specific before general)
    { pattern: '/common/men_at_arms_types/definitions/', schemaMap: menAtArmsTypeSchema_1.menAtArmsTypeSchemaMap },
    { pattern: '/common/men_at_arms_types/', schemaMap: menAtArmsSchema_1.menAtArmsSchemaMap },
    // All other common/ patterns (alphabetical order)
    { pattern: '/common/achievements/', schemaMap: achievementSchema_1.achievementSchemaMap },
    { pattern: '/common/accolade_types/', schemaMap: accoladeTypeSchema_1.accoladeTypeSchemaMap },
    { pattern: '/common/activities/', schemaMap: activitySchema_1.activitySchemaMap },
    { pattern: '/common/activity_locales/', schemaMap: activityLocaleSchema_1.activityLocaleSchemaMap },
    { pattern: '/common/ai_budgets/', schemaMap: aiBudgetSchema_1.aiBudgetSchemaMap },
    { pattern: '/common/ai_personalities/', schemaMap: aiPersonalitySchema_1.aiPersonalitySchemaMap },
    { pattern: '/common/ai_tasks/', schemaMap: aiTaskSchema_1.aiTaskSchemaMap },
    { pattern: '/common/ai_war_stances/', schemaMap: aiWarStanceSchema_1.aiWarStanceSchemaMap },
    { pattern: '/common/amenity_levels/', schemaMap: amenityLevelSchema_1.amenityLevelSchemaMap },
    { pattern: '/common/army_templates/', schemaMap: armyTemplateSchema_1.armyTemplateSchemaMap },
    { pattern: '/common/artifact_features/', schemaMap: artifactFeatureSchema_1.artifactFeatureSchemaMap },
    { pattern: '/common/artifact_rarities/', schemaMap: artifactRaritySchema_1.artifactRaritySchemaMap },
    { pattern: '/common/artifact_slots/', schemaMap: artifactSlotSchema_1.artifactSlotSchemaMap },
    { pattern: '/common/artifact_templates/', schemaMap: artifactTemplateSchema_1.artifactTemplateSchemaMap },
    { pattern: '/common/artifact_visuals/', schemaMap: artifactVisualSchema_1.artifactVisualSchemaMap },
    { pattern: '/common/artifacts/', schemaMap: artifactSchema_1.artifactSchemaMap },
    { pattern: '/common/bookmark_portraits/', schemaMap: bookmarkPortraitSchema_1.bookmarkPortraitSchemaMap },
    { pattern: '/common/bookmarks/', schemaMap: bookmarkSchema_1.bookmarkSchemaMap },
    { pattern: '/common/building_slots/', schemaMap: buildingSlotSchema_1.buildingSlotSchemaMap },
    { pattern: '/common/buildings/', schemaMap: buildingSchema_1.buildingSchemaMap },
    { pattern: '/common/casus_belli_groups/', schemaMap: casusBelliGroupSchema_1.casusBelliGroupSchemaMap },
    { pattern: '/common/casus_belli_types/', schemaMap: casusBelliSchema_1.casusBelliSchemaMap },
    { pattern: '/common/character_backgrounds/', schemaMap: characterBackgroundSchema_1.characterBackgroundSchemaMap },
    { pattern: '/common/character_flags/', schemaMap: characterFlagSchema_1.characterFlagSchemaMap },
    { pattern: '/common/character_interaction_categories/', schemaMap: characterInteractionCategorySchema_1.characterInteractionCategorySchemaMap },
    { pattern: '/common/character_interactions/', schemaMap: interactionSchema_1.interactionSchemaMap },
    { pattern: '/common/character_memory_types/', schemaMap: characterMemorySchema_1.characterMemorySchemaMap },
    { pattern: '/common/character_templates/', schemaMap: characterTemplateSchema_1.characterTemplateSchemaMap },
    { pattern: '/common/climate/', schemaMap: climateSchema_1.climateSchemaMap },
    { pattern: '/common/combat_effects/', schemaMap: combatEffectSchema_1.combatEffectSchemaMap },
    { pattern: '/common/combat_phase_events/', schemaMap: combatPhaseEventSchema_1.combatPhaseEventSchemaMap },
    { pattern: '/common/combat_phase_types/', schemaMap: combatPhaseSchema_1.combatPhaseSchemaMap },
    { pattern: '/common/council_tasks/', schemaMap: councilTaskSchema_1.councilTaskSchemaMap },
    { pattern: '/common/county_culture/', schemaMap: countyCultureSchema_1.countyCultureSchemaMap },
    { pattern: '/common/court_amenities/', schemaMap: courtAmenitySchema_1.courtAmenitySchemaMap },
    { pattern: '/common/court_grandeur_levels/', schemaMap: courtGrandeurLevelSchema_1.courtGrandeurLevelSchemaMap },
    { pattern: '/common/court_position_categories/', schemaMap: courtPositionCategorySchema_1.courtPositionCategorySchemaMap },
    { pattern: '/common/court_positions/', schemaMap: courtPositionSchema_1.courtPositionSchemaMap },
    { pattern: '/common/court_types/', schemaMap: courtTypeSchema_1.courtTypeSchemaMap },
    { pattern: '/common/courtier_guest_management/', schemaMap: courtierGuestManagementSchema_1.courtierGuestManagementSchemaMap },
    { pattern: '/common/culture_name_lists/', schemaMap: cultureNameListSchema_1.cultureNameListSchemaMap },
    { pattern: '/common/customizable_localization/', schemaMap: customLocalizationSchema_1.customLocalizationSchemaMap },
    { pattern: '/common/deathreasons/', schemaMap: deathreasonsSchema_1.deathreasonsSchemaMap },
    { pattern: '/common/decisions/', schemaMap: decisionSchema_1.decisionSchemaMap },
    { pattern: '/common/defines/', schemaMap: definesSchema_1.definesSchemaMap },
    { pattern: '/common/diarchies/', schemaMap: diarchySchema_1.diarchySchemaMap },
    { pattern: '/common/dlc_features/', schemaMap: dlcFeatureSchema_1.dlcFeatureSchemaMap },
    { pattern: '/common/dna_data/', schemaMap: dnaDataSchema_1.dnaDataSchemaMap },
    { pattern: '/common/domiciles/', schemaMap: domicileSchema_1.domicileSchemaMap },
    { pattern: '/common/dynasties/', schemaMap: dynastySchema_1.dynastySchemaMap },
    { pattern: '/common/dynasty_houses/', schemaMap: dynastyHouseSchema_1.dynastyHouseSchemaMap },
    { pattern: '/common/dynasty_legacies/', schemaMap: dynastyLegacySchema_1.dynastyLegacySchemaMap },
    { pattern: '/common/effect_localization/', schemaMap: effectLocaleSchema_1.effectLocaleSchemaMap },
    { pattern: '/common/epidemics/', schemaMap: epidemicSchema_1.epidemicSchemaMap },
    { pattern: '/common/event_backgrounds/', schemaMap: eventBackgroundSchema_1.eventBackgroundSchemaMap },
    { pattern: '/common/event_themes/', schemaMap: eventThemeSchema_1.eventThemeSchemaMap },
    { pattern: '/common/execution_methods/', schemaMap: executionMethodSchema_1.executionMethodSchemaMap },
    { pattern: '/common/factions/', schemaMap: factionSchema_1.factionSchemaMap },
    { pattern: '/common/flavorization/', schemaMap: flavorizationSchema_1.flavorizationSchemaMap },
    { pattern: '/common/focuses/', schemaMap: lifestyleSchema_1.focusSchemaMap },
    { pattern: '/common/game_concepts/', schemaMap: gameConceptSchema_1.gameConceptSchemaMap },
    { pattern: '/common/game_rules/', schemaMap: gameRuleSchema_1.gameRuleSchemaMap },
    { pattern: '/common/game_starts/', schemaMap: gameStartSchema_1.gameStartSchemaMap },
    { pattern: '/common/governments/', schemaMap: governmentSchema_1.governmentSchemaMap },
    { pattern: '/common/great_projects/', schemaMap: greatProjectSchema_1.greatProjectSchemaMap },
    { pattern: '/common/guest_system/', schemaMap: guestSystemSchema_1.guestSystemSchemaMap },
    { pattern: '/common/holding_types/', schemaMap: holdingTypeSchema_1.holdingTypeSchemaMap },
    { pattern: '/common/holdings/', schemaMap: holdingSchema_1.holdingSchemaMap },
    { pattern: '/common/holy_orders/', schemaMap: holyOrderSchema_1.holyOrderSchemaMap },
    { pattern: '/common/hook_types/', schemaMap: hookSchema_1.hookSchemaMap },
    { pattern: '/common/house_unities/', schemaMap: houseUnitySchema_1.houseUnitySchemaMap },
    { pattern: '/common/important_actions/', schemaMap: importantActionSchema_1.importantActionSchemaMap },
    { pattern: '/common/inspiration_types/', schemaMap: inspirationTypeSchema_1.inspirationTypeSchemaMap },
    { pattern: '/common/inspirations/', schemaMap: inspirationSchema_1.inspirationSchemaMap },
    { pattern: '/common/landed_titles/', schemaMap: landedTitleSchema_1.landedTitleSchemaMap },
    { pattern: '/common/laws/', schemaMap: lawSchema_1.lawSchemaMap },
    { pattern: '/common/lease_contracts/', schemaMap: leaseContractSchema_1.leaseContractSchemaMap },
    { pattern: '/common/legends/', schemaMap: legendSchema_1.legendSchemaMap },
    { pattern: '/common/legitimacy/', schemaMap: legitimacySchema_1.legitimacySchemaMap },
    { pattern: '/common/lifestyle_perk_trees/', schemaMap: lifestylePerkTreeSchema_1.lifestylePerkTreeSchemaMap },
    { pattern: '/common/lifestyles/', schemaMap: lifestyleSchema_1.lifestyleSchemaMap },
    { pattern: '/common/loading_tips/', schemaMap: loadingTipSchema_1.loadingTipSchemaMap },
    { pattern: '/common/map_modes/', schemaMap: mapModeSchema_1.mapModeSchemaMap },
    { pattern: '/common/mercenary_companies/', schemaMap: mercenaryCompanySchema_1.mercenaryCompanySchemaMap },
    { pattern: '/common/messages/', schemaMap: messageSchema_1.messageSchemaMap },
    { pattern: '/common/modifiers/', schemaMap: modifierSchema_1.modifierSchemaMap },
    { pattern: '/common/named_colors/', schemaMap: namedColorsSchema_1.namedColorsSchemaMap },
    { pattern: '/common/nickname_rules/', schemaMap: nicknameRuleSchema_1.nicknameRuleSchemaMap },
    { pattern: '/common/nicknames/', schemaMap: nicknameSchema_1.nicknameSchemaMap },
    { pattern: '/common/on_actions/', schemaMap: onActionSchema_1.onActionSchemaMap },
    { pattern: '/common/opinion_modifiers/', schemaMap: opinionModifierSchema_1.opinionModifierSchemaMap },
    { pattern: '/common/perks/', schemaMap: lifestyleSchema_1.perkSchemaMap },
    { pattern: '/common/playable_difficulties/', schemaMap: playableDifficultySchema_1.playableDifficultySchemaMap },
    { pattern: '/common/pool_character_selectors/', schemaMap: poolSelectorSchema_1.poolSelectorSchemaMap },
    { pattern: '/common/pool_generation_rules/', schemaMap: poolGenerationRuleSchema_1.poolGenerationRuleSchemaMap },
    { pattern: '/common/portrait_types/', schemaMap: portraitTypeSchema_1.portraitTypeSchemaMap },
    { pattern: '/common/province_modifiers/', schemaMap: provinceModifierSchema_1.provinceModifierSchemaMap },
    { pattern: '/common/province_setup/', schemaMap: provinceSetupSchema_1.provinceSetupSchemaMap },
    { pattern: '/common/punishments/', schemaMap: punishmentSchema_1.punishmentSchemaMap },
    { pattern: '/common/regiments/', schemaMap: regimentSchema_1.regimentSchemaMap },
    { pattern: '/common/relation_flags/', schemaMap: relationFlagSchema_1.relationFlagSchemaMap },
    { pattern: '/common/schemes/', schemaMap: schemeSchema_1.schemeSchemaMap },
    { pattern: '/common/script_values/', schemaMap: scriptValueSchema_1.scriptValueSchemaMap },
    { pattern: '/common/scripted_animations/', schemaMap: scriptedAnimationSchema_1.scriptedAnimationSchemaMap },
    { pattern: '/common/scripted_character_templates/', schemaMap: scriptedCharacterTemplateSchema_1.scriptedCharacterTemplateSchemaMap },
    { pattern: '/common/scripted_costs/', schemaMap: scriptedCostSchema_1.scriptedCostSchemaMap },
    { pattern: '/common/scripted_effects/', schemaMap: scriptedEffectsSchema_1.scriptedEffectSchemaMap },
    { pattern: '/common/scripted_guis/', schemaMap: scriptedGuiSchema_1.scriptedGuiSchemaMap },
    { pattern: '/common/scripted_lists/', schemaMap: scriptedListSchema_1.scriptedListSchemaMap },
    { pattern: '/common/scripted_loc_values/', schemaMap: scriptedLocValueSchema_1.scriptedLocValueSchemaMap },
    { pattern: '/common/scripted_modifiers/', schemaMap: scriptedModifierSchema_1.scriptedModifierSchemaMap },
    { pattern: '/common/scripted_relations/', schemaMap: scriptedRelationSchema_1.scriptedRelationSchemaMap },
    { pattern: '/common/scripted_rules/', schemaMap: scriptedRulesSchema_1.scriptedRulesSchemaMap },
    { pattern: '/common/scripted_score_values/', schemaMap: scriptedScoreValueSchema_1.scriptedScoreValueSchemaMap },
    { pattern: '/common/scripted_spawns/', schemaMap: scriptedSpawnSchema_1.scriptedSpawnSchemaMap },
    { pattern: '/common/scripted_triggers/', schemaMap: scriptedTriggersSchema_1.scriptedTriggerSchemaMap },
    { pattern: '/common/secret_types/', schemaMap: secretSchema_1.secretSchemaMap },
    { pattern: '/common/special_buildings/', schemaMap: specialBuildingSchema_1.specialBuildingSchemaMap },
    { pattern: '/common/story_cycles/', schemaMap: storyCycleSchema_1.storyCycleSchemaMap },
    { pattern: '/common/struggle/', schemaMap: struggleSchema_1.struggleSchemaMap },
    { pattern: '/common/subject_contracts/', schemaMap: subjectContractSchema_1.subjectContractSchemaMap },
    { pattern: '/common/succession_election/', schemaMap: successionElectionSchema_1.successionElectionSchemaMap },
    { pattern: '/common/succession_laws/', schemaMap: successionLawSchema_1.successionLawSchemaMap },
    { pattern: '/common/succession_voting/', schemaMap: successionVotingSchema_1.successionVotingSchemaMap },
    { pattern: '/common/suggestions/', schemaMap: suggestionSchema_1.suggestionSchemaMap },
    { pattern: '/common/task_contracts/', schemaMap: taskContractSchema_1.taskContractSchemaMap },
    { pattern: '/common/tax_slots/', schemaMap: taxSlotSchema_1.taxSlotSchemaMap },
    { pattern: '/common/terrain_modifiers/', schemaMap: terrainModifierSchema_1.terrainModifierSchemaMap },
    { pattern: '/common/terrain_types/', schemaMap: terrainTypeSchema_1.terrainTypeSchemaMap },
    { pattern: '/common/title_colors/', schemaMap: titleColorSchema_1.titleColorSchemaMap },
    { pattern: '/common/title_flags/', schemaMap: titleFlagSchema_1.titleFlagSchemaMap },
    { pattern: '/common/traits/', schemaMap: traitSchema_2.traitSchemaMap },
    { pattern: '/common/travel/', schemaMap: travelSchema_1.travelSchemaMap },
    { pattern: '/common/trigger_localization/', schemaMap: triggerLocaleSchema_1.triggerLocaleSchemaMap },
    { pattern: '/common/triggered_outfits/', schemaMap: triggeredOutfitSchema_1.triggeredOutfitSchemaMap },
    { pattern: '/common/triggered_text/', schemaMap: triggeredTextSchema_1.triggeredTextSchemaMap },
    { pattern: '/common/tutorials/', schemaMap: tutorialSchema_1.tutorialSchemaMap },
    { pattern: '/common/vassal_contracts/', schemaMap: vassalContractSchema_1.vassalContractSchemaMap },
    { pattern: '/common/vassal_obligations/', schemaMap: vassalObligationSchema_1.vassalObligationSchemaMap },
    { pattern: '/common/vassal_stances/', schemaMap: vassalStanceSchema_1.vassalStanceSchemaMap },
    { pattern: '/common/war_contributions/', schemaMap: warContributionSchema_1.warContributionSchemaMap },
    { pattern: '/common/war_goals/', schemaMap: warGoalSchema_1.warGoalSchemaMap },
    // Other directories
    { pattern: '/gui/', schemaMap: guiTypeSchema_1.guiTypeSchemaMap },
    { pattern: '/localization/', schemaMap: localizationSchema_1.localizationSchemaMap },
    { pattern: '/music/', schemaMap: musicSchema_1.musicSchemaMap },
    { pattern: '/sound/', schemaMap: soundEffectSchema_1.soundEffectSchemaMap },
    { pattern: '/tests/', schemaMap: scriptedTestSchema_1.scriptedTestSchemaMap },
];
/**
 * Provides hover information for CK3 entity fields across all file types
 */
class CK3HoverProvider {
    provideHover(document, position, token) {
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
                if (fieldHover)
                    return fieldHover;
            }
            // Check if this is a value (after =)
            const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
            if (valueMatch && valueMatch[2] === word) {
                const valueHover = this.getValueHover(valueMatch[1], word, schemaMap);
                if (valueHover)
                    return valueHover;
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
            if (traitSchema_1.TRAIT_CATEGORIES.includes(word)) {
                return this.getTraitCategoryHover(word);
            }
            if (traitSchema_1.STATS.includes(word)) {
                // Check if this is a stat value (after =) or just the stat name
                const valueMatch = lineText.match(/^\s*(\w+)\s*=\s*(\S+)/);
                if (valueMatch && valueMatch[1] === word) {
                    // This is the field name, not a value
                    return this.getStatHover(word);
                }
                if (valueMatch && traitSchema_1.STATS.includes(valueMatch[1]) && valueMatch[2] === word) {
                    // This is a stat value
                    return this.getStatValueHover(valueMatch[1], word);
                }
                return this.getStatHover(word);
            }
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
    getSchemaMapForFile(fileName) {
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
    getFieldHover(fieldName, schemaMap) {
        const field = schemaMap.get(fieldName);
        if (!field)
            return null;
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
    getValueHover(fieldName, value, schemaMap) {
        const field = schemaMap.get(fieldName);
        if (!field)
            return null;
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
    getEffectHover(name) {
        const effect = data_1.effectsMap.get(name);
        if (!effect)
            return null;
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## ${name}\n\n`);
        markdown.appendMarkdown(`**Effect** - `);
        if (effect.isIterator) {
            markdown.appendMarkdown(`*Iterator*\n\n`);
        }
        else {
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
    getTriggerHover(name) {
        const trigger = data_2.triggersMap.get(name);
        if (!trigger)
            return null;
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## ${name}\n\n`);
        markdown.appendMarkdown(`**Trigger** - `);
        if (trigger.isIterator) {
            markdown.appendMarkdown(`*Iterator*\n\n`);
        }
        else if (trigger.valueType === 'boolean') {
            markdown.appendMarkdown(`*Boolean*\n\n`);
        }
        else if (trigger.valueType === 'comparison') {
            markdown.appendMarkdown(`*Comparison*\n\n`);
        }
        else {
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
    getTraitCategoryHover(category) {
        const descriptions = {
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
    getStatHover(stat) {
        const descriptions = {
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
    getStatValueHover(stat, value) {
        const numValue = parseInt(value);
        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`## ${stat} modifier: ${value}\n\n`);
        if (!isNaN(numValue)) {
            if (numValue > 0) {
                markdown.appendMarkdown(`Grants **+${numValue}** to ${stat}.\n\n`);
            }
            else if (numValue < 0) {
                markdown.appendMarkdown(`Reduces ${stat} by **${Math.abs(numValue)}**.\n\n`);
            }
            else {
                markdown.appendMarkdown(`No effect on ${stat}.\n\n`);
            }
            // Context for the value
            if (Math.abs(numValue) <= 1) {
                markdown.appendMarkdown('*Minor modifier*');
            }
            else if (Math.abs(numValue) <= 3) {
                markdown.appendMarkdown('*Moderate modifier*');
            }
            else if (Math.abs(numValue) <= 5) {
                markdown.appendMarkdown('*Significant modifier*');
            }
            else {
                markdown.appendMarkdown('*Major modifier*');
            }
        }
        return new vscode.Hover(markdown);
    }
}
exports.CK3HoverProvider = CK3HoverProvider;
//# sourceMappingURL=ck3HoverProvider.js.map