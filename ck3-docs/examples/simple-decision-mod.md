# Example: Simple Decision Mod

This example demonstrates creating a new decision that players can take.

## Mod Structure

```
my_decision_mod/
├── common/
│   └── decisions/
│       └── 50_my_decisions.txt
├── events/
│   └── my_decision_events.txt
└── localization/
    └── english/
        ├── my_decisions_l_english.yml
        └── my_decision_events_l_english.yml
```

## descriptor.mod

```
name = "Simple Decision Example"
version = "1.0.0"
tags = { "Gameplay" }
supported_version = "1.12.*"
path = "mod/my_decision_mod"
```

## common/decisions/50_my_decisions.txt

```
# Hold a Grand Feast Decision
# Allows ruler to host a grand feast for prestige and opinion

hold_grand_feast_decision = {
    # Not a major decision
    major = no

    # Sorting priority
    sort_order = 50

    # Picture for the decision
    picture = "gfx/interface/illustrations/decisions/decision_personal_religious.dds"

    # When does the decision appear?
    is_shown = {
        # Must be adult
        is_adult = yes

        # Must be landed (have a title)
        is_ruler = yes

        # Must have a capital
        exists = capital_province
    }

    # Quick checks (only show failures)
    is_valid_showing_failures_only = {
        # Not imprisoned
        is_imprisoned = no

        # Not at war
        is_at_war = no

        # Not currently hosting activity
        NOT = { has_character_flag = holding_grand_feast }
    }

    # Detailed requirements (show success/failure)
    is_valid = {
        # Gold requirement
        custom_description = {
            text = "Needs 100 gold to host the feast"
            gold >= 100
        }

        # Not recently held a feast
        custom_description = {
            text = "Cannot hold another feast so soon"
            NOT = { has_character_modifier = recently_held_feast }
        }

        # Must have realm size
        custom_description = {
            text = "Must have at least 3 holdings"
            realm_size >= 3
        }
    }

    # Cost
    cost = {
        gold = 100
    }

    # Cooldown period
    cooldown = {
        years = 3
    }

    # What happens when taken
    effect = {
        # Set flag
        add_character_flag = {
            flag = holding_grand_feast
            days = 30
        }

        # Add cooldown modifier
        add_character_modifier = {
            modifier = recently_held_feast
            years = 3
        }

        # Gain prestige
        add_prestige = 150

        # Custom tooltip
        custom_tooltip = hold_grand_feast_effect_tooltip

        # Hidden effects
        hidden_effect = {
            # Improve opinion with vassals
            every_vassal = {
                limit = {
                    is_adult = yes
                    NOT = { has_trait = reclusive }
                }

                add_opinion = {
                    target = root
                    modifier = attended_grand_feast_opinion
                    opinion = 15
                }
            }

            # Improve opinion with courtiers
            every_courtier = {
                limit = {
                    is_adult = yes
                    is_ruler = no
                }

                add_opinion = {
                    target = root
                    modifier = attended_grand_feast_opinion
                    opinion = 10
                }
            }
        }

        # Trigger event after a delay
        trigger_event = {
            id = my_decision_event.0001
            days = 7
        }

        # Chance of random events during feast
        random_list = {
            30 = {
                # Good outcome
                trigger_event = {
                    id = my_decision_event.0002
                    days = 14
                }
            }
            50 = {
                # Neutral outcome
                trigger_event = {
                    id = my_decision_event.0003
                    days = 14
                }
            }
            20 = {
                # Bad outcome
                trigger_event = {
                    id = my_decision_event.0004
                    days = 14
                }
            }
        }
    }

    # AI behavior
    ai_check_interval = 36  # Check every 3 years

    ai_potential = {
        # AI must be stable
        gold >= 500
        NOT = { is_at_war = yes }

        # AI must not hate hosting
        NOR = {
            has_trait = shy
            has_trait = reclusive
        }
    }

    ai_will_do = {
        base = 50

        # More likely if gregarious
        modifier = {
            add = 50
            has_trait = gregarious
        }

        # More likely if ambitious
        modifier = {
            add = 30
            has_trait = ambitious
        }

        # More likely if low opinion with vassals
        modifier = {
            add = 40
            any_vassal = {
                has_opinion_modifier = {
                    target = root
                    modifier = angry
                }
            }
        }

        # Less likely if poor
        modifier = {
            factor = 0.5
            gold < 300
        }

        # Never if greedy
        modifier = {
            factor = 0
            has_trait = greedy
        }

        # Less likely if content
        modifier = {
            factor = 0.3
            has_trait = content
        }
    }
}

# Alternative: Smaller Private Feast
# Cheaper option with smaller benefits

hold_private_feast_decision = {
    major = no
    sort_order = 49

    picture = "gfx/interface/illustrations/decisions/decision_personal_religious.dds"

    is_shown = {
        is_adult = yes
        is_ruler = yes
    }

    is_valid_showing_failures_only = {
        is_imprisoned = no
        NOT = { has_character_flag = holding_private_feast }
    }

    is_valid = {
        custom_description = {
            text = "Needs 50 gold"
            gold >= 50
        }

        custom_description = {
            text = "Cannot hold another feast so soon"
            NOT = { has_character_modifier = recently_held_feast }
        }
    }

    cost = {
        gold = 50
    }

    cooldown = {
        years = 1
    }

    effect = {
        add_character_flag = {
            flag = holding_private_feast
            days = 14
        }

        add_character_modifier = {
            modifier = recently_held_feast
            years = 1
        }

        add_prestige = 50

        custom_tooltip = hold_private_feast_effect_tooltip

        hidden_effect = {
            # Smaller opinion boost, fewer people
            every_vassal = {
                limit = {
                    is_adult = yes
                    opinion = {
                        target = root
                        value >= 25  # Only invite friends
                    }
                }

                add_opinion = {
                    target = root
                    modifier = attended_private_feast_opinion
                    opinion = 10
                }
            }
        }

        trigger_event = {
            id = my_decision_event.0101
            days = 3
        }
    }

    ai_check_interval = 12

    ai_potential = {
        gold >= 200
    }

    ai_will_do = {
        base = 30

        modifier = {
            add = 20
            has_trait = gregarious
        }

        modifier = {
            factor = 0
            has_trait = greedy
        }
    }
}
```

