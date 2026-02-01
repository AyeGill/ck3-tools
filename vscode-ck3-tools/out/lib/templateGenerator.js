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
exports.TemplateGenerator = void 0;
const path = __importStar(require("path"));
const template_based_1 = require("../generator/template-based");
/**
 * Wrapper around the core template generator for VS Code extension use
 */
class TemplateGenerator {
    constructor(extensionPath) {
        // Templates are in the extension root directory
        this.templatesDir = path.join(extensionPath, 'templates');
        this.generator = new template_based_1.TemplateGenerator(this.templatesDir);
    }
    /**
     * Generate trait code (returns formatted string, doesn't write to disk)
     */
    async generateTraitCode(params) {
        const result = await this.generator.generate({
            templateName: params.template,
            category: 'trait',
            parameters: params,
            outputPath: '/tmp' // We won't actually write, just generate
        });
        return result.content;
    }
    /**
     * Generate building code
     */
    async generateBuildingCode(params) {
        const result = await this.generator.generate({
            templateName: params.template,
            category: 'building',
            parameters: params,
            outputPath: '/tmp'
        });
        return result.content;
    }
    /**
     * Generate event code
     */
    async generateEventCode(params) {
        const result = await this.generator.generate({
            templateName: params.template,
            category: 'event',
            parameters: params,
            outputPath: '/tmp'
        });
        return result.content;
    }
    /**
     * Generate decision code
     */
    async generateDecisionCode(params) {
        const result = await this.generator.generate({
            templateName: params.template,
            category: 'decision',
            parameters: params,
            outputPath: '/tmp'
        });
        return result.content;
    }
    /**
     * List available templates for a category
     */
    async listTemplates(category) {
        return this.generator.listTemplates(category);
    }
    /**
     * Generate localization for given keys
     */
    generateLocalization(keys) {
        const lines = ['\ufeffl_english:'];
        for (const { key, defaultText } of keys) {
            lines.push(` ${key}:0 "${defaultText}"`);
        }
        return lines.join('\n') + '\n';
    }
}
exports.TemplateGenerator = TemplateGenerator;
//# sourceMappingURL=templateGenerator.js.map