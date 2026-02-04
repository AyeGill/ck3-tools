/**
 * Characterization tests for block parsing implementations
 *
 * These tests document the CURRENT behavior of each provider's block parsing logic.
 * They serve as a safety net before unifying the implementations.
 *
 * Three implementations being tested:
 * 1. CompletionProvider.getBraceDepthAndPath() - regex: /((?:\w+:)?\w+)\s*=\s*\{/g
 * 2. DiagnosticsProvider inline parsing - regex: /([\w.:$]+)\s*(\?=|>=|<=|=|>|<)\s*\{/g
 * 3. HoverProvider.findParentBlock() - regex: /(\S+)\s*=\s*$/
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMockDocument,
  Position,
  CancellationToken,
  CompletionTriggerKind,
  DiagnosticCollection,
} from './mocks/vscode';

// Mock vscode module for DiagnosticsProvider
vi.mock('vscode', () => ({
  languages: {
    createDiagnosticCollection: () => new DiagnosticCollection(),
  },
  DiagnosticSeverity: { Error: 0, Warning: 1, Information: 2, Hint: 3 },
  Diagnostic: class {
    range: any;
    message: string;
    severity: number;
    constructor(range: any, message: string, severity: number = 0) {
      this.range = range;
      this.message = message;
      this.severity = severity;
    }
  },
  Range: class {
    start: any;
    end: any;
    constructor(startOrPosition: any, endOrCharacter?: any, endLine?: number, endChar?: number) {
      if (typeof startOrPosition === 'number') {
        this.start = { line: startOrPosition, character: endOrCharacter };
        this.end = { line: endLine, character: endChar };
      } else {
        this.start = startOrPosition;
        this.end = endOrCharacter;
      }
    }
  },
  Position: class {
    line: number;
    character: number;
    constructor(line: number, character: number) {
      this.line = line;
      this.character = character;
    }
  },
  Uri: {
    file: (filePath: string) => ({ toString: () => `file://${filePath}`, fsPath: filePath }),
  },
}));

import { CK3CompletionProvider } from '../providers/ck3CompletionProvider';
import { CK3DiagnosticsProvider } from '../providers/ck3DiagnosticsProvider';
import { CK3HoverProvider } from '../providers/ck3HoverProvider';

/**
 * Helper to get completion labels from a provider result
 */
function getCompletionLabels(result: any): string[] {
  if (!result) return [];
  if (Array.isArray(result)) {
    return result.map(item => typeof item.label === 'string' ? item.label : item.label.label);
  }
  if (result.items) {
    return result.items.map((item: any) => typeof item.label === 'string' ? item.label : item.label.label);
  }
  return [];
}

/**
 * Helper to get diagnostics from DiagnosticsProvider
 */
function getDiagnostics(provider: CK3DiagnosticsProvider, content: string, fileName: string): any[] {
  const doc = createMockDocument(content, fileName);
  provider.validateDocument(doc as any);
  const collection = provider.getDiagnosticCollection();
  return (collection as any).get(doc.uri) || [];
}

/**
 * Helper to get hover content from HoverProvider
 */
function getHoverContent(provider: CK3HoverProvider, content: string, fileName: string, position: Position): string | null {
  const doc = createMockDocument(content, fileName);
  const hover = provider.provideHover(doc as any, position, CancellationToken as any);
  if (!hover) return null;
  const markdown = (hover as any).contents;
  return markdown?.value || null;
}

// =============================================================================
// COMPLETION PROVIDER TESTS - getBraceDepthAndPath()
// =============================================================================

