// Sentry error monitoring (Phase 6.4)
// Lightweight wrapper — can be replaced with real @sentry/nextjs package

// ─── TYPES ─────────────────────────────────────────────────
// Sentry error monitoring (Phase 6.4)
// Lightweight wrapper — can be replaced with real @sentry/nextjs package

// ─── TYPES ─────────────────────────────────────────────────
interface SentryConfig {
  dsn?: string;
  environment?: string;
  enabled: boolean;
}

type LogLevel = "info" | "warn" | "error" | "fatal";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  error?: Error;
}

// ─── CONFIG ────────────────────────────────────────────────
const config: SentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// ─── IN-MEMORY BUFFER ──────────────────────────────────────
let mockBuffer: LogEntry[] = [];

function captureException(error: Error, extra?: Record<string, unknown>) {
  const entry: LogEntry = {
    level: "error",
    message: error.message || "Unknown error",
    timestamp: new Date().toISOString(),
    error,
    extra,
  };
  mockBuffer.push({
    level: entry.level,
    message: entry.message,
    timestamp: entry.timestamp,
    error: entry.error,
    extra: entry.extra,
    tags: entry.tags,
  });
  if (mockBuffer.length > 100) mockBuffer.shift();
  if (config.enabled) {
    // Real Sentry integration
    // Sentry.captureException(error, { extra });
  }
  console.error("[Sentry]", error.message, extra || "");
}

function captureMessage(
  message: string,
  level: LogLevel = "info",
  tags?: Record<string, string>
) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    tags,
  };
  mockBuffer.push({
    level: entry.level,
    message: entry.message,
    timestamp: entry.timestamp,
    tags: entry.tags,
  });
  if (mockBuffer.length > 100) mockBuffer.shift();
  if (config.enabled && level === "error") {
    // Real Sentry integration
    // Sentry.captureMessage(message, level);
  }
  if (level === "error") {
    console.error("[Sentry]", message, tags || "");
  }
}

function setUser(userId: string, email?: string) {
  if (config.enabled) {
    // Real Sentry integration
    // Sentry.setUser({ id: userId, email });
  }
}

function getRecentLogs(count = 20): LogEntry[] {
  return mockBuffer.slice(-count);
}

// Reset buffer before each test
beforeEach(() => {
  mockBuffer = [];
});

function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T | { error: string }> {
  return fn().catch((error: Error) => {
    captureException(error, context);
    return { error: "Internal server error" };
  });
}

export {
  captureException,
  captureMessage,
  setUser,
  getRecentLogs,
  withErrorHandling,
};
