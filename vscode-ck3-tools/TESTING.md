# CK3 Tools Extension - Testing Guide

## Setup

1. Open VS Code in the `vscode-ck3-tools` directory
2. Press F5 to launch the Extension Development Host (or use "Run > Start Debugging")
3. In the new VS Code window, open the `vscode-ck3-tools/test-mod` folder

## Features to Test

### 1. Trait Autocomplete

**Test in:** `test-mod/common/traits/test_traits.txt`

#### Field Name Completions

1. Inside a trait block, start typing on a new line
2. **Expected:** Should see suggestions for trait fields like `category`, `diplomacy`, `genetic`, etc.
3. **Test specific fields:**
   - Type `cat` → should suggest `category`
   - Type `min` → should suggest `minimum_age`
   - Type `gen` → should suggest `genetic`, `genetic_constraint_all`, etc.

#### Value Completions (Enum Fields)

1. Type `category = ` (with trailing space)
2. **Expected:** Should see all valid categories: `personality`, `education`, `childhood`, etc.

3. Type `valid_sex = `
4. **Expected:** Should see: `male`, `female`, `all`

5. Type `inheritance_blocker = `
6. **Expected:** Should see: `all`, `dynasty`, `none`

#### Boolean Value Completions

1. Type `genetic = `
2. **Expected:** Should see: `yes`, `no`

#### Context-Aware Completions

1. Create a `desc = { }` block and position cursor inside
2. **Expected:** Should see `first_valid`, `random_valid`, `triggered_desc`, `desc`

3. Inside a `first_valid = { }` block
4. **Expected:** Should see `triggered_desc`, `desc`

5. Inside a `potential = { }` or `trigger = { }` block
6. **Expected:** Should see trigger conditions like `has_trait`, `is_adult`, `NOT`, `AND`, `OR`

### 2. Hover Documentation

**Test in:** `test-mod/common/traits/test_traits.txt`

1. Hover over any field name (e.g., `category`, `diplomacy`, `genetic`)
2. **Expected:** Should see:
   - Field description
   - Type (boolean/integer/float/enum/etc.)
   - Valid values (for enums)
   - Default value (if applicable)
   - Example usage

**Test specific fields:**
- `category` → Should show all valid categories
- `inherit_chance` → Should show range 0-100 and note about genetic traits
- `genetic` → Should explain genetic inheritance rules
- `ai_boldness` → Should explain AI behavior modifier

### 3. Code Actions

**Test in:** `test-mod/common/traits/test_traits.txt`

1. Right-click in the editor
2. **Expected:** Should see "CK3: Add Trait from Template" in context menu
3. Click it and provide a trait name
4. **Expected:** Should insert a complete trait template with placeholder values

### 4. Stat Field Completions

1. Inside a trait block, type each stat name:
   - `diplomacy = `
   - `martial = `
   - `stewardship = `
   - `intrigue = `
   - `learning = `
   - `prowess = `
2. **Expected:** All should be recognized and provide hover documentation

### 5. Complex Nested Structures

Test autocomplete in nested blocks:

```
my_trait = {
    desc = {
        first_valid = {
            triggered_desc = {
                trigger = {
                    # Cursor here - should suggest trigger conditions
                }
                desc = # Cursor here - should accept localization key
            }
        }
    }
}
```

## Expected Results Summary

✅ **Field Autocomplete:** All 50+ trait fields available with descriptions
✅ **Value Autocomplete:** Enum values, booleans, and context-specific suggestions
✅ **Hover Documentation:** Detailed info for every field with examples
✅ **Context-Aware:** Different suggestions in trigger blocks, desc blocks, etc.
✅ **Code Actions:** Template insertion works
✅ **No Errors:** Extension activates without errors in Debug Console

## Known Limitations

- Autocomplete currently only works in `common/traits/**/*.txt` files
- No validation of localization keys yet
- No jump-to-definition for referenced traits (in `opposites`, etc.)
- Parser is regex-based, not a full AST parser (may have edge cases)

## Debugging

If autocomplete doesn't work:
1. Check Debug Console (Help > Toggle Developer Tools) for errors
2. Verify file path matches `**/common/traits/**/*.txt`
3. Check that extension activated (look for "CK3 Modding Tools loaded!" message)
4. Try reloading window (Cmd/Ctrl+R in Extension Development Host)

## Next Steps

After validating basic trait functionality:
1. Expand to other entity types (buildings, events, decisions)
2. Add validation/linting
3. Implement localization jump-to-definition
4. Consider LSP implementation for better performance
