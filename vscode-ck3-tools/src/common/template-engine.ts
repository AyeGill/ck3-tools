/**
 * Template engine for loading and processing YAML templates
 */

import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
import Handlebars from 'handlebars';

export interface TemplateParameter {
  type: 'string' | 'integer' | 'float' | 'boolean' | 'enum';
  required?: boolean;
  default?: any;
  min?: number;
  max?: number;
  values?: string[];
  description?: string;
}

export interface TemplateDefinition {
  name: string;
  description: string;
  category: string;
  version: string;
  parameters: Record<string, TemplateParameter>;
  structure: any;
  localization?: {
    name_template?: string;
    desc_template?: string;
    [key: string]: any;
  };
}

export interface TemplateContext {
  [key: string]: any;
  level?: number;
  formatted_name?: string;
  tier?: string;
  tier_lower?: string;
}

export class TemplateEngine {
  private handlebars: typeof Handlebars;
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || path.join(__dirname, '../../templates');
    this.handlebars = Handlebars.create();
    this.registerHelpers();
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHelpers(): void {
    // Mathematical operations
    this.handlebars.registerHelper('add', (a: number, b: number) => a + b);
    this.handlebars.registerHelper('subtract', (a: number, b: number) => a - b);
    this.handlebars.registerHelper('multiply', (a: number, b: number) => a * b);
    this.handlebars.registerHelper('divide', (a: number, b: number) => a / b);
    this.handlebars.registerHelper('power', (base: number, exp: number) => Math.pow(base, exp));
    this.handlebars.registerHelper('floor', (n: number) => Math.floor(n));
    this.handlebars.registerHelper('ceil', (n: number) => Math.ceil(n));
    this.handlebars.registerHelper('round', (n: number) => Math.round(n));

    // String operations
    this.handlebars.registerHelper('uppercase', (str: string) => str.toUpperCase());
    this.handlebars.registerHelper('lowercase', (str: string) => str.toLowerCase());
    this.handlebars.registerHelper('capitalize', (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1)
    );
    this.handlebars.registerHelper('format_name', (str: string) =>
      str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    );

    // Comparisons
    this.handlebars.registerHelper('eq', (a: any, b: any) => a === b);
    this.handlebars.registerHelper('ne', (a: any, b: any) => a !== b);
    this.handlebars.registerHelper('lt', (a: any, b: any) => a < b);
    this.handlebars.registerHelper('lte', (a: any, b: any) => a <= b);
    this.handlebars.registerHelper('gt', (a: any, b: any) => a > b);
    this.handlebars.registerHelper('gte', (a: any, b: any) => a >= b);

    // Formatting helpers
    this.handlebars.registerHelper('to_fixed', (n: number, digits: number) =>
      n.toFixed(digits)
    );

    // Level tier names
    this.handlebars.registerHelper('tier_name', (level: number) => {
      const tiers = ['Basic', 'Improved', 'Advanced', 'Master', 'Grand'];
      return tiers[level - 1] || `Level ${level}`;
    });
  }

  /**
   * Load a template from file
   */
  async loadTemplate(category: string, name: string): Promise<TemplateDefinition> {
    const templatePath = path.join(this.templatesDir, category, `${name}.yml`);

    try {
      const content = await fs.readFile(templatePath, 'utf-8');
      const template = yaml.parse(content) as TemplateDefinition;

      this.validateTemplate(template);
      return template;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new Error(`Template not found: ${category}/${name}`);
      }
      throw error;
    }
  }

  /**
   * List available templates in a category
   */
  async listTemplates(category: string): Promise<string[]> {
    const categoryPath = path.join(this.templatesDir, category);

    try {
      const files = await fs.readdir(categoryPath);
      return files
        .filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))
        .map(f => f.replace(/\.(yml|yaml)$/, ''));
    } catch (error) {
      return [];
    }
  }

  /**
   * Validate template structure
   */
  private validateTemplate(template: TemplateDefinition): void {
    if (!template.name) throw new Error('Template missing name');
    if (!template.category) throw new Error('Template missing category');
    if (!template.parameters) throw new Error('Template missing parameters');
    if (!template.structure) throw new Error('Template missing structure');
  }

  /**
   * Validate parameters against template definition
   */
  validateParameters(
    template: TemplateDefinition,
    params: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const [key, def] of Object.entries(template.parameters)) {
      const value = params[key];

      // Check required
      if (def.required && value === undefined) {
        errors.push(`Required parameter missing: ${key}`);
        continue;
      }

      // Skip if optional and not provided
      if (value === undefined) continue;

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
  applyDefaults(
    template: TemplateDefinition,
    params: Record<string, any>
  ): Record<string, any> {
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
  process(template: string, context: TemplateContext): string {
    const compiled = this.handlebars.compile(template);
    return compiled(context);
  }

  /**
   * Process an object recursively with Handlebars
   */
  processObject(obj: any, context: TemplateContext): any {
    if (typeof obj === 'string') {
      return this.process(obj, context);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.processObject(item, context));
    }

    if (obj && typeof obj === 'object') {
      const result: any = {};
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
  createLevelContext(
    params: Record<string, any>,
    level: number
  ): TemplateContext {
    const tiers = ['Basic', 'Improved', 'Advanced', 'Master', 'Grand'];

    return {
      ...params,
      level,
      formatted_name: params.name
        .split('_')
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      tier: tiers[level - 1] || `Level ${level}`,
      tier_lower: (tiers[level - 1] || `Level ${level}`).toLowerCase(),
      level_requirement: Math.max(1, level - 1),
    };
  }
}
