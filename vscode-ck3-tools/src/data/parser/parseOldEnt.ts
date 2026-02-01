/**
 * Parser for CK3 script_docs output
 *
 * Can fetch from OldEnt's repository or parse local files.
 *
 * Usage:
 *   # Fetch from OldEnt's repo (older versions only, up to ~1.10):
 *   npx ts-node src/data/parser/parseOldEnt.ts
 *
 *   # Parse local files from your CK3 logs directory:
 *   npx ts-node src/data/parser/parseOldEnt.ts /path/to/ck3/logs
 *
 * To generate logs yourself:
 *   1. In CK3, open console (~) and run: script_docs
 *   2. Find the logs in:
 *      - Windows: %USERPROFILE%\Documents\Paradox Interactive\Crusader Kings III\logs\
 *      - macOS: ~/Documents/Paradox Interactive/Crusader Kings III/logs/
 *      - Linux: ~/.local/share/Paradox Interactive/Crusader Kings III/logs/
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const REPO_BASE = 'https://raw.githubusercontent.com/OldEnt/crusader-kings-3-triggers-modifiers-effects-event-scopes-targets-on-actions-code-revisions-list/master';
const VERSION = '1.10.2';

interface ParsedEffect {
  name: string;
  description: string;
  syntax?: string;
  supportedScopes: string[];
  supportedTargets?: string[];
}

interface ParsedTrigger {
  name: string;
  description: string;
  syntax?: string;
  supportedScopes: string[];
  supportedTargets?: string[];
  valueType?: string; // e.g., "yes/no", "<, <=, =, !=, >, >="
}

interface ParsedModifier {
  name: string;
  useAreas: string[];
}

/**
 * Fetch a URL and return its content as a string
 */
function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
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

    effects.push({
      name,
      description,
      syntax,
      supportedScopes,
      supportedTargets: supportedTargets.length > 0 ? supportedTargets : undefined,
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

    triggers.push({
      name,
      description,
      syntax,
      supportedScopes,
      supportedTargets: supportedTargets.length > 0 ? supportedTargets : undefined,
      valueType,
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
let sourceInfo = `OldEnt repository (version ${VERSION})`;

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
  const scopeOrder = ['character', 'landed_title', 'province', 'dynasty', 'dynasty_house',
                     'culture', 'faith', 'religion', 'army', 'scheme', 'war', 'activity',
                     'artifact', 'none'];

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

      const desc = effect.description.replace(/'/g, "\\'");
      lines.push(`  { name: '${effect.name}', description: '${desc}', supportedScopes: [${scopes}]${targets}${outputScope}${iteratorFlag}${syntax} },`);
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
  const scopeOrder = ['character', 'landed_title', 'province', 'dynasty', 'dynasty_house',
                     'culture', 'faith', 'religion', 'army', 'scheme', 'war', 'activity',
                     'artifact', 'none'];

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

      const desc = trigger.description.replace(/'/g, "\\'");
      lines.push(`  { name: '${trigger.name}', description: '${desc}', supportedScopes: [${scopes}]${targets}${outputScope}${iteratorFlag}${valueType}${syntax} },`);
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
 * Read content from local file or fetch from URL
 */
async function getContent(localDir: string | null, filename: string): Promise<string> {
  if (localDir) {
    const filePath = path.join(localDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf-8');
  } else {
    return fetchUrl(`${REPO_BASE}/${VERSION}_${filename}`);
  }
}

/**
 * Main function
 */
async function main() {
  const localDir = process.argv[2] || null;

  if (localDir) {
    console.log(`Reading local files from: ${localDir}`);
    if (!fs.existsSync(localDir)) {
      console.error(`Error: Directory not found: ${localDir}`);
      console.error('\nUsage:');
      console.error('  npx ts-node src/data/parser/parseOldEnt.ts [/path/to/ck3/logs]');
      console.error('\nCK3 logs directory locations:');
      console.error('  Windows: %USERPROFILE%\\Documents\\Paradox Interactive\\Crusader Kings III\\logs\\');
      console.error('  macOS:   ~/Documents/Paradox Interactive/Crusader Kings III/logs/');
      console.error('  Linux:   ~/.local/share/Paradox Interactive/Crusader Kings III/logs/');
      process.exit(1);
    }
    sourceInfo = `Local files from ${localDir}`;
  } else {
    console.log('Fetching data from OldEnt repository (version 1.10.2)...');
    console.log('Tip: For newer game versions, run script_docs in CK3 console and pass the logs directory as an argument.');
  }

  try {
    // Get effects
    const effectsFile = localDir ? 'effects.log' : 'effects.log';
    console.log(`Reading ${effectsFile}...`);
    const effectsContent = await getContent(localDir, effectsFile);
    const effects = parseEffects(effectsContent);
    console.log(`Parsed ${effects.length} effects`);

    // Get triggers
    const triggersFile = localDir ? 'triggers.log' : 'triggers.log';
    console.log(`Reading ${triggersFile}...`);
    const triggersContent = await getContent(localDir, triggersFile);
    const triggers = parseTriggers(triggersContent);
    console.log(`Parsed ${triggers.length} triggers`);

    // Get modifiers
    const modifiersFile = localDir ? 'modifiers.log' : 'modifiers.log';
    console.log(`Reading ${modifiersFile}...`);
    const modifiersContent = await getContent(localDir, modifiersFile);
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
