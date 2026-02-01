import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddDecisionCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addDecision', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('decision');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select decision template',
        title: 'Add Decision'
      });

      if (!template) return;

      // Get decision name
      const name = await vscode.window.showInputBox({
        prompt: 'Decision name (e.g., hold_feast)',
        placeHolder: 'hold_feast',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Decision name is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Decision name must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Generate code
      const code = await generator.generateDecisionCode({
        template,
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} decision`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add decision: ${error}`);
      console.error('Add decision error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
