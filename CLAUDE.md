# General directives

- Always recompile and test the extension before returning to the user
- If you've been asked to implement or change feature, always sanity check that it works on a few cases before returning to the user
- When writing tests, remember to check every outcome - both that something is highlighted when it should be (for example), and not highlighted when it shouldn't be.
- When the user asks you an open-ended debugging question (like, to run some diagnostics and gather information), don't implement a fix right away, just get the information and present it to the user (maybe with a suggested fix).
- When choosing how to implement or represent something, strive towards simplicity. Never implement something by case analysis if it could be implemented in a unified way. Never duplicate logic. 
- Rememeber to keep TODO.md up to date. Both by marking done what we get done, and by noting anything in progress.
- Remember that TODO.md is in the to-level directory Gottfried, not in vscode-ck3-tools.

# Task flow

When you finish a task, report the results and wait for the user to tell you what to work on next. When formulating a todo list, just focus on what the user asked you to do right now, don't add any other pending issues.

When encountering a case where an implementation fails on a complex case, it is NEVER appropriate to decide to skip this without checking with the user first.