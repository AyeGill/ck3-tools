#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const template_based_1 = require("./generator/template-based");
const program = new commander_1.Command();
program
    .name('ck3gen')
    .description('Code generation tool for Crusader Kings 3 modding')
    .version('0.1.0');
// Template-based generation command
program
    .command('from-template')
    .description('Generate content from a YAML template')
    .requiredOption('--template <name>', 'Template name (e.g., economy_building)')
    .requiredOption('--category <category>', 'Category (building, trait, decision, event)')
    .requiredOption('--name <name>', 'Item name')
    .option('--levels <number>', 'Number of levels (for leveled content)')
    .option('--base-cost <number>', 'Base cost')
    .option('--cost-scaling <number>', 'Cost scaling factor')
    .option('--primary-effect <type>', 'Primary effect/stat')
    .option('--output <path>', 'Output directory', './output')
    .option('--param <key=value...>', 'Additional parameters (can be repeated)')
    .action(async (options) => {
    try {
        const generator = new template_based_1.TemplateGenerator();
        // Parse parameters
        const params = {
            name: options.name
        };
        if (options.levels)
            params.levels = parseInt(options.levels);
        if (options.baseCost)
            params.base_cost = parseInt(options.baseCost);
        if (options.costScaling)
            params.cost_scaling = parseFloat(options.costScaling);
        if (options.primaryEffect)
            params.primary_effect = options.primaryEffect;
        // Parse additional params (--param key=value)
        if (options.param) {
            const paramList = Array.isArray(options.param) ? options.param : [options.param];
            for (const param of paramList) {
                const [key, value] = param.split('=');
                // Try to parse as number
                if (!isNaN(Number(value))) {
                    params[key] = Number(value);
                }
                else if (value === 'true') {
                    params[key] = true;
                }
                else if (value === 'false') {
                    params[key] = false;
                }
                else {
                    params[key] = value;
                }
            }
        }
        const result = await generator.generate({
            templateName: options.template,
            category: options.category,
            parameters: params,
            outputPath: options.output
        });
        console.log(`✓ Generated from template '${options.template}'`);
        console.log(`✓ Output: ${result.file}`);
        console.log(`✓ Localization: ${result.locFile}`);
    }
    catch (error) {
        console.error('Error generating from template:', error);
        process.exit(1);
    }
});
// List available templates
program
    .command('list-templates')
    .description('List available templates')
    .argument('<category>', 'Category (building, trait, decision, event)')
    .action(async (category) => {
    try {
        const generator = new template_based_1.TemplateGenerator();
        const templates = await generator.listTemplates(category);
        if (templates.length === 0) {
            console.log(`No templates found for category: ${category}`);
        }
        else {
            console.log(`Available templates for ${category}:`);
            templates.forEach(t => console.log(`  - ${t}`));
        }
    }
    catch (error) {
        console.error('Error listing templates:', error);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=cli.js.map