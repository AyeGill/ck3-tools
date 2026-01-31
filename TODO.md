# CK3 Tools TODO

## Project Overview

Building practical tooling for CK3 modding to reduce boilerplate, catch errors early, and streamline workflows.

**Approach**: Enhanced tooling for existing CK3 format (not a new language)
**Tech Stack**: TypeScript/Node for portability and VS Code integration

---

## Phase 1: Template Generator (Weeks 1-3)

### Week 1: Core Infrastructure ✅ DONE
- [x] Set up TypeScript project with npm
- [x] Add CLI framework (Commander)
- [x] Create CK3 output formatter
- [x] Implement building chain generator
- [x] Test with real example (grand_library)
- [x] Generate localization with UTF-8 BOM

### Week 2: Template System & Building Enhancements (IN PROGRESS)

#### Template System Architecture
- [ ] Factor out building details into template .yml files
  - [ ] Create `templates/` directory structure
  - [ ] Design template YAML format (parameters, structure, defaults)
  - [ ] Implement template loader/parser
  - [ ] Support custom user templates

#### Better Template Input Methods
Instead of just command-line options:
- [ ] Interactive prompts for missing parameters (inquirer.js)
- [ ] Configuration file support (ck3gen.config.json)
- [ ] Template presets (economy_building, military_building, etc.)
- [ ] Web UI for template configuration (optional, future)

#### Building Generator Enhancements
- [ ] Add more building type templates:
  - [ ] Economy buildings (farms, mines, markets)
  - [ ] Military buildings (barracks, walls)
  - [ ] Religious buildings (temples, monasteries)
  - [ ] Special buildings (wonders, unique)
- [ ] Support for conditional modifiers:
  - [ ] Culture-specific bonuses
  - [ ] Faith-specific bonuses
  - [ ] Terrain-specific effects
- [ ] Add duchy capital buildings option
- [ ] Customizable AI weights

### Week 3: Trait & Decision Generators
- [ ] Implement trait variant generator
  - [ ] Education traits with levels
  - [ ] Personality traits
  - [ ] Commander traits
  - [ ] Genetic traits with inheritance
- [ ] Implement decision generator
  - [ ] Major/minor decisions
  - [ ] Cost structures
  - [ ] Validation triggers
  - [ ] Effect blocks with events
- [ ] Create templates for:
  - [ ] Traits (personality, education, lifestyle, health)
  - [ ] Decisions (realm, character, diplomatic)
  - [ ] Events (character_event, province_event, etc.)
  - [ ] Schemes (intrigue actions)

---

## Phase 2: Validation Tool (Weeks 4-5)

### Week 4: Parser & Basic Validation
- [ ] Implement CK3 format lexer
  - [ ] Tokenize key-value pairs
  - [ ] Handle nested blocks
  - [ ] Parse comments and variables (@variable)
- [ ] Build AST (Abstract Syntax Tree)
- [ ] Create symbol table of all defined objects
- [ ] Implement reference checking:
  - [ ] Undefined traits referenced
  - [ ] Undefined buildings referenced
  - [ ] Undefined innovations/technologies
  - [ ] Missing next_building in chains
- [ ] Localization validation:
  - [ ] Missing localization keys
  - [ ] Unused localization keys
  - [ ] UTF-8 BOM encoding check
- [ ] CLI: `ck3validate my_mod/`

### Week 5: Semantic Validation
- [ ] Scope tracking system:
  - [ ] Track scope chains (character → province → county)
  - [ ] Validate scope transitions
  - [ ] Warn on invalid property access
- [ ] Property validation:
  - [ ] Check character properties used on character scope
  - [ ] Check province properties used on province scope
  - [ ] Validate modifier types (character_modifier vs province_modifier)
- [ ] Parameter validation for scripted effects:
  - [ ] Validate $PARAMETER$ usage
  - [ ] Check parameter types
  - [ ] Warn on undefined parameters
- [ ] Common error patterns:
  - [ ] Mismatched braces
  - [ ] Invalid operator usage
  - [ ] Typos in common keywords
- [ ] Output formats:
  - [ ] Human-readable error messages
  - [ ] JSON output for tooling integration
  - [ ] VS Code problem format

---

## Phase 3: VS Code Extension (Weeks 6-7)

### Week 6: Basic Extension
- [ ] Set up VS Code extension project
- [ ] Implement TextMate grammar:
  - [ ] Keywords (trigger, effect, modifier, etc.)
  - [ ] Operators (=, >, <, >=, <=)
  - [ ] Scopes (scope:, root, this, prev)
  - [ ] Variables (@variable)
  - [ ] Comments
- [ ] Language configuration:
  - [ ] Bracket matching
  - [ ] Auto-closing pairs
  - [ ] Comment toggling
- [ ] Code snippets:
  - [ ] Building template
  - [ ] Trait template
  - [ ] Decision template
  - [ ] Modifier blocks
  - [ ] Trigger blocks

