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
- [ ] Simple linting. If we have a comprehensive list of items that are valid in each space (that is, a proper, complete schema) we can mark any invalid ones. (I guess there should be a "ignore this particular invalid field forever" button). We can also detect name collisions (especially useful for events that are just named by numbers), at least within the same mod.
  - **IN PROGRESS**: `CK3DiagnosticsProvider` implemented with schema-based validation
  - Run `npx vitest run src/test/validateGameFiles.test.ts` to validate against vanilla game files (1,522 files)
  - Current output: 17,269 diagnostics (down from 41,889)
  - [x] **Unknown effects** - ~~Effects not in `src/data/effects.ts`~~ **DONE**: All effects now recognized via generated data + parameter overrides + scripted pattern heuristics
  - [x] **Unknown triggers** - ~~Triggers not in `src/data/triggers.ts`~~ **DONE**: All triggers now recognized via generated data + parameter overrides + special pattern handling
  - [ ] **Unknown fields (13,591)** - Many game file fields not yet in schemas. Audit game files and add missing fields to `src/schemas/`
  - [ ] **Missing required fields (1,949)** - May be flagging fields that aren't actually required in all contexts
  - [ ] **Type mismatches (~1,700)** - Validator flags script value references (like `expensive_building_tier_3_cost`) as type errors. Options: accept identifiers as numeric values, build list of known script values, or add "script_value" type
  - [ ] **Boolean type mismatches (95)** - Fields like `auto_accept` expect `yes/no` but sometimes take block values for conditional logic
  - [ ] **Dynamic key blocks** - Currently using a hardcoded `DYNAMIC_KEY_BLOCKS` set (e.g., `stress_impact`) to skip validation for blocks where children are trait names or other dynamic keys rather than effects/triggers. This is a quick fix; a more careful approach might define this in the schema itself (e.g., a `childKeyType: 'trait'` property) so the validator knows what kind of keys to expect.
  - [ ] **Mixed schema/effect blocks** - Some blocks like `option` contain both schema fields (`name`, `flavor`, `trigger`) AND effects. Currently these schema fields get flagged as unknown effects. Need to recognize when we're inside a schema-defined block and check children against both the sub-schema AND the effects list.
- [ ] There should also be an option to "explicitify" the localization keys, by adding all the necessary localization key fields (with their default values) to an item (so if we have a trait foo_bar, doing this would add name = trait_foo_bar) and so on.
  - [ ] In general the localization generator should account for the whole structure of the current item when generating necessary localizations (so if you have an event with a bunch of options, it should generate the localizations for each option). But this seems quite hard so that's probably a low priority.
- [x] Add some unit tests
  - **DONE**: Added template validation tests (`templates.test.ts` - 23 tests)
  - **DONE**: Added completion provider tests (`ck3CompletionProvider.test.ts` - 23 tests)
  - **DONE**: Added hover provider tests (`ck3HoverProvider.test.ts` - 17 tests)
  - **DONE**: Added diagnostics provider tests and context detection tests
  - Total: 107 tests passing


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

- [ ] Review `isSpecialPattern` logic in `ck3DiagnosticsProvider.ts` (~lines 1057-1093)
  - Handles special CK3 patterns that shouldn't be flagged as unknown triggers/effects:
    - Script variable substitutions: `$VAR$`, `$VARIABLE$`
    - Paths with script variables: `$INVADER$.faith.religion`
    - Flag references: `flag:something`, `flag:$VAR$`
    - Variable references: `var:something`
    - Specific scope targets: `faith:catholic`, `title:k_france`, `culture:norse`
    - Pure numeric values: `"1"`, `"50"` (used in some contexts)
  - Could verify each pattern is still needed, check for edge cases, or validate more precisely