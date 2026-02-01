import * as path from 'path';
import { TemplateGenerator as CoreGenerator } from '../generator/template-based';

/**
 * Wrapper around the core template generator for VS Code extension use
 */
export class TemplateGenerator {
  private generator: CoreGenerator;
  private templatesDir: string;

  constructor(extensionPath: string) {
    // Templates are in the extension root directory
    this.templatesDir = path.join(extensionPath, 'templates');
    this.generator = new CoreGenerator(this.templatesDir);
  }

  /**
   * Generate trait code (returns formatted string, doesn't write to disk)
   */
  async generateTraitCode(params: {
    template: string;
    name: string;
    [key: string]: any;
  }): Promise<string> {
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
  async generateBuildingCode(params: {
    template: string;
    name: string;
    [key: string]: any;
  }): Promise<string> {
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
  async generateEventCode(params: {
    template: string;
    name: string;
    [key: string]: any;
  }): Promise<string> {
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
  async generateDecisionCode(params: {
    template: string;
    name: string;
    [key: string]: any;
  }): Promise<string> {
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
  async listTemplates(category: 'trait' | 'building' | 'event' | 'decision'): Promise<string[]> {
    return this.generator.listTemplates(category);
  }

  /**
   * Generate localization for given keys
   */
  generateLocalization(keys: { key: string; defaultText: string }[]): string {
    const lines = ['\ufeffl_english:'];
    for (const { key, defaultText } of keys) {
      lines.push(` ${key}:0 "${defaultText}"`);
    }
    return lines.join('\n') + '\n';
  }
}
