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
exports.registerAddDecisionCommand = registerAddDecisionCommand;
const vscode = __importStar(require("vscode"));
function registerAddDecisionCommand(context, generator) {
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
            if (!template)
                return;
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
            if (!name)
                return;
            // Generate code
            const code = await generator.generateCode({
                template,
                category: 'decision',
                name
            });
            // Insert at cursor
            editor.edit((editBuilder) => {
                const position = editor.selection.active;
                editBuilder.insert(position, code);
            });
            vscode.window.showInformationMessage(`Added ${name} decision`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to add decision: ${error}`);
            console.error('Add decision error:', error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=addDecision.js.map