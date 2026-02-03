# General directives

- Always recompile and test the extension before returning to the user
- If you've been asked to implement or change feature, always sanity check that it works on a few cases before returning to the user
- When writing tests, remember to check every outcome - both that something is highlighted when it should be (for example), and not highlighted when it shouldn't be.
- When the user asks you an open-ended debugging question (like, to run some diagnostics and gather information), don't implement a fix right away, just get the information and present it to the user (maybe with a suggested fix)