### Week 7: Enhanced Features
- [ ] Integrate ck3validate as LSP:
  - [ ] Run validation on file save
  - [ ] Display diagnostics inline
  - [ ] Show errors/warnings in Problems panel
- [ ] Hover providers:
  - [ ] Localization preview (hover over key → show text)
  - [ ] Scope information (hover → show current scope type)
  - [ ] Property documentation (hover → show what property does)
- [ ] Code actions:
  - [ ] "Generate localization for this item"
  - [ ] "Go to localization for this item"
  - [ ] "Extract to variable" (@variable)
  - [ ] "Invoke template system" (right-click → generate building)
- [ ] Scope hints (inline decorations):
  - [ ] Show current scope as inline hint
  - [ ] Breadcrumb trail for nested scopes

---

## Template System Details

### Template File Format (YAML)

```yaml
# templates/building/economy_building.yml
name: economy_building
description: Standard economy building with income focus
category: building
version: 1.0

parameters:
  name:
    type: string
    required: true
    description: Building base name

  levels:
    type: integer
    default: 3
    min: 1
    max: 8
    description: Number of building levels

  base_cost:
    type: integer
    default: 200
    description: Base construction cost in gold

  cost_scaling:
    type: float
    default: 2.0
    description: Multiplier for each level

  income_type:
    type: enum
    values: [tax, trade, production]
    default: tax
    description: Type of income generation

structure:
  construction_time: 730

  can_construct_potential:
    building_requirement_castle_city_church:
      LEVEL: "{{ level_requirement }}"

  can_construct_showing_failures_only:
    building_requirement_tribal: no

  cost_gold: "{{ base_cost * (cost_scaling ^ (level - 1)) }}"

  character_modifier:
    monthly_piety: "{{ 0.05 * level }}"

  province_modifier:
    monthly_income: "{{ 0.1 * level }}"
    levy_size: "{{ 50 * level }}"

  ai_value:
    base: "{{ 15 - level }}"
    modifiers:
      - condition: "scope:holder = { gold >= 500 }"
        add: 20
      - condition: "scope:holder = { is_at_war = yes }"
        factor: 0.1

localization:
  name_template: "{{ tier }} {{ formatted_name }}"
  desc_template: "A {{ tier_lower }} building that generates {{ income_type }}."
```

### Template Usage

```bash
# Use built-in template
ck3gen building --template economy_building --name market --levels 3

# Interactive mode
ck3gen building --interactive

# From config file
ck3gen build --config my_mod.json

# Custom template
ck3gen building --template ./my_templates/custom.yml --name foo
```

### Configuration File Support

```json
// ck3gen.config.json
{
  "outputPath": "./my-mod",
  "templates": {
    "directory": "./templates",
    "defaults": {
      "building": {
        "levels": 3,
        "cost_scaling": 2.0
      }
    }
  },
  "buildings": [
    {
      "template": "economy_building",
      "name": "marketplace",
      "levels": 4,
      "income_type": "trade"
    },
    {
      "template": "military_building",
      "name": "barracks",
      "levels": 3
    }
  ]
}
```

---

## Future Enhancements (Post-MVP)

### Generator Features
- [ ] Event chain generator
- [ ] Scripted effects/triggers generator
- [ ] Culture/religion templates
- [ ] Character template generator
- [ ] Dynasty generator

### Validation Features
- [ ] Performance analysis (check modifier stacking)
- [ ] Balance checker (compare to base game values)
- [ ] Mod compatibility checker
- [ ] AI behavior analysis

### IDE Features
- [ ] Refactoring tools:
  - [ ] Rename symbol across files
  - [ ] Extract to scripted effect
  - [ ] Inline variable
- [ ] Visual editors:
  - [ ] Building chain visualizer
  - [ ] Event tree visualizer
  - [ ] Decision flow diagram
- [ ] Testing support:
  - [ ] Unit test framework for triggers
  - [ ] Mock game state for testing
  - [ ] Test coverage reporting

### Distribution
- [ ] Publish to npm: `npm install -g ck3gen`
- [ ] Publish VS Code extension to marketplace
- [ ] Create documentation website
- [ ] Video tutorials

---

## Development Notes

### Completed
- ✅ TypeScript project setup
- ✅ CLI with Commander
- ✅ CK3 output formatter with proper indentation
- ✅ Building chain generator (working!)
- ✅ UTF-8 BOM localization generation
- ✅ Test output validated

### Current Focus
- Template system architecture
- Better input methods beyond CLI flags
- Trait and decision generators

### Key Decisions
- **Why TypeScript**: Better VS Code integration, npm distribution, can share code between CLI and extension
- **Why YAML for templates**: Human-readable, widely supported, good for config
- **Why not Rust**: Performance not critical, portability matters more

### Testing Strategy
- Generate code → Load in CK3 → Check error.log
- Compare generated output to hand-written examples
- Validate that localization keys match
- Test with real mod workflows