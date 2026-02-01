import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddSchemeCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addScheme', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('scheme');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select scheme template',
        title: 'Add Scheme Type'
      });

      if (!template) return;

      // Get scheme name
      const name = await vscode.window.showInputBox({
        prompt: 'Scheme name (e.g., blackmail, fabricate_claim)',
        placeHolder: 'blackmail',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Scheme name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Scheme name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Generate code
      const code = await generator.generateCode({
        template,
        category: 'scheme',
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} scheme`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add scheme: ${error}`);
      console.error('Add scheme error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
