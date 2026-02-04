/**
 * Tests for CK3DefinitionProvider
 *
 * Tests that Go to Definition works for:
 * - Effect/trigger target values (add_trait = brave)
 * - Scripted effect/trigger calls (my_effect = yes)
 * - Bare identifiers in list blocks (first_valid = { my_event })
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { CK3DefinitionProvider } from '../providers/ck3DefinitionProvider';
import { CK3WorkspaceIndex, EntityType } from '../providers/workspaceIndex';
import {
  createMockDocument,
  Position,
  CancellationToken,
  Location,
  Uri,
} from './mocks/vscode';

/**
 * Create a mock workspace index with predefined entities
 */
function createMockWorkspaceIndex(): CK3WorkspaceIndex {
  console.log("creating!")
  const index = new CK3WorkspaceIndex();

  // Use the internal method to add entities directly for testing
  // We'll add entities by calling the private indices map
  const addEntity = (type: EntityType, name: string, uri: string, line: number) => {
    // Access private indices via type assertion
    const indices = (index as any).indices as Map<EntityType, Map<string, { uri: string; line: number; name: string }>>;
    const typeIndex = indices.get(type);
    if (typeIndex) {
      typeIndex.set(name, { uri, line, name });
    }
  };
  console.log("adding_ents")
  // Add some test traits
  addEntity('trait', 'brave', 'file:///mod/common/traits/personality_traits.txt', 10);
  addEntity('trait', 'ambitious', 'file:///mod/common/traits/personality_traits.txt', 50);
  addEntity('trait', 'craven', 'file:///mod/common/traits/personality_traits.txt', 90);

  // Add some test events
  addEntity('event', 'test_events.0001', 'file:///mod/events/test_events.txt', 3);
  addEntity('event', 'test_events.0002', 'file:///mod/events/test_events.txt', 53);
  addEntity('event', 'my_mod.100', 'file:///mod/events/my_mod_events.txt', 0);

  // Add some scripted effects/triggers
  addEntity('scripted_effect', 'my_custom_effect', 'file:///mod/common/scripted_effects/my_effects.txt', 5);
  addEntity('scripted_effect', 'grant_gold_effect', 'file:///mod/common/scripted_effects/my_effects.txt', 20);
  addEntity('scripted_trigger', 'my_custom_trigger', 'file:///mod/common/scripted_triggers/my_triggers.txt', 5);
  addEntity('scripted_trigger', 'is_valid_target_trigger', 'file:///mod/common/scripted_triggers/my_triggers.txt', 25);

  // Add some decisions
  addEntity('decision', 'my_decision', 'file:///mod/common/decisions/my_decisions.txt', 0);

  // Add some cultures
  addEntity('culture', 'norse', 'file:///mod/common/culture/cultures/00_norse.txt', 0);

  // Mark as initialized
  (index as any).initialized = true;

  return index;
}

