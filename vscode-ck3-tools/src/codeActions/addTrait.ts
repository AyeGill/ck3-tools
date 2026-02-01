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
      // Select template
      const templates = await generator.listTemplates('trait');
      const template = await vscode.window.showQuickPick(templates, {
        placeHolder: 'Select trait template',
        title: 'Add Trait'
      });

      if (!template) return;

      // Get trait name
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

      if (!name) return;

      // Generate code
      const code = await generator.generateCode({
        template,
        category: 'trait',
        name
      });

      // Insert at cursor
      editor.edit((editBuilder) => {
        const position = editor.selection.active;
        editBuilder.insert(position, code);
      });

      vscode.window.showInformationMessage(`Added ${name} trait from ${template} template`);

      // Ask if user wants to generate localization
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
