"use strict";
/**
 * Template engine for loading and processing YAML templates
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngine = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
const yaml = __importStar(require("yaml"));
const handlebars_1 = __importDefault(require("handlebars"));
class TemplateEngine {
    constructor(templatesDir) {
        this.templatesDir = templatesDir || path.join(__dirname, '../../templates');
        this.handlebars = handlebars_1.default.create();
        this.registerHelpers();
    }
    /**
     * Register custom Handlebars helpers
     */
    registerHelpers() {
        // Mathematical operations
        this.handlebars.registerHelper('add', (a, b) => a + b);
        this.handlebars.registerHelper('subtract', (a, b) => a - b);
        this.handlebars.registerHelper('multiply', (a, b) => a * b);
        this.handlebars.registerHelper('divide', (a, b) => a / b);
        this.handlebars.registerHelper('power', (base, exp) => Math.pow(base, exp));
        this.handlebars.registerHelper('floor', (n) => Math.floor(n));
        this.handlebars.registerHelper('ceil', (n) => Math.ceil(n));
        this.handlebars.registerHelper('round', (n) => Math.round(n));
        // String operations
        this.handlebars.registerHelper('uppercase', (str) => str.toUpperCase());
        this.handlebars.registerHelper('lowercase', (str) => str.toLowerCase());
        this.handlebars.registerHelper('capitalize', (str) => str.charAt(0).toUpperCase() + str.slice(1));
        this.handlebars.registerHelper('format_name', (str) => str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        // Comparisons
        this.handlebars.registerHelper('eq', (a, b) => a === b);
        this.handlebars.registerHelper('ne', (a, b) => a !== b);
        this.handlebars.registerHelper('lt', (a, b) => a < b);
        this.handlebars.registerHelper('lte', (a, b) => a <= b);
        this.handlebars.registerHelper('gt', (a, b) => a > b);
        this.handlebars.registerHelper('gte', (a, b) => a >= b);
        // Formatting helpers
        this.handlebars.registerHelper('to_fixed', (n, digits) => n.toFixed(digits));
        // Level tier names
        this.handlebars.registerHelper('tier_name', (level) => {
            const tiers = ['Basic', 'Improved', 'Advanced', 'Master', 'Grand'];
            return tiers[level - 1] || `Level ${level}`;
        });
    }
    /**
     * Load a template from file
     */
    async loadTemplate(category, name) {
        const templatePath = path.join(this.templatesDir, category, `${name}.yml`);
        try {
            const content = await fs_1.promises.readFile(templatePath, 'utf-8');
            const template = yaml.parse(content);
            this.validateTemplate(template);
            return template;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`Template not found: ${category}/${name}`);
            }
            throw error;
        }
    }
    /**
     * List available templates in a category
     */
    async listTemplates(category) {
        const categoryPath = path.join(this.templatesDir, category);
        try {
            const files = await fs_1.promises.readdir(categoryPath);
            return files
                .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
                .map(f => f.replace(/\.(yml|yaml)$/, ''));
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Validate template structure
     */
    validateTemplate(template) {
        if (!template.name)
            throw new Error('Template missing name');
        if (!template.category)
            throw new Error('Template missing category');
        if (!template.parameters)
            throw new Error('Template missing parameters');
        if (!template.structure)
            throw new Error('Template missing structure');
    }
    /**
     * Validate parameters against template definition
     */
    validateParameters(template, params) {
        const errors = [];
        for (const [key, def] of Object.entries(template.parameters)) {
            const value = params[key];
            // Check required
            if (def.required && value === undefined) {
                errors.push(`Required parameter missing: ${key}`);
                continue;
            }
            // Skip if optional and not provided
            if (value === undefined)
                continue;
            // Type validation
            switch (def.type) {
                case 'integer':
                    if (!Number.isInteger(value)) {
                        errors.push(`Parameter ${key} must be an integer`);
                    }
                    if (def.min !== undefined && value < def.min) {
                        errors.push(`Parameter ${key} must be >= ${def.min}`);
                    }
                    if (def.max !== undefined && value > def.max) {
                        errors.push(`Parameter ${key} must be <= ${def.max}`);
                    }
                    break;
                case 'float':
                    if (typeof value !== 'number') {
                        errors.push(`Parameter ${key} must be a number`);
                    }
                    break;
                case 'boolean':
                    if (typeof value !== 'boolean') {
                        errors.push(`Parameter ${key} must be a boolean`);
                    }
                    break;
                case 'enum':
                    if (def.values && !def.values.includes(value)) {
                        errors.push(`Parameter ${key} must be one of: ${def.values.join(', ')}`);
                    }
                    break;
                case 'string':
                    if (typeof value !== 'string') {
                        errors.push(`Parameter ${key} must be a string`);
                    }
                    break;
            }
        }
        return { valid: errors.length === 0, errors };
    }
    /**
     * Apply defaults to parameters
     */
    applyDefaults(template, params) {
        const result = { ...params };
        for (const [key, def] of Object.entries(template.parameters)) {
            if (result[key] === undefined && def.default !== undefined) {
                result[key] = def.default;
            }
        }
        return result;
    }
    /**
     * Process a template with given parameters
     */
    process(template, context) {
        const compiled = this.handlebars.compile(template);
        return compiled(context);
    }
    /**
     * Process an object recursively with Handlebars
     */
    processObject(obj, context) {
        if (typeof obj === 'string') {
            return this.process(obj, context);
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.processObject(item, context));
        }
        if (obj && typeof obj === 'object') {
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                // Process both keys and values through Handlebars
                const processedKey = typeof key === 'string' ? this.process(key, context) : key;
                result[processedKey] = this.processObject(value, context);
            }
            return result;
        }
        return obj;
    }
    /**
     * Create context for a specific level
     */
    createLevelContext(params, level) {
        const tiers = ['Basic', 'Improved', 'Advanced', 'Master', 'Grand'];
        return {
            ...params,
            level,
            formatted_name: params.name
                .split('_')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
            tier: tiers[level - 1] || `Level ${level}`,
            tier_lower: (tiers[level - 1] || `Level ${level}`).toLowerCase(),
            level_requirement: Math.max(1, level - 1),
        };
    }
}
exports.TemplateEngine = TemplateEngine;
//# sourceMappingURL=template-engine.js.map