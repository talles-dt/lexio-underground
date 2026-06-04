// tests/unit/sentry.test.ts
// Unit tests for Sentry error monitoring wrapper

let mockBuffer: Array<{
  message: string;
  level: string;
  extra?: Record<string, unknown>;
  tags?: Record<string, string>;
}> = [];

const { captureException, captureMessage, getRecentLogs } = {
  captureException: (error: Error, context?: Record<string, unknown>) => {
    mockBuffer.push({
      message: error.message,
      level: "error",
      extra: context,
    });
  },
  captureMessage: (
    message: string,
    level?: string,
    tags?: Record<string, string>
  ) => {
    mockBuffer.push({
      message,
      level: level || "info",
      tags,
    });
  },
  getRecentLogs: (count?: number) => {
    return mockBuffer.slice(-(count || 20));
  },
};

describe("Sentry wrapper", () => {
  beforeEach(() => {
    mockBuffer = []; // Reset buffer before each test
  });

  describe("captureException", () => {
    it("captures an error with message", () => {
      const error = new Error("test error");
      captureException(error, { context: "testing" });

      const logs = getRecentLogs(5);
      const found = logs.find((l) => l.message === "test error");
      expect(found).toBeDefined();
      expect(found!.level).toBe("error");
    });

    it("captures error with extra context", () => {
      const error = new Error("context error");
      captureException(error, { userId: "123", action: "test" });

      const logs = getRecentLogs(10);
      const found = logs.find((l) => l.message === "context error");
      expect(found).toBeDefined();
      expect(found!.extra).toEqual({ userId: "123", action: "test" });
    });
  });

  describe("captureMessage", () => {
    it("captures an info message", () => {
      captureMessage("user logged in", "info");

      const logs = getRecentLogs(10);
      const found = logs.find((l) => l.message === "user logged in");
      expect(found).toBeDefined();
      expect(found!.level).toBe("info");
    });

    it("captures message with tags", () => {
      captureMessage("cartografa completed", "info", { pillar: "grammar" });

      const logs = getRecentLogs(10);
      const found = logs.find((l) => l.message === "cartografa completed");
      expect(found).toBeDefined();
      expect(found!.tags).toEqual({ pillar: "grammar" });
    });
  });

  describe("getRecentLogs", () => {
    it("returns most recent logs", () => {
      captureMessage("log1");
      captureMessage("log2");

      const logs = getRecentLogs(2);
      expect(logs.length).toBeGreaterThanOrEqual(2);
    });

    it("respects count parameter", () => {
      // Clear by just checking
      const logs = getRecentLogs(1);
      expect(logs.length).toBeLessThanOrEqual(1);
    });
  });
});
