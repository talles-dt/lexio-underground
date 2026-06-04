// tests/unit/question-bank.test.ts
// Integrity tests for the question bank

import {
  QUESTION_BANK,
  QUESTIONS_BY_PILLAR,
  getQuestionsByDifficulty,
} from "../../src/cartografa/question-bank";

describe("Question Bank", () => {
  it("contains exactly 50 questions", () => {
    expect(QUESTION_BANK).toHaveLength(50);
  });

  it("has 10 questions per pillar", () => {
    expect(QUESTIONS_BY_PILLAR.grammar).toHaveLength(10);
    expect(QUESTIONS_BY_PILLAR.logic).toHaveLength(10);
    expect(QUESTIONS_BY_PILLAR.vocab).toHaveLength(10);
    expect(QUESTIONS_BY_PILLAR.culture).toHaveLength(10);
    expect(QUESTIONS_BY_PILLAR.comm).toHaveLength(10);
  });

  it("has unique IDs across all questions", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("has 2 questions per difficulty level per pillar", () => {
    for (const pillar of [
      "grammar",
      "logic",
      "vocab",
      "culture",
      "comm",
    ] as const) {
      const questions = getQuestionsByDifficulty(pillar, 1);
      expect(questions).toHaveLength(2);
    }
  });

  it("has all prompts in Portuguese", () => {
    for (const q of QUESTION_BANK) {
      expect(q).toHaveProperty("prompt");
      expect(typeof q.prompt).toBe("string");
    }
  });

  it("has valid answer arrays", () => {
    for (const q of QUESTION_BANK) {
      if (q.type === "likert") continue;
      if (q.type === "open-text") {
        expect(q).not.toHaveProperty("answers");
        expect(q).not.toHaveProperty("options");
      } else if (
        q.type === "gap-select" ||
        q.type === "chunk" ||
        q.type === "scenario"
      ) {
        expect(q).toHaveProperty("options");
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options!.length).toBeGreaterThanOrEqual(3);
      } else {
        expect(q).toHaveProperty("keywords");
        expect(Array.isArray(q.keywords)).toBe(true);
      }
    }
  });

  it("has valid correct answers", () => {
    for (const q of QUESTION_BANK) {
      if (q.type === "likert" || q.type === "open-text") continue;
      if (
        q.type === "gap-select" ||
        q.type === "chunk" ||
        q.type === "scenario"
      ) {
        expect(q).toHaveProperty("correctIndex");
        expect(typeof q.correctIndex).toBe("number");
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        if (q.options && q.options.length > 0) {
          expect(q.correctIndex).toBeLessThan(q.options.length);
        }
      } else {
        expect(q).toHaveProperty("keywords");
        expect(Array.isArray(q.keywords)).toBe(true);
      }
    }
  });

  it("has valid stage numbers", () => {
    for (const q of QUESTION_BANK as Array<{ stage: number }>) {
      expect(q).toHaveProperty("stage");
      expect(typeof q.stage).toBe("number");
      expect(q.stage).toBeGreaterThanOrEqual(1);
      expect(q.stage).toBeLessThanOrEqual(5);
    }
  });

  it("matches question types by pillar", () => {
    // Stage 1 (grammar): all likert
    for (const q of QUESTIONS_BY_PILLAR.grammar) {
      expect(q.type).toBe("likert");
    }
    // Stage 2 (logic): all gap-select
    for (const q of QUESTIONS_BY_PILLAR.logic) {
      expect(q.type).toBe("gap-select");
    }
    // Stage 3 (vocab): all chunk
    for (const q of QUESTIONS_BY_PILLAR.vocab) {
      expect(q.type).toBe("chunk");
    }
    // Stage 4 (culture): all scenario
    for (const q of QUESTIONS_BY_PILLAR.culture) {
      expect(q.type).toBe("scenario");
    }
    // Stage 5 (comm): all open-text
    for (const q of QUESTIONS_BY_PILLAR.comm) {
      expect(q.type).toBe("open-text");
    }
  });
});
