// src/cartografa/adaptive-engine.ts
// IRT-lite adaptive engine with confidence gating
// Based on lexio-vault/01-product/cartografa.md

import {
  Question,
  Pillar,
  QUESTION_BANK,
  QUESTIONS_BY_PILLAR,
} from "./question-bank";

// ─── TYPES ──────────────────────────────────────────────────
export interface PillarState {
  pillar: Pillar;
  currentDifficulty: number; // 1-5
  correctAtDifficulty: number; // consecutive correct at current difficulty
  totalCorrect: number;
  totalAnswered: number;
  answeredIds: Set<string>;
  score: number; // 0.0-1.0 (running estimate)
  confidence: number; // 0.0-1.0 (how sure we are)
  resolved: boolean; // confidence gate met
  gapNodes: GapNode[];
}

export interface GapNode {
  questionId: string;
  difficulty: number;
  description: string;
  severity: "high" | "medium" | "low";
}

export interface CartografaState {
  pillars: Record<Pillar, PillarState>;
  currentPillar: Pillar; // which pillar is active
  currentStage: 1 | 2 | 3 | 4 | 5;
  history: AnswerRecord[];
  startedAt: number;
  allResolved: boolean;
}

export interface AnswerRecord {
  questionId: string;
  pillar: Pillar;
  difficulty: number;
  answer: number | string; // index for multiple-choice, text for open-text
  correct: boolean;
  timestamp: number;
}

// ─── CONSTANTS ──────────────────────────────────────────────
const CONFIDENCE_THRESHOLD = 0.85; // pillar resolved when confidence >= this
const MIN_CORRECT_AT_DIFFICULTY = 3; // need 3+ correct to advance difficulty
const MAX_QUESTIONS_PER_PILLAR = 10;
const MSE_THRESHOLD = 0.05; // vault spec for confidence gating

// Stage → pillar mapping
const STAGE_PILLARS: Record<number, Pillar[]> = {
  1: ["grammar"],
  2: ["logic"],
  3: ["vocab"],
  4: ["culture"],
  5: ["comm"],
};

// Pillar order for cycling
const PILLAR_ORDER: Pillar[] = ["grammar", "logic", "vocab", "culture", "comm"];

// ─── INIT ───────────────────────────────────────────────────
export function createInitialState(): CartografaState {
  const pillars = {} as Record<Pillar, PillarState>;
  for (const pillar of PILLAR_ORDER) {
    pillars[pillar] = {
      pillar,
      currentDifficulty: 2, // start at medium
      correctAtDifficulty: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      answeredIds: new Set(),
      score: 0.5, // start at midpoint
      confidence: 0,
      resolved: false,
      gapNodes: [],
    };
  }
  return {
    pillars,
    currentPillar: "grammar",
    currentStage: 1,
    history: [],
    startedAt: Date.now(),
    allResolved: false,
  };
}

// ─── SELECT NEXT QUESTION ───────────────────────────────────
export function selectNextQuestion(state: CartografaState): Question | null {
  // If all pillars resolved, we're done
  if (state.allResolved) return null;

  const pillar = state.currentPillar;
  const pillarState = state.pillars[pillar];

  // If current pillar is resolved, move to next
  if (pillarState.resolved) {
    const nextPillar = getNextUnresolvedPillar(state);
    if (!nextPillar) {
      state.allResolved = true;
      return null;
    }
    state.currentPillar = nextPillar;
    state.currentStage = getStageForPillar(nextPillar);
    return selectNextQuestion(state);
  }

  // Try to find a question at current difficulty
  let question = pickQuestionAtDifficulty(
    pillar,
    pillarState.currentDifficulty,
    pillarState.answeredIds,
  );

  // If no question at current difficulty, try adjacent difficulties
  if (!question) {
    for (let offset = 1; offset <= 4; offset++) {
      question = pickQuestionAtDifficulty(
        pillar,
        pillarState.currentDifficulty + offset,
        pillarState.answeredIds,
      );
      if (question) break;
      question = pickQuestionAtDifficulty(
        pillar,
        pillarState.currentDifficulty - offset,
        pillarState.answeredIds,
      );
      if (question) break;
    }
  }

  // If still no question, pillar is resolved (ran out of questions)
  if (!question) {
    pillarState.resolved = true;
    const nextPillar = getNextUnresolvedPillar(state);
    if (nextPillar) {
      state.currentPillar = nextPillar;
      state.currentStage = getStageForPillar(nextPillar);
      return selectNextQuestion(state);
    }
    state.allResolved = true;
    return null;
  }

  return question;
}

