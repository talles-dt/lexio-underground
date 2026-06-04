export type Pillar =
  | "mushin"
  | "kobo"
  | "ki"
  | "rei"
  | "zanshin"
  | "yomi"
  | "maai";

export type MaturityStage =
  | "roots"
  | "sprouts"
  | "branches"
  | "canopy"
  | "underground";

export type LearnerProfile = {
  streak: number;
  maturityStage: MaturityStage;
  completedLessons: string[];
};

export type DiagnosticQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export type PillarScores = {
  [pillar: string]: number;
};

export type MapNode = {
  id: string;
  pillar: string;
  score: number;
  isMastered: boolean;
};

export type PreambleProps = {
  onPress: () => void;
  onBeginCartografa?: () => void;
};
