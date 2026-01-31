# Testing the VS Code Extension

## ✅ Status: Ready to Test!

All TypeScript errors have been fixed and the extension compiled successfully.

## How to Test

### 1. Open Extension in VS Code

```bash
cd /Users/eigil/Projects/Gottfried/ck3-tools/vscode-extension
code .
```

### 2. Launch Extension Development Host

- Press **F5** (or Run → Start Debugging)
- This opens a new VS Code window with the extension loaded
- The window title will say **[Extension Development Host]**

### 3. Open a CK3 Mod

In the Extension Development Host window:
- Open a CK3 mod folder (one with a `descriptor.mod` file)
- Or create a test mod structure:
  ```
  test-mod/
  ├── descriptor.mod
  ├── common/
  │   ├── traits/
  │   ├── buildings/
  │   └── decisions/
  ├── events/
  └── localization/
      └── english/
  ```

### 4. Test "Add Trait"

1. Open or create a file in `common/traits/`
2. Right-click anywhere in the file
3. You should see **"CK3: Add Trait from Template"** in the menu
4. Click it and follow the prompts:
   - Select template: **personality_trait**
   - Enter name: **brave**
   - Select primary stat: **martial**
   - Enter stat value: **3**
   - Select secondary stat: **none**
5. The trait code should be inserted at your cursor!

Expected output:
```
# Generated from template: personality_trait

brave = {
	category = personality

	martial = 3

	ruler_designer_cost = 20

	# AI evaluation
	ai_value = {
	}
}
```

### 5. Test "Generate Localization"

1. With the trait file still open
2. Right-click → **"CK3: Generate Localization for Current File"**
3. Should create `localization/english/your_file_l_english.yml` with:
   ```yaml
   ﻿l_english:
    trait_brave:0 "Brave"
    trait_brave_desc:0 "Description for Brave"
   ```

### 6. Test "Go to Localization"

1. Put cursor on the word "brave" in your trait file
2. Right-click → **"CK3: Go to Localization"**
3. Should jump to the localization file and highlight `trait_brave`

### 7. Test Other Features

Repeat similar tests for:
- **Add Building** (in `common/buildings/`)
- **Add Event** (in `events/`)
- **Add Decision** (in `common/decisions/`)

## Troubleshooting

### Extension Doesn't Activate

- Check the Debug Console for errors
- Make sure you have a `descriptor.mod` file in your workspace
- Try reloading the Extension Development Host (Cmd+R / Ctrl+R)

### Commands Don't Appear in Menu

- Make sure you're in the correct directory:
  - Traits → `common/traits/`
  - Buildings → `common/buildings/`
  - Events → `events/`
  - Decisions → `common/decisions/`

### Template Not Found Errors

- Check that `../templates/` directory exists relative to extension
- Verify template files are in correct subdirectories

### Debug Output

View debug output in:
- **Debug Console** (in main VS Code window, not Extension Development Host)
- Look for "CK3 Modding Tools" messages

## Next Steps After Testing

Once everything works:

1. **Package the extension:**
   ```bash
   npm install -g @vscode/vsce
   vsce package
   # Creates ck3-tools-0.1.0.vsix
   ```

2. **Install locally:**
   - In VS Code: Extensions → ⋯ menu → Install from VSIX
   - Select the .vsix file

3. **Use in real mods:**
   - Extension will be available in all VS Code windows
   - No need for Extension Development Host

## Known Issues

None currently - all type errors have been fixed!

## Feedback

If you encounter issues:
1. Check the Debug Console for errors
2. Look at SETUP.md for architecture details
3. Check template files in `../templates/`
