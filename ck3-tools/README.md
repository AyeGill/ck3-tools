# CK3 Tools

Code generation and validation tools for Crusader Kings 3 modding.

## Features

- **Template System** - YAML-based templates for customizable content generation ✅
- **Building Chain Generator** - Generate leveled building chains from templates ✅
- **Trait Generator** - Create trait variants (coming soon)
- **Decision Generator** - Generate decisions with standard structure (coming soon)
- **Validator** - Validate mod files and catch errors (coming soon)

## Installation

```bash
npm install
npm run build
```

## Usage

### Template-Based Generation (Recommended) ⭐

Generate content using YAML templates for maximum flexibility:

```bash
# List available templates
npm run dev list-templates building

# Generate from template
npm run dev from-template -- \
  --template learning_building \
  --category building \
  --name monastery \
  --levels 3 \
  --base-cost 250 \
  --output ./my-mod
```

**Options:**
- `--template <name>` - Template name (required, e.g., economy_building, learning_building)
- `--category <category>` - Category: building, trait, decision (required)
- `--name <name>` - Item name (required)
- `--levels <number>` - Number of levels (for leveled content)
- `--base-cost <number>` - Base construction cost
- `--cost-scaling <number>` - Cost scaling factor
- `--primary-effect <type>` - Primary effect/stat
- `--output <path>` - Output directory (default: ./output)
- `--param <key=value>` - Additional parameters (can be repeated)

**Built-in Templates:**
- `economy_building` - General-purpose income building with customizable stats
- `learning_building` - Learning-focused building with piety, development, and scholar bonuses

### Building Generator (Legacy Mode)

Direct parameter mode (simpler but less flexible):

```bash
npm run dev building -- --name grand_library --levels 3 --base-cost 200 --effect learning --output ./output
```

Options:
- `--name <name>` - Building name (required)
- `--levels <number>` - Number of building levels (default: 3)
- `--base-cost <number>` - Base construction cost (default: 200)
- `--cost-scaling <number>` - Cost scaling factor between levels (default: 2.0)
- `--effect <type>` - Primary effect type (default: learning)
- `--output <path>` - Output directory (default: ./output)

### Example Output

The generator creates:

1. **Building file** (`common/buildings/50_grand_library.txt`):
   - 3 building levels with progression
   - Proper CK3 format with indentation
   - Construction requirements
   - Character and province modifiers
   - AI evaluation logic
   - Comments explaining each section

2. **Localization file** (`localization/english/grand_library_l_english.yml`):
   - UTF-8 with BOM encoding (required by CK3)
   - Localization keys for each building level
   - Auto-generated descriptions

## Development

```bash
# Run in development mode
npm run dev building -- --name test --levels 2

# Build
npm run build

# Test
npm test
```

## Project Structure

```
ck3-tools/
├── src/
│   ├── cli.ts                     # CLI entry point
│   ├── common/
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── formatter.ts          # CK3 format output
│   │   └── template-engine.ts    # Template loader & processor ✨
│   ├── generator/
│   │   ├── template-based.ts     # Template-based generator ✨
│   │   ├── buildings.ts          # Legacy building generator
│   │   ├── traits.ts             # Trait generator (stub)
│   │   └── decisions.ts          # Decision generator (stub)
│   └── validator/                # Validation tools (coming soon)
├── templates/                     # YAML templates ✨
│   ├── building/
│   │   ├── economy_building.yml
│   │   └── learning_building.yml
│   ├── trait/                    # (coming soon)
│   └── decision/                 # (coming soon)
└── test-template-output/          # Generated test files
```

## Comparison: Manual vs Generated

### Manual Approach (500+ lines)
```
hospice_01 = {
    construction_time = 730
    cost_gold = 200
    # ... 50 lines ...
}

hospice_02 = {
    construction_time = 730
    cost_gold = 400
    # ... 50 lines ...
}

hospice_03 = {
    construction_time = 730
    cost_gold = 800
    # ... 50 lines ...
}
```

### With ck3gen (1 command)
```bash
ck3gen building --name hospice --levels 3 --base-cost 200
```

**Result**: 90%+ reduction in manual work, zero copy-paste errors!

## Roadmap

### Phase 1: Template Generator (In Progress)
- [x] Building chain generator (legacy mode)
- [x] YAML template system ✨
- [x] Template loader & processor with Handlebars
- [x] Economy building template
- [x] Learning building template
- [ ] Trait variant generator
- [ ] Decision generator
- [ ] More building templates (military, religious, special)
- [ ] Interactive mode with prompts
- [ ] Config file support (ck3gen.config.json)

### Phase 2: Validator
- [ ] Syntax validation
- [ ] Reference checking
- [ ] Localization coverage
- [ ] Scope validation

### Phase 3: VS Code Extension
- [ ] Syntax highlighting
- [ ] Inline validation
- [ ] Hover tooltips
- [ ] Code snippets

## License

MIT

## Contributing

This is currently a personal tool for CK3 modding. Contributions welcome but not expected.
