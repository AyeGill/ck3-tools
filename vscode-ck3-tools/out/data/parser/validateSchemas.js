"use strict";
/**
 * Schema Validation Script
 *
 * Compares our schema definitions against actual CK3 game files to find:
 * - Fields in our schema that don't appear in game files (potentially hallucinated)
 * - Fields in game files that aren't in our schema (missing coverage)
 *
 * Usage:
 *   npx ts-node src/data/parser/validateSchemas.ts [/path/to/ck3/game]
 *
 * Default CK3 game path:
 *   macOS: /Users/eigil/Library/Application Support/Steam/steamapps/common/Crusader Kings III/game
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const SCHEMA_MAPPINGS = [
    { schemaName: 'trait', schemaFile: 'traitSchema', gameDir: 'common/traits' },
    { schemaName: 'event', schemaFile: 'eventSchema', gameDir: 'events', parseMode: 'nested' },
    { schemaName: 'decision', schemaFile: 'decisionSchema', gameDir: 'common/decisions', parseMode: 'nested' },
    { schemaName: 'interaction', schemaFile: 'interactionSchema', gameDir: 'common/character_interactions', parseMode: 'nested' },
    { schemaName: 'building', schemaFile: 'buildingSchema', gameDir: 'common/buildings', parseMode: 'nested' },
    { schemaName: 'onAction', schemaFile: 'onActionSchema', gameDir: 'common/on_actions', parseMode: 'nested' },
    { schemaName: 'scheme', schemaFile: 'schemeSchema', gameDir: 'common/schemes', parseMode: 'nested' },
    { schemaName: 'menAtArms', schemaFile: 'menAtArmsSchema', gameDir: 'common/men_at_arms_types', parseMode: 'nested' },
    { schemaName: 'casusBelli', schemaFile: 'casusBelliSchema', gameDir: 'common/casus_belli_types', parseMode: 'nested' },
    { schemaName: 'culture', schemaFile: 'cultureSchema', gameDir: 'common/culture/cultures', parseMode: 'nested' },
    { schemaName: 'tradition', schemaFile: 'cultureSchema', gameDir: 'common/culture/traditions', parseMode: 'nested' },
    { schemaName: 'faith', schemaFile: 'faithSchema', gameDir: 'common/religion/religions', parseMode: 'deep-nested' },
    { schemaName: 'religion', schemaFile: 'faithSchema', gameDir: 'common/religion/religions', parseMode: 'nested' },
    { schemaName: 'artifact', schemaFile: 'artifactSchema', gameDir: 'common/artifacts', parseMode: 'nested' },
    { schemaName: 'courtPosition', schemaFile: 'courtPositionSchema', gameDir: 'common/court_positions', parseMode: 'nested' },
    { schemaName: 'lifestyle', schemaFile: 'lifestyleSchema', gameDir: 'common/lifestyles', parseMode: 'nested' },
    { schemaName: 'dynastyLegacy', schemaFile: 'dynastyLegacySchema', gameDir: 'common/dynasty_legacies', parseMode: 'nested' },
    { schemaName: 'law', schemaFile: 'lawSchema', gameDir: 'common/laws', parseMode: 'nested' },
    { schemaName: 'government', schemaFile: 'governmentSchema', gameDir: 'common/governments', parseMode: 'nested' },
    { schemaName: 'faction', schemaFile: 'factionSchema', gameDir: 'common/factions', parseMode: 'nested' },
    { schemaName: 'councilTask', schemaFile: 'councilTaskSchema', gameDir: 'common/council_tasks', parseMode: 'nested' },
    { schemaName: 'opinionModifier', schemaFile: 'opinionModifierSchema', gameDir: 'common/opinion_modifiers', parseMode: 'nested' },
    { schemaName: 'secret', schemaFile: 'secretSchema', gameDir: 'common/secret_types', parseMode: 'nested' },
    { schemaName: 'nickname', schemaFile: 'nicknameSchema', gameDir: 'common/nicknames', parseMode: 'nested' },
    { schemaName: 'hook', schemaFile: 'hookSchema', gameDir: 'common/hook_types', parseMode: 'nested' },
    { schemaName: 'activity', schemaFile: 'activitySchema', gameDir: 'common/activities', parseMode: 'nested' },
    { schemaName: 'gameRule', schemaFile: 'gameRuleSchema', gameDir: 'common/game_rules', parseMode: 'nested' },
    { schemaName: 'bookmark', schemaFile: 'bookmarkSchema', gameDir: 'common/bookmarks', parseMode: 'nested' },
    { schemaName: 'storyCycle', schemaFile: 'storyCycleSchema', gameDir: 'common/story_cycles', parseMode: 'nested' },
    { schemaName: 'vassalContract', schemaFile: 'vassalContractSchema', gameDir: 'common/vassal_contracts', parseMode: 'nested' },
    { schemaName: 'landedTitle', schemaFile: 'landedTitleSchema', gameDir: 'common/landed_titles', parseMode: 'nested' },
    { schemaName: 'innovation', schemaFile: 'innovationSchema', gameDir: 'common/culture/innovations', parseMode: 'nested' },
    { schemaName: 'doctrine', schemaFile: 'doctrineSchema', gameDir: 'common/religion/doctrines', parseMode: 'nested' },
    { schemaName: 'holySite', schemaFile: 'holySiteSchema', gameDir: 'common/religion/holy_sites', parseMode: 'nested' },
    { schemaName: 'holding', schemaFile: 'holdingSchema', gameDir: 'common/holdings', parseMode: 'nested' },
    { schemaName: 'dynasty', schemaFile: 'dynastySchema', gameDir: 'common/dynasties', parseMode: 'nested' },
    { schemaName: 'terrain', schemaFile: 'terrainSchema', gameDir: 'common/terrain_types', parseMode: 'nested' },
    { schemaName: 'accoladeType', schemaFile: 'accoladeTypeSchema', gameDir: 'common/accolade_types', parseMode: 'nested' },
    { schemaName: 'legend', schemaFile: 'legendSchema', gameDir: 'common/legends', parseMode: 'nested' },
    { schemaName: 'travel', schemaFile: 'travelSchema', gameDir: 'common/travel', parseMode: 'nested' },
    { schemaName: 'struggle', schemaFile: 'struggleSchema', gameDir: 'common/struggle', parseMode: 'nested' },
    { schemaName: 'inspiration', schemaFile: 'inspirationSchema', gameDir: 'common/inspirations', parseMode: 'nested' },
    { schemaName: 'diarchy', schemaFile: 'diarchySchema', gameDir: 'common/diarchies', parseMode: 'nested' },
    { schemaName: 'domicile', schemaFile: 'domicileSchema', gameDir: 'common/domiciles', parseMode: 'nested' },
    { schemaName: 'epidemic', schemaFile: 'epidemicSchema', gameDir: 'common/epidemics', parseMode: 'nested' },
];
/**
 * Extract top-level field names from CK3 script files
 * This handles the nested block structure: entity_name = { field = value }
 */
