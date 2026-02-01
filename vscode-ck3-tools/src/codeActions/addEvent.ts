import * as vscode from 'vscode';
import { TemplateGenerator } from '../lib/templateGenerator';

export function registerAddEventCommand(
  context: vscode.ExtensionContext,
  generator: TemplateGenerator
) {
  const disposable = vscode.commands.registerCommand('ck3-tools.addEvent', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      // Select template
      const templates = await generator.listTemplates('event');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select event template',
        title: 'Add Event'
      });

      if (!template) return;

      // Get event namespace
      const name = await vscode.window.showInputBox({
        prompt: 'Event namespace (e.g., my_events)',
        placeHolder: 'my_events',
        validateInput: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Namespace is required';
          }
          if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
            return 'Namespace must be lowercase with underscores only';
          }
          return null;
        }
      });

      if (!name) return;

      // Generate code
      const code = await generator.generateCode({
        template,
        category: 'event',
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} events`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add event: ${error}`);
      console.error('Add event error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
