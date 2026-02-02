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
exports.CK3CompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
const traitSchema_1 = require("../schemas/traitSchema");
const data_1 = require("../data");
const eventSchema_1 = require("../schemas/eventSchema");
const decisionSchema_1 = require("../schemas/decisionSchema");
const interactionSchema_1 = require("../schemas/interactionSchema");
const onActionSchema_1 = require("../schemas/onActionSchema");
const schemeSchema_1 = require("../schemas/schemeSchema");
const buildingSchema_1 = require("../schemas/buildingSchema");
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
const terrainSchema_1 = require("../schemas/terrainSchema");
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
const interactionCategorySchema_1 = require("../schemas/interactionCategorySchema");
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
const struggleCatalystSchema_1 = require("../schemas/struggleCatalystSchema");
const travelDangerTypeSchema_1 = require("../schemas/travelDangerTypeSchema");
const travelOptionSchema_1 = require("../schemas/travelOptionSchema");
const hostageTypeSchema_1 = require("../schemas/hostageTypeSchema");
const diarchyMandateSchema_1 = require("../schemas/diarchyMandateSchema");
const levyDefinitionSchema_1 = require("../schemas/levyDefinitionSchema");
const titleRankSchema_1 = require("../schemas/titleRankSchema");
const ethnicGroupSchema_1 = require("../schemas/ethnicGroupSchema");
const cultureAestheticSchema_1 = require("../schemas/cultureAestheticSchema");
const coaColorSchema_1 = require("../schemas/coaColorSchema");
const successionParameterSchema_1 = require("../schemas/successionParameterSchema");
const domicileBuildingSchema_1 = require("../schemas/domicileBuildingSchema");
const travelerTypeSchema_1 = require("../schemas/travelerTypeSchema");
const strugglePhaseSchema_1 = require("../schemas/strugglePhaseSchema");
const legendTypeSchema_1 = require("../schemas/legendTypeSchema");
const administrativeDivisionSchema_1 = require("../schemas/administrativeDivisionSchema");
const cultureTraditionCategorySchema_1 = require("../schemas/cultureTraditionCategorySchema");
const imperialAdministrationSchema_1 = require("../schemas/imperialAdministrationSchema");
const courtEventSchema_1 = require("../schemas/courtEventSchema");
const cultureParameterSchema_1 = require("../schemas/cultureParameterSchema");
const titleNamingSchema_1 = require("../schemas/titleNamingSchema");
const siegeTypeSchema_1 = require("../schemas/siegeTypeSchema");
const commanderTraitSchema_1 = require("../schemas/commanderTraitSchema");
const realmLawCategorySchema_1 = require("../schemas/realmLawCategorySchema");
const governmentModifierSchema_1 = require("../schemas/governmentModifierSchema");
const artifactModifierSchema_1 = require("../schemas/artifactModifierSchema");
const dynastyPerkSchema_1 = require("../schemas/dynastyPerkSchema");
const chronicleEntrySchema_1 = require("../schemas/chronicleEntrySchema");
const vassalPowerSchema_1 = require("../schemas/vassalPowerSchema");
const realmSuccessionSchema_1 = require("../schemas/realmSuccessionSchema");
const governmentTypeModifierSchema_1 = require("../schemas/governmentTypeModifierSchema");
const economyModifierSchema_1 = require("../schemas/economyModifierSchema");
const cultureGroupSchema_1 = require("../schemas/cultureGroupSchema");
const pilgrimageTypeSchema_1 = require("../schemas/pilgrimageTypeSchema");
const casusBelliTypeSchema_1 = require("../schemas/casusBelliTypeSchema");
/**
 * Convert EffectDefinition to FieldSchema for completion provider compatibility
 */
function effectToFieldSchema(effect) {
    return {
        name: effect.name,
        type: effect.isIterator ? 'block' : (effect.outputScope ? 'block' : 'effect'),
        description: effect.description,
        example: effect.syntax,
    };
}
/**
 * Convert TriggerDefinition to FieldSchema for completion provider compatibility
 */
function triggerToFieldSchema(trigger) {
    return {
        name: trigger.name,
        type: trigger.valueType === 'block' || trigger.isIterator ? 'block' : 'trigger',
        description: trigger.description,
        example: trigger.syntax,
    };
}
/**
 * Get effect completions as FieldSchema array
 */
function getEffectSchemaForScope(scope = 'character') {
    return (0, data_1.getEffectsForScope)(scope).map(effectToFieldSchema);
}
/**
 * Get trigger completions as FieldSchema array
 */
function getTriggerSchemaForScope(scope = 'character') {
    return (0, data_1.getTriggersForScope)(scope).map(triggerToFieldSchema);
}
/**
 * Get all effects as FieldSchema array (unfiltered by scope)
 * Used for scope:X blocks where the target scope is unknown
 */
function getAllEffectsSchema() {
    return data_1.allEffects.map(effectToFieldSchema);
}
/**
 * Get all triggers as FieldSchema array (unfiltered by scope)
 * Used for scope:X blocks where the target scope is unknown
 */
function getAllTriggersSchema() {
    return data_1.allTriggers.map(triggerToFieldSchema);
}
/**
 * Known trigger block names (entry points into trigger context)
 */
const TRIGGER_BLOCKS = new Set([
    'trigger', 'is_shown', 'is_valid', 'is_valid_showing_failures_only',
    'ai_potential', 'ai_will_do', 'can_be_picked', 'can_pick',
    'is_highlighted', 'auto_accept', 'can_send', 'can_be_picked_artifact',
    'limit', 'modifier', // limit and modifier inside effects also contain triggers
]);
/**
 * Known effect block names (entry points into effect context)
 */
const EFFECT_BLOCKS = new Set([
    'immediate', 'effect', 'after', 'on_accept', 'on_decline',
    'on_send', 'on_auto_accept', 'option', 'hidden_effect',
    'on_use', 'on_expire', 'on_invalidated', // Hook effect blocks
    'on_discover', 'on_expose', // Secret effect blocks
]);
/**
 * Known modifier block names - these establish a modifier context
 * The value indicates the modifier category (character, county, province)
 */
const MODIFIER_BLOCKS = new Map([
    // Character modifier blocks
    ['modifier', 'character'], // Generic modifier block in traits
    ['character_modifier', 'character'], // Explicit character modifier
    ['culture_modifier', 'character'], // Culture-specific character modifier
    ['faith_modifier', 'character'], // Faith-specific character modifier
    ['track', 'character'], // XP track blocks contain modifiers
    // County modifier blocks
    ['county_modifier', 'county'],
    ['duchy_capital_county_modifier', 'county'],
    // Province modifier blocks
    ['province_modifier', 'province'],
]);
/**
 * Check if a block name is numeric (e.g., "50" in track = { 50 = { } })
 */
function isNumericBlock(block) {
    return /^\d+$/.test(block);
}
/**
 * Analyze blockPath to determine if we're in a modifier context.
 * Walks through the block path looking for modifier-establishing blocks.
 *
 * @param blockPath Array of block names from outermost to innermost
 * @returns Object indicating if we're in a modifier block and what category
 */
function analyzeModifierContext(blockPath) {
    let modifierCategory = null;
    let inMultiTrack = false;
    let multiTrackDepth = 0; // How many blocks deep we are after 'tracks'
    for (const block of blockPath) {
        // Check if this block establishes a modifier context
        const category = MODIFIER_BLOCKS.get(block);
        if (category) {
            modifierCategory = category;
            // Don't break - a later block might override (e.g., nested modifiers)
        }
        // Handle multi-track traits: tracks = { track_name = { 50 = { modifiers } } }
        if (block === 'tracks') {
            inMultiTrack = true;
            multiTrackDepth = 0;
            continue;
        }
        if (inMultiTrack) {
            multiTrackDepth++;
            // After 'tracks', first block is track name (skip), second+ blocks if numeric are modifier contexts
            if (multiTrackDepth >= 2 && isNumericBlock(block)) {
                modifierCategory = 'character';
            }
            continue;
        }
        // Numeric blocks inside a modifier context stay in that context
        // (e.g., track = { 50 = { learning = 2 } })
        if (isNumericBlock(block) && modifierCategory) {
            // Stay in modifier context
            continue;
        }
        // If we hit a trigger or effect block, we leave modifier context
        if (TRIGGER_BLOCKS.has(block) || EFFECT_BLOCKS.has(block)) {
            // Check if this is 'modifier' which is special - it's both a trigger container
            // AND a modifier context depending on usage
            if (block !== 'modifier') {
                modifierCategory = null;
            }
        }
    }
    return {
        inModifierBlock: modifierCategory !== null,
        modifierCategory,
    };
}
/**
 * Check if a block name is a scope:X pattern where we can't determine the target scope
 */
function isScopeReference(block) {
    return /^scope:[a-zA-Z_][a-zA-Z0-9_]*$/.test(block);
}
/**
 * Analyze blockPath to determine the current context type and scope.
 * Walks through the block path, tracking scope changes from iterators.
 *
 * @param blockPath Array of block names from outermost to innermost
 * @param initialScope The scope to start with (typically 'character' for events)
 * @returns Object with context type ('trigger' or 'effect') and current scope
 */
function analyzeBlockContext(blockPath, initialScope = 'character') {
    let contextType = 'unknown';
    let currentScope = initialScope;
    let unknownScope = false;
    for (const block of blockPath) {
        // Check if this block establishes a trigger or effect context
        if (TRIGGER_BLOCKS.has(block)) {
            contextType = 'trigger';
        }
        else if (EFFECT_BLOCKS.has(block)) {
            contextType = 'effect';
        }
        // Check if this is a scope:X reference - we can't determine the target scope
        if (isScopeReference(block)) {
            unknownScope = true;
            continue;
        }
        // Check if this block is a scope-changing trigger or effect
        // Look up in triggers first (for any_* iterators in trigger blocks)
        const trigger = data_1.triggersMap.get(block);
        if (trigger?.outputScope) {
            currentScope = trigger.outputScope;
            unknownScope = false; // Known scope again
            continue;
        }
        // Look up in effects (for every_* iterators in effect blocks)
        const effect = data_1.effectsMap.get(block);
        if (effect?.outputScope) {
            currentScope = effect.outputScope;
            unknownScope = false; // Known scope again
        }
    }
    return { type: contextType, scope: currentScope, unknownScope };
}
/**
 * Get completions for a block context - triggers or effects filtered by scope
 * If unknownScope is true, returns all completions without filtering
 */
function getSchemaForBlockContext(context) {
    if (context.type === 'trigger') {
        return context.unknownScope
            ? getAllTriggersSchema()
            : getTriggerSchemaForScope(context.scope);
    }
    else if (context.type === 'effect') {
        return context.unknownScope
            ? getAllEffectsSchema()
            : getEffectSchemaForScope(context.scope);
    }
    return [];
}
/**
 * Helper function to get schema for a file type that has trigger/effect blocks.
 * This handles the common pattern of checking for trigger/effect context within any entity.
 *
 * @param blockPath The current block path
 * @param topLevelSchema The schema to return at the top level
 * @param initialScope The scope to start with (default: 'character')
 * @returns The appropriate schema for the current context
 */
function getSchemaWithTriggerEffectBlocks(blockPath, topLevelSchema, initialScope = 'character') {
    if (blockPath.length === 0) {
        return topLevelSchema;
    }
    const blockContext = analyzeBlockContext(blockPath, initialScope);
    // Check for internal field schemas first (e.g., opinion = { target = ... value = ... })
    const internalFields = getInternalFieldSchema(blockPath, blockContext.type);
    if (internalFields) {
        return internalFields;
    }
    // If we're in a trigger or effect context, return appropriate completions
    if (blockContext.type !== 'unknown') {
        return getSchemaForBlockContext(blockContext);
    }
    // Fall back to top-level schema
    return topLevelSchema;
}
/**
 * Internal field schemas for specific triggers that take block values
 * These are triggers that aren't iterators but have their own internal structure
 */
const TRIGGER_INTERNAL_FIELDS = new Map([
    ['opinion', [
            { name: 'target', type: 'string', description: 'The character to check opinion of (scope reference)', required: true },
            { name: 'value', type: 'integer', description: 'Opinion threshold (e.g., value >= 50, value <= -20, value = { 10 50 })' },
        ]],
    ['reverse_opinion', [
            { name: 'target', type: 'string', description: 'The character whose opinion to check (scope reference)', required: true },
            { name: 'value', type: 'integer', description: 'Opinion threshold (e.g., value >= 50)' },
        ]],
    ['has_opinion_modifier', [
            { name: 'target', type: 'string', description: 'The character to check opinion modifier on (scope reference)' },
            { name: 'modifier', type: 'string', description: 'The opinion modifier to check for', required: true },
            { name: 'value', type: 'integer', description: 'Optional value comparison' },
        ]],
    ['reverse_has_opinion_modifier', [
            { name: 'target', type: 'string', description: 'The character to check opinion modifier on (scope reference)' },
            { name: 'modifier', type: 'string', description: 'The opinion modifier to check for', required: true },
            { name: 'value', type: 'integer', description: 'Optional value comparison' },
        ]],
    ['is_at_war_with', [
            { name: 'target', type: 'string', description: 'The character to check war status with (scope reference)', required: true },
        ]],
    ['has_relation_flag', [
            { name: 'target', type: 'string', description: 'The character to check relation with (scope reference)', required: true },
            { name: 'flag', type: 'string', description: 'The relation flag to check for', required: true },
        ]],
    ['has_secret', [
            { name: 'type', type: 'string', description: 'The secret type' },
            { name: 'target', type: 'string', description: 'Target of the secret (scope reference)' },
        ]],
    ['can_join_faction', [
            { name: 'faction', type: 'string', description: 'The faction type', required: true },
            { name: 'target', type: 'string', description: 'Target character for the faction (scope reference)' },
        ]],
    ['has_character_flag', [
            { name: 'flag', type: 'string', description: 'The flag name', required: true },
            { name: 'days', type: 'integer', description: 'Minimum days the flag has been set' },
        ]],
    ['time_of_year', [
            { name: 'month', type: 'integer', description: 'Month (1-12)' },
            { name: 'day', type: 'integer', description: 'Day of month' },
        ]],
]);
/**
 * Internal field schemas for specific effects that take block values
 */
const EFFECT_INTERNAL_FIELDS = new Map([
    ['add_opinion', [
            { name: 'target', type: 'string', description: 'The character to modify opinion of (scope reference)', required: true },
            { name: 'modifier', type: 'string', description: 'The opinion modifier to add', required: true },
            { name: 'opinion', type: 'integer', description: 'Opinion value (if not using modifier)' },
            { name: 'years', type: 'integer', description: 'Duration in years' },
            { name: 'months', type: 'integer', description: 'Duration in months' },
            { name: 'days', type: 'integer', description: 'Duration in days' },
        ]],
    ['reverse_add_opinion', [
            { name: 'target', type: 'string', description: 'The character whose opinion to modify (scope reference)', required: true },
            { name: 'modifier', type: 'string', description: 'The opinion modifier to add', required: true },
            { name: 'opinion', type: 'integer', description: 'Opinion value (if not using modifier)' },
        ]],
    ['remove_opinion', [
            { name: 'target', type: 'string', description: 'The character to remove opinion modifier from (scope reference)', required: true },
            { name: 'modifier', type: 'string', description: 'The opinion modifier to remove', required: true },
        ]],
    ['save_scope_as', [
            { name: 'name', type: 'string', description: 'Name to save the scope as (access via scope:name)' },
        ]],
    ['save_temporary_scope_as', [
            { name: 'name', type: 'string', description: 'Name to save the scope as temporarily' },
        ]],
    ['set_variable', [
            { name: 'name', type: 'string', description: 'Variable name', required: true },
            { name: 'value', type: 'integer', description: 'Value to set', required: true },
            { name: 'days', type: 'integer', description: 'Duration in days before expiring' },
            { name: 'years', type: 'integer', description: 'Duration in years before expiring' },
            { name: 'months', type: 'integer', description: 'Duration in months before expiring' },
        ]],
    ['change_variable', [
            { name: 'name', type: 'string', description: 'Variable name', required: true },
            { name: 'add', type: 'integer', description: 'Value to add' },
            { name: 'subtract', type: 'integer', description: 'Value to subtract' },
            { name: 'multiply', type: 'integer', description: 'Value to multiply by' },
            { name: 'divide', type: 'integer', description: 'Value to divide by' },
        ]],
    ['trigger_event', [
            { name: 'id', type: 'string', description: 'Event ID to trigger', required: true },
            { name: 'days', type: 'integer', description: 'Delay in days' },
            { name: 'months', type: 'integer', description: 'Delay in months' },
            { name: 'years', type: 'integer', description: 'Delay in years' },
            { name: 'on_action', type: 'string', description: 'On action to trigger instead of specific event' },
        ]],
    ['add_character_flag', [
            { name: 'flag', type: 'string', description: 'Flag name', required: true },
            { name: 'days', type: 'integer', description: 'Duration in days' },
            { name: 'months', type: 'integer', description: 'Duration in months' },
            { name: 'years', type: 'integer', description: 'Duration in years' },
        ]],
    ['remove_character_flag', [
            { name: 'flag', type: 'string', description: 'Flag name to remove', required: true },
        ]],
    ['create_character', [
            { name: 'name', type: 'string', description: 'Character name' },
            { name: 'age', type: 'integer', description: 'Age in years' },
            { name: 'gender', type: 'enum', description: 'male or female', values: ['male', 'female'] },
            { name: 'culture', type: 'string', description: 'Culture scope reference' },
            { name: 'faith', type: 'string', description: 'Faith scope reference' },
            { name: 'dynasty', type: 'string', description: 'Dynasty to assign (scope reference)' },
            { name: 'father', type: 'string', description: 'Father character (scope reference)' },
            { name: 'mother', type: 'string', description: 'Mother character (scope reference)' },
            { name: 'employer', type: 'string', description: 'Employer - makes them a courtier (scope reference)' },
            { name: 'location', type: 'string', description: 'Province location (scope reference)' },
            { name: 'save_scope_as', type: 'string', description: 'Save reference as scope' },
            { name: 'trait', type: 'string', description: 'Trait to add' },
        ]],
    ['death', [
            { name: 'death_reason', type: 'string', description: 'Death reason identifier', required: true },
            { name: 'killer', type: 'string', description: 'Character who killed them (scope reference)' },
        ]],
    ['add_trait', [
            { name: 'trait', type: 'string', description: 'Trait to add', required: true },
            { name: 'track', type: 'string', description: 'Track for the trait (if applicable)' },
            { name: 'value', type: 'integer', description: 'Track value' },
        ]],
    ['if', [
            { name: 'limit', type: 'trigger', description: 'Trigger conditions for this branch', required: true },
        ]],
    ['else_if', [
            { name: 'limit', type: 'trigger', description: 'Trigger conditions for this branch', required: true },
        ]],
]);
/**
 * Check if we're inside a trigger/effect that has internal fields
 * Returns the internal field schema if found, null otherwise
 */
function getInternalFieldSchema(blockPath, contextType) {
    if (blockPath.length === 0)
        return null;
    const lastBlock = blockPath[blockPath.length - 1];
    // Check trigger internal fields
    if (contextType === 'trigger' || contextType === 'unknown') {
        const triggerFields = TRIGGER_INTERNAL_FIELDS.get(lastBlock);
        if (triggerFields)
            return triggerFields;
    }
    // Check effect internal fields
    if (contextType === 'effect' || contextType === 'unknown') {
        const effectFields = EFFECT_INTERNAL_FIELDS.get(lastBlock);
        if (effectFields)
            return effectFields;
    }
    return null;
}
/**
 * Unified completion provider for all CK3 file types
 */