function extractFieldsFromGameFiles(gameDir, parseMode = 'nested') {
    const fields = new Set();
    if (!fs.existsSync(gameDir)) {
        console.error(`  Directory not found: ${gameDir}`);
        return fields;
    }
    const files = fs.readdirSync(gameDir).filter(f => f.endsWith('.txt'));
    for (const file of files) {
        const filePath = path.join(gameDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        // Remove comments
        const lines = content.split('\n').map(line => {
            const commentIndex = line.indexOf('#');
            return commentIndex >= 0 ? line.substring(0, commentIndex) : line;
        });
        // Track brace depth to find fields at the right nesting level
        let depth = 0;
        const targetDepth = parseMode === 'deep-nested' ? 2 : 1;
        for (const line of lines) {
            // Count braces
            for (const char of line) {
                if (char === '{')
                    depth++;
                if (char === '}')
                    depth--;
            }
            // Look for field assignments at the target depth
            // Pattern: field_name = (anything)
            if (depth >= targetDepth) {
                const match = line.match(/^\s+([a-z_][a-z_0-9]*)\s*=/i);
                if (match) {
                    const fieldName = match[1].toLowerCase();
                    // Ignore numeric fields (like "50 = { }" in traits)
                    if (!/^\d+$/.test(fieldName)) {
                        fields.add(fieldName);
                    }
                }
            }
        }
    }
    return fields;
}
/**
 * Get schema field names from our schema file
 */
function getSchemaFields(schemaFile) {
    const fields = new Set();
    try {
        // Read the schema file directly
        const schemaPath = path.join(__dirname, '..', '..', 'schemas', `${schemaFile}.ts`);
        if (!fs.existsSync(schemaPath)) {
            console.error(`  Schema file not found: ${schemaPath}`);
            return fields;
        }
        const content = fs.readFileSync(schemaPath, 'utf-8');
        // Extract field names from the schema array
        // Pattern: name: 'field_name'
        const matches = content.matchAll(/name:\s*['"]([a-z_][a-z_0-9]*)['"]/gi);
        for (const match of matches) {
            fields.add(match[1].toLowerCase());
        }
    }
    catch (error) {
        console.error(`  Error reading schema: ${error}`);
    }
    return fields;
}
function validateSchema(mapping, gamePath) {
    const gameDir = path.join(gamePath, mapping.gameDir);
    const schemaFields = getSchemaFields(mapping.schemaFile);
    const gameFields = extractFieldsFromGameFiles(gameDir, mapping.parseMode || 'nested');
    // Find differences
    const missingInGame = [...schemaFields].filter(f => !gameFields.has(f));
    const missingInSchema = [...gameFields].filter(f => !schemaFields.has(f));
    // Filter out common effect/trigger blocks that we don't need to track as schema fields
    const effectTriggerBlocks = new Set([
        'trigger', 'effect', 'immediate', 'after', 'option', 'on_activate', 'on_complete',
        'on_start', 'on_end', 'on_success', 'on_failure', 'on_monthly', 'on_yearly',
        'on_invalidated', 'weight', 'ai_chance', 'ai_will_do', 'limit', 'modifier',
        'multiply', 'add', 'if', 'else', 'else_if', 'while', 'switch', 'random',
        'random_list', 'ordered_random', 'and', 'or', 'not', 'nor', 'nand',
        'save_scope_as', 'save_scope_value_as', 'save_temporary_scope_as',
        'hidden_effect', 'show_as_tooltip', 'custom_tooltip', 'debug_log',
        // Common iterator patterns
        'every_', 'any_', 'random_', 'ordered_',
    ]);
    const filteredMissingInSchema = missingInSchema.filter(f => {
        // Keep if it doesn't match any effect/trigger pattern
        return !effectTriggerBlocks.has(f) &&
            !f.startsWith('every_') &&
            !f.startsWith('any_') &&
            !f.startsWith('random_') &&
            !f.startsWith('ordered_') &&
            !f.startsWith('scripted_') &&
            !f.endsWith('_effect') &&
            !f.endsWith('_trigger');
    });
    return {
        schemaName: mapping.schemaName,
        schemaFields: [...schemaFields].sort(),
        gameFields: [...gameFields].sort(),
        missingInGame,
        missingInSchema: filteredMissingInSchema,
    };
}
/**
 * Main function
 */
async function main() {
    const defaultGamePath = '/Users/eigil/Library/Application Support/Steam/steamapps/common/Crusader Kings III/game';
    const gamePath = process.argv[2] || defaultGamePath;
    if (!fs.existsSync(gamePath)) {
        console.error(`Game path not found: ${gamePath}`);
        console.error('\nUsage:');
        console.error('  npx ts-node src/data/parser/validateSchemas.ts [/path/to/ck3/game]');
        process.exit(1);
    }
    console.log(`Validating schemas against: ${gamePath}\n`);
    console.log('='.repeat(80));
    const results = [];
    let totalIssues = 0;
    for (const mapping of SCHEMA_MAPPINGS) {
        console.log(`\nValidating ${mapping.schemaName}...`);
        const result = validateSchema(mapping, gamePath);
        results.push(result);
        if (result.missingInGame.length > 0) {
            console.log(`  ⚠️  Fields in schema but NOT in game files (possibly hallucinated):`);
            for (const field of result.missingInGame) {
                console.log(`      - ${field}`);
            }
            totalIssues += result.missingInGame.length;
        }
        if (result.missingInSchema.length > 0) {
            console.log(`  ℹ️  Fields in game but not in schema (missing coverage):`);
            for (const field of result.missingInSchema.slice(0, 10)) {
                console.log(`      - ${field}`);
            }
            if (result.missingInSchema.length > 10) {
                console.log(`      ... and ${result.missingInSchema.length - 10} more`);
            }
        }
        if (result.missingInGame.length === 0 && result.missingInSchema.length === 0) {
            console.log(`  ✓ Schema looks good!`);
        }
    }
    console.log('\n' + '='.repeat(80));
    console.log(`\nSummary:`);
    console.log(`  Schemas validated: ${results.length}`);
    console.log(`  Potential issues (fields not in game): ${totalIssues}`);
    // Write detailed report
    const reportPath = path.join(__dirname, 'validation-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nDetailed report written to: ${reportPath}`);
    // List schemas with potential hallucinations
    const problematic = results.filter(r => r.missingInGame.length > 0);
    if (problematic.length > 0) {
        console.log('\n⚠️  Schemas with potential hallucinated fields:');
        for (const r of problematic) {
            console.log(`  - ${r.schemaName}: ${r.missingInGame.join(', ')}`);
        }
    }
}
main().catch(console.error);
//# sourceMappingURL=validateSchemas.js.map