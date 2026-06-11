export type Pillar = "pronunciation" | "vocabulary" | "grammar" | "culture";
export type Stage =
  | "onboarding"
  | "emerging"
  | "competent"
  | "proficient"
  | "advanced";

export interface PillarState {
  correct: boolean;
  updated: boolean;
  history: AnswerHistory[];
}

export type AnswerHistory = {
  questionId: string;
  answerIndex: number;
  correct: boolean;
  timestamp: string;
};

export type HistoryEntry = {
  pillar: Pillar;
  stage: Stage;
  questionId: string;
  answerIndex: number;
  correct: boolean;
  timestamp: string;
};

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice";
  options: string[];
  correctAnswer: number;
  explanation: string;
  pillar: Pillar;
  stage: Stage;
}

export type CartografaState = {
  pillars: Record<Pillar, PillarState>;
  currentPillar: Pillar;
  currentStage: Stage;
  questions: Question[];
  currentQuestion: Question | null;
  history: HistoryEntry[];
};

export interface Step {
  explanation: string;
  action: string;
}

export interface CartografaResult {
  pillars: Record<Pillar, number>;
  readiness: Record<Pillar, string>;
  steps: Step[];
}

export const selectNextQuestion = (state: CartografaState): Question | null => {
  const unanswered = state.questions.filter(
    (q) => !state.history.some((h) => h.questionId === q.id)
  );
  return unanswered.length > 0 ? unanswered[0] : null;
};

export const generateResults = (state: CartografaState): CartografaResult => {
  const pillars: Record<Pillar, number> = {
    pronunciation: 0,
    vocabulary: 0,
    grammar: 0,
    culture: 0,
  };

  const readiness: Record<Pillar, string> = {
    pronunciation: "unassessed",
    vocabulary: "unassessed",
    grammar: "unassessed",
    culture: "unassessed",
  };

  const steps: Step[] = [];

  // Calculate scores per pillar
  (Object.keys(pillars) as Pillar[]).forEach((pillar) => {
    const pillarQuestions = state.questions.filter((q) => q.pillar === pillar);
    if (pillarQuestions.length === 0) return;

    const correctAnswers = state.history.filter(
      (h) => h.pillar === pillar && h.correct
    ).length;
    pillars[pillar] = (correctAnswers / pillarQuestions.length) * 100;

    // Determine readiness
    if (pillars[pillar] >= 80) {
      readiness[pillar] = "advanced";
    } else if (pillars[pillar] >= 60) {
      readiness[pillar] = "proficient";
    } else if (pillars[pillar] >= 40) {
      readiness[pillar] = "competent";
    } else if (pillars[pillar] >= 20) {
      readiness[pillar] = "emerging";
    } else {
      readiness[pillar] = "onboarding";
    }
  });

  return { pillars, readiness, steps };
};

export const generateSessionId = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const processAnswer = (
  state: CartografaState,
  question: Question,
  answerIndex: number
): CartografaState => {
  const correct = answerIndex === question.correctAnswer;
  const updatedHistory = [
    ...state.history,
    {
      pillar: question.pillar,
      stage: question.stage,
      questionId: question.id,
      answerIndex,
      correct,
      timestamp: new Date().toISOString(),
    },
  ];

  return {
    ...state,
    history: updatedHistory,
    currentQuestion: selectNextQuestion({ ...state, history: updatedHistory }),
  };
};
