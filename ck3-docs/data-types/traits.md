# Traits

Traits represent character characteristics in CK3. They can be inherited, gained through events, or acquired through gameplay.

## File Location

`common/traits/*.txt`

## Basic Structure

```
trait_name = {
    # Basic properties
    category = personality
    minimum_age = 16

    # Visual
    icon = "gfx/interface/icons/traits/my_trait.dds"

    # Modifiers
    diplomacy = 2
    monthly_prestige = 0.1

    # AI
    ai_value = 100
}
```

## Properties

### Basic Properties

#### category (required)

Defines the trait's category. Valid categories:

- `personality` - Core personality traits (generated with characters)
- `education` - Education traits (one per character, acquired at age 16)
- `childhood` - Child personality traits (grow into adult traits)
- `commander` - Combat leadership traits
- `winter_commander` - Winter-specific commander traits
- `lifestyle` - Lifestyle progress traits
- `court_type` - Royal court type traits
- `fame` - Fame/prestige traits
- `health` - Health conditions

Example:
```
ambitious = {
    category = personality
    opposites = { content }
    # ...
}
```

#### minimum_age / maximum_age

Age restrictions for the trait:

```
education_intrigue_1 = {
    minimum_age = 16  # Can only have at age 16+
    # ...
}
```

### Validation and Restrictions

#### valid_sex

Restrict trait to specific sex:

```
valid_sex = male    # or female, or all (default)
```

#### potential

Trigger that must be met for the trait to be assigned. Only checked when adding the trait:

```
potential = {
    is_adult = yes
    NOT = { has_trait = opposite_trait }
}
```

### Flags and Special Behaviors

#### genetic

Makes the trait inheritable genetically:

```
genetic = yes
```

Genetic inheritance rules:
- Trait can be active or inactive
- Active trait: 100% inheritance chance
- Inactive trait: 50% inheritance chance
- If inherited from both parents: becomes active
- If inherited from one parent: stays inactive

#### good

Marks a genetic trait as positive:

```
genetic = yes
good = yes
```

#### physical

Indicates the trait represents a physical characteristic:

```
physical = yes
```

#### incapacitating

Character cannot rule directly and requires a regent:

```
incapacitating = yes
```

#### immortal

Prevents aging and natural death:

```
immortal = yes
```

#### disables_combat_leadership

Prevents the character from being a commander:

```
disables_combat_leadership = yes
```

#### can_have_children

Controls fertility:

```
can_have_children = no
```

#### enables_inbred

Enables risk of inbred children:

```
enables_inbred = yes
```

### Inheritance

#### inherit_chance

Manual inheritance percentage (0-100). Cannot be used with genetic traits:

```
inherit_chance = 50
both_parent_has_trait_inherit_chance = 75
```

#### parent_inheritance_sex / child_inheritance_sex

Control which parents can pass it and which children can receive it:

```
parent_inheritance_sex = male    # Only fathers pass it
child_inheritance_sex = female   # Only daughters receive it
```

#### inheritance_blocker

Prevents inheriting titles:

```
inheritance_blocker = all      # or dynasty, or none (default)
```

### Random Generation

#### birth

Chance (0-100) for randomly generated characters to have this trait at birth:

```
birth = 5  # 5% chance
```

#### random_creation

Chance for generated (not born) characters to have this trait:

```
random_creation = 10  # 10% chance
```

#### random_creation_weight

Weight for random selection (used for personality/education/childhood categories):

```
random_creation_weight = 20  # Higher = more common
```

### Localization

#### name / desc / icon

Can be dynamic based on conditions:

```
desc = {
    first_valid = {
        triggered_desc = {
            trigger = {
                NOT = { exists = this }
            }
            desc = trait_ambitious_desc
        }
        triggered_desc = {
            trigger = {
                is_female = yes
            }
            desc = trait_ambitious_female_desc
        }
        desc = trait_ambitious_male_desc
    }
}
```

Default localization keys:
- Name: `trait_<key>`
- Description: `trait_<key>_desc`
- Icon path: `gfx/interface/icons/traits/<trait>.dds`

### Modifiers

#### Direct Modifiers

Applied to anyone with the trait:

```
diplomacy = 2
intrigue = -1
monthly_prestige = 0.5
attraction_opinion = 10
```

#### Conditional Modifiers

##### culture_modifier

Applied if character's culture has specified parameter:

```
culture_modifier = {
    parameter = can_blind_prisoners
    diplomacy = 5
}
```

##### faith_modifier

Applied if character's faith has specified doctrine parameter:

```
faith_modifier = {
    parameter = great_holy_wars_active
    stewardship = 1
}
```

### Portrait Effects

