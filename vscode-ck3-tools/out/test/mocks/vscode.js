"use strict";
/**
 * Mock VSCode module for testing
 *
 * Provides mock implementations of VSCode APIs used by the extension
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompletionTriggerKind = exports.CancellationToken = exports.workspace = exports.window = exports.languages = exports.MockTextDocument = exports.CompletionList = exports.CompletionItemKind = exports.CompletionItem = exports.SnippetString = exports.Hover = exports.MarkdownString = exports.Range = exports.Position = void 0;
exports.createMockDocument = createMockDocument;
class Position {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
}
exports.Position = Position;
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
exports.Range = Range;
class MarkdownString {
    constructor() {
        this.value = '';
    }
    appendMarkdown(value) {
        this.value += value;
        return this;
    }
    appendText(value) {
        this.value += value;
        return this;
    }
}
exports.MarkdownString = MarkdownString;
class Hover {
    constructor(contents) {
        this.contents = contents;
    }
}
exports.Hover = Hover;
class SnippetString {
    constructor(value = '') {
        this.value = value;
    }
    appendText(string) {
        this.value += string;
        return this;
    }
    appendPlaceholder(value, number) {
        if (typeof value === 'function') {
            const nested = new SnippetString();
            value(nested);
            this.value += `\${${number ?? 1}:${nested.value}}`;
        }
        else {
            this.value += `\${${number ?? 1}:${value}}`;
        }
        return this;
    }
}
exports.SnippetString = SnippetString;
class CompletionItem {
    constructor(label, kind) {
        this.label = label;
        this.kind = kind;
    }
}
exports.CompletionItem = CompletionItem;
var CompletionItemKind;
(function (CompletionItemKind) {
    CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
    CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
    CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
    CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
    CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
    CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
    CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
    CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
    CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
    CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
    CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
    CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
    CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
    CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
    CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
    CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
    CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
    CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
    CompletionItemKind[CompletionItemKind["Folder"] = 18] = "Folder";
    CompletionItemKind[CompletionItemKind["EnumMember"] = 19] = "EnumMember";
    CompletionItemKind[CompletionItemKind["Constant"] = 20] = "Constant";
    CompletionItemKind[CompletionItemKind["Struct"] = 21] = "Struct";
    CompletionItemKind[CompletionItemKind["Event"] = 22] = "Event";
    CompletionItemKind[CompletionItemKind["Operator"] = 23] = "Operator";
    CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
})(CompletionItemKind || (exports.CompletionItemKind = CompletionItemKind = {}));
class CompletionList {
    constructor(items = [], isIncomplete = false) {
        this.items = items;
        this.isIncomplete = isIncomplete;
    }
}
exports.CompletionList = CompletionList;
/**
 * Mock TextDocument for testing
 */
class MockTextDocument {
    constructor(content, fileName) {
        this.lines = content.split('\n');
        this.fileName = fileName;
    }
    lineAt(line) {
        const lineNum = typeof line === 'number' ? line : line.line;
        return {
            text: this.lines[lineNum] || '',
            lineNumber: lineNum,
        };
    }
    getText(range) {
        if (!range) {
            return this.lines.join('\n');
        }
        // Simple implementation for single line ranges
        const line = this.lines[range.start.line];
        return line.substring(range.start.character, range.end.character);
    }
    getWordRangeAtPosition(position, regex) {
        const line = this.lines[position.line];
        if (!line)
            return undefined;
        const pattern = regex || /[\w_]+/g;
        let match;
        // Reset lastIndex for global regex
        pattern.lastIndex = 0;
        while ((match = pattern.exec(line)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            if (position.character >= start && position.character <= end) {
                return new Range(new Position(position.line, start), new Position(position.line, end));
            }
        }
        return undefined;
    }
    get lineCount() {
        return this.lines.length;
    }
}
exports.MockTextDocument = MockTextDocument;
/**
 * Create a mock document from content and file path
 */
function createMockDocument(content, fileName) {
    return new MockTextDocument(content, fileName);
}
// Export namespace for types that are accessed as vscode.X
exports.languages = {
    registerCompletionItemProvider: () => ({ dispose: () => { } }),
    registerHoverProvider: () => ({ dispose: () => { } }),
};
exports.window = {
    showInformationMessage: () => { },
    showErrorMessage: () => { },
};
exports.workspace = {
    getConfiguration: () => ({
        get: () => undefined,
    }),
};
// CancellationToken mock
exports.CancellationToken = {
    isCancellationRequested: false,
    onCancellationRequested: () => ({ dispose: () => { } }),
};
exports.CompletionTriggerKind = {
    Invoke: 0,
    TriggerCharacter: 1,
    TriggerForIncompleteCompletions: 2,
};
//# sourceMappingURL=vscode.js.map