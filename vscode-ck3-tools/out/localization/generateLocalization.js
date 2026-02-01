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
exports.registerGenerateLocalizationCommand = registerGenerateLocalizationCommand;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
// Debug flag - set to true to enable console logging
const DEBUG = true;
function debugLog(...args) {
    if (DEBUG) {
        console.log('[CK3-Loc]', ...args);
    }
}
/**
 * Parse a block's content (handling nested braces)
 * Returns the content between the opening { at startIndex and its matching }
 */
function extractBlockContent(content, startIndex) {
    let depth = 0;
    let blockStart = -1;
    for (let i = startIndex; i < content.length; i++) {
        const char = content[i];
        // Skip comments
        if (char === '#') {
            while (i < content.length && content[i] !== '\n')
                i++;
            continue;
        }
        if (char === '{') {
            if (depth === 0)
                blockStart = i + 1;
            depth++;
        }
        else if (char === '}') {
            depth--;
            if (depth === 0) {
                return {
                    content: content.substring(blockStart, i),
                    endIndex: i
                };
            }
        }
    }
    return null;
}
/**
 * Find a field = { block } or field = value in content
 * Returns the match info including the block content if it's a block
 */
function findField(content, fieldName) {
    // Match field = { or field = value
    // Use word boundary and handle various whitespace
    const pattern = new RegExp(`(?:^|[\\s{])${fieldName}\\s*=\\s*(?:(\\{)|([a-zA-Z_][a-zA-Z0-9_]*))`, 'm');
    const match = content.match(pattern);
    if (!match) {
        return null;
    }
    debugLog(`Found ${fieldName} match:`, match[0].trim());
    if (match[1] === '{') {
        // It's a block - extract its content
        const matchStart = content.indexOf(match[0]);
        const bracePos = matchStart + match[0].indexOf('{');
        const block = extractBlockContent(content, bracePos);
        if (block) {
            debugLog(`${fieldName} block content (first 200 chars):`, block.content.substring(0, 200));
            return { isBlock: true, blockContent: block.content };
        }
        return null;
    }
    else if (match[2]) {
        debugLog(`${fieldName} simple value:`, match[2]);
        return { isBlock: false, value: match[2] };
    }
    return null;
}
/**
 * Extract all localization key references from a name/desc block
 * Looks for desc = some_key patterns (not desc = {})
 */
function extractLocKeysFromBlock(blockContent) {
    const keys = [];
    // Find all "desc = key" patterns (simple string value, not a block)
    // This matches: desc = some_key (but not desc = {)
    // The key can contain letters, numbers, and underscores
    const descPattern = /\bdesc\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let match;
    while ((match = descPattern.exec(blockContent)) !== null) {
        keys.push(match[1]);
        debugLog('Found desc key:', match[1]);
    }
    return keys;
}
/**
 * Count track thresholds in a trait (for track-based traits)
 * Returns the number of levels (thresholds + 1 for base level)
 */
