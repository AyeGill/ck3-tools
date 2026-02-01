"use strict";
/**
 * Formatter for outputting CK3 script format
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CK3Formatter = void 0;
exports.formatModifier = formatModifier;
exports.formatAIValue = formatAIValue;
class CK3Formatter {
    constructor() {
        this.indentLevel = 0;
        this.indentString = '\t';
        this.output = [];
    }
    /**
     * Start a new block
     */
    startBlock(name, value) {
        if (value) {
            this.writeLine(`${name} = ${value} {`);
        }
        else {
            this.writeLine(`${name} = {`);
        }
        this.indent();
        return this;
    }
    /**
     * End the current block
     */
    endBlock() {
        this.dedent();
        this.writeLine('}');
        return this;
    }
    /**
     * Write a key-value pair
     */
    writeProperty(key, value) {
        const formattedValue = typeof value === 'string'
            ? (value.includes(' ') ? `"${value}"` : value)
            : value;
        this.writeLine(`${key} = ${formattedValue}`);
        return this;
    }
    /**
     * Write a comment
     */
    writeComment(comment) {
        this.writeLine(`# ${comment}`);
        return this;
    }
    /**
     * Write a blank line
     */
    writeLine(line = '') {
        if (line) {
            this.output.push(this.getIndent() + line);
        }
        else {
            this.output.push('');
        }
        return this;
    }
    /**
     * Increase indent level
     */
    indent() {
        this.indentLevel++;
    }
    /**
     * Decrease indent level
     */
    dedent() {
        if (this.indentLevel > 0) {
            this.indentLevel--;
        }
    }
    /**
     * Get current indentation string
     */
    getIndent() {
        return this.indentString.repeat(this.indentLevel);
    }
    /**
     * Get the formatted output
     */
    toString() {
        return this.output.join('\n') + '\n';
    }
    /**
     * Reset the formatter
     */
    reset() {
        this.indentLevel = 0;
        this.output = [];
        return this;
    }
}
exports.CK3Formatter = CK3Formatter;
/**
 * Format a modifier block
 */
function formatModifier(scope, effects) {
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
function formatAIValue(baseValue, modifiers) {
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
//# sourceMappingURL=formatter.js.map