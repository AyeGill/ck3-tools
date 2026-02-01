/**
 * Schema definition for CK3 Succession Voting - powers autocomplete and hover documentation
 */

import { FieldSchema } from './traitSchema';

export const successionVotingSchema: FieldSchema[] = [
  // Basic Properties
  {
    name: 'name',
    type: 'string',
    description: 'Localization key for the voting type name.',
    example: 'name = "succession_voting_feudal_elective"',
  },
  {
    name: 'desc',
    type: 'string',
    description: 'Localization key for the description.',
    example: 'desc = "succession_voting_feudal_elective_desc"',
  },

  // Electors
  {
    name: 'electors',
    type: 'trigger',
    description: 'Conditions for who can be an elector.',
    example: `electors = {
    is_vassal_of = scope:holder
    highest_held_title_tier >= tier_county
}`,
  },
  {
    name: 'max_electors',
    type: 'integer',
    description: 'Maximum number of electors.',
    example: 'max_electors = 7',
  },

  // Candidates
  {
    name: 'candidates',
    type: 'trigger',
    description: 'Conditions for who can be a candidate.',
    example: `candidates = {
    is_close_or_extended_family_of = scope:holder
    is_adult = yes
}`,
  },
  {
    name: 'candidate_score',
    type: 'block',
    description: 'Score calculation for candidates.',
    example: `candidate_score = {
    base = 100
    modifier = {
        add = 50
        is_primary_heir_of = scope:holder
    }
}`,
  },

  // Voting
  {
    name: 'elector_vote_strength',
    type: 'block',
    description: 'Vote strength calculation for electors.',
    example: `elector_vote_strength = {
    base = 1
    modifier = {
        add = 1
        highest_held_title_tier >= tier_duchy
    }
}`,
  },
  {
    name: 'holder_vote_strength',
    type: 'block',
    description: 'Vote strength for the current holder.',
    example: `holder_vote_strength = {
    base = 3
}`,
  },

  // AI Voting
  {
    name: 'ai_vote_score',
    type: 'block',
    description: 'AI scoring for voting decisions.',
    example: `ai_vote_score = {
    base = 100
    modifier = {
        add = 50
        opinion >= 50
    }
}`,
  },

  // Trigger
  {
    name: 'potential',
    type: 'trigger',
    description: 'Conditions for this voting type to be available.',
    example: `potential = {
    has_government = feudal_government
}`,
  },

  // On Actions
  {
    name: 'on_election',
    type: 'effect',
    description: 'Effects when election occurs.',
    example: `on_election = {
    add_prestige = 100
}`,
  },

  // Icon
  {
    name: 'icon',
    type: 'string',
    description: 'Icon for this voting type.',
    example: 'icon = "gfx/interface/icons/succession/elective.dds"',
  },

  // Title Requirement
  {
    name: 'title_tier_requirement',
    type: 'enum',
    description: 'Minimum title tier for this voting type.',
    values: ['barony', 'county', 'duchy', 'kingdom', 'empire'],
    example: 'title_tier_requirement = kingdom',
  },
];

// Map for quick lookup
export const successionVotingSchemaMap = new Map<string, FieldSchema>(
  successionVotingSchema.map((field) => [field.name, field])
);

export function getSuccessionVotingFieldNames(): string[] {
  return successionVotingSchema.map((field) => field.name);
}

export function getSuccessionVotingFieldDocumentation(fieldName: string): string | undefined {
  const field = successionVotingSchemaMap.get(fieldName);
  if (!field) return undefined;

  let doc = field.description;
  if (field.type === 'enum' && field.values) {
    doc += `\n\nValid values: ${field.values.join(', ')}`;
  }
  if (field.default !== undefined) {
    doc += `\n\nDefault: ${field.default}`;
  }
  if (field.example) {
    doc += `\n\nExample:\n\`\`\`\n${field.example}\n\`\`\``;
  }
  return doc;
}
