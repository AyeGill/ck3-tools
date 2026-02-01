"use strict";
/**
 * Template-based generator - uses YAML templates with Handlebars for code generation
 *
 * All templates use string-based structures that get processed through Handlebars.
 * This is simple and transparent - what you see in the template is what you get.
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
        // Create context with formatted name
        const context = {
            ...params,
            formatted_name: params.name
                .split('_')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' '),
        };
        // Process the structure string through Handlebars
        const content = this.engine.processObject(template.structure, context);
        // Generate localization
        const localization = this.generateLocalization(template, context);
        // Write files
        const result = await this.writeFiles(category, params.name, content, localization, outputPath);
        return result;
    }
    /**
     * Generate localization from template
     */
    generateLocalization(template, context) {
        const lines = [];
        lines.push('\ufeffl_english:');
        const { name, formatted_name } = context;
        // Use template's localization if available
        if (template.localization?.name_template) {
            const title = this.engine.processObject(template.localization.name_template, context);
            lines.push(` ${name}:0 "${title}"`);
        }
        else {
            lines.push(` ${name}:0 "${formatted_name}"`);
        }
        if (template.localization?.desc_template) {
            const desc = this.engine.processObject(template.localization.desc_template, context);
            lines.push(` ${name}_desc:0 "${desc}"`);
        }
        else {
            lines.push(` ${name}_desc:0 "Description for ${formatted_name}."`);
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
            case 'secret':
                dataDir = path.join(outputPath, 'common', 'secret_types');
                dataFile = `50_${name}.txt`;
                break;
            case 'interaction':
                dataDir = path.join(outputPath, 'common', 'character_interactions');
                dataFile = `50_${name}.txt`;
                break;
            case 'activity':
                dataDir = path.join(outputPath, 'common', 'activities');
                dataFile = `50_${name}.txt`;
                break;
            case 'scheme':
                dataDir = path.join(outputPath, 'common', 'schemes');
                dataFile = `50_${name}.txt`;
                break;
            default:
                // Default to common/category
                dataDir = path.join(outputPath, 'common', category);
                dataFile = `50_${name}.txt`;
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