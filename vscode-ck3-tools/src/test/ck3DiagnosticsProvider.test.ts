/**
 * Tests for CK3DiagnosticsProvider
 *
 * Tests that diagnostics are correctly generated with proper severity levels.
 */
import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import {
  createMockDocument,
  DiagnosticSeverity,
  Position,
  Range,
  Diagnostic,
  DiagnosticCollection,
} from './mocks/vscode';

// Mock vscode module before importing the provider
vi.mock('vscode', () => ({
  languages: {
    createDiagnosticCollection: () => new DiagnosticCollection(),
  },
  DiagnosticSeverity: {
    Error: 0,
    Warning: 1,
    Information: 2,
    Hint: 3,
  },
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
        // 4-arg constructor
        this.start = { line: startOrPosition, character: endOrCharacter };
        this.end = { line: endLine, character: endChar };
      } else {
        // 2-arg constructor with Position objects
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
    file: (path: string) => ({ toString: () => `file://${path}`, fsPath: path }),
  },
}));

import { CK3DiagnosticsProvider } from '../providers/ck3DiagnosticsProvider';

describe('CK3DiagnosticsProvider', () => {
  let provider: CK3DiagnosticsProvider;

  beforeEach(() => {
    provider = new CK3DiagnosticsProvider();
  });

  /**
   * Helper to get diagnostics from a document
   */
  function getDiagnostics(content: string, fileName: string): any[] {
    const doc = createMockDocument(content, fileName);
    provider.validateDocument(doc as any);
    const collection = provider.getDiagnosticCollection();
    // Access the internal map via the set method's recorded calls
    return (collection as any).get(doc.uri) || [];
  }

  describe('Severity levels', () => {
    it('should use Warning severity for unknown effects', () => {
      // Use a short name without underscores to bypass couldBeScriptedEffectOrTrigger heuristic
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		xyz = yes
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown effect') && d.message.includes('xyz')
      );

      expect(unknownEffectDiag).toBeDefined();
      expect(unknownEffectDiag.severity).toBe(1); // Warning = 1 (NOT Error = 0)
    });

    it('should use Warning severity for unknown triggers', () => {
      // Use a short name without underscores to bypass couldBeScriptedEffectOrTrigger heuristic
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		xyz = yes
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownTriggerDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trigger') && d.message.includes('xyz')
      );

      expect(unknownTriggerDiag).toBeDefined();
      expect(unknownTriggerDiag.severity).toBe(1); // Warning = 1 (NOT Error = 0)
    });

    it('should use Error severity for duplicate entity names', () => {
      const content = `my_trait = {
	category = childhood
}

my_trait = {
	category = education
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const duplicateDiag = diagnostics.find((d: any) =>
        d.message.includes('Duplicate')
      );

      expect(duplicateDiag).toBeDefined();
      expect(duplicateDiag.severity).toBe(0); // Error = 0
    });

    it('should detect duplicate event IDs', () => {
      const content = `namespace = test

test.0001 = {
	type = character_event
	title = test.0001.t
}

test.0001 = {
	type = character_event
	title = test.0001.t
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const duplicateDiag = diagnostics.find((d: any) =>
        d.message.includes('Duplicate') && d.message.includes('test.0001')
      );

      expect(duplicateDiag).toBeDefined();
      expect(duplicateDiag.severity).toBe(0); // Error = 0
    });
  });

  describe('Parameter recognition', () => {
    it('should not flag "flag" inside add_character_flag as unknown', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_character_flag = {
			flag = my_flag
			days = 30
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const flagDiag = diagnostics.find((d: any) =>
        d.message.includes('"flag"')
      );
      const daysDiag = diagnostics.find((d: any) =>
        d.message.includes('"days"')
      );

      expect(flagDiag).toBeUndefined();
      expect(daysDiag).toBeUndefined();
    });

    it('should not flag "id" inside trigger_event as unknown', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		trigger_event = {
			id = test.0002
			days = 10
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const idDiag = diagnostics.find((d: any) =>
        d.message.includes('"id"')
      );

      expect(idDiag).toBeUndefined();
    });

    it('should not flag "type" inside any_scheme trigger as unknown', () => {
      // any_scheme has 'type' as a parameter
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		any_scheme = {
			type = murder
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const typeDiag = diagnostics.find((d: any) =>
        d.message.includes('"type"') && d.message.includes('Unknown')
      );

      expect(typeDiag).toBeUndefined();
    });

    it('should not flag "type" inside any_relation as unknown (it is a valid parameter)', () => {
      // any_relation has 'type' as a parameter to specify the relation type
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		any_relation = {
			type = lover
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const typeDiag = diagnostics.find((d: any) =>
        d.message.includes('"type"') && d.message.includes('Unknown')
      );

      // 'type' IS a valid parameter of any_relation, so it should NOT be flagged
      expect(typeDiag).toBeUndefined();
    });

    it('should not flag "months" inside trigger_event as unknown', () => {
      // trigger_event has 'months', 'days', 'years' as parameters
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		trigger_event = {
			id = test.0002
			months = 3
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const monthsDiag = diagnostics.find((d: any) =>
        d.message.includes('"months"') && d.message.includes('Unknown')
      );

      expect(monthsDiag).toBeUndefined();
    });
  });

  describe('Known effects and triggers', () => {
    it('should not flag known effects like add_prestige', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_prestige = 100
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const prestigeDiag = diagnostics.find((d: any) =>
        d.message.includes('add_prestige')
      );

      expect(prestigeDiag).toBeUndefined();
    });

    it('should not flag known triggers like is_adult', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		is_adult = yes
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const adultDiag = diagnostics.find((d: any) =>
        d.message.includes('is_adult')
      );

      expect(adultDiag).toBeUndefined();
    });

    it('should not flag iterators like every_vassal', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		every_vassal = {
			add_prestige = 10
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const vassalDiag = diagnostics.find((d: any) =>
        d.message.includes('every_vassal')
      );

      expect(vassalDiag).toBeUndefined();
    });

    it('should not flag trigger iterators like any_vassal', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		any_vassal = {
			is_adult = yes
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const vassalDiag = diagnostics.find((d: any) =>
        d.message.includes('any_vassal')
      );

      expect(vassalDiag).toBeUndefined();
    });
  });

  describe('Scope changers', () => {
    it('should not flag scope changers like liege', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		liege = {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const liegeDiag = diagnostics.find((d: any) =>
        d.message.includes('"liege"')
      );

      expect(liegeDiag).toBeUndefined();
    });

    it('should not flag scope:X references', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		scope:my_target = {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const scopeDiag = diagnostics.find((d: any) =>
        d.message.includes('scope:my_target')
      );

      expect(scopeDiag).toBeUndefined();
    });
  });

  describe('Control flow', () => {
    it('should not flag control flow elements like if/else', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		if = {
			limit = { is_adult = yes }
			add_prestige = 100
		}
		else = {
			add_prestige = 50
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const ifDiag = diagnostics.find((d: any) =>
        d.message.includes('"if"')
      );
      const elseDiag = diagnostics.find((d: any) =>
        d.message.includes('"else"')
      );

      expect(ifDiag).toBeUndefined();
      expect(elseDiag).toBeUndefined();
    });

    it('should not flag limit blocks', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		every_vassal = {
			limit = {
				is_adult = yes
			}
			add_prestige = 10
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const limitDiag = diagnostics.find((d: any) =>
        d.message.includes('"limit"')
      );

      expect(limitDiag).toBeUndefined();
    });
  });

  describe('Traits file validation', () => {
    it('should flag unknown fields in trait files', () => {
      const content = `my_trait = {
	category = childhood
	totally_fake_field = yes
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const fakeDiag = diagnostics.find((d: any) =>
        d.message.includes('totally_fake_field')
      );

      expect(fakeDiag).toBeDefined();
      expect(fakeDiag.severity).toBe(1); // Warning
    });

    it('should validate enum values', () => {
      const content = `my_trait = {
	category = invalid_category
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const categoryDiag = diagnostics.find((d: any) =>
        d.message.includes('Invalid value') && d.message.includes('category')
      );

      expect(categoryDiag).toBeDefined();
    });
  });

  describe('Unknown effects/triggers with block values', () => {
    it('should flag unknown triggers with block values', () => {
      // Bug: unknown triggers with { } values were not being flagged
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		adsasd = {
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownTriggerDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trigger') && d.message.includes('adsasd')
      );

      expect(unknownTriggerDiag).toBeDefined();
      expect(unknownTriggerDiag.severity).toBe(1); // Warning
    });

    it('should flag unknown effects with block values', () => {
      // Bug: unknown effects with { } values were not being flagged
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		assd = {
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown effect') && d.message.includes('assd')
      );

      expect(unknownEffectDiag).toBeDefined();
      expect(unknownEffectDiag.severity).toBe(1); // Warning
    });

    it('should flag unknown triggers with block values in decision is_shown', () => {
      const content = `test_dec = {
	is_shown = {
		adsasd = {
		}
	}
	effect = {
		assd = {
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/decisions/test.txt');

      const unknownTriggerDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trigger') && d.message.includes('adsasd')
      );
      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown effect') && d.message.includes('assd')
      );

      expect(unknownTriggerDiag).toBeDefined();
      expect(unknownEffectDiag).toBeDefined();
    });

    it('should flag effects used in trigger context (add_trait in is_shown)', () => {
      const content = `test_decision = {
	is_shown = {
		any_vassal = {
			add_trait = foobarbaz
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/decisions/test.txt');

      // add_trait is an effect, not a trigger - should be flagged with specific message
      const wrongContextDiag = diagnostics.find((d: any) =>
        d.message.includes('Effect') && d.message.includes('add_trait') && d.message.includes('trigger context')
      );

      expect(wrongContextDiag).toBeDefined();
      expect(wrongContextDiag.message).toContain('Effect "add_trait" used in trigger context');
    });

    it('should flag triggers used in effect context (is_adult in effect)', () => {
      const content = `test_decision = {
	effect = {
		every_vassal = {
			is_adult = yes
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/decisions/test.txt');

      // is_adult is a trigger, not an effect - should be flagged with specific message
      const wrongContextDiag = diagnostics.find((d: any) =>
        d.message.includes('Trigger') && d.message.includes('is_adult') && d.message.includes('effect context')
      );

      expect(wrongContextDiag).toBeDefined();
      expect(wrongContextDiag.message).toContain('Trigger "is_adult" used in effect context');
    });

    it('should NOT flag valid effects/triggers with block values', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		any_vassal = {
			is_adult = yes
		}
	}
	immediate = {
		every_vassal = {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const vassalDiag = diagnostics.find((d: any) =>
        d.message.includes('any_vassal') || d.message.includes('every_vassal')
      );

      expect(vassalDiag).toBeUndefined();
    });
  });

  describe('Syntax errors', () => {
    it('should detect unmatched opening brace', () => {
      const content = `my_trait = {
	category = childhood
`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const braceDiag = diagnostics.find((d: any) =>
        d.message.includes('Unmatched opening brace')
      );

      expect(braceDiag).toBeDefined();
      expect(braceDiag.severity).toBe(0); // Error
    });

    it('should detect unmatched closing brace', () => {
      const content = `my_trait = {
	category = childhood
}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const braceDiag = diagnostics.find((d: any) =>
        d.message.includes('Unmatched closing brace')
      );

      expect(braceDiag).toBeDefined();
      expect(braceDiag.severity).toBe(0); // Error
    });

    it('should detect incomplete assignment', () => {
      const content = `my_trait = {
	category =
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const assignDiag = diagnostics.find((d: any) =>
        d.message.includes('Incomplete assignment')
      );

      expect(assignDiag).toBeDefined();
      expect(assignDiag.severity).toBe(0); // Error
    });

    // Note: We no longer flag == as invalid because CK3 uses == for comparisons
    // e.g., `$VALUE$ == 25` in triggers. This is intentional.

    it('should detect missing field name before equals', () => {
      const content = `my_trait = {
	= childhood
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const fieldDiag = diagnostics.find((d: any) =>
        d.message.includes('Missing field name')
      );

      expect(fieldDiag).toBeDefined();
      expect(fieldDiag.severity).toBe(0); // Error
    });

    it('should allow multi-line block assignment', () => {
      // This is valid: field = \n { ... }
      const content = `my_trait =
{
	category = childhood
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const assignDiag = diagnostics.find((d: any) =>
        d.message.includes('Incomplete assignment')
      );

      expect(assignDiag).toBeUndefined();
    });
  });

  describe('Target validation', () => {
    // Create a mock workspace index with known entities
    function createMockWorkspaceIndex() {
      return {
        has: (type: string, name: string) => {
          if (type === 'trait') {
            return ['brave', 'craven', 'lustful'].includes(name);
          }
          if (type === 'decision') {
            return ['adopt_feudal_ways', 'convert_to_local_culture'].includes(name);
          }
          if (type === 'event') {
            return ['test.0001', 'test.0002', 'my_event.0001'].includes(name);
          }
          if (type === 'scripted_effect') {
            return ['my_scripted_effect', 'standard_effect'].includes(name);
          }
          if (type === 'scripted_trigger') {
            return ['my_scripted_trigger', 'standard_trigger'].includes(name);
          }
          if (type === 'scripted_modifier') {
            return ['my_scripted_modifier'].includes(name);
          }
          return false;
        },
        get: () => undefined,
        getAll: () => new Map(),
        getCount: () => 0,
        getTotalCount: () => 10,
      };
    }

    function getDiagnosticsWithIndex(content: string, fileName: string): any[] {
      const mockIndex = createMockWorkspaceIndex();
      const providerWithIndex = new CK3DiagnosticsProvider(mockIndex as any);
      const doc = createMockDocument(content, fileName);
      providerWithIndex.validateDocument(doc as any);
      const collection = providerWithIndex.getDiagnosticCollection();
      return (collection as any).get(doc.uri) || [];
    }

    it('should not flag valid trait in add_trait', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = brave
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait')
      );

      expect(traitDiag).toBeUndefined();
    });

    it('should flag invalid trait in add_trait', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = nonexistent_trait_xyz
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait') && d.message.includes('nonexistent_trait_xyz')
      );

      expect(traitDiag).toBeDefined();
      expect(traitDiag.severity).toBe(1); // Warning
    });

    it('should flag invalid trait in remove_trait', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		remove_trait = fake_trait_123
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait') && d.message.includes('fake_trait_123')
      );

      expect(traitDiag).toBeDefined();
    });

    it('should not flag scope references in add_trait', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = scope:saved_trait
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait')
      );

      expect(traitDiag).toBeUndefined();
    });

    it('should not flag variable references in add_trait', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = $TRAIT_PARAM$
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait')
      );

      expect(traitDiag).toBeUndefined();
    });

    it('should not flag flag: references in add_trait', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = flag:my_trait_flag
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait')
      );

      expect(traitDiag).toBeUndefined();
    });

    it('should validate quoted trait values', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = "nonexistent_trait"
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait') && d.message.includes('nonexistent_trait')
      );

      expect(traitDiag).toBeDefined();
    });

    it('should not flag valid quoted trait values', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_trait = "brave"
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait')
      );

      expect(traitDiag).toBeUndefined();
    });

    // Decision validation tests
    it('should not flag valid decision in execute_decision', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		execute_decision = adopt_feudal_ways
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const decisionDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown decision')
      );

      expect(decisionDiag).toBeUndefined();
    });

    it('should flag invalid decision in execute_decision', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		execute_decision = fake_decision_xyz
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const decisionDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown decision') && d.message.includes('fake_decision_xyz')
      );

      expect(decisionDiag).toBeDefined();
      expect(decisionDiag.severity).toBe(1); // Warning
    });

    // Trigger validation tests (not just effects)
    // Note: has_trait doesn't have supportedTargets in generated data, so we test with trait_is_sin which does
    it('should validate traits in trait_is_sin trigger', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		faith = {
			trait_is_sin = unknown_trait_xyz
		}
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait') && d.message.includes('unknown_trait_xyz')
      );

      expect(traitDiag).toBeDefined();
    });

    it('should not flag valid traits in trait_is_sin trigger', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		faith = {
			trait_is_sin = brave
		}
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const traitDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown trait')
      );

      expect(traitDiag).toBeUndefined();
    });

    it('should validate decisions in can_execute_decision trigger', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		can_execute_decision = nonexistent_decision
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const decisionDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown decision') && d.message.includes('nonexistent_decision')
      );

      expect(decisionDiag).toBeDefined();
    });

    it('should validate decisions in is_decision_on_cooldown trigger', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		is_decision_on_cooldown = fake_decision
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const decisionDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown decision') && d.message.includes('fake_decision')
      );

      expect(decisionDiag).toBeDefined();
    });

    it('should not flag scope references in execute_decision', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		execute_decision = scope:saved_decision
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const decisionDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown decision')
      );

      expect(decisionDiag).toBeUndefined();
    });

    it('should not flag variable references in execute_decision', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		execute_decision = $DECISION_VAR$
	}
}`;
      const diagnostics = getDiagnosticsWithIndex(content, '/mod/events/test.txt');

      const decisionDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown decision')
      );

      expect(decisionDiag).toBeUndefined();
    });
  });

  describe('Inline sibling block context tracking', () => {
    it('should NOT flag effects as being in trigger context when they are siblings of limit on same line', () => {
      // This is a real pattern from vanilla game files where everything is on one line
      // if = { limit = { ... } scope:target = { add_prestige = 100 } }
      // The add_prestige effect should be in effect context, NOT trigger context
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		if = { limit = { is_adult = yes } add_prestige = 100 }
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // add_prestige should NOT be flagged as "effect used in trigger context"
      const wrongContextDiag = diagnostics.find((d: any) =>
        d.message.includes('Effect') && d.message.includes('trigger context')
      );

      expect(wrongContextDiag).toBeUndefined();
    });

    it('should NOT flag effects inside scope changers that are siblings of limit', () => {
      // Pattern: if = { limit = { ... } scope:target = { effect_here } }
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		if = { limit = { is_adult = yes } scope:target = { add_prestige = 100 } }
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const wrongContextDiag = diagnostics.find((d: any) =>
        d.message.includes('Effect') && d.message.includes('trigger context')
      );

      expect(wrongContextDiag).toBeUndefined();
    });

    it('should NOT flag effects after inline limit block on separate lines', () => {
      // limit closes on same line, effect is on next line - should have correct context
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		if = {
			limit = { is_adult = yes }
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const wrongContextDiag = diagnostics.find((d: any) =>
        d.message.includes('Effect') && d.message.includes('trigger context')
      );

      expect(wrongContextDiag).toBeUndefined();
    });

    it('should correctly track multiple inline blocks', () => {
      // Complex pattern with multiple inline blocks
      // The third block should inherit from `if`, not from `limit`
      const content = `test_decision = {
	effect = {
		if = { limit = { is_adult = yes } liege = { add_prestige = 100 } }
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/decisions/test.txt');

      // No false positives about wrong context
      const wrongContextDiag = diagnostics.find((d: any) =>
        d.message.includes('trigger context') || d.message.includes('effect context')
      );

      expect(wrongContextDiag).toBeUndefined();
    });
  });

  describe('Operator handling', () => {
    describe('Standard assignment operator (=)', () => {
      it('should handle standard = assignment in effect context', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		add_prestige = 100
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const prestigeDiag = diagnostics.find((d: any) =>
          d.message.includes('add_prestige')
        );

        expect(prestigeDiag).toBeUndefined();
      });

      it('should flag unknown effects with = operator', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		fakeff = 100
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const unknownDiag = diagnostics.find((d: any) =>
          d.message.includes('Unknown effect') && d.message.includes('fakeff')
        );

        expect(unknownDiag).toBeDefined();
      });
    });

    describe('Conditional scope changer operator (?=)', () => {
      it('should accept valid scope changers with ?= operator', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		liege ?= {
			add_prestige = 100
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const liegeDiag = diagnostics.find((d: any) =>
          d.message.includes('liege')
        );

        expect(liegeDiag).toBeUndefined();
      });

      it('should accept capital_barony with ?= operator', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		capital_barony ?= {
			add_prestige = 100
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const baronyDiag = diagnostics.find((d: any) =>
          d.message.includes('capital_barony')
        );

        expect(baronyDiag).toBeUndefined();
      });

      it('should flag invalid scope changers with ?= operator', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		not_a_scope ?= {
			add_prestige = 100
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const unknownDiag = diagnostics.find((d: any) =>
          d.message.includes('not_a_scope') && d.message.includes('Invalid ?= usage')
        );

        expect(unknownDiag).toBeDefined();
      });

      it('should allow scope:X references with ?= operator', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		scope:my_target ?= {
			add_prestige = 100
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const scopeDiag = diagnostics.find((d: any) =>
          d.message.includes('scope:my_target')
        );

        expect(scopeDiag).toBeUndefined();
      });
    });

    describe('Comparison operators (>, <, >=, <=)', () => {
      it('should track blocks opened with > operator correctly', () => {
        // Comparison operators open script value blocks
        // Triggers inside should NOT be flagged
        const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		ai_boldness > {
			value = 50
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        // Should not have unmatched brace errors
        const braceDiag = diagnostics.find((d: any) =>
          d.message.includes('brace')
        );

        expect(braceDiag).toBeUndefined();
      });

      it('should track blocks opened with < operator correctly', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		ai_rationality < {
			value = 25
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const braceDiag = diagnostics.find((d: any) =>
          d.message.includes('brace')
        );

        expect(braceDiag).toBeUndefined();
      });

      it('should track blocks opened with >= operator correctly', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		gold >= {
			value = 100
			multiply = 2
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const braceDiag = diagnostics.find((d: any) =>
          d.message.includes('brace')
        );

        expect(braceDiag).toBeUndefined();
      });

      it('should track blocks opened with <= operator correctly', () => {
        const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		age <= {
			value = 65
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const braceDiag = diagnostics.find((d: any) =>
          d.message.includes('brace')
        );

        expect(braceDiag).toBeUndefined();
      });

      it('should correctly handle comparison operator after control flow', () => {
        // This was a bug: comparison operators weren't tracked,
        // causing stack mismatch when following control flow
        const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		if = {
			limit = { is_adult = yes }
		}
		gold > {
			value = 100
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        const braceDiag = diagnostics.find((d: any) =>
          d.message.includes('brace')
        );

        expect(braceDiag).toBeUndefined();
      });

      it('should NOT treat comparison operators as scope changers', () => {
        // Comparison operators should create weight/script value context,
        // not be treated as effects or triggers
        const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		prestige > {
			value = 500
		}
	}
}`;
        const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

        // prestige should not be flagged as unknown
        const prestigeDiag = diagnostics.find((d: any) =>
          d.message.includes('prestige') && d.message.includes('Unknown')
        );

        expect(prestigeDiag).toBeUndefined();
      });
    });
  });

  describe('Effect parameter validation', () => {
    it('should NOT flag text as unknown effect inside custom_tooltip', () => {
      // text is a parameter of custom_tooltip, not an effect
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		custom_tooltip = {
			text = my_tooltip_key
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const textDiag = diagnostics.find((d: any) =>
        d.message.includes('"text"')
      );

      expect(textDiag).toBeUndefined();
    });

    it('should NOT flag type/stacks as unknown effects inside men_at_arms', () => {
      // type and stacks are parameters of men_at_arms (inside spawn_army)
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		spawn_army = {
			men_at_arms = {
				type = light_cavalry
				stacks = 5
			}
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const typeDiag = diagnostics.find((d: any) =>
        d.message.includes('"type"') && d.message.includes('men_at_arms')
      );
      const stacksDiag = diagnostics.find((d: any) =>
        d.message.includes('"stacks"')
      );

      expect(typeDiag).toBeUndefined();
      expect(stacksDiag).toBeUndefined();
    });
  });

  describe('Bare identifier detection', () => {
    it('should flag bare identifiers in effect blocks', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		xyz
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const bareIdentifierDiag = diagnostics.find((d: any) =>
        d.message.includes('Unexpected bare identifier') && d.message.includes('xyz')
      );

      expect(bareIdentifierDiag).toBeDefined();
      expect(bareIdentifierDiag.severity).toBe(1); // Warning
    });

    it('should flag bare identifiers in trigger blocks', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		abc
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const bareIdentifierDiag = diagnostics.find((d: any) =>
        d.message.includes('Unexpected bare identifier') && d.message.includes('abc')
      );

      expect(bareIdentifierDiag).toBeDefined();
      expect(bareIdentifierDiag.severity).toBe(1); // Warning
    });

    it('should NOT flag bare identifiers in events list blocks', () => {
      // In on_action files, events = { event_id } is valid
      const content = `on_birthday = {
	events = {
		test.0001
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/on_action/test.txt');

      const bareIdentifierDiag = diagnostics.find((d: any) =>
        d.message.includes('Unexpected bare identifier')
      );

      // Should NOT be flagged as "unexpected bare identifier" since events block allows bare identifiers
      expect(bareIdentifierDiag).toBeUndefined();
    });

    it('should validate events in events list blocks with workspace index', () => {
      // Create a mock workspace index that knows about some events
      const mockIndex = {
        has: (type: string, name: string) => {
          if (type === 'event') {
            return ['known_event.0001', 'known_event.0002'].includes(name);
          }
          return false;
        },
        get: () => undefined,
        getAll: () => new Map(),
        getCount: () => 0,
        getTotalCount: () => 2,
      };

      const providerWithIndex = new CK3DiagnosticsProvider(mockIndex as any);

      const content = `on_birthday = {
	events = {
		unknown_event.9999
	}
}`;
      const doc = createMockDocument(content, '/mod/common/on_action/test.txt');
      providerWithIndex.validateDocument(doc as any);
      const collection = providerWithIndex.getDiagnosticCollection();
      const diagnostics = (collection as any).get(doc.uri) || [];

      const unknownEventDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown event') && d.message.includes('unknown_event.9999')
      );

      expect(unknownEventDiag).toBeDefined();
      expect(unknownEventDiag.severity).toBe(1); // Warning
    });
  });

  describe('Event ID handling (should NOT be confused with scope paths)', () => {
    // Event IDs have the format "namespace.event_id" (e.g., "test.0001", "fp3_temptation.0001")
    // These contain dots but should NOT be treated as scope paths like "liege.capital_county"

    it('should NOT flag event IDs in trigger_event id field', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		trigger_event = {
			id = fp3_temptation.0001
			days = 10
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // The event ID should not be flagged as unknown anything
      const eventDiag = diagnostics.find((d: any) =>
        d.message.includes('fp3_temptation.0001') || d.message.includes('fp3_temptation')
      );

      expect(eventDiag).toBeUndefined();
    });

    it('should NOT flag event IDs in on_action events list', () => {
      const content = `on_birthday = {
	events = {
		fp3_temptation.0001
		test.9999
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/on_action/test.txt');

      // Without a workspace index, these should just be allowed (not flagged as bare identifiers)
      const bareIdentifierDiag = diagnostics.find((d: any) =>
        d.message.includes('Unexpected bare identifier')
      );

      expect(bareIdentifierDiag).toBeUndefined();
    });

    it('should flag event IDs used as field names when no underscore (not valid scope changers)', () => {
      // If someone mistakenly uses an event ID as a field name with a block, it should be flagged
      // Note: Event IDs with underscores (like fp3_temptation.0002) are NOT flagged because
      // underscores trigger the "could be scripted effect" heuristic (to avoid false positives)
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		myevent.0002 = {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // "myevent.0002" has no underscores, so it should be flagged as unknown
      const unknownDiag = diagnostics.find((d: any) =>
        d.message.includes('myevent.0002') && d.message.includes('Unknown')
      );

      expect(unknownDiag).toBeDefined();
    });

    it('should flag event-like patterns with underscores (no longer using heuristics)', () => {
      // We now check the actual workspace index for scripted effects/triggers
      // instead of using name-based heuristics. Without a workspace index,
      // unknown identifiers should be flagged even if they have underscores.
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		fp3_temptation.0002 = {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // "fp3_temptation.0002" is not in the workspace index, so it IS flagged
      const unknownDiag = diagnostics.find((d: any) =>
        d.message.includes('fp3_temptation.0002') && d.message.includes('Unknown')
      );

      expect(unknownDiag).toBeDefined();
    });

    it('should NOT flag actual scripted effects from workspace index', () => {
      // Create a mock workspace index with a scripted effect
      const mockIndex = {
        has: (type: string, name: string) => {
          if (type === 'scripted_effect') {
            return ['my_custom_effect', 'fp3_some_effect'].includes(name);
          }
          return false;
        },
        get: () => undefined,
        getAll: () => new Map(),
        getCount: () => 0,
        getTotalCount: () => 2,
      };

      const providerWithIndex = new CK3DiagnosticsProvider(mockIndex as any);

      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		my_custom_effect = yes
		unknown_effect_xyz = yes
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      providerWithIndex.validateDocument(doc as any);
      const collection = providerWithIndex.getDiagnosticCollection();
      const diagnostics = (collection as any).get(doc.uri) || [];

      // my_custom_effect is in the index, should NOT be flagged
      const knownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('my_custom_effect') && d.message.includes('Unknown')
      );
      expect(knownEffectDiag).toBeUndefined();

      // unknown_effect_xyz is NOT in the index, SHOULD be flagged
      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('unknown_effect_xyz') && d.message.includes('Unknown')
      );
      expect(unknownEffectDiag).toBeDefined();
    });

    it('should NOT flag actual scripted triggers from workspace index', () => {
      // Create a mock workspace index with a scripted trigger
      const mockIndex = {
        has: (type: string, name: string) => {
          if (type === 'scripted_trigger') {
            return ['my_custom_trigger', 'is_valid_target'].includes(name);
          }
          return false;
        },
        get: () => undefined,
        getAll: () => new Map(),
        getCount: () => 0,
        getTotalCount: () => 2,
      };

      const providerWithIndex = new CK3DiagnosticsProvider(mockIndex as any);

      const content = `namespace = test
test.0001 = {
	type = character_event
	trigger = {
		my_custom_trigger = yes
		unknown_trigger_xyz = yes
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      providerWithIndex.validateDocument(doc as any);
      const collection = providerWithIndex.getDiagnosticCollection();
      const diagnostics = (collection as any).get(doc.uri) || [];

      // my_custom_trigger is in the index, should NOT be flagged
      const knownTriggerDiag = diagnostics.find((d: any) =>
        d.message.includes('my_custom_trigger') && d.message.includes('Unknown')
      );
      expect(knownTriggerDiag).toBeUndefined();

      // unknown_trigger_xyz is NOT in the index, SHOULD be flagged
      const unknownTriggerDiag = diagnostics.find((d: any) =>
        d.message.includes('unknown_trigger_xyz') && d.message.includes('Unknown')
      );
      expect(unknownTriggerDiag).toBeDefined();
    });

    it('should NOT confuse event namespace with scope changer (namespace is not a scope changer)', () => {
      // "test.0001" - "test" is not a known scope changer, so this should NOT be treated as a scope path
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		test.0002 = yes
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // This should be flagged as unknown effect (not silently treated as a scope path)
      const unknownDiag = diagnostics.find((d: any) =>
        d.message.includes('test.0002') && d.message.includes('Unknown')
      );

      expect(unknownDiag).toBeDefined();
    });

    it('should distinguish real scope paths from event-like patterns', () => {
      // "liege.primary_title" is a valid scope path (liege is a known scope changer)
      // "my_namespace.0001" is NOT a valid scope path (my_namespace is not a scope changer)
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		liege.primary_title = {
			add_prestige = 100
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // "liege.primary_title" IS a valid scope path and should NOT be flagged
      const liegeDiag = diagnostics.find((d: any) =>
        d.message.includes('liege.primary_title')
      );

      expect(liegeDiag).toBeUndefined();
    });

    it('should validate events in trigger_event with workspace index', () => {
      // Create a mock workspace index that knows about some events
      const mockIndex = {
        has: (type: string, name: string) => {
          if (type === 'event') {
            return ['known_namespace.0001', 'known_namespace.0002'].includes(name);
          }
          return false;
        },
        get: () => undefined,
        getAll: () => new Map(),
        getCount: () => 0,
        getTotalCount: () => 2,
      };

      const providerWithIndex = new CK3DiagnosticsProvider(mockIndex as any);

      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		trigger_event = {
			id = unknown_namespace.9999
		}
	}
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      providerWithIndex.validateDocument(doc as any);
      const collection = providerWithIndex.getDiagnosticCollection();
      const diagnostics = (collection as any).get(doc.uri) || [];

      // Currently we don't validate trigger_event id values against the index
      // This test documents current behavior - if we add validation later, update this test
      const unknownEventDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown event') && d.message.includes('unknown_namespace.9999')
      );

      // For now, this is NOT validated (would need to track that 'id' inside 'trigger_event' expects an event)
      // This documents expected current behavior
      expect(unknownEventDiag).toBeUndefined();
    });
  });
});