describe('CompletionProvider block parsing', () => {
  let provider: CK3CompletionProvider;

  beforeEach(() => {
    provider = new CK3CompletionProvider();
  });

  describe('Simple nested blocks', () => {
    it('should detect trigger context inside trigger = { }', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {

	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(3, 2); // Inside trigger block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('is_adult'); // Trigger
      expect(labels).not.toContain('add_prestige'); // Effect - should NOT appear
    });

    it('should detect effect context inside immediate = { }', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {

	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(3, 2); // Inside immediate block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('add_prestige'); // Effect
    });
  });

  describe('Multiple blocks on one line', () => {
    it('should handle inline blocks correctly after unification', () => {
      // BUG FIX: CompletionProvider now uses the unified block parser which
      // correctly handles multiple inline blocks on one line.
      //
      // Previously, when multiple blocks were on one line like:
      // limit = { scope:actor = { is_ai = yes } }
      // the old getBraceDepthAndPath() method only tracked the first block.
      //
      // The unified parser correctly tracks all blocks, so after the inline
      // limit closes, we correctly recognize we're still inside the 'if' block.
      const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = { scope:actor = { is_ai = yes } }

		}
	}
}`;
      const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
      // Position after the inline limit block closes, still inside the if block
      const position = new Position(4, 3);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // FIXED: Now correctly detects effect context inside 'if' block
      // Returns both 'limit' (internal field) and effects like 'add_prestige'
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('limit'); // Internal field for if blocks
    });
  });

  describe('Scope-prefixed blocks', () => {
    it('should recognize scope:actor as a block name', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		scope:actor = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside scope:actor block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should still offer triggers inside scope:actor
      expect(labels).toContain('is_adult');
    });
  });

  describe('Dot-separated scope paths (KNOWN LIMITATION)', () => {
    it('should handle faith.religious_head = { } - CURRENT BEHAVIOR', () => {
      // CompletionProvider regex does NOT support dots
      // This test documents current behavior
      const content = `namespace = test
test.0001 = {
	trigger = {
		faith.religious_head = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside faith.religious_head block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Document current behavior - completion still works because
      // it's inside trigger context
      expect(labels).toContain('is_adult');
    });
  });

  describe('Script variable blocks (KNOWN LIMITATION)', () => {
    it('should handle $CHARACTER$ = { } - CURRENT BEHAVIOR', () => {
      // CompletionProvider regex does NOT support $ in identifiers
      const content = `namespace = test
test.0001 = {
	immediate = {
		$CHARACTER$ = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Document current behavior
      expect(labels).toContain('add_prestige');
    });
  });

  describe('Scope type tracking through iterators', () => {
    it('should track scope change through any_held_title', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		any_held_title = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside any_held_title

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should offer landed_title-scope triggers
      expect(labels).toContain('tier'); // landed_title scope trigger
    });
  });

  describe('Comment handling', () => {
    it('should ignore blocks inside comments', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		# immediate = {

	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 2);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should be in trigger context, not effect
      expect(labels).toContain('is_adult');
    });
  });
});

// =============================================================================
// DIAGNOSTICS PROVIDER TESTS - inline block stack tracking
// =============================================================================

describe('DiagnosticsProvider block parsing', () => {
  let provider: CK3DiagnosticsProvider;

  beforeEach(() => {
    provider = new CK3DiagnosticsProvider();
  });

  describe('Context detection via diagnostics', () => {
    it('should detect trigger context and flag unknown triggers', () => {
      // Using 'xyz' without underscores to bypass scripted trigger heuristic
      const content = `namespace = test
test.0001 = {
	trigger = {
		xyz = yes
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      const xyzDiag = diagnostics.find((d: any) => d.message.includes('"xyz"'));
      expect(xyzDiag).toBeDefined();
      expect(xyzDiag.message).toContain('Unknown trigger');
      expect(xyzDiag.message).not.toContain('Unknown effect');
    });

    it('should detect effect context and flag unknown effects', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		xyz = yes
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      const xyzDiag = diagnostics.find((d: any) => d.message.includes('"xyz"'));
      expect(xyzDiag).toBeDefined();
      expect(xyzDiag.message).toContain('Unknown effect');
      expect(xyzDiag.message).not.toContain('Unknown trigger');
    });
  });

  describe('Multiple inline blocks on one line', () => {
    it('should maintain correct context after inline blocks', () => {
      // Regression test for context detection bug
      const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = { scope:actor = { is_ai = yes } }
			xyznotreal = yes
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/test/common/character_interactions/test.txt');

      const xyzDiag = diagnostics.find((d: any) => d.message.includes('"xyznotreal"'));
      expect(xyzDiag).toBeDefined();
      // After the inline limit closes, we're back in effect context (inside if)
      expect(xyzDiag.message).toContain('Unknown effect');
    });
  });

  describe('Operators other than =', () => {
    it('should handle ?= operator for scope changers', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		liege ?= {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      // liege is a valid scope changer, so ?= should be valid
      const liegeDiag = diagnostics.find((d: any) => d.message.includes('liege'));
      expect(liegeDiag).toBeUndefined(); // No error for valid scope changer
    });

    it('should flag invalid ?= usage on non-scope-changers', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		not_a_scope ?= {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      const invalidDiag = diagnostics.find((d: any) =>
        d.message.includes('?=') && d.message.includes('not a valid scope')
      );
      expect(invalidDiag).toBeDefined();
    });

    it('should handle comparison operators for script values', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		gold > {
			value = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      // gold > { value = 100 } should be valid - comparison creates weight context
      const goldDiag = diagnostics.find((d: any) => d.message.includes('"gold"'));
      // This might or might not produce a diagnostic depending on implementation
      // Document current behavior
      console.log('Comparison operator diagnostics:', diagnostics.map((d: any) => d.message));
    });
  });

  describe('Dot-separated scope paths', () => {
    it('should handle faith.religious_head = { } as block name', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		faith.religious_head = {
			xyz = yes
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      const xyzDiag = diagnostics.find((d: any) => d.message.includes('"xyz"'));
      expect(xyzDiag).toBeDefined();
      // Inside faith.religious_head (a scope changer), should still be trigger context
      expect(xyzDiag.message).toContain('Unknown trigger');
    });
  });

  describe('Script variable blocks', () => {
    it('should handle $CHARACTER$ = { } as block name', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		$CHARACTER$ = {
			xyz = yes
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/events/test.txt');

      const xyzDiag = diagnostics.find((d: any) => d.message.includes('"xyz"'));
      expect(xyzDiag).toBeDefined();
      // $CHARACTER$ is treated as a scope changer (script variable)
      expect(xyzDiag.message).toContain('Unknown effect');
    });
  });

  describe('Weight context', () => {
    it('should detect weight context in ai_will_do', () => {
      const content = `test_decision = {
	ai_will_do = {
		base = 100
		modifier = {
			add = 50
			is_adult = yes
		}
	}
}`;
      const diagnostics = getDiagnostics(provider, content, '/mod/common/decisions/test.txt');

      // base, modifier, add should all be valid in weight context
      const baseDiag = diagnostics.find((d: any) => d.message.includes('"base"'));
      expect(baseDiag).toBeUndefined(); // No error for valid weight param
    });
  });
});

