# CK3 Scripting Language

This document describes the syntax and structure of the Paradox scripting language used in Crusader Kings 3.

## Basic Syntax

### Key-Value Pairs

The fundamental building block is the key-value pair:

```
key = value
```

### Comments

Comments are prefixed with `#`:

```
# This is a comment
key = value  # This is also a comment
```

### Values Types

#### Simple Values

```
# Integers
levy = 200
age = 25

# Floating point numbers
garrison_reinforcement_factor = 0.01

# Strings (quotes optional for simple strings)
name = education_intrigue_1
desc = "A longer description"

# Booleans
is_graphical_background = yes
show_disabled = no
```

#### Variables

Variables are defined with the `@` prefix and can be referenced elsewhere:

```
# Define variables at the top of the file
@high_value = 30
@medium_value = 15
@low_value = 5

# Use them later
opinion_modifier = @high_value
```

### Blocks (Nested Structures)

Blocks are delimited by curly braces and can be nested:

```
trait_name = {
    category = education
    intrigue = 4

    character_modifier = {
        monthly_piety = 0.2
    }
}
```

### Lists/Arrays

Lists can be defined in multiple ways:

```
# Inline list
names = { "name1" "name2" "name3" }

# Multiple entries
name = "name1"
name = "name2"
name = "name3"

# Mixed (combined together)
name = "primary_name"
names = { "alternative1" "alternative2" }
```

## Data Structures

### Object Definitions

Most game objects follow this pattern:

```
unique_identifier = {
    # Properties
    property1 = value1
    property2 = value2

    # Nested objects
    nested_object = {
        nested_property = value
    }

    # Modifiers
    character_modifier = {
        diplomacy = 2
        monthly_prestige = 0.1
    }
}
```

### Triggers (Conditional Logic)

Triggers are blocks that evaluate to true or false. They're used for conditions:

```
can_construct = {
    # All conditions must be true (implicit AND)
    building_level >= 2
    culture = {
        has_innovation = innovation_windmills
    }
}
```

#### Common Trigger Operators

```
# Comparison
age >= 16
gold > 100
intrigue < 10

# Existence
exists = scope:holder
NOT = { exists = this }

# Logical operators
OR = {
    condition1
    condition2
}

AND = {
    condition1
    condition2
}

NOT = {
    condition
}
```

### Effects (Actions)

Effects are blocks that perform actions or changes:

```
on_complete = {
    # Add gold to character
    add_gold = 100

    # Add a trait
    add_trait = ambitious

    # Trigger an event
    trigger_event = my_event.0001
}
```

### Scopes

Scopes represent different game objects in context:

```
# Common scopes:
# root - the primary object (varies by context)
# this - the current scope
# scope:holder - a named scope (character who holds something)
# scope:county - another named scope (a county title)

is_enabled = {
    # root is the province
    # scope:holder is the character who owns the barony
    # scope:county is the county title

    scope:holder = {
        gold > 500
    }
}
```

## Common Patterns

### Dynamic Descriptions

Properties like `name`, `desc`, and `icon` can use conditional logic:

```
desc = {
    first_valid = {
        triggered_desc = {
            trigger = {
                NOT = { exists = this }
            }
            desc = trait_education_desc
        }
        triggered_desc = {
            trigger = {
                gold > 1000
            }
            desc = trait_education_rich_desc
        }
        desc = trait_education_default_desc
    }
}
```

### Conditional Modifiers

Modifiers can be applied conditionally:

```
character_culture_modifier = {
    parameter = some_culture_parameter
    diplomacy = 2
    monthly_prestige = 0.1
}

character_faith_modifier = {
    parameter = some_faith_parameter
    stewardship = 1
}
```

### AI Weighting (MTTH - Mean Time To Happen)

AI decision-making uses weighted values:

```
ai_value = {
    base = 100

    modifier = {
        add = 50
        gold > 500
    }

    modifier = {
        factor = 2
        is_ambitious = yes
    }

    modifier = {
        factor = 0  # Completely disable
        is_at_war = yes
    }
}
```

## File Encoding

Important: Localization files must use **UTF-8 with BOM** encoding. Data files use UTF-8 (without BOM is fine).

## Performance Considerations

- **Named values** (variables with `@`) are more performant than hardcoded values repeated many times
- **Meshes** are more performant than entities for 3D assets
- Keep trigger evaluations simple when possible, as they run frequently

## Debugging

- Check `error.log` in your CK3 user directory for script errors
- Check `database_conflicts.log` for conflicts between mods
- Use the in-game console for testing (enable debug mode)

## Best Practices

1. **Use variables** for repeated values
2. **Comment your code** to explain complex logic
3. **Follow naming conventions** from the base game
4. **Test incrementally** - add features one at a time
5. **Keep triggers simple** - complex conditions can impact performance
6. **Use proper file organization** - match the base game's structure
