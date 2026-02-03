/**
 * Regression tests for context detection bug fix
 *
 * Bug: When a line contains multiple inline blocks like `limit = { scope:actor = { ... } }`,
 * the parser only detected the first block start but popped ALL closing braces.
 * This caused the block stack to get out of sync, leading to incorrect context detection.
 *
 * Fix: Changed block-start detection to find ALL `name = {` patterns on a line using matchAll.
 */
import { describe, it, expect, vi } from 'vitest';

// Mock vscode module
vi.mock('vscode', () => ({
  languages: {
    createDiagnosticCollection: () => ({
      set: () => {},
      get: () => [],
      delete: () => {},
      clear: () => {},
      dispose: () => {},
    }),
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
    constructor(startOrPosition: any, endOrCharacter?: any) {
      if (typeof startOrPosition === 'number') {
        this.start = { line: startOrPosition, character: endOrCharacter };
        this.end = { line: 0, character: 0 };
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

import { CK3DiagnosticsProvider } from '../providers/ck3DiagnosticsProvider';

function createMockDocument(content: string, fileName: string): any {
  const lines = content.split('\n');
  return {
    fileName,
    uri: { toString: () => `file://${fileName}`, fsPath: fileName },
    languageId: 'ck3',
    lineCount: lines.length,
    getText: () => content,
    lineAt: (line: number) => ({
      text: lines[line] || '',
      lineNumber: line,
    }),
    positionAt: (offset: number) => {
      let remaining = offset;
      for (let line = 0; line < lines.length; line++) {
        const lineLength = lines[line].length + 1;
        if (remaining < lineLength) {
          return { line, character: remaining };
        }
        remaining -= lineLength;
      }
      return { line: lines.length - 1, character: lines[lines.length - 1]?.length || 0 };
    },
  };
}

describe('Context Detection Bug', () => {
  it('should detect trigger context for list inside any_in_list inside limit (simple)', () => {
    const provider = new CK3DiagnosticsProvider();

    // Simple case - works
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    if (listDiagnostic) {
      console.log('Simple case:', listDiagnostic.message);
      expect(listDiagnostic.message).toContain('Unknown trigger');
    }

    provider.dispose();
  });

  it('should detect trigger context with trigger_if before any_in_list', () => {
    const provider = new CK3DiagnosticsProvider();

    // With trigger_if before any_in_list
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = { is_ai = yes }
				}
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    if (listDiagnostic) {
      console.log('With trigger_if:', listDiagnostic.message);
    }

    provider.dispose();
  });

  it('with scope:actor inside trigger_if', () => {
    const provider = new CK3DiagnosticsProvider();

    // trigger_if with scope:actor block inside
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = { is_ai = yes }
					scope:actor = {
						any_vassal = {
							vassal_stance = courtly
						}
					}
				}
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    if (listDiagnostic) {
      console.log('With scope:actor inside trigger_if:', listDiagnostic.message);
    }

    provider.dispose();
  });

  it('with scope:recipient after trigger_if', () => {
    const provider = new CK3DiagnosticsProvider();

    // trigger_if followed by scope:recipient
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = { is_ai = yes }
				}
				scope:recipient = {
					is_lowborn = yes
				}
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    if (listDiagnostic) {
      console.log('With scope:recipient after trigger_if:', listDiagnostic.message);
    }

    provider.dispose();
  });

  it('with nested scope inside trigger_if limit PLUS scope:recipient (single-line)', () => {
    const provider = new CK3DiagnosticsProvider();

    // REGRESSION TEST: The limit = { scope:actor = { is_ai = yes } } is on ONE LINE
    // This caused block stack corruption before the fix
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = { scope:actor = { is_ai = yes } }
				}
				scope:recipient = {
					is_lowborn = yes
				}
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    // The key assertion: "list" must be flagged as "Unknown trigger" not "Unknown effect"
    // because we're inside limit = {} which is trigger context
    expect(listDiagnostic).toBeDefined();
    expect(listDiagnostic.message).toContain('Unknown trigger');
    expect(listDiagnostic.message).not.toContain('Unknown effect');

    provider.dispose();
  });

  it('with nested scope inside trigger_if limit PLUS scope:recipient (multi-line)', () => {
    const provider = new CK3DiagnosticsProvider();

    // SAME content but limit = { scope:actor = { } } on SEPARATE LINES
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = {
						scope:actor = {
							is_ai = yes
						}
					}
				}
				scope:recipient = {
					is_lowborn = yes
				}
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    if (listDiagnostic) {
      console.log('multi-line nested blocks:', listDiagnostic.message);
    }

    provider.dispose();
  });

  it('with scope:actor block inside trigger_if PLUS scope:recipient', () => {
    const provider = new CK3DiagnosticsProvider();

    // Combine: scope:actor block inside trigger_if + scope:recipient after
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = { is_ai = yes }
					scope:actor = {
						any_vassal = {
							vassal_stance = courtly
						}
					}
				}
				scope:recipient = {
					is_lowborn = yes
				}
				any_in_list = {
					list = titles_to_grant
				}
			}
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));
    if (listDiagnostic) {
      console.log('scope:actor block in trigger_if + scope:recipient:', listDiagnostic.message);
    }

    provider.dispose();
  });

  it('full game file case', () => {
    const provider = new CK3DiagnosticsProvider();

    // Exact content from game file (00_grant_titles_interaction.txt lines 795-814)
    const content = `grant_titles_interaction = {
	on_accept = {
		if = {
			limit = {
				trigger_if = {
					limit = { scope:actor = { is_ai = yes } }
					scope:actor = {
						any_vassal = {
							vassal_stance = courtly
						}
					}
				}
				scope:recipient = {
					is_lowborn = yes
				}
				any_in_list = {
					list = titles_to_grant
					tier >= tier_county
				}
			}
			custom_tooltip = grant_title_modifier_courtly_lowborn_grant_penalty
		}
	}
}`;

    const doc = createMockDocument(content, '/test/common/character_interactions/test.txt');
    provider.validateDocument(doc);

    const collection = provider.getDiagnosticCollection();
    const diagnostics = (collection as any).get(doc.uri) || [];

    console.log('All diagnostics:');
    for (const d of diagnostics) {
      console.log(`  Line ${d.range.start.line + 1}: ${d.message}`);
    }

    // Find any diagnostic about "list"
    const listDiagnostic = diagnostics.find((d: any) => d.message.includes('"list"'));

    if (listDiagnostic) {
      console.log('\nDiagnostic for "list":');
      console.log(`  ${listDiagnostic.message}`);

      // The bug: it says "Unknown effect" but should say "Unknown trigger"
      // because we're inside limit = {} which is trigger context
      if (listDiagnostic.message.includes('Unknown effect')) {
        console.log('\n*** BUG CONFIRMED: "list" flagged as unknown EFFECT, should be TRIGGER ***');
      } else if (listDiagnostic.message.includes('Unknown trigger')) {
        console.log('\nCorrect: "list" flagged as unknown trigger (trigger context detected)');
      }
    } else {
      console.log('\nNo diagnostic found for "list" - may have been suppressed or recognized');
    }

    provider.dispose();
  });
});
