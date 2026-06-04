// tests/unit/spaced-repetition.test.ts
// Unit tests for SM-2 spaced repetition algorithm

const {
  applySM2,
  getDailyReviewQueue,
} = require("../../src/palace/spaced-repetition");

describe("Spaced Repetition (SM-2)", () => {
  describe("applySM2", () => {
    it("resets on failed review (quality < 3)", () => {
      const result = applySM2(
        { easeFactor: 2.5, intervalDays: 10, repetitions: 5 },
        { quality: 1 }
      );

      expect(result.repetitions).toBe(0);
      expect(result.intervalDays).toBe(1);
      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("sets day 1 interval for first correct answer", () => {
      const result = applySM2(
        { easeFactor: 2.5, intervalDays: 0, repetitions: 0 },
        { quality: 4 }
      );

      expect(result.repetitions).toBe(1);
      expect(result.intervalDays).toBe(1);
    });

    it("sets day 6 interval for second correct answer", () => {
      const state = { easeFactor: 2.5, intervalDays: 1, repetitions: 1 };
      const result = applySM2(state, { quality: 4 });

      expect(result.repetitions).toBe(2);
      expect(result.intervalDays).toBe(6);
    });

    it("increases interval exponentially for subsequent correct answers", () => {
      const state = { easeFactor: 2.5, intervalDays: 6, repetitions: 2 };
      const result = applySM2(state, { quality: 4 });

      expect(result.repetitions).toBe(3);
      expect(result.intervalDays).toBe(15); // 6 * 2.5 = 15
    });

    it("adjusts ease factor correctly for perfect response", () => {
      const result = applySM2(
        { easeFactor: 2.5, intervalDays: 1, repetitions: 0 },
        { quality: 5 }
      );

      // Perfect response: EF' = EF + (0.1 - (5-5)*(0.08 + (5-5)*0.02)) = 2.5 + 0.1 = 2.6
      expect(result.easeFactor).toBe(2.6);
    });

    it("never drops ease factor below minimum", () => {
      const result = applySM2(
        { easeFactor: 1.3, intervalDays: 1, repetitions: 0 },
        { quality: 0 }
      );

      expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
    });

    it("marks as mastered when interval >= 180 days", () => {
      // Build up to a long interval
      const state = { easeFactor: 2.5, intervalDays: 90, repetitions: 8 };
      const result = applySM2(state, { quality: 5 });

      expect(result.intervalDays).toBeGreaterThanOrEqual(180);
      expect(result.isMastered).toBe(true);
    });

    it("sets nextReview in the future", () => {
      const result = applySM2(
        { easeFactor: 2.5, intervalDays: 0, repetitions: 0 },
        { quality: 3 }
      );

      expect(result.nextReview.getTime()).toBeGreaterThan(Date.now());
    });

    it("handles quality 2 same as failure", () => {
      const result = applySM2(
        { easeFactor: 2.5, intervalDays: 10, repetitions: 3 },
        { quality: 2 }
      );

      expect(result.repetitions).toBe(0);
      expect(result.intervalDays).toBe(1);
    });
  });

  describe("getDailyReviewQueue", () => {
    it("returns empty queue when no items are due", () => {
      const future = new Date();
      future.setDate(future.getDate() + 1);

      const items = [
        {
          id: "1",
          next_review: future.toISOString(),
          pillar: "grammar",
          title: "Test",
          content: "test",
        },
      ];

      const queue = getDailyReviewQueue(items, 7);
      expect(queue).toHaveLength(0);
    });

    it("returns items due for review", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);

      const items = [
        {
          id: "1",
          next_review: past.toISOString(),
          pillar: "grammar",
          title: "Test",
          content: "test",
        },
      ];

      const queue = getDailyReviewQueue(items, 7);
      expect(queue).toHaveLength(1);
      expect(queue[0].id).toBe("1");
    });

    it("limits queue to maxItems", () => {
      const past = new Date();
      past.setDate(past.getDate() - 1);

      const items = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        next_review: past.toISOString(),
        pillar: "grammar",
        title: `Item ${i}`,
        content: "test",
      }));

      const queue = getDailyReviewQueue(items, 5);
      expect(queue).toHaveLength(5);
    });

    it("sorts by due date (earliest first)", () => {
      const older = new Date();
      older.setDate(older.getDate() - 5);
      const newer = new Date();
      newer.setDate(newer.getDate() - 1);

      const items = [
        {
          id: "newer",
          next_review: newer.toISOString(),
          pillar: "grammar",
          title: "Newer",
          content: "test",
        },
        {
          id: "older",
          next_review: older.toISOString(),
          pillar: "grammar",
          title: "Older",
          content: "test",
        },
      ];

      const queue = getDailyReviewQueue(items, 7);
      expect(queue[0].id).toBe("older");
    });
  });
});
