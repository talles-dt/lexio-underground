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
      for (let diff = 1; diff <= 5; diff++) {
        const questions = getQuestionsByDifficulty(pillar, diff);
        expect(questions).toHaveLength(2);
      }
    }
  });

  it("has all prompts in Portuguese", () => {
    for (const q of QUESTION_BANK) {
      expect(q.prompt).toBeTruthy();
      expect(typeof q.prompt).toBe("string");
    }
  });

  it("has whyExplanation for all questions", () => {
    for (const q of QUESTION_BANK) {
      expect(q.whyExplanation).toBeTruthy();
      expect(q.whyExplanation.length).toBeGreaterThan(10);
    }
  });

  it("correctly assigns stages", () => {
    for (const q of QUESTION_BANK) {
      expect(q.stage).toBeGreaterThanOrEqual(1);
      expect(q.stage).toBeLessThanOrEqual(5);
    }
  });

  it("has correct types per stage", () => {
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

  it("has valid options for select-type questions (gap-select, chunk, scenario)", () => {
    const selectQuestions = QUESTION_BANK.filter(
      (q) =>
        q.type === "gap-select" || q.type === "chunk" || q.type === "scenario",
    );
    expect(selectQuestions.length).toBeGreaterThan(0);
    for (const q of selectQuestions) {
      expect(q.options).toBeDefined();
      expect(q.options!.length).toBeGreaterThanOrEqual(3);
      expect(q.correctIndex).toBeDefined();
      expect(q.correctIndex!).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex!).toBeLessThan(q.options!.length);
    }
  });

  it("has all likert questions without options array", () => {
    for (const q of QUESTIONS_BY_PILLAR.grammar) {
      expect(q.type).toBe("likert");
      expect(q.options).toBeUndefined();
      expect(q.correctIndex).toBeUndefined();
    }
  });
});
