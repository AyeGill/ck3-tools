import * as vscode from 'vscode';
import { TemplateGenerator } from './lib/templateGenerator';
import { registerAddTraitCommand } from './codeActions/addTrait';
import { registerAddBuildingCommand } from './codeActions/addBuilding';
import { registerAddEventCommand } from './codeActions/addEvent';
import { registerAddDecisionCommand } from './codeActions/addDecision';
import { registerAddSecretCommand } from './codeActions/addSecret';
import { registerAddInteractionCommand } from './codeActions/addInteraction';
import { registerAddActivityCommand } from './codeActions/addActivity';
import { registerAddSchemeCommand } from './codeActions/addScheme';
import { registerGenerateLocalizationCommand } from './localization/generateLocalization';
import { registerGoToLocalizationCommand } from './localization/navigationProvider';
// TraitCompletionProvider and TraitHoverProvider removed - using unified providers instead
import { CK3HoverProvider } from './providers/ck3HoverProvider';
import { CK3CompletionProvider } from './providers/ck3CompletionProvider';
import { CK3DiagnosticsProvider } from './providers/ck3DiagnosticsProvider';
import { CK3WorkspaceIndex } from './providers/workspaceIndex';

let generator: TemplateGenerator;

// Document selector for CK3 trait files
const TRAIT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/traits/**/*.txt' },
  { scheme: 'file', pattern: '**/common/traits/*.txt' },
];

// Document selector for CK3 event files
const EVENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/events/**/*.txt' },
];

// Document selector for CK3 decision files
const DECISION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/decisions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/decisions/*.txt' },
];

// Document selector for CK3 character interaction files
const INTERACTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_interactions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_interactions/*.txt' },
];

// Document selector for CK3 on_action files
const ON_ACTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/on_action/**/*.txt' },
  { scheme: 'file', pattern: '**/common/on_action/*.txt' },
];

// Document selector for CK3 scheme files
const SCHEME_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/schemes/**/*.txt' },
  { scheme: 'file', pattern: '**/common/schemes/*.txt' },
];

// Document selector for CK3 building files
const BUILDING_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/buildings/**/*.txt' },
  { scheme: 'file', pattern: '**/common/buildings/*.txt' },
];

// Document selector for CK3 men-at-arms files
const MEN_AT_ARMS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/men_at_arms_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/men_at_arms_types/*.txt' },
];

// Document selector for CK3 casus belli files
const CASUS_BELLI_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/casus_belli_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/casus_belli_types/*.txt' },
];

// Document selector for CK3 culture files
const CULTURE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/cultures/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/cultures/*.txt' },
];

// Document selector for CK3 tradition files
const TRADITION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/traditions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/traditions/*.txt' },
];

// Document selector for CK3 religion files
const RELIGION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/religion/religions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/religion/religions/*.txt' },
];

// Document selector for CK3 scripted effects files
const SCRIPTED_EFFECTS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_effects/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_effects/*.txt' },
];

// Document selector for CK3 scripted triggers files
const SCRIPTED_TRIGGERS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_triggers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_triggers/*.txt' },
];

// Document selector for CK3 artifact files
const ARTIFACT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifacts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifacts/*.txt' },
];

// Document selector for CK3 court position files
const COURT_POSITION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/court_positions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/court_positions/*.txt' },
];

// Document selector for CK3 lifestyle files
const LIFESTYLE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/lifestyles/**/*.txt' },
  { scheme: 'file', pattern: '**/common/lifestyles/*.txt' },
];

// Document selector for CK3 focus files
const FOCUS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/focuses/**/*.txt' },
  { scheme: 'file', pattern: '**/common/focuses/*.txt' },
];

// Document selector for CK3 perk files
const PERK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/perks/**/*.txt' },
  { scheme: 'file', pattern: '**/common/perks/*.txt' },
];

// Document selector for CK3 dynasty legacy files
const DYNASTY_LEGACY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/dynasty_legacies/**/*.txt' },
  { scheme: 'file', pattern: '**/common/dynasty_legacies/*.txt' },
];

// Document selector for CK3 modifier files
const MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/modifiers/*.txt' },
];

// Document selector for CK3 law files
const LAW_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/laws/**/*.txt' },
  { scheme: 'file', pattern: '**/common/laws/*.txt' },
];

// Document selector for CK3 government files
const GOVERNMENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/governments/**/*.txt' },
  { scheme: 'file', pattern: '**/common/governments/*.txt' },
];

// Document selector for CK3 faction files
const FACTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/factions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/factions/*.txt' },
];

// Document selector for CK3 council task files
const COUNCIL_TASK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/council_tasks/**/*.txt' },
  { scheme: 'file', pattern: '**/common/council_tasks/*.txt' },
];

// Document selector for CK3 opinion modifier files
const OPINION_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/opinion_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/opinion_modifiers/*.txt' },
];

// Document selector for CK3 secret type files
const SECRET_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/secret_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/secret_types/*.txt' },
];

// Document selector for CK3 nickname files
const NICKNAME_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/nicknames/**/*.txt' },
  { scheme: 'file', pattern: '**/common/nicknames/*.txt' },
];

// Document selector for CK3 script value files
const SCRIPT_VALUE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/script_values/**/*.txt' },
  { scheme: 'file', pattern: '**/common/script_values/*.txt' },
];

