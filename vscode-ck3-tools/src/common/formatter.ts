/**
 * Formatter for outputting CK3 script format
 */

export class CK3Formatter {
  private indentLevel = 0;
  private indentString = '\t';
  private output: string[] = [];

  /**
   * Start a new block
   */
  startBlock(name: string, value?: string): this {
    if (value) {
      this.writeLine(`${name} = ${value} {`);
    } else {
      this.writeLine(`${name} = {`);
    }
    this.indent();
    return this;
  }

  /**
   * End the current block
   */
  endBlock(): this {
    this.dedent();
    this.writeLine('}');
    return this;
  }

  /**
   * Write a key-value pair
   */
  writeProperty(key: string, value: string | number | boolean): this {
    const formattedValue = typeof value === 'string'
      ? (value.includes(' ') ? `"${value}"` : value)
      : value;
    this.writeLine(`${key} = ${formattedValue}`);
    return this;
  }

  /**
   * Write a comment
   */
  writeComment(comment: string): this {
    this.writeLine(`# ${comment}`);
    return this;
  }

  /**
   * Write a blank line
   */
  writeLine(line: string = ''): this {
    if (line) {
      this.output.push(this.getIndent() + line);
    } else {
      this.output.push('');
    }
    return this;
  }

  /**
   * Increase indent level
   */
  private indent(): void {
    this.indentLevel++;
  }

  /**
   * Decrease indent level
   */
  private dedent(): void {
    if (this.indentLevel > 0) {
      this.indentLevel--;
    }
  }

  /**
   * Get current indentation string
   */
  private getIndent(): string {
    return this.indentString.repeat(this.indentLevel);
  }

  /**
   * Get the formatted output
   */
  toString(): string {
    return this.output.join('\n') + '\n';
  }

  /**
   * Reset the formatter
   */
  reset(): this {
    this.indentLevel = 0;
    this.output = [];
    return this;
  }
}

/**
 * Format a modifier block
 */
export function formatModifier(
  scope: string,
  effects: Record<string, number>
): string {
  const formatter = new CK3Formatter();
  formatter.startBlock(`${scope}_modifier`);

  for (const [key, value] of Object.entries(effects)) {
    formatter.writeProperty(key, value);
  }

  formatter.endBlock();
  return formatter.toString();
}

/**
 * Format an AI value block with modifiers
 */
export function formatAIValue(
  baseValue: number,
  modifiers?: Array<{ condition: string; add?: number; factor?: number }>
): string {
  const formatter = new CK3Formatter();
  formatter.startBlock('ai_value');
  formatter.writeProperty('base', baseValue);

  if (modifiers) {
    for (const mod of modifiers) {
      formatter.startBlock('modifier');
      if (mod.add !== undefined) {
        formatter.writeProperty('add', mod.add);
      }
      if (mod.factor !== undefined) {
        formatter.writeProperty('factor', mod.factor);
      }
      formatter.writeLine(mod.condition);
      formatter.endBlock();
    }
  }

  formatter.endBlock();
  return formatter.toString();
}
