// src/lib/sentry.ts
// Sentry error monitoring (Phase 6.4)
// Lightweight wrapper — can be replaced with real @sentry/nextjs package

interface SentryConfig {
  dsn?: string;
  environment?: string;
  enabled: boolean;
}

const config: SentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
};

// ─── LOG LEVELS ─────────────────────────────────────────────
type LogLevel = "info" | "warn" | "error" | "fatal";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  error?: Error;
}

// ─── IN-MEMORY BUFFER ──────────────────────────────────────
const buffer: LogEntry[] = [];
const MAX_BUFFER = 100;

function addToBuffer(entry: LogEntry) {
  buffer.push(entry);
  if (buffer.length > MAX_BUFFER) {
    buffer.shift();
  }
}

// ─── CAPTURE ───────────────────────────────────────────────
export function captureException(
  error: Error,
  context?: Record<string, unknown>,
) {
  const entry: LogEntry = {
    level: "error",
    message: error.message || "Unknown error",
    timestamp: new Date().toISOString(),
    error,
    extra: context,
  };

  addToBuffer(entry);

  if (config.enabled) {
    // Real Sentry integration
    // Sentry.captureException(error, { extra: context });
  }

  console.error("[Sentry]", error.message, context || "");
}

export function captureMessage(
  message: string,
  level: LogLevel = "info",
  tags?: Record<string, string>,
) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    tags,
  };

  addToBuffer(entry);

  if (config.enabled && level === "error") {
    // Real Sentry integration
    // Sentry.captureMessage(message, level);
  }

  if (level === "error") {
    console.error("[Sentry]", message, tags || "");
  }
}

// ─── SET USER CONTEXT ──────────────────────────────────────
export function setUser(userId: string, email?: string) {
  if (config.enabled) {
    // Real Sentry integration
    // Sentry.setUser({ id: userId, email });
  }
}

// ─── GET BUFFER (for debugging / diagnostic endpoint) ──────
export function getRecentLogs(count = 20): LogEntry[] {
  return buffer.slice(-count);
}

// ─── WRAPPER FOR API ROUTES ────────────────────────────────
export function withErrorHandling<T>(
  fn: () => Promise<T>,
  context?: Record<string, unknown>,
): Promise<T | { error: string }> {
  return fn().catch((error: Error) => {
    captureException(error, context);
    return { error: "Internal server error" };
  });
}