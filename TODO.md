# CK3 Tools TODO

## Project Overview

Building practical tooling for CK3 modding to reduce boilerplate, catch errors early, and streamline workflows.

**Approach**: Enhanced tooling for existing CK3 format (not a new language)
**Tech Stack**: TypeScript/Node for portability and VS Code integration

---

## Project Goals

- Documentation of how everything works in ck3 scripting files. I don't want the best way of figuring out how to do something to be opening up the game files to figure it out.
- A vscode extension for Crusader Kings 3 mods. It should be possible to use code actions and symbolic autocomplete to work on these things. I want to right-click, go "add a trait" or "add an event" or whatever and have it filled out for me. This should exist for every single type of entity in the game, both buildings, faiths, events, interactions, traits, etc, etc.
  - There should similarly be some context-aware system for modifying these things. When I'm programming in a language with a good IDE, autocomplete will tell me what are the possible methods or fields given the type of the variable I've typed, what is the type of the variable under the cursor, etc. Something similar should be possible for CK3
  - Some sort of system that lets me easily move to the relevant localization for some item - or even better, just displays it as a hint on mouseover or whatever so I don't have to go there.
- Some sort of linter that can run a simple precheck on mods, so we don't have to open up the game constantly.

## Intermediate goals

### ✅ COMPLETED: Get the extension working well for traits
- [x] Make the documentation of the scripting langauge thorough enough that *every* aspect of creating a trait can be found in there. That obviously means expanding the documentation in some general areas as well (for example, as far as I can tell the system used to make the description of a trait conditional on context is the same used to make other descriptions conditional---there's no need to document this twice)
  - Documentation in `ck3-docs/data-types/traits.md` covers all trait properties (557 lines, comprehensive)

- [x] Implement these aspects into the vscode extension. I should be able to somehow view all the possible fields in a trait, then when I'm inside a subfield view all the valid things I can do in there and so on.
  - **DONE**: Created `TraitCompletionProvider` for autocomplete of trait fields and values
  - **DONE**: Created `TraitHoverProvider` for hover documentation on trait fields
  - **DONE**: Created comprehensive `traitSchema.ts` with all 50+ trait field definitions
  - **DONE**: Verified all documented fields are present in schema
  - Autocomplete triggers on `=` and space in trait files (`**/common/traits/**/*.txt`)
  - Hover shows field documentation, type, valid values, and examples
  - Context-aware completions for nested blocks (desc, trigger, potential, etc.)

- [x] LSP consideration
  - Current implementation uses VS Code native providers and works well
  - LSP could be considered for future expansion if needed for other editors
  - For now, VS Code native approach is sufficient and simpler

- [x] Add barebones templates for everything. Generally we should move away from templates that try to design the whole item through prompting the user, and more towards ones that just fill out the basic fields.
So for example prompting for skill modifications in a trait template makes little sense - I can just add that myself. But the code for having an xp track in a trait (or multiple tracks) isn't so obvious, so it makes sense to have a template for that. Prioritize the following:
  - [x] Secret types (`secret_type.yml`)
  - [x] Traits (`barebones_trait.yml`, `xp_track_trait.yml`)
  - [x] Character interactions (`character_interaction.yml`)
  - [x] Activity types (`activity_type.yml`)
  - [x] Decisions (`barebones_decision.yml`)
  - [x] Events (`barebones_event.yml`, `event_chain.yml`, `scheme_event.yml`)
  - [x] Schemes (`scheme_type.yml`)
  - [x] Buildings (`barebones_building.yml`)
  - **DONE**: Unified all templates to string-based format (removed over-parameterized object templates)
  - **DONE**: Simplified template generator from 750 to 177 lines
- [ ] Add a more comprehensive intellisense/code actions system when inside an effect scope specifically
  - More generally, somehow there should be a more comprehensive list of possible fields in each slot. For example, the engine should know that stationed_pikemen_damage_mult is a valid county modifier but not (I think?) a valid character modifier, add_piety is a valid effect of an event but not a valid effect of a trait, when you're writing a condition it should autocomplete to things that are valid conditions, and so on.
  - **IN PROGRESS**: Created data layer (`src/data/`) with scope-aware effects and triggers
  - [x] Basic MVP: completions work inside trigger/effect blocks for events and decisions
  - [x] Extended trigger/effect completions to ALL 50+ file types (interactions, schemes, buildings, on_actions, scripted_effects, scripted_triggers, etc.)
  - [x] Parser script to import effects/triggers from game data
    - `parseOldEnt.ts` can fetch from OldEnt's repo or parse local `script_docs` output
    - Generated **1343 effects** and **1145 triggers** with scope metadata
  - [x] Scope tracking for nested blocks (detect scope-changing effects like `every_vassal`, `liege`, and update current scope accordingly)
    - **DONE**: `analyzeBlockContext()` walks block path and tracks scope via `outputScope` from effects/triggers
    - **DONE**: Merged manual scope changers (`liege`, `father`, `primary_title`, etc.) with auto-generated data
    - **DONE**: Added tests for scope tracking (65 tests total)
  - [ ] Entity-specific contexts (traits, decisions, buildings have different allowed effects in their modifier blocks)
  - [ ] Modifier category awareness (character modifiers vs county modifiers vs province modifiers)
  - [ ] Validation and diagnostics (mark invalid effects/triggers in wrong scope context)
- The following are the main priorities for adding support for other types:
  - [x] Character interactions
    - **DONE**: Template (`character_interaction.yml`)
    - **DONE**: Code action to add interactions
    - **DONE**: Trigger/effect completions in interaction files
- [x] Reorganize the project so we don't have so many different directories, todo files etc.
  - **DONE**: Moved VSCode extension to top level (`vscode-ck3-tools/`)
  - **DONE**: Integrated template generator as part of extension source
  - **DONE**: Consolidated into single build system and package.json
- [ ] Syntax highlighting
  - [x] Barebones syntax highlighting done.
- [ ] Reflect all the information gathered into the schemas (and everywhere else) in the plain-text documentation we're also producing.

### Linting
- [ ] Simple linting. If we have a comprehensive list of items that are valid in each space (that is, a proper, complete schema) we can mark any invalid ones. (I guess there should be a "ignore this particular invalid field forever" button). We can also detect name collisions (especially useful for events that are just named by numbers), at least within the same mod.
  - **IN PROGRESS**: `CK3DiagnosticsProvider` implemented with schema-based validation
  - Run `npx vitest run src/test/validateGameFiles.test.ts` to validate against vanilla game files (1,522 files)
  - **Current output: 61 diagnostics** (down from 41,889 originally)
  - [x] **Unknown effects/triggers base recognition** - All effects/triggers recognized via generated data + parameter overrides + scripted pattern heuristics
  - [x] **Sibling block misattribution** - Fixed regex and control flow bugs that caused false positives
  - [x] **Block schema validation system** - Replaced coarse `DYNAMIC_KEY_BLOCKS` with fine-grained schema validation:
    - Created `src/schemas/blockSchemas.ts` with schemas for special blocks
    - Schema-only blocks (`men_at_arms`, `opinion`, `levies`, etc.) validate against fixed fields
    - Nested blocks (`desc`, `first_valid`, `triggered_desc`) validate valid child blocks
    - Hybrid blocks (`option`) validate schema fields + allow effects
    - Pure dynamic key blocks (`stress_impact`, `switch`, `random_list`) skip validation
    - Added `flavor`, `trait`, `clicksound`, `custom_tooltip` to `eventOptionSchema`
    - Diagnostics dropped from 3,205 to 61 after this change
  - [x] **Synchronized BLOCK_SCHEMAS with hover/completion providers**:
    - Completion provider now autocompletes fields for schema-only blocks (`triggered_desc`, `desc`, `first_valid`, `random_valid`, `men_at_arms`, `levies`, `opinion`, `history`, `sub_region`)
    - Hover provider now shows documentation for fields in these structural blocks
    - No duplication: shared `blockSchemas.ts` used by all three providers (diagnostics, completion, hover)
  - [ ] **Triggers used in effect context (292)** - Some are parameters (like `task_contract_tier`), others are valid usages in special blocks like `show_as_unavailable`
- [ ] There should also be an option to "explicitify" the localization keys, by adding all the necessary localization key fields (with their default values) to an item (so if we have a trait foo_bar, doing this would add name = trait_foo_bar) and so on.
  - [ ] In general the localization generator should account for the whole structure of the current item when generating necessary localizations (so if you have an event with a bunch of options, it should generate the localizations for each option). But this seems quite hard so that's probably a low priority.
- [x] Add some unit tests
  - **DONE**: Added template validation tests (`templates.test.ts` - 23 tests)
  - **DONE**: Added completion provider tests (`ck3CompletionProvider.test.ts` - 23 tests)
  - **DONE**: Added hover provider tests (`ck3HoverProvider.test.ts` - 17 tests)
  - **DONE**: Added diagnostics provider tests and context detection tests
  - **DONE**: Added target validation tests (6 tests for trait reference validation)
  - **DONE**: Added operator handling tests (12 tests for =, ?=, >, <, >=, <= operators)
  - **DONE**: Added block schema validation tests (`blockSchemaValidation.test.ts` - 9 tests)
  - **DONE**: Added block parsing characterization tests (`blockParsing.test.ts` - 26 tests)
  - **DONE**: Unified block parsing logic into `src/utils/blockParser.ts` - All three providers (CompletionProvider, HoverProvider, DiagnosticsProvider) now share the same regex pattern and context determination logic
  - **DONE**: Unified schema registry - Created centralized `src/schemas/registry/schemaRegistry.ts` with ~200 file type patterns. All three providers (CompletionProvider, HoverProvider, DiagnosticsProvider) now use this registry instead of maintaining separate copies:
    - Removed ~180 duplicate schema imports from HoverProvider
    - Removed SCHEMA_REGISTRY map from DiagnosticsProvider
    - Removed ~650 lines of `getFileType()` if-else chains from CompletionProvider
    - Added context-aware schema resolution via `getSchemaForContext()` callbacks
  - Total: 193 tests passing


- What's up with accessory and artifact both being schemae? Should look in the game files and figure this out.
## Issues

- [ ] While editing events, the option to automatically generate localization is missing. It needs to be added.
- [x] When trying to add a decision followup event, I got the following error:
  - **FIXED**: Deleted overly complex `decision_followup_event.yml` template
  - Use `barebones_event.yml` instead - simpler and covers all use cases
- [x] The hover to see a field's documentation only works for traits currently (or at least, it doesn't work for buildings).
  - **FIXED**: Created [CK3HoverProvider](vscode-ck3-tools/src/providers/ck3HoverProvider.ts) that works for all 212 entity types
  - Registered hover provider for events, decisions, buildings, interactions, and all other CK3 file types
  - Now hovering over any field name in any CK3 entity file will show documentation
