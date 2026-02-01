import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddTraitCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addTrait', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Step 1: Select template
      const templates = await generator.listTemplates('trait');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select trait template',
        title: 'Add Trait'
      });

      if (!template) {
        return; // User cancelled
      }

      // Step 2: Get trait name
      const name = await vscode.window.showInputBox({
        prompt: 'Trait name (e.g., brave, ambitious)',
        placeHolder: 'brave',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Trait name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Trait name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) {
        return;
      }

      // Step 3: Get template-specific parameters
      const params: any = { name };

      if (template === 'personality_trait') {
        const primaryStat = await vscode.window.showQuickPick(
          ['diplomacy', 'martial', 'stewardship', 'intrigue', 'learning', 'prowess'],
          {
            placeHolder: 'Select primary stat',
            title: 'Primary Stat'
          }
        );
        if (!primaryStat) return;
        params.primary_stat = primaryStat;

        const statValue = await vscode.window.showInputBox({
          prompt: 'Stat value',
          value: '2',
          validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < -5 || num > 10) {
              return 'Stat value must be between -5 and 10';
            }
            return null;
          }
        });
        if (!statValue) return;
        params.stat_value = parseInt(statValue);

        const secondaryStat = await vscode.window.showQuickPick(
          ['none', 'diplomacy', 'martial', 'stewardship', 'intrigue', 'learning', 'prowess'],
          {
            placeHolder: 'Select secondary stat (optional)',
            title: 'Secondary Stat'
          }
        );
        if (secondaryStat) {
          params.secondary_stat = secondaryStat;
        }
      } else if (template === 'education_trait') {
        const primaryStat = await vscode.window.showQuickPick(
          ['diplomacy', 'martial', 'stewardship', 'intrigue', 'learning'],
          {
            placeHolder: 'Select primary stat',
            title: 'Primary Stat'
          }
        );
        if (!primaryStat) return;
        params.primary_stat = primaryStat;

        const levels = await vscode.window.showInputBox({
          prompt: 'Number of levels (1-5)',
          value: '4',
          validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 1 || num > 5) {
              return 'Levels must be between 1 and 5';
            }
            return null;
          }
        });
        if (!levels) return;
        params.levels = parseInt(levels);
      } else if (template === 'lifestyle_trait') {
        const lifestyle = await vscode.window.showQuickPick(
          ['diplomacy', 'martial', 'stewardship', 'intrigue', 'learning'],
          {
            placeHolder: 'Select lifestyle',
            title: 'Lifestyle'
          }
        );
        if (!lifestyle) return;
        params.lifestyle = lifestyle;
      }

      // Step 4: Generate code
      const code = await generator.generateTraitCode({
        template,
        ...params
      });

      // Step 5: Insert at cursor position
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} trait from ${template} template`);

      // Step 6: Ask if user wants to generate localization
      const generateLoc = await vscode.window.showQuickPick(['Yes', 'No'], {
        placeHolder: 'Generate localization for this trait?',
        title: 'Generate Localization'
      });

      if (generateLoc === 'Yes') {
        vscode.commands.executeCommand('ck3-tools.generateLocalization');
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add trait: ${error}`);
      console.error('Add trait error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