// Document selector for CK3 hook type files
const HOOK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/hook_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/hook_types/*.txt' },
];

// Document selector for CK3 activity files
const ACTIVITY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/activities/**/*.txt' },
  { scheme: 'file', pattern: '**/common/activities/*.txt' },
];

// Document selector for CK3 game rule files
const GAME_RULE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/game_rules/**/*.txt' },
  { scheme: 'file', pattern: '**/common/game_rules/*.txt' },
];

// Document selector for CK3 bookmark files
const BOOKMARK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/bookmarks/**/*.txt' },
  { scheme: 'file', pattern: '**/common/bookmarks/*.txt' },
];

// Document selector for CK3 story cycle files
const STORY_CYCLE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/story_cycles/**/*.txt' },
  { scheme: 'file', pattern: '**/common/story_cycles/*.txt' },
];

// Document selector for CK3 important action files
const IMPORTANT_ACTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/important_actions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/important_actions/*.txt' },
];

// Document selector for CK3 vassal contract files
const VASSAL_CONTRACT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/vassal_contracts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/vassal_contracts/*.txt' },
];

// Document selector for CK3 landed title files
const LANDED_TITLE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/landed_titles/**/*.txt' },
  { scheme: 'file', pattern: '**/common/landed_titles/*.txt' },
];

// Document selector for CK3 coat of arms files
const COAT_OF_ARMS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/coat_of_arms/**/*.txt' },
  { scheme: 'file', pattern: '**/common/coat_of_arms/*.txt' },
];

// Document selector for CK3 innovation files
const INNOVATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/innovations/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/innovations/*.txt' },
];

// Document selector for CK3 doctrine files
const DOCTRINE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/religion/doctrines/**/*.txt' },
  { scheme: 'file', pattern: '**/common/religion/doctrines/*.txt' },
];

// Document selector for CK3 holy site files
const HOLY_SITE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/religion/holy_sites/**/*.txt' },
  { scheme: 'file', pattern: '**/common/religion/holy_sites/*.txt' },
];

// Document selector for CK3 holding files
const HOLDING_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/holdings/**/*.txt' },
  { scheme: 'file', pattern: '**/common/holdings/*.txt' },
];

// Document selector for CK3 dynasty files
const DYNASTY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/dynasties/**/*.txt' },
  { scheme: 'file', pattern: '**/common/dynasties/*.txt' },
];

// Document selector for CK3 character history files
const CHARACTER_HISTORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/history/characters/**/*.txt' },
  { scheme: 'file', pattern: '**/history/characters/*.txt' },
];

// Document selector for CK3 terrain type files
const TERRAIN_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/terrain_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/terrain_types/*.txt' },
];

// Document selector for CK3 scripted GUI files
const SCRIPTED_GUI_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_guis/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_guis/*.txt' },
];

// Document selector for CK3 customizable localization files
const CUSTOM_LOCALIZATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/customizable_localization/**/*.txt' },
  { scheme: 'file', pattern: '**/common/customizable_localization/*.txt' },
];

// Document selector for CK3 flavorization files
const FLAVORIZATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/flavorization/**/*.txt' },
  { scheme: 'file', pattern: '**/common/flavorization/*.txt' },
];

// Document selector for CK3 death reason files
const DEATHREASONS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/deathreasons/**/*.txt' },
  { scheme: 'file', pattern: '**/common/deathreasons/*.txt' },
];

// Document selector for CK3 succession election files
const SUCCESSION_ELECTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/succession_election/**/*.txt' },
  { scheme: 'file', pattern: '**/common/succession_election/*.txt' },
];

// Document selector for CK3 scripted relation files
const SCRIPTED_RELATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_relations/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_relations/*.txt' },
];

// Document selector for CK3 named colors files
const NAMED_COLORS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/named_colors/**/*.txt' },
  { scheme: 'file', pattern: '**/common/named_colors/*.txt' },
];

// Document selector for CK3 event background files
const EVENT_BACKGROUND_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/event_backgrounds/**/*.txt' },
  { scheme: 'file', pattern: '**/common/event_backgrounds/*.txt' },
];

// Document selector for CK3 pool character selector files
const POOL_SELECTOR_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/pool_character_selectors/**/*.txt' },
  { scheme: 'file', pattern: '**/common/pool_character_selectors/*.txt' },
];

// Document selector for CK3 scripted modifier files
const SCRIPTED_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_modifiers/*.txt' },
];

// Document selector for CK3 scripted rules files
const SCRIPTED_RULES_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_rules/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_rules/*.txt' },
];

// Document selector for CK3 game concept files
const GAME_CONCEPT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/game_concepts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/game_concepts/*.txt' },
];

// Document selector for CK3 message files
const MESSAGE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/messages/**/*.txt' },
  { scheme: 'file', pattern: '**/common/messages/*.txt' },
];

// Document selector for CK3 scripted list files
const SCRIPTED_LIST_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_lists/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_lists/*.txt' },
];

// Document selector for CK3 title history files
const TITLE_HISTORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/history/titles/**/*.txt' },
  { scheme: 'file', pattern: '**/history/titles/*.txt' },
];