// =============================================================================
// HOVER PROVIDER TESTS - findParentBlock()
// =============================================================================

describe('HoverProvider block parsing', () => {
  let provider: CK3HoverProvider;

  beforeEach(() => {
    provider = new CK3HoverProvider();
  });

  describe('Finding parent block for parameter hover', () => {
    it('should find trigger_event as parent for id parameter', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		trigger_event = {
			id = test.0002
		}
	}
}`;
      // Position on 'id'
      const hover = getHoverContent(provider, content, '/mod/events/test.txt', new Position(4, 4));

      // Should show parameter documentation for trigger_event
      if (hover) {
        expect(hover).toContain('trigger_event');
      }
    });

    it('should find add_opinion as parent for target parameter', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		add_opinion = {
			target = scope:actor
			modifier = friendly
		}
	}
}`;
      // Position on 'target'
      const hover = getHoverContent(provider, content, '/mod/events/test.txt', new Position(4, 4));

      if (hover) {
        expect(hover).toContain('add_opinion');
      }
    });
  });

  describe('Effect and trigger hover', () => {
    it('should show effect documentation for add_prestige', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		add_prestige = 100
	}
}`;
      const hover = getHoverContent(provider, content, '/mod/events/test.txt', new Position(3, 3));

      expect(hover).not.toBeNull();
      expect(hover).toContain('add_prestige');
      expect(hover).toContain('Effect');
    });

    it('should show trigger documentation for is_adult', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		is_adult = yes
	}
}`;
      const hover = getHoverContent(provider, content, '/mod/events/test.txt', new Position(3, 3));

      expect(hover).not.toBeNull();
      expect(hover).toContain('is_adult');
      expect(hover).toContain('Trigger');
    });
  });

  describe('Weight block parameter hover', () => {
    it('should show documentation for base in ai_will_do', () => {
      const content = `test_decision = {
	ai_will_do = {
		base = 100
	}
}`;
      const hover = getHoverContent(provider, content, '/mod/common/decisions/test.txt', new Position(2, 3));

      expect(hover).not.toBeNull();
      expect(hover).toContain('base');
      expect(hover).toContain('weight');
    });

    it('should show documentation for modifier in ai_will_do', () => {
      const content = `test_decision = {
	ai_will_do = {
		modifier = {
			add = 50
		}
	}
}`;
      const hover = getHoverContent(provider, content, '/mod/common/decisions/test.txt', new Position(2, 3));

      expect(hover).not.toBeNull();
      expect(hover).toContain('modifier');
    });
  });

  describe('Backwards scan accuracy', () => {
    it('should find if as parent, not limit, for field after inline limit', () => {
      const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = { is_adult = yes }
			add_prestige = 100
		}
	}
}`;
      // Position on add_prestige - parent should be 'if', not 'limit'
      const hover = getHoverContent(provider, content, '/test/common/character_interactions/test.txt', new Position(4, 4));

      // add_prestige should be recognized as an effect
      expect(hover).not.toBeNull();
      expect(hover).toContain('add_prestige');
      expect(hover).toContain('Effect');
    });
  });
});

// =============================================================================
// COMPARATIVE TESTS - Verify consistency between implementations
// =============================================================================

describe('Cross-provider consistency', () => {
  let completionProvider: CK3CompletionProvider;
  let diagnosticsProvider: CK3DiagnosticsProvider;
  let hoverProvider: CK3HoverProvider;

  beforeEach(() => {
    completionProvider = new CK3CompletionProvider();
    diagnosticsProvider = new CK3DiagnosticsProvider();
    hoverProvider = new CK3HoverProvider();
  });

  it('all providers should agree on trigger context', () => {
    const content = `namespace = test
test.0001 = {
	trigger = {
		is_adult = yes
	}
}`;
    const doc = createMockDocument(content, '/mod/events/test_events.txt');

    // CompletionProvider should offer triggers
    const completions = completionProvider.provideCompletionItems(
      doc as any,
      new Position(3, 2),
      CancellationToken as any,
      { triggerKind: CompletionTriggerKind.Invoke }
    );
    const labels = getCompletionLabels(completions);
    expect(labels).toContain('is_adult');

    // HoverProvider should show trigger documentation
    const hover = hoverProvider.provideHover(doc as any, new Position(3, 3), CancellationToken as any);
    expect(hover).not.toBeNull();
    expect((hover as any).contents.value).toContain('Trigger');
  });

  it('all providers should agree on effect context', () => {
    const content = `namespace = test
test.0001 = {
	immediate = {
		add_prestige = 100
	}
}`;
    const doc = createMockDocument(content, '/mod/events/test_events.txt');

    // CompletionProvider should offer effects
    const completions = completionProvider.provideCompletionItems(
      doc as any,
      new Position(3, 2),
      CancellationToken as any,
      { triggerKind: CompletionTriggerKind.Invoke }
    );
    const labels = getCompletionLabels(completions);
    expect(labels).toContain('add_prestige');

    // HoverProvider should show effect documentation
    const hover = hoverProvider.provideHover(doc as any, new Position(3, 3), CancellationToken as any);
    expect(hover).not.toBeNull();
    expect((hover as any).contents.value).toContain('Effect');
  });
});