function countTrackLevels(traitContent) {
    const trackField = findField(traitContent, 'track');
    if (!trackField || !trackField.isBlock || !trackField.blockContent) {
        return 0;
    }
    // Count numeric thresholds like "50 = {" or "100 = {"
    const thresholdPattern = /^\s*(\d+)\s*=\s*\{/gm;
    let count = 0;
    let match;
    while ((match = thresholdPattern.exec(trackField.blockContent)) !== null) {
        count++;
        debugLog('Found track threshold:', match[1]);
    }
    // Return total levels: base level + thresholds
    return count > 0 ? count + 1 : 0;
}
/**
 * Parse a trait definition and extract all its localization requirements
 */
function extractTraitLocalization(traitName, traitContent) {
    const keys = [];
    const foundKeys = new Set();
    debugLog('=== Processing trait:', traitName, '===');
    // Check for explicit name = ...
    const nameField = findField(traitContent, 'name');
    if (nameField) {
        if (nameField.isBlock && nameField.blockContent) {
            const explicitKeys = extractLocKeysFromBlock(nameField.blockContent);
            debugLog('Name block explicit keys:', explicitKeys);
            for (const key of explicitKeys) {
                if (!foundKeys.has(key)) {
                    foundKeys.add(key);
                    keys.push({
                        key,
                        defaultText: formatName(key.replace(/^trait_/, '').replace(/_\d+$/, ''))
                    });
                }
            }
        }
        else if (nameField.value) {
            const key = nameField.value;
            if (!foundKeys.has(key)) {
                foundKeys.add(key);
                keys.push({
                    key,
                    defaultText: formatName(key.replace(/^trait_/, ''))
                });
            }
        }
    }
    // Check for explicit desc = ...
    const descField = findField(traitContent, 'desc');
    if (descField) {
        if (descField.isBlock && descField.blockContent) {
            const explicitKeys = extractLocKeysFromBlock(descField.blockContent);
            debugLog('Desc block explicit keys:', explicitKeys);
            for (const key of explicitKeys) {
                if (!foundKeys.has(key)) {
                    foundKeys.add(key);
                    const isCharDesc = key.includes('character_desc');
                    const baseName = key.replace(/^trait_/, '').replace(/_character_desc$/, '').replace(/_desc$/, '').replace(/_\d+$/, '');
                    keys.push({
                        key,
                        defaultText: isCharDesc
                            ? `[Character] ${formatName(baseName)} description`
                            : `Description for ${formatName(baseName)}`
                    });
                }
            }
        }
        else if (descField.value) {
            const key = descField.value;
            if (!foundKeys.has(key)) {
                foundKeys.add(key);
                keys.push({
                    key,
                    defaultText: `Description for ${formatName(key.replace(/^trait_/, '').replace(/_desc$/, ''))}`
                });
            }
        }
    }
    // Check for track-based traits and generate keys
    const trackLevels = countTrackLevels(traitContent);
    debugLog('Track levels found:', trackLevels);
    if (trackLevels > 0) {
        // Generate track name and description keys (uses full trait name)
        const trackNameKey = `trait_track_${traitName}`;
        if (!foundKeys.has(trackNameKey)) {
            foundKeys.add(trackNameKey);
            keys.push({
                key: trackNameKey,
                defaultText: formatName(traitName.replace(/^lifestyle_/, ''))
            });
        }
        const trackDescKey = `trait_track_${traitName}_desc`;
        if (!foundKeys.has(trackDescKey)) {
            foundKeys.add(trackDescKey);
            keys.push({
                key: trackDescKey,
                defaultText: `Track description for ${formatName(traitName.replace(/^lifestyle_/, ''))}`
            });
        }
        // If no explicit name/desc keys found, also generate numbered level keys
        if (keys.length <= 2) { // Only track keys so far
            // Remove "lifestyle_" prefix if present for the level key base name
            const keyBaseName = traitName.replace(/^lifestyle_/, '');
            for (let level = 1; level <= trackLevels; level++) {
                // Name key for this level
                const nameKey = `trait_${keyBaseName}_${level}`;
                if (!foundKeys.has(nameKey)) {
                    foundKeys.add(nameKey);
                    keys.push({
                        key: nameKey,
                        defaultText: `${formatName(keyBaseName)} (Level ${level})`
                    });
                }
                // Description key for this level
                const descKey = `trait_${keyBaseName}_${level}_desc`;
                if (!foundKeys.has(descKey)) {
                    foundKeys.add(descKey);
                    keys.push({
                        key: descKey,
                        defaultText: `Description for ${formatName(keyBaseName)} level ${level}`
                    });
                }
                // Character-specific description key
                const charDescKey = `trait_${keyBaseName}_${level}_character_desc`;
                if (!foundKeys.has(charDescKey)) {
                    foundKeys.add(charDescKey);
                    keys.push({
                        key: charDescKey,
                        defaultText: `[Character] ${formatName(keyBaseName)} level ${level} description`
                    });
                }
            }
        }
    }
    // If still no keys found, generate default keys
    if (keys.length === 0) {
        debugLog('No explicit keys found, generating defaults');
        keys.push({
            key: `trait_${traitName}`,
            defaultText: formatName(traitName)
        });
        keys.push({
            key: `trait_${traitName}_desc`,
            defaultText: `Description for ${formatName(traitName)}`
        });
    }
    debugLog('Final keys for', traitName + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Parse CK3 file and extract localization keys
 */
function extractLocalizationKeys(content, fileType) {
    const keys = [];
    if (fileType === 'trait') {
        // Find all trait definitions and parse their content
        const traitPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = traitPattern.exec(content)) !== null) {
            const traitName = match[1];
            const startIndex = match.index + match[0].length - 1; // Position of the {
            // Extract the full trait block content
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const traitKeys = extractTraitLocalization(traitName, block.content);
                keys.push(...traitKeys);
            }
        }
    }
    else if (fileType === 'building') {
        // Extract building names
        const buildingPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = buildingPattern.exec(content)) !== null) {
            const buildingName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const buildingKeys = extractBuildingLocalization(buildingName, block.content);
                keys.push(...buildingKeys);
            }
            else {
                keys.push({
                    key: `building_${buildingName}`,
                    defaultText: formatName(buildingName)
                });
                keys.push({
                    key: `building_${buildingName}_desc`,
                    defaultText: `Description for ${formatName(buildingName)}`
                });
            }
        }
    }
    else if (fileType === 'scheme') {
        // Extract scheme names
        const schemePattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = schemePattern.exec(content)) !== null) {
            const schemeName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const schemeKeys = extractSchemeLocalization(schemeName, block.content);
                keys.push(...schemeKeys);
            }
            else {
                keys.push({
                    key: schemeName,
                    defaultText: formatName(schemeName)
                });
                keys.push({
                    key: `${schemeName}_desc`,
                    defaultText: `Description for ${formatName(schemeName)}`
                });
            }
        }
    }
    else if (fileType === 'decision') {
        // Extract decision names and their localization keys
        const decisionPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = decisionPattern.exec(content)) !== null) {
            const decisionName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const decisionKeys = extractDecisionLocalization(decisionName, block.content);
                keys.push(...decisionKeys);
            }
            else {
                // Fallback to basic keys
                keys.push({
                    key: decisionName,
                    defaultText: formatName(decisionName)
                });
                keys.push({
                    key: `${decisionName}_desc`,
                    defaultText: `Description for ${formatName(decisionName)}`
                });
                keys.push({
                    key: `${decisionName}_tooltip`,
                    defaultText: `Tooltip for ${formatName(decisionName)}`
                });
                keys.push({
                    key: `${decisionName}_confirm`,
                    defaultText: 'Confirm'
                });
            }
        }
    }
    else if (fileType === 'event') {
        // Extract event IDs and their localization keys
        // First, find the namespace
        const namespaceMatch = content.match(/^\s*namespace\s*=\s*([a-z_][a-z0-9_]*)/m);
        const namespace = namespaceMatch ? namespaceMatch[1] : 'unknown';
        // Pattern: namespace.id = { or just id = { (numeric)
        const eventPattern = /^([a-z_][a-z0-9_]*)\.(\d+)\s*=\s*\{/gm;
        let match;
        while ((match = eventPattern.exec(content)) !== null) {
            const eventNamespace = match[1];
            const eventId = match[2];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const eventKeys = extractEventLocalization(eventNamespace, eventId, block.content);
                keys.push(...eventKeys);
            }
            else {
                // Fallback to basic keys
                keys.push({
                    key: `${eventNamespace}.${eventId}.t`,
                    defaultText: 'Event Title'
                });
                keys.push({
                    key: `${eventNamespace}.${eventId}.desc`,
                    defaultText: 'Event description'
                });
                keys.push({
                    key: `${eventNamespace}.${eventId}.a`,
                    defaultText: 'First option'
                });
            }
        }
    }
    else if (fileType === 'interaction') {
        // Extract character interaction names
        const interactionPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = interactionPattern.exec(content)) !== null) {
            const interactionName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const interactionKeys = extractInteractionLocalization(interactionName, block.content);
                keys.push(...interactionKeys);
            }
            else {
                keys.push({
                    key: interactionName,
                    defaultText: formatName(interactionName)
                });
                keys.push({
                    key: `${interactionName}_desc`,
                    defaultText: `Description for ${formatName(interactionName)}`
                });
            }
        }
    }
    else if (fileType === 'men_at_arms') {
        // Extract men-at-arms types
        const maaPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = maaPattern.exec(content)) !== null) {
            const maaName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const maaKeys = extractMenAtArmsLocalization(maaName, block.content);
                keys.push(...maaKeys);
            }
            else {
                keys.push({
                    key: `maa_${maaName}`,
                    defaultText: formatName(maaName)
                });
            }
        }
    }
    else if (fileType === 'casus_belli') {
        // Extract casus belli types
        const cbPattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = cbPattern.exec(content)) !== null) {
            const cbName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const cbKeys = extractCasusBelliLocalization(cbName, block.content);
                keys.push(...cbKeys);
            }
            else {
                keys.push({
                    key: cbName,
                    defaultText: formatName(cbName)
                });
            }
        }
    }
    else if (fileType === 'culture') {
        // Extract cultures
        const culturePattern = /^([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = culturePattern.exec(content)) !== null) {
            const cultureName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const cultureKeys = extractCultureLocalization(cultureName, block.content);
                keys.push(...cultureKeys);
            }
            else {
                keys.push({
                    key: cultureName,
                    defaultText: formatName(cultureName)
                });
            }
        }
    }
    else if (fileType === 'tradition') {
        // Extract cultural traditions
        const traditionPattern = /^(tradition_[a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = traditionPattern.exec(content)) !== null) {
            const traditionName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const traditionKeys = extractTraditionLocalization(traditionName, block.content);
                keys.push(...traditionKeys);
            }
            else {
                keys.push({
                    key: traditionName,
                    defaultText: formatName(traditionName.replace(/^tradition_/, ''))
                });
            }
        }
    }
    else if (fileType === 'religion') {
        // Extract religions and faiths
        const religionPattern = /^([a-z_][a-z0-9_]*_religion)\s*=\s*\{/gm;
        let match;
        while ((match = religionPattern.exec(content)) !== null) {
            const religionName = match[1];
            const startIndex = match.index + match[0].length - 1;
            const block = extractBlockContent(content, startIndex);
            if (block) {
                const religionKeys = extractReligionLocalization(religionName, block.content);
                keys.push(...religionKeys);
            }
            else {
                keys.push({
                    key: religionName,
                    defaultText: formatName(religionName.replace(/_religion$/, ''))
                });
            }
        }
    }
    return keys;
}
/**
 * Format name for display (e.g., "my_trait" -> "My Trait")
 */