// Document selector for CK3 accolade type files
const ACCOLADE_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/accolade_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/accolade_types/*.txt' },
];

// Document selector for CK3 character memory type files
const CHARACTER_MEMORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_memory_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_memory_types/*.txt' },
];

// Document selector for CK3 court amenity files
const COURT_AMENITY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/court_amenities/**/*.txt' },
  { scheme: 'file', pattern: '**/common/court_amenities/*.txt' },
];

// Document selector for CK3 dynasty house files
const DYNASTY_HOUSE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/dynasty_houses/**/*.txt' },
  { scheme: 'file', pattern: '**/common/dynasty_houses/*.txt' },
];

// Document selector for CK3 legend files
const LEGEND_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/legends/**/*.txt' },
  { scheme: 'file', pattern: '**/common/legends/*.txt' },
];

// Document selector for CK3 travel files
const TRAVEL_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/travel/**/*.txt' },
  { scheme: 'file', pattern: '**/common/travel/*.txt' },
];

// Document selector for CK3 struggle files
const STRUGGLE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/struggle/**/*.txt' },
  { scheme: 'file', pattern: '**/common/struggle/*.txt' },
];

// Document selector for CK3 inspiration files
const INSPIRATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/inspirations/**/*.txt' },
  { scheme: 'file', pattern: '**/common/inspirations/*.txt' },
];

// Document selector for CK3 diarchy files
const DIARCHY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/diarchies/**/*.txt' },
  { scheme: 'file', pattern: '**/common/diarchies/*.txt' },
];

// Document selector for CK3 domicile files
const DOMICILE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/domiciles/**/*.txt' },
  { scheme: 'file', pattern: '**/common/domiciles/*.txt' },
];

// Document selector for CK3 great project files
const GREAT_PROJECT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/great_projects/**/*.txt' },
  { scheme: 'file', pattern: '**/common/great_projects/*.txt' },
];

// Document selector for CK3 epidemic files
const EPIDEMIC_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/epidemics/**/*.txt' },
  { scheme: 'file', pattern: '**/common/epidemics/*.txt' },
];

// Document selector for CK3 house unity files
const HOUSE_UNITY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/house_unities/**/*.txt' },
  { scheme: 'file', pattern: '**/common/house_unities/*.txt' },
];

// Document selector for CK3 legitimacy files
const LEGITIMACY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/legitimacy/**/*.txt' },
  { scheme: 'file', pattern: '**/common/legitimacy/*.txt' },
];

// Document selector for CK3 tax slot files
const TAX_SLOT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/tax_slots/**/*.txt' },
  { scheme: 'file', pattern: '**/common/tax_slots/*.txt' },
];

// Document selector for CK3 vassal stance files
const VASSAL_STANCE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/vassal_stances/**/*.txt' },
  { scheme: 'file', pattern: '**/common/vassal_stances/*.txt' },
];

// Document selector for CK3 suggestion files
const SUGGESTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/suggestions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/suggestions/*.txt' },
];

// Document selector for CK3 scripted cost files
const SCRIPTED_COST_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_costs/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_costs/*.txt' },
];

// Document selector for CK3 scripted animation files
const SCRIPTED_ANIMATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_animations/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_animations/*.txt' },
];

// Document selector for CK3 scripted character template files
const SCRIPTED_CHARACTER_TEMPLATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_character_templates/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_character_templates/*.txt' },
];

// Document selector for CK3 event theme files
const EVENT_THEME_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/event_themes/**/*.txt' },
  { scheme: 'file', pattern: '**/common/event_themes/*.txt' },
];

// Document selector for CK3 casus belli group files
const CASUS_BELLI_GROUP_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/casus_belli_groups/**/*.txt' },
  { scheme: 'file', pattern: '**/common/casus_belli_groups/*.txt' },
];

// Document selector for CK3 AI war stance files
const AI_WAR_STANCE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/ai_war_stances/**/*.txt' },
  { scheme: 'file', pattern: '**/common/ai_war_stances/*.txt' },
];

// Document selector for CK3 combat phase event files
const COMBAT_PHASE_EVENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/combat_phase_events/**/*.txt' },
  { scheme: 'file', pattern: '**/common/combat_phase_events/*.txt' },
];

// Document selector for CK3 bookmark portrait files
const BOOKMARK_PORTRAIT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/bookmark_portraits/**/*.txt' },
  { scheme: 'file', pattern: '**/common/bookmark_portraits/*.txt' },
];

// Document selector for CK3 guest system files
const GUEST_SYSTEM_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/guest_system/**/*.txt' },
  { scheme: 'file', pattern: '**/common/guest_system/*.txt' },
];

// Document selector for CK3 courtier guest management files
const COURTIER_GUEST_MANAGEMENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/courtier_guest_management/**/*.txt' },
  { scheme: 'file', pattern: '**/common/courtier_guest_management/*.txt' },
];

// Document selector for CK3 task contract files
const TASK_CONTRACT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/task_contracts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/task_contracts/*.txt' },
];

// Document selector for CK3 subject contract files
const SUBJECT_CONTRACT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/subject_contracts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/subject_contracts/*.txt' },
];

// Document selector for CK3 lease contract files
const LEASE_CONTRACT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/lease_contracts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/lease_contracts/*.txt' },
];

// Document selector for CK3 character background files
const CHARACTER_BACKGROUND_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_backgrounds/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_backgrounds/*.txt' },
];

// Document selector for CK3 DNA data files
const DNA_DATA_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/dna_data/**/*.txt' },
  { scheme: 'file', pattern: '**/common/dna_data/*.txt' },
];

