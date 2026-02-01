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

- [ ] Add barebones templates for everything. Generally we should move away from templates that try to design the whole item through prompting the user, and more towards ones that just fill out the basic fields.
So for example prompting for skill modifications in a trait template makes little sense - I can just add that myself. But the code for having an xp track in a trait (or multiple tracks) isn't so obvious, so it makes sense to have a template for that. Prioritize the following:
  - Secret types
  - Traits (a barebones template that doesn't add the cruft of the current one)
  - Character interactions
  - Activity types
  - Decisions
  - Events (add templates for other common types of events, event chains, scheme events? etc)
- [ ] Add a more comprehensive intellisense/code actions system when inside an effect scope specifically
  - More generally, somehow there should be a more comprehensive list of possible fields in each slot. For example, the engine should know that stationed_pikemen_damage_mult is a valid county modifier but not (I think?) a valid character modifier, add_piety is a valid effect of an event but not a valid effect of a trait, when you're writing a condition it should autocomplete to things that are valid conditions, and so on.
- The following are the main priorities for adding support for other types:
  - [ ] Character interactions
- [x] Reorganize the project so we don't have so many different directories, todo files etc.
  - **DONE**: Moved VSCode extension to top level (`vscode-ck3-tools/`)
  - **DONE**: Integrated template generator as part of extension source
  - **DONE**: Consolidated into single build system and package.json
- [ ] Syntax highlighting
- [ ] Reflect all the information gathered into the schemas (and everywhere else) in the plain-text documentation we're also producing.
- [ ] Simple linting. If we have a comprehensive list of items that are valid in each space (that is, a proper, complete schema) we can mark any invalid ones. (I guess there should be a "ignore this particular invalid field forever" button). We can also detect name collisions (especially possible for events that are just named by numbers), at least within the same mod.
- [ ] There should also be an option to "explicitify" the localization keys, by adding all the necessary localization key fields (with their default values) to an item (so if we have a trait foo_bar, doing this would add name = trait_foo_bar) and so on.
  - [ ] In general the localization generator should account for the whole structure of the current item when generating necessary localizations (so if you have an event with a bunch of options, it should generate the localizations for each option). But this seems quite hard so that's probably a low priority.
- [ ] Add some unit tests

## Issues

- [ ] While editing events, the option to automatically generate localization is missing. It needs to be added.
- [x] When trying to add a decision followup event, I got the following error:
  - **FIXED**: Restructured Handlebars conditionals in [decision_followup_event.yml](vscode-ck3-tools/templates/event/decision_followup_event.yml) to produce valid YAML
  - Used YAML literal block scalar (`|`) for multiline content
  - Ensured conditionals wrap complete blocks rather than partial YAML structures
- [x] The hover to see a field's documentation only works for traits currently (or at least, it doesn't work for buildings).
  - **FIXED**: Created [CK3HoverProvider](vscode-ck3-tools/src/providers/ck3HoverProvider.ts) that works for all 212 entity types
  - Registered hover provider for events, decisions, buildings, interactions, and all other CK3 file types
  - Now hovering over any field name in any CK3 entity file will show documentation
- [ ] When inserting an event, if I use a namespace that already exists in the same file, the extension should put the new event under the existing ones in that namespace (and move the cursor there), and not write a new namespace = ... line.