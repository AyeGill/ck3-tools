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
exports.registerAddActivityCommand = registerAddActivityCommand;
const vscode = __importStar(require("vscode"));
function registerAddActivityCommand(context, generator) {
    const disposable = vscode.commands.registerCommand('ck3-tools.addActivity', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        try {
            // Select template
            const templates = await generator.listTemplates('activity');
            const template = await vscode.window.showQuickPick(templates, {
                placeHolder: 'Select activity template',
                title: 'Add Activity Type'
            });
            if (!template)
                return;
            // Get activity name
            const name = await vscode.window.showInputBox({
                prompt: 'Activity name (e.g., grand_tournament, pilgrimage)',
                placeHolder: 'grand_tournament',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Activity name is required';
                    }
                    if (!/^[a-z_][a-z0-9_]*$/.test(value)) {
                        return 'Activity name must be lowercase with underscores only';
                    }
                    return null;
                }
            });
            if (!name)
                return;
            // Generate code
            const code = await generator.generateCode({
                template,
                category: 'activity',
                name
            });
            // Insert at cursor
            editor.edit((editBuilder) => {
                const position = editor.selection.active;
                editBuilder.insert(position, code);
            });
            vscode.window.showInformationMessage(`Added ${name} activity`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to add activity: ${error}`);
            console.error('Add activity error:', error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=addActivity.js.map