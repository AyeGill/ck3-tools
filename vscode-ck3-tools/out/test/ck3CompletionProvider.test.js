"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tests for CK3CompletionProvider
 *
 * Tests that autocomplete suggestions appear in the correct contexts.
 */
const vitest_1 = require("vitest");
const ck3CompletionProvider_1 = require("../providers/ck3CompletionProvider");
const vscode_1 = require("./mocks/vscode");
(0, vitest_1.describe)('CK3CompletionProvider', () => {
    let provider;
    (0, vitest_1.beforeAll)(() => {
        provider = new ck3CompletionProvider_1.CK3CompletionProvider();
    });
    // Helper to get completion labels from result
    function getCompletionLabels(result) {
        if (!result)
            return [];
        if (Array.isArray(result)) {
            return result.map(item => typeof item.label === 'string' ? item.label : item.label.label);
        }
        if (result.items) {
            return result.items.map((item) => typeof item.label === 'string' ? item.label : item.label.label);
        }
        return [];
    }
    (0, vitest_1.describe)('Event trigger block completions', () => {
        (0, vitest_1.it)('should offer trigger completions inside trigger = { }', () => {
            const content = `namespace = test
test.0001 = {
	trigger = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(3, 2); // Inside trigger block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('is_adult');
            (0, vitest_1.expect)(labels).toContain('any_vassal');
            (0, vitest_1.expect)(labels).toContain('age');
        });
        (0, vitest_1.it)('should offer character-scope triggers inside any_vassal', () => {
            const content = `namespace = test
test.0001 = {
	trigger = {
		any_vassal = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(4, 3); // Inside any_vassal block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Should have character-scope triggers
            (0, vitest_1.expect)(labels).toContain('is_adult');
            (0, vitest_1.expect)(labels).toContain('has_trait');
            (0, vitest_1.expect)(labels).toContain('age');
        });
        (0, vitest_1.it)('should offer internal fields inside opinion = { }', () => {
            const content = `namespace = test
test.0001 = {
	trigger = {
		opinion = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(4, 3); // Inside opinion block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('target');
            (0, vitest_1.expect)(labels).toContain('value');
        });
    });
    (0, vitest_1.describe)('Event effect block completions', () => {
        (0, vitest_1.it)('should offer effect completions inside immediate = { }', () => {
            const content = `namespace = test
test.0001 = {
	immediate = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(3, 2); // Inside immediate block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('every_vassal');
            (0, vitest_1.expect)(labels).toContain('trigger_event');
        });
        (0, vitest_1.it)('should offer option schema fields directly inside option = { }', () => {
            const content = `namespace = test
test.0001 = {
	option = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(3, 2); // Directly inside option block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Directly inside option, should get option schema fields
            (0, vitest_1.expect)(labels).toContain('name');
            (0, vitest_1.expect)(labels).toContain('trigger');
        });
        (0, vitest_1.it)('should offer effect completions inside nested block within option', () => {
            const content = `namespace = test
test.0001 = {
	option = {
		name = test.0001.a
		root = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(5, 3); // Inside root = { } within option
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Inside a scope block within option, should get effects
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('add_gold');
        });
        (0, vitest_1.it)('should offer effect completions inside every_vassal in immediate', () => {
            const content = `namespace = test
test.0001 = {
	immediate = {
		every_vassal = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(4, 3); // Inside every_vassal block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Should have character-scope effects
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('add_trait');
        });
        (0, vitest_1.it)('should offer internal fields inside add_opinion = { }', () => {
            const content = `namespace = test
test.0001 = {
	immediate = {
		add_opinion = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(4, 3); // Inside add_opinion block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('target');
            (0, vitest_1.expect)(labels).toContain('modifier');
            (0, vitest_1.expect)(labels).toContain('opinion');
        });
        (0, vitest_1.it)('should offer internal fields inside trigger_event = { }', () => {
            const content = `namespace = test
test.0001 = {
	immediate = {
		trigger_event = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(4, 3); // Inside trigger_event block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('id');
            (0, vitest_1.expect)(labels).toContain('days');
            (0, vitest_1.expect)(labels).toContain('months');
            (0, vitest_1.expect)(labels).toContain('years');
        });
    });
    (0, vitest_1.describe)('Decision completions', () => {
        (0, vitest_1.it)('should offer trigger completions inside is_valid = { }', () => {
            const content = `example_decision = {
	is_valid = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/decisions/test.txt');
            const position = new vscode_1.Position(2, 2);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('is_adult');
            (0, vitest_1.expect)(labels).toContain('prestige');
            (0, vitest_1.expect)(labels).toContain('gold');
        });
        (0, vitest_1.it)('should offer effect completions inside effect = { }', () => {
            const content = `example_decision = {
	effect = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/decisions/test.txt');
            const position = new vscode_1.Position(2, 2);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('add_gold');
            (0, vitest_1.expect)(labels).toContain('trigger_event');
        });
        (0, vitest_1.it)('should offer triggers inside limit = { } within effect', () => {
            const content = `example_decision = {
	effect = {
		every_vassal = {
			limit = {

			}
		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/decisions/test.txt');
            const position = new vscode_1.Position(4, 4);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // limit blocks contain triggers
            (0, vitest_1.expect)(labels).toContain('is_adult');
        });
    });
    (0, vitest_1.describe)('Trait completions', () => {
        (0, vitest_1.it)('should offer trait schema fields at top level', () => {
            const content = `example_trait = {

}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/traits/test.txt');
            const position = new vscode_1.Position(1, 1);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('category');
            (0, vitest_1.expect)(labels).toContain('diplomacy');
            (0, vitest_1.expect)(labels).toContain('martial');
            (0, vitest_1.expect)(labels).toContain('opposite_opinion');
        });
    });
    (0, vitest_1.describe)('Scope tracking across nested blocks', () => {
        (0, vitest_1.it)('should track scope through multiple nested iterators', () => {
            const content = `namespace = test
test.0001 = {
	trigger = {
		any_vassal = {
			any_child = {

			}
		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(5, 4); // Inside any_child (which is inside any_vassal)
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Should still have character-scope triggers (any_child scopes to character)
            (0, vitest_1.expect)(labels).toContain('is_adult');
            (0, vitest_1.expect)(labels).toContain('age');
        });
        (0, vitest_1.it)('should change scope for title iterators', () => {
            const content = `namespace = test
test.0001 = {
	trigger = {
		any_held_title = {

		}
	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(4, 3); // Inside any_held_title
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Should have title-scope triggers
            (0, vitest_1.expect)(labels).toContain('tier');
            (0, vitest_1.expect)(labels).toContain('is_titular');
        });
    });
    (0, vitest_1.describe)('Interaction completions', () => {
        (0, vitest_1.it)('should offer trigger completions inside is_shown = { }', () => {
            const content = `my_interaction = {
	is_shown = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/character_interactions/test.txt');
            const position = new vscode_1.Position(2, 2);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('is_adult');
            (0, vitest_1.expect)(labels).toContain('prestige');
        });
        (0, vitest_1.it)('should offer effect completions inside on_accept = { }', () => {
            const content = `my_interaction = {
	on_accept = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/character_interactions/test.txt');
            const position = new vscode_1.Position(2, 2);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('trigger_event');
        });
    });
    (0, vitest_1.describe)('On Action completions', () => {
        (0, vitest_1.it)('should offer effect completions inside effect = { }', () => {
            const content = `on_game_start = {
	effect = {

	}
}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/on_actions/test.txt');
            const position = new vscode_1.Position(2, 2);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('every_vassal');
        });
    });
    (0, vitest_1.describe)('Scripted effect completions', () => {
        (0, vitest_1.it)('should offer effect completions inside scripted effect body', () => {
            const content = `my_scripted_effect = {

}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/scripted_effects/test.txt');
            const position = new vscode_1.Position(1, 1);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('add_prestige');
            (0, vitest_1.expect)(labels).toContain('add_gold');
            (0, vitest_1.expect)(labels).toContain('trigger_event');
        });
    });
    (0, vitest_1.describe)('Scripted trigger completions', () => {
        (0, vitest_1.it)('should offer trigger completions inside scripted trigger body', () => {
            const content = `my_scripted_trigger = {

}`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/common/scripted_triggers/test.txt');
            const position = new vscode_1.Position(1, 1);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            (0, vitest_1.expect)(labels).toContain('is_adult');
            (0, vitest_1.expect)(labels).toContain('prestige');
            (0, vitest_1.expect)(labels).toContain('any_vassal');
        });
    });
    (0, vitest_1.describe)('Edge cases', () => {
        (0, vitest_1.it)('should handle empty document', () => {
            const doc = (0, vscode_1.createMockDocument)('', '/mod/events/test.txt');
            const position = new vscode_1.Position(0, 0);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            // Should return something (even if empty array)
            (0, vitest_1.expect)(result).toBeDefined();
        });
        (0, vitest_1.it)('should handle position at file start', () => {
            const content = `namespace = test`;
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test.txt');
            const position = new vscode_1.Position(0, 0);
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            (0, vitest_1.expect)(result).toBeDefined();
        });
        (0, vitest_1.it)('should handle deeply nested structures', () => {
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
            const doc = (0, vscode_1.createMockDocument)(content, '/mod/events/test_events.txt');
            const position = new vscode_1.Position(7, 6); // Inside opinion block
            const result = provider.provideCompletionItems(doc, position, vscode_1.CancellationToken, { triggerKind: vscode_1.CompletionTriggerKind.Invoke });
            const labels = getCompletionLabels(result);
            // Should still get internal fields for opinion
            (0, vitest_1.expect)(labels).toContain('target');
            (0, vitest_1.expect)(labels).toContain('value');
        });
    });
});
//# sourceMappingURL=ck3CompletionProvider.test.js.map