#### genetic_constraint_all / genetic_constraint_men / genetic_constraint_women

Applies genetic constraints from `common/genes/`:

```
genetic_constraint_all = beauty
genetic_constraint_men = male_beauty
genetic_constraint_women = female_beauty
```

#### portrait_extremity_shift

Shifts all morph genes toward extremes (0 or 1):

```
portrait_extremity_shift = 0.25  # Shifts 25% toward nearest extreme
```

### Opinion and Compatibility

#### same_opinion

Opinion modifier between characters who share this trait:

```
same_opinion = 10  # +10 opinion
```

#### same_opinion_if_same_faith

Opinion modifier if both characters have the trait AND same faith:

```
same_opinion_if_same_faith = 20
```

#### opposite_opinion

Opinion modifier if characters have opposite traits:

```
opposite_opinion = -20
```

#### triggered_opinion

Conditional opinion effects:

```
triggered_opinion = {
    opinion_modifier = opinion_witchcraft
    parameter = witchcraft_accepted
    check_missing = yes  # Check parameter is NOT set
    same_faith = yes
}
```

#### compatibility

Used by compatibility calculations (not direct opinion):

```
compatibility = {
    gluttonous = 20
    drunkard = 10
}
```

### Groups and Levels

#### group

Trait group for inheritance and equivalence:

```
group = education_intrigue
level = 1
```

Characters can only have one trait from each group.

#### group_equivalence / group_inheritance

Separate grouping for equivalence only or inheritance only:

```
group_equivalence = personality_bold
group_inheritance = education
```

#### opposites

Traits that cannot coexist:

```
opposites = {
    content
    lazy
}
```

### Leveling and Tracks

Traits can gain XP and provide different bonuses at thresholds:

```
track = {
    20 = {
        diplomacy = 1
    }
    40 = {
        diplomacy = 2
        monthly_prestige = 0.1
    }
    60 = {
        diplomacy = 3
        monthly_prestige = 0.2
    }
}
```

Multiple tracks:

```
tracks = {
    combat_track = {
        30 = { martial = 1 }
        70 = { martial = 2 }
    }
    diplomacy_track = {
        25 = { diplomacy = 1 }
        75 = { diplomacy = 2 }
    }
}
```

Track XP degradation:

```
monthly_track_xp_degradation = {
    min = 20      # Never goes below 20
    change = 5    # Loses 5 per month
}
```

Localization: `trait_track_<key>` and `trait_track_<key>_desc`

### Ruler Designer

#### ruler_designer_cost

Cost in ruler designer points:

```
ruler_designer_cost = 50  # Positive for good traits, negative for bad
```

#### shown_in_ruler_designer

Whether to show in ruler designer:

```
shown_in_ruler_designer = no
```

### Miscellaneous

#### flag

Custom flags for use in triggers:

```
flag = civilian_province
flag = level_1_education
```

Check in triggers: `has_trait_flag = civilian_province`

Localized as: `TRAIT_FLAG_DESC_<flag>`

#### shown_in_encyclopedia

```
shown_in_encyclopedia = no  # Hide from encyclopedia
```

#### culture_succession_prio

Children with this trait are prioritized in succession for cultures with matching parameter:

```
culture_succession_prio = children_can_be_born_in_the_purple
```

## Complete Example

```
brilliant = {
    # Basic setup
    category = personality
    minimum_age = 0

    # Modifiers
    learning = 5
    monthly_prestige = 0.2

    # Only for highly intelligent characters
    potential = {
        OR = {
            has_trait = genius
            learning >= 20
        }
    }

    # Genetic
    genetic = yes
    good = yes
    inherit_chance = 30

    # Opinion effects
    same_opinion = 10
    opposite_opinion = -15

    # Incompatible traits
    opposites = {
        stupid
        dull
    }

    # Group
    group = intelligence
    level = 3

    # Culture-specific bonus
    culture_modifier = {
        parameter = culture_values_learning
        monthly_piety = 0.1
    }

    # Ruler designer
    ruler_designer_cost = 80

    # AI
    ai_value = 100
}
```

## Info File Reference

The base game includes `_traits.info` with complete documentation. Key sections:

1. Localization and icons
2. Trait properties (category, validation, flags)
3. Inheritance (genetic, manual chances)
4. Portrait impacts
5. Opinion impacts
6. Grouping and leveling
7. Modifiers (culture/faith conditional)
8. Miscellaneous properties

## Testing Traits

Console commands for testing:
```
add_trait <trait_name>           # Add trait to selected character
remove_trait <trait_name>        # Remove trait
```

Check logs:
- `error.log` - Syntax errors
- `game.log` - Runtime issues
