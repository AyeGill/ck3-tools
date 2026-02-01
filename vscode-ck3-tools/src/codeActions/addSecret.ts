import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddSecretCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addSecret', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('secret');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select secret template',
        title: 'Add Secret Type'
      });

      if (!template) return;

      // Get secret name
      const name = await vscode.window.showInputBox({
        prompt: 'Secret type name (e.g., secret_affair, secret_murder_attempt)',
        placeHolder: 'secret_affair',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Secret name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Secret name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Generate code
      const code = await generator.generateCode({
        template,
        category: 'secret',
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} secret type`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add secret: ${error}`);
      console.error('Add secret error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
