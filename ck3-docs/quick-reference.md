# CK3 Scripting Quick Reference

A quick reference guide for the most commonly used syntax and patterns in CK3 modding.

## Basic Syntax

```
# Comments start with #
key = value
key = "string value"
key = 123

# Variables (defined at top of file)
@variable_name = value

# Blocks
object_name = {
    property = value
    nested = {
        more_properties = value
    }
}
```

## Data Types

```
# Integer
age = 25

# Float
multiplier = 1.5

# String (quotes optional for simple strings)
name = simple_name
desc = "Complex string with spaces"

# Boolean
is_enabled = yes
is_disabled = no

# List
list = { item1 item2 item3 }

# Variables
@high = 30
modifier_value = @high
```

## Triggers (Conditions)

```
# Simple comparison
age >= 16
gold > 100
prestige < 500

# Boolean checks
is_adult = yes
is_at_war = no

# Existence
exists = scope:character
NOT = { exists = this }

# Logical operators
AND = {
    condition1
    condition2
}

OR = {
    condition1
    condition2
}

NOT = {
    condition
}

# Nested conditions (implicit AND)
trigger_block = {
    age >= 16
    is_ruler = yes
    gold >= 100
}

# Has/any/all patterns
has_trait = ambitious
any_vassal = { is_adult = yes }
all_child = { is_alive = yes }
```

## Effects (Actions)

```
# Simple value changes
add_gold = 100
add_prestige = -50

# Add/remove traits
add_trait = brave
remove_trait = craven

# Trigger events
trigger_event = event_id.0001
trigger_event = {
    id = event_id.0001
    days = 30
}

# Conditional effects
if = {
    limit = { age >= 16 }
    add_trait = adult
}

# Random effects
random = {
    chance = 50
    add_gold = 100
}

random_list = {
    30 = { effect1 }
    50 = { effect2 }
    20 = { effect3 }
}

# Loops
every_vassal = {
    add_opinion = {
        target = root
        modifier = opinion_name
        opinion = 10
    }
}
```

## Scopes

```
root              # Primary scope (context-dependent)
this              # Current scope
prev              # Previous scope
scope:name        # Named scope (defined in context)

# Character scopes
father
mother
liege
capital_province
primary_title

# Title scopes
holder
de_jure_liege
capital_county

# Province scopes
county
holder
```

## Modifiers

```
# Character modifiers
character_modifier = {
    diplomacy = 2
    monthly_prestige = 0.1
}

# Province modifiers
province_modifier = {
    levy_size = 100
    monthly_income = 0.5
}

# County modifiers
county_modifier = {
    development_growth = 0.1
}

# Timed modifiers (in effects)
add_character_modifier = {
    modifier = modifier_name
    years = 10
}
```

## Dynamic Descriptions

```
# First valid pattern
desc = {
    first_valid = {
        triggered_desc = {
            trigger = { condition1 }
            desc = description1
        }
        triggered_desc = {
            trigger = { condition2 }
            desc = description2
        }
        desc = default_description
    }
}

# Random pattern
name = {
    random_valid = {
        triggered_desc = {
            trigger = { always = yes }
            desc = name1
        }
        triggered_desc = {
            trigger = { always = yes }
            desc = name2
        }
    }
}
```

## AI Weighting (MTTH)

```
ai_value = {
    base = 100

    # Add to value
    modifier = {
        add = 50
        condition = yes
    }

    # Multiply value
    modifier = {
        factor = 2
        condition = yes
    }

    # Disable completely
    modifier = {
        factor = 0
        condition = yes
    }
}
```

## Common Patterns

### Custom Tooltips

```
custom_tooltip = localization_key

custom_description = {
    text = localization_key
    trigger_condition
}
```

### Hidden Effects

```
hidden_effect = {
    # These effects happen but don't show in tooltip
    add_gold = 100
}
```

### Save Scopes

```
save_scope_as = my_character

# Use later
scope:my_character = {
    add_prestige = 100
}
```

### Opinion Modifiers

```
add_opinion = {
    target = root
    modifier = opinion_modifier_name
    opinion = 25
}
```

### Character Flags

```
# Set flag
add_character_flag = flag_name
add_character_flag = {
    flag = flag_name
    days = 30
}

# Check flag
has_character_flag = flag_name

# Remove flag
remove_character_flag = flag_name
```

