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
const data_1 = require("../data");
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
/**
 * Block names that establish trigger context
 */
const TRIGGER_BLOCKS = new Set([
    'trigger', 'is_shown', 'is_valid', 'is_valid_showing_failures_only',
    'ai_potential', 'ai_will_do', 'can_be_picked', 'can_pick',
    'is_highlighted', 'auto_accept', 'can_send', 'can_be_picked_artifact',
    'limit', // limit inside effects contains triggers
]);
/**
 * Block names that establish effect context
 */
const EFFECT_BLOCKS = new Set([
    'immediate', 'effect', 'after', 'on_accept', 'on_decline',
    'on_send', 'on_auto_accept', 'option', 'hidden_effect',
    'on_use', 'on_expire', 'on_invalidated',
    'on_discover', 'on_expose',
    'on_start', 'on_end', 'on_monthly', 'on_yearly',
]);
/**
 * Fields that are valid in both trigger and effect contexts (control flow, etc.)
 */
const CONTROL_FLOW_FIELDS = new Set([
    'if', 'else', 'else_if', 'switch', 'trigger_if', 'trigger_else',
    'random', 'random_list', 'while', 'break', 'continue',
    'limit', 'modifier', 'weight', 'factor', 'add', 'multiply',
    'save_scope_as', 'save_scope_value_as', 'save_temporary_scope_as',
    'custom_description', 'custom_tooltip', 'show_as_tooltip',
    'hidden_effect', 'run_interaction',
]);
/**
 * Scope-changing effects/triggers (valid in most contexts)
 */
const SCOPE_CHANGERS = new Set([
    'root', 'prev', 'this', 'from',
    'liege', 'top_liege', 'host', 'employer',
    'father', 'mother', 'primary_spouse', 'betrothed',
    'primary_heir', 'player_heir', 'designated_heir',
    'dynasty', 'house', 'faith', 'culture', 'religion',
    'capital_province', 'capital_county', 'primary_title',
    'location', 'home_court',
    // Iterator prefixes - these will be checked specially
]);
/**
 * Prefixes for iterator effects/triggers
 */
