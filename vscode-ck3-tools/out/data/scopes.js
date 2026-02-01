"use strict";
/**
 * CK3 Scope Type Definitions
 *
 * Scopes represent the context in which effects and triggers operate.
 * Different effects/triggers are valid in different scope contexts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCOPE_ALIASES = void 0;
exports.parseScope = parseScope;
exports.parseScopes = parseScopes;
exports.isScopeValid = isScopeValid;
/**
 * Common scope aliases used in documentation
 */
exports.SCOPE_ALIASES = {
    'title': 'landed_title',
    'county': 'landed_title',
    'duchy': 'landed_title',
    'kingdom': 'landed_title',
    'empire': 'landed_title',
    'house': 'dynasty_house',
};
/**
 * Parse a scope string from documentation into a ScopeType
 */
function parseScope(scopeStr) {
    const normalized = scopeStr.toLowerCase().trim();
    // Check aliases first
    if (exports.SCOPE_ALIASES[normalized]) {
        return exports.SCOPE_ALIASES[normalized];
    }
    // Direct match
    return normalized;
}
/**
 * Parse a comma-separated list of scopes
 */
function parseScopes(scopesStr) {
    return scopesStr
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(parseScope);
}
/**
 * Check if a scope is valid for a given list of supported scopes
 */
function isScopeValid(currentScope, supportedScopes) {
    // 'none' means any scope is valid
    if (supportedScopes.includes('none')) {
        return true;
    }
    return supportedScopes.includes(currentScope);
}
//# sourceMappingURL=scopes.js.map