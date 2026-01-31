# Buildings

Buildings represent structures that can be constructed in holdings (provinces) to provide various bonuses.

## File Location

`common/buildings/*.txt`

## Basic Structure

```
building_name = {
    # Construction
    construction_time = 720  # Days

    # Requirements
    can_construct = { }
    can_construct_showing_failures_only = { }
    can_construct_potential = { }

    # Cost
    cost_gold = 500

    # Effects
    levy = 200
    character_modifier = { }
    province_modifier = { }

    # Chain
    next_building = building_name_02

    # AI
    ai_value = { }
}
```

## Core Properties

### type

Specifies building category:

```
type = regular          # Default, can be built in most holdings
type = special          # Unique buildings for specific locations
type = duchy_capital    # Only in duchy capitals
```

### construction_time

Build time in days:

```
construction_time = 720  # 720 days (2 years)
```

Often uses a named value:
```
construction_time = standard_construction_time
```

### Military Properties

#### levy

Number of levies the building provides:

```
levy = 200
```

#### max_garrison

Garrison size for sieges:

```
max_garrison = 100
```

#### garrison_reinforcement_factor

Monthly garrison refill rate (0-1):

```
garrison_reinforcement_factor = 0.01  # 1% per month
```

## Construction Requirements

Three trigger blocks control when buildings can be built:

### can_construct_potential

Whether the building appears in the build menu at all:

```
can_construct_potential = {
    # Must be a castle, city, or church
    OR = {
        has_building = castle_01
        has_building = city_01
        has_building = church_01
    }
}
```

### can_construct_showing_failures_only

Shows only failures - for temporary conditions players can overcome:

```
can_construct_showing_failures_only = {
    building_requirement_tribal = no  # Not tribal
}
```

### can_construct

Shows both filled and missing requirements:

```
can_construct = {
    building_requirement_castle_city_church = { LEVEL = 02 }
    culture = {
        has_innovation = innovation_windmills
    }
}
```

All three must evaluate to true to construct the building.

### is_enabled

Controls whether the building provides its effects:

```
is_enabled = {
    scope:holder = {
        has_culture_parameter = some_parameter
    }
}
```

If disabled, the building provides no bonuses (but can use fallback modifiers).

### show_disabled

Whether disabled buildings still appear in menus:

```
show_disabled = yes
```

## Costs

### Scripted Costs

```
cost_gold = 500
cost_prestige = 100
```

Often uses named values:
```
cost_gold = normal_building_tier_1_cost
```

You can also use a block for complex costs:
```
cost = {
    gold = 500
    prestige = 100
}
```

## Modifiers

Buildings apply modifiers at different scopes:

### character_modifier

Applied to the holder of the barony:

```
character_modifier = {
    monthly_piety = 0.1
    diplomacy = 1
}
```

### province_modifier

Applied to the province:

```
province_modifier = {
    monthly_income = 0.5
    levy_size = 100
    garrison_size = 50
    epidemic_resistance = 5
}
```

### county_modifier

Applied to the entire county:

```
county_modifier = {
    development_growth = 0.1
    tax_mult = 0.05
}
```

All provinces in the county can stack county modifiers.

### county_holder_character_modifier

Applied to the character who holds the county title:

```
county_holder_character_modifier = {
    monthly_prestige = 0.2
}
```

### duchy_capital_county_modifier

Applied to all de jure counties in the duchy (duchy capital buildings only):

```
duchy_capital_county_modifier = {
    levy_size = 50
    development_growth = 0.05
}
```

## Conditional Modifiers

### Culture-Based Modifiers

#### character_culture_modifier

Applied to holder if their culture has the parameter:

```
character_culture_modifier = {
    parameter = culture_values_learning
    monthly_piety = 0.05
}
```

#### province_culture_modifier

Applied to province if county culture has the parameter:

```
province_culture_modifier = {
    parameter = seafaring_culture
    levy_size = 25
}
```

