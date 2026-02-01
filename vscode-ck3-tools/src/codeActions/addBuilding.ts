import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddBuildingCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addBuilding', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('building');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select building template',
        title: 'Add Building'
      });

      if (!template) return;

      // Get building name
      const name = await vscode.window.showInputBox({
        prompt: 'Building name (e.g., grand_library)',
        placeHolder: 'grand_library',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Building name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Building name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Get levels
      const levels = await vscode.window.showInputBox({
        prompt: 'Number of levels (1-8)',
        value: '3',
        validateInput: (value) => {
          const num = parseInt(value);
          if (isNaN(num) || num < 1 || num > 8) {
            return 'Levels must be between 1 and 8';
          }
          return null;
        }
      });

      if (!levels) return;

      // Generate code
      const code = await generator.generateBuildingCode({
        template,
        name,
        levels: parseInt(levels)
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} building with ${levels} levels`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add building: ${error}`);
      console.error('Add building error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