describe('CK3DefinitionProvider', () => {
  let provider: CK3DefinitionProvider;
  let workspaceIndex: CK3WorkspaceIndex;

  beforeAll(() => {
    console.log("here!")
    workspaceIndex = createMockWorkspaceIndex();
    provider = new CK3DefinitionProvider(workspaceIndex);
  });

  describe('Effect/trigger target values', () => {
    it('should resolve add_trait = brave to trait definition', () => {
      const content = `
my_event = {
  immediate = {
    add_trait = brave
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "brave" (line 3, character 17)
      const position = new Position(3, 17);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/common/traits/personality_traits.txt');
      expect(location.range.start.line).toBe(10);
    });

    it('should resolve has_trait = ambitious to trait definition', () => {
      const content = `
my_event = {
  trigger = {
    has_trait = ambitious
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "ambitious"
      const position = new Position(3, 17);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/common/traits/personality_traits.txt');
      expect(location.range.start.line).toBe(50);
    });

    it('should resolve trigger_event id to event definition', () => {
      const content = `
my_event = {
  option = {
    trigger_event = {
      id = test_events.0002
    }
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "test_events.0002"
      const position = new Position(4, 12);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/events/test_events.txt');
      expect(location.range.start.line).toBe(53);
    });

    it('should return null for non-existent trait', () => {
      const content = `
my_event = {
  immediate = {
    add_trait = nonexistent_trait
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 17);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });

    it('should return null when cursor is on field name, not value', () => {
      const content = `
my_event = {
  immediate = {
    add_trait = brave
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "add_trait" (the field name)
      const position = new Position(3, 6);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      // add_trait is a built-in effect, not a scripted effect
      expect(result).toBeNull();
    });
  });

  describe('Scripted effect/trigger calls', () => {
    it('should resolve scripted effect call in effect context', () => {
      const content = `
my_event = {
  immediate = {
    my_custom_effect = yes
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "my_custom_effect"
      const position = new Position(3, 8);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/common/scripted_effects/my_effects.txt');
      expect(location.range.start.line).toBe(5);
    });

    it('should resolve scripted trigger call in trigger context', () => {
      const content = `
my_event = {
  trigger = {
    my_custom_trigger = yes
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "my_custom_trigger"
      const position = new Position(3, 8);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/common/scripted_triggers/my_triggers.txt');
      expect(location.range.start.line).toBe(5);
    });

    it('should not resolve built-in effects as scripted effects', () => {
      const content = `
my_event = {
  immediate = {
    add_gold = 100
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "add_gold"
      const position = new Position(3, 6);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      // add_gold is a built-in effect, should not be resolved
      expect(result).toBeNull();
    });
  });

  describe('Bare identifiers in list blocks', () => {
    it('should resolve bare event ID in first_valid block', () => {
      const content = `
on_birth = {
  first_valid = {
    test_events.0001
    test_events.0002
  }
}`;
      const doc = createMockDocument(content, '/mod/common/on_action/birth.txt');
      // Position on "test_events.0001"
      const position = new Position(3, 8);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/events/test_events.txt');
      expect(location.range.start.line).toBe(3);
    });

    it('should resolve bare event ID in events block', () => {
      const content = `
on_death = {
  events = {
    my_mod.100
  }
}`;
      const doc = createMockDocument(content, '/mod/common/on_action/death.txt');
      // Position on "my_mod.100"
      const position = new Position(3, 6);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/events/my_mod_events.txt');
      expect(location.range.start.line).toBe(0);
    });

    it('should return null for bare identifier not in list block', () => {
      const content = `
my_event = {
  immediate = {
    some_identifier
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      // Position on "some_identifier" - not in a list block
      const position = new Position(3, 8);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });
  });

  describe('Skip non-resolvable references', () => {
    it('should return null for scope: references', () => {
      const content = `
my_event = {
  immediate = {
    scope:actor = { }
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 10);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });

    it('should return null for $VARIABLE$ references', () => {
      const content = `
my_event = {
  immediate = {
    add_trait = $TRAIT$
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 17);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });

    it('should return null for flag: references', () => {
      const content = `
my_event = {
  trigger = {
    has_character_flag = flag:my_flag
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 30);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });

    it('should return null for yes/no values', () => {
      const content = `
my_event = {
  trigger = {
    is_adult = yes
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 16);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });

    it('should return null for prefixed references like title:k_france', () => {
      const content = `
my_event = {
  immediate = {
    title:k_france = { }
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 12);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle comments on the same line', () => {
      const content = `
my_event = {
  immediate = {
    add_trait = brave # Add the brave trait
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 17);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/common/traits/personality_traits.txt');
    });

    it('should handle extra whitespace', () => {
      const content = `
my_event = {
  immediate = {
    add_trait   =   brave
  }
}`;
      const doc = createMockDocument(content, '/mod/events/test.txt');
      const position = new Position(3, 21);

      const result = provider.provideDefinition(doc as any, position, CancellationToken as any);

      expect(result).not.toBeNull();
      const location = result as Location;
      expect(location.uri.path).toBe('/mod/common/traits/personality_traits.txt');
    });
  });
});