class CK3CompletionProvider {
    provideCompletionItems(document, position, token, context) {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        // Determine file type from path
        const fileType = this.getFileType(document.fileName);
        if (fileType === 'unknown') {
            return null;
        }
        // Analyze context
        const parseContext = this.analyzeContext(document, position, fileType);
        if (parseContext.afterEquals) {
            return this.getValueCompletions(parseContext, fileType);
        }
        if (parseContext.insideBlock) {
            return this.getFieldCompletions(linePrefix, parseContext, fileType);
        }
        // Top level completions
        if (linePrefix.trim() === '') {
            return this.getTopLevelCompletions(fileType);
        }
        return null;
    }
    /**
     * Determine file type from path
     */
    getFileType(filePath) {
        if (filePath.includes('/common/traits/') || filePath.includes('\\common\\traits\\')) {
            return 'trait';
        }
        if (filePath.includes('/events/') || filePath.includes('\\events\\')) {
            return 'event';
        }
        if (filePath.includes('/common/decisions/') || filePath.includes('\\common\\decisions\\')) {
            return 'decision';
        }
        if (filePath.includes('/common/character_interactions/') || filePath.includes('\\common\\character_interactions\\')) {
            return 'interaction';
        }
        if (filePath.includes('/common/on_actions/') || filePath.includes('\\common\\on_actions\\')) {
            return 'on_action';
        }
        if (filePath.includes('/common/schemes/') || filePath.includes('\\common\\schemes\\')) {
            return 'scheme';
        }
        if (filePath.includes('/common/buildings/') || filePath.includes('\\common\\buildings\\')) {
            return 'building';
        }
        if (filePath.includes('/common/men_at_arms_types/') || filePath.includes('\\common\\men_at_arms_types\\')) {
            return 'men_at_arms';
        }
        if (filePath.includes('/common/casus_belli_types/') || filePath.includes('\\common\\casus_belli_types\\')) {
            return 'casus_belli';
        }
        if (filePath.includes('/common/culture/cultures/') || filePath.includes('\\common\\culture\\cultures\\')) {
            return 'culture';
        }
        if (filePath.includes('/common/culture/traditions/') || filePath.includes('\\common\\culture\\traditions\\')) {
            return 'tradition';
        }
        if (filePath.includes('/common/religion/religions/') || filePath.includes('\\common\\religion\\religions\\')) {
            return 'religion';
        }
        if (filePath.includes('/common/scripted_effects/') || filePath.includes('\\common\\scripted_effects\\')) {
            return 'scripted_effect';
        }
        if (filePath.includes('/common/scripted_triggers/') || filePath.includes('\\common\\scripted_triggers\\')) {
            return 'scripted_trigger';
        }
        if (filePath.includes('/common/artifacts/') || filePath.includes('\\common\\artifacts\\')) {
            return 'artifact';
        }
        if (filePath.includes('/common/court_positions/') || filePath.includes('\\common\\court_positions\\')) {
            return 'court_position';
        }
        if (filePath.includes('/common/lifestyles/') || filePath.includes('\\common\\lifestyles\\')) {
            return 'lifestyle';
        }
        if (filePath.includes('/common/focuses/') || filePath.includes('\\common\\focuses\\')) {
            return 'focus';
        }
        if (filePath.includes('/common/perks/') || filePath.includes('\\common\\perks\\')) {
            return 'perk';
        }
        if (filePath.includes('/common/dynasty_legacies/') || filePath.includes('\\common\\dynasty_legacies\\')) {
            return 'dynasty_legacy';
        }
        if (filePath.includes('/common/modifiers/') || filePath.includes('\\common\\modifiers\\')) {
            return 'modifier';
        }
        if (filePath.includes('/common/laws/') || filePath.includes('\\common\\laws\\')) {
            return 'law';
        }
        if (filePath.includes('/common/governments/') || filePath.includes('\\common\\governments\\')) {
            return 'government';
        }
        if (filePath.includes('/common/factions/') || filePath.includes('\\common\\factions\\')) {
            return 'faction';
        }
        if (filePath.includes('/common/council_tasks/') || filePath.includes('\\common\\council_tasks\\')) {
            return 'council_task';
        }
        if (filePath.includes('/common/opinion_modifiers/') || filePath.includes('\\common\\opinion_modifiers\\')) {
            return 'opinion_modifier';
        }
        if (filePath.includes('/common/secret_types/') || filePath.includes('\\common\\secret_types\\')) {
            return 'secret';
        }
        if (filePath.includes('/common/nicknames/') || filePath.includes('\\common\\nicknames\\')) {
            return 'nickname';
        }
        if (filePath.includes('/common/script_values/') || filePath.includes('\\common\\script_values\\')) {
            return 'script_value';
        }
        if (filePath.includes('/common/hook_types/') || filePath.includes('\\common\\hook_types\\')) {
            return 'hook';
        }
        if (filePath.includes('/common/activities/') || filePath.includes('\\common\\activities\\')) {
            return 'activity';
        }
        if (filePath.includes('/common/game_rules/') || filePath.includes('\\common\\game_rules\\')) {
            return 'game_rule';
        }
        if (filePath.includes('/common/bookmarks/') || filePath.includes('\\common\\bookmarks\\')) {
            return 'bookmark';
        }
        if (filePath.includes('/common/story_cycles/') || filePath.includes('\\common\\story_cycles\\')) {
            return 'story_cycle';
        }
        if (filePath.includes('/common/important_actions/') || filePath.includes('\\common\\important_actions\\')) {
            return 'important_action';
        }
        if (filePath.includes('/common/vassal_contracts/') || filePath.includes('\\common\\vassal_contracts\\')) {
            return 'vassal_contract';
        }
        if (filePath.includes('/common/landed_titles/') || filePath.includes('\\common\\landed_titles\\')) {
            return 'landed_title';
        }
        if (filePath.includes('/common/coat_of_arms/') || filePath.includes('\\common\\coat_of_arms\\')) {
            return 'coat_of_arms';
        }
        if (filePath.includes('/common/culture/innovations/') || filePath.includes('\\common\\culture\\innovations\\')) {
            return 'innovation';
        }
        if (filePath.includes('/common/religion/doctrines/') || filePath.includes('\\common\\religion\\doctrines\\')) {
            return 'doctrine';
        }
        if (filePath.includes('/common/religion/holy_sites/') || filePath.includes('\\common\\religion\\holy_sites\\')) {
            return 'holy_site';
        }
        if (filePath.includes('/common/holdings/') || filePath.includes('\\common\\holdings\\')) {
            return 'holding';
        }
        if (filePath.includes('/common/dynasties/') || filePath.includes('\\common\\dynasties\\')) {
            return 'dynasty';
        }
        if (filePath.includes('/history/characters/') || filePath.includes('\\history\\characters\\')) {
            return 'character_history';
        }
        if (filePath.includes('/common/terrain_types/') || filePath.includes('\\common\\terrain_types\\')) {
            return 'terrain';
        }
        if (filePath.includes('/common/scripted_guis/') || filePath.includes('\\common\\scripted_guis\\')) {
            return 'scripted_gui';
        }
        if (filePath.includes('/common/customizable_localization/') || filePath.includes('\\common\\customizable_localization\\')) {
            return 'custom_localization';
        }
        if (filePath.includes('/common/flavorization/') || filePath.includes('\\common\\flavorization\\')) {
            return 'flavorization';
        }
        if (filePath.includes('/common/deathreasons/') || filePath.includes('\\common\\deathreasons\\')) {
            return 'deathreasons';
        }
        if (filePath.includes('/common/succession_election/') || filePath.includes('\\common\\succession_election\\')) {
            return 'succession_election';
        }
        if (filePath.includes('/common/scripted_relations/') || filePath.includes('\\common\\scripted_relations\\')) {
            return 'scripted_relation';
        }
        if (filePath.includes('/common/named_colors/') || filePath.includes('\\common\\named_colors\\')) {
            return 'named_colors';
        }
        if (filePath.includes('/common/event_backgrounds/') || filePath.includes('\\common\\event_backgrounds\\')) {
            return 'event_background';
        }
        if (filePath.includes('/common/pool_character_selectors/') || filePath.includes('\\common\\pool_character_selectors\\')) {
            return 'pool_selector';
        }
        if (filePath.includes('/common/scripted_modifiers/') || filePath.includes('\\common\\scripted_modifiers\\')) {
            return 'scripted_modifier';
        }
        if (filePath.includes('/common/scripted_rules/') || filePath.includes('\\common\\scripted_rules\\')) {
            return 'scripted_rules';
        }
        if (filePath.includes('/common/game_concepts/') || filePath.includes('\\common\\game_concepts\\')) {
            return 'game_concept';
        }
        if (filePath.includes('/common/messages/') || filePath.includes('\\common\\messages\\')) {
            return 'message';
        }
        if (filePath.includes('/common/scripted_lists/') || filePath.includes('\\common\\scripted_lists\\')) {
            return 'scripted_list';
        }
        if (filePath.includes('/history/titles/') || filePath.includes('\\history\\titles\\')) {
            return 'title_history';
        }
        if (filePath.includes('/common/accolade_types/') || filePath.includes('\\common\\accolade_types\\')) {
            return 'accolade_type';
        }
        if (filePath.includes('/common/character_memory_types/') || filePath.includes('\\common\\character_memory_types\\')) {
            return 'character_memory';
        }
        if (filePath.includes('/common/court_amenities/') || filePath.includes('\\common\\court_amenities\\')) {
            return 'court_amenity';
        }
        if (filePath.includes('/common/dynasty_houses/') || filePath.includes('\\common\\dynasty_houses\\')) {
            return 'dynasty_house';
        }
        if (filePath.includes('/common/legends/') || filePath.includes('\\common\\legends\\')) {
            return 'legend';
        }
        if (filePath.includes('/common/travel/') || filePath.includes('\\common\\travel\\')) {
            return 'travel';
        }
        if (filePath.includes('/common/struggle/') || filePath.includes('\\common\\struggle\\')) {
            return 'struggle';
        }
        if (filePath.includes('/common/inspirations/') || filePath.includes('\\common\\inspirations\\')) {
            return 'inspiration';
        }
        if (filePath.includes('/common/diarchies/') || filePath.includes('\\common\\diarchies\\')) {
            return 'diarchy';
        }
        if (filePath.includes('/common/domiciles/') || filePath.includes('\\common\\domiciles\\')) {
            return 'domicile';
        }
        if (filePath.includes('/common/great_projects/') || filePath.includes('\\common\\great_projects\\')) {
            return 'great_project';
        }
        if (filePath.includes('/common/epidemics/') || filePath.includes('\\common\\epidemics\\')) {
            return 'epidemic';
        }
        if (filePath.includes('/common/house_unities/') || filePath.includes('\\common\\house_unities\\')) {
            return 'house_unity';
        }
        if (filePath.includes('/common/legitimacy/') || filePath.includes('\\common\\legitimacy\\')) {
            return 'legitimacy';
        }
        if (filePath.includes('/common/tax_slots/') || filePath.includes('\\common\\tax_slots\\')) {
            return 'tax_slot';
        }
        if (filePath.includes('/common/vassal_stances/') || filePath.includes('\\common\\vassal_stances\\')) {
            return 'vassal_stance';
        }
        if (filePath.includes('/common/suggestions/') || filePath.includes('\\common\\suggestions\\')) {
            return 'suggestion';
        }
        if (filePath.includes('/common/scripted_costs/') || filePath.includes('\\common\\scripted_costs\\')) {
            return 'scripted_cost';
        }
        if (filePath.includes('/common/scripted_animations/') || filePath.includes('\\common\\scripted_animations\\')) {
            return 'scripted_animation';
        }
        if (filePath.includes('/common/scripted_character_templates/') || filePath.includes('\\common\\scripted_character_templates\\')) {
            return 'scripted_character_template';
        }
        if (filePath.includes('/common/event_themes/') || filePath.includes('\\common\\event_themes\\')) {
            return 'event_theme';
        }
        if (filePath.includes('/common/casus_belli_groups/') || filePath.includes('\\common\\casus_belli_groups\\')) {
            return 'casus_belli_group';
        }
        if (filePath.includes('/common/ai_war_stances/') || filePath.includes('\\common\\ai_war_stances\\')) {
            return 'ai_war_stance';
        }
        if (filePath.includes('/common/combat_phase_events/') || filePath.includes('\\common\\combat_phase_events\\')) {
            return 'combat_phase_event';
        }
        if (filePath.includes('/common/bookmark_portraits/') || filePath.includes('\\common\\bookmark_portraits\\')) {
            return 'bookmark_portrait';
        }
        if (filePath.includes('/common/guest_system/') || filePath.includes('\\common\\guest_system\\')) {
            return 'guest_system';
        }
        if (filePath.includes('/common/courtier_guest_management/') || filePath.includes('\\common\\courtier_guest_management\\')) {
            return 'courtier_guest_management';
        }
        if (filePath.includes('/common/task_contracts/') || filePath.includes('\\common\\task_contracts\\')) {
            return 'task_contract';
        }
        if (filePath.includes('/common/subject_contracts/') || filePath.includes('\\common\\subject_contracts\\')) {
            return 'subject_contract';
        }
        if (filePath.includes('/common/lease_contracts/') || filePath.includes('\\common\\lease_contracts\\')) {
            return 'lease_contract';
        }
        if (filePath.includes('/common/character_backgrounds/') || filePath.includes('\\common\\character_backgrounds\\')) {
            return 'character_background';
        }
        if (filePath.includes('/common/dna_data/') || filePath.includes('\\common\\dna_data\\')) {
            return 'dna_data';
        }
        if (filePath.includes('/gfx/portraits/portrait_modifiers/') || filePath.includes('\\gfx\\portraits\\portrait_modifiers\\')) {
            return 'portrait_modifier';
        }
        if (filePath.includes('/common/nickname_rules/') || filePath.includes('\\common\\nickname_rules\\')) {
            return 'nickname_rule';
        }
        if (filePath.includes('/common/succession_laws/') || filePath.includes('\\common\\succession_laws\\')) {
            return 'succession_law';
        }
        if (filePath.includes('/common/war_goals/') || filePath.includes('\\common\\war_goals\\')) {
            return 'war_goal';
        }
        if (filePath.includes('/gfx/portraits/scripted_illustrations/') || filePath.includes('\\gfx\\portraits\\scripted_illustrations\\')) {
            return 'scripted_illustration';
        }
        if (filePath.includes('/common/map_modes/') || filePath.includes('\\common\\map_modes\\')) {
            return 'map_mode';
        }
        if (filePath.includes('/history/provinces/') || filePath.includes('\\history\\provinces\\')) {
            return 'province_history';
        }
        if (filePath.includes('/map_data/regions/') || filePath.includes('\\map_data\\regions\\')) {
            return 'region';
        }
        if (filePath.includes('/common/scripted_score_values/') || filePath.includes('\\common\\scripted_score_values\\')) {
            return 'scripted_score_value';
        }
        if (filePath.includes('/common/ai_personalities/') || filePath.includes('\\common\\ai_personalities\\')) {
            return 'ai_personality';
        }
        if (filePath.includes('/common/defines/') || filePath.includes('\\common\\defines\\')) {
            return 'defines';
        }
        if (filePath.includes('/common/scripted_loc_values/') || filePath.includes('\\common\\scripted_loc_values\\')) {
            return 'scripted_loc_value';
        }
        if (filePath.includes('/common/character_interaction_categories/') || filePath.includes('\\common\\character_interaction_categories\\')) {
            return 'interaction_category';
        }
        if (filePath.includes('/common/county_culture/') || filePath.includes('\\common\\county_culture\\')) {
            return 'county_culture';
        }
        if (filePath.includes('/common/playable_difficulties/') || filePath.includes('\\common\\playable_difficulties\\')) {
            return 'playable_difficulty';
        }
        if (filePath.includes('/common/province_setup/') || filePath.includes('\\common\\province_setup\\')) {
            return 'province_setup';
        }
        if (filePath.includes('/common/scripted_spawns/') || filePath.includes('\\common\\scripted_spawns\\')) {
            return 'scripted_spawn';
        }
        if (filePath.includes('/common/court_position_categories/') || filePath.includes('\\common\\court_position_categories\\')) {
            return 'court_position_category';
        }
        if (filePath.includes('/common/activity_locales/') || filePath.includes('\\common\\activity_locales\\')) {
            return 'activity_locale';
        }
        if (filePath.includes('/common/culture/eras/') || filePath.includes('\\common\\culture\\eras\\')) {
            return 'culture_era';
        }
        if (filePath.includes('/common/culture/name_lists/') || filePath.includes('\\common\\culture\\name_lists\\')) {
            return 'name_list';
        }
        if (filePath.includes('/common/relation_flags/') || filePath.includes('\\common\\relation_flags\\')) {
            return 'relation_flag';
        }
        if (filePath.includes('/common/terrain_types/') || filePath.includes('\\common\\terrain_types\\')) {
            return 'terrain_type';
        }
        if (filePath.includes('/common/holding_types/') || filePath.includes('\\common\\holding_types\\')) {
            return 'holding_type';
        }
        if (filePath.includes('/common/men_at_arms_types/definitions/') || filePath.includes('\\common\\men_at_arms_types\\definitions\\')) {
            return 'men_at_arms_type';
        }
        if (filePath.includes('/common/combat_phase_types/') || filePath.includes('\\common\\combat_phase_types\\')) {
            return 'combat_phase';
        }
        if (filePath.includes('/common/inspiration_types/') || filePath.includes('\\common\\inspiration_types\\')) {
            return 'inspiration_type';
        }
        if (filePath.includes('/common/court_types/') || filePath.includes('\\common\\court_types\\')) {
            return 'court_type';
        }
        if (filePath.includes('/common/culture/pillars/') || filePath.includes('\\common\\culture\\pillars\\')) {
            return 'culture_pillar';
        }
        if (filePath.includes('/common/culture/heritage/') || filePath.includes('\\common\\culture\\heritage\\')) {
            return 'heritage';
        }
        if (filePath.includes('/common/culture/languages/') || filePath.includes('\\common\\culture\\languages\\')) {
            return 'language';
        }
        if (filePath.includes('/common/culture/martial_customs/') || filePath.includes('\\common\\culture\\martial_customs\\')) {
            return 'martial_custom';
        }
        if (filePath.includes('/common/culture/ethos/') || filePath.includes('\\common\\culture\\ethos\\')) {
            return 'ethos';
        }
        if (filePath.includes('/gfx/scripted/') || filePath.includes('\\gfx\\scripted\\')) {
            return 'scripted_gfx';
        }
        if (filePath.includes('/common/game_starts/') || filePath.includes('\\common\\game_starts\\')) {
            return 'game_start';
        }
        if (filePath.includes('/common/character_templates/') || filePath.includes('\\common\\character_templates\\')) {
            return 'character_template';
        }
        if (filePath.includes('/common/trigger_localization/') || filePath.includes('\\common\\trigger_localization\\')) {
            return 'trigger_locale';
        }
        if (filePath.includes('/common/effect_localization/') || filePath.includes('\\common\\effect_localization\\')) {
            return 'effect_locale';
        }
        if (filePath.includes('/music/') || filePath.includes('\\music\\')) {
            return 'music';
        }
        if (filePath.includes('/sound/') || filePath.includes('\\sound\\')) {
            return 'sound_effect';
        }
        if (filePath.includes('/gfx/portraits/cameras/') || filePath.includes('\\gfx\\portraits\\cameras\\')) {
            return 'portrait_camera';
        }
        if (filePath.includes('/gfx/portraits/genes/') || filePath.includes('\\gfx\\portraits\\genes\\')) {
            return 'gene';
        }
        if (filePath.includes('/gfx/portraits/accessories/') || filePath.includes('\\gfx\\portraits\\accessories\\')) {
            return 'accessory';
        }
        if (filePath.includes('/common/coat_of_arms/templates/') || filePath.includes('\\common\\coat_of_arms\\templates\\')) {
            return 'coa_template';
        }
        if (filePath.includes('/common/achievements/') || filePath.includes('\\common\\achievements\\')) {
            return 'achievement';
        }
        if (filePath.includes('/tests/') || filePath.includes('\\tests\\')) {
            return 'scripted_test';
        }
        if (filePath.includes('/common/tutorials/') || filePath.includes('\\common\\tutorials\\')) {
            return 'tutorial';
        }
        if (filePath.includes('/map_data/') || filePath.includes('\\map_data\\')) {
            return 'map_object';
        }
        if (filePath.includes('/common/loading_tips/') || filePath.includes('\\common\\loading_tips\\')) {
            return 'loading_tip';
        }
        if (filePath.includes('/gui/') || filePath.includes('\\gui\\')) {
            return 'gui_type';
        }
        if (filePath.includes('/localization/') || filePath.includes('\\localization\\')) {
            return 'localization';
        }
        if (filePath.includes('/common/regiments/') || filePath.includes('\\common\\regiments\\')) {
            return 'regiment';
        }
        if (filePath.includes('/common/title_colors/') || filePath.includes('\\common\\title_colors\\')) {
            return 'title_color';
        }
        if (filePath.includes('/common/character_interaction_categories/') || filePath.includes('\\common\\character_interaction_categories\\')) {
            return 'character_interaction_category';
        }
        if (filePath.includes('/common/dlc_features/') || filePath.includes('\\common\\dlc_features\\')) {
            return 'dlc_feature';
        }
        if (filePath.includes('/common/ai_budgets/') || filePath.includes('\\common\\ai_budgets\\')) {
            return 'ai_budget';
        }
        if (filePath.includes('/common/special_buildings/') || filePath.includes('\\common\\special_buildings\\')) {
            return 'special_building';
        }
        if (filePath.includes('/common/triggered_text/') || filePath.includes('\\common\\triggered_text\\')) {
            return 'triggered_text';
        }
        if (filePath.includes('/common/pool_generation_rules/') || filePath.includes('\\common\\pool_generation_rules\\')) {
            return 'pool_generation_rule';
        }
        if (filePath.includes('/common/ai_tasks/') || filePath.includes('\\common\\ai_tasks\\')) {
            return 'ai_task';
        }
        if (filePath.includes('/common/artifact_templates/') || filePath.includes('\\common\\artifact_templates\\')) {
            return 'artifact_template';
        }
        if (filePath.includes('/coat_of_arms/patterns/') || filePath.includes('\\coat_of_arms\\patterns\\')) {
            return 'coa_pattern';
        }
        if (filePath.includes('/coat_of_arms/emblems/') || filePath.includes('\\coat_of_arms\\emblems\\')) {
            return 'coa_emblem';
        }
        if (filePath.includes('/common/culture_name_lists/') || filePath.includes('\\common\\culture_name_lists\\')) {
            return 'culture_name_list';
        }
        if (filePath.includes('/common/artifact_visuals/') || filePath.includes('\\common\\artifact_visuals\\')) {
            return 'artifact_visual';
        }
        if (filePath.includes('/common/artifact_rarities/') || filePath.includes('\\common\\artifact_rarities\\')) {
            return 'artifact_rarity';
        }
        if (filePath.includes('/common/climate/') || filePath.includes('\\common\\climate\\') || filePath.includes('/map/climate/') || filePath.includes('\\map\\climate\\')) {
            return 'climate';
        }
        if (filePath.includes('/common/terrain_modifiers/') || filePath.includes('\\common\\terrain_modifiers\\')) {
            return 'terrain_modifier';
        }
        if (filePath.includes('/common/succession_voting/') || filePath.includes('\\common\\succession_voting\\')) {
            return 'succession_voting';
        }
        if (filePath.includes('/common/character_flags/') || filePath.includes('\\common\\character_flags\\')) {
            return 'character_flag';
        }
        if (filePath.includes('/common/title_flags/') || filePath.includes('\\common\\title_flags\\')) {
            return 'title_flag';
        }
        if (filePath.includes('/common/province_modifiers/') || filePath.includes('\\common\\province_modifiers\\')) {
            return 'province_modifier';
        }
        if (filePath.includes('/common/lifestyle_perk_trees/') || filePath.includes('\\common\\lifestyle_perk_trees\\')) {
            return 'lifestyle_perk_tree';
        }
        if (filePath.includes('/common/building_slots/') || filePath.includes('\\common\\building_slots\\')) {
            return 'building_slot';
        }
        if (filePath.includes('/common/artifact_slots/') || filePath.includes('\\common\\artifact_slots\\')) {
            return 'artifact_slot';
        }
        if (filePath.includes('/common/mercenary_companies/') || filePath.includes('\\common\\mercenary_companies\\')) {
            return 'mercenary_company';
        }
        if (filePath.includes('/common/holy_orders/') || filePath.includes('\\common\\holy_orders\\')) {
            return 'holy_order';
        }
        if (filePath.includes('/common/war_contributions/') || filePath.includes('\\common\\war_contributions\\')) {
            return 'war_contribution';
        }
        if (filePath.includes('/common/army_templates/') || filePath.includes('\\common\\army_templates\\')) {
            return 'army_template';
        }
        if (filePath.includes('/common/combat_effects/') || filePath.includes('\\common\\combat_effects\\')) {
            return 'combat_effect';
        }
        if (filePath.includes('/common/vassal_obligations/') || filePath.includes('\\common\\vassal_obligations\\')) {
            return 'vassal_obligation';
        }
        if (filePath.includes('/common/triggered_outfits/') || filePath.includes('\\common\\triggered_outfits\\')) {
            return 'triggered_outfit';
        }
        if (filePath.includes('/common/portrait_types/') || filePath.includes('\\common\\portrait_types\\')) {
            return 'portrait_type';
        }
        if (filePath.includes('/common/court_grandeur_levels/') || filePath.includes('\\common\\court_grandeur_levels\\')) {
            return 'court_grandeur_level';
        }
        if (filePath.includes('/common/amenity_levels/') || filePath.includes('\\common\\amenity_levels\\')) {
            return 'amenity_level';
        }
        if (filePath.includes('/common/artifact_features/') || filePath.includes('\\common\\artifact_features\\')) {
            return 'artifact_feature';
        }
        if (filePath.includes('/common/execution_methods/') || filePath.includes('\\common\\execution_methods\\')) {
            return 'execution_method';
        }
        if (filePath.includes('/common/punishments/') || filePath.includes('\\common\\punishments\\')) {
            return 'punishment';
        }
        if (filePath.includes('/common/struggle_catalysts/') || filePath.includes('\\common\\struggle_catalysts\\')) {
            return 'struggle_catalyst';
        }
        if (filePath.includes('/common/travel_danger_types/') || filePath.includes('\\common\\travel_danger_types\\')) {
            return 'travel_danger_type';
        }
        if (filePath.includes('/common/travel_options/') || filePath.includes('\\common\\travel_options\\')) {
            return 'travel_option';
        }
        if (filePath.includes('/common/hostage_types/') || filePath.includes('\\common\\hostage_types\\')) {
            return 'hostage_type';
        }
        if (filePath.includes('/common/diarchy_mandates/') || filePath.includes('\\common\\diarchy_mandates\\')) {
            return 'diarchy_mandate';
        }
        if (filePath.includes('/common/levy_definitions/') || filePath.includes('\\common\\levy_definitions\\')) {
            return 'levy_definition';
        }
        if (filePath.includes('/common/title_ranks/') || filePath.includes('\\common\\title_ranks\\')) {
            return 'title_rank';
        }
        if (filePath.includes('/common/ethnic_groups/') || filePath.includes('\\common\\ethnic_groups\\')) {
            return 'ethnic_group';
        }
        if (filePath.includes('/common/culture_aesthetics/') || filePath.includes('\\common\\culture_aesthetics\\')) {
            return 'culture_aesthetic';
        }
        if (filePath.includes('/common/coat_of_arms/colors/') || filePath.includes('\\common\\coat_of_arms\\colors\\')) {
            return 'coa_color';
        }
        if (filePath.includes('/common/succession_parameters/') || filePath.includes('\\common\\succession_parameters\\')) {
            return 'succession_parameter';
        }
        if (filePath.includes('/common/domicile_buildings/') || filePath.includes('\\common\\domicile_buildings\\')) {
            return 'domicile_building';
        }
        if (filePath.includes('/common/traveler_types/') || filePath.includes('\\common\\traveler_types\\')) {
            return 'traveler_type';
        }
        if (filePath.includes('/common/struggle_phases/') || filePath.includes('\\common\\struggle_phases\\')) {
            return 'struggle_phase';
        }
        if (filePath.includes('/common/legend_types/') || filePath.includes('\\common\\legend_types\\')) {
            return 'legend_type';
        }
        if (filePath.includes('/common/administrative_divisions/') || filePath.includes('\\common\\administrative_divisions\\')) {
            return 'administrative_division';
        }
        if (filePath.includes('/common/culture/tradition_categories/') || filePath.includes('\\common\\culture\\tradition_categories\\')) {
            return 'culture_tradition_category';
        }
        if (filePath.includes('/common/imperial_administrations/') || filePath.includes('\\common\\imperial_administrations\\')) {
            return 'imperial_administration';
        }
        if (filePath.includes('/common/court_events/') || filePath.includes('\\common\\court_events\\')) {
            return 'court_event';
        }
        if (filePath.includes('/common/culture/parameters/') || filePath.includes('\\common\\culture\\parameters\\')) {
            return 'culture_parameter';
        }
        if (filePath.includes('/common/title_naming/') || filePath.includes('\\common\\title_naming\\')) {
            return 'title_naming';
        }
        if (filePath.includes('/common/siege_types/') || filePath.includes('\\common\\siege_types\\')) {
            return 'siege_type';
        }
        if (filePath.includes('/common/commander_traits/') || filePath.includes('\\common\\commander_traits\\')) {
            return 'commander_trait';
        }
        if (filePath.includes('/common/realm_law_categories/') || filePath.includes('\\common\\realm_law_categories\\')) {
            return 'realm_law_category';
        }
        if (filePath.includes('/common/government_modifiers/') || filePath.includes('\\common\\government_modifiers\\')) {
            return 'government_modifier';
        }
        if (filePath.includes('/common/artifact_modifiers/') || filePath.includes('\\common\\artifact_modifiers\\')) {
            return 'artifact_modifier';
        }
        if (filePath.includes('/common/dynasty_perks/') || filePath.includes('\\common\\dynasty_perks\\')) {
            return 'dynasty_perk';
        }
        if (filePath.includes('/common/chronicle_entries/') || filePath.includes('\\common\\chronicle_entries\\')) {
            return 'chronicle_entry';
        }
        if (filePath.includes('/common/vassal_powers/') || filePath.includes('\\common\\vassal_powers\\')) {
            return 'vassal_power';
        }
        if (filePath.includes('/common/realm_successions/') || filePath.includes('\\common\\realm_successions\\')) {
            return 'realm_succession';
        }
        if (filePath.includes('/common/government_type_modifiers/') || filePath.includes('\\common\\government_type_modifiers\\')) {
            return 'government_type_modifier';
        }
        if (filePath.includes('/common/economy_modifiers/') || filePath.includes('\\common\\economy_modifiers\\')) {
            return 'economy_modifier';
        }
        if (filePath.includes('/common/culture_groups/') || filePath.includes('\\common\\culture_groups\\')) {
            return 'culture_group';
        }
        if (filePath.includes('/common/pilgrimage_types/') || filePath.includes('\\common\\pilgrimage_types\\')) {
            return 'pilgrimage_type';
        }
        if (filePath.includes('/common/casus_belli_types/') || filePath.includes('\\common\\casus_belli_types\\')) {
            return 'casus_belli_type';
        }
        return 'unknown';
    }
    /**
     * Analyze context for any file type
     */
    analyzeContext(document, position, fileType) {
        const lineText = document.lineAt(position).text;
        const linePrefix = lineText.substring(0, position.character);
        // Get brace depth and block path
        const { depth, blockPath } = this.getBraceDepthAndPath(document, position);
        // Check if we're after an = sign
        const equalsMatch = linePrefix.match(/^\s*(\w+)\s*=\s*$/);
        if (equalsMatch) {
            return {
                insideBlock: depth >= 1,
                afterEquals: true,
                fieldName: equalsMatch[1],
                braceDepth: depth,
                blockPath,
            };
        }
        // Check if we're partially typing a value after =
        const partialValueMatch = linePrefix.match(/^\s*(\w+)\s*=\s*(\S*)$/);
        if (partialValueMatch) {
            return {
                insideBlock: depth >= 1,
                afterEquals: true,
                fieldName: partialValueMatch[1],
                partialValue: partialValueMatch[2],
                braceDepth: depth,
                blockPath,
            };
        }
        return {
            insideBlock: depth >= 1,
            afterEquals: false,
            braceDepth: depth,
            blockPath,
        };
    }
    /**
     * Get brace depth and block path
     */
    getBraceDepthAndPath(document, position) {
        let depth = 0;
        const blockStack = [];
        for (let i = 0; i <= position.line; i++) {
            const line = document.lineAt(i).text;
            const endChar = i === position.line ? position.character : line.length;
            // Track positions of all "field = {" patterns on this line
            // so we know which field name corresponds to which opening brace
            // Pattern matches: identifier, prefix:identifier (scope:X, var:X, etc.), or numeric values
            const fieldPositions = [];
            const fieldPattern = /((?:\w+:)?\w+)\s*=\s*\{/g;
            let fieldMatch;
            while ((fieldMatch = fieldPattern.exec(line)) !== null) {
                // Find the position of the '{' in this match
                const bracePos = fieldMatch.index + fieldMatch[0].length - 1;
                if (bracePos < endChar) {
                    fieldPositions.push({ name: fieldMatch[1], bracePos });
                }
            }
            let fieldPosIndex = 0;
            for (let j = 0; j < endChar; j++) {
                if (line[j] === '#')
                    break; // Skip comments
                if (line[j] === '{') {
                    depth++;
                    // Check if this brace has an associated field name
                    if (fieldPosIndex < fieldPositions.length && fieldPositions[fieldPosIndex].bracePos === j) {
                        if (depth > 1) {
                            blockStack.push(fieldPositions[fieldPosIndex].name);
                        }
                        fieldPosIndex++;
                    }
                }
                if (line[j] === '}') {
                    depth--;
                    if (blockStack.length > 0 && depth >= 1) {
                        blockStack.pop();
                    }
                }
            }
        }
        return { depth, blockPath: blockStack };
    }
    /**
     * Get schema for a file type and context
     */
    getSchemaForContext(fileType, blockPath) {
        // Check for modifier context first (works across many file types)
        const modifierContext = analyzeModifierContext(blockPath);
        if (modifierContext.inModifierBlock) {
            switch (modifierContext.modifierCategory) {
                case 'character':
                    return traitSchema_1.modifierBlockSchema;
                case 'county':
                    return traitSchema_1.countyModifierValuesSchema;
                case 'province':
                    return traitSchema_1.provinceModifierValuesSchema;
            }
        }
        switch (fileType) {
            case 'trait':
                return (0, traitSchema_1.getSchemaForContext)(blockPath);
            case 'event':
                if (blockPath.length === 0) {
                    return eventSchema_1.eventSchema;
                }
                const lastBlock = blockPath[blockPath.length - 1];
                if (['left_portrait', 'right_portrait', 'center_portrait', 'lower_left_portrait', 'lower_center_portrait', 'lower_right_portrait'].includes(lastBlock)) {
                    return eventSchema_1.portraitBlockSchema;
                }
                // Analyze the block path for scope-aware completions
                {
                    const blockContext = analyzeBlockContext(blockPath, 'character');
                    // Check for internal field schemas first (e.g., opinion = { target = ... value = ... })
                    const internalFields = getInternalFieldSchema(blockPath, blockContext.type);
                    if (internalFields) {
                        return internalFields;
                    }
                    // If we're directly inside an option block, combine option fields with effect completions
                    if (lastBlock === 'option') {
                        const effectSchema = getSchemaForBlockContext({ ...blockContext, type: 'effect' });
                        return [...eventSchema_1.eventOptionSchema, ...effectSchema];
                    }
                    if (blockContext.type !== 'unknown') {
                        return getSchemaForBlockContext(blockContext);
                    }
                }
                // Check if we're inside an option (options contain effects)
                if (blockPath.includes('option') && blockPath.length > 1) {
                    const blockContext = analyzeBlockContext(blockPath, 'character');
                    // Check for internal field schemas first
                    const internalFields = getInternalFieldSchema(blockPath, blockContext.type);
                    if (internalFields) {
                        return internalFields;
                    }
                    return getSchemaForBlockContext({ ...blockContext, type: 'effect' });
                }
                return eventSchema_1.eventSchema;
            case 'decision':
                if (blockPath.length === 0) {
                    return decisionSchema_1.decisionSchema;
                }
                const decisionLastBlock = blockPath[blockPath.length - 1];
                if (decisionLastBlock === 'cost' || decisionLastBlock === 'minimum_cost') {
                    return decisionSchema_1.costBlockSchema;
                }
                // Analyze the block path for scope-aware completions
                {
                    const blockContext = analyzeBlockContext(blockPath, 'character');
                    // Check for internal field schemas first (e.g., opinion = { target = ... value = ... })
                    const internalFields = getInternalFieldSchema(blockPath, blockContext.type);
                    if (internalFields) {
                        return internalFields;
                    }
                    if (blockContext.type !== 'unknown') {
                        return getSchemaForBlockContext(blockContext);
                    }
                }
                return decisionSchema_1.decisionSchema;
            case 'interaction':
                return getSchemaWithTriggerEffectBlocks(blockPath, interactionSchema_1.interactionSchema);
            case 'on_action':
                return getSchemaWithTriggerEffectBlocks(blockPath, onActionSchema_1.onActionSchema);
            case 'scheme':
                return getSchemaWithTriggerEffectBlocks(blockPath, schemeSchema_1.schemeSchema);
            case 'building':
                // Modifier blocks are handled globally above
                return getSchemaWithTriggerEffectBlocks(blockPath, buildingSchema_1.buildingSchema);
            case 'men_at_arms':
                return getSchemaWithTriggerEffectBlocks(blockPath, menAtArmsSchema_1.menAtArmsSchema);
            case 'casus_belli':
                return getSchemaWithTriggerEffectBlocks(blockPath, casusBelliSchema_1.casusBelliSchema);
            case 'culture':
                return getSchemaWithTriggerEffectBlocks(blockPath, cultureSchema_1.cultureSchema);
            case 'tradition':
                return getSchemaWithTriggerEffectBlocks(blockPath, cultureSchema_1.traditionSchema);
            case 'religion':
                // Religion files can contain both religions and faiths
                // Check block path to determine context
                if (blockPath.length > 0) {
                    const parent = blockPath[blockPath.length - 1];
                    if (parent === 'faiths') {
                        return getSchemaWithTriggerEffectBlocks(blockPath, faithSchema_1.faithSchema);
                    }
                }
                return getSchemaWithTriggerEffectBlocks(blockPath, faithSchema_1.religionSchema);
            case 'scripted_effect':
                // Scripted effects: the body is effects, not schema fields
                if (blockPath.length === 0) {
                    return scriptedEffectsSchema_1.scriptedEffectSchema;
                }
                {
                    // Inside a scripted effect, we're always in effect context
                    const blockContext = analyzeBlockContext(blockPath, 'character');
                    const internalFields = getInternalFieldSchema(blockPath, 'effect');
                    if (internalFields) {
                        return internalFields;
                    }
                    // Default to effects (the body of a scripted effect is effects)
                    return getEffectSchemaForScope(blockContext.scope);
                }
            case 'scripted_trigger':
                // Scripted triggers: the body is triggers, not schema fields
                if (blockPath.length === 0) {
                    return scriptedTriggersSchema_1.scriptedTriggerSchema;
                }
                {
                    // Inside a scripted trigger, we're always in trigger context
                    const blockContext = analyzeBlockContext(blockPath, 'character');
                    const internalFields = getInternalFieldSchema(blockPath, 'trigger');
                    if (internalFields) {
                        return internalFields;
                    }
                    // Default to triggers (the body of a scripted trigger is triggers)
                    return getTriggerSchemaForScope(blockContext.scope);
                }
            case 'artifact':
                return getSchemaWithTriggerEffectBlocks(blockPath, artifactSchema_1.artifactSchema);
            case 'court_position':
                return getSchemaWithTriggerEffectBlocks(blockPath, courtPositionSchema_1.courtPositionSchema);
            case 'lifestyle':
                return getSchemaWithTriggerEffectBlocks(blockPath, lifestyleSchema_1.lifestyleSchema);
            case 'focus':
                return getSchemaWithTriggerEffectBlocks(blockPath, lifestyleSchema_1.focusSchema);
            case 'perk':
                return getSchemaWithTriggerEffectBlocks(blockPath, lifestyleSchema_1.perkSchema);
            case 'dynasty_legacy':
                return getSchemaWithTriggerEffectBlocks(blockPath, dynastyLegacySchema_1.dynastyLegacySchema);
            case 'modifier':
                // Modifiers are mostly stat definitions, but can have triggers
                return getSchemaWithTriggerEffectBlocks(blockPath, modifierSchema_1.modifierSchema);
            case 'law':
                return getSchemaWithTriggerEffectBlocks(blockPath, lawSchema_1.lawSchema);
            case 'government':
                return getSchemaWithTriggerEffectBlocks(blockPath, governmentSchema_1.governmentSchema);
            case 'faction':
                return getSchemaWithTriggerEffectBlocks(blockPath, factionSchema_1.factionSchema);
            case 'council_task':
                return getSchemaWithTriggerEffectBlocks(blockPath, councilTaskSchema_1.councilTaskSchema);
            case 'opinion_modifier':
                return opinionModifierSchema_1.opinionModifierSchema;
            case 'secret':
                return getSchemaWithTriggerEffectBlocks(blockPath, secretSchema_1.secretSchema, 'secret');
            case 'nickname':
                return getSchemaWithTriggerEffectBlocks(blockPath, nicknameSchema_1.nicknameSchema);
            case 'script_value':
                // Script values use triggers for conditional math
                return getSchemaWithTriggerEffectBlocks(blockPath, scriptValueSchema_1.scriptValueSchema);
            case 'hook':
                return hookSchema_1.hookSchema;
            case 'activity':
                return getSchemaWithTriggerEffectBlocks(blockPath, activitySchema_1.activitySchema);
            case 'game_rule':
                return gameRuleSchema_1.gameRuleSchema;
            case 'bookmark':
                return bookmarkSchema_1.bookmarkSchema;
            case 'story_cycle':
                return getSchemaWithTriggerEffectBlocks(blockPath, storyCycleSchema_1.storyCycleSchema);
            case 'important_action':
                return getSchemaWithTriggerEffectBlocks(blockPath, importantActionSchema_1.importantActionSchema);
            case 'vassal_contract':
                return getSchemaWithTriggerEffectBlocks(blockPath, vassalContractSchema_1.vassalContractSchema);
            case 'landed_title':
                return getSchemaWithTriggerEffectBlocks(blockPath, landedTitleSchema_1.landedTitleSchema);
            case 'coat_of_arms':
                return coatOfArmsSchema_1.coatOfArmsSchema;
            case 'innovation':
                return getSchemaWithTriggerEffectBlocks(blockPath, innovationSchema_1.innovationSchema);
            case 'doctrine':
                return getSchemaWithTriggerEffectBlocks(blockPath, doctrineSchema_1.doctrineSchema);
            case 'holy_site':
                return getSchemaWithTriggerEffectBlocks(blockPath, holySiteSchema_1.holySiteSchema);
            case 'holding':
                return getSchemaWithTriggerEffectBlocks(blockPath, holdingSchema_1.holdingSchema);
            case 'dynasty':
                return dynastySchema_1.dynastySchema;
            case 'character_history':
                return getSchemaWithTriggerEffectBlocks(blockPath, characterHistorySchema_1.characterHistorySchema);
            case 'terrain':
                return terrainSchema_1.terrainSchema;
            case 'scripted_gui':
                return getSchemaWithTriggerEffectBlocks(blockPath, scriptedGuiSchema_1.scriptedGuiSchema);
            case 'custom_localization':
                return getSchemaWithTriggerEffectBlocks(blockPath, customLocalizationSchema_1.customLocalizationSchema);
            case 'flavorization':
                return flavorizationSchema_1.flavorizationSchema;
            case 'deathreasons':
                return deathreasonsSchema_1.deathreasonsSchema;
            case 'succession_election':
                return getSchemaWithTriggerEffectBlocks(blockPath, successionElectionSchema_1.successionElectionSchema);
            case 'scripted_relation':
                return scriptedRelationSchema_1.scriptedRelationSchema;
            case 'named_colors':
                return namedColorsSchema_1.namedColorsSchema;
            case 'event_background':
                return eventBackgroundSchema_1.eventBackgroundSchema;
            case 'pool_selector':
                return getSchemaWithTriggerEffectBlocks(blockPath, poolSelectorSchema_1.poolSelectorSchema);
            case 'scripted_modifier':
                return getSchemaWithTriggerEffectBlocks(blockPath, scriptedModifierSchema_1.scriptedModifierSchema);
            case 'scripted_rules':
                return getSchemaWithTriggerEffectBlocks(blockPath, scriptedRulesSchema_1.scriptedRulesSchema);
            case 'game_concept':
                return gameConceptSchema_1.gameConceptSchema;
            case 'message':
                return getSchemaWithTriggerEffectBlocks(blockPath, messageSchema_1.messageSchema);
            case 'scripted_list':
                return getSchemaWithTriggerEffectBlocks(blockPath, scriptedListSchema_1.scriptedListSchema);
            case 'title_history':
                return getSchemaWithTriggerEffectBlocks(blockPath, titleHistorySchema_1.titleHistorySchema);
            case 'accolade_type':
                return getSchemaWithTriggerEffectBlocks(blockPath, accoladeTypeSchema_1.accoladeTypeSchema);
            case 'character_memory':
                return getSchemaWithTriggerEffectBlocks(blockPath, characterMemorySchema_1.characterMemorySchema);
            case 'court_amenity':
                return getSchemaWithTriggerEffectBlocks(blockPath, courtAmenitySchema_1.courtAmenitySchema);
            case 'dynasty_house':
                return dynastyHouseSchema_1.dynastyHouseSchema;
            case 'legend':
                return getSchemaWithTriggerEffectBlocks(blockPath, legendSchema_1.legendSchema);
            case 'travel':
                return getSchemaWithTriggerEffectBlocks(blockPath, travelSchema_1.travelSchema);
            case 'struggle':
                return getSchemaWithTriggerEffectBlocks(blockPath, struggleSchema_1.struggleSchema);
            case 'inspiration':
                return getSchemaWithTriggerEffectBlocks(blockPath, inspirationSchema_1.inspirationSchema);
            case 'diarchy':
                return getSchemaWithTriggerEffectBlocks(blockPath, diarchySchema_1.diarchySchema);
            case 'domicile':
                return getSchemaWithTriggerEffectBlocks(blockPath, domicileSchema_1.domicileSchema);
            case 'great_project':
                return getSchemaWithTriggerEffectBlocks(blockPath, greatProjectSchema_1.greatProjectSchema);
            case 'epidemic':
                return getSchemaWithTriggerEffectBlocks(blockPath, epidemicSchema_1.epidemicSchema);
            case 'house_unity':
                return getSchemaWithTriggerEffectBlocks(blockPath, houseUnitySchema_1.houseUnitySchema);
            case 'legitimacy':
                return getSchemaWithTriggerEffectBlocks(blockPath, legitimacySchema_1.legitimacySchema);
            case 'tax_slot':
                return getSchemaWithTriggerEffectBlocks(blockPath, taxSlotSchema_1.taxSlotSchema);
            case 'vassal_stance':
                return getSchemaWithTriggerEffectBlocks(blockPath, vassalStanceSchema_1.vassalStanceSchema);
            case 'suggestion':
                return getSchemaWithTriggerEffectBlocks(blockPath, suggestionSchema_1.suggestionSchema);
            case 'scripted_cost':
                return scriptedCostSchema_1.scriptedCostSchema;
            case 'scripted_animation':
                return scriptedAnimationSchema_1.scriptedAnimationSchema;
            case 'scripted_character_template':
                return getSchemaWithTriggerEffectBlocks(blockPath, scriptedCharacterTemplateSchema_1.scriptedCharacterTemplateSchema);
            case 'event_theme':
                return eventThemeSchema_1.eventThemeSchema;
            case 'casus_belli_group':
                return casusBelliGroupSchema_1.casusBelliGroupSchema;
            case 'ai_war_stance':
                return getSchemaWithTriggerEffectBlocks(blockPath, aiWarStanceSchema_1.aiWarStanceSchema);
            case 'combat_phase_event':
                return getSchemaWithTriggerEffectBlocks(blockPath, combatPhaseEventSchema_1.combatPhaseEventSchema);
            case 'bookmark_portrait':
                return bookmarkPortraitSchema_1.bookmarkPortraitSchema;
            case 'guest_system':
                return getSchemaWithTriggerEffectBlocks(blockPath, guestSystemSchema_1.guestSystemSchema);
            case 'courtier_guest_management':
                return getSchemaWithTriggerEffectBlocks(blockPath, courtierGuestManagementSchema_1.courtierGuestManagementSchema);
            case 'task_contract':
                return getSchemaWithTriggerEffectBlocks(blockPath, taskContractSchema_1.taskContractSchema);
            case 'subject_contract':
                return getSchemaWithTriggerEffectBlocks(blockPath, subjectContractSchema_1.subjectContractSchema);
            case 'lease_contract':
                return getSchemaWithTriggerEffectBlocks(blockPath, leaseContractSchema_1.leaseContractSchema);
            case 'character_background':
                return getSchemaWithTriggerEffectBlocks(blockPath, characterBackgroundSchema_1.characterBackgroundSchema);
            case 'dna_data':
                return dnaDataSchema_1.dnaDataSchema;
            case 'portrait_modifier':
                return portraitModifierSchema_1.portraitModifierSchema;
            case 'nickname_rule':
                return nicknameRuleSchema_1.nicknameRuleSchema;
            case 'succession_law':
                return successionLawSchema_1.successionLawSchema;
            case 'war_goal':
                return warGoalSchema_1.warGoalSchema;
            case 'scripted_illustration':
                return scriptedIllustrationSchema_1.scriptedIllustrationSchema;
            case 'map_mode':
                return mapModeSchema_1.mapModeSchema;
            case 'province_history':
                return provinceHistorySchema_1.provinceHistorySchema;
            case 'region':
                return regionSchema_1.regionSchema;
            case 'scripted_score_value':
                return scriptedScoreValueSchema_1.scriptedScoreValueSchema;
            case 'ai_personality':
                return aiPersonalitySchema_1.aiPersonalitySchema;
            case 'defines':
                return definesSchema_1.definesSchema;
            case 'scripted_loc_value':
                return scriptedLocValueSchema_1.scriptedLocValueSchema;
            case 'interaction_category':
                return interactionCategorySchema_1.interactionCategorySchema;
            case 'county_culture':
                return countyCultureSchema_1.countyCultureSchema;
            case 'playable_difficulty':
                return playableDifficultySchema_1.playableDifficultySchema;
            case 'province_setup':
                return provinceSetupSchema_1.provinceSetupSchema;
            case 'scripted_spawn':
                return scriptedSpawnSchema_1.scriptedSpawnSchema;
            case 'court_position_category':
                return courtPositionCategorySchema_1.courtPositionCategorySchema;
            case 'activity_locale':
                return activityLocaleSchema_1.activityLocaleSchema;
            case 'culture_era':
                return cultureEraSchema_1.cultureEraSchema;
            case 'name_list':
                return nameListSchema_1.nameListSchema;
            case 'relation_flag':
                return relationFlagSchema_1.relationFlagSchema;
            case 'terrain_type':
                return terrainTypeSchema_1.terrainTypeSchema;
            case 'holding_type':
                return holdingTypeSchema_1.holdingTypeSchema;
            case 'men_at_arms_type':
                return menAtArmsTypeSchema_1.menAtArmsTypeSchema;
            case 'combat_phase':
                return combatPhaseSchema_1.combatPhaseSchema;
            case 'inspiration_type':
                return inspirationTypeSchema_1.inspirationTypeSchema;
            case 'court_type':
                return courtTypeSchema_1.courtTypeSchema;
            case 'culture_pillar':
                return culturePillarSchema_1.culturePillarSchema;
            case 'heritage':
                return heritageSchema_1.heritageSchema;
            case 'language':
                return languageSchema_1.languageSchema;
            case 'martial_custom':
                return martialCustomSchema_1.martialCustomSchema;
            case 'ethos':
                return ethosSchema_1.ethosSchema;
            case 'scripted_gfx':
                return scriptedGfxSchema_1.scriptedGfxSchema;
            case 'game_start':
                return gameStartSchema_1.gameStartSchema;
            case 'character_template':
                return characterTemplateSchema_1.characterTemplateSchema;
            case 'trigger_locale':
                return triggerLocaleSchema_1.triggerLocaleSchema;
            case 'effect_locale':
                return effectLocaleSchema_1.effectLocaleSchema;
            case 'music':
                return musicSchema_1.musicSchema;
            case 'sound_effect':
                return soundEffectSchema_1.soundEffectSchema;
            case 'portrait_camera':
                return portraitCameraSchema_1.portraitCameraSchema;
            case 'gene':
                return geneSchema_1.geneSchema;
            case 'accessory':
                return accessorySchema_1.accessorySchema;
            case 'coa_template':
                return coaTemplateSchema_1.coaTemplateSchema;
            case 'achievement':
                return achievementSchema_1.achievementSchema;
            case 'scripted_test':
                return scriptedTestSchema_1.scriptedTestSchema;
            case 'tutorial':
                return tutorialSchema_1.tutorialSchema;
            case 'map_object':
                return mapObjectSchema_1.mapObjectSchema;
            case 'loading_tip':
                return loadingTipSchema_1.loadingTipSchema;
            case 'gui_type':
                return guiTypeSchema_1.guiTypeSchema;
            case 'localization':
                return localizationSchema_1.localizationSchema;
            case 'regiment':
                return regimentSchema_1.regimentSchema;
            case 'title_color':
                return titleColorSchema_1.titleColorSchema;
            case 'character_interaction_category':
                return characterInteractionCategorySchema_1.characterInteractionCategorySchema;
            case 'dlc_feature':
                return dlcFeatureSchema_1.dlcFeatureSchema;
            case 'ai_budget':
                return aiBudgetSchema_1.aiBudgetSchema;
            case 'special_building':
                return specialBuildingSchema_1.specialBuildingSchema;
            case 'triggered_text':
                return triggeredTextSchema_1.triggeredTextSchema;
            case 'pool_generation_rule':
                return poolGenerationRuleSchema_1.poolGenerationRuleSchema;
            case 'ai_task':
                return aiTaskSchema_1.aiTaskSchema;
            case 'artifact_template':
                return artifactTemplateSchema_1.artifactTemplateSchema;
            case 'coa_pattern':
                return coaPatternSchema_1.coaPatternSchema;
            case 'coa_emblem':
                return coaEmblemSchema_1.coaEmblemSchema;
            case 'culture_name_list':
                return cultureNameListSchema_1.cultureNameListSchema;
            case 'artifact_visual':
                return artifactVisualSchema_1.artifactVisualSchema;
            case 'artifact_rarity':
                return artifactRaritySchema_1.artifactRaritySchema;
            case 'climate':
                return climateSchema_1.climateSchema;
            case 'terrain_modifier':
                return terrainModifierSchema_1.terrainModifierSchema;
            case 'succession_voting':
                return successionVotingSchema_1.successionVotingSchema;
            case 'character_flag':
                return characterFlagSchema_1.characterFlagSchema;
            case 'title_flag':
                return titleFlagSchema_1.titleFlagSchema;
            case 'province_modifier':
                return provinceModifierSchema_1.provinceModifierSchema;
            case 'lifestyle_perk_tree':
                return lifestylePerkTreeSchema_1.lifestylePerkTreeSchema;
            case 'building_slot':
                return buildingSlotSchema_1.buildingSlotSchema;
            case 'artifact_slot':
                return artifactSlotSchema_1.artifactSlotSchema;
            case 'mercenary_company':
                return mercenaryCompanySchema_1.mercenaryCompanySchema;
            case 'holy_order':
                return holyOrderSchema_1.holyOrderSchema;
            case 'war_contribution':
                return warContributionSchema_1.warContributionSchema;
            case 'army_template':
                return armyTemplateSchema_1.armyTemplateSchema;
            case 'combat_effect':
                return combatEffectSchema_1.combatEffectSchema;
            case 'vassal_obligation':
                return vassalObligationSchema_1.vassalObligationSchema;
            case 'triggered_outfit':
                return triggeredOutfitSchema_1.triggeredOutfitSchema;
            case 'portrait_type':
                return portraitTypeSchema_1.portraitTypeSchema;
            case 'court_grandeur_level':
                return courtGrandeurLevelSchema_1.courtGrandeurLevelSchema;
            case 'amenity_level':
                return amenityLevelSchema_1.amenityLevelSchema;
            case 'artifact_feature':
                return artifactFeatureSchema_1.artifactFeatureSchema;
            case 'execution_method':
                return executionMethodSchema_1.executionMethodSchema;
            case 'punishment':
                return punishmentSchema_1.punishmentSchema;
            case 'struggle_catalyst':
                return struggleCatalystSchema_1.struggleCatalystSchema;
            case 'travel_danger_type':
                return travelDangerTypeSchema_1.travelDangerTypeSchema;
            case 'travel_option':
                return travelOptionSchema_1.travelOptionSchema;
            case 'hostage_type':
                return hostageTypeSchema_1.hostageTypeSchema;
            case 'diarchy_mandate':
                return diarchyMandateSchema_1.diarchyMandateSchema;
            case 'levy_definition':
                return levyDefinitionSchema_1.levyDefinitionSchema;
            case 'title_rank':
                return titleRankSchema_1.titleRankSchema;
            case 'ethnic_group':
                return ethnicGroupSchema_1.ethnicGroupSchema;
            case 'culture_aesthetic':
                return cultureAestheticSchema_1.cultureAestheticSchema;
            case 'coa_color':
                return coaColorSchema_1.coaColorSchema;
            case 'succession_parameter':
                return successionParameterSchema_1.successionParameterSchema;
            case 'domicile_building':
                return domicileBuildingSchema_1.domicileBuildingSchema;
            case 'traveler_type':
                return travelerTypeSchema_1.travelerTypeSchema;
            case 'struggle_phase':
                return strugglePhaseSchema_1.strugglePhaseSchema;
            case 'legend_type':
                return legendTypeSchema_1.legendTypeSchema;
            case 'administrative_division':
                return administrativeDivisionSchema_1.administrativeDivisionSchema;
            case 'culture_tradition_category':
                return cultureTraditionCategorySchema_1.cultureTraditionCategorySchema;
            case 'imperial_administration':
                return imperialAdministrationSchema_1.imperialAdministrationSchema;
            case 'court_event':
                return courtEventSchema_1.courtEventSchema;
            case 'culture_parameter':
                return cultureParameterSchema_1.cultureParameterSchema;
            case 'title_naming':
                return titleNamingSchema_1.titleNamingSchema;
            case 'siege_type':
                return siegeTypeSchema_1.siegeTypeSchema;
            case 'commander_trait':
                return commanderTraitSchema_1.commanderTraitSchema;
            case 'realm_law_category':
                return realmLawCategorySchema_1.realmLawCategorySchema;
            case 'government_modifier':
                return governmentModifierSchema_1.governmentModifierSchema;
            case 'artifact_modifier':
                return artifactModifierSchema_1.artifactModifierSchema;
            case 'dynasty_perk':
                return dynastyPerkSchema_1.dynastyPerkSchema;
            case 'chronicle_entry':
                return chronicleEntrySchema_1.chronicleEntrySchema;
            case 'vassal_power':
                return vassalPowerSchema_1.vassalPowerSchema;
            case 'realm_succession':
                return realmSuccessionSchema_1.realmSuccessionSchema;
            case 'government_type_modifier':
                return governmentTypeModifierSchema_1.governmentTypeModifierSchema;
            case 'economy_modifier':
                return economyModifierSchema_1.economyModifierSchema;
            case 'culture_group':
                return cultureGroupSchema_1.cultureGroupSchema;
            case 'pilgrimage_type':
                return pilgrimageTypeSchema_1.pilgrimageTypeSchema;
            case 'casus_belli_type':
                return casusBelliTypeSchema_1.casusBelliTypeSchema;
            default:
                return [];
        }
    }
    /**
     * Get schema map for a file type and context
     */
    getSchemaMapForContext(fileType, blockPath) {
        switch (fileType) {
            case 'trait':
                return (0, traitSchema_1.getSchemaMapForContext)(blockPath);
            case 'event':
                if (blockPath.length === 0) {
                    return eventSchema_1.eventSchemaMap;
                }
                const lastBlock = blockPath[blockPath.length - 1];
                if (lastBlock === 'option') {
                    return eventSchema_1.eventOptionSchemaMap;
                }
                if (['left_portrait', 'right_portrait', 'center_portrait', 'lower_left_portrait', 'lower_center_portrait', 'lower_right_portrait'].includes(lastBlock)) {
                    return eventSchema_1.portraitBlockSchemaMap;
                }
                return eventSchema_1.eventSchemaMap;
            case 'decision':
                if (blockPath.length > 0 && (blockPath[blockPath.length - 1] === 'cost' || blockPath[blockPath.length - 1] === 'minimum_cost')) {
                    return decisionSchema_1.costBlockSchemaMap;
                }
                return decisionSchema_1.decisionSchemaMap;
            case 'interaction':
                return interactionSchema_1.interactionSchemaMap;
            case 'on_action':
                return onActionSchema_1.onActionSchemaMap;
            case 'scheme':
                return schemeSchema_1.schemeSchemaMap;
            case 'building':
                return buildingSchema_1.buildingSchemaMap;
            case 'men_at_arms':
                return menAtArmsSchema_1.menAtArmsSchemaMap;
            case 'casus_belli':
                return casusBelliSchema_1.casusBelliSchemaMap;
            case 'culture':
                return cultureSchema_1.cultureSchemaMap;
            case 'tradition':
                return cultureSchema_1.traditionSchemaMap;
            case 'religion':
                if (blockPath.length > 0 && blockPath[blockPath.length - 1] === 'faiths') {
                    return faithSchema_1.faithSchemaMap;
                }
                return faithSchema_1.religionSchemaMap;
            case 'scripted_effect':
                return scriptedEffectsSchema_1.scriptedEffectSchemaMap;
            case 'scripted_trigger':
                return scriptedTriggersSchema_1.scriptedTriggerSchemaMap;
            case 'artifact':
                return artifactSchema_1.artifactSchemaMap;
            case 'court_position':
                return courtPositionSchema_1.courtPositionSchemaMap;
            case 'lifestyle':
                return lifestyleSchema_1.lifestyleSchemaMap;
            case 'focus':
                return lifestyleSchema_1.focusSchemaMap;
            case 'perk':
                return lifestyleSchema_1.perkSchemaMap;
            case 'dynasty_legacy':
                return dynastyLegacySchema_1.dynastyLegacySchemaMap;
            case 'modifier':
                return modifierSchema_1.modifierSchemaMap;
            case 'law':
                return lawSchema_1.lawSchemaMap;
            case 'government':
                return governmentSchema_1.governmentSchemaMap;
            case 'faction':
                return factionSchema_1.factionSchemaMap;
            case 'council_task':
                return councilTaskSchema_1.councilTaskSchemaMap;
            case 'opinion_modifier':
                return opinionModifierSchema_1.opinionModifierSchemaMap;
            case 'secret':
                return secretSchema_1.secretSchemaMap;
            case 'nickname':
                return nicknameSchema_1.nicknameSchemaMap;
            case 'script_value':
                return scriptValueSchema_1.scriptValueSchemaMap;
            case 'hook':
                return hookSchema_1.hookSchemaMap;
            case 'activity':
                return activitySchema_1.activitySchemaMap;
            case 'game_rule':
                return gameRuleSchema_1.gameRuleSchemaMap;
            case 'bookmark':
                return bookmarkSchema_1.bookmarkSchemaMap;
            case 'story_cycle':
                return storyCycleSchema_1.storyCycleSchemaMap;
            case 'important_action':
                return importantActionSchema_1.importantActionSchemaMap;
            case 'vassal_contract':
                return vassalContractSchema_1.vassalContractSchemaMap;
            case 'landed_title':
                return landedTitleSchema_1.landedTitleSchemaMap;
            case 'coat_of_arms':
                return coatOfArmsSchema_1.coatOfArmsSchemaMap;
            case 'innovation':
                return innovationSchema_1.innovationSchemaMap;
            case 'doctrine':
                return doctrineSchema_1.doctrineSchemaMap;
            case 'holy_site':
                return holySiteSchema_1.holySiteSchemaMap;
            case 'holding':
                return holdingSchema_1.holdingSchemaMap;
            case 'dynasty':
                return dynastySchema_1.dynastySchemaMap;
            case 'character_history':
                return characterHistorySchema_1.characterHistorySchemaMap;
            case 'terrain':
                return terrainSchema_1.terrainSchemaMap;
            case 'scripted_gui':
                return scriptedGuiSchema_1.scriptedGuiSchemaMap;
            case 'custom_localization':
                return customLocalizationSchema_1.customLocalizationSchemaMap;
            case 'flavorization':
                return flavorizationSchema_1.flavorizationSchemaMap;
            case 'deathreasons':
                return deathreasonsSchema_1.deathreasonsSchemaMap;
            case 'succession_election':
                return successionElectionSchema_1.successionElectionSchemaMap;
            case 'scripted_relation':
                return scriptedRelationSchema_1.scriptedRelationSchemaMap;
            case 'named_colors':
                return namedColorsSchema_1.namedColorsSchemaMap;
            case 'event_background':
                return eventBackgroundSchema_1.eventBackgroundSchemaMap;
            case 'pool_selector':
                return poolSelectorSchema_1.poolSelectorSchemaMap;
            case 'scripted_modifier':
                return scriptedModifierSchema_1.scriptedModifierSchemaMap;
            case 'scripted_rules':
                return scriptedRulesSchema_1.scriptedRulesSchemaMap;
            case 'game_concept':
                return gameConceptSchema_1.gameConceptSchemaMap;
            case 'message':
                return messageSchema_1.messageSchemaMap;
            case 'scripted_list':
                return scriptedListSchema_1.scriptedListSchemaMap;
            case 'title_history':
                return titleHistorySchema_1.titleHistorySchemaMap;
            case 'accolade_type':
                return accoladeTypeSchema_1.accoladeTypeSchemaMap;
            case 'character_memory':
                return characterMemorySchema_1.characterMemorySchemaMap;
            case 'court_amenity':
                return courtAmenitySchema_1.courtAmenitySchemaMap;
            case 'dynasty_house':
                return dynastyHouseSchema_1.dynastyHouseSchemaMap;
            case 'legend':
                return legendSchema_1.legendSchemaMap;
            case 'travel':
                return travelSchema_1.travelSchemaMap;
            case 'struggle':
                return struggleSchema_1.struggleSchemaMap;
            case 'inspiration':
                return inspirationSchema_1.inspirationSchemaMap;
            case 'diarchy':
                return diarchySchema_1.diarchySchemaMap;
            case 'domicile':
                return domicileSchema_1.domicileSchemaMap;
            case 'great_project':
                return greatProjectSchema_1.greatProjectSchemaMap;
            case 'epidemic':
                return epidemicSchema_1.epidemicSchemaMap;
            case 'house_unity':
                return houseUnitySchema_1.houseUnitySchemaMap;
            case 'legitimacy':
                return legitimacySchema_1.legitimacySchemaMap;
            case 'tax_slot':
                return taxSlotSchema_1.taxSlotSchemaMap;
            case 'vassal_stance':
                return vassalStanceSchema_1.vassalStanceSchemaMap;
            case 'suggestion':
                return suggestionSchema_1.suggestionSchemaMap;
            case 'scripted_cost':
                return scriptedCostSchema_1.scriptedCostSchemaMap;
            case 'scripted_animation':
                return scriptedAnimationSchema_1.scriptedAnimationSchemaMap;
            case 'scripted_character_template':
                return scriptedCharacterTemplateSchema_1.scriptedCharacterTemplateSchemaMap;
            case 'event_theme':
                return eventThemeSchema_1.eventThemeSchemaMap;
            case 'casus_belli_group':
                return casusBelliGroupSchema_1.casusBelliGroupSchemaMap;
            case 'ai_war_stance':
                return aiWarStanceSchema_1.aiWarStanceSchemaMap;
            case 'combat_phase_event':
                return combatPhaseEventSchema_1.combatPhaseEventSchemaMap;
            case 'bookmark_portrait':
                return bookmarkPortraitSchema_1.bookmarkPortraitSchemaMap;
            case 'guest_system':
                return guestSystemSchema_1.guestSystemSchemaMap;
            case 'courtier_guest_management':
                return courtierGuestManagementSchema_1.courtierGuestManagementSchemaMap;
            case 'task_contract':
                return taskContractSchema_1.taskContractSchemaMap;
            case 'subject_contract':
                return subjectContractSchema_1.subjectContractSchemaMap;
            case 'lease_contract':
                return leaseContractSchema_1.leaseContractSchemaMap;
            case 'character_background':
                return characterBackgroundSchema_1.characterBackgroundSchemaMap;
            case 'dna_data':
                return dnaDataSchema_1.dnaDataSchemaMap;
            case 'portrait_modifier':
                return portraitModifierSchema_1.portraitModifierSchemaMap;
            case 'nickname_rule':
                return nicknameRuleSchema_1.nicknameRuleSchemaMap;
            case 'succession_law':
                return successionLawSchema_1.successionLawSchemaMap;
            case 'war_goal':
                return warGoalSchema_1.warGoalSchemaMap;
            case 'scripted_illustration':
                return scriptedIllustrationSchema_1.scriptedIllustrationSchemaMap;
            case 'map_mode':
                return mapModeSchema_1.mapModeSchemaMap;
            case 'province_history':
                return provinceHistorySchema_1.provinceHistorySchemaMap;
            case 'region':
                return regionSchema_1.regionSchemaMap;
            case 'scripted_score_value':
                return scriptedScoreValueSchema_1.scriptedScoreValueSchemaMap;
            case 'ai_personality':
                return aiPersonalitySchema_1.aiPersonalitySchemaMap;
            case 'defines':
                return definesSchema_1.definesSchemaMap;
            case 'scripted_loc_value':
                return scriptedLocValueSchema_1.scriptedLocValueSchemaMap;
            case 'interaction_category':
                return interactionCategorySchema_1.interactionCategorySchemaMap;
            case 'county_culture':
                return countyCultureSchema_1.countyCultureSchemaMap;
            case 'playable_difficulty':
                return playableDifficultySchema_1.playableDifficultySchemaMap;
            case 'province_setup':
                return provinceSetupSchema_1.provinceSetupSchemaMap;
            case 'scripted_spawn':
                return scriptedSpawnSchema_1.scriptedSpawnSchemaMap;
            case 'court_position_category':
                return courtPositionCategorySchema_1.courtPositionCategorySchemaMap;
            case 'activity_locale':
                return activityLocaleSchema_1.activityLocaleSchemaMap;
            case 'culture_era':
                return cultureEraSchema_1.cultureEraSchemaMap;
            case 'name_list':
                return nameListSchema_1.nameListSchemaMap;
            case 'relation_flag':
                return relationFlagSchema_1.relationFlagSchemaMap;
            case 'terrain_type':
                return terrainTypeSchema_1.terrainTypeSchemaMap;
            case 'holding_type':
                return holdingTypeSchema_1.holdingTypeSchemaMap;
            case 'men_at_arms_type':
                return menAtArmsTypeSchema_1.menAtArmsTypeSchemaMap;
            case 'combat_phase':
                return combatPhaseSchema_1.combatPhaseSchemaMap;
            case 'inspiration_type':
                return inspirationTypeSchema_1.inspirationTypeSchemaMap;
            case 'court_type':
                return courtTypeSchema_1.courtTypeSchemaMap;
            case 'culture_pillar':
                return culturePillarSchema_1.culturePillarSchemaMap;
            case 'heritage':
                return heritageSchema_1.heritageSchemaMap;
            case 'language':
                return languageSchema_1.languageSchemaMap;
            case 'martial_custom':
                return martialCustomSchema_1.martialCustomSchemaMap;
            case 'ethos':
                return ethosSchema_1.ethosSchemaMap;
            case 'scripted_gfx':
                return scriptedGfxSchema_1.scriptedGfxSchemaMap;
            case 'game_start':
                return gameStartSchema_1.gameStartSchemaMap;
            case 'character_template':
                return characterTemplateSchema_1.characterTemplateSchemaMap;
            case 'trigger_locale':
                return triggerLocaleSchema_1.triggerLocaleSchemaMap;
            case 'effect_locale':
                return effectLocaleSchema_1.effectLocaleSchemaMap;
            case 'music':
                return musicSchema_1.musicSchemaMap;
            case 'sound_effect':
                return soundEffectSchema_1.soundEffectSchemaMap;
            case 'portrait_camera':
                return portraitCameraSchema_1.portraitCameraSchemaMap;
            case 'gene':
                return geneSchema_1.geneSchemaMap;
            case 'accessory':
                return accessorySchema_1.accessorySchemaMap;
            case 'coa_template':
                return coaTemplateSchema_1.coaTemplateSchemaMap;
            case 'achievement':
                return achievementSchema_1.achievementSchemaMap;
            case 'scripted_test':
                return scriptedTestSchema_1.scriptedTestSchemaMap;
            case 'tutorial':
                return tutorialSchema_1.tutorialSchemaMap;
            case 'map_object':
                return mapObjectSchema_1.mapObjectSchemaMap;
            case 'loading_tip':
                return loadingTipSchema_1.loadingTipSchemaMap;
            case 'gui_type':
                return guiTypeSchema_1.guiTypeSchemaMap;
            case 'localization':
                return localizationSchema_1.localizationSchemaMap;
            case 'regiment':
                return regimentSchema_1.regimentSchemaMap;
            case 'title_color':
                return titleColorSchema_1.titleColorSchemaMap;
            case 'character_interaction_category':
                return characterInteractionCategorySchema_1.characterInteractionCategorySchemaMap;
            case 'dlc_feature':
                return dlcFeatureSchema_1.dlcFeatureSchemaMap;
            case 'ai_budget':
                return aiBudgetSchema_1.aiBudgetSchemaMap;
            case 'special_building':
                return specialBuildingSchema_1.specialBuildingSchemaMap;
            case 'triggered_text':
                return triggeredTextSchema_1.triggeredTextSchemaMap;
            case 'pool_generation_rule':
                return poolGenerationRuleSchema_1.poolGenerationRuleSchemaMap;
            case 'ai_task':
                return aiTaskSchema_1.aiTaskSchemaMap;
            case 'artifact_template':
                return artifactTemplateSchema_1.artifactTemplateSchemaMap;
            case 'coa_pattern':
                return coaPatternSchema_1.coaPatternSchemaMap;
            case 'coa_emblem':
                return coaEmblemSchema_1.coaEmblemSchemaMap;
            case 'culture_name_list':
                return cultureNameListSchema_1.cultureNameListSchemaMap;
            case 'artifact_visual':
                return artifactVisualSchema_1.artifactVisualSchemaMap;
            case 'artifact_rarity':
                return artifactRaritySchema_1.artifactRaritySchemaMap;
            case 'climate':
                return climateSchema_1.climateSchemaMap;
            case 'terrain_modifier':
                return terrainModifierSchema_1.terrainModifierSchemaMap;
            case 'succession_voting':
                return successionVotingSchema_1.successionVotingSchemaMap;
            case 'character_flag':
                return characterFlagSchema_1.characterFlagSchemaMap;
            case 'title_flag':
                return titleFlagSchema_1.titleFlagSchemaMap;
            case 'province_modifier':
                return provinceModifierSchema_1.provinceModifierSchemaMap;
            case 'lifestyle_perk_tree':
                return lifestylePerkTreeSchema_1.lifestylePerkTreeSchemaMap;
            case 'building_slot':
                return buildingSlotSchema_1.buildingSlotSchemaMap;
            case 'artifact_slot':
                return artifactSlotSchema_1.artifactSlotSchemaMap;
            case 'mercenary_company':
                return mercenaryCompanySchema_1.mercenaryCompanySchemaMap;
            case 'holy_order':
                return holyOrderSchema_1.holyOrderSchemaMap;
            case 'war_contribution':
                return warContributionSchema_1.warContributionSchemaMap;
            case 'army_template':
                return armyTemplateSchema_1.armyTemplateSchemaMap;
            case 'combat_effect':
                return combatEffectSchema_1.combatEffectSchemaMap;
            case 'vassal_obligation':
                return vassalObligationSchema_1.vassalObligationSchemaMap;
            case 'triggered_outfit':
                return triggeredOutfitSchema_1.triggeredOutfitSchemaMap;
            case 'portrait_type':
                return portraitTypeSchema_1.portraitTypeSchemaMap;
            case 'court_grandeur_level':
                return courtGrandeurLevelSchema_1.courtGrandeurLevelSchemaMap;
            case 'amenity_level':
                return amenityLevelSchema_1.amenityLevelSchemaMap;
            case 'artifact_feature':
                return artifactFeatureSchema_1.artifactFeatureSchemaMap;
            case 'execution_method':
                return executionMethodSchema_1.executionMethodSchemaMap;
            case 'punishment':
                return punishmentSchema_1.punishmentSchemaMap;
            case 'struggle_catalyst':
                return struggleCatalystSchema_1.struggleCatalystSchemaMap;
            case 'travel_danger_type':
                return travelDangerTypeSchema_1.travelDangerTypeSchemaMap;
            case 'travel_option':
                return travelOptionSchema_1.travelOptionSchemaMap;
            case 'hostage_type':
                return hostageTypeSchema_1.hostageTypeSchemaMap;
            case 'diarchy_mandate':
                return diarchyMandateSchema_1.diarchyMandateSchemaMap;
            case 'levy_definition':
                return levyDefinitionSchema_1.levyDefinitionSchemaMap;
            case 'title_rank':
                return titleRankSchema_1.titleRankSchemaMap;
            case 'ethnic_group':
                return ethnicGroupSchema_1.ethnicGroupSchemaMap;
            case 'culture_aesthetic':
                return cultureAestheticSchema_1.cultureAestheticSchemaMap;
            case 'coa_color':
                return coaColorSchema_1.coaColorSchemaMap;
            case 'succession_parameter':
                return successionParameterSchema_1.successionParameterSchemaMap;
            case 'domicile_building':
                return domicileBuildingSchema_1.domicileBuildingSchemaMap;
            case 'traveler_type':
                return travelerTypeSchema_1.travelerTypeSchemaMap;
            case 'struggle_phase':
                return strugglePhaseSchema_1.strugglePhaseSchemaMap;
            case 'legend_type':
                return legendTypeSchema_1.legendTypeSchemaMap;
            case 'administrative_division':
                return administrativeDivisionSchema_1.administrativeDivisionSchemaMap;
            case 'culture_tradition_category':
                return cultureTraditionCategorySchema_1.cultureTraditionCategorySchemaMap;
            case 'imperial_administration':
                return imperialAdministrationSchema_1.imperialAdministrationSchemaMap;
            case 'court_event':
                return courtEventSchema_1.courtEventSchemaMap;
            case 'culture_parameter':
                return cultureParameterSchema_1.cultureParameterSchemaMap;
            case 'title_naming':
                return titleNamingSchema_1.titleNamingSchemaMap;
            case 'siege_type':
                return siegeTypeSchema_1.siegeTypeSchemaMap;
            case 'commander_trait':
                return commanderTraitSchema_1.commanderTraitSchemaMap;
            case 'realm_law_category':
                return realmLawCategorySchema_1.realmLawCategorySchemaMap;
            case 'government_modifier':
                return governmentModifierSchema_1.governmentModifierSchemaMap;
            case 'artifact_modifier':
                return artifactModifierSchema_1.artifactModifierSchemaMap;
            case 'dynasty_perk':
                return dynastyPerkSchema_1.dynastyPerkSchemaMap;
            case 'chronicle_entry':
                return chronicleEntrySchema_1.chronicleEntrySchemaMap;
            case 'vassal_power':
                return vassalPowerSchema_1.vassalPowerSchemaMap;
            case 'realm_succession':
                return realmSuccessionSchema_1.realmSuccessionSchemaMap;
            case 'government_type_modifier':
                return governmentTypeModifierSchema_1.governmentTypeModifierSchemaMap;
            case 'economy_modifier':
                return economyModifierSchema_1.economyModifierSchemaMap;
            case 'culture_group':
                return cultureGroupSchema_1.cultureGroupSchemaMap;
            case 'pilgrimage_type':
                return pilgrimageTypeSchema_1.pilgrimageTypeSchemaMap;
            case 'casus_belli_type':
                return casusBelliTypeSchema_1.casusBelliTypeSchemaMap;
            default:
                return new Map();
        }
    }
    /**
     * Get field completions based on context
     */
    getFieldCompletions(linePrefix, context, fileType) {
        const items = [];
        const partial = linePrefix.trim().toLowerCase();
        const schema = this.getSchemaForContext(fileType, context.blockPath || []);
        for (const field of schema) {
            if (partial === '' || field.name.toLowerCase().startsWith(partial)) {
                const item = new vscode.CompletionItem(field.name, this.getCompletionKind(field));
                item.detail = this.getFieldDetail(field);
                item.documentation = new vscode.MarkdownString(this.getFieldDoc(field));
                item.insertText = this.getFieldInsertText(field);
                item.sortText = field.required ? `0_${field.name}` : `1_${field.name}`;
                items.push(item);
            }
        }
        return items;
    }
    /**
     * Get value completions for a field
     */
    getValueCompletions(context, fileType) {
        if (!context.fieldName)
            return [];
        const schemaMap = this.getSchemaMapForContext(fileType, context.blockPath || []);
        const field = schemaMap.get(context.fieldName);
        if (!field)
            return [];
        const items = [];
        switch (field.type) {
            case 'enum':
                if (field.values) {
                    for (const value of field.values) {
                        if (!context.partialValue || value.startsWith(context.partialValue)) {
                            const item = new vscode.CompletionItem(value, vscode.CompletionItemKind.EnumMember);
                            item.detail = `Value for ${context.fieldName}`;
                            items.push(item);
                        }
                    }
                }
                break;
            case 'boolean':
                items.push(this.createSimpleCompletion('yes', 'Enable'), this.createSimpleCompletion('no', 'Disable'));
                break;
            case 'block':
            case 'trigger':
            case 'effect':
            case 'list':
                const blockItem = new vscode.CompletionItem('{ }', vscode.CompletionItemKind.Struct);
                blockItem.insertText = new vscode.SnippetString('{\n\t$0\n}');
                blockItem.detail = 'Open a block';
                items.push(blockItem);
                break;
            case 'string':
                // Suggest placeholder
                const stringItem = new vscode.CompletionItem('value', vscode.CompletionItemKind.Text);
                stringItem.insertText = new vscode.SnippetString('${1:value}');
                stringItem.detail = 'Enter a value';
                items.push(stringItem);
                break;
            case 'integer':
                items.push(this.createSimpleCompletion('0', 'Zero'), this.createSimpleCompletion('1', 'One'), this.createSimpleCompletion('5', 'Five'), this.createSimpleCompletion('10', 'Ten'));
                break;
            case 'float':
                items.push(this.createSimpleCompletion('0.0', 'Zero'), this.createSimpleCompletion('0.5', 'Half'), this.createSimpleCompletion('1.0', 'One'));
                break;
        }
        return items;
    }
    /**
     * Get top-level completions for starting a new definition
     */
    getTopLevelCompletions(fileType) {
        const items = [];
        switch (fileType) {
            case 'trait':
                const traitItem = new vscode.CompletionItem('trait_name', vscode.CompletionItemKind.Class);
                traitItem.detail = 'Define a new trait';
                traitItem.insertText = new vscode.SnippetString('${1:trait_name} = {\n\tcategory = ${2|personality,education,childhood,commander,lifestyle,health|}\n\t$0\n}');
                items.push(traitItem);
                break;
            case 'event':
                const namespaceItem = new vscode.CompletionItem('namespace', vscode.CompletionItemKind.Module);
                namespaceItem.detail = 'Declare event namespace';
                namespaceItem.insertText = new vscode.SnippetString('namespace = ${1:my_namespace}');
                items.push(namespaceItem);
                const eventItem = new vscode.CompletionItem('event_id', vscode.CompletionItemKind.Event);
                eventItem.detail = 'Define a new event';
                eventItem.insertText = new vscode.SnippetString('${1:namespace}.${2:0001} = {\n\ttype = ${3|character_event,letter_event,court_event|}\n\ttitle = ${1:namespace}.${2:0001}.t\n\tdesc = ${1:namespace}.${2:0001}.desc\n\ttheme = ${4|default,intrigue,diplomacy,martial,stewardship,learning|}\n\n\tleft_portrait = {\n\t\tcharacter = root\n\t\tanimation = ${5|idle,happiness,anger|}\n\t}\n\n\toption = {\n\t\tname = ${1:namespace}.${2:0001}.a\n\t\t$0\n\t}\n}');
                items.push(eventItem);
                break;
            case 'decision':
                const decisionItem = new vscode.CompletionItem('decision_name', vscode.CompletionItemKind.Function);
                decisionItem.detail = 'Define a new decision';
                decisionItem.insertText = new vscode.SnippetString('${1:decision_name} = {\n\tdesc = ${1:decision_name}_desc\n\tselection_tooltip = ${1:decision_name}_tooltip\n\n\tpicture = {\n\t\treference = "gfx/interface/illustrations/decisions/decision_misc.dds"\n\t}\n\n\tis_shown = {\n\t\tis_ruler = yes\n\t}\n\n\tis_valid = {\n\t\t$0\n\t}\n\n\teffect = {\n\t\t\n\t}\n\n\tai_check_interval = 0\n\tai_potential = { always = no }\n\tai_will_do = { base = 0 }\n}');
                items.push(decisionItem);
                break;
            case 'interaction':
                const interactionItem = new vscode.CompletionItem('interaction_name', vscode.CompletionItemKind.Interface);
                interactionItem.detail = 'Define a new character interaction';
                interactionItem.insertText = new vscode.SnippetString('${1:interaction_name} = {\n\tcategory = ${2|interaction_category_friendly,interaction_category_hostile,interaction_category_diplomacy,interaction_category_vassal|}\n\tdesc = ${1:interaction_name}_desc\n\n\tis_shown = {\n\t\tscope:actor = { is_ruler = yes }\n\t\tscope:recipient = { NOT = { this = scope:actor } }\n\t}\n\n\tis_valid = {\n\t\t$0\n\t}\n\n\ton_accept = {\n\t\t\n\t}\n\n\tai_accept = {\n\t\tbase = 0\n\t}\n}');
                items.push(interactionItem);
                break;
            case 'on_action':
                const onActionItem = new vscode.CompletionItem('on_action_name', vscode.CompletionItemKind.Event);
                onActionItem.detail = 'Define a new on_action';
                onActionItem.insertText = new vscode.SnippetString('${1:on_action_name} = {\n\ttrigger = {\n\t\t$0\n\t}\n\n\teffect = {\n\t\t\n\t}\n}');
                items.push(onActionItem);
                break;
            case 'scheme':
                const schemeItem = new vscode.CompletionItem('scheme_name', vscode.CompletionItemKind.Class);
                schemeItem.detail = 'Define a new scheme';
                schemeItem.insertText = new vscode.SnippetString('${1:scheme_name} = {\n\tskill = ${2|intrigue,diplomacy,stewardship,martial,learning|}\n\tdesc = ${1:scheme_name}_desc\n\ticon = icon_scheme_${1:scheme_name}\n\tcategory = ${3|hostile,personal,friendly|}\n\ttarget_type = character\n\n\tallow = {\n\t\t$0\n\t}\n\n\tvalid = {\n\t\t\n\t}\n\n\tbase_success_chance = {\n\t\tbase = 0\n\t}\n\n\ton_success = {\n\t\t\n\t}\n}');
                items.push(schemeItem);
                break;
            case 'building':
                const buildingItem = new vscode.CompletionItem('building_name', vscode.CompletionItemKind.Class);
                buildingItem.detail = 'Define a new building';
                buildingItem.insertText = new vscode.SnippetString('${1:building_name} = {\n\tconstruction_time = ${2|slow_construction_time,standard_construction_time,very_fast_construction_time|}\n\n\tcost_gold = ${3:300}\n\n\tprovince_modifier = {\n\t\t$0\n\t}\n\n\tnext_building = ${1:building_name}_02\n\n\tai_value = {\n\t\tbase = 100\n\t}\n}');
                items.push(buildingItem);
                break;
            case 'men_at_arms':
                const maaItem = new vscode.CompletionItem('regiment_name', vscode.CompletionItemKind.Class);
                maaItem.detail = 'Define a new Men-at-Arms regiment type';
                maaItem.insertText = new vscode.SnippetString('${1:regiment_name} = {\n\ttype = ${2|heavy_infantry,light_infantry,pikemen,heavy_cavalry,light_cavalry,archers,skirmishers,siege_weapon|}\n\n\tdamage = ${3:25}\n\ttoughness = ${4:15}\n\tpursuit = ${5:0}\n\tscreen = ${6:0}\n\n\tstack = 100\n\n\tbuy_cost = {\n\t\tgold = ${7:150}\n\t}\n\tlow_maintenance_cost = {\n\t\tgold = ${8:1.0}\n\t}\n\thigh_maintenance_cost = {\n\t\tgold = ${9:5.0}\n\t}\n\n\t$0\n}');
                items.push(maaItem);
                break;
            case 'casus_belli':
                const cbItem = new vscode.CompletionItem('cb_name', vscode.CompletionItemKind.Class);
                cbItem.detail = 'Define a new Casus Belli';
                cbItem.insertText = new vscode.SnippetString('${1:cb_name} = {\n\tgroup = ${2|conquest,claim,de_jure,religious,event|}\n\ticon = ${3:conquest}\n\n\ttarget_titles = ${4|all,de_jure,neighbor_land,none|}\n\ttarget_title_tier = ${5|all,county,duchy,kingdom,empire|}\n\n\tallowed_for_character = {\n\t\tis_ruler = yes\n\t\t$0\n\t}\n\n\tallowed_against_character = {\n\t\t\n\t}\n\n\tcost = {\n\t\tprestige = 100\n\t}\n\n\ton_victory = {\n\t\t\n\t}\n\n\ton_defeat = {\n\t\t\n\t}\n\n\tai_score = {\n\t\tbase = 100\n\t}\n}');
                items.push(cbItem);
                break;
            case 'culture':
                const cultureItem = new vscode.CompletionItem('culture_name', vscode.CompletionItemKind.Class);
                cultureItem.detail = 'Define a new culture';
                cultureItem.insertText = new vscode.SnippetString('${1:culture_name} = {\n\tcolor = { ${2:0.5} ${3:0.5} ${4:0.5} }\n\n\tethos = ethos_${5|bellicose,courtly,bureaucratic,communal,spiritual,egalitarian,stoic|}\n\theritage = heritage_${6:west_germanic}\n\tlanguage = language_${7:anglic}\n\tmartial_custom = ${8|martial_custom_male_only,martial_custom_female_only,martial_custom_equal|}\n\n\tname_list = name_list_${1:culture_name}\n\n\tcoa_gfx = { ${9:western}_coa_gfx }\n\tbuilding_gfx = { ${9:western}_building_gfx }\n\tclothing_gfx = { ${9:western}_clothing_gfx }\n\tunit_gfx = { ${9:western}_unit_gfx }\n\n\ttraditions = {\n\t\t$0\n\t}\n}');
                items.push(cultureItem);
                break;
            case 'tradition':
                const traditionItem = new vscode.CompletionItem('tradition_name', vscode.CompletionItemKind.Class);
                traditionItem.detail = 'Define a new cultural tradition';
                traditionItem.insertText = new vscode.SnippetString('tradition_${1:name} = {\n\tcategory = ${2|realm,combat,societal,regional|}\n\n\tlayers = {\n\t\t0 = ${3:martial}\n\t\t4 = ${2:combat}\n\t}\n\n\tis_shown = {\n\t\t$0\n\t}\n\n\tcan_pick = {\n\t\t\n\t}\n\n\tparameters = {\n\t\t\n\t}\n\n\tcharacter_modifier = {\n\t\t\n\t}\n\n\tcost = {\n\t\tprestige = {\n\t\t\tvalue = 2000\n\t\t}\n\t}\n\n\tai_will_do = {\n\t\tvalue = 100\n\t}\n}');
                items.push(traditionItem);
                break;
            case 'religion':
                const religionItem = new vscode.CompletionItem('religion_name', vscode.CompletionItemKind.Class);
                religionItem.detail = 'Define a new religion';
                religionItem.insertText = new vscode.SnippetString('${1:religion_name}_religion = {\n\tfamily = ${2|rf_christian,rf_islamic,rf_pagan,rf_eastern,rf_dualist,rf_jewish,rf_zoroastrian|}\n\n\tdoctrine = doctrine_gender_${3|male_dominated,equal,female_dominated|}\n\n\tpagan_roots = ${4|no,yes|}\n\n\tfaiths = {\n\t\t${5:faith_name} = {\n\t\t\tcolor = { ${6:0.5} ${7:0.5} ${8:0.5} }\n\t\t\ticon = ${5:faith_name}\n\n\t\t\tdoctrine = doctrine_${9:monogamy}\n\n\t\t\tholy_site = ${10:rome}\n\t\t\tholy_site = ${11:jerusalem}\n\t\t\tholy_site = ${12:constantinople}\n\n\t\t\t$0\n\t\t}\n\t}\n}');
                items.push(religionItem);
                break;
            case 'scripted_effect':
                const effectItem = new vscode.CompletionItem('effect_name', vscode.CompletionItemKind.Function);
                effectItem.detail = 'Define a new scripted effect';
                effectItem.insertText = new vscode.SnippetString('${1:my_scripted_effect} = {\n\t# Parameters: \\$PARAM1\\$ \\$PARAM2\\$\n\t$0\n}');
                items.push(effectItem);
                break;
            case 'scripted_trigger':
                const triggerItem = new vscode.CompletionItem('trigger_name', vscode.CompletionItemKind.Function);
                triggerItem.detail = 'Define a new scripted trigger';
                triggerItem.insertText = new vscode.SnippetString('${1:my_scripted_trigger} = {\n\t# Parameters: \\$PARAM1\\$ \\$PARAM2\\$\n\t$0\n}');
                items.push(triggerItem);
                break;
            case 'artifact':
                const artifactItem = new vscode.CompletionItem('artifact_name', vscode.CompletionItemKind.Class);
                artifactItem.detail = 'Define a new artifact';
                artifactItem.insertText = new vscode.SnippetString('${1:artifact_name} = {\n\tslot = ${2|primary_armament,armor,regalia,helmet,miscellaneous|}\n\trarity = ${3|common,masterwork,famed,illustrious|}\n\tunique = ${4|no,yes|}\n\n\tmodifier = {\n\t\t$0\n\t}\n\n\tcan_equip = {\n\t\tis_adult = yes\n\t}\n}');
                items.push(artifactItem);
                break;
            case 'court_position':
                const positionItem = new vscode.CompletionItem('position_name', vscode.CompletionItemKind.Class);
                positionItem.detail = 'Define a new court position';
                positionItem.insertText = new vscode.SnippetString('${1:position_name} = {\n\tskill = ${2|diplomacy,martial,stewardship,intrigue,learning|}\n\tmax_available_positions = ${3:1}\n\tcategory = court_position_category_common\n\n\tis_shown = {\n\t\thighest_held_title_tier >= tier_duchy\n\t}\n\n\tvalid_character = {\n\t\tis_adult = yes\n\t\t$0\n\t}\n\n\tholder_modifier = {\n\t\tmonthly_prestige = 0.25\n\t}\n\n\tsalary = {\n\t\tgold = 1\n\t}\n}');
                items.push(positionItem);
                break;
            case 'lifestyle':
                const lifestyleItem = new vscode.CompletionItem('lifestyle_name', vscode.CompletionItemKind.Class);
                lifestyleItem.detail = 'Define a new lifestyle';
                lifestyleItem.insertText = new vscode.SnippetString('${1:lifestyle_name}_lifestyle = {\n\tskill = ${2|diplomacy,martial,stewardship,intrigue,learning|}\n\n\tfocuses = {\n\t\t${1:lifestyle_name}_focus_1\n\t\t${1:lifestyle_name}_focus_2\n\t\t${1:lifestyle_name}_focus_3\n\t}\n\n\tperk_trees = {\n\t\t${1:lifestyle_name}_tree_1\n\t\t${1:lifestyle_name}_tree_2\n\t\t${1:lifestyle_name}_tree_3\n\t}\n\t$0\n}');
                items.push(lifestyleItem);
                break;
            case 'focus':
                const focusItem = new vscode.CompletionItem('focus_name', vscode.CompletionItemKind.Class);
                focusItem.detail = 'Define a new lifestyle focus';
                focusItem.insertText = new vscode.SnippetString('${1:focus_name} = {\n\tlifestyle = ${2:martial}_lifestyle\n\tskill = ${2:martial}\n\tis_default = ${3|no,yes|}\n\n\tmodifier = {\n\t\t$0\n\t}\n\n\tauto_selection_weight = {\n\t\tvalue = 100\n\t}\n}');
                items.push(focusItem);
                break;
            case 'perk':
                const perkItem = new vscode.CompletionItem('perk_name', vscode.CompletionItemKind.Class);
                perkItem.detail = 'Define a new perk';
                perkItem.insertText = new vscode.SnippetString('${1:perk_name} = {\n\tlifestyle = ${2:martial}_lifestyle\n\ttree = ${3:chivalry}\n\n\tposition = {\n\t\tx = ${4:0}\n\t\ty = ${5:0}\n\t}\n\n\tcharacter_modifier = {\n\t\t$0\n\t}\n\n\tauto_selection_weight = {\n\t\tvalue = 100\n\t}\n}');
                items.push(perkItem);
                break;
            case 'dynasty_legacy':
                const legacyItem = new vscode.CompletionItem('legacy_name', vscode.CompletionItemKind.Class);
                legacyItem.detail = 'Define a new dynasty legacy';
                legacyItem.insertText = new vscode.SnippetString('legacy_${1:track}_${2:1} = {\n\ttrack = ${1:track}\n\torder = ${2:1}\n\n\tcost = {\n\t\trenown = ${3:1000}\n\t}\n\n\tcharacter_modifier = {\n\t\t$0\n\t}\n\n\tai_chance = {\n\t\tvalue = 100\n\t}\n}');
                items.push(legacyItem);
                break;
            case 'modifier':
                const modItem = new vscode.CompletionItem('modifier_name', vscode.CompletionItemKind.Class);
                modItem.detail = 'Define a new static modifier';
                modItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\t$0\n}');
                items.push(modItem);
                break;
            case 'law':
                const lawItem = new vscode.CompletionItem('law_name', vscode.CompletionItemKind.Class);
                lawItem.detail = 'Define a new law';
                lawItem.insertText = new vscode.SnippetString('${1:law_name} = {\n\tgroup = ${2:crown_authority}\n\tdefault = ${3|no,yes|}\n\n\tcan_have = {\n\t\t$0\n\t}\n\n\tcan_pass = {\n\t\t\n\t}\n\n\tpass_cost = {\n\t\tprestige = 500\n\t}\n\n\tmodifier = {\n\t\t\n\t}\n\n\tai_will_do = {\n\t\tvalue = 100\n\t}\n}');
                items.push(lawItem);
                break;
            case 'government':
                const govItem = new vscode.CompletionItem('government_name', vscode.CompletionItemKind.Class);
                govItem.detail = 'Define a new government type';
                govItem.insertText = new vscode.SnippetString('${1:government_name} = {\n\tcreate_cadet_branches = ${2|yes,no|}\n\trulers_should_have_dynasty = ${3|yes,no|}\n\troyal_court = ${4|yes,no|}\n\n\tprimary_holding = ${5|castle_holding,city_holding,church_holding,tribal_holding|}\n\n\tvalid_holdings = {\n\t\t$0\n\t}\n\n\tcharacter_modifier = {\n\t\t\n\t}\n\n\tflag = government_is_${1:government_name}\n}');
                items.push(govItem);
                break;
            case 'faction':
                const factionItem = new vscode.CompletionItem('faction_name', vscode.CompletionItemKind.Class);
                factionItem.detail = 'Define a new faction type';
                factionItem.insertText = new vscode.SnippetString('${1:faction_name} = {\n\tcasus_belli = ${2:faction_war_cb}\n\tpower_threshold = ${3:0.8}\n\n\tcan_create = {\n\t\tis_landed = yes\n\t\tis_independent_ruler = no\n\t\t$0\n\t}\n\n\tcan_join = {\n\t\tis_imprisoned = no\n\t}\n\n\tai_create_score = {\n\t\tbase = 50\n\t}\n\n\tai_join_score = {\n\t\tbase = 25\n\t}\n}');
                items.push(factionItem);
                break;
            case 'council_task':
                const taskItem = new vscode.CompletionItem('task_name', vscode.CompletionItemKind.Class);
                taskItem.detail = 'Define a new council task';
                taskItem.insertText = new vscode.SnippetString('task_${1:name} = {\n\tposition = ${2|councillor_chancellor,councillor_marshal,councillor_steward,councillor_spymaster,councillor_court_chaplain|}\n\ttask_type = ${3|county,character,none|}\n\tdefault_task = ${4|no,yes|}\n\n\tis_shown = {\n\t\t$0\n\t}\n\n\tis_valid = {\n\t\tscope:councillor = { is_available = yes }\n\t}\n\n\tcouncillor_modifier = {\n\t\tmonthly_prestige = 0.1\n\t}\n\n\tai_will_do = {\n\t\tvalue = 100\n\t}\n}');
                items.push(taskItem);
                break;
            case 'opinion_modifier':
                const opinionItem = new vscode.CompletionItem('opinion_modifier_name', vscode.CompletionItemKind.Class);
                opinionItem.detail = 'Define a new opinion modifier';
                opinionItem.insertText = new vscode.SnippetString('${1:opinion_modifier_name} = {\n\topinion = ${2:20}\n\t${3|years,months,days|} = ${4:10}\n\tdecaying = ${5|no,yes|}\n\t$0\n}');
                items.push(opinionItem);
                break;
            case 'secret':
                const secretItem = new vscode.CompletionItem('secret_name', vscode.CompletionItemKind.Class);
                secretItem.detail = 'Define a new secret type';
                secretItem.insertText = new vscode.SnippetString('${1:secret_name} = {\n\tcategory = ${2|adultery,murder,crime,religious,other|}\n\tis_shunned = ${3|no,yes|}\n\tis_criminal = ${4|no,yes|}\n\n\ton_expose = {\n\t\t$0\n\t}\n\n\tis_valid = {\n\t\tscope:owner = { is_alive = yes }\n\t}\n}');
                items.push(secretItem);
                break;
            case 'nickname':
                const nickItem = new vscode.CompletionItem('nickname_name', vscode.CompletionItemKind.Class);
                nickItem.detail = 'Define a new nickname';
                nickItem.insertText = new vscode.SnippetString('nick_${1:name} = {\n\tis_prefix = ${2|no,yes|}\n\tis_bad = ${3|no,yes|}\n\n\tis_valid = {\n\t\t$0\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n}');
                items.push(nickItem);
                break;
            case 'script_value':
                const svItem = new vscode.CompletionItem('script_value_name', vscode.CompletionItemKind.Variable);
                svItem.detail = 'Define a new script value';
                svItem.insertText = new vscode.SnippetString('${1:value_name} = {\n\tvalue = ${2:0}\n\t$0\n}');
                items.push(svItem);
                break;
            case 'hook':
                const hookItem = new vscode.CompletionItem('hook_name', vscode.CompletionItemKind.Class);
                hookItem.detail = 'Define a new hook type';
                hookItem.insertText = new vscode.SnippetString('${1:hook_name} = {\n\tstrength = ${2|weak,strong|}\n\n\tduration = {\n\t\tyears = ${3:10}\n\t}\n\n\tacceptance_bonus = ${4:50}\n\n\tis_valid = {\n\t\tscope:hook_target = { is_alive = yes }\n\t\t$0\n\t}\n\n\ton_use = {\n\t\t\n\t}\n}');
                items.push(hookItem);
                break;
            case 'activity':
                const activityItem = new vscode.CompletionItem('activity_name', vscode.CompletionItemKind.Class);
                activityItem.detail = 'Define a new activity';
                activityItem.insertText = new vscode.SnippetString('${1:activity_name} = {\n\tis_shown = {\n\t\tis_ruler = yes\n\t\t$0\n\t}\n\n\tcan_start = {\n\t\tis_available = yes\n\t}\n\n\ton_start = {\n\t\t\n\t}\n\n\ton_complete = {\n\t\t\n\t}\n\n\tgui_window = {\n\t\twindow_name = ${2:basic_activity_window}\n\t}\n\n\tmax_guests = ${3:20}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(activityItem);
                break;
            case 'game_rule':
                const gameRuleItem = new vscode.CompletionItem('game_rule_name', vscode.CompletionItemKind.Class);
                gameRuleItem.detail = 'Define a new game rule';
                gameRuleItem.insertText = new vscode.SnippetString('${1:game_rule_name} = {\n\tcategory = ${2|GAME_RULE_CATEGORY_GENERAL,GAME_RULE_CATEGORY_DIFFICULTY,GAME_RULE_CATEGORY_AI|}\n\tdefault = ${3:default_option}\n\n\toption = {\n\t\tname = ${3:default_option}\n\t\tdesc = ${3:default_option}_desc\n\t\tis_default = yes\n\t\t$0\n\t}\n\n\toption = {\n\t\tname = ${4:alt_option}\n\t\tdesc = ${4:alt_option}_desc\n\t}\n}');
                items.push(gameRuleItem);
                break;
            case 'bookmark':
                const bookmarkItem = new vscode.CompletionItem('bookmark_name', vscode.CompletionItemKind.Class);
                bookmarkItem.detail = 'Define a new bookmark';
                bookmarkItem.insertText = new vscode.SnippetString('${1:bookmark_name} = {\n\tstart_date = "${2:867}.${3:1}.${4:1}"\n\tis_playable = yes\n\trecommended = ${5|no,yes|}\n\n\tname = "${1:bookmark_name}_NAME"\n\tdesc = "${1:bookmark_name}_DESC"\n\n\tcharacter = {\n\t\tname = "${6:CHARACTER_NAME}"\n\t\tdynasty = ${7:123}\n\t\ttype = bookmark_playable_character\n\t\ttitle = ${8:k_england}\n\t\tgovernment = ${9:feudal_government}\n\t\tposition = { ${10:650} ${11:650} }\n\t\tanimation = ${12|personality_bold,idle,happiness|}\n\t\t$0\n\t}\n}');
                items.push(bookmarkItem);
                break;
            case 'story_cycle':
                const storyCycleItem = new vscode.CompletionItem('story_cycle_name', vscode.CompletionItemKind.Class);
                storyCycleItem.detail = 'Define a new story cycle';
                storyCycleItem.insertText = new vscode.SnippetString('story_cycle_${1:name} = {\n\ton_setup = {\n\t\tsave_scope_as = story_owner\n\t\t$0\n\t}\n\n\ton_end = {\n\t\t\n\t}\n\n\ton_owner_death = {\n\t\tend_story = yes\n\t}\n\n\tis_valid = {\n\t\texists = story_owner\n\t\tstory_owner = { is_alive = yes }\n\t}\n\n\teffect_group = {\n\t\tdays = { 30 60 }\n\t\ttrigger = {\n\t\t\tstory_owner = { is_available = yes }\n\t\t}\n\t\teffect = {\n\t\t\ttrigger_event = ${2:story_event}.001\n\t\t}\n\t}\n}');
                items.push(storyCycleItem);
                break;
            case 'important_action':
                const importantActionItem = new vscode.CompletionItem('important_action_name', vscode.CompletionItemKind.Class);
                importantActionItem.detail = 'Define a new important action';
                importantActionItem.insertText = new vscode.SnippetString('${1:important_action_name} = {\n\ttype = ${2|action_type_alert,action_type_interaction,action_type_decision,action_type_scheme|}\n\tpriority = ${3:100}\n\n\tcheck_create_action = {\n\t\tis_ruler = yes\n\t\t$0\n\t}\n\n\teffect = {\n\t\topen_view_data = {\n\t\t\tview = ${4:character}\n\t\t\tplayer = root\n\t\t}\n\t}\n}');
                items.push(importantActionItem);
                break;
            case 'vassal_contract':
                const vassalContractItem = new vscode.CompletionItem('vassal_contract_name', vscode.CompletionItemKind.Class);
                vassalContractItem.detail = 'Define a new vassal contract obligation';
                vassalContractItem.insertText = new vscode.SnippetString('${1:obligation_name} = {\n\tvassal_obligation_level = {\n\t\tdefault = yes\n\n\t\ttax_contribution = ${2:0.1}\n\t\tlevy_contribution = ${3:0.1}\n\n\t\tvassal_opinion = ${4:-5}\n\t\t$0\n\t}\n\n\tvassal_obligation_level = {\n\t\ttax_contribution = ${5:0.2}\n\t\tlevy_contribution = ${6:0.2}\n\n\t\tvassal_opinion = ${7:-10}\n\t}\n\n\tis_shown = {\n\t\tscope:liege = { government_has_flag = government_is_feudal }\n\t}\n}');
                items.push(vassalContractItem);
                break;
            case 'landed_title':
                const empireItem = new vscode.CompletionItem('e_empire_name', vscode.CompletionItemKind.Class);
                empireItem.detail = 'Define a new empire title';
                empireItem.insertText = new vscode.SnippetString('e_${1:empire_name} = {\n\tcolor = { ${2:150} ${3:50} ${4:50} }\n\tcapital = c_${5:capital}\n\n\tai_primary_priority = {\n\t\tbase = 100\n\t}\n\n\t$0\n}');
                items.push(empireItem);
                const kingdomItem = new vscode.CompletionItem('k_kingdom_name', vscode.CompletionItemKind.Class);
                kingdomItem.detail = 'Define a new kingdom title';
                kingdomItem.insertText = new vscode.SnippetString('k_${1:kingdom_name} = {\n\tcolor = { ${2:100} ${3:100} ${4:150} }\n\tcapital = c_${5:capital}\n\n\t$0\n}');
                items.push(kingdomItem);
                const duchyItem = new vscode.CompletionItem('d_duchy_name', vscode.CompletionItemKind.Class);
                duchyItem.detail = 'Define a new duchy title';
                duchyItem.insertText = new vscode.SnippetString('d_${1:duchy_name} = {\n\tcolor = { ${2:80} ${3:120} ${4:80} }\n\tcapital = c_${5:capital}\n\n\t$0\n}');
                items.push(duchyItem);
                const countyItem = new vscode.CompletionItem('c_county_name', vscode.CompletionItemKind.Class);
                countyItem.detail = 'Define a new county title';
                countyItem.insertText = new vscode.SnippetString('c_${1:county_name} = {\n\tcolor = { ${2:200} ${3:180} ${4:140} }\n\n\tb_${1:county_name} = {\n\t\tprovince = ${5:1234}\n\t}\n\t$0\n}');
                items.push(countyItem);
                break;
            case 'coat_of_arms':
                const coaItem = new vscode.CompletionItem('title_coa', vscode.CompletionItemKind.Class);
                coaItem.detail = 'Define a coat of arms';
                coaItem.insertText = new vscode.SnippetString('${1:k_example} = {\n\tpattern = "pattern_${2|solid,quarterly,barry,bendy|}.dds"\n\tcolor1 = ${3:red}\n\tcolor2 = ${4:yellow}\n\n\tcolored_emblem = {\n\t\tinstance = {\n\t\t\tposition = { 0.5 0.5 }\n\t\t\tscale = { 1.0 1.0 }\n\t\t}\n\t\ttexture = "ce_${5:lion_rampant}.dds"\n\t\tcolor1 = ${6:yellow}\n\t\t$0\n\t}\n}');
                items.push(coaItem);
                break;
            case 'innovation':
                const innovItem = new vscode.CompletionItem('innovation_name', vscode.CompletionItemKind.Class);
                innovItem.detail = 'Define a new innovation';
                innovItem.insertText = new vscode.SnippetString('innovation_${1:name} = {\n\tgroup = ${2|culture_group_military,culture_group_civic,culture_group_regional|}\n\tculture_era = ${3|culture_era_tribal,culture_era_early_medieval,culture_era_high_medieval,culture_era_late_medieval|}\n\n\ticon = "gfx/interface/icons/culture_innovations/innovation_${1:name}.dds"\n\n\tpotential = {\n\t\t$0\n\t}\n\n\tcharacter_modifier = {\n\t\t\n\t}\n\n\tunlock_building = ${4:building_name}\n}');
                items.push(innovItem);
                break;
            case 'doctrine':
                const docItem = new vscode.CompletionItem('doctrine_name', vscode.CompletionItemKind.Class);
                docItem.detail = 'Define a new doctrine';
                docItem.insertText = new vscode.SnippetString('doctrine_${1:name} = {\n\tgroup = "${2:doctrine_group}"\n\n\tpiety_cost = {\n\t\tvalue = ${3:500}\n\t}\n\n\tcan_pick = {\n\t\t$0\n\t}\n\n\tparameters = {\n\t\t\n\t}\n\n\tcharacter_modifier = {\n\t\t\n\t}\n}');
                items.push(docItem);
                break;
            case 'holy_site':
                const hsItem = new vscode.CompletionItem('holy_site_name', vscode.CompletionItemKind.Class);
                hsItem.detail = 'Define a new holy site';
                hsItem.insertText = new vscode.SnippetString('${1:holy_site_name} = {\n\tcounty = c_${2:county}\n\tbarony = b_${3:barony}\n\n\tcharacter_modifier = {\n\t\tmonthly_piety_gain_mult = 0.1\n\t\t$0\n\t}\n\n\tcounty_modifier = {\n\t\tdevelopment_growth_factor = 0.05\n\t}\n}');
                items.push(hsItem);
                break;
            case 'holding':
                const holdItem = new vscode.CompletionItem('holding_name', vscode.CompletionItemKind.Class);
                holdItem.detail = 'Define a new holding type';
                holdItem.insertText = new vscode.SnippetString('${1:holding_name}_holding = {\n\tprimary_building = ${2:castle_01}\n\n\tbuildings = {\n\t\t${3:castle_walls}\n\t\t$0\n\t}\n\n\tflag = ${1:holding_name}\n\n\tprovince_modifier = {\n\t\tgarrison_size = 500\n\t}\n\n\tcan_construct = {\n\t\tholder = { government_has_flag = government_is_feudal }\n\t}\n}');
                items.push(holdItem);
                break;
            case 'dynasty':
                const dynItem = new vscode.CompletionItem('dynasty_id', vscode.CompletionItemKind.Class);
                dynItem.detail = 'Define a new dynasty';
                dynItem.insertText = new vscode.SnippetString('${1:1000} = {\n\tname = "dynn_${2:Dynasty_Name}"\n\tculture = ${3:french}\n\t$0\n}');
                items.push(dynItem);
                break;
            case 'character_history':
                const charItem = new vscode.CompletionItem('character_id', vscode.CompletionItemKind.Class);
                charItem.detail = 'Define a character in history';
                charItem.insertText = new vscode.SnippetString('${1:100000} = {\n\tname = "${2:Character_Name}"\n\tdynasty = ${3:1000}\n\treligion = "${4:catholic}"\n\tculture = "${5:french}"\n\t${6:father} = ${7:100001}\n\t${8|martial,diplomacy,stewardship,intrigue,learning|} = ${9:10}\n\ttrait = ${10:brave}\n\n\t${11:800}.1.1 = {\n\t\tbirth = yes\n\t}\n\t${12:870}.1.1 = {\n\t\tdeath = yes\n\t}\n\t$0\n}');
                items.push(charItem);
                break;
            case 'terrain':
                const terrItem = new vscode.CompletionItem('terrain_name', vscode.CompletionItemKind.Class);
                terrItem.detail = 'Define a new terrain type';
                terrItem.insertText = new vscode.SnippetString('${1:terrain_name} = {\n\tcolor = { ${2:128} ${3:128} ${4:64} }\n\tmovement_speed = ${5:1.0}\n\tcombat_width = ${6:1.0}\n\tsupply_limit = ${7:5}\n\n\tdefender_advantage = ${8:0}\n\n\tprovince_modifier = {\n\t\t$0\n\t}\n}');
                items.push(terrItem);
                break;
            case 'scripted_gui':
                const guiItem = new vscode.CompletionItem('scripted_gui_name', vscode.CompletionItemKind.Class);
                guiItem.detail = 'Define a new scripted GUI';
                guiItem.insertText = new vscode.SnippetString('${1:gui_name} = {\n\tscope = ${2|character,title,province,faith,culture,dynasty,none|}\n\n\tis_shown = {\n\t\t$0\n\t}\n\n\tis_valid = {\n\t\tis_available = yes\n\t}\n\n\teffect = {\n\t\t\n\t}\n}');
                items.push(guiItem);
                break;
            case 'custom_localization':
                const clItem = new vscode.CompletionItem('custom_loc_name', vscode.CompletionItemKind.Class);
                clItem.detail = 'Define customizable localization';
                clItem.insertText = new vscode.SnippetString('Get${1:CustomText} = {\n\ttype = ${2|character,title,province,faith,culture,none|}\n\n\ttext = {\n\t\ttrigger = {\n\t\t\t$0\n\t\t}\n\t\tlocalization_key = "${3:LOC_KEY_1}"\n\t}\n\n\ttext = {\n\t\tfallback = yes\n\t\tlocalization_key = "${4:LOC_KEY_DEFAULT}"\n\t}\n}');
                items.push(clItem);
                break;
            case 'flavorization':
                const flavItem = new vscode.CompletionItem('flavorization_name', vscode.CompletionItemKind.Class);
                flavItem.detail = 'Define title flavorization';
                flavItem.insertText = new vscode.SnippetString('${1:flav_name} = {\n\ttype = ${2|character,title|}\n\tpriority = ${3:100}\n\n\tgender = ${4|male,female|}\n\ttier = ${5|baron,count,duke,king,emperor|}\n\n\tgovernments = { ${6:feudal_government} }\n\treligions = { ${7:religion:christianity_religion} }\n\n\tname = {\n\t\tname_list = {\n\t\t\t$0\n\t\t}\n\t}\n}');
                items.push(flavItem);
                break;
            case 'deathreasons':
                const deathItem = new vscode.CompletionItem('death_reason_name', vscode.CompletionItemKind.Class);
                deathItem.detail = 'Define a new death reason';
                deathItem.insertText = new vscode.SnippetString('death_${1:reason_name} = {\n\ticon = "gfx/interface/icons/death_reasons/death_${1:reason_name}.dds"\n\tdefault = ${2|no,yes|}\n\tnatural = ${3|no,yes|}\n\tpriority = ${4:100}\n\n\tis_valid = {\n\t\t$0\n\t}\n}');
                items.push(deathItem);
                break;
            case 'succession_election':
                const elecItem = new vscode.CompletionItem('election_type_name', vscode.CompletionItemKind.Class);
                elecItem.detail = 'Define a new succession election type';
                elecItem.insertText = new vscode.SnippetString('${1:election_name} = {\n\tcandidates = {\n\t\tadd = {\n\t\t\ttype = holder_direct_vassal\n\t\t\tlimit = {\n\t\t\t\tis_landed = yes\n\t\t\t}\n\t\t}\n\t}\n\n\telectors = {\n\t\tadd = {\n\t\t\ttype = holder_direct_vassal\n\t\t}\n\t}\n\n\tcandidate_score = {\n\t\tbase = 100\n\t\t$0\n\t}\n\n\telector_vote_strength = {\n\t\tbase = 1\n\t}\n}');
                items.push(elecItem);
                break;
            case 'scripted_relation':
                const relItem = new vscode.CompletionItem('relation_name', vscode.CompletionItemKind.Class);
                relItem.detail = 'Define a new scripted relation';
                relItem.insertText = new vscode.SnippetString('${1:relation_name} = {\n\topinion = ${2:20}\n\treciprocal = ${3|yes,no|}\n\thidden = ${4|no,yes|}\n\n\tis_valid = {\n\t\t$0\n\t}\n\n\ton_add = {\n\t\t\n\t}\n\n\ton_remove = {\n\t\t\n\t}\n}');
                items.push(relItem);
                break;
            case 'named_colors':
                const colorItem = new vscode.CompletionItem('color_name', vscode.CompletionItemKind.Color);
                colorItem.detail = 'Define a named color';
                colorItem.insertText = new vscode.SnippetString('${1:my_color} = ${2|rgb,hsv,hex|} { ${3:128} ${4:64} ${5:192} }');
                items.push(colorItem);
                break;
            case 'event_background':
                const bgItem = new vscode.CompletionItem('event_background_name', vscode.CompletionItemKind.Class);
                bgItem.detail = 'Define an event background';
                bgItem.insertText = new vscode.SnippetString('${1:background_name} = {\n\tbackground = "gfx/interface/event_window/event_backgrounds/${1:background_name}.dds"\n\tenvironment = "${2:environment_event_standard}"\n\tambience = "event:/SFX/Events/Ambience/${3:castle_interior}"\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(bgItem);
                break;
            case 'pool_selector':
                const poolItem = new vscode.CompletionItem('pool_selector_name', vscode.CompletionItemKind.Class);
                poolItem.detail = 'Define a pool character selector';
                poolItem.insertText = new vscode.SnippetString('${1:selector_name} = {\n\tpool = ${2|courtier,guest,wanderer,generated|}\n\n\tage = {\n\t\tmin = ${3:16}\n\t\tmax = ${4:40}\n\t}\n\n\tgender = ${5|any,male,female|}\n\n\tfilter = {\n\t\tis_adult = yes\n\t\t$0\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n}');
                items.push(poolItem);
                break;
            case 'scripted_modifier':
                const scriptedModItem = new vscode.CompletionItem('scripted_modifier_name', vscode.CompletionItemKind.Function);
                scriptedModItem.detail = 'Define a new scripted modifier';
                scriptedModItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tvalue = ${2:0}\n\n\tadd = {\n\t\tvalue = ${3:10}\n\t\tif = {\n\t\t\tlimit = {\n\t\t\t\t$0\n\t\t\t}\n\t\t\tadd = ${4:5}\n\t\t}\n\t}\n}');
                items.push(scriptedModItem);
                break;
            case 'scripted_rules':
                const scriptedRuleItem = new vscode.CompletionItem('scripted_rule_name', vscode.CompletionItemKind.Function);
                scriptedRuleItem.detail = 'Define a new scripted rule';
                scriptedRuleItem.insertText = new vscode.SnippetString('${1:rule_name} = {\n\tOR = {\n\t\t$0\n\t}\n}');
                items.push(scriptedRuleItem);
                break;
            case 'game_concept':
                const gameConceptItem = new vscode.CompletionItem('game_concept_name', vscode.CompletionItemKind.Class);
                gameConceptItem.detail = 'Define a new game concept';
                gameConceptItem.insertText = new vscode.SnippetString('${1:concept_name} = {\n\talias = {\n\t\t"${2:alias1}"\n\t\t"${3:alias2}"\n\t}\n\tparent = "${4:parent_concept}"\n\ttexture = "gfx/interface/icons/game_concepts/${1:concept_name}.dds"\n\t$0\n}');
                items.push(gameConceptItem);
                break;
            case 'message':
                const messageItem = new vscode.CompletionItem('message_name', vscode.CompletionItemKind.Class);
                messageItem.detail = 'Define a new message type';
                messageItem.insertText = new vscode.SnippetString('${1:message_name} = {\n\tdisplay = ${2|feed,toast,popup|}\n\ttitle = "${1:message_name}_title"\n\tdesc = "${1:message_name}_desc"\n\tstyle = "${3|good,bad,neutral|}"\n\ticon = "gfx/interface/icons/message_icons/${4:generic}.dds"\n\n\ton_click = {\n\t\t$0\n\t}\n}');
                items.push(messageItem);
                break;
            case 'scripted_list':
                const scriptedListItem = new vscode.CompletionItem('scripted_list_name', vscode.CompletionItemKind.Class);
                scriptedListItem.detail = 'Define a new scripted list';
                scriptedListItem.insertText = new vscode.SnippetString('${1:list_name} = {\n\tadd = {\n\t\t${2:item1}\n\t\t${3:item2}\n\t\t$0\n\t}\n}');
                items.push(scriptedListItem);
                break;
            case 'title_history':
                const titleHistItem = new vscode.CompletionItem('title_history_entry', vscode.CompletionItemKind.Class);
                titleHistItem.detail = 'Define title history';
                titleHistItem.insertText = new vscode.SnippetString('${1:k_example} = {\n\t${2:867}.1.1 = {\n\t\tholder = ${3:12345}\n\t\tgovernment = ${4:feudal_government}\n\t\tliege = ${5:e_example}\n\t\t$0\n\t}\n}');
                items.push(titleHistItem);
                break;
            case 'accolade_type':
                const accoladeItem = new vscode.CompletionItem('accolade_type_name', vscode.CompletionItemKind.Class);
                accoladeItem.detail = 'Define a new accolade type';
                accoladeItem.insertText = new vscode.SnippetString('${1:accolade_name} = {\n\tcategory = ${2|arena,commander,duelist,hunter,jousting,tourney|}\n\trank = ${3:1}\n\n\tpotential = {\n\t\t$0\n\t}\n\n\tknight_modifier = {\n\t\tknight_effectiveness_mult = 0.1\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(accoladeItem);
                break;
            case 'character_memory':
                const memoryItem = new vscode.CompletionItem('memory_type_name', vscode.CompletionItemKind.Class);
                memoryItem.detail = 'Define a new character memory type';
                memoryItem.insertText = new vscode.SnippetString('${1:memory_name} = {\n\tcategory = "${2:diplomatic}"\n\ttype = ${3|positive,negative,neutral|}\n\n\tduration = {\n\t\tyears = ${4:10}\n\t}\n\n\tparticipants = {\n\t\ttarget = {\n\t\t\tscope_type = character\n\t\t}\n\t}\n\n\ton_creation = {\n\t\t$0\n\t}\n}');
                items.push(memoryItem);
                break;
            case 'court_amenity':
                const amenityItem = new vscode.CompletionItem('court_amenity_name', vscode.CompletionItemKind.Class);
                amenityItem.detail = 'Define a new court amenity level';
                amenityItem.insertText = new vscode.SnippetString('${1:amenity_level_name} = {\n\ttype = ${2|court_lodging,court_food,court_fashion,court_servants|}\n\tdefault = ${3|no,yes|}\n\n\tcost = {\n\t\tgold = ${4:2}\n\t}\n\n\towner_modifier = {\n\t\t$0\n\t}\n\n\tcourt_grandeur_contribution = {\n\t\tbase = ${5:5}\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(amenityItem);
                break;
            case 'dynasty_house':
                const houseItem = new vscode.CompletionItem('house_id', vscode.CompletionItemKind.Class);
                houseItem.detail = 'Define a new dynasty house';
                houseItem.insertText = new vscode.SnippetString('house_${1:house_name} = {\n\tname = "dynn_${1:house_name}"\n\tdynasty = ${2:1000}\n\tmotto = "HOUSE_${1:house_name}_MOTTO"\n\t$0\n}');
                items.push(houseItem);
                break;
            case 'legend':
                const legendItem = new vscode.CompletionItem('legend_name', vscode.CompletionItemKind.Class);
                legendItem.detail = 'Define a new legend';
                legendItem.insertText = new vscode.SnippetString('${1:legend_name} = {\n\ttype = ${2|heroic,holy,legitimizing|}\n\tquality = ${3|famed,illustrious,mythical|}\n\n\ttitle = "LEGEND_${1:legend_name}_TITLE"\n\tdesc = "LEGEND_${1:legend_name}_DESC"\n\n\tcan_create = {\n\t\t$0\n\t}\n\n\ton_start = {\n\t\t\n\t}\n\n\ton_complete = {\n\t\t\n\t}\n\n\towner_modifier = {\n\t\tmonthly_prestige = 0.5\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(legendItem);
                break;
            case 'travel':
                const travelItem = new vscode.CompletionItem('travel_type_name', vscode.CompletionItemKind.Class);
                travelItem.detail = 'Define travel configuration';
                travelItem.insertText = new vscode.SnippetString('${1:travel_name} = {\n\ttravel_plan_type = "${2:pilgrimage}"\n\n\tcan_start = {\n\t\tis_available = yes\n\t\t$0\n\t}\n\n\ton_departure = {\n\t\t\n\t}\n\n\ton_arrival = {\n\t\t\n\t}\n\n\ttravel_speed = {\n\t\tbase = 1.0\n\t}\n\n\ttravel_safety = {\n\t\tbase = 50\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(travelItem);
                break;
            case 'struggle':
                const struggleItem = new vscode.CompletionItem('struggle_name', vscode.CompletionItemKind.Class);
                struggleItem.detail = 'Define a new struggle';
                struggleItem.insertText = new vscode.SnippetString('${1:struggle_name} = {\n\tstart_phase = ${2:struggle_phase_opportunity}\n\tregion = ${3:world_europe_west_iberia}\n\n\tinvolvement = {\n\t\tinvolved = {\n\t\t\ttrigger = {\n\t\t\t\t$0\n\t\t\t}\n\t\t}\n\t}\n\n\tphases = {\n\t\tstruggle_phase_opportunity = {\n\t\t\tfuture_phases = {\n\t\t\t\tstruggle_phase_hostility = { catalysts = { } }\n\t\t\t}\n\t\t}\n\t}\n}');
                items.push(struggleItem);
                break;
            case 'inspiration':
                const inspirItem = new vscode.CompletionItem('inspiration_name', vscode.CompletionItemKind.Class);
                inspirItem.detail = 'Define a new inspiration type';
                inspirItem.insertText = new vscode.SnippetString('${1:inspiration_name} = {\n\ttype = ${2|weapon,armor,regalia,book,wall_art,sculpture|}\n\n\tgold_cost = {\n\t\tvalue = ${3:200}\n\t}\n\n\tsponsor_trigger = {\n\t\thas_royal_court = yes\n\t\t$0\n\t}\n\n\ton_complete = {\n\t\tcreate_artifact = {\n\t\t\tname = artifact_${1:inspiration_name}\n\t\t\ttype = ${2:weapon}\n\t\t}\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(inspirItem);
                break;
            case 'diarchy':
                const diarchyItem = new vscode.CompletionItem('diarchy_type_name', vscode.CompletionItemKind.Class);
                diarchyItem.detail = 'Define a new diarchy type';
                diarchyItem.insertText = new vscode.SnippetString('${1:diarchy_name} = {\n\tdiarch_type = ${2|regency,co_ruler,designated_regent|}\n\n\tcan_be_diarch = {\n\t\tis_adult = yes\n\t\t$0\n\t}\n\n\tliege_mandate = {\n\t\trealm_laws = yes\n\t}\n\n\tdiarch_mandate = {\n\t\twarfare = yes\n\t}\n\n\tdiarch_modifier = {\n\t\tmonthly_prestige = 0.5\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(diarchyItem);
                break;
            case 'domicile':
                const domicileItem = new vscode.CompletionItem('domicile_name', vscode.CompletionItemKind.Class);
                domicileItem.detail = 'Define a new domicile type';
                domicileItem.insertText = new vscode.SnippetString('${1:domicile_name} = {\n\ttype = ${2|manor,estate,villa,palace|}\n\tbuilding_slots = ${3:4}\n\n\tcan_own = {\n\t\t$0\n\t}\n\n\tcost = {\n\t\tgold = ${4:500}\n\t}\n\n\towner_modifier = {\n\t\tmonthly_prestige = 0.3\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(domicileItem);
                break;
            case 'great_project':
                const greatProjItem = new vscode.CompletionItem('great_project_name', vscode.CompletionItemKind.Class);
                greatProjItem.detail = 'Define a new great project';
                greatProjItem.insertText = new vscode.SnippetString('${1:project_name} = {\n\ttype = ${2|wonder,special_building|}\n\tcounty = ${3:c_roma}\n\tbarony = ${4:b_roma}\n\n\tbuild_cost = {\n\t\tgold = ${5:2000}\n\t}\n\n\tcan_construct = {\n\t\t$0\n\t}\n\n\tcharacter_modifier = {\n\t\tmonthly_prestige = 1.0\n\t}\n\n\tprovince_modifier = {\n\t\ttax_mult = 0.2\n\t}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(greatProjItem);
                break;
            case 'epidemic':
                const epidemicItem = new vscode.CompletionItem('epidemic_name', vscode.CompletionItemKind.Class);
                epidemicItem.detail = 'Define a new epidemic';
                epidemicItem.insertText = new vscode.SnippetString('${1:epidemic_name} = {\n\ttrait = ${2:bubonic_plague}\n\tspread_speed = ${3:1.0}\n\n\tduration = {\n\t\tmonths = ${4:12}\n\t}\n\n\tinfection_chance = {\n\t\tbase = 0.1\n\t}\n\n\tmortality_rate = {\n\t\tbase = 0.3\n\t}\n\n\tprovince_modifier = {\n\t\ttax_mult = -0.3\n\t\tlevy_size = -0.5\n\t}\n\n\tcan_infect = {\n\t\t$0\n\t}\n}');
                items.push(epidemicItem);
                break;
            case 'house_unity':
                const unityItem = new vscode.CompletionItem('house_unity_level', vscode.CompletionItemKind.Class);
                unityItem.detail = 'Define a house unity level';
                unityItem.insertText = new vscode.SnippetString('${1:unity_level_name} = {\n\tunity_stage = "${2:high_unity}"\n\tunity_value = {\n\t\tmin = ${3:75}\n\t\tmax = ${4:100}\n\t}\n\n\thouse_modifier = {\n\t\t$0\n\t}\n\n\tparameters = {\n\t\t\n\t}\n}');
                items.push(unityItem);
                break;
            case 'legitimacy':
                const legitItem = new vscode.CompletionItem('legitimacy_level', vscode.CompletionItemKind.Class);
                legitItem.detail = 'Define a legitimacy level';
                legitItem.insertText = new vscode.SnippetString('${1:legitimacy_level_name} = {\n\tlegitimacy_level = "${2:high_legitimacy}"\n\tthreshold = ${3:75}\n\n\tcharacter_modifier = {\n\t\tmonthly_prestige = 1.0\n\t\tvassal_opinion = 10\n\t\t$0\n\t}\n\n\tparameters = {\n\t\t\n\t}\n}');
                items.push(legitItem);
                break;
            case 'tax_slot':
                const taxItem = new vscode.CompletionItem('tax_slot_name', vscode.CompletionItemKind.Class);
                taxItem.detail = 'Define a tax slot';
                taxItem.insertText = new vscode.SnippetString('${1:tax_slot_name} = {\n\tslot_type = "${2:noble_obligations}"\n\tmax_level = ${3:5}\n\n\tlevels = {\n\t\tlevel_1 = {\n\t\t\ttax_contribution = 0.1\n\t\t\tvassal_opinion = -5\n\t\t\t$0\n\t\t}\n\t}\n\n\tis_shown = {\n\t\thas_government = feudal_government\n\t}\n}');
                items.push(taxItem);
                break;
            case 'vassal_stance':
                const stanceItem = new vscode.CompletionItem('vassal_stance_name', vscode.CompletionItemKind.Class);
                stanceItem.detail = 'Define a vassal stance';
                stanceItem.insertText = new vscode.SnippetString('${1:stance_name} = {\n\tstance_type = ${2|loyal,content,discontented,rebellious|}\n\n\tpotential = {\n\t\t$0\n\t}\n\n\tliege_modifier = {\n\t\tvassal_opinion = 5\n\t}\n\n\tvassal_modifier = {\n\t\tmonthly_prestige = 0.2\n\t}\n\n\ttax_factor = ${3:1.0}\n\tlevy_factor = ${4:1.0}\n\n\tai_will_do = {\n\t\tbase = 100\n\t}\n}');
                items.push(stanceItem);
                break;
            case 'suggestion':
                const suggestItem = new vscode.CompletionItem('suggestion_name', vscode.CompletionItemKind.Class);
                suggestItem.detail = 'Define a suggestion';
                suggestItem.insertText = new vscode.SnippetString('${1:suggestion_name} = {\n\tsuggestion_type = ${2|alert,notification,tutorial,action|}\n\tpriority = ${3:100}\n\n\ttitle = "${1:suggestion_name}_title"\n\tdesc = "${1:suggestion_name}_desc"\n\n\tis_shown = {\n\t\t$0\n\t}\n\n\ton_click = {\n\t\t\n\t}\n\n\tcan_dismiss = yes\n}');
                items.push(suggestItem);
                break;
            case 'scripted_cost':
                const costItem = new vscode.CompletionItem('scripted_cost_name', vscode.CompletionItemKind.Function);
                costItem.detail = 'Define a scripted cost';
                costItem.insertText = new vscode.SnippetString('${1:cost_name} = {\n\tgold = {\n\t\tvalue = ${2:100}\n\t\t$0\n\t}\n}');
                items.push(costItem);
                break;
            case 'scripted_animation':
                const animItem = new vscode.CompletionItem('scripted_animation_name', vscode.CompletionItemKind.Class);
                animItem.detail = 'Define a scripted animation';
                animItem.insertText = new vscode.SnippetString('${1:animation_name} = {\n\tanimation = "${2:personality_bold}"\n\tduration = ${3:2.5}\n\t$0\n}');
                items.push(animItem);
                break;
            case 'scripted_character_template':
                const templateItem = new vscode.CompletionItem('character_template_name', vscode.CompletionItemKind.Class);
                templateItem.detail = 'Define a character template';
                templateItem.insertText = new vscode.SnippetString('${1:template_name} = {\n\tgender = ${2|male,female|}\n\tage = {\n\t\tmin = ${3:20}\n\t\tmax = ${4:40}\n\t}\n\trandom_traits = yes\n\n\tafter_creation = {\n\t\t$0\n\t}\n}');
                items.push(templateItem);
                break;
            case 'event_theme':
                const themeItem = new vscode.CompletionItem('event_theme_name', vscode.CompletionItemKind.Class);
                themeItem.detail = 'Define an event theme';
                themeItem.insertText = new vscode.SnippetString('${1:theme_name} = {\n\ticon = "gfx/interface/icons/event_themes/${1:theme_name}.dds"\n\tbackground = "gfx/interface/event_window/event_bg_${1:theme_name}.dds"\n\tcolor = { ${2:0.5} ${3:0.5} ${4:0.5} }\n\tpriority = ${5:100}\n\t$0\n}');
                items.push(themeItem);
                break;
            case 'casus_belli_group':
                const cbGroupItem = new vscode.CompletionItem('cb_group_name', vscode.CompletionItemKind.Class);
                cbGroupItem.detail = 'Define a casus belli group';
                cbGroupItem.insertText = new vscode.SnippetString('${1:cb_group_name} = {\n\tname = "${1:cb_group_name}_NAME"\n\tdesc = "${1:cb_group_name}_DESC"\n\ticon = "gfx/interface/icons/cb_groups/${1:cb_group_name}.dds"\n\torder = ${2:10}\n\tcolor = { ${3:0.8} ${4:0.2} ${5:0.2} }\n\t$0\n}');
                items.push(cbGroupItem);
                break;
            case 'ai_war_stance':
                const warStanceItem = new vscode.CompletionItem('ai_war_stance_name', vscode.CompletionItemKind.Class);
                warStanceItem.detail = 'Define an AI war stance';
                warStanceItem.insertText = new vscode.SnippetString('${1:stance_name} = {\n\tstance_type = ${2|aggressive,defensive,balanced,cautious|}\n\tpursue_battles = ${3|yes,no|}\n\tsiege_priority = ${4:1.0}\n\tdefend_priority = ${5:1.0}\n\n\ttrigger = {\n\t\t$0\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n}');
                items.push(warStanceItem);
                break;
            case 'combat_phase_event':
                const combatItem = new vscode.CompletionItem('combat_phase_event_name', vscode.CompletionItemKind.Class);
                combatItem.detail = 'Define a combat phase event';
                combatItem.insertText = new vscode.SnippetString('${1:event_name} = {\n\tphase = ${2|opening,skirmish,melee,pursuit,retreat|}\n\n\ttrigger = {\n\t\t$0\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n\n\teffect = {\n\t\t\n\t}\n}');
                items.push(combatItem);
                break;
            case 'bookmark_portrait':
                const bmPortItem = new vscode.CompletionItem('bookmark_portrait', vscode.CompletionItemKind.Class);
                bmPortItem.detail = 'Define a bookmark portrait';
                bmPortItem.insertText = new vscode.SnippetString('character = {\n\tname = "${1:CHARACTER_NAME}"\n\tdynasty = ${2:1000}\n\ttype = ${3|bookmark_playable_character,bookmark_suggested_character|}\n\ttitle = ${4:k_england}\n\tgovernment = ${5:feudal_government}\n\tposition = { ${6:650} ${7:350} }\n\tanimation = ${8|personality_bold,idle,happiness|}\n\tdifficulty = ${9|easy,medium,hard,very_hard|}\n\t$0\n}');
                items.push(bmPortItem);
                break;
            case 'guest_system':
                const guestSysItem = new vscode.CompletionItem('guest_system_config', vscode.CompletionItemKind.Class);
                guestSysItem.detail = 'Define guest system configuration';
                guestSysItem.insertText = new vscode.SnippetString('${1:config_name} = {\n\tguest_arrival_chance = {\n\t\tbase = ${2:0.5}\n\t}\n\n\tcan_receive_guests = {\n\t\t$0\n\t}\n\n\ton_guest_arrival = {\n\t\t\n\t}\n}');
                items.push(guestSysItem);
                break;
            case 'courtier_guest_management':
                const cgmItem = new vscode.CompletionItem('courtier_management_name', vscode.CompletionItemKind.Class);
                cgmItem.detail = 'Define courtier/guest management';
                cgmItem.insertText = new vscode.SnippetString('${1:management_name} = {\n\tmanagement_type = ${2|courtier,guest,prisoner|}\n\n\tlist_filter = {\n\t\t$0\n\t}\n\n\ton_join_court = {\n\t\t\n\t}\n}');
                items.push(cgmItem);
                break;
            case 'task_contract':
                const taskConItem = new vscode.CompletionItem('task_contract_name', vscode.CompletionItemKind.Class);
                taskConItem.detail = 'Define a task contract';
                taskConItem.insertText = new vscode.SnippetString('${1:contract_name} = {\n\tcontract_type = "${2:mercenary}"\n\n\tduration = {\n\t\tyears = ${3:2}\n\t}\n\n\tcost = {\n\t\tgold = ${4:100}\n\t}\n\n\tcan_establish = {\n\t\t$0\n\t}\n\n\ton_establish = {\n\t\t\n\t}\n}');
                items.push(taskConItem);
                break;
            case 'subject_contract':
                const subConItem = new vscode.CompletionItem('subject_contract_name', vscode.CompletionItemKind.Class);
                subConItem.detail = 'Define a subject contract';
                subConItem.insertText = new vscode.SnippetString('${1:contract_name} = {\n\tcontract_type = "${2:tributary}"\n\n\ttax_obligation = {\n\t\tlevel_1 = {\n\t\t\tcontribution = 0.1\n\t\t\topinion = -5\n\t\t}\n\t}\n\n\tcan_change = {\n\t\t$0\n\t}\n}');
                items.push(subConItem);
                break;
            case 'lease_contract':
                const leaseItem = new vscode.CompletionItem('lease_contract_name', vscode.CompletionItemKind.Class);
                leaseItem.detail = 'Define a lease contract';
                leaseItem.insertText = new vscode.SnippetString('${1:lease_name} = {\n\tlease_type = ${2|county,barony,building|}\n\n\tduration = {\n\t\tyears = ${3:10}\n\t}\n\n\tinitial_cost = {\n\t\tgold = ${4:200}\n\t}\n\n\tcan_lease = {\n\t\t$0\n\t}\n\n\ton_lease_start = {\n\t\t\n\t}\n}');
                items.push(leaseItem);
                break;
            case 'character_background':
                const charBgItem = new vscode.CompletionItem('character_background_name', vscode.CompletionItemKind.Class);
                charBgItem.detail = 'Define a character background';
                charBgItem.insertText = new vscode.SnippetString('${1:background_name} = {\n\tbackground = "${2:noble}"\n\n\ttrigger = {\n\t\t$0\n\t}\n\n\tmodifier = {\n\t\t\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n}');
                items.push(charBgItem);
                break;
            case 'dna_data':
                const dnaItem = new vscode.CompletionItem('dna_data_name', vscode.CompletionItemKind.Class);
                dnaItem.detail = 'Define DNA data';
                dnaItem.insertText = new vscode.SnippetString('${1:dna_name} = {\n\tportrait_info = {\n\t\tgenes = {\n\t\t\t$0\n\t\t}\n\t}\n}');
                items.push(dnaItem);
                break;
            case 'portrait_modifier':
                const pmItem = new vscode.CompletionItem('portrait_modifier_name', vscode.CompletionItemKind.Class);
                pmItem.detail = 'Define a portrait modifier';
                pmItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tusage = ${2|game,editor,both|}\n\n\tdna_modifiers = {\n\t\taccessory = {\n\t\t\tmode = ${3|add,replace,modify|}\n\t\t\tgene = ${4:gene_hairstyles}\n\t\t\t$0\n\t\t}\n\t}\n}');
                items.push(pmItem);
                break;
            case 'nickname_rule':
                const nnrItem = new vscode.CompletionItem('nickname_rule_name', vscode.CompletionItemKind.Class);
                nnrItem.detail = 'Define a nickname rule';
                nnrItem.insertText = new vscode.SnippetString('${1:rule_name} = {\n\tname = "${2:nickname_the_great}"\n\tis_prefix = ${3|no,yes|}\n\tis_bad = ${4|no,yes|}\n\n\ttrigger = {\n\t\t$0\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n}');
                items.push(nnrItem);
                break;
            case 'succession_law':
                const slItem = new vscode.CompletionItem('succession_law_name', vscode.CompletionItemKind.Class);
                slItem.detail = 'Define a succession law';
                slItem.insertText = new vscode.SnippetString('${1:law_name} = {\n\tsuccession_type = ${2|partition,single_heir,elective|}\n\tgender_law = ${3|male_only,male_preference,equal,female_preference,female_only|}\n\n\tcan_have = {\n\t\t$0\n\t}\n\n\tcan_pass = {\n\t\t\n\t}\n\n\tpass_cost = {\n\t\tprestige = 500\n\t}\n}');
                items.push(slItem);
                break;
            case 'war_goal':
                const wgItem = new vscode.CompletionItem('war_goal_name', vscode.CompletionItemKind.Class);
                wgItem.detail = 'Define a war goal';
                wgItem.insertText = new vscode.SnippetString('${1:goal_name} = {\n\twar_goal_type = ${2|take_title,take_county,independence,dejure,claim,religious|}\n\n\ton_victory = {\n\t\t$0\n\t}\n\n\ton_defeat = {\n\t\t\n\t}\n\n\tvalid_to_start = {\n\t\t\n\t}\n}');
                items.push(wgItem);
                break;
            case 'scripted_illustration':
                const siItem = new vscode.CompletionItem('scripted_illustration_name', vscode.CompletionItemKind.Class);
                siItem.detail = 'Define a scripted illustration';
                siItem.insertText = new vscode.SnippetString('${1:illustration_name} = {\n\ttexture = "${2:gfx/interface/illustrations/event_scenes/scene.dds}"\n\n\ttrigger = {\n\t\t$0\n\t}\n\n\tpriority = ${3:100}\n}');
                items.push(siItem);
                break;
            case 'map_mode':
                const mmItem = new vscode.CompletionItem('map_mode_name', vscode.CompletionItemKind.Class);
                mmItem.detail = 'Define a map mode';
                mmItem.insertText = new vscode.SnippetString('${1:map_mode_name} = {\n\tname = "${2:map_mode_name}"\n\ttype = ${3|terrain,political,diplomatic,realm,custom|}\n\tpriority = ${4:10}\n\n\tprovince_color = {\n\t\t$0\n\t}\n}');
                items.push(mmItem);
                break;
            case 'province_history':
                const phItem = new vscode.CompletionItem('province_history', vscode.CompletionItemKind.Class);
                phItem.detail = 'Define province history';
                phItem.insertText = new vscode.SnippetString('# Province ${1:1234}\nculture = ${2:culture_name}\nreligion = ${3:religion_name}\nholding = ${4|castle_holding,city_holding,church_holding,tribal_holding,none|}\n$0');
                items.push(phItem);
                break;
            case 'region':
                const regItem = new vscode.CompletionItem('region_name', vscode.CompletionItemKind.Class);
                regItem.detail = 'Define a geographic region';
                regItem.insertText = new vscode.SnippetString('${1:region_name} = {\n\tduchies = {\n\t\t${2:d_duchy_name}\n\t\t$0\n\t}\n}');
                items.push(regItem);
                break;
            case 'scripted_score_value':
                const ssvItem = new vscode.CompletionItem('scripted_score_value_name', vscode.CompletionItemKind.Class);
                ssvItem.detail = 'Define a scripted score value';
                ssvItem.insertText = new vscode.SnippetString('${1:score_name} = {\n\tbase = ${2:100}\n\n\tmodifier = {\n\t\tadd = ${3:50}\n\t\t$0\n\t}\n}');
                items.push(ssvItem);
                break;
            case 'ai_personality':
                const apItem = new vscode.CompletionItem('ai_personality_name', vscode.CompletionItemKind.Class);
                apItem.detail = 'Define an AI personality';
                apItem.insertText = new vscode.SnippetString('${1:personality_name} = {\n\taggression = ${2:1.0}\n\tboldness = ${3:1.0}\n\tcompassion = ${4:1.0}\n\tgreed = ${5:1.0}\n\thonor = ${6:1.0}\n\trationality = ${7:1.0}\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(apItem);
                break;
            case 'defines':
                const defItem = new vscode.CompletionItem('defines_category', vscode.CompletionItemKind.Class);
                defItem.detail = 'Define a game constants category';
                defItem.insertText = new vscode.SnippetString('${1|NGame,NCharacter,NAI,NEconomy,NMilitary,NDiplomacy,NReligion,NCulture,NTitle|} = {\n\t${2:CONSTANT_NAME} = ${3:value}\n\t$0\n}');
                items.push(defItem);
                break;
            case 'scripted_loc_value':
                const slvItem = new vscode.CompletionItem('scripted_loc_value_name', vscode.CompletionItemKind.Class);
                slvItem.detail = 'Define a scripted localization value';
                slvItem.insertText = new vscode.SnippetString('${1:loc_value_name} = {\n\ttype = ${2|character,title,faith,culture,artifact,dynasty,house|}\n\n\ttext = {\n\t\ttrigger = {\n\t\t\t$0\n\t\t}\n\t\tlocalization_key = "${3:loc_key}"\n\t}\n}');
                items.push(slvItem);
                break;
            case 'interaction_category':
                const icItem = new vscode.CompletionItem('interaction_category_name', vscode.CompletionItemKind.Class);
                icItem.detail = 'Define an interaction category';
                icItem.insertText = new vscode.SnippetString('${1:category_name} = {\n\tindex = ${2:10}\n\tname = "${3:interaction_category_name}"\n\ticon = "${4:gfx/interface/icons/interaction_categories/icon.dds}"\n\n\tis_shown = {\n\t\t$0\n\t}\n}');
                items.push(icItem);
                break;
            case 'county_culture':
                const ccItem = new vscode.CompletionItem('county_culture_entry', vscode.CompletionItemKind.Class);
                ccItem.detail = 'Define county culture settings';
                ccItem.insertText = new vscode.SnippetString('culture = ${1:culture_name}\nfaith = ${2:faith_name}\n$0');
                items.push(ccItem);
                break;
            case 'playable_difficulty':
                const pdItem = new vscode.CompletionItem('playable_difficulty_name', vscode.CompletionItemKind.Class);
                pdItem.detail = 'Define a playable difficulty';
                pdItem.insertText = new vscode.SnippetString('${1:difficulty_name} = {\n\tname = "${2:difficulty_name}"\n\torder = ${3:1}\n\tdefault = ${4|no,yes|}\n\n\tplayer_modifier = {\n\t\t$0\n\t}\n\n\tai_modifier = {\n\t\t\n\t}\n}');
                items.push(pdItem);
                break;
            case 'province_setup':
                const psItem = new vscode.CompletionItem('province_setup_entry', vscode.CompletionItemKind.Class);
                psItem.detail = 'Define province setup';
                psItem.insertText = new vscode.SnippetString('province = ${1:1234}\nterrain = ${2:plains}\nculture = ${3:culture_name}\nreligion = ${4:religion_name}\nholding = ${5|castle_holding,city_holding,church_holding,tribal_holding,none|}\n$0');
                items.push(psItem);
                break;
            case 'scripted_spawn':
                const ssItem = new vscode.CompletionItem('scripted_spawn_name', vscode.CompletionItemKind.Class);
                ssItem.detail = 'Define a scripted character spawn';
                ssItem.insertText = new vscode.SnippetString('${1:spawn_name} = {\n\tsave_scope_as = ${2:spawned_character}\n\tgender = ${3|male,female,random|}\n\tage = ${4:25}\n\tculture = ${5:scope:liege.culture}\n\tfaith = ${6:scope:liege.faith}\n\n\tafter_creation = {\n\t\t$0\n\t}\n}');
                items.push(ssItem);
                break;
            case 'court_position_category':
                const cpcItem = new vscode.CompletionItem('court_position_category_name', vscode.CompletionItemKind.Class);
                cpcItem.detail = 'Define a court position category';
                cpcItem.insertText = new vscode.SnippetString('${1:category_name} = {\n\tname = "${2:court_position_category_name}"\n\torder = ${3:10}\n\ticon = "${4:gfx/interface/icons/court_positions/icon.dds}"\n\n\tis_shown = {\n\t\t$0\n\t}\n}');
                items.push(cpcItem);
                break;
            case 'activity_locale':
                const alItem = new vscode.CompletionItem('activity_locale_name', vscode.CompletionItemKind.Class);
                alItem.detail = 'Define an activity locale';
                alItem.insertText = new vscode.SnippetString('${1:locale_name} = {\n\tname = "${2:activity_locale_name}"\n\tbackground = "${3:gfx/interface/illustrations/activity_locales/bg.dds}"\n\n\tis_valid = {\n\t\t$0\n\t}\n\n\tweight = {\n\t\tbase = 100\n\t}\n}');
                items.push(alItem);
                break;
            case 'culture_era':
                const ceItem = new vscode.CompletionItem('culture_era_name', vscode.CompletionItemKind.Class);
                ceItem.detail = 'Define a culture era';
                ceItem.insertText = new vscode.SnippetString('${1:era_name} = {\n\tyear = ${2:1000}\n\torder = ${3:3}\n\n\tinnovations = {\n\t\t${4:innovation_name}\n\t\t$0\n\t}\n\n\tinnovation_cost = ${5:1000}\n}');
                items.push(ceItem);
                break;
            case 'name_list':
                const nlItem = new vscode.CompletionItem('name_list_name', vscode.CompletionItemKind.Class);
                nlItem.detail = 'Define a name list';
                nlItem.insertText = new vscode.SnippetString('${1:name_list} = {\n\tmale_names = {\n\t\t${2:William Henry Richard}\n\t}\n\n\tfemale_names = {\n\t\t${3:Elizabeth Margaret Mary}\n\t}\n\n\tdynasty_names = {\n\t\t$0\n\t}\n}');
                items.push(nlItem);
                break;
            case 'relation_flag':
                const rfItem = new vscode.CompletionItem('relation_flag_name', vscode.CompletionItemKind.Class);
                rfItem.detail = 'Define a relation flag';
                rfItem.insertText = new vscode.SnippetString('${1:relation_name} = {\n\tname = "${2:relation_flag_name}"\n\trelation_type = ${3|positive,negative,neutral,special|}\n\tmutual = ${4|no,yes|}\n\topinion = ${5:0}\n\n\tcan_add = {\n\t\t$0\n\t}\n}');
                items.push(rfItem);
                break;
            case 'terrain_type':
                const ttItem = new vscode.CompletionItem('terrain_type_name', vscode.CompletionItemKind.Class);
                ttItem.detail = 'Define a terrain type';
                ttItem.insertText = new vscode.SnippetString('${1:terrain_name} = {\n\tcolor = { ${2:0.5} ${3:0.5} ${4:0.5} }\n\tmovement_speed = ${5:1.0}\n\tdefender_advantage = ${6:0}\n\tsupply_limit = ${7:5}\n\n\tprovince_modifier = {\n\t\t$0\n\t}\n}');
                items.push(ttItem);
                break;
            case 'holding_type':
                const htItem = new vscode.CompletionItem('holding_type_name', vscode.CompletionItemKind.Class);
                htItem.detail = 'Define a holding type';
                htItem.insertText = new vscode.SnippetString('${1:holding_name} = {\n\tprimary = ${2|no,yes|}\n\tcan_be_created = ${3|yes,no|}\n\n\tbuildings = {\n\t\t${4:building_01}\n\t}\n\n\tprovince_modifier = {\n\t\t$0\n\t}\n}');
                items.push(htItem);
                break;
            case 'men_at_arms_type':
                const maatItem = new vscode.CompletionItem('men_at_arms_type_name', vscode.CompletionItemKind.Class);
                maatItem.detail = 'Define a men-at-arms type';
                maatItem.insertText = new vscode.SnippetString('${1:maa_name} = {\n\ttype = ${2|heavy_infantry,light_infantry,pikemen,archers,light_cavalry,heavy_cavalry,siege,skirmishers|}\n\tdamage = ${3:30}\n\ttoughness = ${4:25}\n\tpursuit = ${5:0}\n\tscreen = ${6:0}\n\n\tbuy_cost = {\n\t\tgold = ${7:100}\n\t}\n\n\tstack = ${8:100}\n\t$0\n}');
                items.push(maatItem);
                break;
            case 'combat_phase':
                const cpItem = new vscode.CompletionItem('combat_phase_name', vscode.CompletionItemKind.Class);
                cpItem.detail = 'Define a combat phase';
                cpItem.insertText = new vscode.SnippetString('${1:phase_name} = {\n\tname = "${2:combat_phase_name}"\n\tduration = ${3:3}\n\tdamage_multiplier = ${4:1.0}\n\torder = ${5:1}\n\tnext_phase = "${6:next_phase}"\n\t$0\n}');
                items.push(cpItem);
                break;
            case 'inspiration_type':
                const itItem = new vscode.CompletionItem('inspiration_type_name', vscode.CompletionItemKind.Class);
                itItem.detail = 'Define an inspiration type';
                itItem.insertText = new vscode.SnippetString('${1:inspiration_name} = {\n\tname = "${2:inspiration_name}"\n\ttype = ${3|weapon,armor,regalia,book,trinket,wall_banner,sculpture|}\n\tgold_cost = ${4:150}\n\tbase_progress = ${5:10}\n\tbase_quality = ${6:50}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(itItem);
                break;
            case 'court_type':
                const ctItem = new vscode.CompletionItem('court_type_name', vscode.CompletionItemKind.Class);
                ctItem.detail = 'Define a court type';
                ctItem.insertText = new vscode.SnippetString('${1:court_name} = {\n\tname = "${2:court_type_name}"\n\n\tis_shown = {\n\t\t${3:always = yes}\n\t}\n\n\tcan_choose = {\n\t\t${4:always = yes}\n\t}\n\n\towner_modifier = {\n\t\t$0\n\t}\n}');
                items.push(ctItem);
                break;
            case 'culture_pillar':
                const cpilItem = new vscode.CompletionItem('culture_pillar_name', vscode.CompletionItemKind.Class);
                cpilItem.detail = 'Define a culture pillar';
                cpilItem.insertText = new vscode.SnippetString('${1:pillar_name} = {\n\tname = "${2:culture_pillar_name}"\n\ttype = ${3|ethos,heritage,language,martial_custom,regional|}\n\n\tcharacter_modifier = {\n\t\t$0\n\t}\n}');
                items.push(cpilItem);
                break;
            case 'heritage':
                const herItem = new vscode.CompletionItem('heritage_name', vscode.CompletionItemKind.Class);
                herItem.detail = 'Define a heritage';
                herItem.insertText = new vscode.SnippetString('${1:heritage_name} = {\n\tname = "${2:heritage_display_name}"\n\tcolor = { ${3:0.5} ${4:0.5} ${5:0.5} }\n\n\tgraphical_cultures = {\n\t\t${6:western_building_gfx}\n\t}\n\n\tcharacter_modifier = {\n\t\t$0\n\t}\n}');
                items.push(herItem);
                break;
            case 'language':
                const langItem = new vscode.CompletionItem('language_name', vscode.CompletionItemKind.Class);
                langItem.detail = 'Define a language';
                langItem.insertText = new vscode.SnippetString('${1:language_name} = {\n\tname = "${2:language_display_name}"\n\tcolor = { ${3:0.5} ${4:0.5} ${5:0.5} }\n\tlanguage_family = ${6:germanic}\n\n\tname_lists = {\n\t\t${7:name_list_english}\n\t}\n\t$0\n}');
                items.push(langItem);
                break;
            case 'martial_custom':
                const mcItem = new vscode.CompletionItem('martial_custom_name', vscode.CompletionItemKind.Class);
                mcItem.detail = 'Define a martial custom';
                mcItem.insertText = new vscode.SnippetString('${1:custom_name} = {\n\tname = "${2:martial_custom_name}"\n\n\tparameters = {\n\t\twomen_can_be_knights = ${3|no,yes|}\n\t\tmen_can_be_knights = ${4|yes,no|}\n\t}\n\n\tcharacter_modifier = {\n\t\t$0\n\t}\n}');
                items.push(mcItem);
                break;
            case 'ethos':
                const ethItem = new vscode.CompletionItem('ethos_name', vscode.CompletionItemKind.Class);
                ethItem.detail = 'Define an ethos';
                ethItem.insertText = new vscode.SnippetString('${1:ethos_name} = {\n\tname = "${2:ethos_display_name}"\n\tcolor = { ${3:0.5} ${4:0.5} ${5:0.5} }\n\n\tcharacter_modifier = {\n\t\t${6:martial = 2}\n\t}\n\n\tparameters = {\n\t\t$0\n\t}\n}');
                items.push(ethItem);
                break;
            case 'scripted_gfx':
                const sgfxItem = new vscode.CompletionItem('scripted_gfx_name', vscode.CompletionItemKind.Class);
                sgfxItem.detail = 'Define a scripted GFX';
                sgfxItem.insertText = new vscode.SnippetString('${1:gfx_name} = {\n\ttexture = "${2:gfx/interface/icons/icon.dds}"\n\tframe = ${3:1}\n\tnoofframes = ${4:1}\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(sgfxItem);
                break;
            case 'game_start':
                const gsItem = new vscode.CompletionItem('game_start_name', vscode.CompletionItemKind.Class);
                gsItem.detail = 'Define a game start';
                gsItem.insertText = new vscode.SnippetString('${1:start_name} = {\n\tname = "${2:game_start_name}"\n\tdate = "${3:867.1.1}"\n\n\tis_playable = {\n\t\t${4:always = yes}\n\t}\n\n\ton_start = {\n\t\t$0\n\t}\n}');
                items.push(gsItem);
                break;
            case 'character_template':
                const ctempItem = new vscode.CompletionItem('character_template_name', vscode.CompletionItemKind.Class);
                ctempItem.detail = 'Define a character template';
                ctempItem.insertText = new vscode.SnippetString('${1:template_name} = {\n\tgender = ${2|male,female,random|}\n\tage = { ${3:20} ${4:40} }\n\trandom_traits = ${5|yes,no|}\n\n\tmartial = { ${6:8} ${7:14} }\n\tprowess = { ${8:8} ${9:14} }\n\t$0\n}');
                items.push(ctempItem);
                break;
            case 'trigger_locale':
                const tlItem = new vscode.CompletionItem('trigger_locale_name', vscode.CompletionItemKind.Class);
                tlItem.detail = 'Define a trigger locale';
                tlItem.insertText = new vscode.SnippetString('${1:locale_name} = {\n\tname = "${2:trigger_locale_name}"\n\ttype = ${3|generic,character,title,province|}\n\n\ttrigger = {\n\t\t$0\n\t}\n\n\ttext = "${4:TRIGGER_TEXT}"\n}');
                items.push(tlItem);
                break;
            case 'effect_locale':
                const elItem = new vscode.CompletionItem('effect_locale_name', vscode.CompletionItemKind.Class);
                elItem.detail = 'Define an effect locale';
                elItem.insertText = new vscode.SnippetString('${1:locale_name} = {\n\tname = "${2:effect_locale_name}"\n\ttype = ${3|generic,character,title,province|}\n\n\teffect = {\n\t\t$0\n\t}\n\n\ttext = "${4:EFFECT_TEXT}"\n}');
                items.push(elItem);
                break;
            case 'music':
                const musItem = new vscode.CompletionItem('music_name', vscode.CompletionItemKind.Class);
                musItem.detail = 'Define a music track';
                musItem.insertText = new vscode.SnippetString('${1:music_name} = {\n\tfile = "${2:music/track.ogg}"\n\tvolume = ${3:0.8}\n\tmusic_type = ${4|ambient,event,combat,menu,cue|}\n\tloop = ${5|yes,no|}\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(musItem);
                break;
            case 'sound_effect':
                const sfxItem = new vscode.CompletionItem('sound_effect_name', vscode.CompletionItemKind.Class);
                sfxItem.detail = 'Define a sound effect';
                sfxItem.insertText = new vscode.SnippetString('${1:sound_name} = {\n\tfile = "${2:sound/sfx/sound.wav}"\n\tvolume = ${3:0.8}\n\tsound_type = ${4|sfx,ui,ambient,voice|}\n\tmax_instances = ${5:3}\n\t$0\n}');
                items.push(sfxItem);
                break;
            case 'portrait_camera':
                const pcamItem = new vscode.CompletionItem('portrait_camera_name', vscode.CompletionItemKind.Class);
                pcamItem.detail = 'Define a portrait camera';
                pcamItem.insertText = new vscode.SnippetString('${1:camera_name} = {\n\tposition = { ${2:0.0} ${3:1.6} ${4:2.0} }\n\tlook_at = { ${5:0.0} ${6:1.5} ${7:0.0} }\n\tfov = ${8:45.0}\n\tcamera_type = ${9|head,body,full,bust,custom|}\n\t$0\n}');
                items.push(pcamItem);
                break;
            case 'gene':
                const geneItem = new vscode.CompletionItem('gene_name', vscode.CompletionItemKind.Class);
                geneItem.detail = 'Define a gene';
                geneItem.insertText = new vscode.SnippetString('${1:gene_name} = {\n\ttype = ${2|color,morph,accessory,special|}\n\tcategory = ${3|face,body,hair,eyes,skin,special|}\n\tinheritance_chance = ${4:0.5}\n\n\tvalues = {\n\t\t$0\n\t}\n}');
                items.push(geneItem);
                break;
            case 'accessory':
                const accItem = new vscode.CompletionItem('accessory_name', vscode.CompletionItemKind.Class);
                accItem.detail = 'Define an accessory';
                accItem.insertText = new vscode.SnippetString('${1:accessory_name} = {\n\ttype = ${2|headgear,clothing,jewelry,weapon,held_item,background|}\n\tentity = "${3:entity_name}"\n\tattach_node = "${4:head_node}"\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(accItem);
                break;
            case 'coa_template':
                const coatItem = new vscode.CompletionItem('coa_template_name', vscode.CompletionItemKind.Class);
                coatItem.detail = 'Define a coat of arms template';
                coatItem.insertText = new vscode.SnippetString('${1:template_name} = {\n\tpattern = "${2:pattern_solid.dds}"\n\tcolor1 = "${3:red}"\n\tcolor2 = "${4:yellow}"\n\n\temblem = {\n\t\ttexture = "${5:eagle_01.dds}"\n\t\tcolor1 = "${6:yellow}"\n\t\tinstance = { position = { 0.5 0.5 } }\n\t}\n\t$0\n}');
                items.push(coatItem);
                break;
            case 'achievement':
                const achItem = new vscode.CompletionItem('achievement_name', vscode.CompletionItemKind.Class);
                achItem.detail = 'Define an achievement';
                achItem.insertText = new vscode.SnippetString('${1:achievement_name} = {\n\tname = "${2:achievement_name}"\n\tdesc = "${3:achievement_desc}"\n\tcategory = ${4|easy,medium,hard,very_hard,insane|}\n\n\tpossible = {\n\t\tis_ironman = yes\n\t}\n\n\thappened = {\n\t\t$0\n\t}\n}');
                items.push(achItem);
                break;
            case 'scripted_test':
                const stestItem = new vscode.CompletionItem('scripted_test_name', vscode.CompletionItemKind.Class);
                stestItem.detail = 'Define a scripted test';
                stestItem.insertText = new vscode.SnippetString('${1:test_name} = {\n\tsetup = {\n\t\t${2:# Setup effects}\n\t}\n\n\ttest = {\n\t\t${3:always = yes}\n\t}\n\n\tcleanup = {\n\t\t$0\n\t}\n}');
                items.push(stestItem);
                break;
            case 'tutorial':
                const tutItem = new vscode.CompletionItem('tutorial_name', vscode.CompletionItemKind.Class);
                tutItem.detail = 'Define a tutorial';
                tutItem.insertText = new vscode.SnippetString('${1:tutorial_name} = {\n\tname = "${2:tutorial_name}"\n\tcategory = ${3|basics,warfare,intrigue,diplomacy,dynasty,religion,culture|}\n\n\tstart_trigger = {\n\t\t${4:is_ai = no}\n\t}\n\n\tstep = {\n\t\tname = "${5:step_1}"\n\t\t$0\n\t}\n}');
                items.push(tutItem);
                break;
            case 'map_object':
                const mobjItem = new vscode.CompletionItem('map_object_name', vscode.CompletionItemKind.Class);
                mobjItem.detail = 'Define a map object';
                mobjItem.insertText = new vscode.SnippetString('${1:object_name} = {\n\tentity = "${2:entity_name}"\n\ttype = ${3|building,decoration,unit,siege,terrain_feature|}\n\tposition = { ${4:0.0} ${5:0.0} ${6:0.0} }\n\tscale = ${7:1.0}\n\t$0\n}');
                items.push(mobjItem);
                break;
            case 'loading_tip':
                const ltipItem = new vscode.CompletionItem('loading_tip_name', vscode.CompletionItemKind.Class);
                ltipItem.detail = 'Define a loading tip';
                ltipItem.insertText = new vscode.SnippetString('${1:tip_name} = {\n\tname = "${2:loading_tip_name}"\n\tcategory = ${3|gameplay,warfare,intrigue,diplomacy,dynasty,religion,culture,economy,hint|}\n\n\tweight = {\n\t\tbase = ${4:10}\n\t}\n\t$0\n}');
                items.push(ltipItem);
                break;
            case 'gui_type':
                const guitItem = new vscode.CompletionItem('gui_type_name', vscode.CompletionItemKind.Class);
                guitItem.detail = 'Define a GUI type';
                guitItem.insertText = new vscode.SnippetString('${1:widget_name} = {\n\ttype = ${2|window,widget,button,icon,text,container|}\n\tposition = { ${3:0} ${4:0} }\n\tsize = { ${5:100} ${6:100} }\n\tparentanchor = ${7:center}\n\n\t$0\n}');
                items.push(guitItem);
                break;
            case 'localization':
                const locItem = new vscode.CompletionItem('localization_entry', vscode.CompletionItemKind.Class);
                locItem.detail = 'Define a localization entry';
                locItem.insertText = new vscode.SnippetString('${1:MY_KEY}:0 "${2:My localized text}"');
                items.push(locItem);
                break;
            case 'regiment':
                const regtItem = new vscode.CompletionItem('regiment', vscode.CompletionItemKind.Class);
                regtItem.detail = 'Define a regiment';
                regtItem.insertText = new vscode.SnippetString('${1:regiment_id} = {\n\ttype = ${2:heavy_infantry}\n\tmen = ${3:100}\n\n\t$0\n}');
                items.push(regtItem);
                break;
            case 'title_color':
                const tcolItem = new vscode.CompletionItem('title_color', vscode.CompletionItemKind.Class);
                tcolItem.detail = 'Define a title color';
                tcolItem.insertText = new vscode.SnippetString('${1:title_key} = {\n\tcolor = { ${2:0.5} ${3:0.5} ${4:0.5} }\n\tcolor2 = { ${5:0.3} ${6:0.3} ${7:0.3} }\n\n\t$0\n}');
                items.push(tcolItem);
                break;
            case 'character_interaction_category':
                const cicatItem = new vscode.CompletionItem('character_interaction_category', vscode.CompletionItemKind.Class);
                cicatItem.detail = 'Define a character interaction category';
                cicatItem.insertText = new vscode.SnippetString('${1:category_name} = {\n\tname = "${2:interaction_category_name}"\n\torder = ${3:10}\n\n\t$0\n}');
                items.push(cicatItem);
                break;
            case 'dlc_feature':
                const dlcfItem = new vscode.CompletionItem('dlc_feature', vscode.CompletionItemKind.Class);
                dlcfItem.detail = 'Define a DLC feature';
                dlcfItem.insertText = new vscode.SnippetString('${1:feature_name} = {\n\tname = "${2:feature_id}"\n\tdlc = "${3:DLC Name}"\n\tenabled = ${4|yes,no|}\n\n\t$0\n}');
                items.push(dlcfItem);
                break;
            case 'ai_budget':
                const aibudItem = new vscode.CompletionItem('ai_budget', vscode.CompletionItemKind.Class);
                aibudItem.detail = 'Define an AI budget';
                aibudItem.insertText = new vscode.SnippetString('${1:budget_name} = {\n\tgold = {\n\t\tbase = ${2:100}\n\t}\n\tpriority = {\n\t\tbase = ${3:50}\n\t}\n\n\t$0\n}');
                items.push(aibudItem);
                break;
            case 'special_building':
                const sbuildItem = new vscode.CompletionItem('special_building', vscode.CompletionItemKind.Class);
                sbuildItem.detail = 'Define a special building';
                sbuildItem.insertText = new vscode.SnippetString('${1:building_name} = {\n\ttype = ${2|wonder,holy_site,duchy_building,special|}\n\tprovince = ${3:496}\n\tgold_cost = ${4:1000}\n\tconstruction_time = ${5:3650}\n\n\t$0\n}');
                items.push(sbuildItem);
                break;
            case 'triggered_text':
                const ttxtItem = new vscode.CompletionItem('triggered_text', vscode.CompletionItemKind.Class);
                ttxtItem.detail = 'Define a triggered text';
                ttxtItem.insertText = new vscode.SnippetString('${1:text_key} = {\n\tfirst_valid = {\n\t\ttriggered_text = {\n\t\t\ttrigger = { ${2:is_male = yes} }\n\t\t\ttext = "${3:male_text}"\n\t\t}\n\t\ttriggered_text = {\n\t\t\ttrigger = { ${4:is_female = yes} }\n\t\t\ttext = "${5:female_text}"\n\t\t}\n\t}\n\n\t$0\n}');
                items.push(ttxtItem);
                break;
            case 'pool_generation_rule':
                const pgrItem = new vscode.CompletionItem('pool_generation_rule', vscode.CompletionItemKind.Class);
                pgrItem.detail = 'Define a pool generation rule';
                pgrItem.insertText = new vscode.SnippetString('${1:rule_name} = {\n\tage = { min = ${2:16} max = ${3:45} }\n\tgender = ${4|any,male,female|}\n\tweight = {\n\t\tbase = ${5:100}\n\t}\n\n\t$0\n}');
                items.push(pgrItem);
                break;
            case 'ai_task':
                const aitItem = new vscode.CompletionItem('ai_task', vscode.CompletionItemKind.Class);
                aitItem.detail = 'Define an AI task';
                aitItem.insertText = new vscode.SnippetString('${1:task_name} = {\n\tpotential = {\n\t\t${2:always = yes}\n\t}\n\tweight = {\n\t\tbase = ${3:100}\n\t}\n\teffect = {\n\t\t$0\n\t}\n}');
                items.push(aitItem);
                break;
            case 'artifact_template':
                const atmpItem = new vscode.CompletionItem('artifact_template', vscode.CompletionItemKind.Class);
                atmpItem.detail = 'Define an artifact template';
                atmpItem.insertText = new vscode.SnippetString('${1:artifact_name} = {\n\trarity = ${2|common,masterwork,famed,illustrious|}\n\tslot = ${3|primary_armament,armor,regalia,helmet,miscellaneous|}\n\tmodifier = {\n\t\t$0\n\t}\n}');
                items.push(atmpItem);
                break;
            case 'coa_pattern':
                const cpattItem = new vscode.CompletionItem('coa_pattern', vscode.CompletionItemKind.Class);
                cpattItem.detail = 'Define a coat of arms pattern';
                cpattItem.insertText = new vscode.SnippetString('${1:pattern_name} = {\n\ttexture = "${2:gfx/coat_of_arms/patterns/pattern.dds}"\n\tcolors = ${3:2}\n\tweight = ${4:100}\n\n\t$0\n}');
                items.push(cpattItem);
                break;
            case 'coa_emblem':
                const cembItem = new vscode.CompletionItem('coa_emblem', vscode.CompletionItemKind.Class);
                cembItem.detail = 'Define a coat of arms emblem';
                cembItem.insertText = new vscode.SnippetString('${1:emblem_name} = {\n\ttexture = "${2:gfx/coat_of_arms/emblems/emblem.dds}"\n\tcolors = ${3:1}\n\tcategory = ${4|animals,plants,symbols,objects,crosses,religious,special|}\n\tweight = ${5:100}\n\n\t$0\n}');
                items.push(cembItem);
                break;
            case 'culture_name_list':
                const cnlItem = new vscode.CompletionItem('culture_name_list', vscode.CompletionItemKind.Class);
                cnlItem.detail = 'Define a culture name list';
                cnlItem.insertText = new vscode.SnippetString('${1:list_name} = {\n\tmale_names = {\n\t\t${2:Erik Ragnar}\n\t}\n\tfemale_names = {\n\t\t${3:Astrid Freya}\n\t}\n\tdynasty_names = {\n\t\t${4:Yngling}\n\t}\n\n\t$0\n}');
                items.push(cnlItem);
                break;
            case 'artifact_visual':
                const avItem = new vscode.CompletionItem('artifact_visual', vscode.CompletionItemKind.Class);
                avItem.detail = 'Define an artifact visual';
                avItem.insertText = new vscode.SnippetString('${1:visual_name} = {\n\ticon = "${2:gfx/interface/icons/artifacts/icon.dds}"\n\tasset = "${3:artifact_mesh}"\n\ttype = ${4|weapon,armor,regalia,trinket,book|}\n\n\t$0\n}');
                items.push(avItem);
                break;
            case 'artifact_rarity':
                const arItem = new vscode.CompletionItem('artifact_rarity', vscode.CompletionItemKind.Class);
                arItem.detail = 'Define an artifact rarity';
                arItem.insertText = new vscode.SnippetString('${1:rarity_name} = {\n\tlevel = ${2:1}\n\tmin_wealth = ${3:10}\n\tmax_wealth = ${4:50}\n\tdurability_mult = ${5:1.0}\n\tmodifier_mult = ${6:1.0}\n\n\t$0\n}');
                items.push(arItem);
                break;
            case 'climate':
                const climItem = new vscode.CompletionItem('climate', vscode.CompletionItemKind.Class);
                climItem.detail = 'Define a climate';
                climItem.insertText = new vscode.SnippetString('${1:climate_name} = {\n\tprovinces = {\n\t\t${2:1 2 3}\n\t}\n\tsupply_limit_mult = ${3:1.0}\n\twinter_severity = ${4|none,mild,normal,harsh,severe|}\n\n\t$0\n}');
                items.push(climItem);
                break;
            case 'terrain_modifier':
                const tmItem = new vscode.CompletionItem('terrain_modifier', vscode.CompletionItemKind.Class);
                tmItem.detail = 'Define a terrain modifier';
                tmItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tattacker = {\n\t\tdamage = ${2:-0.1}\n\t}\n\tdefender = {\n\t\tadvantage = ${3:5}\n\t}\n\tmovement_speed = ${4:-0.2}\n\n\t$0\n}');
                items.push(tmItem);
                break;
            case 'succession_voting':
                const svotItem = new vscode.CompletionItem('succession_voting', vscode.CompletionItemKind.Class);
                svotItem.detail = 'Define a succession voting type';
                svotItem.insertText = new vscode.SnippetString('${1:voting_name} = {\n\telectors = {\n\t\tis_vassal_of = scope:holder\n\t}\n\tcandidates = {\n\t\tis_close_or_extended_family_of = scope:holder\n\t}\n\tcandidate_score = {\n\t\tbase = 100\n\t}\n\n\t$0\n}');
                items.push(svotItem);
                break;
            case 'character_flag':
                const cflagItem = new vscode.CompletionItem('character_flag', vscode.CompletionItemKind.Class);
                cflagItem.detail = 'Define a character flag';
                cflagItem.insertText = new vscode.SnippetString('${1:flag_name} = {\n\tflag = "${2:my_flag}"\n\tdays = ${3:365}\n\tpersist = ${4|yes,no|}\n\n\t$0\n}');
                items.push(cflagItem);
                break;
            case 'title_flag':
                const tflagItem = new vscode.CompletionItem('title_flag', vscode.CompletionItemKind.Class);
                tflagItem.detail = 'Define a title flag';
                tflagItem.insertText = new vscode.SnippetString('${1:flag_name} = {\n\tflag = "${2:my_title_flag}"\n\tdays = ${3:365}\n\tpersist = ${4|yes,no|}\n\n\t$0\n}');
                items.push(tflagItem);
                break;
            case 'province_modifier':
                const pmodItem = new vscode.CompletionItem('province_modifier', vscode.CompletionItemKind.Class);
                pmodItem.detail = 'Define a province modifier';
                pmodItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tgarrison_size = ${2:0.1}\n\tsupply_limit = ${3:0.2}\n\tdevelopment_growth_factor = ${4:0.1}\n\n\t$0\n}');
                items.push(pmodItem);
                break;
            case 'lifestyle_perk_tree':
                const lptItem = new vscode.CompletionItem('lifestyle_perk_tree', vscode.CompletionItemKind.Class);
                lptItem.detail = 'Define a lifestyle perk tree';
                lptItem.insertText = new vscode.SnippetString('${1:tree_name} = {\n\tlifestyle = ${2:diplomacy_lifestyle}\n\ttree_index = ${3:0}\n\tperks = {\n\t\t${4:perk_name}\n\t}\n\n\t$0\n}');
                items.push(lptItem);
                break;
            case 'building_slot':
                const bslotItem = new vscode.CompletionItem('building_slot', vscode.CompletionItemKind.Class);
                bslotItem.detail = 'Define a building slot';
                bslotItem.insertText = new vscode.SnippetString('${1:slot_name} = {\n\tholding_type = ${2|castle_holding,city_holding,church_holding,tribal_holding|}\n\ttype = ${3|regular,special,duchy,unique|}\n\tslot_index = ${4:0}\n\n\t$0\n}');
                items.push(bslotItem);
                break;
            case 'artifact_slot':
                const aslotItem = new vscode.CompletionItem('artifact_slot', vscode.CompletionItemKind.Class);
                aslotItem.detail = 'Define an artifact slot';
                aslotItem.insertText = new vscode.SnippetString('${1:slot_name} = {\n\tslot_type = ${2|primary_armament,armor,regalia,helmet,miscellaneous|}\n\tslot_index = ${3:0}\n\tmax_artifacts = ${4:1}\n\n\t$0\n}');
                items.push(aslotItem);
                break;
            case 'mercenary_company':
                const mercItem = new vscode.CompletionItem('mercenary_company', vscode.CompletionItemKind.Class);
                mercItem.detail = 'Define a mercenary company';
                mercItem.insertText = new vscode.SnippetString('${1:company_name} = {\n\thire_cost = ${2:150}\n\tmaintenance_cost = ${3:1.5}\n\tregiment = {\n\t\ttype = ${4:heavy_infantry}\n\t\tsize = ${5:500}\n\t}\n\n\t$0\n}');
                items.push(mercItem);
                break;
            case 'holy_order':
                const hoItem = new vscode.CompletionItem('holy_order', vscode.CompletionItemKind.Class);
                hoItem.detail = 'Define a holy order';
                hoItem.insertText = new vscode.SnippetString('${1:order_name} = {\n\thire_cost = ${2:300}\n\treligion = ${3:christianity_religion}\n\tregiment = {\n\t\ttype = ${4:heavy_cavalry}\n\t\tsize = ${5:500}\n\t}\n\n\t$0\n}');
                items.push(hoItem);
                break;
            case 'war_contribution':
                const wcItem = new vscode.CompletionItem('war_contribution', vscode.CompletionItemKind.Class);
                wcItem.detail = 'Define a war contribution type';
                wcItem.insertText = new vscode.SnippetString('${1:contribution_name} = {\n\ttype = ${2|battles,sieges,occupation,gold,prestige,piety|}\n\tweight = {\n\t\tbase = ${3:100}\n\t}\n\tscore_per_unit = ${4:1.0}\n\n\t$0\n}');
                items.push(wcItem);
                break;
            case 'army_template':
                const atemplItem = new vscode.CompletionItem('army_template', vscode.CompletionItemKind.Class);
                atemplItem.detail = 'Define an army template';
                atemplItem.insertText = new vscode.SnippetString('${1:template_name} = {\n\tpurpose = ${2|offensive,defensive,raiding,siege,balanced|}\n\tregiument = {\n\t\ttype = ${3:heavy_infantry}\n\t\tsize = ${4:500}\n\t}\n\n\t$0\n}');
                items.push(atemplItem);
                break;
            case 'combat_effect':
                const ceffItem = new vscode.CompletionItem('combat_effect', vscode.CompletionItemKind.Class);
                ceffItem.detail = 'Define a combat effect';
                ceffItem.insertText = new vscode.SnippetString('${1:effect_name} = {\n\tdamage = ${2:0.1}\n\ttoughness = ${3:0.1}\n\tphase = ${4|opening,skirmish,main,pursuit,all|}\n\tadvantage = ${5:5}\n\n\t$0\n}');
                items.push(ceffItem);
                break;
            case 'vassal_obligation':
                const voblItem = new vscode.CompletionItem('vassal_obligation', vscode.CompletionItemKind.Class);
                voblItem.detail = 'Define a vassal obligation';
                voblItem.insertText = new vscode.SnippetString('${1:obligation_name} = {\n\ttype = ${2|tax,levy,special,religious,feudal|}\n\ttax_contribution = ${3:0.25}\n\tlevy_contribution = ${4:0.25}\n\tvassal_opinion = ${5:-10}\n\n\t$0\n}');
                items.push(voblItem);
                break;
            case 'triggered_outfit':
                const toutItem = new vscode.CompletionItem('triggered_outfit', vscode.CompletionItemKind.Class);
                toutItem.detail = 'Define a triggered outfit';
                toutItem.insertText = new vscode.SnippetString('${1:outfit_name} = {\n\toutfit = "${2:outfit_id}"\n\ttrigger = {\n\t\t${3:always = yes}\n\t}\n\tpriority = ${4:10}\n\n\t$0\n}');
                items.push(toutItem);
                break;
            case 'portrait_type':
                const ptypeItem = new vscode.CompletionItem('portrait_type', vscode.CompletionItemKind.Class);
                ptypeItem.detail = 'Define a portrait type';
                ptypeItem.insertText = new vscode.SnippetString('${1:portrait_name} = {\n\tcamera = "${2:camera_bust}"\n\twidth = ${3:200}\n\theight = ${4:300}\n\trender_type = ${5|full,bust,head,icon|}\n\n\t$0\n}');
                items.push(ptypeItem);
                break;
            case 'court_grandeur_level':
                const cglItem = new vscode.CompletionItem('court_grandeur_level', vscode.CompletionItemKind.Class);
                cglItem.detail = 'Define a court grandeur level';
                cglItem.insertText = new vscode.SnippetString('${1:level_name} = {\n\tlevel = ${2:5}\n\tthreshold = ${3:50}\n\towner_modifier = {\n\t\tmonthly_prestige = ${4:2.0}\n\t}\n\tmaintenance_cost = ${5:5.0}\n\n\t$0\n}');
                items.push(cglItem);
                break;
            case 'amenity_level':
                const amenlItem = new vscode.CompletionItem('amenity_level', vscode.CompletionItemKind.Class);
                amenlItem.detail = 'Define an amenity level';
                amenlItem.insertText = new vscode.SnippetString('${1:level_name} = {\n\tlevel = ${2:3}\n\tamenity_type = ${3:food_quality}\n\tcost = ${4:2.0}\n\tgrandeur_baseline = ${5:5}\n\n\t$0\n}');
                items.push(amenlItem);
                break;
            case 'artifact_feature':
                const afeatItem = new vscode.CompletionItem('artifact_feature', vscode.CompletionItemKind.Class);
                afeatItem.detail = 'Define an artifact feature';
                afeatItem.insertText = new vscode.SnippetString('${1:feature_name} = {\n\ttype = ${2|visual,modifier,quality,material,enchantment|}\n\twealth_bonus = ${3:10}\n\tmodifier = {\n\t\t$0\n\t}\n}');
                items.push(afeatItem);
                break;
            case 'execution_method':
                const execItem = new vscode.CompletionItem('execution_method', vscode.CompletionItemKind.Class);
                execItem.detail = 'Define an execution method';
                execItem.insertText = new vscode.SnippetString('${1:method_name} = {\n\ttype = ${2|honorable,cruel,religious,traditional,unique|}\n\tdread_gain = ${3:15}\n\tgeneral_opinion = ${4:-10}\n\n\t$0\n}');
                items.push(execItem);
                break;
            case 'punishment':
                const punishItem = new vscode.CompletionItem('punishment', vscode.CompletionItemKind.Class);
                punishItem.detail = 'Define a punishment';
                punishItem.insertText = new vscode.SnippetString('${1:punishment_name} = {\n\tseverity = ${2|minor,moderate,major,severe,extreme|}\n\ttyranny = ${3:20}\n\tdread = ${4:15}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(punishItem);
                break;
            case 'struggle_catalyst':
                const scatItem = new vscode.CompletionItem('struggle_catalyst', vscode.CompletionItemKind.Class);
                scatItem.detail = 'Define a struggle catalyst';
                scatItem.insertText = new vscode.SnippetString('${1:catalyst_name} = {\n\tstruggle = ${2:iberian_struggle}\n\tprogress_change = ${3:5.0}\n\tcatalyst_direction = ${4|towards_ending,away_from_ending,neutral|}\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(scatItem);
                break;
            case 'travel_danger_type':
                const tdangItem = new vscode.CompletionItem('travel_danger_type', vscode.CompletionItemKind.Class);
                tdangItem.detail = 'Define a travel danger type';
                tdangItem.insertText = new vscode.SnippetString('${1:danger_name} = {\n\tdanger_level = ${2|low,medium,high,extreme|}\n\tdanger_value = ${3:20}\n\n\ton_encounter = {\n\t\t$0\n\t}\n}');
                items.push(tdangItem);
                break;
            case 'travel_option':
                const toptItem = new vscode.CompletionItem('travel_option', vscode.CompletionItemKind.Class);
                toptItem.detail = 'Define a travel option';
                toptItem.insertText = new vscode.SnippetString('${1:option_name} = {\n\tcategory = ${2|speed,safety,comfort,stealth,special|}\n\ttravel_speed = ${3:1.0}\n\tgold_cost = ${4:50}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(toptItem);
                break;
            case 'hostage_type':
                const hostItem = new vscode.CompletionItem('hostage_type', vscode.CompletionItemKind.Class);
                hostItem.detail = 'Define a hostage type';
                hostItem.insertText = new vscode.SnippetString('${1:hostage_name} = {\n\tcategory = ${2|diplomatic,prisoner,ward,tribute|}\n\tduration = ${3:3650}\n\n\thostage_modifier = {\n\t\t$0\n\t}\n}');
                items.push(hostItem);
                break;
            case 'diarchy_mandate':
                const dmandItem = new vscode.CompletionItem('diarchy_mandate', vscode.CompletionItemKind.Class);
                dmandItem.detail = 'Define a diarchy mandate';
                dmandItem.insertText = new vscode.SnippetString('${1:mandate_name} = {\n\tcategory = ${2|military,diplomatic,economic,religious,administrative|}\n\tswing_impact = ${3:5}\n\tswing_direction = ${4|towards_liege,towards_regent,neutral|}\n\n\t$0\n}');
                items.push(dmandItem);
                break;
            case 'levy_definition':
                const levyDefItem = new vscode.CompletionItem('levy_definition', vscode.CompletionItemKind.Class);
                levyDefItem.detail = 'Define a levy definition';
                levyDefItem.insertText = new vscode.SnippetString('${1:levy_name} = {\n\tbase_levy_size = ${2:100}\n\tlevy_mult = ${3:1.0}\n\treinforcement_rate = ${4:0.1}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(levyDefItem);
                break;
            case 'title_rank':
                const trankItem = new vscode.CompletionItem('title_rank', vscode.CompletionItemKind.Class);
                trankItem.detail = 'Define a title rank';
                trankItem.insertText = new vscode.SnippetString('${1:rank_name} = {\n\ttier = ${2:3}\n\ttier_name = ${3:"duke"}\n\tprestige = ${4:1}\n\tvassal_limit = ${5:10}\n\n\t$0\n}');
                items.push(trankItem);
                break;
            case 'ethnic_group':
                const ethgrpItem = new vscode.CompletionItem('ethnic_group', vscode.CompletionItemKind.Class);
                ethgrpItem.detail = 'Define an ethnic group';
                ethgrpItem.insertText = new vscode.SnippetString('${1:ethnicity_name} = {\n\ttemplate = ${2:"european_template"}\n\tskin_color = {\n\t\tmin = ${3:0.3}\n\t\tmax = ${4:0.7}\n\t}\n\n\t$0\n}');
                items.push(ethgrpItem);
                break;
            case 'culture_aesthetic':
                const caesthItem = new vscode.CompletionItem('culture_aesthetic', vscode.CompletionItemKind.Class);
                caesthItem.detail = 'Define a culture aesthetic';
                caesthItem.insertText = new vscode.SnippetString('${1:aesthetic_name} = {\n\tbuilding_gfx = ${2:"western_building_gfx"}\n\tunit_gfx = ${3:"western_unit_gfx"}\n\tclothing_gfx = ${4:"western_clothing_gfx"}\n\n\t$0\n}');
                items.push(caesthItem);
                break;
            case 'coa_color':
                const coacolItem = new vscode.CompletionItem('coa_color', vscode.CompletionItemKind.Class);
                coacolItem.detail = 'Define a coat of arms color';
                coacolItem.insertText = new vscode.SnippetString('${1:color_name} = {\n\tcategory = ${2|metal,colour,fur,special|}\n\tcolor = {\n\t\t${3:0.2} ${4:0.4} ${5:0.8}\n\t}\n\theraldic_name = ${6:"azure"}\n\n\t$0\n}');
                items.push(coacolItem);
                break;
            case 'succession_parameter':
                const succparItem = new vscode.CompletionItem('succession_parameter', vscode.CompletionItemKind.Class);
                succparItem.detail = 'Define a succession parameter';
                succparItem.insertText = new vscode.SnippetString('${1:parameter_name} = {\n\ttype = ${2|gender,order,division,election,special|}\n\tgender_law = ${3|male_only,male_preference,equal,female_preference,female_only|}\n\n\tscore = {\n\t\tbase = ${4:100}\n\t}\n\n\t$0\n}');
                items.push(succparItem);
                break;
            case 'domicile_building':
                const dombldItem = new vscode.CompletionItem('domicile_building', vscode.CompletionItemKind.Class);
                dombldItem.detail = 'Define a domicile building';
                dombldItem.insertText = new vscode.SnippetString('${1:building_name} = {\n\ttype = ${2|housing,storage,production,defense,special|}\n\tbuild_cost = ${3:100}\n\tbuild_time = ${4:30}\n\n\towner_modifier = {\n\t\t$0\n\t}\n}');
                items.push(dombldItem);
                break;
            case 'traveler_type':
                const travtItem = new vscode.CompletionItem('traveler_type', vscode.CompletionItemKind.Class);
                travtItem.detail = 'Define a traveler type';
                travtItem.insertText = new vscode.SnippetString('${1:traveler_name} = {\n\tcategory = ${2|entourage,escort,companion,servant,special|}\n\tsize = ${3:5}\n\tgold_cost = ${4:25}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(travtItem);
                break;
            case 'struggle_phase':
                const strphItem = new vscode.CompletionItem('struggle_phase', vscode.CompletionItemKind.Class);
                strphItem.detail = 'Define a struggle phase';
                strphItem.insertText = new vscode.SnippetString('${1:phase_name} = {\n\ttransition_threshold = ${2:100}\n\tnext_phases = {\n\t\t${3:next_phase}\n\t}\n\n\tinvolved_modifier = {\n\t\t$0\n\t}\n}');
                items.push(strphItem);
                break;
            case 'legend_type':
                const legtItem = new vscode.CompletionItem('legend_type', vscode.CompletionItemKind.Class);
                legtItem.detail = 'Define a legend type';
                legtItem.insertText = new vscode.SnippetString('${1:legend_name} = {\n\tcategory = ${2|martial,diplomatic,intrigue,stewardship,learning,religious|}\n\tbase_spread_rate = ${3:1.0}\n\n\towner_modifier = {\n\t\t$0\n\t}\n}');
                items.push(legtItem);
                break;
            case 'administrative_division':
                const admdivItem = new vscode.CompletionItem('administrative_division', vscode.CompletionItemKind.Class);
                admdivItem.detail = 'Define an administrative division';
                admdivItem.insertText = new vscode.SnippetString('${1:division_name} = {\n\ttier = ${2|province,county,duchy,kingdom,empire|}\n\tmin_counties = ${3:3}\n\tmax_counties = ${4:10}\n\n\tgovernor_modifier = {\n\t\t$0\n\t}\n}');
                items.push(admdivItem);
                break;
            case 'culture_tradition_category':
                const tradcatItem = new vscode.CompletionItem('culture_tradition_category', vscode.CompletionItemKind.Class);
                tradcatItem.detail = 'Define a culture tradition category';
                tradcatItem.insertText = new vscode.SnippetString('${1:category_name} = {\n\tmax_traditions = ${2:3}\n\tsort_order = ${3:10}\n\n\tcolor = {\n\t\t${4:0.8} ${5:0.2} ${6:0.2}\n\t}\n\n\t$0\n}');
                items.push(tradcatItem);
                break;
            case 'imperial_administration':
                const impadmItem = new vscode.CompletionItem('imperial_administration', vscode.CompletionItemKind.Class);
                impadmItem.detail = 'Define an imperial administration';
                impadmItem.insertText = new vscode.SnippetString('${1:admin_name} = {\n\ttier = ${2:2}\n\tgovernor_title = ${3:"strategos"}\n\n\trealm_modifier = {\n\t\t$0\n\t}\n}');
                items.push(impadmItem);
                break;
            case 'court_event':
                const cevtItem = new vscode.CompletionItem('court_event', vscode.CompletionItemKind.Class);
                cevtItem.detail = 'Define a court event';
                cevtItem.insertText = new vscode.SnippetString('${1:event_name} = {\n\ttype = ${2|petition,celebration,crisis,diplomatic,special|}\n\tgrandeur_requirement = ${3:50}\n\n\tcost = {\n\t\tgold = ${4:100}\n\t}\n\n\t$0\n}');
                items.push(cevtItem);
                break;
            case 'culture_parameter':
                const culparItem = new vscode.CompletionItem('culture_parameter', vscode.CompletionItemKind.Class);
                culparItem.detail = 'Define a culture parameter';
                culparItem.insertText = new vscode.SnippetString('${1:parameter_name} = {\n\ttype = ${2|boolean,integer,float,modifier|}\n\tdefault = ${3:yes}\n\tcategory = ${4|general,military,diplomacy,religion,economy|}\n\n\t$0\n}');
                items.push(culparItem);
                break;
            case 'title_naming':
                const tnameItem = new vscode.CompletionItem('title_naming', vscode.CompletionItemKind.Class);
                tnameItem.detail = 'Define a title naming convention';
                tnameItem.insertText = new vscode.SnippetString('${1:naming_name} = {\n\tcounty = ${2:"comitatus"}\n\tduchy = ${3:"ducatus"}\n\tkingdom = ${4:"regnum"}\n\tempire = ${5:"imperium"}\n\n\tcount = ${6:"comes"}\n\tduke = ${7:"dux"}\n\tking = ${8:"rex"}\n\temperor = ${9:"imperator"}\n\n\t$0\n}');
                items.push(tnameItem);
                break;
            case 'siege_type':
                const siegetItem = new vscode.CompletionItem('siege_type', vscode.CompletionItemKind.Class);
                siegetItem.detail = 'Define a siege type';
                siegetItem.insertText = new vscode.SnippetString('${1:siege_name} = {\n\tcategory = ${2|assault,blockade,bombardment,mining,special|}\n\tsiege_progress = ${3:1.0}\n\tattacker_casualties = ${4:0.5}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(siegetItem);
                break;
            case 'commander_trait':
                const cmdtItem = new vscode.CompletionItem('commander_trait', vscode.CompletionItemKind.Class);
                cmdtItem.detail = 'Define a commander trait';
                cmdtItem.insertText = new vscode.SnippetString('${1:trait_name} = {\n\tcategory = ${2|tactical,strategic,leadership,personality,special|}\n\tadvantage = ${3:5}\n\tdamage = ${4:0.15}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(cmdtItem);
                break;
            case 'realm_law_category':
                const rlcItem = new vscode.CompletionItem('realm_law_category', vscode.CompletionItemKind.Class);
                rlcItem.detail = 'Define a realm law category';
                rlcItem.insertText = new vscode.SnippetString('${1:category_name} = {\n\tname = "${2:loc_key}"\n\ticon = "${3:gfx/interface/icons/law_category.dds}"\n\tpriority = ${4:100}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(rlcItem);
                break;
            case 'government_modifier':
                const govmItem = new vscode.CompletionItem('government_modifier', vscode.CompletionItemKind.Class);
                govmItem.detail = 'Define a government modifier';
                govmItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tgovernment = ${2:government_type}\n\tmodifier = {\n\t\t${3:monthly_prestige} = ${4:0.5}\n\t}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(govmItem);
                break;
            case 'artifact_modifier':
                const artmItem = new vscode.CompletionItem('artifact_modifier', vscode.CompletionItemKind.Class);
                artmItem.detail = 'Define an artifact modifier';
                artmItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tslot = ${2|primary_armament,regalia,helmet,armor,accessory|}\n\tcharacter_modifier = {\n\t\t${3:monthly_piety} = ${4:0.5}\n\t}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(artmItem);
                break;
            case 'dynasty_perk':
                const dperkItem = new vscode.CompletionItem('dynasty_perk', vscode.CompletionItemKind.Class);
                dperkItem.detail = 'Define a dynasty perk';
                dperkItem.insertText = new vscode.SnippetString('${1:perk_name} = {\n\tlegacy = ${2:legacy_type}\n\tposition = ${3:1}\n\trenown_cost = ${4:1000}\n\n\tcharacter_modifier = {\n\t\t${5:monthly_prestige} = ${6:0.5}\n\t}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(dperkItem);
                break;
            case 'chronicle_entry':
                const centItem = new vscode.CompletionItem('chronicle_entry', vscode.CompletionItemKind.Class);
                centItem.detail = 'Define a chronicle entry';
                centItem.insertText = new vscode.SnippetString('${1:entry_name} = {\n\ttype = ${2|battle,diplomacy,dynasty,religion,realm,personal|}\n\tquality_contribution = ${3:10}\n\ttext = "${4:loc_key}"\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(centItem);
                break;
            case 'vassal_power':
                const vpowItem = new vscode.CompletionItem('vassal_power', vscode.CompletionItemKind.Class);
                vpowItem.detail = 'Define a vassal power';
                vpowItem.insertText = new vscode.SnippetString('${1:power_name} = {\n\tcategory = ${2|military,economic,legal,religious,administrative|}\n\tpower_level = ${3:3}\n\n\tvassal_modifier = {\n\t\t${4:levy_contribution_mult} = ${5:-0.2}\n\t}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(vpowItem);
                break;
            case 'realm_succession':
                const rsuccItem = new vscode.CompletionItem('realm_succession', vscode.CompletionItemKind.Class);
                rsuccItem.detail = 'Define a realm succession type';
                rsuccItem.insertText = new vscode.SnippetString('${1:succession_name} = {\n\ttype = ${2|partition,single_heir,elective,house,open|}\n\tgender_law = ${3|male_only,male_preference,equal,female_preference,female_only|}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(rsuccItem);
                break;
            case 'government_type_modifier':
                const gtmItem = new vscode.CompletionItem('government_type_modifier', vscode.CompletionItemKind.Class);
                gtmItem.detail = 'Define a government type modifier';
                gtmItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\tgovernment_type = ${2:feudal_government}\n\tcategory = ${3|administration,military,economy,law,succession|}\n\n\tcharacter_modifier = {\n\t\t${4:domain_limit} = ${5:2}\n\t}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(gtmItem);
                break;
            case 'economy_modifier':
                const econmItem = new vscode.CompletionItem('economy_modifier', vscode.CompletionItemKind.Class);
                econmItem.detail = 'Define an economy modifier';
                econmItem.insertText = new vscode.SnippetString('${1:modifier_name} = {\n\ttype = ${2|income,expense,trade,development,tax,production|}\n\tscope = ${3|character,county,duchy,kingdom,empire|}\n\n\tmodifier = {\n\t\t${4:monthly_income_mult} = ${5:0.2}\n\t}\n\n\ttrigger = {\n\t\t$0\n\t}\n}');
                items.push(econmItem);
                break;
            case 'culture_group':
                const cgrpItem = new vscode.CompletionItem('culture_group', vscode.CompletionItemKind.Class);
                cgrpItem.detail = 'Define a culture group';
                cgrpItem.insertText = new vscode.SnippetString('${1:group_name} = {\n\tcolor = { ${2:0.8} ${3:0.4} ${4:0.2} }\n\tgraphical_culture = ${5:western_gfx}\n\n\tmale_names = {\n\t\t${6:Name1 Name2}\n\t}\n\n\tfemale_names = {\n\t\t${7:Name1 Name2}\n\t}\n\n\t$0\n}');
                items.push(cgrpItem);
                break;
            case 'pilgrimage_type':
                const pilgItem = new vscode.CompletionItem('pilgrimage_type', vscode.CompletionItemKind.Class);
                pilgItem.detail = 'Define a pilgrimage type';
                pilgItem.insertText = new vscode.SnippetString('${1:pilgrimage_name} = {\n\treligion = ${2:religion_type}\n\tholy_site = ${3:site_name}\n\tduration = ${4:365}\n\tpiety_gain = ${5:500}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(pilgItem);
                break;
            case 'casus_belli_type':
                const cbtItem = new vscode.CompletionItem('casus_belli_type', vscode.CompletionItemKind.Class);
                cbtItem.detail = 'Define a casus belli type';
                cbtItem.insertText = new vscode.SnippetString('${1:cb_type_name} = {\n\ttype = ${2|conquest,claim,holy_war,independence,subjugation,civil_war,special|}\n\tgroup = ${3:conquest_casus_belli_group}\n\n\tcost = {\n\t\tprestige = ${4:500}\n\t}\n\n\tpotential = {\n\t\t$0\n\t}\n}');
                items.push(cbtItem);
                break;
        }
        return items;
    }
    getCompletionKind(field) {
        switch (field.type) {
            case 'boolean':
                return vscode.CompletionItemKind.Property;
            case 'enum':
                return vscode.CompletionItemKind.Enum;
            case 'block':
            case 'trigger':
            case 'effect':
                return vscode.CompletionItemKind.Struct;
            default:
                return vscode.CompletionItemKind.Property;
        }
    }
    getFieldDetail(field) {
        let detail = `(${field.type})`;
        if (field.required) {
            detail += ' [required]';
        }
        if (field.default !== undefined) {
            detail += ` = ${field.default}`;
        }
        return detail;
    }
    getFieldDoc(field) {
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
    getFieldInsertText(field) {
        switch (field.type) {
            case 'boolean':
                return new vscode.SnippetString(`${field.name} = \${1|yes,no|}`);
            case 'enum':
                if (field.values && field.values.length > 0) {
                    const choices = field.values.slice(0, 20).join(','); // Limit choices
                    return new vscode.SnippetString(`${field.name} = \${1|${choices}|}`);
                }
                return new vscode.SnippetString(`${field.name} = $1`);
            case 'block':
            case 'trigger':
            case 'effect':
            case 'list':
                return new vscode.SnippetString(`${field.name} = {\n\t$0\n}`);
            case 'integer':
                const defaultInt = field.default !== undefined ? String(field.default) : '0';
                return new vscode.SnippetString(`${field.name} = \${1:${defaultInt}}`);
            case 'float':
                const defaultFloat = field.default !== undefined ? String(field.default) : '0.0';
                return new vscode.SnippetString(`${field.name} = \${1:${defaultFloat}}`);
            default:
                return new vscode.SnippetString(`${field.name} = $1`);
        }
    }
    createSimpleCompletion(label, detail) {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);
        item.detail = detail;
        return item;
    }
}
exports.CK3CompletionProvider = CK3CompletionProvider;
//# sourceMappingURL=ck3CompletionProvider.js.map