- [x] When inserting an event, if I use a namespace that already exists in the same file, the extension should put the new event under the existing ones in that namespace (and move the cursor there), and not write a new namespace = ... line.
  - **FIXED**: Updated `addEvent.ts` to detect existing namespaces
  - Strips namespace line, auto-increments event ID, inserts after last event, moves cursor

## Future Investigation

- [ ] **Scripted Modifiers / Weight Blocks**: The `scriptedModifierSchema` actually describes "weight blocks" (value calculation blocks used in `ai_will_do`, `agent_join_chance`, random event weights, etc.). These have fields like `base`, `add`, `multiply`, `modifier = {}`. However, weight blocks can also **include other scripted modifiers by name** (e.g., `compatibility_modifier = yes`). This is a wildcard situation - need to either parse `common/scripted_modifiers/` to get the list of valid scripted modifier names, or accept any `*_modifier` pattern. See [CK3 Wiki - Weight modifier](https://ck3.paradoxwikis.com/Weight_modifier).

- [ ] **Modifier wildcard validation**: The `modifierSchema` and `traitSchema` have modifier wildcards that check against `modifiersMap`, but the map only contains ~736 static modifiers. Many modifier names are **template instantiations** (e.g., `$TERRAIN$_advantage` → `desert_advantage`, `$CULTURE$_opinion` → `afghan_opinion`). These instantiated names aren't in the map. Options: (1) expand templates by parsing game data for cultures/terrains/etc., (2) use regex patterns, or (3) accept any field in static_modifier contexts.

- [ ] Review `isSpecialPattern` logic in `ck3DiagnosticsProvider.ts` (~lines 1057-1093)
  - Handles special CK3 patterns that shouldn't be flagged as unknown triggers/effects:
    - Script variable substitutions: `$VAR$`, `$VARIABLE$`
    - Paths with script variables: `$INVADER$.faith.religion`
    - Flag references: `flag:something`, `flag:$VAR$`
    - Variable references: `var:something`
    - Specific scope targets: `faith:catholic`, `title:k_france`, `culture:norse`
    - Pure numeric values: `"1"`, `"50"` (used in some contexts)
  - Could verify each pattern is still needed, check for edge cases, or validate more precisely

- [ ] **Workspace Index Extensions**: The `CK3WorkspaceIndex` class now tracks entities across the workspace. Future extensions:
  - [ ] **Go to Definition**: Click on `add_trait = brave` to jump to trait definition
  - [ ] **Find References**: Find all uses of a trait/event/scripted effect
  - [x] **Autocomplete from index**: Suggest valid trait names when typing `add_trait =`, valid events for `trigger_event =`
    - **DONE**: Implemented `getEntityReferenceCompletions()` in `ck3CompletionProvider.ts`
    - Effects/triggers with `supportedTargets` now autocomplete from workspace index
    - Case-insensitive prefix filtering (e.g., `add_trait = bra` suggests "brave", "brazen")
    - Extracted `TARGET_TO_ENTITY_TYPE` to shared `src/utils/entityMapping.ts`
  - [x] **Effect/trigger entity validation**: Use `supportedTargets` from effect definitions to validate references (e.g., `add_trait = brave` should check if `brave` is a defined trait)
    - **DONE**: Implemented `validateTargetValue()` in `ck3DiagnosticsProvider.ts`
    - **Extended workspace index to 27 entity types**: `trait`, `event`, `decision`, `scripted_effect`, `scripted_trigger`, `scripted_modifier`, `script_value`, `secret_type`, `scheme`, `on_action`, `activity`, `culture`, `culture_tradition`, `culture_innovation`, `culture_pillar`, `doctrine`, `landed_title`, `holding_type`, `government_type`, `dynasty`, `dynasty_house`, `casus_belli_type`, `faction`, `legend`, `inspiration`, `struggle`, `epidemic`, `great_project`, `accolade_type`, `situation`, `story_cycle`, `court_position_type`, `artifact`
    - **Created `TARGET_TO_ENTITY_TYPE` map**: Maps effect/trigger `supportedTargets` to `EntityType` for 40+ target types
    - **Scope path resolution**: Validates references with scope paths like `root.culture`, `prev.capital_county`, `title:k_england.holder`
      - `resolveDotScopePath()`: Resolves paths like `root.culture` by looking up the last scope changer's output type
      - `resolvePrefixedScopePath()`: Resolves prefixed paths like `title:k_england.holder`
      - Key insight: Scope changers have fixed output types regardless of input context
    - Extended validation to triggers (not just effects) - e.g., `can_execute_decision`, `trait_is_sin`
    - Skips dynamic references (`scope:X`, `$VARIABLE$`, `flag:`, prefixed database keys like `trait:brave`)
  - [ ] **Index game files**: Currently only indexes workspace files; could also index game files from CK3 install path for complete validation
- A number of schemas might not be quite right. Specifically:
  - I think the artifact schema just works for all the stuff in the artifacts subfolder. Actually these appear to be a number of different things and we're not really doing the right thing for any of them.
  - A number of schemas have fields that are required sometimes conditional on other fields. Currently these have all been simply marked as not required. This was just done based on inspecting the game files by script and can probably be done more carefully.


  # CK3 Diagnostics - Remaining Issues

**Status:** 524 diagnostics remain (down from 41,889 originally; expanded validation adds more warnings for valid patterns)

## Top Issues by Identifier Count

| Identifier | Count | Category | Notes |
|------------|-------|----------|-------|
| `custom` | 12 | Missing parameter | Iterator parameter not recognized |
| `matchmaker` | 10 | Unknown trigger | DLC-specific, may need adding |
| `gold` | 9 | Trigger in effect context | Used in `refund_cost` blocks |
| `hegemony` | 4 | Unknown | DLC feature |
| `clear_variable_list` | 4 | Invalid ?= usage | Not a scope changer |

## Issue Categories

### A: Unknown Triggers/Effects (~37)
Identifiers not in our generated data, likely DLC-specific or undocumented:
- `matchmaker` (10) - Matchmaking feature
- `hegemony` (4) - Hegemony feature
- Various typos in game files (`If`, `limiT`, `Not`, `NOt`)

### B: Triggers Used in Effect Context (~9)
```
Trigger "gold" used in effect context (in "refund_cost")
```
The `refund_cost` block expects triggers, but we're flagging them as wrong context.

### C: Invalid ?= Usage (~13)
```
Invalid ?= usage: "obedience_target" is not a valid scope.
```
Non-scope-changers used with the `?=` operator. May be DLC-specific scopes.

## Effect/Trigger Context Validation - False Positives

After implementing "Effect X used in trigger context" / "Trigger Y used in effect context" validation, ~570 new diagnostics appeared on vanilla game files. Two types of false positives were identified and fixed:

### ✅ Type 1: Sibling Block Misattribution - FIXED

**Root cause identified:** Two bugs in the field validation code:

1. **Regex bug:** The fieldMatch regex `/^\s*([\w.:$]+)\s*(\?=|=)\s*([^{].*)$/` was matching lines with `{` in the value because `[^{]` would match a space before `{`, then `.*` matched the rest including `{`. Fixed by changing to `[^{]*` which ensures NO braces in the value.

2. **Control flow bug:** `continue` statements in the fieldMatch handling for `?=` operators and DYNAMIC_KEY_BLOCKS were skipping to the next line entirely, which also skipped the brace depth update and stack popping at the end of the line. This caused inline blocks like `owner.culture ?= { ... }` to not pop their closing braces, leaving stale entries on the stack that caused subsequent sibling blocks to have incorrect parent context.

**Fix:** Replaced `continue` statements with a `shouldValidate` flag that skips only the validation logic without skipping the brace handling.

### ✅ Type 2: Self-Referential Errors - FIXED

**Example errors that were occurring:**
- `Effect "set_variable" used in trigger context (in "set_variable")`
- `Effect "trigger_event" used in trigger context (in "trigger_event")`

**Root cause:** Same as Type 1 - the regex bug caused `set_variable = {` to be matched as a field assignment when preceded by another `set_variable` block that wasn't properly popped. The fix to use `[^{]*` instead of `[^{].*` resolved this completely.

**Status:** All 22 self-referential errors eliminated by the regex fix.

### ✅ Type 3: Bare Identifiers Not Validated - FIXED

**Problem:** Lines without operators (`=`, `?=`, etc.) inside blocks were completely skipped during validation. For example, `xyz` on its own line inside `immediate = { }` would not produce any diagnostic.

**Root cause:** The field matching regex required an operator: `/^\s*([\w.:$]+)\s*(\?=|=)\s*([^{]*)$/`. Lines without operators never matched, so they were silently ignored.

**Fix:** Added bare identifier detection after the field match check. For lines that:
1. Don't match the field regex (no operator)
2. Are inside a block
3. Contain a bare identifier

Now:
- In list blocks (`events`, `on_actions`, etc.) → validate identifier against workspace index
- In trigger/effect blocks → flag as error with message "Unexpected bare identifier, did you forget '= yes'?"

**Files changed:**
- `src/utils/scopeContext.ts` - Added `LIST_BLOCKS` constant
- `src/providers/workspaceIndex.ts` - Added `on_action` entity type
- `src/providers/ck3DiagnosticsProvider.ts` - Added bare identifier validation
