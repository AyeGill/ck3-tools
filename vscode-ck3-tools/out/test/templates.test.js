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
/**
 * Tests for CK3 Templates
 *
 * Validates that all templates can be loaded, parsed, and have required fields.
 */
const vitest_1 = require("vitest");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const yaml = __importStar(require("yaml"));
const templatesDir = path.join(__dirname, '../../templates');
// Get all template files
async function getAllTemplates() {
    const templates = [];
    const categories = await fs_1.promises.readdir(templatesDir);
    for (const category of categories) {
        const categoryPath = path.join(templatesDir, category);
        const stat = await fs_1.promises.stat(categoryPath);
        if (stat.isDirectory()) {
            const files = await fs_1.promises.readdir(categoryPath);
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
(0, vitest_1.describe)('Template Loading and Validation', () => {
    let templates;
    (0, vitest_1.beforeAll)(async () => {
        templates = await getAllTemplates();
    });
    (0, vitest_1.it)('should find templates in the templates directory', async () => {
        (0, vitest_1.expect)(templates.length).toBeGreaterThan(0);
    });
    (0, vitest_1.describe)('All templates should be valid YAML', () => {
        (0, vitest_1.it)('should parse all templates as valid YAML', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                try {
                    const parsed = yaml.parse(content);
                    (0, vitest_1.expect)(parsed).toBeDefined();
                    (0, vitest_1.expect)(parsed).not.toBeNull();
                }
                catch (error) {
                    throw new Error(`Failed to parse ${template.category}/${template.file}: ${error}`);
                }
            }
        });
    });
    (0, vitest_1.describe)('All templates should have required fields', () => {
        (0, vitest_1.it)('should have name field matching filename', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                (0, vitest_1.expect)(parsed.name).toBeDefined();
                (0, vitest_1.expect)(parsed.name).toBe(template.file);
            }
        });
        (0, vitest_1.it)('should have description field', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                (0, vitest_1.expect)(parsed.description).toBeDefined();
                (0, vitest_1.expect)(typeof parsed.description).toBe('string');
                (0, vitest_1.expect)(parsed.description.length).toBeGreaterThan(0);
            }
        });
        (0, vitest_1.it)('should have category field', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                (0, vitest_1.expect)(parsed.category).toBeDefined();
                (0, vitest_1.expect)(typeof parsed.category).toBe('string');
            }
        });
        (0, vitest_1.it)('should have version field', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                (0, vitest_1.expect)(parsed.version).toBeDefined();
            }
        });
        (0, vitest_1.it)('should have parameters field with name or namespace parameter', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                (0, vitest_1.expect)(parsed.parameters).toBeDefined();
                // Templates should have either 'name' or 'namespace' as the primary identifier
                const hasName = parsed.parameters.name !== undefined;
                const hasNamespace = parsed.parameters.namespace !== undefined;
                (0, vitest_1.expect)(hasName || hasNamespace).toBe(true);
                if (hasName) {
                    (0, vitest_1.expect)(parsed.parameters.name.type).toBe('string');
                    (0, vitest_1.expect)(parsed.parameters.name.required).toBe(true);
                }
                if (hasNamespace) {
                    (0, vitest_1.expect)(parsed.parameters.namespace.type).toBe('string');
                    (0, vitest_1.expect)(parsed.parameters.namespace.required).toBe(true);
                }
            }
        });
        (0, vitest_1.it)('should have structure field', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                (0, vitest_1.expect)(parsed.structure).toBeDefined();
            }
        });
    });
    (0, vitest_1.describe)('Template parameter validation', () => {
        (0, vitest_1.it)('should have valid parameter types', async () => {
            const validTypes = ['string', 'integer', 'float', 'boolean', 'enum'];
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                for (const [paramName, param] of Object.entries(parsed.parameters)) {
                    (0, vitest_1.expect)(validTypes).toContain(param.type);
                }
            }
        });
        (0, vitest_1.it)('should have enum values for enum parameters', async () => {
            for (const template of templates) {
                const content = await fs_1.promises.readFile(template.path, 'utf-8');
                const parsed = yaml.parse(content);
                for (const [paramName, param] of Object.entries(parsed.parameters)) {
                    if (param.type === 'enum') {
                        (0, vitest_1.expect)(param.values).toBeDefined();
                        (0, vitest_1.expect)(Array.isArray(param.values)).toBe(true);
                        (0, vitest_1.expect)(param.values.length).toBeGreaterThan(0);
                    }
                }
            }
        });
    });
});
(0, vitest_1.describe)('Barebones templates structure content', () => {
    (0, vitest_1.it)('barebones_trait should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'trait', 'barebones_trait.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('category');
    });
    (0, vitest_1.it)('barebones_decision should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'decision', 'barebones_decision.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('is_shown');
        (0, vitest_1.expect)(parsed.structure).toContain('effect');
    });
    (0, vitest_1.it)('barebones_event should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'event', 'barebones_event.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('namespace');
        (0, vitest_1.expect)(parsed.structure).toContain('option');
    });
    (0, vitest_1.it)('secret_type should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'secret', 'secret_type.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('category');
        (0, vitest_1.expect)(parsed.structure).toContain('on_expose');
    });
    (0, vitest_1.it)('character_interaction should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'interaction', 'character_interaction.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('is_shown');
        (0, vitest_1.expect)(parsed.structure).toContain('on_accept');
    });
    (0, vitest_1.it)('activity_type should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'activity', 'activity_type.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('phases');
        (0, vitest_1.expect)(parsed.structure).toContain('on_complete');
    });
    (0, vitest_1.it)('scheme_type should have structure with {{name}}', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'scheme', 'scheme_type.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}');
        (0, vitest_1.expect)(parsed.structure).toContain('skill');
        (0, vitest_1.expect)(parsed.structure).toContain('on_succeed');
    });
    (0, vitest_1.it)('event_chain should have structure with multiple events', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'event', 'event_chain.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}.0001');
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}.0002');
        (0, vitest_1.expect)(parsed.structure).toContain('{{name}}.0010');
        (0, vitest_1.expect)(parsed.structure).toContain('save_scope_as');
    });
    (0, vitest_1.it)('scheme_event should have on_actions documentation', async () => {
        const content = await fs_1.promises.readFile(path.join(templatesDir, 'event', 'scheme_event.yml'), 'utf-8');
        const parsed = yaml.parse(content);
        (0, vitest_1.expect)(parsed.structure).toContain('scope:scheme');
        (0, vitest_1.expect)(parsed.structure).toContain('scope:owner');
        (0, vitest_1.expect)(parsed.structure).toContain('on_actions');
    });
});
(0, vitest_1.describe)('Template categories match directory', () => {
    (0, vitest_1.it)('template category field should match its directory', async () => {
        const templates = await getAllTemplates();
        for (const template of templates) {
            const content = await fs_1.promises.readFile(template.path, 'utf-8');
            const parsed = yaml.parse(content);
            (0, vitest_1.expect)(parsed.category).toBe(template.category);
        }
    });
});
(0, vitest_1.describe)('Template localization', () => {
    (0, vitest_1.it)('should have localization section', async () => {
        const templates = await getAllTemplates();
        for (const template of templates) {
            const content = await fs_1.promises.readFile(template.path, 'utf-8');
            const parsed = yaml.parse(content);
            (0, vitest_1.expect)(parsed.localization).toBeDefined();
        }
    });
    (0, vitest_1.it)('should have localization keys defined', async () => {
        const templates = await getAllTemplates();
        for (const template of templates) {
            const content = await fs_1.promises.readFile(template.path, 'utf-8');
            const parsed = yaml.parse(content);
            // Templates should have either name_template (new style) or title (old event style)
            const hasNameTemplate = parsed.localization?.name_template !== undefined;
            const hasTitle = parsed.localization?.title !== undefined;
            (0, vitest_1.expect)(hasNameTemplate || hasTitle).toBe(true);
        }
    });
});
(0, vitest_1.describe)('Template count', () => {
    (0, vitest_1.it)('should have expected number of templates', async () => {
        const templates = await getAllTemplates();
        // We should have at least the templates we created
        const categories = new Set(templates.map((t) => t.category));
        (0, vitest_1.expect)(categories.has('trait')).toBe(true);
        (0, vitest_1.expect)(categories.has('decision')).toBe(true);
        (0, vitest_1.expect)(categories.has('event')).toBe(true);
        (0, vitest_1.expect)(categories.has('building')).toBe(true);
        (0, vitest_1.expect)(categories.has('secret')).toBe(true);
        (0, vitest_1.expect)(categories.has('interaction')).toBe(true);
        (0, vitest_1.expect)(categories.has('activity')).toBe(true);
        (0, vitest_1.expect)(categories.has('scheme')).toBe(true);
    });
});
//# sourceMappingURL=templates.test.js.map