// Document selector for CK3 portrait modifier files
const PORTRAIT_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gfx/portraits/portrait_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/gfx/portraits/portrait_modifiers/*.txt' },
];

// Document selector for CK3 nickname rule files
const NICKNAME_RULE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/nickname_rules/**/*.txt' },
  { scheme: 'file', pattern: '**/common/nickname_rules/*.txt' },
];

// Document selector for CK3 succession law files
const SUCCESSION_LAW_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/succession_laws/**/*.txt' },
  { scheme: 'file', pattern: '**/common/succession_laws/*.txt' },
];

// Document selector for CK3 war goal files
const WAR_GOAL_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/war_goals/**/*.txt' },
  { scheme: 'file', pattern: '**/common/war_goals/*.txt' },
];

// Document selector for CK3 scripted illustration files
const SCRIPTED_ILLUSTRATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gfx/portraits/scripted_illustrations/**/*.txt' },
  { scheme: 'file', pattern: '**/gfx/portraits/scripted_illustrations/*.txt' },
];

// Document selector for CK3 map mode files
const MAP_MODE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/map_modes/**/*.txt' },
  { scheme: 'file', pattern: '**/common/map_modes/*.txt' },
];

// Document selector for CK3 province history files
const PROVINCE_HISTORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/history/provinces/**/*.txt' },
  { scheme: 'file', pattern: '**/history/provinces/*.txt' },
];

// Document selector for CK3 region files
const REGION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/map_data/regions/**/*.txt' },
  { scheme: 'file', pattern: '**/map_data/regions/*.txt' },
];

// Document selector for CK3 scripted score value files
const SCRIPTED_SCORE_VALUE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_score_values/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_score_values/*.txt' },
];

// Document selector for CK3 AI personality files
const AI_PERSONALITY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/ai_personalities/**/*.txt' },
  { scheme: 'file', pattern: '**/common/ai_personalities/*.txt' },
];

// Document selector for CK3 defines files
const DEFINES_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/defines/**/*.txt' },
  { scheme: 'file', pattern: '**/common/defines/*.txt' },
];

// Document selector for CK3 scripted loc value files
const SCRIPTED_LOC_VALUE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_loc_values/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_loc_values/*.txt' },
];

// Document selector for CK3 interaction category files
const INTERACTION_CATEGORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_interaction_categories/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_interaction_categories/*.txt' },
];

// Document selector for CK3 county culture files
const COUNTY_CULTURE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/county_culture/**/*.txt' },
  { scheme: 'file', pattern: '**/common/county_culture/*.txt' },
];

// Document selector for CK3 playable difficulty files
const PLAYABLE_DIFFICULTY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/playable_difficulties/**/*.txt' },
  { scheme: 'file', pattern: '**/common/playable_difficulties/*.txt' },
];

// Document selector for CK3 province setup files
const PROVINCE_SETUP_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/province_setup/**/*.txt' },
  { scheme: 'file', pattern: '**/common/province_setup/*.txt' },
];

// Document selector for CK3 scripted spawn files
const SCRIPTED_SPAWN_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/scripted_spawns/**/*.txt' },
  { scheme: 'file', pattern: '**/common/scripted_spawns/*.txt' },
];

// Document selector for CK3 court position category files
const COURT_POSITION_CATEGORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/court_position_categories/**/*.txt' },
  { scheme: 'file', pattern: '**/common/court_position_categories/*.txt' },
];

// Document selector for CK3 activity locale files
const ACTIVITY_LOCALE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/activity_locales/**/*.txt' },
  { scheme: 'file', pattern: '**/common/activity_locales/*.txt' },
];

// Document selector for CK3 culture era files
const CULTURE_ERA_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/eras/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/eras/*.txt' },
];

// Document selector for CK3 name list files
const NAME_LIST_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/name_lists/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/name_lists/*.txt' },
];

// Document selector for CK3 relation flag files
const RELATION_FLAG_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/relation_flags/**/*.txt' },
  { scheme: 'file', pattern: '**/common/relation_flags/*.txt' },
];

// Document selector for CK3 terrain type files
const TERRAIN_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/terrain_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/terrain_types/*.txt' },
];

// Document selector for CK3 holding type files
const HOLDING_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/holding_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/holding_types/*.txt' },
];

// Document selector for CK3 men-at-arms type definition files
const MEN_AT_ARMS_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/men_at_arms_types/definitions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/men_at_arms_types/definitions/*.txt' },
];

// Document selector for CK3 combat phase files
const COMBAT_PHASE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/combat_phase_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/combat_phase_types/*.txt' },
];

// Document selector for CK3 inspiration type files
const INSPIRATION_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/inspiration_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/inspiration_types/*.txt' },
];

// Document selector for CK3 court type files
const COURT_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/court_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/court_types/*.txt' },
];

// Document selector for CK3 culture pillar files
const CULTURE_PILLAR_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/pillars/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/pillars/*.txt' },
];

// Document selector for CK3 heritage files
const HERITAGE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/heritage/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/heritage/*.txt' },
];

// Document selector for CK3 language files
const LANGUAGE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/languages/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/languages/*.txt' },
];

// Document selector for CK3 martial custom files
const MARTIAL_CUSTOM_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/martial_customs/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/martial_customs/*.txt' },
];

// Document selector for CK3 ethos files
const ETHOS_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/ethos/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/ethos/*.txt' },
];

// Document selector for CK3 scripted GFX files
const SCRIPTED_GFX_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gfx/scripted/**/*.txt' },
  { scheme: 'file', pattern: '**/gfx/scripted/*.txt' },
];

