/**
 * Parser for CK3 script_docs output
 *
 * Usage:
 *   # Parse from local script_docs folder (default):
 *   npx ts-node src/data/parser/parseOldEnt.ts
 *
 *   # Parse from a custom directory:
 *   npx ts-node src/data/parser/parseOldEnt.ts /path/to/ck3/logs
 *
 * To update the script_docs files:
 *   1. In CK3, open console (~) and run: script_docs
 *   2. Copy the logs to src/data/script_docs/:
 *      - macOS: ~/Documents/Paradox Interactive/Crusader Kings III/logs/
 *      - Windows: %USERPROFILE%\Documents\Paradox Interactive\Crusader Kings III\logs\
 *      - Linux: ~/.local/share/Paradox Interactive/Crusader Kings III/logs/
 */

import * as fs from 'fs';
import * as path from 'path';

interface ParsedEffect {
  name: string;
  description: string;
  syntax?: string;
  supportedScopes: string[];
  supportedTargets?: string[];
  parameters?: string[];
}

interface ParsedTrigger {
  name: string;
  description: string;
  syntax?: string;
  supportedScopes: string[];
  supportedTargets?: string[];
  valueType?: string; // e.g., "yes/no", "<, <=, =, !=, >, >="
  parameters?: string[];
}

/**
 * Common effect/trigger names to skip when extracting parameters
 * (these might appear in example code but aren't parameters)
 */
const KNOWN_EFFECTS_TRIGGERS = new Set([
  // Common effects that appear in examples
  'add_gold', 'add_dread', 'add_piety', 'add_prestige', 'add_stress',
  'add_trait', 'remove_trait', 'set_trait', 'add_hook', 'add_opinion',
  'save_scope_as', 'save_temporary_scope_as', 'create_character',
  'death', 'imprison', 'release', 'kill', 'spawn_army',
  // Common triggers that appear in examples
  'is_adult', 'is_alive', 'is_ruler', 'has_trait', 'age', 'gold',
  // Scope changers often used in examples
  'root', 'prev', 'this', 'from', 'scope', 'liege', 'primary_spouse',
  // Control flow
  'if', 'else', 'else_if', 'and', 'or', 'not', 'limit',
]);

/**
 * Extract parameter names from syntax documentation
 * Looks for patterns like "param = value" or "param = { ... }"
 */
function extractParameters(syntax: string | undefined, name: string): string[] {
  if (!syntax) return [];

  const params = new Set<string>();

  // Common parameter patterns in the syntax documentation
  // Match lines like: "  param = value" or "param = { ... }"
  const paramRegex = /^\s*([a-z_][a-z0-9_]*)\s*=/gim;

  let match;
  while ((match = paramRegex.exec(syntax)) !== null) {
    const param = match[1].toLowerCase();
    // Skip the effect/trigger name itself, known effects/triggers, and common non-parameter words
    if (param !== name.toLowerCase() &&
        !KNOWN_EFFECTS_TRIGGERS.has(param) &&
        !['x', 'y', 'z', 'w', 'a', 'b', 'int', 'yes', 'no', 'key', 'value', 'script', 'trigger', 'triggers', 'effect', 'effects'].includes(param)) {
      params.add(param);
    }
  }

  // Also extract from angle bracket patterns like <count=num/all>
  const bracketRegex = /<([a-z_][a-z0-9_]*)=/gi;
  while ((match = bracketRegex.exec(syntax)) !== null) {
    params.add(match[1].toLowerCase());
  }

  return Array.from(params);
}

interface ParsedModifier {
  name: string;
  useAreas: string[];
}


/**
 * Parse the effects.log format
 */
