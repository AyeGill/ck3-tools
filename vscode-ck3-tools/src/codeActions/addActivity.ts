import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddActivityCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addActivity', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('activity');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select activity template',
        title: 'Add Activity Type'
      });

      if (!template) return;

      // Get activity name
      const name = await vscode.window.showInputBox({
        prompt: 'Activity name (e.g., grand_tournament, pilgrimage)',
        placeHolder: 'grand_tournament',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Activity name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Activity name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Generate code
      const code = await generator.generateCode({
        template,
        category: 'activity',
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} activity`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add activity: ${error}`);
      console.error('Add activity error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
