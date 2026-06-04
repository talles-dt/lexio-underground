// src/types/question.ts
// Type definition for Lexio Underground questions

import type { Pillar } from "./index";

export type Stage = "roots" | "sprouts" | "branches" | "canopy" | "underground";

interface Question {
  id: string;
  text: string;
  type: "multiple-choice";
  options: string[];
  answers?: number[];
  correctAnswer: number;
  explanation: string;
  pillar: Pillar;
  stage: Stage;
}
