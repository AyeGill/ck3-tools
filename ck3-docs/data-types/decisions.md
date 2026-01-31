# Decisions

Decisions are player-initiated actions that characters can take. They appear in the Decisions menu and can have significant gameplay effects.

## File Location

`common/decisions/*.txt`

## Basic Structure

```
decision_name = {
    # Categorization
    major = yes
    picture = "gfx/interface/illustrations/decisions/decision_image.dds"

    # Visibility
    is_shown = { }
    is_valid_showing_failures_only = { }
    is_valid = { }

    # Cost
    cost = { }

    # Effects
    effect = { }

    # AI
    ai_check_interval = 60
    ai_potential = { }
    ai_will_do = { }
}
```

## Properties

### Decision Classification

#### major

Determines if the decision is a major decision (shown prominently):

```
major = yes  # Major decision, shown at top
major = no   # Regular decision (default)
```

#### ai_goal

Marks decision as an AI goal:

```
ai_goal = yes
```

#### sort_order

Determines ordering in the decision list:

```
sort_order = 50  # Higher numbers appear first
```

### Visual

#### picture

Illustration shown in the decision interface:

```
picture = "gfx/interface/illustrations/decisions/decision_major_religious.dds"
```

You can also use dynamic pictures:

```
picture = {
    trigger = { is_male = yes }
    reference = "gfx/interface/illustrations/decisions/decision_male.dds"
}
picture = {
    reference = "gfx/interface/illustrations/decisions/decision_female.dds"
}
```

#### title / desc

Custom localization keys (defaults to `decision_<key>` and `decision_<key>_desc`):

```
title = custom_loc_key
desc = custom_loc_key_desc
```

Or with dynamic descriptions:

```
desc = {
    first_valid = {
        triggered_desc = {
            trigger = { is_at_war = yes }
            desc = decision_at_war_desc
        }
        desc = decision_default_desc
    }
}
```

#### tooltip

Custom tooltip:

```
tooltip = decision_custom_tooltip
```

#### selection_tooltip

Tooltip when hovering over the decision button:

```
selection_tooltip = decision_selection_tooltip
```

#### confirm_text

Text on the confirmation button:

```
confirm_text = DECISION_CONFIRM
```

## Visibility and Validity

### is_shown

Controls whether the decision appears in the list at all:

```
is_shown = {
    is_ruler = yes
    is_adult = yes
}
```

Scope: `root` is the character who would take the decision.

### is_valid_showing_failures_only

Conditions that show only failures (temporary obstacles):

```
is_valid_showing_failures_only = {
    is_at_war = no
    is_imprisoned = no
}
```

### is_valid

Conditions showing both successes and failures:

```
is_valid = {
    prestige >= 500
    gold >= 200
    custom_description = {
        text = "Must control holy site"
        any_held_title = {
            is_holy_site = yes
        }
    }
}
```

All three must be true for the decision to be available.

### custom_tooltip / custom_description

Add custom requirement text:

```
is_valid = {
    custom_description = {
        text = "Must have at least 3 duchies"
        any_held_title = {
            count >= 3
            tier = tier_duchy
        }
    }
}
```

## Costs

### Simple Costs

```
cost = {
    gold = 200
    prestige = 500
    piety = 100
}
```

### Scripted Costs

Reference costs defined in `common/scripted_costs/`:

```
cost = {
    gold = decision_prestige_cost  # Named cost
}
```

### Dynamic Costs

```
cost = {
    gold = {
        value = 100
        if = {
            limit = { is_greedy = yes }
            multiply = 1.5
        }
    }
}
```

## Effects

The `effect` block contains what happens when the decision is taken:

```
effect = {
    # Simple effects
    add_gold = -200
    add_prestige = 100

    # Trigger events
    trigger_event = {
        id = decision_events.0001
        days = 7
    }

    # Complex logic
    if = {
        limit = { is_ambitious = yes }
        add_trait = ambitious
    }

    # Custom tooltip
    custom_tooltip = decision_outcome_tooltip
    hidden_effect = {
        # Effects hidden from tooltip
        set_variable = decision_taken
    }
}
```

### Scopes in Effects

- `root` - The character taking the decision
- Various `scope:` variables if defined in the decision

### cooldown

Prevents rapid repeated use:

```
cooldown = { years = 5 }
```

Can be dynamic:

```
cooldown = {
    years = 10
    if = {
        limit = { has_trait = ambitious }
        years = 5
    }
}
```

## AI Behavior

### ai_check_interval

How often (in months) the AI considers this decision:

```
ai_check_interval = 60  # Check every 60 months
```

### ai_potential

Whether the AI should consider this decision at all:

```
ai_potential = {
    is_ruler = yes
    is_at_war = no
    gold >= 500
}
```

### ai_will_do

AI weight for taking the decision (MTTH structure):

```
ai_will_do = {
    base = 100

    # Increase weight
    modifier = {
        add = 50
        is_ambitious = yes
    }

    # Decrease weight
    modifier = {
        factor = 0.5
        gold < 1000
    }

    # Never take it
    modifier = {
        factor = 0
        is_at_war = yes
    }
}
```