const ITERATOR_PREFIXES = [
    'every_', 'random_', 'any_', 'ordered_',
];
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
        // Validate effects and triggers in context
        const effectTriggerDiagnostics = this.validateEffectsAndTriggers(document);
        diagnostics.push(...effectTriggerDiagnostics);
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
     * Validate effects and triggers in context-aware blocks
     */
    validateEffectsAndTriggers(document) {
        const diagnostics = [];
        const text = document.getText();
        const lines = text.split('\n');
        // Track context as we parse
        const blockStack = [];
        let braceDepth = 0;
        for (let lineNum = 0; lineNum < lines.length; lineNum++) {
            const line = lines[lineNum];
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
            // Check for block start: name = {
            const blockStartMatch = cleanLine.match(/^\s*(\S+)\s*=\s*\{/);
            if (blockStartMatch) {
                const blockName = blockStartMatch[1];
                let context = 'unknown';
                // Determine context based on block name
                if (TRIGGER_BLOCKS.has(blockName)) {
                    context = 'trigger';
                }
                else if (EFFECT_BLOCKS.has(blockName)) {
                    context = 'effect';
                }
                else if (blockStack.length > 0) {
                    // Inherit context from parent if this is a scope changer or iterator
                    const parentContext = blockStack[blockStack.length - 1].context;
                    if (parentContext !== 'unknown') {
                        // Check if this is a valid scope changer or iterator
                        if (this.isValidScopeChanger(blockName) || this.isValidIterator(blockName, parentContext)) {
                            context = parentContext;
                        }
                        else if (parentContext === 'effect' && data_1.effectsMap.has(blockName)) {
                            context = 'effect';
                        }
                        else if (parentContext === 'trigger' && data_1.triggersMap.has(blockName)) {
                            context = 'trigger';
                        }
                    }
                }
                blockStack.push({ name: blockName, context });
            }
            // Check for simple field: name = value (no opening brace)
            const fieldMatch = cleanLine.match(/^\s*(\S+)\s*=\s*([^{].*)$/);
            if (fieldMatch && blockStack.length > 0) {
                const fieldName = fieldMatch[1];
                const currentBlock = blockStack[blockStack.length - 1];
                // Only validate if we're in a known context
                if (currentBlock.context !== 'unknown') {
                    const diagnostic = this.validateFieldInContext(fieldName, currentBlock.context, lineNum, cleanLine, document);
                    if (diagnostic) {
                        diagnostics.push(diagnostic);
                    }
                }
            }
            // Note: We don't validate block names (like `immediate`, `if`, `liege`) here.
            // Block names that establish context are schema fields (validated by schema validation).
            // Block names that are scope changers or control flow are handled by context inheritance.
            // Update brace depth and pop blocks
            braceDepth += openBraces - closeBraces;
            // Pop blocks when braces close
            for (let i = 0; i < closeBraces; i++) {
                if (blockStack.length > 0) {
                    blockStack.pop();
                }
            }
        }
        return diagnostics;
    }
    /**
     * Check if a field name is a valid scope changer
     */
    isValidScopeChanger(name) {
        if (SCOPE_CHANGERS.has(name)) {
            return true;
        }
        // Check for scope: prefix
        if (name.startsWith('scope:')) {
            return true;
        }
        return false;
    }
    /**
     * Check if a field name is a valid iterator for the context
     */
    isValidIterator(name, context) {
        for (const prefix of ITERATOR_PREFIXES) {
            if (name.startsWith(prefix)) {
                // Check if this iterator exists in effects or triggers
                if (context === 'effect' && data_1.effectsMap.has(name)) {
                    return true;
                }
                if (context === 'trigger' && data_1.triggersMap.has(name)) {
                    return true;
                }
                // Also check the other map since some iterators work in both
                if (data_1.effectsMap.has(name) || data_1.triggersMap.has(name)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Validate a field in a specific context (trigger or effect)
     */
    validateFieldInContext(fieldName, context, lineNum, cleanLine, document) {
        // Skip control flow and common fields
        if (CONTROL_FLOW_FIELDS.has(fieldName)) {
            return null;
        }
        // Skip context-establishing blocks (these are schema fields, not effects/triggers)
        // This handles edge cases where `immediate =` is on a separate line from `{`
        if (TRIGGER_BLOCKS.has(fieldName) || EFFECT_BLOCKS.has(fieldName)) {
            return null;
        }
        // Skip scope changers
        if (this.isValidScopeChanger(fieldName)) {
            return null;
        }
        // Skip iterators
        if (this.isValidIterator(fieldName, context)) {
            return null;
        }
        // Check if it's a valid effect/trigger for the context
        if (context === 'effect') {
            if (!data_1.effectsMap.has(fieldName) && !data_1.triggersMap.has(fieldName)) {
                // Could be a scripted effect - those start with various prefixes
                // Be lenient: only flag if it doesn't look like a scripted effect
                if (!this.couldBeScriptedEffectOrTrigger(fieldName)) {
                    const fieldStart = cleanLine.indexOf(fieldName);
                    const range = new vscode.Range(new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0), new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length));
                    return new vscode.Diagnostic(range, `Unknown effect: "${fieldName}"`, vscode.DiagnosticSeverity.Warning);
                }
            }
        }
        else if (context === 'trigger') {
            if (!data_1.triggersMap.has(fieldName) && !data_1.effectsMap.has(fieldName)) {
                // Could be a scripted trigger
                if (!this.couldBeScriptedEffectOrTrigger(fieldName)) {
                    const fieldStart = cleanLine.indexOf(fieldName);
                    const range = new vscode.Range(new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart : 0), new vscode.Position(lineNum, fieldStart >= 0 ? fieldStart + fieldName.length : cleanLine.length));
                    return new vscode.Diagnostic(range, `Unknown trigger: "${fieldName}"`, vscode.DiagnosticSeverity.Warning);
                }
            }
        }
        return null;
    }
    /**
     * Check if a name could be a scripted effect or trigger
     * Scripted effects/triggers are user-defined and can have any name
     * We use heuristics to avoid false positives
     */
    couldBeScriptedEffectOrTrigger(name) {
        // Common patterns for scripted effects/triggers
        const scriptedPatterns = [
            /_effect$/,
            /_trigger$/,
            /^trigger_/,
            /^effect_/,
            /^scripted_/,
            /^has_/,
            /^is_/,
            /^can_/,
            /^get_/,
            /^set_/,
            /^add_/,
            /^remove_/,
            /^check_/,
            /^calculate_/,
            /^apply_/,
            /^grant_/,
            /^create_/,
            /^destroy_/,
            /^update_/,
            /^validate_/,
        ];
        for (const pattern of scriptedPatterns) {
            if (pattern.test(name)) {
                return true;
            }
        }
        // Also allow anything with underscores (likely a scripted thing)
        // This is very permissive to avoid false positives
        if (name.includes('_') && name.length > 3) {
            return true;
        }
        return false;
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