#### county_culture_modifier

Applied to county if county culture has the parameter:

```
county_culture_modifier = {
    parameter = agricultural_culture
    development_growth = 0.1
}
```

#### duchy_capital_county_culture_modifier

For duchy capitals, applied to all de jure counties if they have the parameter:

```
duchy_capital_county_culture_modifier = {
    parameter = administrative_culture
    tax_mult = 0.05
}
```

### Faith-Based Modifiers

Similar structure to culture modifiers:

```
character_faith_modifier = {
    parameter = eastern_hostility_active
    monthly_prestige = 0.1
}

province_faith_modifier = {
    parameter = faith_values_piety
    monthly_income = 0.05
}

county_faith_modifier = {
    parameter = faith_values_learning
    development_growth = 0.05
}
```

### Dynasty-Based Modifiers

Applied if county holder's dynasty has the specified perk:

```
character_dynasty_modifier = {
    county_holder_dynasty_perk = fp2_urbanism_legacy_1
    stewardship = 1
}

province_dynasty_modifier = {
    county_holder_dynasty_perk = fp2_urbanism_legacy_1
    monthly_income = 0.1
}

county_dynasty_modifier = {
    county_holder_dynasty_perk = fp2_urbanism_legacy_1
    development_growth = 0.1
}
```

### Government-Based Modifiers

Applied if holder's government has the parameter:

```
character_government_modifier = {
    parameter = government_is_mandala
    monthly_piety = 0.01
}

province_government_modifier = {
    parameter = government_is_theocracy
    tax_mult = 0.05
}
```

### Terrain-Based Modifiers

Applied to provinces matching terrain criteria:

```
province_terrain_modifier = {
    parameter = culture_parameter     # Optional
    terrain = farmlands                # Optional terrain type
    is_coastal = yes                   # Optional: yes/no/not specified
    is_riverside = yes                 # Optional: yes/no/not specified

    monthly_income = 0.2
}
```

### Situation-Based Modifiers

Applied if county is involved in a situation with the specified parameter:

```
character_situation_modifier = {
    parameter = situation_parameter
    diplomacy = 1
}

province_situation_modifier = {
    parameter = situation_parameter
    levy_size = 50
}

county_situation_modifier = {
    parameter = situation_parameter
    development_growth = 0.1
}
```

### Holding-Type Modifiers

Special modifier for specific holding types in the county:

```
county_holding_modifier = {
    holding = castle_holding    # or city_holding, church_holding, tribal_holding
    income_mult = 1
}
```

### Fallback Modifiers

Applied when the building is disabled:

```
fallback = {
    character_modifier = {
        monthly_piety = 0.05  # Reduced bonus when disabled
    }
}
```

## Building Chains

### next_building

The next upgrade in the building chain:

```
hospices_01 = {
    # ...
    next_building = hospices_02
}

hospices_02 = {
    # ...
    next_building = hospices_03
}
```

### great_project_type

Links building to a great project upgrade path:

```
great_project_type = grand_building_project_this_tier
```

## Visual and Audio

### asset

Defines the 3D asset and illustration:

```
asset = {
    # Type: pdxmesh (preferred, more performant) or entity
    type = pdxmesh

    # Asset name(s)
    name = "western_castle_01_level_03_mesh"

    # Or multiple for randomization
    names = {
        "western_castle_01_level_03a_mesh"
        "western_castle_01_level_03b_mesh"
    }

    # County view illustration
    illustration = "gfx/interface/illustrations/buildings/castle_03.dds"

    # Sound effect
    soundeffect = {
        soundeffect = "event:/SFX/Ambience/3DMapEmitters/Holdings/Generic/sfx_amb_3d_holdings_generic_castle_01"
        soundparameter = { "Tier" = 2.0 }
    }

    # Visual preferences
    governments = { tribal_government }
    provinces = { 496 1000 }
    graphical_regions = { graphical_mena graphical_mediterranean }
    graphical_cultures = { western_building_gfx }
    graphical_faiths = { catholic_gfx }

    # DLC requirement
    requires_dlc_flag = the_northern_lords
}
```

