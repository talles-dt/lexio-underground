export const SYNTAXIS_LEVELS = [
  "pre_a1",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
] as const;

export const SYNTAXIS_TRACKS = [
  "sentence_architecture",
  "verb_system",
  "noun_phrase",
  "clause_connection",
  "information_structure",
  "phrasal_verbs",
] as const;

export type SyntaxisLevel = (typeof SYNTAXIS_LEVELS)[number];
export type SyntaxisTrack = (typeof SYNTAXIS_TRACKS)[number];
export type SyntaxisPillar =
  | "grammar"
  | "logic"
  | "vocab"
  | "culture"
  | "comm";

export type EvidenceState =
  | "discovered"
  | "working"
  | "evidence_collected"
  | "review_due";

export interface SyntaxisSkill {
  id: string;
  slug: string;
  level: SyntaxisLevel;
  track: SyntaxisTrack;
  order: number;
  title: string;
  canDo: string;
  explanationPt: string;
  exampleEn: string;
  examplePt: string;
  commonInterferencePtBr: string;
  prerequisites: string[];
  diagnosticKeys: string[];
  pillarWeights: Record<SyntaxisPillar, number>;
  published: boolean;
}

export type ActivityKind =
  | "notice"
  | "transform"
  | "recombine"
  | "produce";

export interface SyntaxisActivity {
  id: string;
  kind: ActivityKind;
  title: string;
  instruction: string;
  prompt: string;
  acceptedAnswers: string[];
  authoredFeedback: string;
  durationMinutes: number;
  openProduction: boolean;
  pillars: SyntaxisPillar[];
}

export interface SyntaxisUnit {
  id: string;
  slug: string;
  level: SyntaxisLevel;
  track: SyntaxisTrack;
  title: string;
  skillIds: string[];
  estimatedMinutes: number;
  activities: SyntaxisActivity[];
  published: boolean;
}

export interface SyntaxisPulseAtom {
  id: string;
  skillId: string;
  level: SyntaxisLevel;
  pattern: string;
  prompt: string;
  answer: string;
  explanationPt: string;
  palaceRoom: "grammar";
  pronunciationTargets: string[];
}

export interface PhrasalVerbSense {
  id: string;
  meaningPt: string;
  definitionEn: string;
  exampleEn: string;
  examplePt: string;
  contrastEn: string;
}

export interface PhrasalVerbEntry {
  id: string;
  headword: string;
  particle: string;
  level: SyntaxisLevel;
  separability: "separable" | "inseparable" | "intransitive";
  transitivity: "transitive" | "intransitive";
  register: "neutral" | "informal" | "formal";
  literalness: "literal" | "metaphorical" | "idiomatic";
  skillId: string;
  pronunciationTargets: string[];
  senses: PhrasalVerbSense[];
}

export interface SyntaxisBundle {
  schemaVersion: 1;
  release: string;
  generatedAt: string;
  language: "en";
  interfaceLocale: "pt-BR";
  skills: SyntaxisSkill[];
  units: SyntaxisUnit[];
  pulseAtoms: SyntaxisPulseAtom[];
  phrasalVerbs: PhrasalVerbEntry[];
}

export type SyntaxisEventType =
  | "skill_discovered"
  | "activity_completed"
  | "production_saved"
  | "session_started"
  | "session_completed"
  | "review_requested";

export interface SyntaxisLearningEvent {
  clientEventId: string;
  deviceId: string;
  type: SyntaxisEventType;
  occurredAt: string;
  skillId?: string;
  unitId?: string;
  sessionId?: string;
  payload: Record<string, unknown>;
}

export interface SyntaxisPhonosLinkV1 {
  contract: "syntaxis-phonos/v1";
  skill_id: string;
  chunk_id: string;
  language: "en";
  cefr: SyntaxisLevel;
  pronunciation_targets: string[];
  return_to: string;
}
