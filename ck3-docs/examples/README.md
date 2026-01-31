# Modding Examples

This directory contains complete, working examples of common modding patterns for CK3.

## Available Examples

### [Simple Trait Mod](simple-trait-mod.md)

Learn how to create new character traits with:
- Basic trait properties
- Inheritance mechanics
- Opinion effects
- Culture and faith modifiers
- Genetic traits
- Trait tracks for progression

### [Simple Building Mod](simple-building-mod.md)

Learn how to create new buildings with:
- Building chains and upgrades
- Multiple modifier types
- Conditional effects
- AI behavior tuning
- Construction requirements
- Province and county modifiers

### [Simple Decision Mod](simple-decision-mod.md)

Learn how to create player decisions with:
- Visibility and validity checks
- Costs and cooldowns
- Effects and events
- AI decision-making
- Event chains
- Opinion changes

## Using These Examples

Each example includes:

1. **Complete file structure** - All files needed for a working mod
2. **Fully commented code** - Explanations of what each part does
3. **Localization** - All text strings required
4. **Testing instructions** - How to test and debug
5. **Common issues** - Problems you might encounter and solutions
6. **Extensions** - Ideas for expanding the example

## Quick Start

To use an example:

1. Create the directory structure shown in the example
2. Copy the file contents
3. Adjust paths in the `.mod` descriptor file
4. Place in your CK3 mod directory
5. Enable in the launcher
6. Test in-game

## File Naming Conventions

The examples use these file naming patterns:

- **50_my_*.txt** - Number prefix for load order (50 loads after base game)
- **my_***_l_english.yml** - Localization files with language suffix
- **namespace_events.txt** - Events with unique namespace

You should replace "my_" with your own prefix to avoid conflicts with other mods.

## Combining Examples

These examples can be combined into a single mod:

```
my_complete_mod/
├── common/
│   ├── traits/
│   │   └── 50_my_traits.txt
│   ├── buildings/
│   │   └── 50_my_buildings.txt
│   └── decisions/
│       └── 50_my_decisions.txt
├── events/
│   └── my_events.txt
└── localization/
    └── english/
        ├── my_traits_l_english.yml
        ├── my_buildings_l_english.yml
        ├── my_decisions_l_english.yml
        └── my_events_l_english.yml
```

Just update your `.mod` file to reference the combined structure.

## More Complex Examples

### Events and Scripting

For complex event chains, character interactions, and scripted systems:

- Study base game events in `events/`
- Look at scripted effects in `common/scripted_effects/`
- Examine scripted triggers in `common/scripted_triggers/`
- Check on_actions in `common/on_action/`

### Total Conversions

For large-scale mods that change fundamental systems:

- Use `replace_path` in your .mod file to completely replace directories
- Start with one system at a time
- Document your changes extensively
- Plan for compatibility issues

### Graphics and UI

For custom graphics and UI:

- DDS format for textures
- GUI files in `gui/`
- 3D models require specific formats
- Sound files in `music/` and `sound/`

## Community Resources

### Example Mods to Study

Look at popular open-source mods for advanced examples:
- Community Flavor Pack
- More Bookmarks
- Expanded Decisions

### Modding Communities

- CK3 Modding Discord
- Paradox Forums - CK3 Modding section
- /r/CK3Mods on Reddit
- Steam Workshop

### Documentation

- [CK3 Modding Wiki](https://ck3.paradoxwikis.com/Modding)
- [CK3 Scripting Reference](https://ck3.paradoxwikis.com/Scripting)
- [GitHub: CK3 Modding Documentation](https://github.com/CK3-Modding/Documentation)

## Development Workflow

### Recommended Workflow

1. **Plan** - Design your feature on paper first
2. **Create structure** - Set up directories and basic files
3. **Implement incrementally** - Add one feature at a time
4. **Test frequently** - Test after each small change
5. **Check logs** - Always check error.log and database_conflicts.log
6. **Debug** - Use console commands to test specific scenarios
7. **Iterate** - Refine based on testing
8. **Polish** - Add final touches, localization, icons

### Testing Tips

- Use console commands liberally
- Create test saves at different dates
- Test with different characters (cultures, religions, governments)
- Test AI behavior by observing AI characters
- Enable debug mode for additional tools
- Keep a testing checklist

### Debugging Common Issues

1. **Syntax errors** - Check error.log
2. **Missing localization** - Look for "MISSING_KEY" in game
3. **Mod conflicts** - Check database_conflicts.log
4. **Scope errors** - Validate scope context
5. **Balance issues** - Compare to base game values
6. **AI issues** - Test ai_will_do weights

## Contributing Examples

If you create a useful example:

1. Ensure it works in latest CK3 version
2. Comment thoroughly
3. Include all necessary files
4. Document testing steps
5. List common issues and solutions
6. Consider sharing with the community

## Next Steps

After working through these examples:

1. Study the base game files in `common/`
2. Read the info files (e.g., `_traits.info`)
3. Experiment with modifications
4. Join modding communities
5. Share your creations
6. Help other modders

## License Note

These examples are for educational purposes. When creating mods:

- Respect Paradox's EULA
- Don't copy-paste base game content without modification
- Credit any code or ideas borrowed from other modders
- Consider open-sourcing your work to help the community

## Getting Help

If you're stuck:

1. Check error.log and database_conflicts.log
2. Re-read the relevant documentation
3. Compare to working base game examples
4. Search the CK3 modding wiki
5. Ask in modding communities
6. Describe your problem clearly with code samples