### type_icon

Icon shown in the building menu:

```
type_icon = "icon_building_hospice.dds"
```

Path: `gfx/interface/icons/buildings/`

### is_graphical_background

Whether building affects background graphics (walls, etc.):

```
is_graphical_background = yes
```

AI skips these buildings.

## Events

Effects triggered during construction:

```
on_start = {
    # Triggered when construction starts
    scope:character = {
        add_prestige = -10
    }
}

on_cancelled = {
    # Triggered if construction is cancelled
    scope:character = {
        add_prestige = 5
    }
}

on_complete = {
    # Triggered when construction completes
    scope:character = {
        trigger_event = building_complete.0001
    }
}
```

Available scopes:
- `root` - The province
- `scope:character` - Character who paid for construction
- `scope:holding` - The holding type

## AI Behavior

### ai_value

Mean Time To Happen (MTTH) structure for AI priority:

```
ai_value = {
    base = 100

    # Add values
    modifier = {
        add = 50
        gold > 1000
    }

    # Multiply
    modifier = {
        factor = 2
        is_ambitious = yes
    }

    # Disable completely
    modifier = {
        factor = 0
        is_at_war = yes
    }
}
```

AI behavior:
1. Lists all buildable buildings
2. Calculates ai_value for each
3. Discards buildings not within 20% of the top score
4. Randomly selects from remaining
5. Builds if affordable, otherwise saves for it

Warning: Expensive buildings with high ai_value can lock AI into saving forever.

### Flags

Custom flags for triggers:

```
flag = castle
flag = income_building
```

Can be checked with: `has_building_with_flag = castle`

## Complete Example

```
grand_library_01 = {
    # Construction
    construction_time = standard_construction_time

    # Requirements
    can_construct_potential = {
        building_requirement_castle_city_church = { LEVEL = 01 }
    }

    can_construct_showing_failures_only = {
        building_requirement_tribal = no
    }

    can_construct = {
        culture = {
            has_innovation = innovation_city_planning
        }
        scope:holder = {
            learning >= 15
        }
    }

    # Cost
    cost_gold = expensive_building_tier_1_cost

    # Effects
    character_modifier = {
        monthly_piety = 0.2
        learning = 1
    }

    province_modifier = {
        monthly_income = 0.3
    }

    county_modifier = {
        development_growth = 0.15
    }

    # Culture bonus
    character_culture_modifier = {
        parameter = culture_values_learning
        learning = 1
    }

    # Faith bonus
    county_faith_modifier = {
        parameter = faith_values_learning
        development_growth = 0.05
    }

    # Chain
    next_building = grand_library_02

    # Visual
    type_icon = "icon_building_library.dds"

    # Flags
    flag = learning_building

    # Events
    on_complete = {
        scope:character = {
            trigger_event = library_events.0001
        }
    }

    # AI
    ai_value = {
        base = 20

        modifier = {
            add = 30
            scope:holder = {
                learning >= 15
            }
        }

        modifier = {
            factor = 2
            county.development_level >= 15
        }

        modifier = {
            factor = 0
            free_building_slots > 0  # Build other buildings first
        }
    }
}
```

## Scopes in Building Scripts

- `root` - The province where the building is located
- `scope:holder` - Holder of the barony title
- `scope:county` - The county title the province belongs to
- `scope:character` - (In events) The character who paid for construction
- `scope:holding` - (In events) The holding type

## Testing Buildings

Console commands:
```
add_building <building_name>           # Add building to selected province
add_building_slot                      # Add building slot
set_county_faith <faith>               # Test faith modifiers
set_county_culture <culture>          # Test culture modifiers
```

## Info File Reference

See `common/buildings/_buildings.info` in the game files for the complete official documentation.
