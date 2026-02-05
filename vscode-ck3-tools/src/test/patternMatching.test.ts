/**
 * Tests for effect/trigger pattern matching
 *
 * Validates that $PATTERN$ wildcards in effect/trigger names work correctly.
 * For example, set_relation_$RELATION$ should match set_relation_custom_xyz.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getEffect,
  getTrigger,
  hasEffect,
  hasTrigger,
  effectTemplates,
  triggerTemplates,
  getEffectParameterEntityTypes,
  getTriggerParameterEntityTypes,
  effectsMap,
  triggersMap,
} from '../data';
import { createMockDocument, DiagnosticCollection } from './mocks/vscode';

// Mock vscode module for integration tests
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
    file: (path: string) => ({ toString: () => `file://${path}`, fsPath: path }),
  },
}));

import { CK3DiagnosticsProvider } from '../providers/ck3DiagnosticsProvider';

describe('Effect/Trigger Pattern Matching', () => {
  describe('effectTemplates and triggerTemplates', () => {
    it('should have at least one effect template', () => {
      expect(effectTemplates.length).toBeGreaterThan(0);
    });

    it('should include set_relation_$RELATION$ pattern', () => {
      const relationTemplate = effectTemplates.find(t => t.original === 'set_relation_$RELATION$');
      expect(relationTemplate).toBeDefined();
      expect(relationTemplate!.pattern.test('set_relation_custom_xyz')).toBe(true);
      expect(relationTemplate!.pattern.test('set_relation_')).toBe(false); // Empty suffix
      expect(relationTemplate!.pattern.test('other_effect')).toBe(false);
    });

    it('should have pattern definition with parameters', () => {
      const relationTemplate = effectTemplates.find(t => t.original === 'set_relation_$RELATION$');
      expect(relationTemplate!.definition.parameters).toContain('target');
      expect(relationTemplate!.definition.parameters).toContain('reason');
      expect(relationTemplate!.definition.parameters).toContain('copy_reason');
    });
  });

  describe('hasEffect', () => {
    it('should return true for exact matches', () => {
      expect(hasEffect('add_gold')).toBe(true);
      expect(hasEffect('add_trait')).toBe(true);
    });

    it('should return true for pattern matches', () => {
      // These match the set_relation_$RELATION$ pattern
      expect(hasEffect('set_relation_custom_relation_xyz')).toBe(true);
      expect(hasEffect('set_relation_my_mod_relation')).toBe(true);
    });

    it('should return false for non-existent effects', () => {
      expect(hasEffect('totally_fake_effect_xyz')).toBe(false);
      expect(hasEffect('nonexistent')).toBe(false);
    });

    it('should prefer exact matches (existing set_relation_* effects)', () => {
      // These exist as exact matches in the generated data
      expect(hasEffect('set_relation_lover')).toBe(true);
      expect(hasEffect('set_relation_friend')).toBe(true);
      expect(hasEffect('set_relation_ward')).toBe(true);
    });
  });

  describe('getEffect', () => {
    it('should return exact match definition when available', () => {
      const addGold = getEffect('add_gold');
      expect(addGold).toBeDefined();
      expect(addGold!.name).toBe('add_gold');
    });

    it('should return pattern definition for pattern matches', () => {
      // This doesn't exist as an exact match, so should get pattern definition
      const custom = getEffect('set_relation_custom_relation_xyz');
      expect(custom).toBeDefined();
      expect(custom!.name).toBe('set_relation_$RELATION$');
      expect(custom!.parameters).toContain('target');
      expect(custom!.parameters).toContain('reason');
    });

    it('should prefer exact match over pattern match', () => {
      // set_relation_lover exists in generated data
      const lover = getEffect('set_relation_lover');
      expect(lover).toBeDefined();
      // The exact match has name 'set_relation_lover', not the pattern
      expect(lover!.name).toBe('set_relation_lover');
    });

    it('should return undefined for non-existent effects', () => {
      expect(getEffect('totally_fake_effect_xyz')).toBeUndefined();
    });
  });

  describe('getEffectParameterEntityTypes', () => {
    it('should return entity types for pattern-matched effects', () => {
      const types = getEffectParameterEntityTypes('set_relation_custom_xyz');
      expect(types).toBeDefined();
      expect(types!.target).toBe('character');
    });

    it('should return entity types for exact matches', () => {
      const types = getEffectParameterEntityTypes('add_opinion');
      expect(types).toBeDefined();
      expect(types!.target).toBe('character');
    });

    it('should return undefined for effects without typed params', () => {
      const types = getEffectParameterEntityTypes('add_gold');
      expect(types).toBeUndefined();
    });
  });

  describe('hasTrigger and getTrigger', () => {
    it('should work for exact matches', () => {
      expect(hasTrigger('is_ruler')).toBe(true);
      const ruler = getTrigger('is_ruler');
      expect(ruler).toBeDefined();
    });

    it('should return false/undefined for non-existent triggers', () => {
      expect(hasTrigger('totally_fake_trigger_xyz')).toBe(false);
      expect(getTrigger('totally_fake_trigger_xyz')).toBeUndefined();
    });
  });

  describe('Integration: Pattern definition in effectsMap', () => {
    it('should have pattern definition stored in map', () => {
      const patternDef = effectsMap.get('set_relation_$RELATION$');
      expect(patternDef).toBeDefined();
      expect(patternDef!.parameters).toContain('target');
      expect(patternDef!.description).toContain('UNDOCUMENTED');
    });
  });

  describe('Integration: Validation with pattern-matched effects', () => {
    let provider: CK3DiagnosticsProvider;

    function getDiagnostics(content: string, fileName: string): any[] {
      const doc = createMockDocument(content, fileName);
      provider.validateDocument(doc as any);
      const collection = provider.getDiagnosticCollection();
      return (collection as any).get(doc.uri) || [];
    }

    beforeEach(() => {
      provider = new CK3DiagnosticsProvider();
    });

    it('should NOT flag pattern-matched effect as unknown', () => {
      // set_relation_my_custom_relation doesn't exist as an exact match,
      // but should match set_relation_$RELATION$ pattern
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		set_relation_my_custom_relation = root
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown effect') && d.message.includes('set_relation_my_custom_relation')
      );

      expect(unknownEffectDiag).toBeUndefined();
    });

    it('should still flag actually unknown effects', () => {
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		totally_fake_effect = yes
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown effect') && d.message.includes('totally_fake_effect')
      );

      expect(unknownEffectDiag).toBeDefined();
    });

    it('should recognize parameters of pattern-matched effects', () => {
      // The set_relation_$RELATION$ pattern defines 'target', 'reason', 'copy_reason' as parameters
      // Using these inside a pattern-matched effect block should NOT produce diagnostics
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		set_relation_my_custom_relation = {
			target = root
			reason = some_flag
		}
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      // Should not flag 'target' or 'reason' as unknown
      const targetDiag = diagnostics.find((d: any) =>
        d.message.includes('target') && d.message.includes('Unknown')
      );
      const reasonDiag = diagnostics.find((d: any) =>
        d.message.includes('reason') && d.message.includes('Unknown')
      );

      expect(targetDiag).toBeUndefined();
      expect(reasonDiag).toBeUndefined();
    });

    it('should work for exact matches too (set_relation_lover)', () => {
      // set_relation_lover exists as an exact match - should also work
      const content = `namespace = test
test.0001 = {
	type = character_event
	immediate = {
		set_relation_lover = root
	}
}`;
      const diagnostics = getDiagnostics(content, '/mod/events/test.txt');

      const unknownEffectDiag = diagnostics.find((d: any) =>
        d.message.includes('Unknown effect') && d.message.includes('set_relation_lover')
      );

      expect(unknownEffectDiag).toBeUndefined();
    });
  });
});