function formatName(name) {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
/**
 * Extract localization keys for a decision
 */
function extractDecisionLocalization(decisionName, decisionContent) {
    const keys = [];
    const foundKeys = new Set();
    debugLog('=== Processing decision:', decisionName, '===');
    // Check for explicit desc = value
    const descField = findField(decisionContent, 'desc');
    if (descField && !descField.isBlock && descField.value) {
        const key = descField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: `Description for ${formatName(decisionName)}` });
        }
    }
    // Check for explicit selection_tooltip = value
    const tooltipField = findField(decisionContent, 'selection_tooltip');
    if (tooltipField && !tooltipField.isBlock && tooltipField.value) {
        const key = tooltipField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: `Selection tooltip for ${formatName(decisionName)}` });
        }
    }
    // Check for explicit confirm_text = value
    const confirmField = findField(decisionContent, 'confirm_text');
    if (confirmField && !confirmField.isBlock && confirmField.value) {
        const key = confirmField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: 'Confirm' });
        }
    }
    // If no explicit keys, generate defaults
    if (keys.length === 0) {
        keys.push({ key: decisionName, defaultText: formatName(decisionName) });
        keys.push({ key: `${decisionName}_desc`, defaultText: `Description for ${formatName(decisionName)}` });
        keys.push({ key: `${decisionName}_tooltip`, defaultText: `Selection tooltip for ${formatName(decisionName)}` });
        keys.push({ key: `${decisionName}_confirm`, defaultText: 'Confirm' });
    }
    debugLog('Final keys for decision', decisionName + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Extract localization keys for an event
 */
function extractEventLocalization(namespace, eventId, eventContent) {
    const keys = [];
    const foundKeys = new Set();
    const eventKey = `${namespace}.${eventId}`;
    debugLog('=== Processing event:', eventKey, '===');
    // Check for explicit title = value or title = { block }
    const titleField = findField(eventContent, 'title');
    if (titleField) {
        if (titleField.isBlock && titleField.blockContent) {
            const explicitKeys = extractLocKeysFromBlock(titleField.blockContent);
            for (const key of explicitKeys) {
                if (!foundKeys.has(key)) {
                    foundKeys.add(key);
                    keys.push({ key, defaultText: 'Event title' });
                }
            }
        }
        else if (titleField.value) {
            const key = titleField.value;
            if (!foundKeys.has(key)) {
                foundKeys.add(key);
                keys.push({ key, defaultText: 'Event title' });
            }
        }
    }
    // Check for explicit desc = value or desc = { block }
    const descField = findField(eventContent, 'desc');
    if (descField) {
        if (descField.isBlock && descField.blockContent) {
            const explicitKeys = extractLocKeysFromBlock(descField.blockContent);
            for (const key of explicitKeys) {
                if (!foundKeys.has(key)) {
                    foundKeys.add(key);
                    keys.push({ key, defaultText: 'Event description' });
                }
            }
        }
        else if (descField.value) {
            const key = descField.value;
            if (!foundKeys.has(key)) {
                foundKeys.add(key);
                keys.push({ key, defaultText: 'Event description' });
            }
        }
    }
    // Extract option names
    const optionPattern = /\boption\s*=\s*\{/g;
    let optionMatch;
    let optionIndex = 0;
    const optionLetters = 'abcdefghijklmnop';
    while ((optionMatch = optionPattern.exec(eventContent)) !== null) {
        const optionStartIndex = optionMatch.index + optionMatch[0].length - 1;
        const optionBlock = extractBlockContent(eventContent, optionStartIndex);
        if (optionBlock) {
            // Look for name = value in the option
            const nameField = findField(optionBlock.content, 'name');
            if (nameField && !nameField.isBlock && nameField.value) {
                const key = nameField.value;
                if (!foundKeys.has(key)) {
                    foundKeys.add(key);
                    keys.push({ key, defaultText: `Option ${optionLetters[optionIndex] || optionIndex + 1}` });
                }
            }
        }
        optionIndex++;
    }
    // If no explicit title/desc found, generate defaults
    if (!titleField && !descField) {
        keys.push({ key: `${eventKey}.t`, defaultText: 'Event title' });
        keys.push({ key: `${eventKey}.desc`, defaultText: 'Event description' });
    }
    // If no options found, add default options
    if (optionIndex === 0) {
        keys.push({ key: `${eventKey}.a`, defaultText: 'First option' });
    }
    debugLog('Final keys for event', eventKey + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Extract localization keys for a character interaction
 */
function extractInteractionLocalization(interactionName, interactionContent) {
    const keys = [];
    const foundKeys = new Set();
    debugLog('=== Processing interaction:', interactionName, '===');
    // Check for explicit desc = value
    const descField = findField(interactionContent, 'desc');
    if (descField && !descField.isBlock && descField.value) {
        const key = descField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: `Description for ${formatName(interactionName)}` });
        }
    }
    // Check for notification_text = value
    const notificationField = findField(interactionContent, 'notification_text');
    if (notificationField && !notificationField.isBlock && notificationField.value) {
        const key = notificationField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: `Notification for ${formatName(interactionName)}` });
        }
    }
    // If no explicit keys, generate defaults
    if (keys.length === 0) {
        keys.push({ key: interactionName, defaultText: formatName(interactionName) });
        keys.push({ key: `${interactionName}_desc`, defaultText: `Description for ${formatName(interactionName)}` });
    }
    debugLog('Final keys for interaction', interactionName + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Extract localization keys for a scheme
 */
function extractSchemeLocalization(schemeName, schemeContent) {
    const keys = [];
    const foundKeys = new Set();
    debugLog('=== Processing scheme:', schemeName, '===');
    // Scheme name
    if (!foundKeys.has(schemeName)) {
        foundKeys.add(schemeName);
        keys.push({ key: schemeName, defaultText: formatName(schemeName) });
    }
    // Check for explicit desc = value
    const descField = findField(schemeContent, 'desc');
    if (descField) {
        if (!descField.isBlock && descField.value) {
            const key = descField.value;
            if (!foundKeys.has(key)) {
                foundKeys.add(key);
                keys.push({ key, defaultText: `Description for ${formatName(schemeName)}` });
            }
        }
    }
    else {
        // Default desc key
        const defaultDescKey = `${schemeName}_desc`;
        if (!foundKeys.has(defaultDescKey)) {
            foundKeys.add(defaultDescKey);
            keys.push({ key: defaultDescKey, defaultText: `Description for ${formatName(schemeName)}` });
        }
    }
    // Check for success_desc = value
    const successDescField = findField(schemeContent, 'success_desc');
    if (successDescField && !successDescField.isBlock && successDescField.value) {
        const key = successDescField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: `Success description for ${formatName(schemeName)}` });
        }
    }
    // Check for discovery_desc = value
    const discoveryDescField = findField(schemeContent, 'discovery_desc');
    if (discoveryDescField && !discoveryDescField.isBlock && discoveryDescField.value) {
        const key = discoveryDescField.value;
        if (!foundKeys.has(key)) {
            foundKeys.add(key);
            keys.push({ key, defaultText: `Discovery description for ${formatName(schemeName)}` });
        }
    }
    debugLog('Final keys for scheme', schemeName + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Extract localization keys for a Men-at-Arms type
 */
function extractMenAtArmsLocalization(maaName, maaContent) {
    const keys = [];
    // MAA name
    keys.push({
        key: `maa_${maaName}`,
        defaultText: formatName(maaName)
    });
    // MAA description
    keys.push({
        key: `maa_${maaName}_flavor`,
        defaultText: `Description for ${formatName(maaName)}`
    });
    return keys;
}
/**
 * Extract localization keys for a Casus Belli
 */
function extractCasusBelliLocalization(cbName, cbContent) {
    const keys = [];
    // CB name
    keys.push({
        key: cbName,
        defaultText: formatName(cbName)
    });
    // CB description
    keys.push({
        key: `${cbName}_desc`,
        defaultText: `Description for ${formatName(cbName)}`
    });
    // War name
    keys.push({
        key: `${cbName}_war_name`,
        defaultText: `[ROOT.GetName]'s ${formatName(cbName)} against [FROM.GetName]`
    });
    return keys;
}
/**
 * Extract localization keys for a Culture
 */
function extractCultureLocalization(cultureName, cultureContent) {
    const keys = [];
    // Culture name
    keys.push({
        key: cultureName,
        defaultText: formatName(cultureName)
    });
    // Culture collective noun (people)
    keys.push({
        key: `${cultureName}_collective_noun`,
        defaultText: `${formatName(cultureName)} people`
    });
    // Culture adjective
    keys.push({
        key: `${cultureName}_adjective`,
        defaultText: formatName(cultureName)
    });
    return keys;
}
/**
 * Extract localization keys for a Cultural Tradition
 */
function extractTraditionLocalization(traditionName, traditionContent) {
    const keys = [];
    // Tradition name (often prefixed with tradition_)
    const displayName = traditionName.replace(/^tradition_/, '');
    keys.push({
        key: traditionName,
        defaultText: formatName(displayName)
    });
    // Tradition description
    keys.push({
        key: `${traditionName}_desc`,
        defaultText: `Description for ${formatName(displayName)}`
    });
    // Tradition effect (tooltip)
    keys.push({
        key: `${traditionName}_effect`,
        defaultText: `Effect tooltip for ${formatName(displayName)}`
    });
    return keys;
}
/**
 * Extract localization keys for a Religion/Faith
 */
function extractReligionLocalization(religionName, religionContent) {
    const keys = [];
    const foundKeys = new Set();
    debugLog('=== Processing religion:', religionName, '===');
    // Religion name
    if (!foundKeys.has(religionName)) {
        foundKeys.add(religionName);
        keys.push({
            key: religionName,
            defaultText: formatName(religionName.replace(/_religion$/, ''))
        });
    }
    // Religion adjective
    const adjKey = `${religionName}_adj`;
    if (!foundKeys.has(adjKey)) {
        foundKeys.add(adjKey);
        keys.push({
            key: adjKey,
            defaultText: formatName(religionName.replace(/_religion$/, ''))
        });
    }
    // Religion adherent
    const adherentKey = `${religionName}_adherent`;
    if (!foundKeys.has(adherentKey)) {
        foundKeys.add(adherentKey);
        keys.push({
            key: adherentKey,
            defaultText: `${formatName(religionName.replace(/_religion$/, ''))} follower`
        });
    }
    // Religion adherent plural
    const adherentPluralKey = `${religionName}_adherent_plural`;
    if (!foundKeys.has(adherentPluralKey)) {
        foundKeys.add(adherentPluralKey);
        keys.push({
            key: adherentPluralKey,
            defaultText: `${formatName(religionName.replace(/_religion$/, ''))} followers`
        });
    }
    // Look for faiths block and extract faith names
    const faithsField = findField(religionContent, 'faiths');
    if (faithsField && faithsField.isBlock && faithsField.blockContent) {
        // Find faith definitions inside the faiths block
        const faithPattern = /^[\t ]*([a-z_][a-z0-9_]*)\s*=\s*\{/gm;
        let match;
        while ((match = faithPattern.exec(faithsField.blockContent)) !== null) {
            const faithName = match[1];
            // Faith name
            if (!foundKeys.has(faithName)) {
                foundKeys.add(faithName);
                keys.push({
                    key: faithName,
                    defaultText: formatName(faithName)
                });
            }
            // Faith adjective
            const faithAdjKey = `${faithName}_adj`;
            if (!foundKeys.has(faithAdjKey)) {
                foundKeys.add(faithAdjKey);
                keys.push({
                    key: faithAdjKey,
                    defaultText: formatName(faithName)
                });
            }
            // Faith adherent
            const faithAdherentKey = `${faithName}_adherent`;
            if (!foundKeys.has(faithAdherentKey)) {
                foundKeys.add(faithAdherentKey);
                keys.push({
                    key: faithAdherentKey,
                    defaultText: `${formatName(faithName)} believer`
                });
            }
            // Faith adherent plural
            const faithAdherentPluralKey = `${faithName}_adherent_plural`;
            if (!foundKeys.has(faithAdherentPluralKey)) {
                foundKeys.add(faithAdherentPluralKey);
                keys.push({
                    key: faithAdherentPluralKey,
                    defaultText: `${formatName(faithName)} believers`
                });
            }
            // Faith description
            const faithDescKey = `${faithName}_desc`;
            if (!foundKeys.has(faithDescKey)) {
                foundKeys.add(faithDescKey);
                keys.push({
                    key: faithDescKey,
                    defaultText: `Description for ${formatName(faithName)}`
                });
            }
        }
    }
    debugLog('Final keys for religion', religionName + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Extract localization keys for a building
 */
function extractBuildingLocalization(buildingName, buildingContent) {
    const keys = [];
    const foundKeys = new Set();
    debugLog('=== Processing building:', buildingName, '===');
    // Building name key
    const nameKey = `building_${buildingName}`;
    if (!foundKeys.has(nameKey)) {
        foundKeys.add(nameKey);
        keys.push({ key: nameKey, defaultText: formatName(buildingName) });
    }
    // Building description key
    const descKey = `building_${buildingName}_desc`;
    if (!foundKeys.has(descKey)) {
        foundKeys.add(descKey);
        keys.push({ key: descKey, defaultText: `Description for ${formatName(buildingName)}` });
    }
    debugLog('Final keys for building', buildingName + ':', keys.map(k => k.key));
    return keys;
}
/**
 * Determine file type from path
 */
function getFileType(filePath) {
    if (filePath.includes('/common/traits/') || filePath.includes('\\common\\traits\\'))
        return 'trait';
    if (filePath.includes('/common/buildings/') || filePath.includes('\\common\\buildings\\'))
        return 'building';
    if (filePath.includes('/common/decisions/') || filePath.includes('\\common\\decisions\\'))
        return 'decision';
    if (filePath.includes('/events/') || filePath.includes('\\events\\'))
        return 'event';
    if (filePath.includes('/common/character_interactions/') || filePath.includes('\\common\\character_interactions\\'))
        return 'interaction';
    if (filePath.includes('/common/schemes/') || filePath.includes('\\common\\schemes\\'))
        return 'scheme';
    if (filePath.includes('/common/on_action/') || filePath.includes('\\common\\on_action\\'))
        return 'on_action';
    if (filePath.includes('/common/men_at_arms_types/') || filePath.includes('\\common\\men_at_arms_types\\'))
        return 'men_at_arms';
    if (filePath.includes('/common/casus_belli_types/') || filePath.includes('\\common\\casus_belli_types\\'))
        return 'casus_belli';
    if (filePath.includes('/common/culture/cultures/') || filePath.includes('\\common\\culture\\cultures\\'))
        return 'culture';
    if (filePath.includes('/common/culture/traditions/') || filePath.includes('\\common\\culture\\traditions\\'))
        return 'tradition';
    if (filePath.includes('/common/religion/religions/') || filePath.includes('\\common\\religion\\religions\\'))
        return 'religion';
    return null;
}
/**
 * Find localization directory for mod
 */
function findLocalizationDir(filePath) {
    // Go up directories until we find the mod root (has descriptor.mod)
    let dir = path.dirname(filePath);
    for (let i = 0; i < 10; i++) {
        const descriptorPath = path.join(dir, 'descriptor.mod');
        try {
            // Check if descriptor exists (sync check is ok here)
            if (require('fs').existsSync(descriptorPath)) {
                return path.join(dir, 'localization', 'english');
            }
        }
        catch (e) {
            // Continue searching
        }
        dir = path.dirname(dir);
    }
    return null;
}
function registerGenerateLocalizationCommand(context, generator) {
    const disposable = vscode.commands.registerCommand('ck3-tools.generateLocalization', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        try {
            const document = editor.document;
            const filePath = document.fileName;
            const fileType = getFileType(filePath);
            if (!fileType) {
                vscode.window.showWarningMessage('This file type does not require localization');
                return;
            }
            // Extract keys from current file
            const content = document.getText();
            const keys = extractLocalizationKeys(content, fileType);
            if (keys.length === 0) {
                vscode.window.showInformationMessage('No localization keys found in this file');
                return;
            }
            // Find localization directory
            const locDir = findLocalizationDir(filePath);
            if (!locDir) {
                vscode.window.showErrorMessage('Could not find mod localization directory');
                return;
            }
            // Generate filename from source file
            const baseName = path.basename(filePath, '.txt');
            const locFileName = `${baseName}_l_english.yml`;
            const locFilePath = path.join(locDir, locFileName);
            // Check if localization file already exists
            let existingKeys = new Set();
            let existingContent = '';
            try {
                existingContent = await fs.readFile(locFilePath, 'utf-8');
                // Parse existing keys
                const lines = existingContent.split('\n');
                for (const line of lines) {
                    const match = line.match(/^\s*([a-z_][a-z0-9_.]*):(\d+)\s+".*"$/);
                    if (match) {
                        existingKeys.add(match[1]);
                    }
                }
            }
            catch {
                // File doesn't exist yet, that's fine
            }
            // Filter out keys that already exist
            const newKeys = keys.filter(k => !existingKeys.has(k.key));
            if (newKeys.length === 0) {
                vscode.window.showInformationMessage('All localization keys already exist');
                return;
            }
            // Generate localization for new keys only
            const newLocalization = generator.generateLocalization(newKeys);
            // Merge with existing content
            let finalContent;
            if (existingContent) {
                // Remove the UTF-8 BOM header from new content if present
                const newLines = newLocalization.replace(/^\ufeff/, '').replace(/^l_english:\s*\n/, '');
                // Append new keys to existing file
                finalContent = existingContent.trimEnd() + '\n' + newLines;
            }
            else {
                // New file, use as-is
                finalContent = newLocalization;
            }
            // Write localization file
            await fs.mkdir(locDir, { recursive: true });
            await fs.writeFile(locFilePath, finalContent, 'utf-8');
            vscode.window.showInformationMessage(`Added ${newKeys.length} new localization keys to ${locFileName} (${existingKeys.size} keys already existed)`);
            // Ask if user wants to open the localization file
            const openFile = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Open localization file?'
            });
            if (openFile === 'Yes') {
                const doc = await vscode.workspace.openTextDocument(locFilePath);
                await vscode.window.showTextDocument(doc);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to generate localization: ${error}`);
            console.error('Generate localization error:', error);
        }
    });
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=generateLocalization.js.map