// Document selector for CK3 game start files
const GAME_START_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/game_starts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/game_starts/*.txt' },
];

// Document selector for CK3 character template files
const CHARACTER_TEMPLATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_templates/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_templates/*.txt' },
];

// Document selector for CK3 trigger localization files
const TRIGGER_LOCALE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/trigger_localization/**/*.txt' },
  { scheme: 'file', pattern: '**/common/trigger_localization/*.txt' },
];

// Document selector for CK3 effect localization files
const EFFECT_LOCALE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/effect_localization/**/*.txt' },
  { scheme: 'file', pattern: '**/common/effect_localization/*.txt' },
];

// Document selector for CK3 music files
const MUSIC_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/music/**/*.txt' },
  { scheme: 'file', pattern: '**/music/*.txt' },
];

// Document selector for CK3 sound effect files
const SOUND_EFFECT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/sound/**/*.txt' },
  { scheme: 'file', pattern: '**/sound/*.txt' },
];

// Document selector for CK3 portrait camera files
const PORTRAIT_CAMERA_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gfx/portraits/cameras/**/*.txt' },
  { scheme: 'file', pattern: '**/gfx/portraits/cameras/*.txt' },
];

// Document selector for CK3 gene files
const GENE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gfx/portraits/genes/**/*.txt' },
  { scheme: 'file', pattern: '**/gfx/portraits/genes/*.txt' },
];

// Document selector for CK3 accessory files
const ACCESSORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gfx/portraits/accessories/**/*.txt' },
  { scheme: 'file', pattern: '**/gfx/portraits/accessories/*.txt' },
];

// Document selector for CK3 coat of arms template files
const COA_TEMPLATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/coat_of_arms/templates/**/*.txt' },
  { scheme: 'file', pattern: '**/common/coat_of_arms/templates/*.txt' },
];

// Document selector for CK3 achievement files
const ACHIEVEMENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/achievements/**/*.txt' },
  { scheme: 'file', pattern: '**/common/achievements/*.txt' },
];

// Document selector for CK3 scripted test files
const SCRIPTED_TEST_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/tests/**/*.txt' },
  { scheme: 'file', pattern: '**/tests/*.txt' },
];

// Document selector for CK3 tutorial files
const TUTORIAL_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/tutorials/**/*.txt' },
  { scheme: 'file', pattern: '**/common/tutorials/*.txt' },
];

// Document selector for CK3 map object files
const MAP_OBJECT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/map_data/**/*.txt' },
  { scheme: 'file', pattern: '**/map_data/*.txt' },
];

// Document selector for CK3 loading tip files
const LOADING_TIP_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/loading_tips/**/*.txt' },
  { scheme: 'file', pattern: '**/common/loading_tips/*.txt' },
];

// Document selector for CK3 GUI files
const GUI_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/gui/**/*.gui' },
  { scheme: 'file', pattern: '**/gui/*.gui' },
];

// Document selector for CK3 localization files
const LOCALIZATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/localization/**/*.yml' },
  { scheme: 'file', pattern: '**/localization/*.yml' },
];

// Document selector for CK3 regiment files
const REGIMENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/regiments/**/*.txt' },
  { scheme: 'file', pattern: '**/common/regiments/*.txt' },
];

// Document selector for CK3 title color files
const TITLE_COLOR_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/title_colors/**/*.txt' },
  { scheme: 'file', pattern: '**/common/title_colors/*.txt' },
];

// Document selector for CK3 character interaction category files
const CHARACTER_INTERACTION_CATEGORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_interaction_categories/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_interaction_categories/*.txt' },
];

// Document selector for CK3 DLC feature files
const DLC_FEATURE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/dlc_features/**/*.txt' },
  { scheme: 'file', pattern: '**/dlc/**/*.txt' },
];

// Document selector for CK3 AI budget files
const AI_BUDGET_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/ai_budgets/**/*.txt' },
  { scheme: 'file', pattern: '**/common/ai_budgets/*.txt' },
];

// Document selector for CK3 special building files
const SPECIAL_BUILDING_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/special_buildings/**/*.txt' },
  { scheme: 'file', pattern: '**/common/special_buildings/*.txt' },
];

// Document selector for CK3 triggered text files
const TRIGGERED_TEXT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/triggered_text/**/*.txt' },
  { scheme: 'file', pattern: '**/common/triggered_text/*.txt' },
];

// Document selector for CK3 pool generation rule files
const POOL_GENERATION_RULE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/pool_generation_rules/**/*.txt' },
  { scheme: 'file', pattern: '**/common/pool_generation_rules/*.txt' },
];

