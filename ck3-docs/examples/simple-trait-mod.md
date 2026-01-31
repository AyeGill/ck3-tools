# Example: Simple Trait Mod

This example demonstrates creating a basic mod that adds a new character trait.

## Mod Structure

```
my_trait_mod/
├── common/
│   └── traits/
│       └── my_traits.txt
└── localization/
    └── english/
        └── my_traits_l_english.yml
```

## Files

### descriptor.mod

Location: `[CK3 User Dir]/mod/my_trait_mod.mod`

```
name = "Simple Trait Example"
version = "1.0.0"
tags = { "Gameplay" }
supported_version = "1.12.*"
path = "mod/my_trait_mod"
```

### common/traits/my_traits.txt

```
# Define a variable for consistency
@genius_education_bonus = 3

# New trait: Scholar
scholar = {
    # Category
    category = personality

    # Age restriction
    minimum_age = 16

    # Stat bonuses
    learning = @genius_education_bonus
    diplomacy = 1

    # Monthly bonuses
    monthly_piety = 0.2

    # Can be inherited
    inherit_chance = 15

    # Only from parents with high learning
    potential = {
        OR = {
            father = {
                learning >= 12
            }
            mother = {
                learning >= 12
            }
        }
    }

    # Group (can't have multiple from same group)
    group = education_learning

    # Compatibility with other traits
    compatibility = {
        intellect_good_1 = 20
        intellect_good_2 = 30
        intellect_good_3 = 40
        diligent = 15
    }

    # Incompatible traits
    opposites = {
        dull
        slow
    }

    # Culture bonus
    culture_modifier = {
        parameter = culture_values_learning
        monthly_prestige = 0.1
    }

    # Faith bonus
    faith_modifier = {
        parameter = faith_values_learning
        monthly_piety = 0.1
    }

    # Opinion effects
    same_opinion = 10
    opposite_opinion = -20

    # Ruler designer cost
    ruler_designer_cost = 50

    # AI value
    ai_value = 80
}

# Second trait: Quick Learner (childhood trait)
quick_learner = {
    # Childhood trait
    category = childhood

    # Age restrictions
    minimum_age = 3
    maximum_age = 15

    # Bonuses
    learning = 2

    # Random generation
    birth = 5  # 5% chance at birth
    random_creation = 8  # 8% chance for generated children

    # Can be inherited
    genetic = yes
    good = yes

    # Group
    group = childhood_learning

    # Grows into adult trait
    # (This would be handled in education events)

    # Ruler designer (not shown for children)
    shown_in_ruler_designer = no

    # AI value
    ai_value = 60
}
```

### localization/english/my_traits_l_english.yml

**Important**: Must be UTF-8 with BOM encoding!

```yaml
l_english:
 trait_scholar:0 "Scholar"
 trait_scholar_desc:0 "This character has dedicated their life to the pursuit of knowledge, earning respect among the learned."
 trait_quick_learner:0 "Quick Learner"
 trait_quick_learner_desc:0 "This child picks up new concepts with remarkable speed."
```

## Icon Files

Create trait icons at:
- `gfx/interface/icons/traits/scholar.dds`
- `gfx/interface/icons/traits/quick_learner.dds`

If icons are missing, the game will use a default icon and log a warning.

## Testing

1. Copy files to your mod directory
2. Enable the mod in the CK3 launcher
3. Start a new game
4. Open the console (`)
5. Type: `add_trait scholar`
6. Check that the trait appears with correct effects

## Console Commands for Testing

```
add_trait scholar              # Add the scholar trait
remove_trait scholar           # Remove the scholar trait
add_trait quick_learner        # Add quick learner to a child
```

## Common Issues

### Trait doesn't appear
- Check `error.log` for syntax errors
- Verify file encoding (data files: UTF-8, localization: UTF-8 with BOM)
- Ensure file is in correct directory
- Check that `.mod` file points to correct path

### No icon
- Icon path: `gfx/interface/icons/traits/<trait_key>.dds`
- Or specify in trait: `icon = "gfx/path/to/icon.dds"`

### Inheritance not working
- Check `potential` trigger isn't too restrictive
- Verify `inherit_chance` is set (or `genetic = yes`)
- Test with console: have parent add trait, then have children

### Opposites conflict
- If a character has an opposite trait, new trait can't be added
- Use `remove_trait` first or avoid opposites

## Extending the Example

### Add Levels

Create a trait group with levels:

```
scholar_1 = {
    category = lifestyle
    group = scholar_group
    level = 1
    learning = 1
    # ...
}

scholar_2 = {
    category = lifestyle
    group = scholar_group
    level = 2
    learning = 2
    # ...
}

scholar_3 = {
    category = lifestyle
    group = scholar_group
    level = 3
    learning = 3
    # ...
}
```

### Add Tracks for XP

```
scholar = {
    # ... other properties ...

    track = {
        # At 0 XP
        0 = {
            learning = 1
        }
        # At 25 XP
        25 = {
            learning = 2
        }
        # At 50 XP
        50 = {
            learning = 3
            monthly_piety = 0.1
        }
        # At 75 XP
        75 = {
            learning = 4
            monthly_piety = 0.2
        }
    }
}
```

Use in effects: `add_trait_xp = { trait = scholar track = scholar value = 10 }`

### Add Dynamic Description

```
scholar = {
    # ... other properties ...

    desc = {
        first_valid = {
            triggered_desc = {
                trigger = {
                    NOT = { exists = this }
                }
                desc = trait_scholar_desc
            }
            triggered_desc = {
                trigger = {
                    learning >= 20
                }
                desc = trait_scholar_master_desc
            }
            desc = trait_scholar_default_desc
        }
    }
}
```

Add to localization:
```yaml
 trait_scholar_master_desc:0 "A true master of their field, this character's knowledge is unparalleled."
 trait_scholar_default_desc:0 "This character has dedicated their life to learning."
```
