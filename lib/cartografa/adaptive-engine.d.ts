export type Pillar = "grammar" | "logic" | "vocab" | "culture" | "comm";

export type PillarState = {
  pillar: Pillar;
  currentDifficulty: number;
  correctAtDifficulty: number;
  totalCorrect: number;
  totalAnswered: number;
  answeredIds: Set<string>;
  score: number;
  confidence: number;
  resolved: boolean;
  gapNodes: string[];
};

export type CartografaState = {
  pillars: Record<Pillar, PillarState>;
  currentPillar: Pillar;
  currentStage: number;
  history: string[];
  correct: boolean;
  updated: boolean;
  startedAt: string;
  allResolved: boolean;
};

export type CartografaResult = {
  pillarScores: Record<Pillar, number>;
  stats: {
    right: number;
    wrong: number;
  };
  identityCallout: string;
  readinessLabel: string;
};

export const defaultPillars: Record<Pillar, PillarState> = {
  grammar: {
    pillar: "grammar",
    currentDifficulty: 1,
    correctAtDifficulty: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    answeredIds: new Set(),
    score: 0,
    confidence: 0,
    resolved: false,
    gapNodes: [],
  },
  logic: {
    pillar: "logic",
    currentDifficulty: 1,
    correctAtDifficulty: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    answeredIds: new Set(),
    score: 0,
    confidence: 0,
    resolved: false,
    gapNodes: [],
  },
  vocab: {
    pillar: "vocab",
    currentDifficulty: 1,
    correctAtDifficulty: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    answeredIds: new Set(),
    score: 0,
    confidence: 0,
    resolved: false,
    gapNodes: [],
  },
  culture: {
    pillar: "culture",
    currentDifficulty: 1,
    correctAtDifficulty: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    answeredIds: new Set(),
    score: 0,
    confidence: 0,
    resolved: false,
    gapNodes: [],
  },
  comm: {
    pillar: "comm",
    currentDifficulty: 1,
    correctAtDifficulty: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    answeredIds: new Set(),
    score: 0,
    confidence: 0,
    resolved: false,
    gapNodes: [],
  },
};

export const selectNextQuestion = (state: CartografaState): Question | null => {
  // ...
};

export const processAnswer = (
  state: CartografaState,
  question: Question,
  answerIndex: number
): CartografaState => {
  // ...
};

export const generateResults = (state: CartografaState): CartografaResult => {
  // ...
};

export const getStageName = (stage: number): string => {
  const names = {
    1: "Básico",
    2: "Intermediário",
    3: "Avançado",
  };
  return names[stage as keyof typeof names] || "Desconhecido";
};

export const getStageDescription = (stage: number): string => {
  const descriptions = {
    1: "Habilidades fundamentais para iniciantes",
    2: "Domínio progressivo com desafios práticos",
    3: "Excelência e fluência em contextos complexos",
  };
  return descriptions[stage as keyof typeof descriptions] || "";
};

export const getReadinessLabel = (accuracy: number): string => {
  if (accuracy < 0.3) return "Iniciante";
  if (accuracy < 0.7) return "Intermediário";
  return "Avançado";
};
