/**
 * Mock VSCode module for testing
 *
 * Provides mock implementations of VSCode APIs used by the extension
 */

export class Position {
  constructor(public line: number, public character: number) {}
}

export class Range {
  constructor(public start: Position, public end: Position) {}
}

export class MarkdownString {
  value: string = '';

  appendMarkdown(value: string): this {
    this.value += value;
    return this;
  }

  appendText(value: string): this {
    this.value += value;
    return this;
  }
}

export class Hover {
  constructor(public contents: MarkdownString | string) {}
}

export class SnippetString {
  value: string;

  constructor(value: string = '') {
    this.value = value;
  }

  appendText(string: string): this {
    this.value += string;
    return this;
  }

  appendPlaceholder(value: string | ((snippet: SnippetString) => any), number?: number): this {
    if (typeof value === 'function') {
      const nested = new SnippetString();
      value(nested);
      this.value += `\${${number ?? 1}:${nested.value}}`;
    } else {
      this.value += `\${${number ?? 1}:${value}}`;
    }
    return this;
  }
}

export class CompletionItem {
  label: string;
  kind?: CompletionItemKind;
  detail?: string;
  documentation?: string | MarkdownString;
  insertText?: string | SnippetString;

  constructor(label: string, kind?: CompletionItemKind) {
    this.label = label;
    this.kind = kind;
  }
}

export enum CompletionItemKind {
  Text = 0,
  Method = 1,
  Function = 2,
  Constructor = 3,
  Field = 4,
  Variable = 5,
  Class = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Unit = 10,
  Value = 11,
  Enum = 12,
  Keyword = 13,
  Snippet = 14,
  Color = 15,
  File = 16,
  Reference = 17,
  Folder = 18,
  EnumMember = 19,
  Constant = 20,
  Struct = 21,
  Event = 22,
  Operator = 23,
  TypeParameter = 24,
}

export class CompletionList {
  items: CompletionItem[];
  isIncomplete: boolean;

  constructor(items: CompletionItem[] = [], isIncomplete: boolean = false) {
    this.items = items;
    this.isIncomplete = isIncomplete;
  }
}

/**
 * Mock TextLine
 */
export interface TextLine {
  text: string;
  lineNumber: number;
}

/**
 * Mock TextDocument for testing
 */
export class MockTextDocument {
  private lines: string[];
  public fileName: string;
  public uri: Uri;
  public languageId: string = 'ck3';

  constructor(content: string, fileName: string) {
    this.lines = content.split('\n');
    this.fileName = fileName;
    this.uri = Uri.file(fileName);
  }

  lineAt(line: number | Position): TextLine {
    const lineNum = typeof line === 'number' ? line : line.line;
    return {
      text: this.lines[lineNum] || '',
      lineNumber: lineNum,
    };
  }

  getText(range?: Range): string {
    if (!range) {
      return this.lines.join('\n');
    }
    // Simple implementation for single line ranges
    const line = this.lines[range.start.line];
    return line.substring(range.start.character, range.end.character);
  }

  getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined {
    const line = this.lines[position.line];
    if (!line) return undefined;

    const pattern = regex || /[\w_]+/g;
    let match;

    // Reset lastIndex for global regex
    pattern.lastIndex = 0;

    while ((match = pattern.exec(line)) !== null) {
      const start = match.index;
      const end = start + match[0].length;

      if (position.character >= start && position.character <= end) {
        return new Range(
          new Position(position.line, start),
          new Position(position.line, end)
        );
      }
    }

    return undefined;
  }

  get lineCount(): number {
    return this.lines.length;
  }

  positionAt(offset: number): Position {
    let remaining = offset;
    for (let line = 0; line < this.lines.length; line++) {
      const lineLength = this.lines[line].length + 1; // +1 for newline
      if (remaining < lineLength) {
        return new Position(line, remaining);
      }
      remaining -= lineLength;
    }
    return new Position(this.lines.length - 1, this.lines[this.lines.length - 1]?.length || 0);
  }
}

/**
 * Create a mock document from content and file path
 */
export function createMockDocument(content: string, fileName: string): MockTextDocument {
  return new MockTextDocument(content, fileName);
}

// Export namespace for types that are accessed as vscode.X
export const languages = {
  registerCompletionItemProvider: () => ({ dispose: () => {} }),
  registerHoverProvider: () => ({ dispose: () => {} }),
  createDiagnosticCollection: (name: string) => new DiagnosticCollection(),
};

export const window = {
  showInformationMessage: () => {},
  showErrorMessage: () => {},
};

export const workspace = {
  getConfiguration: () => ({
    get: () => undefined,
  }),
};

// CancellationToken mock
export const CancellationToken = {
  isCancellationRequested: false,
  onCancellationRequested: () => ({ dispose: () => {} }),
};

// CompletionContext mock
export interface CompletionContext {
  triggerKind: number;
  triggerCharacter?: string;
}

export const CompletionTriggerKind = {
  Invoke: 0,
  TriggerCharacter: 1,
  TriggerForIncompleteCompletions: 2,
};

// DiagnosticSeverity enum for diagnostics testing
export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}

// Mock Diagnostic class
export class Diagnostic {
  range: Range;
  message: string;
  severity: DiagnosticSeverity;

  constructor(range: Range, message: string, severity: DiagnosticSeverity = DiagnosticSeverity.Error) {
    this.range = range;
    this.message = message;
    this.severity = severity;
  }
}

// Mock DiagnosticCollection
export class DiagnosticCollection {
  private diagnostics: Map<string, Diagnostic[]> = new Map();

  set(uri: { toString(): string } | string, diagnostics: Diagnostic[]): void {
    const key = typeof uri === 'string' ? uri : uri.toString();
    this.diagnostics.set(key, diagnostics);
  }

  get(uri: { toString(): string } | string): Diagnostic[] | undefined {
    const key = typeof uri === 'string' ? uri : uri.toString();
    return this.diagnostics.get(key);
  }

  delete(uri: { toString(): string } | string): void {
    const key = typeof uri === 'string' ? uri : uri.toString();
    this.diagnostics.delete(key);
  }

  clear(): void {
    this.diagnostics.clear();
  }

  dispose(): void {
    this.clear();
  }
}

// Mock Uri
export class Uri {
  readonly scheme: string = 'file';
  readonly path: string;
  readonly fsPath: string;

  constructor(path: string) {
    this.path = path;
    this.fsPath = path;
  }

  toString(): string {
    return `file://${this.path}`;
  }

  static file(path: string): Uri {
    return new Uri(path);
  }
}
