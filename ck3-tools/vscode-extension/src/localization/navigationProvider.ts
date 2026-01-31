import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

/**
 * Find localization file for current file
 */
async function findLocalizationFile(filePath: string): Promise<string | null> {
  // Find mod root
  let dir = path.dirname(filePath);
  for (let i = 0; i < 10; i++) {
    const descriptorPath = path.join(dir, 'descriptor.mod');
    try {
      await fs.access(descriptorPath);
      // Found mod root
      const locDir = path.join(dir, 'localization', 'english');
      const baseName = path.basename(filePath, '.txt');
      const locFileName = `${baseName}_l_english.yml`;
      const locFilePath = path.join(locDir, locFileName);

      try {
        await fs.access(locFilePath);
        return locFilePath;
      } catch {
        // Localization file doesn't exist yet
        return null;
      }
    } catch {
      // Continue searching
    }
    dir = path.dirname(dir);
  }
  return null;
}

/**
 * Get word at cursor position
 */
function getWordAtPosition(document: vscode.TextDocument, position: vscode.Position): string {
  const range = document.getWordRangeAtPosition(position, /[a-z_][a-z0-9_]*/);
  if (range) {
    return document.getText(range);
  }
  return '';
}

export function registerGoToLocalizationCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('ck3-tools.goToLocalization', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('No active editor');
      return;
    }

    try {
      const document = editor.document;
      const filePath = document.fileName;

      // Find localization file
      const locFilePath = await findLocalizationFile(filePath);
      if (!locFilePath) {
        const generate = await vscode.window.showQuickPick(['Yes', 'No'], {
          placeHolder: 'Localization file not found. Generate it?'
        });

        if (generate === 'Yes') {
          await vscode.commands.executeCommand('ck3-tools.generateLocalization');
        }
        return;
      }

      // Open localization file
      const doc = await vscode.workspace.openTextDocument(locFilePath);
      await vscode.window.showTextDocument(doc, { preview: false });

      // Try to find the localization key for the word at cursor
      const word = getWordAtPosition(document, editor.selection.active);
      if (word) {
        // Determine the likely localization key
        const fileType = filePath.includes('/traits/')
          ? 'trait'
          : filePath.includes('/buildings/')
          ? 'building'
          : filePath.includes('/decisions/')
          ? 'decision'
          : null;

        if (fileType) {
          const key = `${fileType}_${word}`;
          const text = doc.getText();
          const keyIndex = text.indexOf(key);
          if (keyIndex !== -1) {
            const position = doc.positionAt(keyIndex);
            const newEditor = vscode.window.activeTextEditor;
            if (newEditor) {
              newEditor.selection = new vscode.Selection(position, position);
              newEditor.revealRange(new vscode.Range(position, position));
            }
          }
        }
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to navigate to localization: ${error}`);
      console.error('Go to localization error:', error);
    }
  });

  context.subscriptions.push(disposable);
}