### Variables

```
# Set variable
set_variable = {
    name = my_variable
    value = 10
}

# Check variable
var:my_variable >= 10

# Change variable
change_variable = {
    name = my_variable
    add = 5
}
```

## Localization

### File Format

```yaml
l_english:
 key_name:0 "Display Text"
 key_with_formatting:0 "Text with [variable] replacement"
 key_with_icon:0 "Text with #high icon#! color"
```

### Common Keys

```
trait_<key>
trait_<key>_desc

building_<key>
building_<key>_desc

decision_<key>
decision_<key>_desc
decision_<key>_confirm
decision_<key>_tooltip
```

### Formatting

```
[variable]           # Replace with variable value
#high text#!         # Green (positive) text
#low text#!          # Red (negative) text
#bold text#!         # Bold text
[recipient.GetName]  # Get localized name
```

## File Structure Patterns

### Trait

```
trait_name = {
    category = personality
    opposites = { opposite_trait }
    diplomacy = 2
    group = trait_group
    level = 1
}
```

### Building

```
building_name = {
    construction_time = 720
    can_construct = { }
    cost_gold = 500
    character_modifier = { }
    province_modifier = { }
    next_building = building_name_02
    ai_value = { base = 100 }
}
```

### Decision

```
decision_name = {
    is_shown = { }
    is_valid = { }
    cost = { gold = 100 }
    effect = { }
    ai_will_do = { base = 50 }
}
```

## Console Commands

```
add_gold <amount>
add_prestige <amount>
add_piety <amount>

add_trait <trait_name>
remove_trait <trait_name>

add_building <building_name>

decision <decision_name>

event <event_id>

add_innovation <innovation_name>

add_title <title_id>

kill <character_id>

charinfo                    # Show character IDs
yesmen                      # AI accepts everything
instamove                   # Instant army movement
```

## Common Triggers Reference

```
# Character properties
age
is_adult
is_child
is_ruler
is_landed
is_alive
is_imprisoned
is_at_war
is_female / is_male

# Comparisons
gold >= 100
prestige < 500
age > 16
realm_size >= 10

# Relationships
is_vassal_of = <character>
is_liege_of = <character>
is_allied_to = <character>

# Titles
has_title = <title>
completely_controls = <title>

# Traits
has_trait = <trait>
has_trait_flag = <flag>

# Culture/Religion
has_culture = <culture>
has_faith = <faith>
culture = { has_innovation = <innovation> }

# Location
location = { terrain = <terrain> }
```

## Common Effects Reference

```
# Values
add_gold = <amount>
add_prestige = <amount>
add_piety = <amount>

# Traits
add_trait = <trait>
remove_trait = <trait>

# Titles
create_title = <title>
destroy_title = <title>

# Modifiers
add_character_modifier = {
    modifier = <modifier>
    years = 10
}

# Opinion
add_opinion = {
    target = <character>
    modifier = <modifier>
    opinion = <value>
}

# Events
trigger_event = <event_id>

# Death
death = { death_reason = <reason> }
```

## File Locations Quick Reference

```
common/traits/                 # Character traits
common/buildings/              # Holdings and buildings
common/decisions/              # Player decisions
common/character_interactions/ # Diplomatic actions
common/culture/                # Cultures and innovations
common/religion/               # Faiths and religions
common/scripted_effects/       # Reusable effects
common/scripted_triggers/      # Reusable conditions
common/on_action/              # Event triggers
events/                        # Event files
localization/english/          # English text
gfx/interface/icons/           # Icons
```

## Debugging Tips

```
# Check these logs
error.log                  # Script errors
database_conflicts.log     # Mod conflicts
game.log                   # Runtime issues

# Common error causes
- Missing closing brace }
- Wrong scope context
- Typo in key names
- Missing localization
- UTF-8 encoding (localization needs BOM)
- Undefined variables
- Invalid trigger/effect names
```

## Best Practices Checklist

- [ ] Use variables (@variable) for repeated values
- [ ] Comment complex logic
- [ ] Test incrementally
- [ ] Check error.log after changes
- [ ] Use proper file naming (number prefixes)
- [ ] Add custom_description for complex requirements
- [ ] Balance AI weights carefully
- [ ] Provide clear localization
- [ ] Match base game conventions
- [ ] Test with different character types