// Document selector for CK3 AI task files
const AI_TASK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/ai_tasks/**/*.txt' },
  { scheme: 'file', pattern: '**/common/ai_tasks/*.txt' },
];

// Document selector for CK3 artifact template files
const ARTIFACT_TEMPLATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifact_templates/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifact_templates/*.txt' },
];

// Document selector for CK3 coat of arms pattern files
const COA_PATTERN_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/coat_of_arms/patterns/**/*.txt' },
  { scheme: 'file', pattern: '**/coat_of_arms/patterns/*.txt' },
];

// Document selector for CK3 coat of arms emblem files
const COA_EMBLEM_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/coat_of_arms/emblems/**/*.txt' },
  { scheme: 'file', pattern: '**/coat_of_arms/emblems/*.txt' },
];

// Document selector for CK3 culture name list files
const CULTURE_NAME_LIST_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture_name_lists/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture_name_lists/*.txt' },
];

// Document selector for CK3 artifact visual files
const ARTIFACT_VISUAL_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifact_visuals/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifact_visuals/*.txt' },
];

// Document selector for CK3 artifact rarity files
const ARTIFACT_RARITY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifact_rarities/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifact_rarities/*.txt' },
];

// Document selector for CK3 climate files
const CLIMATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/climate/**/*.txt' },
  { scheme: 'file', pattern: '**/map/climate/**/*.txt' },
];

// Document selector for CK3 terrain modifier files
const TERRAIN_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/terrain_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/terrain_modifiers/*.txt' },
];

// Document selector for CK3 succession voting files
const SUCCESSION_VOTING_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/succession_voting/**/*.txt' },
  { scheme: 'file', pattern: '**/common/succession_voting/*.txt' },
];

// Document selector for CK3 character flag files
const CHARACTER_FLAG_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/character_flags/**/*.txt' },
  { scheme: 'file', pattern: '**/common/character_flags/*.txt' },
];

// Document selector for CK3 title flag files
const TITLE_FLAG_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/title_flags/**/*.txt' },
  { scheme: 'file', pattern: '**/common/title_flags/*.txt' },
];

// Document selector for CK3 province modifier files
const PROVINCE_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/province_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/province_modifiers/*.txt' },
];

// Document selector for CK3 lifestyle perk tree files
const LIFESTYLE_PERK_TREE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/lifestyle_perk_trees/**/*.txt' },
  { scheme: 'file', pattern: '**/common/lifestyle_perk_trees/*.txt' },
];

// Document selector for CK3 building slot files
const BUILDING_SLOT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/building_slots/**/*.txt' },
  { scheme: 'file', pattern: '**/common/building_slots/*.txt' },
];

// Document selector for CK3 artifact slot files
const ARTIFACT_SLOT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifact_slots/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifact_slots/*.txt' },
];

// Document selector for CK3 mercenary company files
const MERCENARY_COMPANY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/mercenary_companies/**/*.txt' },
  { scheme: 'file', pattern: '**/common/mercenary_companies/*.txt' },
];

// Document selector for CK3 holy order files
const HOLY_ORDER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/holy_orders/**/*.txt' },
  { scheme: 'file', pattern: '**/common/holy_orders/*.txt' },
];

// Document selector for CK3 war contribution files
const WAR_CONTRIBUTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/war_contributions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/war_contributions/*.txt' },
];

// Document selector for CK3 army template files
const ARMY_TEMPLATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/army_templates/**/*.txt' },
  { scheme: 'file', pattern: '**/common/army_templates/*.txt' },
];

// Document selector for CK3 combat effect files
const COMBAT_EFFECT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/combat_effects/**/*.txt' },
  { scheme: 'file', pattern: '**/common/combat_effects/*.txt' },
];

// Document selector for CK3 vassal obligation files
const VASSAL_OBLIGATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/vassal_obligations/**/*.txt' },
  { scheme: 'file', pattern: '**/common/vassal_obligations/*.txt' },
];

// Document selector for CK3 triggered outfit files
const TRIGGERED_OUTFIT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/triggered_outfits/**/*.txt' },
  { scheme: 'file', pattern: '**/common/triggered_outfits/*.txt' },
];

// Document selector for CK3 portrait type files
const PORTRAIT_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/portrait_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/portrait_types/*.txt' },
];

// Document selector for CK3 court grandeur level files
const COURT_GRANDEUR_LEVEL_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/court_grandeur_levels/**/*.txt' },
  { scheme: 'file', pattern: '**/common/court_grandeur_levels/*.txt' },
];

// Document selector for CK3 amenity level files
const AMENITY_LEVEL_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/amenity_levels/**/*.txt' },
  { scheme: 'file', pattern: '**/common/amenity_levels/*.txt' },
];

// Document selector for CK3 artifact feature files
const ARTIFACT_FEATURE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifact_features/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifact_features/*.txt' },
];

// Document selector for CK3 execution method files
const EXECUTION_METHOD_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/execution_methods/**/*.txt' },
  { scheme: 'file', pattern: '**/common/execution_methods/*.txt' },
];

// Document selector for CK3 punishment files
const PUNISHMENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/punishments/**/*.txt' },
  { scheme: 'file', pattern: '**/common/punishments/*.txt' },
];

