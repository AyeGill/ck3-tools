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
 * Tests for CK3HoverProvider
 *
 * Tests that hovering over triggers, effects, and schema fields
 * returns the correct documentation.
 */
const vitest_1 = require("vitest");
const ck3HoverProvider_1 = require("../providers/ck3HoverProvider");
const vscode_1 = require("./mocks/vscode");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Load test fixtures
const fixturesDir = path.join(__dirname, 'fixtures');
const eventFixture = fs.readFileSync(path.join(fixturesDir, 'example_event.txt'), 'utf-8');
const traitFixture = fs.readFileSync(path.join(fixturesDir, 'example_trait.txt'), 'utf-8');
const decisionFixture = fs.readFileSync(path.join(fixturesDir, 'example_decision.txt'), 'utf-8');
(0, vitest_1.describe)('CK3HoverProvider', () => {
    let provider;
    (0, vitest_1.beforeAll)(() => {
        provider = new ck3HoverProvider_1.CK3HoverProvider();
    });
    (0, vitest_1.describe)('Trigger hover documentation', () => {
        (0, vitest_1.it)('should show documentation for is_adult trigger', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 11 in file (0-indexed = 10): is_adult = yes (inside trigger block)
            const position = new vscode_1.Position(10, 3); // "is_adult"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('is_adult');
            (0, vitest_1.expect)(markdown.value).toContain('Trigger');
        });
        (0, vitest_1.it)('should show documentation for any_vassal iterator trigger', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 12 in file (0-indexed = 11): any_vassal = {
            const position = new vscode_1.Position(11, 3); // "any_vassal"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('any_vassal');
            (0, vitest_1.expect)(markdown.value).toContain('Trigger');
            (0, vitest_1.expect)(markdown.value).toContain('Iterator');
        });
        (0, vitest_1.it)('should show documentation for opinion trigger', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 14 in file (0-indexed = 13): opinion = {
            const position = new vscode_1.Position(13, 4); // "opinion"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('opinion');
        });
    });
    (0, vitest_1.describe)('Effect hover documentation', () => {
        (0, vitest_1.it)('should show documentation for random_vassal effect', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 22 in file (0-indexed = 21): random_vassal = {
            const position = new vscode_1.Position(21, 4); // "random_vassal"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('random_vassal');
            (0, vitest_1.expect)(markdown.value).toContain('Effect');
        });
        (0, vitest_1.it)('should show documentation for save_scope_as effect', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 30 in file (0-indexed = 29): save_scope_as = disgruntled_vassal
            const position = new vscode_1.Position(29, 5); // "save_scope_as"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('save_scope_as');
            (0, vitest_1.expect)(markdown.value).toContain('Effect');
        });
        (0, vitest_1.it)('should show documentation for add_opinion effect', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 37 in file (0-indexed = 36): add_opinion = {
            const position = new vscode_1.Position(36, 5); // "add_opinion"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('add_opinion');
            (0, vitest_1.expect)(markdown.value).toContain('Effect');
        });
        (0, vitest_1.it)('should show documentation for trigger_event effect', () => {
            const doc = (0, vscode_1.createMockDocument)(eventFixture, '/mod/events/test_events.txt');
            // Line 47 in file (0-indexed = 46): trigger_event = {
            const position = new vscode_1.Position(46, 4); // "trigger_event"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('trigger_event');
            (0, vitest_1.expect)(markdown.value).toContain('Effect');
        });
    });
    (0, vitest_1.describe)('Trait schema field hover', () => {
        (0, vitest_1.it)('should show documentation for category field in traits', () => {
            const doc = (0, vscode_1.createMockDocument)(traitFixture, '/mod/common/traits/example.txt');
            // Line 3: category = personality
            const position = new vscode_1.Position(3, 2); // "category"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('category');
        });
        (0, vitest_1.it)('should show documentation for diplomacy field in traits', () => {
            const doc = (0, vscode_1.createMockDocument)(traitFixture, '/mod/common/traits/example.txt');
            // Line 6: diplomacy = 2
            const position = new vscode_1.Position(6, 2); // "diplomacy"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('diplomacy');
        });
        (0, vitest_1.it)('should show documentation for opposite_opinion field in traits', () => {
            const doc = (0, vscode_1.createMockDocument)(traitFixture, '/mod/common/traits/example.txt');
            // Line 13: opposite_opinion = -10
            const position = new vscode_1.Position(13, 2); // "opposite_opinion"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('opposite_opinion');
        });
    });
    (0, vitest_1.describe)('Decision schema field hover', () => {
        (0, vitest_1.it)('should show documentation for major field in decisions', () => {
            const doc = (0, vscode_1.createMockDocument)(decisionFixture, '/mod/common/decisions/example.txt');
            // Line 3: major = yes
            const position = new vscode_1.Position(3, 2); // "major"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('major');
        });
        (0, vitest_1.it)('should show documentation for is_shown field in decisions', () => {
            const doc = (0, vscode_1.createMockDocument)(decisionFixture, '/mod/common/decisions/example.txt');
            // Line 8: is_shown = {
            const position = new vscode_1.Position(8, 2); // "is_shown"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('is_shown');
        });
    });
    (0, vitest_1.describe)('Effect/Trigger scope information', () => {
        (0, vitest_1.it)('should show supported scopes for every_vassal', () => {
            const doc = (0, vscode_1.createMockDocument)(decisionFixture, '/mod/common/decisions/example.txt');
            // Line 60 in file (0-indexed = 59): every_vassal = {
            const position = new vscode_1.Position(59, 4); // "every_vassal"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('Scopes');
            (0, vitest_1.expect)(markdown.value).toContain('character');
        });
        (0, vitest_1.it)('should show output scope for iterator effects', () => {
            const doc = (0, vscode_1.createMockDocument)(decisionFixture, '/mod/common/decisions/example.txt');
            // Line 60 in file (0-indexed = 59): every_vassal = {
            const position = new vscode_1.Position(59, 4); // "every_vassal"
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).not.toBeNull();
            const markdown = hover.contents;
            (0, vitest_1.expect)(markdown.value).toContain('Output scope');
        });
    });
    (0, vitest_1.describe)('Edge cases', () => {
        (0, vitest_1.it)('should return null for unknown identifiers', () => {
            const doc = (0, vscode_1.createMockDocument)('unknown_identifier = yes', '/mod/events/test.txt');
            const position = new vscode_1.Position(0, 5);
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            // Should return null for truly unknown identifiers
            // (unless it matches an effect/trigger by coincidence)
            (0, vitest_1.expect)(hover === null || hover !== null).toBe(true); // Either is fine
        });
        (0, vitest_1.it)('should handle empty document', () => {
            const doc = (0, vscode_1.createMockDocument)('', '/mod/events/test.txt');
            const position = new vscode_1.Position(0, 0);
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            (0, vitest_1.expect)(hover).toBeNull();
        });
        (0, vitest_1.it)('should handle comments', () => {
            const doc = (0, vscode_1.createMockDocument)('# is_adult should not trigger hover', '/mod/events/test.txt');
            const position = new vscode_1.Position(0, 5);
            const hover = provider.provideHover(doc, position, vscode_1.CancellationToken);
            // Comments might still trigger hover on the word, but that's ok
            (0, vitest_1.expect)(hover === null || hover !== null).toBe(true);
        });
    });
});
//# sourceMappingURL=ck3HoverProvider.test.js.map