## events/my_decision_events.txt

```
namespace = my_decision_event

# Grand Feast Announcement
my_decision_event.0001 = {
    type = character_event
    title = my_decision_event.0001.t
    desc = my_decision_event.0001.desc
    theme = feast

    left_portrait = root

    option = {
        name = my_decision_event.0001.a
        # Player acknowledges
    }
}

# Grand Feast - Good Outcome
my_decision_event.0002 = {
    type = character_event
    title = my_decision_event.0002.t
    desc = my_decision_event.0002.desc
    theme = feast

    left_portrait = root

    option = {
        name = my_decision_event.0002.a

        # Additional prestige
        add_prestige = 100

        # Chance to gain friend
        random_vassal = {
            limit = {
                opinion = {
                    target = root
                    value >= 50
                }
            }

            set_relation_friend = root
        }
    }
}

# Grand Feast - Neutral Outcome
my_decision_event.0003 = {
    type = character_event
    title = my_decision_event.0003.t
    desc = my_decision_event.0003.desc
    theme = feast

    left_portrait = root

    option = {
        name = my_decision_event.0003.a
        # Nothing special happens
    }
}

# Grand Feast - Bad Outcome
my_decision_event.0004 = {
    type = character_event
    title = my_decision_event.0004.t
    desc = my_decision_event.0004.desc
    theme = feast

    left_portrait = root

    option = {
        name = my_decision_event.0004.a

        # Lose some prestige
        add_prestige = -50

        # One vassal gets upset
        random_vassal = {
            add_opinion = {
                target = root
                modifier = feast_insult_opinion
                opinion = -20
            }
        }
    }
}

# Private Feast Event
my_decision_event.0101 = {
    type = character_event
    title = my_decision_event.0101.t
    desc = my_decision_event.0101.desc
    theme = feast

    left_portrait = root

    option = {
        name = my_decision_event.0101.a
        # Acknowledgment
    }
}
```

## localization/english/my_decisions_l_english.yml

```yaml
l_english:
 decision_hold_grand_feast_decision:0 "Hold Grand Feast"
 decision_hold_grand_feast_decision_desc:0 "Host an elaborate feast for your vassals and courtiers, improving relations and demonstrating your wealth and generosity."
 decision_hold_grand_feast_decision_tooltip:0 "You will host a grand feast"
 decision_hold_grand_feast_decision_confirm:0 "Begin preparations"

 hold_grand_feast_effect_tooltip:0 "Your vassals and courtiers will have improved opinion of you.\n\nRandom events may occur during the feast."

 decision_hold_private_feast_decision:0 "Hold Private Feast"
 decision_hold_private_feast_decision_desc:0 "Host a smaller, more intimate gathering for your closest allies."
 hold_private_feast_effect_tooltip:0 "Your closest vassals will have improved opinion of you."

 recently_held_feast:0 "Recently Held Feast"
 recently_held_feast_desc:0 "This character recently hosted a feast and cannot host another so soon."

 attended_grand_feast_opinion:0 "Attended Grand Feast"
 attended_private_feast_opinion:0 "Attended Private Feast"
 feast_insult_opinion:0 "Insulted at Feast"
```

