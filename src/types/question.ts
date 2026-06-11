export type Pillar =
  | "grammar"
  | "vocabulary"
  | "cultural_atom"
  | "listening"
  | "speaking";

export interface Question {
  id: string;
  text: string;
  type: "multiple-choice";
  options: string[];
  correctAnswer: number;
  explanation: string;
  pillar: Pillar;
  stage: string;
}
