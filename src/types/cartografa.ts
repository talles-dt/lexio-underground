export type CartografaState = any;
export type AnswerRecord = any;
export type PulseItem = {
  id: string;
  next_review: string;
  pillar: string;
  title: string;
  content: string;
  explanation?: string;
  itemType: "word" | "chunk" | "cultural_atom";
  icon: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
};
