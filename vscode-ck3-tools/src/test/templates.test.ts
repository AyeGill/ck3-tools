/**
 * Tests for CK3 Templates
 *
 * Validates that all templates can be loaded, parsed, and have required fields.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

// Template structure interface
interface TemplateParameter {
  type: string;
  required?: boolean;
  default?: any;
  description?: string;
}

interface TemplateDefinition {
  name: string;
  description: string;
  category: string;
  version: string;
  parameters: Record<string, TemplateParameter>;
  structure: any;
  localization?: {
    name_template?: string;
    desc_template?: string;
  };
}

const templatesDir = path.join(__dirname, '../../templates');

// Get all template files
async function getAllTemplates(): Promise<{ category: string; file: string; path: string }[]> {
  const templates: { category: string; file: string; path: string }[] = [];

  const categories = await fs.readdir(templatesDir);

  for (const category of categories) {
    const categoryPath = path.join(templatesDir, category);
    const stat = await fs.stat(categoryPath);

    if (stat.isDirectory()) {
      const files = await fs.readdir(categoryPath);

      for (const file of files) {
        if (file.endsWith('.yml')) {
          templates.push({
            category,
            file: file.replace('.yml', ''),
            path: path.join(categoryPath, file),
          });
        }
      }
    }
  }

  return templates;
}

describe('Template Loading and Validation', () => {
  let templates: { category: string; file: string; path: string }[];

  beforeAll(async () => {
    templates = await getAllTemplates();
  });

  it('should find templates in the templates directory', async () => {
    expect(templates.length).toBeGreaterThan(0);
  });

  describe('All templates should be valid YAML', () => {
    it('should parse all templates as valid YAML', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');

        try {
          const parsed = yaml.parse(content);
          expect(parsed).toBeDefined();
          expect(parsed).not.toBeNull();
        } catch (error) {
          throw new Error(`Failed to parse ${template.category}/${template.file}: ${error}`);
        }
      }
    });
  });

  describe('All templates should have required fields', () => {
    it('should have name field matching filename', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        expect(parsed.name).toBeDefined();
        expect(parsed.name).toBe(template.file);
      }
    });

    it('should have description field', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        expect(parsed.description).toBeDefined();
        expect(typeof parsed.description).toBe('string');
        expect(parsed.description.length).toBeGreaterThan(0);
      }
    });

    it('should have category field', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        expect(parsed.category).toBeDefined();
        expect(typeof parsed.category).toBe('string');
      }
    });

    it('should have version field', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        expect(parsed.version).toBeDefined();
      }
    });

    it('should have parameters field with name or namespace parameter', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        expect(parsed.parameters).toBeDefined();

        // Templates should have either 'name' or 'namespace' as the primary identifier
        const hasName = parsed.parameters.name !== undefined;
        const hasNamespace = parsed.parameters.namespace !== undefined;

        expect(hasName || hasNamespace).toBe(true);

        if (hasName) {
          expect(parsed.parameters.name.type).toBe('string');
          expect(parsed.parameters.name.required).toBe(true);
        }
        if (hasNamespace) {
          expect(parsed.parameters.namespace.type).toBe('string');
          expect(parsed.parameters.namespace.required).toBe(true);
        }
      }
    });

    it('should have structure field', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        expect(parsed.structure).toBeDefined();
      }
    });
  });

  describe('Template parameter validation', () => {
    it('should have valid parameter types', async () => {
      const validTypes = ['string', 'integer', 'float', 'boolean', 'enum'];

      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        for (const [paramName, param] of Object.entries(parsed.parameters)) {
          expect(validTypes).toContain(param.type);
        }
      }
    });

    it('should have enum values for enum parameters', async () => {
      for (const template of templates) {
        const content = await fs.readFile(template.path, 'utf-8');
        const parsed = yaml.parse(content) as TemplateDefinition;

        for (const [paramName, param] of Object.entries(parsed.parameters)) {
          if (param.type === 'enum') {
            expect(param.values).toBeDefined();
            expect(Array.isArray(param.values)).toBe(true);
            expect(param.values!.length).toBeGreaterThan(0);
          }
        }
      }
    });
  });
});

describe('Barebones templates structure content', () => {
  it('barebones_trait should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'trait', 'barebones_trait.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('category');
  });

  it('barebones_decision should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'decision', 'barebones_decision.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('is_shown');
    expect(parsed.structure).toContain('effect');
  });

  it('barebones_event should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'event', 'barebones_event.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('namespace');
    expect(parsed.structure).toContain('option');
  });

  it('secret_type should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'secret', 'secret_type.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('category');
    expect(parsed.structure).toContain('on_expose');
  });

  it('character_interaction should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'interaction', 'character_interaction.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('is_shown');
    expect(parsed.structure).toContain('on_accept');
  });

  it('activity_type should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'activity', 'activity_type.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('phases');
    expect(parsed.structure).toContain('on_complete');
  });

  it('scheme_type should have structure with {{name}}', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'scheme', 'scheme_type.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}');
    expect(parsed.structure).toContain('skill');
    expect(parsed.structure).toContain('on_succeed');
  });

  it('event_chain should have structure with multiple events', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'event', 'event_chain.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('{{name}}.0001');
    expect(parsed.structure).toContain('{{name}}.0002');
    expect(parsed.structure).toContain('{{name}}.0010');
    expect(parsed.structure).toContain('save_scope_as');
  });

  it('scheme_event should have on_actions documentation', async () => {
    const content = await fs.readFile(
      path.join(templatesDir, 'event', 'scheme_event.yml'),
      'utf-8'
    );
    const parsed = yaml.parse(content);

    expect(parsed.structure).toContain('scope:scheme');
    expect(parsed.structure).toContain('scope:owner');
    expect(parsed.structure).toContain('on_actions');
  });
});

describe('Template categories match directory', () => {
  it('template category field should match its directory', async () => {
    const templates = await getAllTemplates();

    for (const template of templates) {
      const content = await fs.readFile(template.path, 'utf-8');
      const parsed = yaml.parse(content) as TemplateDefinition;

      expect(parsed.category).toBe(template.category);
    }
  });
});

describe('Template localization', () => {
  it('should have localization section', async () => {
    const templates = await getAllTemplates();

    for (const template of templates) {
      const content = await fs.readFile(template.path, 'utf-8');
      const parsed = yaml.parse(content) as TemplateDefinition;

      expect(parsed.localization).toBeDefined();
    }
  });

  it('should have localization keys defined', async () => {
    const templates = await getAllTemplates();

    for (const template of templates) {
      const content = await fs.readFile(template.path, 'utf-8');
      const parsed = yaml.parse(content) as TemplateDefinition;

      // Templates should have either name_template (new style) or title (old event style)
      const hasNameTemplate = parsed.localization?.name_template !== undefined;
      const hasTitle = parsed.localization?.title !== undefined;

      expect(hasNameTemplate || hasTitle).toBe(true);
    }
  });
});

describe('Template count', () => {
  it('should have expected number of templates', async () => {
    const templates = await getAllTemplates();

    // We should have at least the templates we created
    const categories = new Set(templates.map((t) => t.category));

    expect(categories.has('trait')).toBe(true);
    expect(categories.has('decision')).toBe(true);
    expect(categories.has('event')).toBe(true);
    expect(categories.has('building')).toBe(true);
    expect(categories.has('secret')).toBe(true);
    expect(categories.has('interaction')).toBe(true);
    expect(categories.has('activity')).toBe(true);
    expect(categories.has('scheme')).toBe(true);
  });
});