## localization/english/my_decision_events_l_english.yml

```yaml
l_english:
 my_decision_event.0001.t:0 "Preparations Complete"
 my_decision_event.0001.desc:0 "The preparations for your grand feast are complete. Guests from across your realm have begun arriving at your capital."
 my_decision_event.0001.a:0 "Let the festivities begin!"

 my_decision_event.0002.t:0 "A Magnificent Success"
 my_decision_event.0002.desc:0 "Your feast was a tremendous success! The food was exquisite, the entertainment spectacular, and your guests are thoroughly impressed. Tales of this event will spread far and wide."
 my_decision_event.0002.a:0 "A night to remember!"

 my_decision_event.0003.t:0 "A Pleasant Evening"
 my_decision_event.0003.desc:0 "Your feast proceeded smoothly. While nothing extraordinary occurred, your guests enjoyed themselves and your hospitality was appreciated."
 my_decision_event.0003.a:0 "A successful gathering."

 my_decision_event.0004.t:0 "An Awkward Incident"
 my_decision_event.0004.desc:0 "During the feast, one of your vassals took offense at the seating arrangements. Despite your attempts to smooth things over, they left in anger, and others whisper about your poor hospitality."
 my_decision_event.0004.a:0 "How unfortunate..."

 my_decision_event.0101.t:0 "An Intimate Gathering"
 my_decision_event.0101.desc:0 "Your private feast was a success. Your closest allies enjoyed the exclusive gathering and appreciated your attention."
 my_decision_event.0101.a:0 "A pleasant evening."
```

## Testing

### Console Commands

```
add_gold 500                              # Give yourself gold
decision hold_grand_feast_decision        # Force take the decision
add_opinion <character_id> 50             # Test opinion requirements
remove_character_modifier recently_held_feast  # Remove cooldown
```

### Testing Checklist

1. ✓ Decision appears in decision menu
2. ✓ Requirements work correctly
3. ✓ Cost is deducted
4. ✓ Effects apply (prestige, opinions)
5. ✓ Events trigger correctly
6. ✓ Cooldown prevents repeated use
7. ✓ AI takes decision appropriately
8. ✓ All localization displays correctly

## Extending the Example

### Add More Event Chains

```
effect = {
    # ... existing effects ...

    # Branch based on character traits
    if = {
        limit = { has_trait = gregarious }
        trigger_event = {
            id = my_decision_event.1000  # Special gregarious chain
            days = 14
        }
    }
    else_if = {
        limit = { has_trait = shy }
        trigger_event = {
            id = my_decision_event.2000  # Special shy chain
            days = 14
        }
    }
}
```

### Add Character Interaction Instead

For more complex feast mechanics, consider a character interaction:

Location: `common/character_interactions/`

```
invite_to_feast_interaction = {
    category = interaction_category_friendly

    send_name = INVITE_TO_FEAST

    is_shown = {
        has_character_flag = holding_grand_feast
    }

    # ... interaction definition ...
}
```

### Add Scripted Effects

Create reusable effects in `common/scripted_effects/`:

```
hold_feast_effect = {
    add_prestige = $PRESTIGE$
    add_character_modifier = {
        modifier = recently_held_feast
        years = $YEARS$
    }
}
```

Use in decision:

```
effect = {
    hold_feast_effect = {
        PRESTIGE = 150
        YEARS = 3
    }
}
```

## Common Issues

### Decision doesn't appear
- Check `is_shown` trigger
- Verify character meets all conditions
- Check error.log for script errors

### Effects don't work
- Check scope context (use `root`, `scope:`, etc.)
- Verify syntax in `effect` block
- Test with simplified effect first

### AI never takes it
- Lower `ai_check_interval` for testing
- Increase `base` value in `ai_will_do`
- Remove restrictive `ai_potential` conditions temporarily
- Use `charinfo` console command to see AI reasoning

### Events don't fire
- Check event namespace matches
- Verify event IDs are correct
- Check event triggers and conditions
- Use `event <event_id>` console command to test

### Cooldown doesn't work
- Verify modifier name matches in `is_valid` and `effect`
- Check modifier duration
- Test removing and re-adding with console

## Best Practices

1. **Clear requirements** - Use custom_description for complex conditions
2. **Balanced costs** - Compare to similar base game decisions
3. **Meaningful cooldowns** - Prevent spam but don't frustrate players
4. **Event chains** - Add narrative depth with follow-up events
5. **AI tuning** - Make AI behavior reasonable and interesting
6. **Scope safety** - Always check scope validity before referencing
7. **Custom tooltips** - Explain complex effects clearly
8. **Testing** - Test both player and AI behavior thoroughly
