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
exports.CK3DiagnosticsProvider = void 0;
const vscode = __importStar(require("vscode"));
// Import all schemas we want to validate
const traitSchema_1 = require("../schemas/traitSchema");
const eventSchema_1 = require("../schemas/eventSchema");
const decisionSchema_1 = require("../schemas/decisionSchema");
const interactionSchema_1 = require("../schemas/interactionSchema");
const buildingSchema_1 = require("../schemas/buildingSchema");
const artifactSchema_1 = require("../schemas/artifactSchema");
const schemeSchema_1 = require("../schemas/schemeSchema");
const opinionModifierSchema_1 = require("../schemas/opinionModifierSchema");
const nicknameSchema_1 = require("../schemas/nicknameSchema");
const modifierSchema_1 = require("../schemas/modifierSchema");
const secretSchema_1 = require("../schemas/secretSchema");
const activitySchema_1 = require("../schemas/activitySchema");
/**
 * Schema registry mapping file types to their schemas
 */
const SCHEMA_REGISTRY = new Map([
    ['trait', { schema: traitSchema_1.traitSchema, schemaMap: traitSchema_1.traitSchemaMap }],
    ['event', { schema: eventSchema_1.eventSchema, schemaMap: eventSchema_1.eventSchemaMap }],
    ['decision', { schema: decisionSchema_1.decisionSchema, schemaMap: decisionSchema_1.decisionSchemaMap }],
    ['interaction', { schema: interactionSchema_1.interactionSchema, schemaMap: interactionSchema_1.interactionSchemaMap }],
    ['building', { schema: buildingSchema_1.buildingSchema, schemaMap: buildingSchema_1.buildingSchemaMap }],
    ['artifact', { schema: artifactSchema_1.artifactSchema, schemaMap: artifactSchema_1.artifactSchemaMap }],
    ['scheme', { schema: schemeSchema_1.schemeSchema, schemaMap: schemeSchema_1.schemeSchemaMap }],
    ['opinion_modifier', { schema: opinionModifierSchema_1.opinionModifierSchema, schemaMap: opinionModifierSchema_1.opinionModifierSchemaMap }],
    ['nickname', { schema: nicknameSchema_1.nicknameSchema, schemaMap: nicknameSchema_1.nicknameSchemaMap }],
    ['modifier', { schema: modifierSchema_1.modifierSchema, schemaMap: modifierSchema_1.modifierSchemaMap }],
    ['secret', { schema: secretSchema_1.secretSchema, schemaMap: secretSchema_1.secretSchemaMap }],
    ['activity', { schema: activitySchema_1.activitySchema, schemaMap: activitySchema_1.activitySchemaMap }],
]);
/**
 * CK3 Diagnostics Provider
 * Provides linting and validation for CK3 mod files
 */
