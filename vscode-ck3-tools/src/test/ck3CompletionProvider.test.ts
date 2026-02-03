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
      // Directly inside option, should get BOTH option schema fields AND effects
      expect(labels).toContain('name');
      expect(labels).toContain('trigger');
      // Effects should also be available since you write them directly in option blocks
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('add_gold');
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

    it('should offer effect completions inside liege scope changer', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		liege = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside liege block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // liege changes scope to character, should have character-scope effects
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('add_trait');
      expect(labels).toContain('add_gold');
    });

    it('should offer title-scope completions inside primary_title scope changer', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		primary_title = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside primary_title block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // primary_title changes scope to landed_title, should have title-scope effects
      expect(labels).toContain('set_de_jure_liege_title');
      // Should NOT have character-only effects like add_prestige
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

  describe('Interaction completions', () => {
    it('should offer trigger completions inside is_shown = { }', () => {
      const content = `my_interaction = {
	is_shown = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/character_interactions/test.txt');
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
    });

    it('should offer effect completions inside on_accept = { }', () => {
      const content = `my_interaction = {
	on_accept = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/character_interactions/test.txt');
      const position = new Position(2, 2);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('trigger_event');
    });
  });

  describe('On Action completions', () => {
    it('should offer effect completions inside effect = { }', () => {
      const content = `on_game_start = {
	effect = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/on_actions/test.txt');
      const position = new Position(2, 2);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('every_vassal');
    });
  });

  describe('Scripted effect completions', () => {
    it('should offer effect completions inside scripted effect body', () => {
      const content = `my_scripted_effect = {

}`;
      const doc = createMockDocument(content, '/mod/common/scripted_effects/test.txt');
      const position = new Position(1, 1);

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
  });

  describe('Scripted trigger completions', () => {
    it('should offer trigger completions inside scripted trigger body', () => {
      const content = `my_scripted_trigger = {

}`;
      const doc = createMockDocument(content, '/mod/common/scripted_triggers/test.txt');
      const position = new Position(1, 1);

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      expect(labels).toContain('is_adult');
      expect(labels).toContain('prestige');
      expect(labels).toContain('any_vassal');
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

  describe('Modifier context completions', () => {
    it('should offer character modifiers inside trait track XP blocks', () => {
      const content = `my_trait = {
	track = {
		50 = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/traits/test.txt');
      const position = new Position(3, 3); // Inside 50 = { }

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get character modifiers inside XP track blocks
      expect(labels).toContain('learning');
      expect(labels).toContain('diplomacy');
      expect(labels).toContain('fertility');
    });

    it('should offer county modifiers inside county_modifier block', () => {
      const content = `my_building = {
	county_modifier = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/buildings/test.txt');
      const position = new Position(2, 2); // Inside county_modifier = { }

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get county modifiers
      expect(labels).toContain('levy_reinforcement_rate');
      expect(labels).toContain('building_slot_add');
    });

    it('should offer province modifiers inside province_modifier block', () => {
      const content = `my_building = {
	province_modifier = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/buildings/test.txt');
      const position = new Position(2, 2); // Inside province_modifier = { }

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get province modifiers
      expect(labels).toContain('stationed_maa_damage_add');
    });

    it('should offer character modifiers inside multi-track trait numeric blocks', () => {
      // Multi-track traits use: tracks = { track_name = { 50 = { modifiers } } }
      const content = `my_trait = {
	tracks = {
		my_track = {
			50 = {

			}
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/traits/test.txt');
      const position = new Position(4, 4); // Inside 50 = { }

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get character modifiers inside multi-track XP blocks
      expect(labels).toContain('learning');
      expect(labels).toContain('diplomacy');
      expect(labels).toContain('fertility');
    });
  });

  describe('Unknown scope (scope:X) completions', () => {
    it('should offer all effects inside scope:X blocks in events', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		scope:my_target = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside scope:my_target block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get effects from various scopes since scope is unknown
      expect(labels).toContain('add_trait'); // character effect
      expect(labels).toContain('every_vassal'); // character iterator
      expect(labels).toContain('every_secret'); // secret iterator
    });

    it('should offer all triggers inside scope:X blocks in trigger context', () => {
      const content = `namespace = test
test.0001 = {
	trigger = {
		scope:secret_target = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(4, 3); // Inside scope:secret_target block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get triggers from various scopes since scope is unknown
      expect(labels).toContain('is_adult'); // character trigger
      expect(labels).toContain('any_vassal'); // character iterator
    });

    it('should offer all effects inside scope:X in secret on_discover blocks', () => {
      const content = `my_secret = {
	on_discover = {
		scope:secret_target = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/secret_types/test.txt');
      const position = new Position(3, 3); // Inside scope:secret_target block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get effects since we're in an effect block with unknown scope
      expect(labels).toContain('add_trait');
      expect(labels).toContain('every_secret');
    });

    it('should resume scope tracking after known scope changer inside scope:X', () => {
      const content = `namespace = test
test.0001 = {
	immediate = {
		scope:unknown = {
			every_vassal = {

			}
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test_events.txt');
      const position = new Position(5, 4); // Inside every_vassal (which is inside scope:unknown)

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // After every_vassal, scope is known again (character)
      // Should get character-scope effects
      expect(labels).toContain('add_trait');
      expect(labels).toContain('add_prestige');
    });

    it('should offer secret-scoped effects inside every_secret', () => {
      const content = `my_secret = {
	on_discover = {
		scope:secret_target = {
			every_secret = {

			}
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/secret_types/test.txt');
      const position = new Position(4, 4); // Inside every_secret block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // every_secret changes scope to secret, should get secret-scoped effects
      expect(labels).toContain('reveal_to');
      expect(labels).toContain('expose_secret');
      expect(labels).toContain('remove_secret');
    });
  });

  describe('Weight block completions', () => {
    it('should offer weight block params inside ai_will_do = { }', () => {
      const content = `example_decision = {
	ai_will_do = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(2, 2); // Inside ai_will_do block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get weight block parameters
      expect(labels).toContain('base');
      expect(labels).toContain('modifier');
      expect(labels).toContain('factor');
      expect(labels).toContain('add');
      expect(labels).toContain('multiply');
      expect(labels).toContain('opinion_modifier');
    });

    it('should offer weight block params inside ai_chance = { }', () => {
      const content = `my_interaction = {
	ai_accept = {
		ai_chance = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/character_interactions/test.txt');
      const position = new Position(3, 3); // Inside ai_chance block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get weight block parameters
      expect(labels).toContain('base');
      expect(labels).toContain('modifier');
      expect(labels).toContain('factor');
    });

    it('should offer weight block params inside ai_accept = { }', () => {
      const content = `my_interaction = {
	ai_accept = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/character_interactions/test.txt');
      const position = new Position(2, 2); // Inside ai_accept block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get weight block parameters
      expect(labels).toContain('base');
      expect(labels).toContain('modifier');
      expect(labels).toContain('factor');
    });

    it('should offer extra params AND triggers inside modifier in weight context', () => {
      const content = `example_decision = {
	ai_will_do = {
		base = 100
		modifier = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(4, 3); // Inside modifier block within ai_will_do

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get modifier extra params
      expect(labels).toContain('add');
      expect(labels).toContain('factor');
      expect(labels).toContain('multiply');
      // Should ALSO get triggers (inline triggers in modifier blocks)
      expect(labels).toContain('is_adult');
      expect(labels).toContain('has_trait');
    });

    it('should offer extra params AND triggers inside opinion_modifier in weight context', () => {
      const content = `example_decision = {
	ai_will_do = {
		base = 100
		opinion_modifier = {

		}
	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(4, 3); // Inside opinion_modifier block

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get opinion_modifier extra params
      expect(labels).toContain('who');
      expect(labels).toContain('opinion_target');
      expect(labels).toContain('multiplier');
      // Should ALSO get triggers
      expect(labels).toContain('is_adult');
    });

    it('should NOT offer effects inside ai_will_do (effects are for effect context)', () => {
      const content = `example_decision = {
	ai_will_do = {

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
      // Should NOT get effects like add_prestige inside weight context
      expect(labels).not.toContain('add_prestige');
      expect(labels).not.toContain('trigger_event');
    });

    it('should NOT offer triggers directly inside ai_will_do (only in modifier blocks)', () => {
      const content = `example_decision = {
	ai_will_do = {

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
      // Should NOT get triggers directly in weight block (only inside modifier)
      expect(labels).not.toContain('is_adult');
      expect(labels).not.toContain('has_trait');
    });

    it('should correctly break out of weight context when entering effect block', () => {
      const content = `example_decision = {
	ai_will_do = {
		base = 100
	}
	effect = {

	}
}`;
      const doc = createMockDocument(content, '/mod/common/decisions/test.txt');
      const position = new Position(5, 2); // Inside effect block (after ai_will_do)

      const result = provider.provideCompletionItems(
        doc as any,
        position,
        CancellationToken as any,
        { triggerKind: CompletionTriggerKind.Invoke }
      );

      const labels = getCompletionLabels(result);
      // Should get effects, not weight params
      expect(labels).toContain('add_prestige');
      expect(labels).toContain('trigger_event');
      expect(labels).not.toContain('base');
    });
  });
});