// Document selector for CK3 struggle catalyst files
const STRUGGLE_CATALYST_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/struggle_catalysts/**/*.txt' },
  { scheme: 'file', pattern: '**/common/struggle_catalysts/*.txt' },
];

// Document selector for CK3 travel danger type files
const TRAVEL_DANGER_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/travel_danger_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/travel_danger_types/*.txt' },
];

// Document selector for CK3 travel option files
const TRAVEL_OPTION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/travel_options/**/*.txt' },
  { scheme: 'file', pattern: '**/common/travel_options/*.txt' },
];

// Document selector for CK3 hostage type files
const HOSTAGE_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/hostage_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/hostage_types/*.txt' },
];

// Document selector for CK3 diarchy mandate files
const DIARCHY_MANDATE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/diarchy_mandates/**/*.txt' },
  { scheme: 'file', pattern: '**/common/diarchy_mandates/*.txt' },
];

// Document selector for CK3 levy definition files
const LEVY_DEFINITION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/levy_definitions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/levy_definitions/*.txt' },
];

// Document selector for CK3 title rank files
const TITLE_RANK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/title_ranks/**/*.txt' },
  { scheme: 'file', pattern: '**/common/title_ranks/*.txt' },
];

// Document selector for CK3 ethnic group files
const ETHNIC_GROUP_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/ethnic_groups/**/*.txt' },
  { scheme: 'file', pattern: '**/common/ethnic_groups/*.txt' },
];

// Document selector for CK3 culture aesthetic files
const CULTURE_AESTHETIC_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture_aesthetics/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture_aesthetics/*.txt' },
];

// Document selector for CK3 CoA color files
const COA_COLOR_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/coat_of_arms/colors/**/*.txt' },
  { scheme: 'file', pattern: '**/common/coat_of_arms/colors/*.txt' },
];

// Document selector for CK3 succession parameter files
const SUCCESSION_PARAMETER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/succession_parameters/**/*.txt' },
  { scheme: 'file', pattern: '**/common/succession_parameters/*.txt' },
];

// Document selector for CK3 domicile building files
const DOMICILE_BUILDING_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/domicile_buildings/**/*.txt' },
  { scheme: 'file', pattern: '**/common/domicile_buildings/*.txt' },
];

// Document selector for CK3 traveler type files
const TRAVELER_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/traveler_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/traveler_types/*.txt' },
];

// Document selector for CK3 struggle phase files
const STRUGGLE_PHASE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/struggle_phases/**/*.txt' },
  { scheme: 'file', pattern: '**/common/struggle_phases/*.txt' },
];

// Document selector for CK3 legend type files
const LEGEND_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/legend_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/legend_types/*.txt' },
];

// Document selector for CK3 administrative division files
const ADMINISTRATIVE_DIVISION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/administrative_divisions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/administrative_divisions/*.txt' },
];

// Document selector for CK3 culture tradition category files
const CULTURE_TRADITION_CATEGORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/tradition_categories/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/tradition_categories/*.txt' },
];

// Document selector for CK3 imperial administration files
const IMPERIAL_ADMINISTRATION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/imperial_administrations/**/*.txt' },
  { scheme: 'file', pattern: '**/common/imperial_administrations/*.txt' },
];

// Document selector for CK3 court event files
const COURT_EVENT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/court_events/**/*.txt' },
  { scheme: 'file', pattern: '**/common/court_events/*.txt' },
];

// Document selector for CK3 culture parameter files
const CULTURE_PARAMETER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture/parameters/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture/parameters/*.txt' },
];

// Document selector for CK3 title naming files
const TITLE_NAMING_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/title_naming/**/*.txt' },
  { scheme: 'file', pattern: '**/common/title_naming/*.txt' },
];

// Document selector for CK3 siege type files
const SIEGE_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/siege_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/siege_types/*.txt' },
];

// Document selector for CK3 commander trait files
const COMMANDER_TRAIT_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/commander_traits/**/*.txt' },
  { scheme: 'file', pattern: '**/common/commander_traits/*.txt' },
];

// Document selector for CK3 realm law category files
const REALM_LAW_CATEGORY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/realm_law_categories/**/*.txt' },
  { scheme: 'file', pattern: '**/common/realm_law_categories/*.txt' },
];

// Document selector for CK3 government modifier files
const GOVERNMENT_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/government_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/government_modifiers/*.txt' },
];

// Document selector for CK3 artifact modifier files
const ARTIFACT_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/artifact_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/artifact_modifiers/*.txt' },
];

// Document selector for CK3 dynasty perk files
const DYNASTY_PERK_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/dynasty_perks/**/*.txt' },
  { scheme: 'file', pattern: '**/common/dynasty_perks/*.txt' },
];

// Document selector for CK3 chronicle entry files
const CHRONICLE_ENTRY_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/chronicle_entries/**/*.txt' },
  { scheme: 'file', pattern: '**/common/chronicle_entries/*.txt' },
];

// Document selector for CK3 vassal power files
const VASSAL_POWER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/vassal_powers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/vassal_powers/*.txt' },
];

// Document selector for CK3 realm succession files
const REALM_SUCCESSION_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/realm_successions/**/*.txt' },
  { scheme: 'file', pattern: '**/common/realm_successions/*.txt' },
];

