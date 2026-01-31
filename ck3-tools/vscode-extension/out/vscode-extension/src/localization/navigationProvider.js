"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGoToLocalizationCommand = registerGoToLocalizationCommand;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
/**
 * Find localization file for current file
 */
async function findLocalizationFile(filePath) {
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
            }
            catch {
                // Localization file doesn't exist yet
                return null;
            }
        }
        catch {
            // Continue searching
        }
        dir = path.dirname(dir);
    }
    return null;
}
/**
 * Get word at cursor position
 */
function getWordAtPosition(document, position) {
    const range = document.getWordRangeAtPosition(position, /[a-z_][a-z0-9_]*/);
    if (range) {
        return document.getText(range);
    }
    return '';
}
function registerGoToLocalizationCommand(context) {
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
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to navigate to localization: ${error}`);
            console.error('Go to localization error:', error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=navigationProvider.js.map