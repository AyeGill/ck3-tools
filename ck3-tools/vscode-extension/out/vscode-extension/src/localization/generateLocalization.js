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
exports.registerGenerateLocalizationCommand = registerGenerateLocalizationCommand;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
/**
 * Parse CK3 file and extract localization keys
 */
function extractLocalizationKeys(content, fileType) {
    const keys = [];
    if (fileType === 'trait') {
        // Extract trait names from trait definitions
        // Pattern: trait_name = {
        const traitPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = traitPattern.exec(content)) !== null) {
            const traitName = match[1];
            keys.push({
                key: `trait_${traitName}`,
                defaultText: formatName(traitName)
            });
            keys.push({
                key: `trait_${traitName}_desc`,
                defaultText: `Description for ${formatName(traitName)}`
            });
        }
    }
    else if (fileType === 'building') {
        // Extract building names
        const buildingPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = buildingPattern.exec(content)) !== null) {
            const buildingName = match[1];
            keys.push({
                key: `building_${buildingName}`,
                defaultText: formatName(buildingName)
            });
            keys.push({
                key: `building_${buildingName}_desc`,
                defaultText: `Description for ${formatName(buildingName)}`
            });
        }
    }
    else if (fileType === 'decision') {
        // Extract decision names
        const decisionPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = decisionPattern.exec(content)) !== null) {
            const decisionName = match[1];
            keys.push({
                key: `decision_${decisionName}`,
                defaultText: formatName(decisionName)
            });
            keys.push({
                key: `decision_${decisionName}_desc`,
                defaultText: `Description for ${formatName(decisionName)}`
            });
            keys.push({
                key: `decision_${decisionName}_confirm`,
                defaultText: 'Confirm'
            });
        }
    }
    else if (fileType === 'event') {
        // Extract event IDs
        // Pattern: namespace.id = {
        const eventPattern = /^([a-z_][a-z0-9_]*)\.(\d+)\s*=\s*\{/gm;
        let match;
        while ((match = eventPattern.exec(content)) !== null) {
            const namespace = match[1];
            const eventId = match[2];
            keys.push({
                key: `${namespace}.${eventId}`,
                defaultText: 'Event Title'
            });
            keys.push({
                key: `${namespace}.${eventId}_desc`,
                defaultText: 'Event description'
            });
            keys.push({
                key: `${namespace}.${eventId}.a`,
                defaultText: 'First option'
            });
            keys.push({
                key: `${namespace}.${eventId}.b`,
                defaultText: 'Second option'
            });
        }
    }
    return keys;
}
/**
 * Format name for display (e.g., "my_trait" -> "My Trait")
 */
function formatName(name) {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
/**
 * Determine file type from path
 */
function getFileType(filePath) {
    if (filePath.includes('/common/traits/'))
        return 'trait';
    if (filePath.includes('/common/buildings/'))
        return 'building';
    if (filePath.includes('/common/decisions/'))
        return 'decision';
    if (filePath.includes('/events/'))
        return 'event';
    return null;
}
/**
 * Find localization directory for mod
 */
function findLocalizationDir(filePath) {
    // Go up directories until we find the mod root (has descriptor.mod)
    let dir = path.dirname(filePath);
    for (let i = 0; i < 10; i++) {
        const descriptorPath = path.join(dir, 'descriptor.mod');
        try {
            // Check if descriptor exists (sync check is ok here)
            if (require('fs').existsSync(descriptorPath)) {
                return path.join(dir, 'localization', 'english');
            }
        }
        catch (e) {
            // Continue searching
        }
        dir = path.dirname(dir);
    }
    return null;
}
function registerGenerateLocalizationCommand(context, generator) {
    const disposable = vscode.commands.registerCommand('ck3-tools.generateLocalization', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        try {
            const document = editor.document;
            const filePath = document.fileName;
            const fileType = getFileType(filePath);
            if (!fileType) {
                vscode.window.showWarningMessage('This file type does not require localization');
                return;
            }
            // Extract keys from current file
            const content = document.getText();
            const keys = extractLocalizationKeys(content, fileType);
            if (keys.length === 0) {
                vscode.window.showInformationMessage('No localization keys found in this file');
                return;
            }
            // Find localization directory
            const locDir = findLocalizationDir(filePath);
            if (!locDir) {
                vscode.window.showErrorMessage('Could not find mod localization directory');
                return;
            }
            // Generate filename from source file
            const baseName = path.basename(filePath, '.txt');
            const locFileName = `${baseName}_l_english.yml`;
            const locFilePath = path.join(locDir, locFileName);
            // Check if localization file already exists
            let existingKeys = new Set();
            let existingContent = '';
            try {
                existingContent = await fs.readFile(locFilePath, 'utf-8');
                // Parse existing keys
                const lines = existingContent.split('\n');
                for (const line of lines) {
                    const match = line.match(/^\s*([a-z_][a-z0-9_.]*):(\d+)\s+".*"$/);
                    if (match) {
                        existingKeys.add(match[1]);
                    }
                }
            }
            catch {
                // File doesn't exist yet, that's fine
            }
            // Filter out keys that already exist
            const newKeys = keys.filter(k => !existingKeys.has(k.key));
            if (newKeys.length === 0) {
                vscode.window.showInformationMessage('All localization keys already exist');
                return;
            }
            // Generate localization for new keys only
            const newLocalization = generator.generateLocalization(newKeys);
            // Merge with existing content
            let finalContent;
            if (existingContent) {
                // Remove the UTF-8 BOM header from new content if present
                const newLines = newLocalization.replace(/^\ufeff/, '').replace(/^l_english:\s*\n/, '');
                // Append new keys to existing file
                finalContent = existingContent.trimEnd() + '\n' + newLines;
            }
            else {
                // New file, use as-is
                finalContent = newLocalization;
            }
            // Write localization file
            await fs.mkdir(locDir, { recursive: true });
            await fs.writeFile(locFilePath, finalContent, 'utf-8');
            vscode.window.showInformationMessage(`Added ${newKeys.length} new localization keys to ${locFileName} (${existingKeys.size} keys already existed)`);
            // Ask if user wants to open the localization file
            const openFile = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Open localization file?'
            });
            if (openFile === 'Yes') {
                const doc = await vscode.workspace.openTextDocument(locFilePath);
                await vscode.window.showTextDocument(doc);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to generate localization: ${error}`);
            console.error('Generate localization error:', error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=generateLocalization.js.map