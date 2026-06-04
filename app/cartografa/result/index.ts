export type {
  CartografaState,
  CartografaResult,
  AnswerRecord,
  Pillar,
  PillarState,
} from "@/cartografa/adaptive-engine";
export {
  createInitialState,
  selectNextQuestion,
  processAnswer,
  generateResults,
  getStageName,
  getStageDescription,
  getReadinessLabel,
} from "@/cartografa/adaptive-engine";
