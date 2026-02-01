"use strict";
/**
 * Template-based generator - uses YAML templates for generation
 */
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
exports.TemplateGenerator = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const formatter_1 = require("../common/formatter");
const template_engine_1 = require("../common/template-engine");
class TemplateGenerator {
    constructor(templatesDir) {
        this.engine = new template_engine_1.TemplateEngine(templatesDir);
    }
    /**
     * Generate code from a template
     */
    async generate(config) {
        const { templateName, category, parameters, outputPath } = config;
        // Load template
        const template = await this.engine.loadTemplate(category, templateName);
        // Apply defaults
        const params = this.engine.applyDefaults(template, parameters);
        // Validate parameters
        const validation = this.engine.validateParameters(template, params);
        if (!validation.valid) {
            throw new Error(`Template validation failed:\n${validation.errors.join('\n')}`);
        }
        // Generate content based on category
        let content;
        let localization;
        switch (category) {
            case 'building':
                ({ content, localization } = this.generateBuilding(template, params));
                break;
            case 'trait':
                ({ content, localization } = this.generateTrait(template, params));
                break;
            case 'decision':
                ({ content, localization } = this.generateDecision(template, params));
                break;
            case 'event':
                ({ content, localization } = this.generateEvent(template, params));
                break;
            default:
                throw new Error(`Unknown category: ${category}`);
        }
        // Write files
        const result = await this.writeFiles(category, params.name, content, localization, outputPath);
        return result;
    }
    /**
     * Generate building from template
     */
    generateBuilding(template, params) {
        const { name, levels } = params;
        const formatter = new formatter_1.CK3Formatter();
        // Header
        formatter.writeComment(`Generated from template: ${template.name}`);
        formatter.writeComment(`${levels} levels`);
        formatter.writeLine();
        // Generate each level
        for (let level = 1; level <= levels; level++) {
            const context = this.engine.createLevelContext(params, level);
            const structure = this.engine.processObject(template.structure, context);
            // Building definition
            formatter.startBlock(`${name}_0${level}`);
            this.writeStructure(formatter, structure, level, levels);
            formatter.endBlock();
            formatter.writeLine();
        }
        const content = formatter.toString();
        // Generate localization
        const localization = this.generateLocalization(template, params);
        return { content, localization };
    }
    /**
     * Write structure to formatter
     */
    writeStructure(formatter, structure, level, totalLevels) {
        for (const [key, value] of Object.entries(structure)) {
            // Skip empty keys or values
            if (!key || key.trim() === '' || value === '' || value === null || value === undefined) {
                continue;
            }
            // Skip next_building for last level
            if (key === 'next_building' && level === totalLevels) {
                continue;
            }
            if (key === 'can_construct_potential' || key === 'can_construct_showing_failures_only') {
                formatter.startBlock(key);
                if (value && typeof value === 'object' && 'condition' in value) {
                    formatter.writeLine(value.condition);
                }
                else {
                    this.writeStructure(formatter, value, level, totalLevels);
                }
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (key === 'ai_value') {
                formatter.writeComment('AI evaluation');
                formatter.startBlock('ai_value');
                if (value && typeof value === 'object') {
                    if ('base' in value) {
                        formatter.writeProperty('base', value.base);
                        formatter.writeLine();
                    }
                    if ('modifiers' in value) {
                        for (const mod of value.modifiers) {
                            formatter.startBlock('modifier');
                            if (mod.add !== undefined) {
                                formatter.writeProperty('add', mod.add);
                            }
                            if (mod.factor !== undefined) {
                                formatter.writeProperty('factor', mod.factor);
                            }
                            formatter.writeLine(mod.condition);
                            formatter.endBlock();
                            formatter.writeLine();
                        }
                    }
                }
                formatter.endBlock();
            }
            else if (key === 'character_modifier' ||
                key === 'province_modifier' ||
                key === 'county_modifier') {
                if (Object.keys(value).length === 0)
                    continue;
                formatter.startBlock(key);
                for (const [modKey, modValue] of Object.entries(value)) {
                    if (modKey !== 'condition') {
                        formatter.writeProperty(modKey, modValue);
                    }
                }
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (Array.isArray(value)) {
                // Handle arrays (e.g., thresholds in lifestyle traits)
                formatter.startBlock(key);
                for (const item of value) {
                    if (typeof item === 'object' && item !== null) {
                        // For objects in arrays, write each property
                        for (const [itemKey, itemValue] of Object.entries(item)) {
                            if (typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue)) {
                                formatter.startBlock(itemKey);
                                this.writeStructure(formatter, itemValue, level, totalLevels);
                                formatter.endBlock();
                                formatter.writeLine();
                            }
                            else {
                                formatter.writeProperty(itemKey, itemValue);
                            }
                        }
                    }
                    else {
                        formatter.writeLine(String(item));
                    }
                }
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (typeof value === 'object' && !Array.isArray(value)) {
                formatter.startBlock(key);
                this.writeStructure(formatter, value, level, totalLevels);
                formatter.endBlock();
                formatter.writeLine();
            }
            else {
                formatter.writeProperty(key, value);
                formatter.writeLine();
            }
        }
    }
    /**
     * Generate localization from template
     */
    generateLocalization(template, params) {
        const { name, levels } = params;
        const lines = [];
        lines.push('\ufeffl_english:');
        for (let level = 1; level <= levels; level++) {
            const context = this.engine.createLevelContext(params, level);
            const key = `building_${name}_0${level}`;
            let title = `${context.tier} ${context.formatted_name}`;
            let desc = `A ${context.tier_lower} building that provides various benefits.`;
            if (template.localization) {
                if (template.localization.name_template) {
                    title = this.engine.process(template.localization.name_template, context);
                }
                if (template.localization.desc_template) {
                    desc = this.engine.process(template.localization.desc_template, context);
                }
            }
            lines.push(` ${key}:0 "${title}"`);
            lines.push(` ${key}_desc:0 "${desc}"`);
        }
        return lines.join('\n') + '\n';
    }
    /**
     * Generate trait from template
     */
    generateTrait(template, params) {
        const { name, levels } = params;
        const formatter = new formatter_1.CK3Formatter();
        // Header
        formatter.writeComment(`Generated from template: ${template.name}`);
        formatter.writeLine();
        // Check if this is a leveled trait
        if (levels && levels > 1) {
            // Generate each level
            for (let level = 1; level <= levels; level++) {
                const context = this.engine.createLevelContext(params, level);
                const structure = this.engine.processObject(template.structure, context);
                formatter.startBlock(`${name}_${level}`);
                this.writeStructure(formatter, structure, level, levels);
                formatter.endBlock();
                formatter.writeLine();
            }
        }
        else {
            // Single trait
            const context = { ...params, formatted_name: params.name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') };
            const structure = this.engine.processObject(template.structure, context);
            formatter.startBlock(name);
            this.writeStructure(formatter, structure, 1, 1);
            formatter.endBlock();
            formatter.writeLine();
        }
        const content = formatter.toString();
        // Generate localization
        const localization = this.generateTraitLocalization(template, params);
        return { content, localization };
    }
    /**
     * Generate trait localization
     */
    generateTraitLocalization(template, params) {
        const { name, levels } = params;
        const lines = [];
        lines.push('\ufeffl_english:');
        if (levels && levels > 1) {
            // Leveled trait
            for (let level = 1; level <= levels; level++) {
                const context = this.engine.createLevelContext(params, level);
                const key = `trait_${name}_${level}`;
                let title = `${context.tier} ${context.formatted_name}`;
                let desc = `Level ${level} of the ${context.formatted_name} trait.`;
                if (template.localization) {
                    if (template.localization.name_template) {
                        title = this.engine.process(template.localization.name_template, context);
                    }
                    if (template.localization.desc_template) {
                        desc = this.engine.process(template.localization.desc_template, context);
                    }
                }
                lines.push(` ${key}:0 "${title}"`);
                lines.push(` ${key}_desc:0 "${desc}"`);
            }
        }
        else {
            // Single trait
            const context = { ...params, formatted_name: params.name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') };
            const key = `trait_${name}`;
            let title = context.formatted_name;
            let desc = `The ${context.formatted_name} trait.`;
            if (template.localization) {
                if (template.localization.name_template) {
                    title = this.engine.process(template.localization.name_template, context);
                }
                if (template.localization.desc_template) {
                    desc = this.engine.process(template.localization.desc_template, context);
                }
            }
            lines.push(` ${key}:0 "${title}"`);
            lines.push(` ${key}_desc:0 "${desc}"`);
        }
        return lines.join('\n') + '\n';
    }
    /**
     * Generate decision from template
     */
    generateDecision(template, params) {
        const { name } = params;
        const formatter = new formatter_1.CK3Formatter();
        // Header
        formatter.writeComment(`Generated from template: ${template.name}`);
        formatter.writeLine();
        // Process structure
        const context = { ...params, formatted_name: params.name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') };
        const structure = this.engine.processObject(template.structure, context);
        // Decision definition
        formatter.startBlock(name);
        this.writeDecisionStructure(formatter, structure);
        formatter.endBlock();
        formatter.writeLine();
        const content = formatter.toString();
        // Generate localization
        const localization = this.generateDecisionLocalization(template, params);
        return { content, localization };
    }
    /**
     * Write decision structure (handles decision-specific formatting)
     */
    writeDecisionStructure(formatter, structure) {
        for (const [key, value] of Object.entries(structure)) {
            if (key === 'is_shown' || key === 'is_valid' || key === 'is_valid_showing_failures_only') {
                formatter.startBlock(key);
                if (typeof value === 'string') {
                    // Multiline string from YAML - split and write each line
                    const lines = value.trim().split('\n');
                    for (const line of lines) {
                        if (line.trim())
                            formatter.writeLine(line.trim());
                    }
                }
                else if (value && typeof value === 'object') {
                    if ('conditions' in value) {
                        // Conditions as a string or object
                        if (typeof value.conditions === 'string') {
                            const lines = value.conditions.trim().split('\n');
                            for (const line of lines) {
                                if (line.trim())
                                    formatter.writeLine(line.trim());
                            }
                        }
                        else {
                            for (const condition of Object.values(value.conditions)) {
                                if (condition)
                                    formatter.writeLine(condition);
                            }
                        }
                    }
                    else {
                        this.writeDecisionStructure(formatter, value);
                    }
                }
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (key === 'cost' || key === 'cooldown') {
                formatter.startBlock(key);
                if (value && typeof value === 'object') {
                    for (const [k, v] of Object.entries(value)) {
                        if (v !== undefined && v !== null && v !== '') {
                            formatter.writeProperty(k, v);
                        }
                    }
                }
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (key === 'effect' || key === 'ai_potential') {
                formatter.startBlock(key);
                if (typeof value === 'string') {
                    // Multiline string from YAML - split and write each line
                    const lines = value.trim().split('\n');
                    for (const line of lines) {
                        if (line.trim())
                            formatter.writeLine(line.trim());
                    }
                }
                else if (value && typeof value === 'object') {
                    this.writeDecisionStructure(formatter, value);
                }
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (key === 'ai_will_do') {
                formatter.startBlock('ai_will_do');
                if (value && typeof value === 'object') {
                    if ('base' in value) {
                        formatter.writeProperty('base', value.base);
                        formatter.writeLine();
                    }
                    if ('modifiers' in value) {
                        for (const mod of value.modifiers) {
                            formatter.startBlock('modifier');
                            if (mod.add !== undefined)
                                formatter.writeProperty('add', mod.add);
                            if (mod.factor !== undefined)
                                formatter.writeProperty('factor', mod.factor);
                            if (mod.condition)
                                formatter.writeLine(mod.condition);
                            formatter.endBlock();
                            formatter.writeLine();
                        }
                    }
                }
                formatter.endBlock();
            }
            else if (typeof value === 'object' && !Array.isArray(value)) {
                formatter.startBlock(key);
                this.writeDecisionStructure(formatter, value);
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (value !== undefined && value !== null && value !== '') {
                formatter.writeProperty(key, value);
                formatter.writeLine();
            }
        }
    }
    /**
     * Generate decision localization
     */
    generateDecisionLocalization(template, params) {
        const { name } = params;
        const lines = [];
        const context = { ...params, formatted_name: params.name.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') };
        lines.push('\ufeffl_english:');
        // Decision title
        let title = context.formatted_name;
        if (template.localization?.name_template) {
            title = this.engine.process(template.localization.name_template, context);
        }
        lines.push(` decision_${name}:0 "${title}"`);
        // Decision description
        let desc = `A decision to ${context.formatted_name.toLowerCase()}.`;
        if (template.localization?.desc_template) {
            desc = this.engine.process(template.localization.desc_template, context);
        }
        lines.push(` decision_${name}_desc:0 "${desc}"`);
        // Confirmation text
        let confirm = "Confirm";
        if (template.localization?.confirm_template) {
            confirm = this.engine.process(template.localization.confirm_template, context);
        }
        lines.push(` decision_${name}_confirm:0 "${confirm}"`);
        // Tooltip
        if (template.localization?.tooltip_template) {
            const tooltip = this.engine.process(template.localization.tooltip_template, context);
            lines.push(` decision_${name}_tooltip:0 "${tooltip}"`);
        }
        return lines.join('\n') + '\n';
    }
    /**
     * Generate event from template
     */
    generateEvent(template, params) {
        const { namespace, event_id } = params;
        const formatter = new formatter_1.CK3Formatter();
        // Namespace declaration
        formatter.writeComment(`Generated from template: ${template.name}`);
        formatter.writeLine();
        formatter.writeProperty('namespace', namespace);
        formatter.writeLine();
        formatter.writeLine();
        // Process structure
        const context = {
            ...params,
            formatted_name: params.title_key || `${namespace}_${event_id}`,
        };
        const structure = this.engine.processObject(template.structure, context);
        // Event definition
        formatter.startBlock(`${namespace}.${event_id}`);
        this.writeEventStructure(formatter, structure);
        formatter.endBlock();
        formatter.writeLine();
        const content = formatter.toString();
        // Generate localization
        const localization = this.generateEventLocalization(template, params);
        return { content, localization };
    }
    /**
     * Write event structure (handles event-specific formatting)
     */
    writeEventStructure(formatter, structure) {
        for (const [key, value] of Object.entries(structure)) {
            // Skip keys that are part of namespace declaration or id
            if (key === 'event_type' || key === 'namespace' || key === 'id') {
                if (key === 'event_type') {
                    formatter.writeProperty('type', value);
                    formatter.writeLine();
                }
                continue;
            }
            if (key === 'title' || key === 'desc') {
                formatter.writeProperty(key, value);
                formatter.writeLine();
            }
            else if (key === 'theme') {
                formatter.writeProperty('theme', value);
                formatter.writeLine();
            }
            else if (key === 'left_portrait' || key === 'right_portrait') {
                formatter.writeProperty(key, value);
                formatter.writeLine();
            }
            else if (key === 'immediate') {
                if (value && typeof value === 'string' && value.trim()) {
                    formatter.startBlock('immediate');
                    formatter.writeLine(value);
                    formatter.endBlock();
                    formatter.writeLine();
                }
            }
            else if (key === 'option') {
                if (Array.isArray(value)) {
                    for (const option of value) {
                        formatter.startBlock('option');
                        if (typeof option === 'object') {
                            this.writeEventOption(formatter, option);
                        }
                        formatter.endBlock();
                        formatter.writeLine();
                    }
                }
            }
            else if (typeof value === 'object' && !Array.isArray(value)) {
                formatter.startBlock(key);
                this.writeEventStructure(formatter, value);
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (value !== undefined && value !== null && value !== '') {
                formatter.writeProperty(key, value);
                formatter.writeLine();
            }
        }
    }
    /**
     * Write event option structure
     */
    writeEventOption(formatter, option) {
        for (const [key, value] of Object.entries(option)) {
            if (key === 'name') {
                formatter.writeProperty('name', value);
                formatter.writeLine();
            }
            else if (key === 'trigger' || key === 'effect') {
                if (value && typeof value === 'string' && value.trim()) {
                    // Handle multiline strings
                    const lines = value.trim().split('\n');
                    const nonEmptyLines = lines.filter(line => line.trim());
                    if (nonEmptyLines.length > 0) {
                        for (const line of nonEmptyLines) {
                            formatter.writeLine(line.trim());
                        }
                    }
                }
            }
            else if (typeof value === 'string' && value.trim()) {
                // Raw effect strings
                const lines = value.trim().split('\n');
                for (const line of lines) {
                    if (line.trim())
                        formatter.writeLine(line.trim());
                }
            }
            else if (typeof value === 'object' && !Array.isArray(value)) {
                formatter.startBlock(key);
                this.writeEventOption(formatter, value);
                formatter.endBlock();
                formatter.writeLine();
            }
            else if (value !== undefined && value !== null && value !== '') {
                formatter.writeProperty(key, value);
                formatter.writeLine();
            }
        }
    }
    /**
     * Generate event localization
     */
    generateEventLocalization(template, params) {
        const { namespace, event_id, title_key, desc_key } = params;
        const lines = [];
        const context = { ...params };
        lines.push('\ufeffl_english:');
        // Event title
        const titleKey = title_key || `${namespace}.${event_id}`;
        let title = `Event ${event_id}`;
        if (template.localization?.title) {
            title = this.engine.process(template.localization.title, context);
        }
        lines.push(` ${titleKey}:0 "${title}"`);
        // Event description
        const descKey = desc_key || `${namespace}.${event_id}_desc`;
        let desc = `Description for event ${event_id}.`;
        if (template.localization?.desc) {
            desc = this.engine.process(template.localization.desc, context);
        }
        lines.push(` ${descKey}:0 "${desc}"`);
        // Options
        if (template.localization?.option_a) {
            const optionA = this.engine.process(template.localization.option_a, context);
            lines.push(` ${titleKey}.a:0 "${optionA}"`);
        }
        if (template.localization?.option_b) {
            const optionB = this.engine.process(template.localization.option_b, context);
            lines.push(` ${titleKey}.b:0 "${optionB}"`);
        }
        if (template.localization?.option_c) {
            const optionC = this.engine.process(template.localization.option_c, context);
            lines.push(` ${titleKey}.c:0 "${optionC}"`);
        }
        if (template.localization?.option_d) {
            const optionD = this.engine.process(template.localization.option_d, context);
            lines.push(` ${titleKey}.d:0 "${optionD}"`);
        }
        return lines.join('\n') + '\n';
    }
    /**
     * Write generated files
     */
    async writeFiles(category, name, content, localization, outputPath) {
        // Determine output directories based on category
        let dataDir;
        let dataFile;
        switch (category) {
            case 'building':
                dataDir = path.join(outputPath, 'common', 'buildings');
                dataFile = `50_${name}.txt`;
                break;
            case 'trait':
                dataDir = path.join(outputPath, 'common', 'traits');
                dataFile = `50_${name}.txt`;
                break;
            case 'decision':
                dataDir = path.join(outputPath, 'common', 'decisions');
                dataFile = `50_${name}.txt`;
                break;
            case 'event':
                dataDir = path.join(outputPath, 'events');
                dataFile = `${name}_events.txt`;
                break;
            default:
                throw new Error(`Unknown category: ${category}`);
        }
        const locDir = path.join(outputPath, 'localization', 'english');
        // Ensure directories exist
        await fs_1.promises.mkdir(dataDir, { recursive: true });
        await fs_1.promises.mkdir(locDir, { recursive: true });
        // Write files
        const fullDataPath = path.join(dataDir, dataFile);
        const locFile = path.join(locDir, `${name}_l_english.yml`);
        await fs_1.promises.writeFile(fullDataPath, content, 'utf-8');
        await fs_1.promises.writeFile(locFile, localization, 'utf-8');
        return {
            file: fullDataPath,
            locFile,
            content,
            localization
        };
    }
    /**
     * List available templates
     */
    async listTemplates(category) {
        return this.engine.listTemplates(category);
    }
}
exports.TemplateGenerator = TemplateGenerator;
//# sourceMappingURL=template-based.js.map