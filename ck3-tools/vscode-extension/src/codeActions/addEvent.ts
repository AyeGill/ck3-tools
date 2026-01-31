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

      // Get namespace
      const namespace = await vscode.window.showInputBox({
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

      if (!namespace) return;

      // Get event ID
      const eventIdStr = await vscode.window.showInputBox({
        prompt: 'Event ID (e.g., 1, 1001)',
        value: '1',
        validateInput: (value) => {
          const num = parseInt(value);
          if (isNaN(num) || num < 0) {
            return 'Event ID must be a positive number';
          }
          return null;
        }
      });

      if (!eventIdStr) return;
      const event_id = parseInt(eventIdStr);

      // Generate code
      const code = await generator.generateEventCode({
        template,
        name: namespace,
        namespace,
        event_id
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added event ${namespace}.${event_id}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add event: ${error}`);
      console.error('Add event error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
