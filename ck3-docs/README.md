# Crusader Kings 3 Modding Documentation

This documentation provides a comprehensive guide to creating mods for Crusader Kings 3 (CK3). The goal is to make the modding process more accessible by documenting the game's custom scripting language and data format.

## Overview

CK3 uses a proprietary scripting language developed by Paradox Interactive. This language is designed to be accessible to modders without traditional programming experience. However, the format can be verbose and the official documentation is sometimes incomplete.

## Key Characteristics

- **No traditional programming required**: The scripting language is declarative rather than imperative
- **Data-driven design**: Game content is defined through nested data structures
- **Trigger-based logic**: Conditional behavior uses trigger blocks
- **Modifier system**: Effects are applied through modifiers
- **Localization**: All text is separated into localization files

## Documentation Structure

- [Scripting Language](scripting-language.md) - Syntax and structure of the CK3 scripting language
- [File Structure](file-structure.md) - How to organize mod files
- [Data Types](data-types/) - Documentation for specific game data types
  - [Traits](data-types/traits.md)
  - [Buildings](data-types/buildings.md)
  - [Decisions](data-types/decisions.md)
  - And more...
- [Examples](examples/) - Sample mods demonstrating common patterns

## Quick Start

1. Create a `.mod` file in your CK3 mod directory
2. Create a folder for your mod content
3. Add your custom data files following the game's structure
4. Test in-game and check the error log for issues

## Resources

- [CK3 Wiki - Modding](https://ck3.paradoxwikis.com/Modding)
- [CK3 Wiki - Scripting](https://ck3.paradoxwikis.com/Scripting)
- [CK3 Modding GitHub Community](https://github.com/CK3-Modding/Documentation)
- [Awesome CK3 Resources](https://github.com/my-mods/awesome-ck3)

## Development Tools

Recommended editors and tools:
- **Visual Studio Code** with extensions:
  - CK3 Tiger (validation)
  - Paradox Highlight (syntax highlighting)
  - CWTools (autocomplete)
- **Sublime Text** with CK3 Tools extension
- **Language Server Protocol** implementations available for IDE integration

## Game Files Location

The base game files can be found at:
- **Windows**: `C:\Program Files (x86)\Steam\steamapps\common\Crusader Kings III\game\`
- **macOS**: `~/Library/Application Support/Steam/steamapps/common/Crusader Kings III/game/`
- **Linux**: `~/.local/share/Steam/steamapps/common/Crusader Kings III/game/`

The `common/` subdirectory contains most of the moddable game data.
