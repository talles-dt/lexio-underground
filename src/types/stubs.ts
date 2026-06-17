// Central type definitions for Lexio Underground
// Previously scattered across stubs.ts and inline definitions

/** Pillar scores map — keys are pillar names, values are 0-100 */
export type PillarScores = Record<string, number>;

/** Map node from the adaptive engine (Cartografa) */
export interface MapNode {
  node_id: string;
  pillar: string;
  description: string;
  severity: "high" | "medium" | "low";
}

/** Maturity stages — identity progression */
export type MaturityStage =
  | "roots"
  | "sprouts"
  | "branches"
  | "canopy"
  | "underground";

/** Pillar keys */
export type PillarKey = "grammar" | "logic" | "vocab" | "culture" | "comm";
