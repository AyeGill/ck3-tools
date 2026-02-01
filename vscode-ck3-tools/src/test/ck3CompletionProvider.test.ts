/**
 * Tests for CK3CompletionProvider
 *
 * Tests that autocomplete suggestions appear in the correct contexts.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { CK3CompletionProvider } from '../providers/ck3CompletionProvider';
import {
  createMockDocument,
  Position,
  CancellationToken,
  CompletionTriggerKind,
  CompletionList,
} from './mocks/vscode';

describe('CK3CompletionProvider', () => {
  let provider: CK3CompletionProvider;

  beforeAll(() => {
    provider = new CK3CompletionProvider();
  });

  // Helper to get completion labels from result
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

  describe('Event trigger block completions', () => {
    it('should offer trigger completions inside trigger = { }', () => {
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
      expect(labels).toContain('is_adult');
      expect(labels).toContain('any_vassal');
      expect(labels).toContain('age');
    });

    it('should offer character-scope triggers inside any_vassal', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		any_vassal = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside any_vassal block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should have character-scope triggers
      expect(labels).toContain('is_adult');
      expect(labels).toContain('has_trait');
      expect(labels).toContain('age');
    });

    it('should offer internal fields inside opinion = { }', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		opinion = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside opinion block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('target');
      expect(labels).toContain('value');
    });
  });

  describe('Event effect block completions', () => {
    it('should offer effect completions inside immediate = { }', () => {
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
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('every_vassal');
      expect(labels).toContain('trigger_event');
    });

    it('should offer option schema fields directly inside option = { }', () => {
      const content = `namespace = test
test.0001 = {
	option = {

	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(3, 2); // Directly inside option block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Directly inside option, should get option schema fields
      expect(labels).toContain('name');
      expect(labels).toContain('trigger');
    });

    it('should offer effect completions inside nested block within option', () => {
      const content = `namespace = test
test.0001 = {
	option = {
		name = test.0001.a
		root = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(5, 3); // Inside root = { } within option

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Inside a scope block within option, should get effects
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('add_gold');
    });

    it('should offer effect completions inside every_vassal in immediate', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		every_vassal = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside every_vassal block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should have character-scope effects
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('add_trait');
    });

    it('should offer internal fields inside add_opinion = { }', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		add_opinion = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside add_opinion block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('target');
      expect(labels).toContain('modifier');
      expect(labels).toContain('opinion');
    });

    it('should offer internal fields inside trigger_event = { }', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		trigger_event = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside trigger_event block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('id');
      expect(labels).toContain('days');
      expect(labels).toContain('months');
      expect(labels).toContain('years');
    });
  });

  describe('Decision completions', () => {
    it('should offer trigger completions inside is_valid = { }', () => {
      const content = `example_decision = {
	is_valid = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(2, 2);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('is_adult');
      expect(labels).toContain('prestige');
      expect(labels).toContain('gold');
    });

    it('should offer effect completions inside effect = { }', () => {
      const content = `example_decision = {
	effect = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(2, 2);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('add_gold');
      expect(labels).toContain('trigger_event');
    });

    it('should offer triggers inside limit = { } within effect', () => {
      const content = `example_decision = {
	effect = {
		every_vassal = {
			limit = {

			}
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(4, 4);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // limit blocks contain triggers
      expect(labels).toContain('is_adult');
    });
  });

  describe('Trait completions', () => {
    it('should offer trait schema fields at top level', () => {
      const content = `example_trait = {

}`;
      const doc = createMockDocument(content, '/mod/common/traits/test.txt');
      const position = new Position(1, 1);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('category');
      expect(labels).toContain('diplomacy');
      expect(labels).toContain('martial');
      expect(labels).toContain('opposite_opinion');
    });
  });

  describe('Scope tracking across nested blocks', () => {
    it('should track scope through multiple nested iterators', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		any_vassal = {
			any_child = {

			}
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(5, 4); // Inside any_child (which is inside any_vassal)

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should still have character-scope triggers (any_child scopes to character)
      expect(labels).toContain('is_adult');
      expect(labels).toContain('age');
    });

    it('should change scope for title iterators', () => {
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
      // Should have title-scope triggers
      expect(labels).toContain('tier');
      expect(labels).toContain('is_titular');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty document', () => {
      const doc = createMockDocument('', '/mod/events/test.txt');
      const position = new Position(0, 0);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      // Should return something (even if empty array)
      expect(result).toBeDefined();
    });

    it('should handle position at file start', () => {
      const content = `namespace = test`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(0, 0);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      expect(result).toBeDefined();
    });

    it('should handle deeply nested structures', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		any_vassal = {
			any_child = {
				any_sibling = {
					opinion = {

					}
				}
			}
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(7, 6); // Inside opinion block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should still get internal fields for opinion
      expect(labels).toContain('target');
      expect(labels).toContain('value');
    });
  });
});
