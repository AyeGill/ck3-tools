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

    it('should detect double equals', () => {
      const content = `my_trait = {
	category == childhood
}`;
      const diagnostics = getDiagnostics(content, '/mod/common/traits/test.txt');

      const eqDiag = diagnostics.find((d: any) =>
        d.message.includes('Invalid syntax') && d.message.includes('single "="')
      );

      expect(eqDiag).toBeDefined();
      expect(eqDiag.severity).toBe(0); // Error
    });

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
});
