// src/lexio-mind/llm-client.ts
// Multi-tier LLM client with OpenRouter (NVIDIA NIM) + fallbacks (Phase 5.1)
// Used by: Cartografa scoring, lesson generation, conversation shadow

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "nvidia/qwen3-14b-instruct";

interface LLMResponse {
  content: string;
  model: string;
  latencyMs: number;
}

interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LLMConfig {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

// ─── OPENROUTER (NVIDIA NIM) ───────────────────────────────
async function callOpenRouter(
  messages: LLMMessage[],
  config: LLMConfig = {}
): Promise<LLMResponse> {
  const start = Date.now();
  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    },
    body: JSON.stringify({
      model: config.model || OPENROUTER_MODEL,
      messages,
      temperature: config.temperature ?? 0.3,
      max_tokens: config.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter ${response.status}: ${text}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    model: data.model,
    latencyMs: Date.now() - start,
  };
}

// ─── MOCK (development fallback) ────────────────────────────
function callMock(messages: LLMMessage[]): LLMResponse {
  const lastMsg = messages[messages.length - 1]?.content || "";
  return {
    content: JSON.stringify({
      mock: true,
      response: `[Mock AI] Processed: "${lastMsg.slice(0, 60)}..."`,
    }),
    model: "mock",
    latencyMs: 0,
  };
}

// ─── PUBLIC API ────────────────────────────────────────────
export async function callLLM(
  messages: LLMMessage[],
  config: LLMConfig = {}
): Promise<LLMResponse> {
  // Tier 1: OpenRouter NVIDIA NIM
  if (process.env.OPENROUTER_API_KEY) {
    try {
      return await callOpenRouter(messages, config);
    } catch (err) {
      console.warn("OpenRouter failed, falling back:", err);
    }
  }

  // Tier 2: Mock for development
  return callMock(messages);
}

// ─── STRUCTURED JSON HELPERS ───────────────────────────────
export function extractJson<T>(raw: string): T | null {
  try {
    // Try direct parse first
    return JSON.parse(raw) as T;
  } catch {
    // Try to extract JSON from markdown code block
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
      try {
        return JSON.parse(match[1]) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export type { LLMMessage, LLMResponse, LLMConfig };