function parseEffects(content: string): ParsedEffect[] {
  const effects: ParsedEffect[] = [];

  // Split by separator lines
  const entries = content.split(/^-{20,}$/m);

  for (const entry of entries) {
    const trimmed = entry.trim();
    if (!trimmed || trimmed === 'Effect Documentation:') continue;

    const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) continue;

    // First line is "name - description"
    const firstLine = lines[0];
    const dashIndex = firstLine.indexOf(' - ');

    if (dashIndex === -1) continue;

    const name = firstLine.substring(0, dashIndex).trim();
    const description = firstLine.substring(dashIndex + 3).trim();

    let syntax: string | undefined;
    let supportedScopes: string[] = [];
    let supportedTargets: string[] = [];

    // Parse remaining lines
    const syntaxLines: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('Supported Scopes:')) {
        const scopes = line.replace('Supported Scopes:', '').trim();
        supportedScopes = scopes.split(/[,\s]+/).map(s => s.trim()).filter(s => s);
      } else if (line.startsWith('Supported Targets:')) {
        const targets = line.replace('Supported Targets:', '').trim();
        supportedTargets = targets.split(/[,\s]+/).map(s => s.trim()).filter(s => s);
      } else {
        // Syntax line
        syntaxLines.push(line);
      }
    }

    if (syntaxLines.length > 0) {
      syntax = syntaxLines.join('\n');
    }

    if (supportedScopes.length === 0) {
      // Some effects don't have explicit scopes, default to 'none'
      supportedScopes = ['none'];
    }

    // Extract parameters from syntax documentation
    const parameters = extractParameters(syntax, name);

    effects.push({
      name,
      description,
      syntax,
      supportedScopes,
      supportedTargets: supportedTargets.length > 0 ? supportedTargets : undefined,
      parameters: parameters.length > 0 ? parameters : undefined,
    });
  }

  return effects;
}

/**
 * Parse the triggers.log format
 */
function parseTriggers(content: string): ParsedTrigger[] {
  const triggers: ParsedTrigger[] = [];

  // Split by separator lines
  const entries = content.split(/^-{20,}$/m);

  for (const entry of entries) {
    const trimmed = entry.trim();
    if (!trimmed || trimmed === 'Trigger Documentation:') continue;

    const lines = trimmed.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 0) continue;

    // First line is "name - description"
    const firstLine = lines[0];
    const dashIndex = firstLine.indexOf(' - ');

    if (dashIndex === -1) continue;

    const name = firstLine.substring(0, dashIndex).trim();
    const description = firstLine.substring(dashIndex + 3).trim();

    let syntax: string | undefined;
    let supportedScopes: string[] = [];
    let supportedTargets: string[] = [];
    let valueType: string | undefined;

    // Parse remaining lines
    const syntaxLines: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('Supported Scopes:')) {
        const scopes = line.replace('Supported Scopes:', '').trim();
        supportedScopes = scopes.split(/[,\s]+/).map(s => s.trim()).filter(s => s);
      } else if (line.startsWith('Supported Targets:')) {
        const targets = line.replace('Supported Targets:', '').trim();
        supportedTargets = targets.split(/[,\s]+/).map(s => s.trim()).filter(s => s);
      } else if (line.startsWith('Traits:')) {
        valueType = line.replace('Traits:', '').trim();
      } else {
        // Syntax line
        syntaxLines.push(line);
      }
    }

    if (syntaxLines.length > 0) {
      syntax = syntaxLines.join('\n');
    }

    if (supportedScopes.length === 0) {
      supportedScopes = ['none'];
    }

    // Extract parameters from syntax documentation
    const parameters = extractParameters(syntax, name);

    triggers.push({
      name,
      description,
      syntax,
      supportedScopes,
      supportedTargets: supportedTargets.length > 0 ? supportedTargets : undefined,
      valueType,
      parameters: parameters.length > 0 ? parameters : undefined,
    });
  }

  return triggers;
}

/**
 * Parse the modifiers.log format
 */
function parseModifiers(content: string): ParsedModifier[] {
  const modifiers: ParsedModifier[] = [];
  const lines = content.split('\n');

  let currentName: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('Tag:')) {
      currentName = trimmed.replace('Tag:', '').trim();
    } else if (trimmed.startsWith('Use areas:') && currentName) {
      const areas = trimmed.replace('Use areas:', '').trim();
      const useAreas = areas.split(/,\s*and\s*|,\s*/).map(a => a.trim()).filter(a => a);

      modifiers.push({
        name: currentName,
        useAreas,
      });
      currentName = null;
    }
  }

  return modifiers;
}

/**
 * Normalize scope names to our ScopeType
 */
function normalizeScope(scope: string): string {
  const mapping: Record<string, string> = {
    'all': 'none',
    'title': 'landed_title',
    'county': 'landed_title',
    'house': 'dynasty_house',
  };

  const lower = scope.toLowerCase().replace(/\s+/g, '_');
  return mapping[lower] || lower;
}

// Track source for generated file comments
let sourceInfo = 'Local script_docs files';

/**
 * Generate TypeScript code for effects
 */
