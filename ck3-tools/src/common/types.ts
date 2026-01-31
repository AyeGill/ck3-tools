/**
 * Common types used across the CK3 tools
 */

// Building-related types
export interface BuildingConfig {
  name: string;
  levels: number;
  baseCost: number;
  costScaling: number;
  primaryEffect: string;
  outputPath: string;
}

export interface BuildingLevel {
  level: number;
  cost: number;
  effects: Record<string, number>;
  modifiers?: Modifier[];
}

// Trait-related types
export interface TraitConfig {
  name: string;
  levels: number;
  primaryStat: string;
  category: string;
  outputPath: string;
}

export interface TraitLevel {
  level: number;
  stats: Record<string, number>;
  modifiers?: Modifier[];
}

// Decision-related types
export interface DecisionConfig {
  name: string;
  isMajor: boolean;
  goldCost: number;
  prestigeCost: number;
  outputPath: string;
}

// Common modifiers
export interface Modifier {
  scope: 'character' | 'province' | 'county';
  effects: Record<string, number>;
  condition?: string;
}

// Generation result
export interface GenerationResult {
  file: string;
  locFile: string;
  content: string;
  localization: string;
}

// CK3 data format types
export interface CK3Object {
  id: string;
  properties: Record<string, any>;
}

// Template types
export interface TemplateData {
  [key: string]: any;
}