// Document selector for CK3 government type modifier files
const GOVERNMENT_TYPE_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/government_type_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/government_type_modifiers/*.txt' },
];

// Document selector for CK3 economy modifier files
const ECONOMY_MODIFIER_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/economy_modifiers/**/*.txt' },
  { scheme: 'file', pattern: '**/common/economy_modifiers/*.txt' },
];

// Document selector for CK3 culture group files
const CULTURE_GROUP_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/culture_groups/**/*.txt' },
  { scheme: 'file', pattern: '**/common/culture_groups/*.txt' },
];

// Document selector for CK3 pilgrimage type files
const PILGRIMAGE_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/pilgrimage_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/pilgrimage_types/*.txt' },
];

// Document selector for CK3 casus belli type files
const CASUS_BELLI_TYPE_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/casus_belli_types/**/*.txt' },
  { scheme: 'file', pattern: '**/common/casus_belli_types/*.txt' },
];

// Broader selector for all CK3 script files
const CK3_FILE_SELECTOR: vscode.DocumentSelector = [
  { scheme: 'file', pattern: '**/common/**/*.txt' },
  { scheme: 'file', pattern: '**/events/**/*.txt' },
];

export function activate(context: vscode.ExtensionContext) {
  console.log('CK3 Modding Tools extension is now active');

  // Initialize template generator
  generator = new TemplateGenerator(context.extensionPath);

  // Register commands
  registerAddTraitCommand(context, generator);
  registerAddBuildingCommand(context, generator);
  registerAddEventCommand(context, generator);
  registerAddDecisionCommand(context, generator);
  registerAddSecretCommand(context, generator);
  registerAddInteractionCommand(context, generator);
  registerAddActivityCommand(context, generator);
  registerAddSchemeCommand(context, generator);
  registerGenerateLocalizationCommand(context, generator);
  registerGoToLocalizationCommand(context);

  // Register unified completion and hover providers for all entity types
  const ck3CompletionProvider = new CK3CompletionProvider();
  const ck3HoverProvider = new CK3HoverProvider();

  // Register hover provider for ALL CK3 files (using language ID)
  // This ensures effects/triggers get hover docs even in file types without specific schemas
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      { language: 'ck3' },
      ck3HoverProvider
    )
  );

  // Register completion provider for all CK3 files
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      CK3_FILE_SELECTOR,
      ck3CompletionProvider,
      '=', ' '
    )
  );

  console.log('Registered completion providers for all CK3 entity types');

  // Create workspace index for cross-file validation
  const workspaceIndex = new CK3WorkspaceIndex();

  // Index workspace files in background
  workspaceIndex.indexWorkspace().then(() => {
    console.log(`CK3 workspace index ready: ${workspaceIndex.getTotalCount()} workspace entities indexed`);
  });

  // Index game files if path is configured
  const gamePath = vscode.workspace.getConfiguration('ck3-tools').get<string>('gamePath');
  if (gamePath) {
    workspaceIndex.indexGameFiles(gamePath).then(() => {
      console.log(`CK3 game files indexed: ${workspaceIndex.getTotalCount()} total entities`);
    });
  }

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('ck3-tools.gamePath')) {
        const newGamePath = vscode.workspace.getConfiguration('ck3-tools').get<string>('gamePath');
        if (newGamePath) {
          workspaceIndex.indexGameFiles(newGamePath).then(() => {
            console.log(`CK3 game files re-indexed: ${workspaceIndex.getTotalCount()} total entities`);
            // Re-validate open documents
            vscode.workspace.textDocuments.forEach(doc => {
              if (doc.languageId === 'ck3') {
                diagnosticsProvider.validateDocument(doc);
              }
            });
          });
        }
      }
    })
  );

  // Register diagnostics provider for linting
  const diagnosticsProvider = new CK3DiagnosticsProvider(workspaceIndex);
  context.subscriptions.push(diagnosticsProvider.getDiagnosticCollection());

  // Validate all currently open documents
  vscode.workspace.textDocuments.forEach(doc => {
    if (doc.languageId === 'ck3') {
      diagnosticsProvider.validateDocument(doc);
    }
  });

  // Register document change listeners
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(doc => {
      if (doc.languageId === 'ck3') {
        diagnosticsProvider.validateDocument(doc);
      }
    }),
    vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.languageId === 'ck3') {
        diagnosticsProvider.validateDocumentDebounced(e.document);
      }
    }),
    vscode.workspace.onDidCloseTextDocument(doc => {
      diagnosticsProvider.clearDiagnostics(doc.uri);
    })
  );

  // Update workspace index when files are saved
  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(doc => {
      if (doc.languageId === 'ck3') {
        workspaceIndex.indexFile(doc.uri);
      }
    }),
    vscode.workspace.onDidDeleteFiles(e => {
      for (const uri of e.files) {
        workspaceIndex.removeFile(uri.toString());
      }
    }),
    vscode.workspace.onDidCreateFiles(e => {
      for (const uri of e.files) {
        if (uri.fsPath.endsWith('.txt')) {
          workspaceIndex.indexFile(uri);
        }
      }
    })
  );

  console.log('Registered diagnostics provider for CK3 files');
  vscode.window.showInformationMessage('CK3 Modding Tools loaded!');
}

export function deactivate() {
  console.log('CK3 Modding Tools extension is now deactivated');
}