function generateEffectsCode(effects: ParsedEffect[]): string {
  const lines: string[] = [
    '/**',
    ' * CK3 Effect Definitions (Auto-generated)',
    ' * ',
    ' * Effects are commands that modify game state.',
    ' * Each effect has a list of scopes where it can be used.',
    ' * ',
    ` * Source: ${sourceInfo}`,
    ` * Total effects: ${effects.length}`,
    ' */',
    '',
    "import { ScopeType } from './scopes';",
    '',
    'export interface EffectDefinition {',
    '  name: string;',
    '  description: string;',
    '  supportedScopes: ScopeType[];',
    '  supportedTargets?: ScopeType[];',
    '  outputScope?: ScopeType;',
    '  isIterator?: boolean;',
    '  syntax?: string;',
    '  parameters?: string[];',
    '}',
    '',
  ];

  // Group effects by primary scope
  const byScope: Record<string, ParsedEffect[]> = {};

  for (const effect of effects) {
    const primaryScope = effect.supportedScopes[0] || 'none';
    if (!byScope[primaryScope]) {
      byScope[primaryScope] = [];
    }
    byScope[primaryScope].push(effect);
  }

  // Generate arrays for each scope category
  const scopeOrder = [
    'character', 'landed_title', 'province', 'dynasty', 'dynasty_house',
    'culture', 'culture_innovation', 'faith', 'religion', 'army', 'scheme', 'war', 'activity',
    'artifact', 'secret', 'faction', 'holy_order', 'mercenary_company',
    'inspiration', 'story', 'casus_belli', 'travel_plan', 'council_task',
    'great_holy_war', 'struggle', 'legend', 'accolade', 'epidemic',
    // Roads to Power scopes
    'task_contract', 'situation', 'situation_sub_region', 'tax_slot',
    'domicile', 'great_project', 'confederation', 'house_relation', 'agent_slot',
    'none'
  ];

  for (const scope of scopeOrder) {
    const scopeEffects = byScope[scope];
    if (!scopeEffects || scopeEffects.length === 0) continue;

    const varName = scope === 'none' ? 'generalEffects' : `${scope.replace(/_/g, '')}Effects`;

    lines.push(`/**`);
    lines.push(` * Effects for ${scope} scope (${scopeEffects.length} effects)`);
    lines.push(` */`);
    lines.push(`export const ${varName}: EffectDefinition[] = [`);

    for (const effect of scopeEffects) {
      const scopes = effect.supportedScopes.map(s => `'${normalizeScope(s)}'`).join(', ');
      const targets = effect.supportedTargets
        ? `, supportedTargets: [${effect.supportedTargets.map(s => `'${normalizeScope(s)}'`).join(', ')}]`
        : '';
      const isIterator = effect.name.startsWith('every_') || effect.name.startsWith('random_') || effect.name.startsWith('any_') || effect.name.startsWith('ordered_');
      const iteratorFlag = isIterator ? ', isIterator: true' : '';
      const outputScope = isIterator && effect.supportedTargets?.length
        ? `, outputScope: '${normalizeScope(effect.supportedTargets[0])}'`
        : '';
      const syntax = effect.syntax
        ? `, syntax: ${JSON.stringify(effect.syntax)}`  // Full syntax including all lines
        : '';
      const params = effect.parameters?.length
        ? `, parameters: [${effect.parameters.map(p => `'${p}'`).join(', ')}]`
        : '';

      const desc = effect.description.replace(/'/g, "\\'");
      lines.push(`  { name: '${effect.name}', description: '${desc}', supportedScopes: [${scopes}]${targets}${outputScope}${iteratorFlag}${syntax}${params} },`);
    }

    lines.push(`];`);
    lines.push('');
  }

  // Generate allEffects
  const allArrays = scopeOrder
    .filter(s => byScope[s] && byScope[s].length > 0)
    .map(s => s === 'none' ? 'generalEffects' : `${s.replace(/_/g, '')}Effects`);

  lines.push('/**');
  lines.push(' * All effects combined');
  lines.push(' */');
  lines.push(`export const allEffects: EffectDefinition[] = [`);
  for (const arr of allArrays) {
    lines.push(`  ...${arr},`);
  }
  lines.push(`];`);
  lines.push('');

  // Generate helper functions
  lines.push('/**');
  lines.push(' * Get effects valid for a specific scope');
  lines.push(' */');
  lines.push('export function getEffectsForScope(scope: ScopeType): EffectDefinition[] {');
  lines.push('  return allEffects.filter(effect => {');
  lines.push("    if (effect.supportedScopes.includes('none')) return true;");
  lines.push('    return effect.supportedScopes.includes(scope);');
  lines.push('  });');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * Build a map for quick lookup');
  lines.push(' */');
  lines.push('export const effectsMap = new Map<string, EffectDefinition>(');
  lines.push('  allEffects.map(e => [e.name, e])');
  lines.push(');');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate TypeScript code for triggers
 */
function generateTriggersCode(triggers: ParsedTrigger[]): string {
  const lines: string[] = [
    '/**',
    ' * CK3 Trigger Definitions (Auto-generated)',
    ' * ',
    ' * Triggers are conditions that evaluate to true/false.',
    ' * Each trigger has a list of scopes where it can be used.',
    ' * ',
    ` * Source: ${sourceInfo}`,
    ` * Total triggers: ${triggers.length}`,
    ' */',
    '',
    "import { ScopeType } from './scopes';",
    '',
    'export interface TriggerDefinition {',
    '  name: string;',
    '  description: string;',
    '  supportedScopes: ScopeType[];',
    '  supportedTargets?: ScopeType[];',
    '  outputScope?: ScopeType;',
    '  isIterator?: boolean;',
    "  valueType?: 'boolean' | 'comparison' | 'value' | 'block';",
    '  syntax?: string;',
    '  parameters?: string[];',
    '}',
    '',
  ];

  // Group triggers by primary scope
  const byScope: Record<string, ParsedTrigger[]> = {};

  for (const trigger of triggers) {
    const primaryScope = trigger.supportedScopes[0] || 'none';
    if (!byScope[primaryScope]) {
      byScope[primaryScope] = [];
    }
    byScope[primaryScope].push(trigger);
  }

  // Generate arrays for each scope category
  const scopeOrder = [
    'character', 'landed_title', 'province', 'dynasty', 'dynasty_house',
    'culture', 'culture_innovation', 'faith', 'religion', 'army', 'scheme', 'war', 'activity',
    'artifact', 'secret', 'faction', 'holy_order', 'mercenary_company',
    'inspiration', 'story', 'casus_belli', 'travel_plan', 'council_task',
    'great_holy_war', 'struggle', 'legend', 'accolade', 'epidemic',
    // Roads to Power scopes
    'task_contract', 'situation', 'situation_sub_region', 'tax_slot',
    'domicile', 'great_project', 'confederation', 'house_relation', 'agent_slot',
    'none'
  ];

  for (const scope of scopeOrder) {
    const scopeTriggers = byScope[scope];
    if (!scopeTriggers || scopeTriggers.length === 0) continue;

    const varName = scope === 'none' ? 'generalTriggers' : `${scope.replace(/_/g, '')}Triggers`;

    lines.push(`/**`);
    lines.push(` * Triggers for ${scope} scope (${scopeTriggers.length} triggers)`);
    lines.push(` */`);
    lines.push(`export const ${varName}: TriggerDefinition[] = [`);

    for (const trigger of scopeTriggers) {
      const scopes = trigger.supportedScopes.map(s => `'${normalizeScope(s)}'`).join(', ');
      const targets = trigger.supportedTargets
        ? `, supportedTargets: [${trigger.supportedTargets.map(s => `'${normalizeScope(s)}'`).join(', ')}]`
        : '';
      const isIterator = trigger.name.startsWith('any_');
      const iteratorFlag = isIterator ? ', isIterator: true' : '';
      const outputScope = isIterator && trigger.supportedTargets?.length
        ? `, outputScope: '${normalizeScope(trigger.supportedTargets[0])}'`
        : '';

      // Determine value type
      let valueType = '';
      if (trigger.valueType) {
        if (trigger.valueType.includes('yes/no')) {
          valueType = ", valueType: 'boolean'";
        } else if (trigger.valueType.includes('<') || trigger.valueType.includes('>') || trigger.valueType.includes('=')) {
          valueType = ", valueType: 'comparison'";
        }
      } else if (trigger.syntax?.includes('<triggers>')) {
        valueType = ", valueType: 'block'";
      }

      const syntax = trigger.syntax
        ? `, syntax: ${JSON.stringify(trigger.syntax)}`  // Full syntax including all lines
        : '';
      const params = trigger.parameters?.length
        ? `, parameters: [${trigger.parameters.map(p => `'${p}'`).join(', ')}]`
        : '';

      const desc = trigger.description.replace(/'/g, "\\'");
      lines.push(`  { name: '${trigger.name}', description: '${desc}', supportedScopes: [${scopes}]${targets}${outputScope}${iteratorFlag}${valueType}${syntax}${params} },`);
    }

    lines.push(`];`);
    lines.push('');
  }

  // Generate allTriggers
  const allArrays = scopeOrder
    .filter(s => byScope[s] && byScope[s].length > 0)
    .map(s => s === 'none' ? 'generalTriggers' : `${s.replace(/_/g, '')}Triggers`);

  lines.push('/**');
  lines.push(' * All triggers combined');
  lines.push(' */');
  lines.push(`export const allTriggers: TriggerDefinition[] = [`);
  for (const arr of allArrays) {
    lines.push(`  ...${arr},`);
  }
  lines.push(`];`);
  lines.push('');

  // Generate helper functions
  lines.push('/**');
  lines.push(' * Get triggers valid for a specific scope');
  lines.push(' */');
  lines.push('export function getTriggersForScope(scope: ScopeType): TriggerDefinition[] {');
  lines.push('  return allTriggers.filter(trigger => {');
  lines.push("    if (trigger.supportedScopes.includes('none')) return true;");
  lines.push('    return trigger.supportedScopes.includes(scope);');
  lines.push('  });');
  lines.push('}');
  lines.push('');

  lines.push('/**');
  lines.push(' * Build a map for quick lookup');
  lines.push(' */');
  lines.push('export const triggersMap = new Map<string, TriggerDefinition>(');
  lines.push('  allTriggers.map(t => [t.name, t])');
  lines.push(');');
  lines.push('');

  return lines.join('\n');
}

/**
 * Read content from local file
 */
function readFile(dir: string, filename: string): string {
  const filePath = path.join(dir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Main function
 */
async function main() {
  // Default to the script_docs folder in this project
  const defaultScriptDocsDir = path.join(__dirname, '..', 'script_docs');
  const localDir = process.argv[2] || defaultScriptDocsDir;

  console.log(`Reading local files from: ${localDir}`);
  if (!fs.existsSync(localDir)) {
    console.error(`Error: Directory not found: ${localDir}`);
    console.error('\nUsage:');
    console.error('  npx ts-node src/data/parser/parseOldEnt.ts [/path/to/ck3/logs]');
    console.error('\nTo update script_docs files:');
    console.error('  1. Run script_docs in CK3 console');
    console.error('  2. Copy *.log files to src/data/script_docs/');
    process.exit(1);
  }
  sourceInfo = `Local files from ${localDir}`;

  try {
    // Get effects
    console.log('Reading effects.log...');
    const effectsContent = readFile(localDir, 'effects.log');
    const effects = parseEffects(effectsContent);
    console.log(`Parsed ${effects.length} effects`);

    // Get triggers
    console.log('Reading triggers.log...');
    const triggersContent = readFile(localDir, 'triggers.log');
    const triggers = parseTriggers(triggersContent);
    console.log(`Parsed ${triggers.length} triggers`);

    // Get modifiers
    console.log('Reading modifiers.log...');
    const modifiersContent = readFile(localDir, 'modifiers.log');
    const modifiers = parseModifiers(modifiersContent);
    console.log(`Parsed ${modifiers.length} modifiers`);

    // Generate TypeScript files
    const dataDir = path.join(__dirname, '..');

    console.log('Generating effects.generated.ts...');
    const effectsCode = generateEffectsCode(effects);
    fs.writeFileSync(path.join(dataDir, 'effects.generated.ts'), effectsCode);

    console.log('Generating triggers.generated.ts...');
    const triggersCode = generateTriggersCode(triggers);
    fs.writeFileSync(path.join(dataDir, 'triggers.generated.ts'), triggersCode);

    // Write raw JSON for inspection
    console.log('Writing raw JSON files for inspection...');
    fs.writeFileSync(path.join(dataDir, 'parser', 'effects.json'), JSON.stringify(effects, null, 2));
    fs.writeFileSync(path.join(dataDir, 'parser', 'triggers.json'), JSON.stringify(triggers, null, 2));
    fs.writeFileSync(path.join(dataDir, 'parser', 'modifiers.json'), JSON.stringify(modifiers, null, 2));

    console.log('\nDone!');
    console.log(`\nGenerated files:`);
    console.log(`  - effects.generated.ts (${effects.length} effects)`);
    console.log(`  - triggers.generated.ts (${triggers.length} triggers)`);
    console.log(`  - parser/effects.json`);
    console.log(`  - parser/triggers.json`);
    console.log(`  - parser/modifiers.json`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
