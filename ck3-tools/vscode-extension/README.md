# CK3 Modding Tools - VS Code Extension

Code generation and tooling for Crusader Kings 3 modding, integrated directly into VS Code.

## Features

### Code Actions (Right-Click Menu)

**In `common/traits/` directory:**
- **Add Trait from Template** - Generate trait code with interactive prompts
  - Personality traits with stat modifiers
  - Education traits with levels
  - Lifestyle traits with XP progression

**In `common/buildings/` directory:**
- **Add Building from Template** - Generate building chains
  - Economy buildings with income/levy bonuses
  - Learning buildings with development growth

**In `events/` directory:**
- **Add Event from Template** - Generate character events
  - Multiple options with different effects
  - Auto-generated localization keys

**In `common/decisions/` directory:**
- **Add Decision from Template** - Generate decisions
  - Major realm decisions
  - Personal character decisions

### Localization Tools

**In any `common/` file:**
- **Generate Localization** - Automatically extract keys and create localization file
  - Parses traits, buildings, decisions, events
  - Creates `_l_english.yml` file with proper UTF-8 BOM
  - Generates default text based on names

- **Go to Localization** - Navigate to localization file
  - Jumps to corresponding localization file
  - Highlights relevant keys
  - Offers to generate if missing

## Usage

### Adding a Trait

1. Open a file in `common/traits/`
2. Right-click where you want to insert the trait
3. Select "CK3: Add Trait from Template"
4. Choose template (personality, education, lifestyle)
5. Fill in the prompts (name, stats, etc.)
6. Code is inserted at cursor position

### Generating Localization

1. Open a trait/building/decision/event file
2. Right-click anywhere
3. Select "CK3: Generate Localization for Current File"
4. Localization file is created in `localization/english/`
5. Optionally open the file to edit default text

### Navigation

1. With cursor on a trait/building/decision name
2. Right-click
3. Select "CK3: Go to Localization"
4. Opens localization file and highlights the key

## Requirements

- VS Code 1.85.0 or higher
- CK3 mod workspace (detected by `descriptor.mod` file)

## Development

### Setup

```bash
cd vscode-extension
npm install
npm run compile
```

### Testing

Press F5 to open Extension Development Host

### Building

```bash
npm run vscode:prepublish
```

## Template System

The extension uses YAML templates from the `../templates/` directory:
- `templates/trait/` - Trait templates
- `templates/building/` - Building templates
- `templates/event/` - Event templates
- `templates/decision/` - Decision templates

## License

MIT
