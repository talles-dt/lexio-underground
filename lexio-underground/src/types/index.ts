// Pillar types
export interface PillarScore {
  score: number;
  confidence: number;
  gap_nodes: string[];
}

export interface PillarScores {
  grammar: PillarScore;
  logic: PillarScore;
  vocab: PillarScore;
  culture: PillarScore;
  comm: PillarScore;
}

export interface MapNode {
  node_id: string;
  pillar: keyof PillarScores;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

// Maturity stages
export type MaturityStage = 'roots' | 'sprouts' | 'branches' | 'canopy' | 'underground';

// Pillar definitions
export const PILLAR_WEIGHTS = {
  grammar: 0.25,
  logic: 0.20,
  vocab: 0.20,
  culture: 0.20,
  comm: 0.15,
} as const;

export const PILLAR_LABELS: Record<keyof PillarScores, string> = {
  grammar: 'Grammar',
  logic: 'Logic',
  vocab: 'Vocabulary',
  culture: 'Culture',
  comm: 'Communication',
};

// Palace
export interface PalaceRoom {
  id: string;
  name: string;
  pillar: keyof PillarScores | 'entrance' | 'communication';
  items: PalaceItem[];
  isUnlocked: boolean;
  isConnected: boolean;
}

export interface PalaceItem {
  id: string;
  word: string;
  chunk: string;
  room_id: string;
  grammar_notes?: string;
  cultural_atom_id?: string;
  pronunciation_url?: string;
  learned_at: number;
  next_review?: number;
}

// Session
export type SessionType = 'pulse' | 'deep' | 'shadow';

// Cartografa stages
export const CARTOGRAFA_STAGES: Array<keyof PillarScores> = [
  'grammar',
  'logic',
  'vocab',
  'culture',
  'comm',
];