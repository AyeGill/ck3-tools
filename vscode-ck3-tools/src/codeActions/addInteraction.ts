import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddInteractionCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addInteraction', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('interaction');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select interaction template',
        title: 'Add Character Interaction'
      });

      if (!template) return;

      // Get interaction name
      const name = await vscode.window.showInputBox({
        prompt: 'Interaction name (e.g., demand_tribute, propose_alliance)',
        placeHolder: 'demand_tribute',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Interaction name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Interaction name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Generate code
      const code = await generator.generateCode({
        template,
        category: 'interaction',
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} interaction`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add interaction: ${error}`);
      console.error('Add interaction error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
