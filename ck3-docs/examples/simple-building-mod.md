# Example: Simple Building Mod

This example demonstrates creating a new building chain for holdings.

## Mod Structure

```
my_building_mod/
├── common/
│   └── buildings/
│       └── 50_my_buildings.txt
└── localization/
    └── english/
        └── my_buildings_l_english.yml
```

## descriptor.mod

```
name = "Simple Building Example"
version = "1.0.0"
tags = { "Gameplay" "Buildings" }
supported_version = "1.12.*"
path = "mod/my_building_mod"
```

## common/buildings/50_my_buildings.txt

```
# Variables for consistency
@build_time = 730  # ~2 years
@tier1_cost = 200
@tier2_cost = 300
@tier3_cost = 500

### Alchemist Laboratory Building Chain
# Provides learning bonuses and gold income

alchemist_lab_01 = {
    # Construction time
    construction_time = @build_time

    # Can be built in castle, city, or temple holdings
    can_construct_potential = {
        building_requirement_castle_city_church = { LEVEL = 01 }
    }

    # Not available for tribal
    can_construct_showing_failures_only = {
        building_requirement_tribal = no
    }

    # Requirements
    can_construct = {
        # Culture must have innovation
        culture = {
            has_innovation = innovation_city_planning
        }
    }

    # Cost
    cost_gold = @tier1_cost

    # Effects on the holder
    character_modifier = {
        monthly_piety = 0.1
        learning = 1
    }

    # Effects on the province
    province_modifier = {
        monthly_income = 0.3
        stationed_maa_toughness_mult = 0.01  # Slightly healthier troops
    }

    # Bonus for learning cultures
    character_culture_modifier = {
        parameter = culture_values_learning
        learning = 1
    }

    # Next in chain
    next_building = alchemist_lab_02

    # Icon
    type_icon = "icon_building_alchemist.dds"

    # Flags for triggers
    flag = learning_building
    flag = income_building

    # AI behavior
    ai_value = {
        base = 15

        # AI likes it more if they value learning
        modifier = {
            add = 25
            scope:holder = {
                learning >= 12
            }
        }

        # AI likes it in developed counties
        modifier = {
            add = 10
            county.development_level >= 15
        }

        # Don't build if at war
        modifier = {
            factor = 0.1
            scope:holder = {
                is_at_war = yes
            }
        }

        # Fill building slots first before upgrading
        modifier = {
            factor = 0.25
            free_building_slots > 0
        }
    }

    # Event when completed
    on_complete = {
        # Notify the holder
        scope:character = {
            send_interface_toast = {
                type = event_generic_neutral
                title = alchemist_lab_complete_toast
                left_icon = scope:character

                custom_tooltip = alchemist_lab_01_complete_effect
            }
        }
    }
}

alchemist_lab_02 = {
    construction_time = @build_time

    can_construct_potential = {
        building_requirement_castle_city_church = { LEVEL = 01 }
    }

    can_construct_showing_failures_only = {
        building_requirement_tribal = no
    }

    can_construct = {
        culture = {
            has_innovation = innovation_manorialism
        }
    }

    cost_gold = @tier2_cost

    character_modifier = {
        monthly_piety = 0.2
        learning = 2
    }

    province_modifier = {
        monthly_income = 0.5
        stationed_maa_toughness_mult = 0.02
        epidemic_resistance = 5  # Helps with disease
    }

    character_culture_modifier = {
        parameter = culture_values_learning
        learning = 1
        monthly_prestige = 0.1
    }

    next_building = alchemist_lab_03

    type_icon = "icon_building_alchemist.dds"

    flag = learning_building
    flag = income_building

    ai_value = {
        base = 12

        modifier = {
            add = 20
            scope:holder = {
                learning >= 14
            }
        }

        modifier = {
            add = 15
            county.development_level >= 20
        }

        modifier = {
            factor = 0.1
            scope:holder = {
                is_at_war = yes
            }
        }

        modifier = {
            factor = 0.25
            free_building_slots > 0
        }
    }

    on_complete = {
        scope:character = {
            send_interface_toast = {
                type = event_generic_good
                title = alchemist_lab_upgrade_toast
                left_icon = scope:character

                custom_tooltip = alchemist_lab_02_complete_effect
            }
        }
    }
}

alchemist_lab_03 = {
    construction_time = @build_time

    can_construct_potential = {
        building_requirement_castle_city_church = { LEVEL = 02 }
    }

    can_construct_showing_failures_only = {
        building_requirement_tribal = no
    }

    can_construct = {
        culture = {
            has_innovation = innovation_windmills
        }
    }

    cost_gold = @tier3_cost

    character_modifier = {
        monthly_piety = 0.3
        learning = 3
    }

    province_modifier = {
        monthly_income = 0.8
        stationed_maa_toughness_mult = 0.03
        epidemic_resistance = 10
    }

    # County-wide effect
    county_modifier = {
        development_growth = 0.05
    }

    character_culture_modifier = {
        parameter = culture_values_learning
        learning = 2
        monthly_prestige = 0.2
    }

    # Faith bonus for certain doctrines
    character_faith_modifier = {
        parameter = faith_values_learning
        monthly_piety = 0.1
    }

    type_icon = "icon_building_alchemist.dds"

    flag = learning_building
    flag = income_building

    ai_value = {
        base = 10

        modifier = {
            add = 30
            scope:holder = {
                learning >= 16
            }
        }

        modifier = {
            add = 20
            county.development_level >= 25
        }

        modifier = {
            factor = 0.1
            scope:holder = {
                is_at_war = yes
            }
        }

        modifier = {
            factor = 0.25
            free_building_slots > 0
        }
    }

    on_complete = {
        scope:character = {
            send_interface_toast = {
                type = event_generic_good
                title = alchemist_lab_master_toast
                left_icon = scope:character

                custom_tooltip = alchemist_lab_03_complete_effect

                # Small chance of gaining a trait
                random = {
                    chance = 10
                    custom_tooltip = alchemist_lab_trait_chance
                    hidden_effect = {
                        if = {
                            limit = {
                                NOT = { has_trait = scholar }
                            }
                            add_trait = scholar
                        }
                    }
                }
            }
        }
    }
}
```

