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
exports.registerAddEventCommand = registerAddEventCommand;
const vscode = __importStar(require("vscode"));
/**
 * Find if a namespace already exists in the document
 * Returns the line number of the namespace declaration, or -1 if not found
 */
function findNamespaceInDocument(document, namespace) {
    const text = document.getText();
    const pattern = new RegExp(`^\\s*namespace\\s*=\\s*${namespace}\\s*$`, 'm');
    const match = pattern.exec(text);
    if (match) {
        const position = document.positionAt(match.index);
        return position.line;
    }
    return -1;
}
/**
 * Find the best insertion point for a new event in an existing namespace
 * This finds the end of the last top-level block (event definition)
 */
function findInsertionPoint(document, namespace) {
    const text = document.getText();
    const lines = text.split('\n');
    // Find all events in this namespace (pattern: namespace.XXXX = {)
    const eventPattern = new RegExp(`^\\s*${namespace}\\.\\d+\\s*=\\s*\\{`, 'gm');
    let lastEventStart = -1;
    let match;
    while ((match = eventPattern.exec(text)) !== null) {
        const pos = document.positionAt(match.index);
        lastEventStart = pos.line;
    }
    if (lastEventStart === -1) {
        // No events found, insert at end of file
        return new vscode.Position(lines.length, 0);
    }
    // Find the closing brace of this event by counting braces
    let braceCount = 0;
    let foundOpen = false;
    let lastEventEnd = lastEventStart;
    for (let i = lastEventStart; i < lines.length; i++) {
        const line = lines[i];
        for (const char of line) {
            if (char === '{') {
                braceCount++;
                foundOpen = true;
            }
            else if (char === '}') {
                braceCount--;
            }
        }
        if (foundOpen && braceCount === 0) {
            lastEventEnd = i;
            break;
        }
    }
    // Insert after the closing brace, with a blank line
    return new vscode.Position(lastEventEnd + 1, 0);
}
/**
 * Find the highest event ID in use for a namespace
 */
function findHighestEventId(document, namespace) {
    const text = document.getText();
    const eventPattern = new RegExp(`${namespace}\\.(\\d+)\\s*=`, 'g');
    let highest = 0;
    let match;
    while ((match = eventPattern.exec(text)) !== null) {
        const id = parseInt(match[1], 10);
        if (id > highest) {
            highest = id;
        }
    }
    return highest;
}
/**
 * Strip the namespace declaration line from generated code
 */
function stripNamespaceLine(code, namespace) {
    // Remove the "namespace = X" line and any following blank lines
    const pattern = new RegExp(`^\\s*namespace\\s*=\\s*${namespace}\\s*\\n+`, 'm');
    return code.replace(pattern, '');
}
/**
 * Replace event ID in generated code
 */
function replaceEventId(code, namespace, oldId, newId) {
    // Replace all occurrences of namespace.oldId with namespace.newId
    const pattern = new RegExp(`${namespace}\\.${oldId}`, 'g');
    return code.replace(pattern, `${namespace}.${newId}`);
}
function registerAddEventCommand(context, generator) {
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
            if (!template)
                return;
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
            if (!name)
                return;
            // Generate code
            let code = await generator.generateCode({
                template,
                category: 'event',
                name
            });
            // Check if namespace already exists in the document
            const document = editor.document;
            const existingNamespaceLine = findNamespaceInDocument(document, name);
            let insertPosition;
            if (existingNamespaceLine !== -1) {
                // Namespace exists - strip namespace line and find insertion point
                code = stripNamespaceLine(code, name);
                // Find highest existing event ID and increment
                const highestId = findHighestEventId(document, name);
                if (highestId > 0) {
                    // Replace the default 0001 with the next available ID
                    const newId = String(highestId + 1).padStart(4, '0');
                    code = replaceEventId(code, name, '0001', newId);
                }
                // Find where to insert (after last event in this namespace)
                insertPosition = findInsertionPoint(document, name);
                // Ensure there's a blank line before the new event
                if (insertPosition.line > 0) {
                    const prevLine = document.lineAt(insertPosition.line - 1).text.trim();
                    if (prevLine !== '' && !code.startsWith('\n')) {
                        code = '\n' + code;
                    }
                }
            }
            else {
                // New namespace - insert at cursor position
                insertPosition = editor.selection.active;
            }
            // Insert the code
            await editor.edit((editBuilder) => {
                editBuilder.insert(insertPosition, code);
            });
            // Move cursor to the inserted position
            const newPosition = new vscode.Position(insertPosition.line + 1, 0);
            editor.selection = new vscode.Selection(newPosition, newPosition);
            editor.revealRange(new vscode.Range(newPosition, newPosition));
            if (existingNamespaceLine !== -1) {
                vscode.window.showInformationMessage(`Added event to existing ${name} namespace`);
            }
            else {
                vscode.window.showInformationMessage(`Added ${name} events`);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to add event: ${error}`);
            console.error('Add event error:', error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=addEvent.js.map