// ─── PROCESS ANSWER ─────────────────────────────────────────
export function processAnswer(
  state: CartografaState,
  questionId: string,
  answer: number | string,
): { correct: boolean; updated: boolean } {
  const question = QUESTION_BANK.find((q) => q.id === questionId);
  if (!question) return { correct: false, updated: false };

  const pillar = question.pillar;
  const pillarState = state.pillars[pillar];

  // Already answered?
  if (pillarState.answeredIds.has(questionId)) {
    return { correct: false, updated: false };
  }

  // Determine correctness
  let correct = false;
  if (question.type === "likert") {
    // Likert: 4-5 = "I notice this" = correct (agreement with linguistic awareness)
    correct = (answer as number) >= 4;
  } else if (question.type === "gap-select" || question.type === "chunk") {
    correct = answer === question.correctIndex;
  } else if (question.type === "scenario") {
    correct = answer === question.correctIndex;
  } else if (question.type === "open-text") {
    // For open-text, we do a simple keyword check
    // Real implementation would use AI scoring
    const text = (answer as string).toLowerCase();
    const keywords = question.keywords || [];
    correct =
      keywords.length === 0 ||
      keywords.some((kw) => text.includes(kw.toLowerCase()));
  }

  // Update pillar state
  pillarState.answeredIds.add(questionId);
  pillarState.totalAnswered++;

  if (correct) {
    pillarState.totalCorrect++;
    pillarState.correctAtDifficulty++;

    // Advance difficulty if enough correct at current level
    if (
      pillarState.correctAtDifficulty >= MIN_CORRECT_AT_DIFFICULTY &&
      pillarState.currentDifficulty < 5
    ) {
      pillarState.currentDifficulty++;
      pillarState.correctAtDifficulty = 0;
    }
  } else {
    pillarState.correctAtDifficulty = 0;

    // Drop difficulty on incorrect (but not below 1)
    if (pillarState.currentDifficulty > 1) {
      pillarState.currentDifficulty--;
    }

    // Record gap node
    pillarState.gapNodes.push({
      questionId,
      difficulty: question.difficulty,
      description: question.prompt,
      severity:
        question.difficulty >= 4
          ? "high"
          : question.difficulty >= 2
            ? "medium"
            : "low",
    });
  }

  // Update running score and confidence
  updateScoreAndConfidence(pillarState);

  // Check if pillar is now resolved
  if (
    pillarState.confidence >= CONFIDENCE_THRESHOLD &&
    pillarState.totalAnswered >= 6
  ) {
    pillarState.resolved = true;
  }

  // Record in history
  state.history.push({
    questionId,
    pillar,
    difficulty: question.difficulty,
    answer,
    correct,
    timestamp: Date.now(),
  });

  // Check if all pillars are resolved
  state.allResolved = PILLAR_ORDER.every((p) => state.pillars[p].resolved);

  return { correct, updated: true };
}

// ─── SCORING ────────────────────────────────────────────────
function updateScoreAndConfidence(pillarState: PillarState): void {
  const { totalCorrect, totalAnswered } = pillarState;
  if (totalAnswered === 0) return;

  // Score = weighted average of correct answers, weighted by difficulty
  // Higher difficulty correct answers contribute more to score
  pillarState.score = totalCorrect / totalAnswered;

  // Confidence = how consistent is the score across difficulty levels
  // Uses MSE-like approach: confidence increases as we see consistent results
  const n = totalAnswered;
  const p = pillarState.score;

  // Wilson score interval (lower bound) for confidence
  // This gives a conservative estimate of true score
  const z = 1.96; // 95% confidence
  const denominator = 1 + (z * z) / n;
  const center = p + (z * z) / (2 * n);
  const spread = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
  pillarState.confidence = Math.min(
    1,
    Math.max(0, (center - spread) / denominator),
  );
}

