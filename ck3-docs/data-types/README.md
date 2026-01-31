# Data Types

This directory contains detailed documentation for different data types in CK3 modding.

## Available Documentation

- [Traits](traits.md) - Character traits and their properties
- [Buildings](buildings.md) - Holdings and building structures
- [Decisions](decisions.md) - Player-initiated decisions

## Common Data Types in CK3

### Character-Related

- **Traits** (`common/traits/`) - Character characteristics
- **Nicknames** (`common/nicknames/`) - Character nicknames
- **DNA Data** (`common/dna_data/`) - Physical appearance genetics
- **Lifestyles** (`common/lifestyles/`) - Character lifestyle focuses
- **Lifestyle Perks** (`common/lifestyle_perks/`) - Perk trees for lifestyles
- **Character Interactions** (`common/character_interactions/`) - Diplomatic actions
- **Character Memories** (`common/character_memory_types/`) - Story memories

### Realm-Related

- **Buildings** (`common/buildings/`) - Province buildings
- **Holdings** (`common/holdings/`) - Holding types (castle, city, church, tribal)
- **Landed Titles** (`common/landed_titles/`) - Title definitions
- **Laws** (`common/laws/`) - Realm laws
- **Succession** (`common/succession_election/`, `common/succession_appointment/`) - Succession types
- **Council Positions** (`common/council_positions/`) - Council roles
- **Council Tasks** (`common/council_tasks/`) - What councilors can do

### Diplomacy and War

- **Casus Belli Types** (`common/casus_belli_types/`) - War justifications
- **Character Interactions** (`common/character_interactions/`) - Diplomatic actions
- **Schemes** (`common/schemes/`) - Plots and schemes
- **Factions** (`common/factions/`) - Faction types
- **AI War Stances** (`common/ai_war_stances/`) - AI war behavior

### Military

- **Men at Arms Types** (`common/men_at_arms_types/`) - Special regiment types
- **Combat Effects** (`common/combat_effects/`) - Combat modifiers
- **Combat Phase Events** (`common/combat_phase_events/`) - Battle events

### Culture and Religion

- **Culture** (`common/culture/`) - Culture definitions
  - `cultures/` - Specific cultures
  - `pillars/` - Culture pillars (heritage, language, etc.)
  - `traditions/` - Culture traditions
  - `innovations/` - Cultural innovations
- **Religion** (`common/religion/`) - Faith and religion
  - `religions/` - Religion definitions
  - `doctrines/` - Faith doctrines
  - `holy_sites/` - Holy site definitions

### Events and Scripting

- **On Actions** (`common/on_action/`) - Event triggers
- **Scripted Effects** (`common/scripted_effects/`) - Reusable effects
- **Scripted Triggers** (`common/scripted_triggers/`) - Reusable conditions
- **Scripted Modifiers** (`common/scripted_modifiers/`) - Dynamic modifiers
- **Script Values** (`common/script_values/`) - Reusable values
- **Customizable Localization** (`common/customizable_localization/`) - Dynamic text

### Dynasties

- **Dynasties** (`common/dynasties/`) - Dynasty definitions
- **Dynasty Houses** (`common/dynasty_houses/`) - Cadet branches
- **Dynasty Legacies** (`common/dynasty_legacies/`) - Legacy tracks
- **Dynasty Perks** (`common/dynasty_perks/`) - Individual perks

### Other Systems

- **Decisions** (`common/decisions/`) - Player decisions
- **Important Actions** (`common/important_actions/`) - UI alerts
- **Modifiers** (`common/modifiers/`) - Named modifiers
- **Opinion Modifiers** (`common/opinion_modifiers/`) - Relationship modifiers
- **Focuses** (`common/focuses/`) - Education focuses
- **Secrets** (`common/secret_types/`) - Secret types
- **Activities** (`common/activities/`) - Court activities
- **Artifacts** (`common/artifacts/`) - Artifact definitions
- **Bookmarks** (`common/bookmarks/`) - Start date scenarios
- **Coat of Arms** (`common/coat_of_arms/`) - Heraldry definitions
- **Game Concepts** (`common/game_concepts/`) - Tutorial concepts
- **Struggles** (`common/struggle/`) - Regional struggle mechanics
- **Legends** (`common/legends/`) - Legend system

## File Structure Patterns

Most data types follow similar patterns:

### Definition Files

Located in `common/<type>/*.txt`, using the scripting language syntax.

### Info Files

Many directories include `_<type>.info` files with official documentation from Paradox. These explain the structure but aren't loaded by the game.

### Numbering Convention

Files use number prefixes for load order:
- `00_*.txt` - Base game content
- `50_*.txt` - Mid-priority content
- `99_*.txt` - Overrides and late-loading content

Mods should use appropriate numbers to control when their content loads relative to the base game and other mods.

## Common Properties Across Data Types

Many data types share common properties:

### Localization

Most objects need localization:
- Names and descriptions
- Usually `<type>_<key>` and `<type>_<key>_desc`
- Icons at `gfx/interface/icons/<type>/<key>.dds`

### Triggers and Effects

Many types use conditional logic:
- `is_valid` / `potential` / `is_shown` - When something is available
- `can_<action>` - When an action is possible
- `effect` / `on_<event>` - What happens

### AI Behavior

AI-facing content uses weighting:
- `ai_will_do` / `ai_value` - How much AI wants something
- `ai_potential` - Whether AI considers it at all
- MTTH (Mean Time To Happen) structure

### Scopes

Scripts execute in context of game objects:
- `root` - Primary scope
- `this` - Current scope
- `scope:<name>` - Named scopes
- `prev` - Previous scope in chain

## Adding New Data Types

To document a new data type:

1. Read the base game's `_<type>.info` file if available
2. Examine several examples from the base game
3. Test creating simple examples
4. Document the structure with examples
5. Note any special behaviors or gotchas

## Resources

- Base game info files in each `common/` subdirectory
- [CK3 Scripting Wiki](https://ck3.paradoxwikis.com/Scripting)
- [Modding Wiki](https://ck3.paradoxwikis.com/Modding)
- Game's `error.log` for debugging
