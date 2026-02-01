/**
 * Template-based generator - uses YAML templates with Handlebars for code generation
 *
 * All templates use string-based structures that get processed through Handlebars.
 * This is simple and transparent - what you see in the template is what you get.
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import { GenerationResult } from '../common/types';
import { TemplateEngine, TemplateDefinition } from '../common/template-engine';

export interface TemplateGeneratorConfig {
  templateName: string;
  category: string;
  parameters: Record<string, any>;
  outputPath: string;
}

export class TemplateGenerator {
  private engine: TemplateEngine;

  constructor(templatesDir?: string) {
    this.engine = new TemplateEngine(templatesDir);
  }

  /**
   * Generate code from a template
   */
  async generate(config: TemplateGeneratorConfig): Promise<GenerationResult> {
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
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
    };

    // Process the structure string through Handlebars
    const content = this.engine.processObject(template.structure, context) as string;

    // Generate localization
    const localization = this.generateLocalization(template, context);

    // Write files
    const result = await this.writeFiles(category, params.name, content, localization, outputPath);

    return result;
  }

  /**
   * Generate localization from template
   */
  private generateLocalization(
    template: TemplateDefinition,
    context: Record<string, any>
  ): string {
    const lines: string[] = [];
    lines.push('\ufeffl_english:');

    const { name, formatted_name } = context;

    // Use template's localization if available
    if (template.localization?.name_template) {
      const title = this.engine.processObject(template.localization.name_template, context);
      lines.push(` ${name}:0 "${title}"`);
    } else {
      lines.push(` ${name}:0 "${formatted_name}"`);
    }

    if (template.localization?.desc_template) {
      const desc = this.engine.processObject(template.localization.desc_template, context);
      lines.push(` ${name}_desc:0 "${desc}"`);
    } else {
      lines.push(` ${name}_desc:0 "Description for ${formatted_name}."`);
    }

    return lines.join('\n') + '\n';
  }

  /**
   * Write generated files
   */
  private async writeFiles(
    category: string,
    name: string,
    content: string,
    localization: string,
    outputPath: string
  ): Promise<GenerationResult> {
    // Determine output directories based on category
    let dataDir: string;
    let dataFile: string;

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
    await fs.mkdir(dataDir, { recursive: true });
    await fs.mkdir(locDir, { recursive: true });

    // Write files
    const fullDataPath = path.join(dataDir, dataFile);
    const locFile = path.join(locDir, `${name}_l_english.yml`);

    await fs.writeFile(fullDataPath, content, 'utf-8');
    await fs.writeFile(locFile, localization, 'utf-8');

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
  async listTemplates(category: string): Promise<string[]> {
    return this.engine.listTemplates(category);
  }
}
