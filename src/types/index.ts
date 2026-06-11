export type Step = "preamble" | "email" | "quiz" | "results";
export type CartografaResult = {
  pillar_scores: {
    grammar: { score: number };
    logic: { score: number };
    vocab: { score: number };
    culture: { score: number };
    comm: { score: number };
  };
  overall_readiness: string;
  recommended_focus: string;
  identity_callout: string;
};

export type { Question } from "./question";