Higher values = more likely to take the decision.

## Special Features

### widget

Add custom UI elements:

```
widget = {
    gui = "decision_view_widget"
    controller = decision_controller

    # ... widget-specific configuration
}
```

### is_invisible

Makes the decision invisible to players (AI-only or scripted use):

```
is_invisible = yes
```

## Complete Example: Form New Kingdom

```
form_new_kingdom_decision = {
    # Classification
    major = yes
    sort_order = 100

    # Visual
    picture = "gfx/interface/illustrations/decisions/decision_form_kingdom.dds"

    # Visibility
    is_shown = {
        # Must be at least a duke
        highest_held_title_tier = tier_duchy

        # Not already a king or emperor
        NOT = {
            highest_held_title_tier >= tier_kingdom
        }

        # Adult ruler
        is_ruler = yes
        is_adult = yes
    }

    is_valid_showing_failures_only = {
        # Not at war
        is_at_war = no

        # Not imprisoned
        is_imprisoned = no
    }

    is_valid = {
        # Wealth requirement
        custom_description = {
            text = "Must have at least 500 gold"
            gold >= 500
        }

        # Prestige requirement
        custom_description = {
            text = "Must have at least 1000 prestige"
            prestige >= 1000
        }

        # Territory requirement
        custom_description = {
            text = "Must hold at least 3 duchy titles"
            any_held_title = {
                count >= 3
                tier = tier_duchy
            }
        }

        # Culture requirement
        custom_description = {
            text = "Culture must have Hereditary Rule innovation"
            culture = {
                has_innovation = innovation_hereditary_rule
            }
        }
    }

    # Cost
    cost = {
        gold = 500
        prestige = 1000
    }

    # Cooldown
    cooldown = { years = 20 }

    # Effects
    effect = {
        # Custom tooltip
        custom_tooltip = form_new_kingdom_effect_tooltip

        # Save scopes for event
        save_scope_as = founder

        # Hidden effects
        hidden_effect = {
            # Create the new kingdom title
            create_title_and_vassal_change = {
                type = created
                save_scope_as = title_change
                add_claim_on_loss = no
            }

            # Generate a new kingdom
            create_dynamic_title = {
                tier = kingdom
                name = NEW_KINGDOM_NAME
            }

            # Grant to character
            create_title_and_vassal_change = {
                type = created
                save_scope_as = title_change
            }

            # Gain prestige
            add_prestige = 500

            # Gain fame
            add_character_flag = formed_new_kingdom

            # Notify realm
            send_interface_message = {
                type = event_generic_good
                title = formed_new_kingdom_message
                desc = formed_new_kingdom_message_desc
            }
        }

        # Trigger formation event
        trigger_event = {
            id = kingdom_formation.0001
            days = 3
        }
    }

    # AI behavior
    ai_check_interval = 120  # Check every 10 years

    ai_potential = {
        # AI must be ambitious enough
        OR = {
            has_trait = ambitious
            has_trait = arrogant
            ai_greed >= high_positive_ai_value
        }

        # Must have stable realm
        short_term_gold >= 1000
        NOT = { any_vassal = { has_opinion_modifier = { target = root modifier = angry } } }
    }

    ai_will_do = {
        base = 100

        # More likely if ambitious
        modifier = {
            add = 100
            has_trait = ambitious
        }

        # Less likely if content
        modifier = {
            factor = 0
            has_trait = content
        }

        # More likely if high prestige
        modifier = {
            add = 50
            prestige >= 2000
        }

        # Reduced chance if low gold
        modifier = {
            factor = 0.5
            short_term_gold < 1000
        }
    }
}
```

## Decision Groups

Decisions can be organized into groups defined in `common/decision_group_types/`:

```
decision_group_name = {
    # Displayed name
    name = "GROUP_NAME"

    # Icon
    icon = "decision_group_icon.dds"

    # Filter
    filter = {
        # Only show decisions matching this filter
    }
}
```

Reference in decisions:

```
decision_name = {
    group = decision_group_name
    # ...
}
```

## Localization

Default keys:
- Title: `decision_<key>`
- Description: `decision_<key>_desc`
- Confirmation: `decision_<key>_confirm`
- Tooltip: `decision_<key>_tooltip`

## Testing Decisions

Console commands:
```
add_gold <amount>                # Give gold for cost
add_prestige <amount>            # Give prestige for cost
add_piety <amount>               # Give piety for cost
decision <decision_name>         # Force execute decision
```

Check logs:
- `error.log` - Script errors
- `game.log` - Decision execution issues

## Best Practices

1. **Clear requirements**: Use `custom_description` to explain complex conditions
2. **Appropriate costs**: Balance gameplay impact with cost
3. **Meaningful cooldowns**: Prevent spam without frustrating players
4. **AI consideration**: Make AI behavior reasonable and interesting
5. **Event follow-ups**: Use events for storytelling around major decisions
6. **Scope management**: Be careful with scope references in complex decisions
7. **Testing**: Test both player and AI behavior thoroughly