class CK3DiagnosticsProvider {
    constructor() {
        this.debounceTimers = new Map();
        this.DEBOUNCE_DELAY = 300; // ms
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('ck3');
    }
    /**
     * Get the diagnostic collection for disposal
     */
    getDiagnosticCollection() {
        return this.diagnosticCollection;
    }
    /**
     * Validate a document with debouncing
     */
    validateDocumentDebounced(document) {
        const uri = document.uri.toString();
        // Clear existing timer
        const existingTimer = this.debounceTimers.get(uri);
        if (existingTimer) {
            clearTimeout(existingTimer);
        }
        // Set new timer
        const timer = setTimeout(() => {
            this.validateDocument(document);
            this.debounceTimers.delete(uri);
        }, this.DEBOUNCE_DELAY);
        this.debounceTimers.set(uri, timer);
    }
    /**
     * Validate a document immediately
     */
    validateDocument(document) {
        // Only validate CK3 files
        if (document.languageId !== 'ck3') {
            return;
        }
        const fileType = this.getFileType(document.fileName);
        if (fileType === 'unknown') {
            // Clear diagnostics for unknown file types
            this.diagnosticCollection.set(document.uri, []);
            return;
        }
        const diagnostics = [];
        const text = document.getText();
        // Parse entities from the document
        const entities = this.parseEntities(text);
        // Get schema for this file type
        const schemaInfo = SCHEMA_REGISTRY.get(fileType);
        if (!schemaInfo) {
            this.diagnosticCollection.set(document.uri, []);
            return;
        }
        // Check for name collisions within the file
        const nameCollisions = this.checkNameCollisions(entities);
        for (const collision of nameCollisions) {
            const range = new vscode.Range(document.positionAt(this.getLineStart(text, collision.line)), document.positionAt(this.getLineEnd(text, collision.line)));
            diagnostics.push(new vscode.Diagnostic(range, `Duplicate ${fileType} name: "${collision.name}" (also defined on line ${collision.otherLine + 1})`, vscode.DiagnosticSeverity.Error));
        }
        // Validate each entity
        for (const entity of entities) {
            // Check for missing required fields
            const missingFields = this.checkRequiredFields(entity, schemaInfo.schema);
            for (const field of missingFields) {
                const range = new vscode.Range(new vscode.Position(entity.startLine, 0), new vscode.Position(entity.startLine, entity.name.length));
                diagnostics.push(new vscode.Diagnostic(range, `Missing required field: "${field}"`, vscode.DiagnosticSeverity.Warning));
            }
            // Check for invalid/unknown fields
            const invalidFields = this.checkInvalidFields(entity, schemaInfo.schemaMap, fileType);
            for (const invalid of invalidFields) {
                const line = document.lineAt(invalid.line);
                const fieldStart = line.text.indexOf(invalid.name);
                const range = new vscode.Range(new vscode.Position(invalid.line, fieldStart >= 0 ? fieldStart : 0), new vscode.Position(invalid.line, fieldStart >= 0 ? fieldStart + invalid.name.length : line.text.length));
                diagnostics.push(new vscode.Diagnostic(range, `Unknown field: "${invalid.name}"`, vscode.DiagnosticSeverity.Warning));
            }
            // Check for type mismatches
            const typeMismatches = this.checkTypeMismatches(entity, schemaInfo.schemaMap);
            for (const mismatch of typeMismatches) {
                const line = document.lineAt(mismatch.line);
                const valueStart = line.text.indexOf('=') + 1;
                const range = new vscode.Range(new vscode.Position(mismatch.line, valueStart), new vscode.Position(mismatch.line, line.text.length));
                diagnostics.push(new vscode.Diagnostic(range, mismatch.message, vscode.DiagnosticSeverity.Warning));
            }
            // Check for invalid enum values
            const invalidEnums = this.checkEnumValues(entity, schemaInfo.schemaMap);
            for (const invalid of invalidEnums) {
                const line = document.lineAt(invalid.line);
                const valueStart = line.text.indexOf('=') + 1;
                const range = new vscode.Range(new vscode.Position(invalid.line, valueStart), new vscode.Position(invalid.line, line.text.length));
                diagnostics.push(new vscode.Diagnostic(range, invalid.message, vscode.DiagnosticSeverity.Warning));
            }
        }
        this.diagnosticCollection.set(document.uri, diagnostics);
    }
    /**
     * Clear diagnostics for a document
     */
    clearDiagnostics(uri) {
        this.diagnosticCollection.delete(uri);
    }
    /**
     * Dispose of resources
     */
    dispose() {
        for (const timer of this.debounceTimers.values()) {
            clearTimeout(timer);
        }
        this.debounceTimers.clear();
        this.diagnosticCollection.dispose();
    }
    /**
     * Determine file type from path
     */
    getFileType(filePath) {
        const normalizedPath = filePath.replace(/\\/g, '/');
        if (normalizedPath.includes('/common/traits/'))
            return 'trait';
        if (normalizedPath.includes('/events/'))
            return 'event';
        if (normalizedPath.includes('/common/decisions/'))
            return 'decision';
        if (normalizedPath.includes('/common/character_interactions/'))
            return 'interaction';
        if (normalizedPath.includes('/common/buildings/'))
            return 'building';
        if (normalizedPath.includes('/common/artifacts/'))
            return 'artifact';
        if (normalizedPath.includes('/common/schemes/'))
            return 'scheme';
        if (normalizedPath.includes('/common/opinion_modifiers/'))
            return 'opinion_modifier';
        if (normalizedPath.includes('/common/nicknames/'))
            return 'nickname';
        if (normalizedPath.includes('/common/modifiers/'))
            return 'modifier';
        if (normalizedPath.includes('/common/secret_types/'))
            return 'secret';
        if (normalizedPath.includes('/common/activities/'))
            return 'activity';
        return 'unknown';
    }
    /**
     * Parse entities from document text
     * Returns top-level entity definitions (e.g., trait_name = { ... })
     */
    parseEntities(text) {
        const entities = [];
        const lines = text.split('\n');
        let currentEntity = null;
        let braceDepth = 0;
        let entityBraceStart = 0;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            // Skip comments and empty lines
            if (trimmed.startsWith('#') || trimmed === '') {
                continue;
            }
            // Remove inline comments
            const commentIndex = line.indexOf('#');
            const cleanLine = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
            // Count braces
            const openBraces = (cleanLine.match(/\{/g) || []).length;
            const closeBraces = (cleanLine.match(/\}/g) || []).length;
            // Check for entity start: name = { at brace depth 0
            if (braceDepth === 0 && openBraces > 0) {
                const match = cleanLine.match(/^\s*(\w+)\s*=\s*\{/);
                if (match) {
                    currentEntity = {
                        name: match[1],
                        startLine: i,
                        endLine: i,
                        fields: new Map()
                    };
                    entityBraceStart = 1;
                }
            }
            // Parse fields if we're inside an entity at depth 1
            if (currentEntity && braceDepth === 1 && openBraces === 0) {
                const fieldMatch = cleanLine.match(/^\s*(\w+)\s*=\s*(.+?)\s*$/);
                if (fieldMatch) {
                    const fieldName = fieldMatch[1];
                    const fieldValue = fieldMatch[2];
                    currentEntity.fields.set(fieldName, {
                        name: fieldName,
                        value: fieldValue,
                        line: i,
                        column: cleanLine.indexOf(fieldName)
                    });
                }
            }
            // Also catch fields that start a block (field = {)
            if (currentEntity && braceDepth === 1 && openBraces > 0) {
                const blockFieldMatch = cleanLine.match(/^\s*(\w+)\s*=\s*\{/);
                if (blockFieldMatch) {
                    const fieldName = blockFieldMatch[1];
                    currentEntity.fields.set(fieldName, {
                        name: fieldName,
                        value: '{...}',
                        line: i,
                        column: cleanLine.indexOf(fieldName)
                    });
                }
            }
            braceDepth += openBraces - closeBraces;
            // Check for entity end
            if (currentEntity && braceDepth === 0) {
                currentEntity.endLine = i;
                entities.push(currentEntity);
                currentEntity = null;
            }
        }
        return entities;
    }
    /**
     * Check for name collisions within a file
     */
    checkNameCollisions(entities) {
        const collisions = [];
        const nameMap = new Map();
        for (const entity of entities) {
            const existingLine = nameMap.get(entity.name);
            if (existingLine !== undefined) {
                collisions.push({
                    name: entity.name,
                    line: entity.startLine,
                    otherLine: existingLine
                });
            }
            else {
                nameMap.set(entity.name, entity.startLine);
            }
        }
        return collisions;
    }
    /**
     * Check for missing required fields
     */
    checkRequiredFields(entity, schema) {
        const missing = [];
        for (const field of schema) {
            if (field.required && !entity.fields.has(field.name)) {
                missing.push(field.name);
            }
        }
        return missing;
    }
    /**
     * Check for invalid/unknown fields
     */
    checkInvalidFields(entity, schemaMap, fileType) {
        const invalid = [];
        // Skip validation for certain complex file types that have many dynamic fields
        if (['event', 'decision', 'interaction'].includes(fileType)) {
            // These have trigger/effect blocks with many valid fields not in the schema
            // Only validate top-level fields that are clearly wrong
            return invalid;
        }
        for (const [fieldName, field] of entity.fields) {
            // Skip common fields that are valid across many contexts
            if (this.isCommonField(fieldName)) {
                continue;
            }
            if (!schemaMap.has(fieldName)) {
                invalid.push({ name: fieldName, line: field.line });
            }
        }
        return invalid;
    }
    /**
     * Check if a field is a common field valid in many contexts
     */
    isCommonField(fieldName) {
        const commonFields = new Set([
            // Trigger/effect blocks
            'trigger', 'effect', 'immediate', 'after', 'option',
            'is_shown', 'is_valid', 'is_valid_showing_failures_only',
            'ai_potential', 'ai_will_do', 'on_accept', 'on_decline',
            // Modifier blocks
            'modifier', 'character_modifier', 'county_modifier', 'province_modifier',
            // Common structural fields
            'limit', 'if', 'else', 'else_if', 'random_list', 'random',
            // Weight/AI fields
            'weight', 'factor', 'add', 'multiply',
            // Localization
            'desc', 'name', 'tooltip',
        ]);
        return commonFields.has(fieldName);
    }
    /**
     * Check for type mismatches
     */
    checkTypeMismatches(entity, schemaMap) {
        const mismatches = [];
        for (const [fieldName, field] of entity.fields) {
            const schemaField = schemaMap.get(fieldName);
            if (!schemaField)
                continue;
            const value = field.value.trim();
            switch (schemaField.type) {
                case 'boolean':
                    if (!['yes', 'no'].includes(value)) {
                        mismatches.push({
                            line: field.line,
                            message: `"${fieldName}" expects a boolean (yes/no), got "${value}"`
                        });
                    }
                    break;
                case 'integer':
                    // Allow negative numbers
                    if (!/^-?\d+$/.test(value)) {
                        mismatches.push({
                            line: field.line,
                            message: `"${fieldName}" expects an integer, got "${value}"`
                        });
                    }
                    else {
                        // Check min/max if defined
                        const num = parseInt(value, 10);
                        if (schemaField.min !== undefined && num < schemaField.min) {
                            mismatches.push({
                                line: field.line,
                                message: `"${fieldName}" value ${num} is below minimum ${schemaField.min}`
                            });
                        }
                        if (schemaField.max !== undefined && num > schemaField.max) {
                            mismatches.push({
                                line: field.line,
                                message: `"${fieldName}" value ${num} is above maximum ${schemaField.max}`
                            });
                        }
                    }
                    break;
                case 'float':
                    if (!/^-?\d+(\.\d+)?$/.test(value)) {
                        mismatches.push({
                            line: field.line,
                            message: `"${fieldName}" expects a number, got "${value}"`
                        });
                    }
                    break;
            }
        }
        return mismatches;
    }
    /**
     * Check for invalid enum values
     */
    checkEnumValues(entity, schemaMap) {
        const invalid = [];
        for (const [fieldName, field] of entity.fields) {
            const schemaField = schemaMap.get(fieldName);
            if (!schemaField || schemaField.type !== 'enum' || !schemaField.values) {
                continue;
            }
            const value = field.value.trim();
            if (!schemaField.values.includes(value)) {
                invalid.push({
                    line: field.line,
                    message: `Invalid value for "${fieldName}": "${value}". Expected one of: ${schemaField.values.join(', ')}`
                });
            }
        }
        return invalid;
    }
    /**
     * Get the start position of a line in the text
     */
    getLineStart(text, lineNumber) {
        let pos = 0;
        let line = 0;
        while (line < lineNumber && pos < text.length) {
            if (text[pos] === '\n') {
                line++;
            }
            pos++;
        }
        return pos;
    }
    /**
     * Get the end position of a line in the text
     */
    getLineEnd(text, lineNumber) {
        let pos = this.getLineStart(text, lineNumber);
        while (pos < text.length && text[pos] !== '\n') {
            pos++;
        }
        return pos;
    }
}
exports.CK3DiagnosticsProvider = CK3DiagnosticsProvider;
//# sourceMappingURL=ck3DiagnosticsProvider.js.map