## localization/english/my_buildings_l_english.yml

```yaml
l_english:
 building_alchemist_lab_01:0 "Alchemist Laboratory"
 building_alchemist_lab_01_desc:0 "A workspace for studying alchemical processes and natural philosophy."
 building_alchemist_lab_02:0 "Advanced Alchemist Laboratory"
 building_alchemist_lab_02_desc:0 "An expanded laboratory with better equipment for advanced research."
 building_alchemist_lab_03:0 "Master Alchemist Laboratory"
 building_alchemist_lab_03_desc:0 "A prestigious research facility that attracts scholars from across the realm."

 alchemist_lab_complete_toast:0 "Alchemist Laboratory Complete"
 alchemist_lab_upgrade_toast:0 "Laboratory Upgraded"
 alchemist_lab_master_toast:0 "Master Laboratory Complete"

 alchemist_lab_01_complete_effect:0 "Your new laboratory begins producing valuable insights."
 alchemist_lab_02_complete_effect:0 "The expanded laboratory enables more advanced research."
 alchemist_lab_03_complete_effect:0 "Your master laboratory attracts the finest minds in the realm."
 alchemist_lab_trait_chance:0 "Small chance of gaining scholarly insights from the research."
```

## Testing

### In-Game Testing

1. Enable mod in launcher
2. Start or load a game
3. Select a province
4. Open the buildings menu
5. Look for "Alchemist Laboratory"
6. Build it and check effects

### Console Commands

```
add_building alchemist_lab_01        # Add building to selected province
add_building_slot                    # Add a building slot if needed
set_development 20                   # Set development for testing AI
add_innovation innovation_city_planning  # Add required innovation
```

### Check Logs

- `error.log` - Building script errors
- `database_conflicts.log` - Conflicts with other mods

## Extending the Example

### Add Special Location Building

```
grand_alchemist_academy = {
    # Special building for specific province
    type = special

    # Only in specific province
    can_construct_potential = {
        baronial_title = { this = title:b_alexandria }  # Example
    }

    # ... rest of definition ...

    # Much stronger effects
    character_modifier = {
        learning = 5
        monthly_prestige = 1.0
    }

    county_modifier = {
        development_growth = 0.2
    }
}
```

### Add Duchy Capital Building

```
ducal_alchemist_guild = {
    # Only for duchy capitals
    type = duchy_capital

    # ... requirements ...

    # Affects all counties in duchy
    duchy_capital_county_modifier = {
        development_growth = 0.1
        monthly_income = 0.5
    }
}
```

### Add Terrain-Specific Bonus

```
alchemist_lab_01 = {
    # ... existing properties ...

    # Bonus near mountains (better minerals)
    province_terrain_modifier = {
        terrain = mountains
        monthly_income = 0.2
    }

    # Bonus near rivers (water access)
    province_terrain_modifier = {
        is_riverside = yes
        development_growth = 0.05
    }
}
```

### Add Holding-Type Bonus

```
alchemist_lab_01 = {
    # ... existing properties ...

    # Bonus to all temples in the county
    county_holding_modifier = {
        holding = church_holding
        monthly_income = 0.1
    }
}
```

## Common Issues

### Building doesn't appear
- Check `can_construct_potential` is satisfied
- Verify holding level requirements
- Ensure innovation requirements are met

### Building has no effects
- Check `is_enabled` trigger (if present)
- Verify modifier syntax
- Check error.log for warnings

### AI never builds it
- Increase `ai_value` base
- Simplify or remove restricting modifiers
- Test with AI character using console

### Cost seems wrong
- Remember to use `cost_gold =` not `cost = { gold = }`
- Check that variables are defined
- Verify no typos in variable names

## Best Practices

1. **Use variables** for consistent values across tiers
2. **Number prefixes** - Use 50+ to load after base game
3. **Incremental bonuses** - Each tier should be noticeably better
4. **AI tuning** - Test that AI builds at reasonable rates
5. **Balance** - Compare to base game buildings for cost/benefit ratio
6. **Clear requirements** - Make innovation/level requirements obvious
7. **Thematic consistency** - Match the game's medieval setting
