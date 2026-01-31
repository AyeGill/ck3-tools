# CK3 Mod File Structure

This document explains how to organize your mod files and the structure of the `.mod` file.

## Mod Files

Every mod consists of two parts:

1. **A `.mod` descriptor file** - Metadata about your mod
2. **A mod folder** - Contains all your mod's content

### The .mod File

Location: `[CK3 User Directory]/mod/your_mod.mod`

Example structure:

```
name = "My Amazing Mod"
version = "1.0.0"
tags = {
    "Gameplay"
    "Historical"
}
picture = "thumbnail.png"
supported_version = "1.12.*"

path = "mod/my_amazing_mod"
```

#### .mod File Properties

- `name` - Display name shown in the launcher
- `version` - Your mod's version number
- `tags` - Categories for the mod launcher (see valid tags below)
- `picture` - Path to thumbnail image (optional)
- `supported_version` - Game version(s) your mod supports (use wildcards)
- `path` - Relative path to your mod folder
- `dependencies` - List of other mods required (optional)
- `remote_file_id` - Steam Workshop ID (for published mods)

#### Valid Tags

Common tags include:
- `Gameplay`
- `Balance`
- `Graphics`
- `Historical`
- `Alternative History`
- `Map`
- `Military`
- `Religion`
- `Culture`
- `Events`
- `Fixes`
- `Total Conversion`
- `Translation`
- `Utilities`

### Mod Folder Structure

Your mod folder should mirror the game's structure:

```
my_amazing_mod/
├── common/
│   ├── traits/
│   │   └── my_traits.txt
│   ├── buildings/
│   │   └── my_buildings.txt
│   ├── decisions/
│   │   └── my_decisions.txt
│   ├── character_interactions/
│   ├── scripted_effects/
│   ├── scripted_triggers/
│   └── ...
├── events/
│   └── my_events.txt
├── gfx/
│   └── interface/
│       └── icons/
├── localization/
│   └── english/
│       └── my_mod_l_english.yml
├── music/
├── history/
│   ├── characters/
│   ├── titles/
│   └── provinces/
└── descriptor.mod
```

## Directory Purposes

### common/

Contains game data definitions. This is where most modding happens. Key subdirectories:

- **traits/** - Character traits
- **buildings/** - Holdings and buildings
- **decisions/** - Player decisions
- **character_interactions/** - Diplomatic actions
- **casus_belli_types/** - War justifications
- **culture/** - Culture definitions
- **religion/** - Faith and religion definitions
- **on_action/** - Event triggers
- **scripted_effects/** - Reusable effect code
- **scripted_triggers/** - Reusable conditional logic
- **modifiers/** - Named modifiers
- **dynasty_legacies/** - Dynasty legacy tracks
- **lifestyle_perks/** - Lifestyle perk trees
- **schemes/** - Scheme definitions
- **laws/** - Realm laws
- **council_tasks/** - Council position tasks

### events/

Event scripts that create story content and player interactions. Uses a different syntax from common/ files.

Example naming: `namespace_events.txt` where namespace is your unique prefix.

### localization/

Text strings for all languages. Files use YAML format with specific requirements:

- Must be in a language-specific subdirectory (e.g., `english/`, `french/`)
- Files must end with `_l_<language>.yml`
- UTF-8 with BOM encoding required

Example structure:
```yaml
l_english:
 my_trait_name:0 "Brilliant"
 my_trait_name_desc:0 "This character is exceptionally intelligent."
```

The number after the colon is a version number (increment when changing text).

### gfx/

Graphics and visual assets:

- `interface/` - UI elements
  - `icons/` - Small icons (traits, modifiers, etc.)
  - `illustrations/` - Larger images
- `portraits/` - Portrait assets
- `coat_of_arms/` - Heraldry patterns

### history/

Historical setup data:

- **characters/** - Historical character definitions
- **titles/** - Title history (who held what when)
- **provinces/** - Province history (buildings, religion, culture)
- **wars/** - Historical wars

This data sets up the game state at various start dates.

### music/

Custom music files and playlists.

## File Naming Conventions

### Prefix with Numbers

Files in the same directory are loaded in alphabetical order. Use number prefixes to control load order:

```
00_base_traits.txt      # Loads first
50_my_mod_traits.txt    # Loads middle
99_overrides.txt        # Loads last
```

Higher numbers override earlier definitions.

### Info Files

Many directories contain `_<type>.info` files (e.g., `_traits.info`, `_buildings.info`). These are documentation files from Paradox explaining the structure. They're helpful references but not loaded by the game.

## Replace vs. Modify

### Modifying (Typical Approach)

Most mods add new content or modify existing content:

- Create new files with your additions
- To override specific items, define them with the same key
- Last-loaded definition wins

### Replacing (Advanced)

You can completely replace base game files using `replace_path` in your .mod file:

```
replace_path = "common/traits"
replace_path = "history/characters"
```

Warning: This removes ALL base game content from that folder. Use sparingly.

## Load Order and Conflicts

### Conflict Resolution

When multiple mods define the same thing:

1. Enabled mods load in the order shown in the launcher
2. Later mods override earlier mods
3. Check `database_conflicts.log` for conflicts

### Compatibility Considerations

To maximize compatibility:

- Use unique names for your content (add a prefix)
- Don't override base game content unless necessary
- Document what you change
- Use scripted effects/triggers for shared logic

## Testing Your Mod

1. Place your mod files in the correct directory structure
2. Create the `.mod` descriptor file
3. Launch CK3 and enable your mod in the launcher
4. Start a game and test your content
5. Check logs for errors:
   - `error.log` - Script errors
   - `database_conflicts.log` - Mod conflicts
   - `game.log` - General game log

## Version Control

Recommended `.gitignore` for mod development:

```
# System files
.DS_Store
Thumbs.db

# Editor files
*.bak
*~
.vscode/
.idea/

# Compiled/generated files
*.dds.bak
```

## Distribution

### Steam Workshop

1. Create all content in your mod folder
2. Use the CK3 launcher to upload to Workshop
3. The launcher will create/update the `remote_file_id` in your .mod file

### Manual Distribution

Provide users with:
1. The `.mod` descriptor file
2. The mod folder (often as a .zip)

Users place both in their `[CK3 User Directory]/mod/` folder.