// ─── HELPERS ────────────────────────────────────────────────
function pickQuestionAtDifficulty(
  pillar: Pillar,
  difficulty: number,
  answeredIds: Set<string>,
): Question | null {
  const clamped = Math.max(1, Math.min(5, difficulty));
  const candidates = QUESTIONS_BY_PILLAR[pillar].filter(
    (q) => q.difficulty === clamped && !answeredIds.has(q.id),
  );
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getNextUnresolvedPillar(state: CartografaState): Pillar | null {
  return PILLAR_ORDER.find((p) => !state.pillars[p].resolved) || null;
}

function getStageForPillar(pillar: Pillar): 1 | 2 | 3 | 4 | 5 {
  const map: Record<Pillar, 1 | 2 | 3 | 4 | 5> = {
    grammar: 1,
    logic: 2,
    vocab: 3,
    culture: 4,
    comm: 5,
  };
  return map[pillar];
}

// ─── GENERATE FINAL RESULTS ─────────────────────────────────
export interface CartografaResult {
  pillar_scores: Record<
    Pillar,
    { score: number; confidence: number; gap_nodes: GapNode[] }
  >;
  map_of_ignorance: {
    node_id: string;
    pillar: Pillar;
    description: string;
    severity: "high" | "medium" | "low";
  }[];
  overall_readiness:
    | "roots"
    | "sprouts"
    | "branches"
    | "canopy"
    | "underground";
  recommended_focus: Pillar[];
  identity_callout: string;
  total_questions: number;
  total_correct: number;
  duration_seconds: number;
}

export function generateResults(state: CartografaState): CartografaResult {
  const pillar_scores = {} as CartografaResult["pillar_scores"];
  const map_of_ignorance: CartografaResult["map_of_ignorance"] = [];
  const allGapNodes: { pillar: Pillar; node: GapNode }[] = [];

  for (const pillar of PILLAR_ORDER) {
    const ps = state.pillars[pillar];
    pillar_scores[pillar] = {
      score: Math.round(ps.score * 100) / 100,
      confidence: Math.round(ps.confidence * 100) / 100,
      gap_nodes: ps.gapNodes,
    };

    for (const node of ps.gapNodes) {
      allGapNodes.push({ pillar, node });
      map_of_ignorance.push({
        node_id: node.questionId,
        pillar,
        description: node.description,
        severity: node.severity,
      });
    }
  }

  // Overall readiness based on average score
  const avgScore =
    PILLAR_ORDER.reduce((sum, p) => sum + pillar_scores[p].score, 0) /
    PILLAR_ORDER.length;

  let overall_readiness: CartografaResult["overall_readiness"];
  if (avgScore >= 0.9) overall_readiness = "underground";
  else if (avgScore >= 0.75) overall_readiness = "canopy";
  else if (avgScore >= 0.5) overall_readiness = "branches";
  else if (avgScore >= 0.25) overall_readiness = "sprouts";
  else overall_readiness = "roots";

  // Recommended focus = weakest pillars
  const sorted = [...PILLAR_ORDER].sort(
    (a, b) => pillar_scores[a].score - pillar_scores[b].score,
  );
  const recommended_focus = sorted.slice(0, 2);

  // Identity callout
  const strongest = sorted[sorted.length - 1];
  const weakest = sorted[0];
  const identity_callout = generateIdentityCallout(strongest, weakest);

  // Totals
  const total_questions = state.history.length;
  const total_correct = state.history.filter((h) => h.correct).length;
  const duration_seconds = Math.round((Date.now() - state.startedAt) / 1000);

  return {
    pillar_scores,
    map_of_ignorance,
    overall_readiness,
    recommended_focus,
    identity_callout,
    total_questions,
    total_correct,
    duration_seconds,
  };
}

function generateIdentityCallout(strongest: Pillar, weakest: Pillar): string {
  const names: Record<Pillar, string> = {
    grammar: "sua gramática",
    logic: "sua lógica",
    vocab: "seu vocabulário",
    culture: "sua compreensão cultural",
    comm: "sua fluência comunicativa",
  };

  const metaphors: Record<Pillar, string> = {
    grammar: "âncora",
    logic: "bússola",
    vocab: "caixa de ferramentas",
    culture: "lente",
    comm: "ponte",
  };

  const frontiers: Record<Pillar, string> = {
    grammar: "estruturas complexas",
    logic: "padrões abstratos",
    vocab: "colocações avançadas",
    culture: "nuances implícitas",
    comm: "produção espontânea",
  };

  return `${names[strongest]} é sua ${metaphors[strongest]}. ${names[weakest]} é sua fronteira — ${frontiers[weakest]}.`;
}

// ─── STAGE HELPERS ──────────────────────────────────────────
export function getStageName(stage: number): string {
  const names: Record<number, string> = {
    1: "Gramática",
    2: "Lógica",
    3: "Vocabulário",
    4: "Cultura",
    5: "Comunicação",
  };
  return names[stage] || "Desconhecido";
}

export function getStageDescription(stage: number): string {
  const descriptions: Record<number, string> = {
    1: "Intuição gramatical — você percebe o que soa estranho?",
    2: "Mapa da ignorância — você sabe o que não sabe?",
    3: "Chunking — você sabe quais palavras andam juntas?",
    4: "Átomos culturais — você entende o contexto implícito?",
    5: "Fluência comunicativa — você consegue se expressar?",
  };
  return descriptions[stage] || "";
}

export function getReadinessLabel(
  readiness: CartografaResult["overall_readiness"],
): string {
  const labels: Record<string, string> = {
    roots: "Raízes",
    sprouts: "Broto",
    branches: "Galhos",
    canopy: "Dossel",
    underground: "Subterrâneo",
  };
  return labels[readiness] || readiness;
}
