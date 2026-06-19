// src/lib/ai.ts
// OpenRouter AI integration for Lexio Underground
// Handles content generation, research, and agentic capabilities

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ─── Core AI Client ────────────────────────────────────────────

async function callOpenRouter(
  messages: AIMessage[],
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<AIResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not configured");
  }

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "https://lexio-underground.vercel.app",
      "X-Title": "Lexio Underground",
    },
    body: JSON.stringify({
      model: options.model || "openrouter/owl-alpha",
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${response.status} — ${error}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || "",
    model: data.model,
    usage: data.usage,
  };
}

// ─── Content Generation ────────────────────────────────────────

export async function generateCulturalAtom(pillar: string, difficulty: number, language: string = "en"): Promise<{
  title: string;
  content: string;
  example: string;
  explanation: string;
}> {
  const response = await callOpenRouter([
    {
      role: "system",
      content: `You are a language learning content generator for Lexio Underground. Generate a cultural atom — a bite-sized piece of language insight that reveals something about how the language works culturally, not just grammatically.

Target language: ${language}
Pillar: ${pillar} (grammar/logic/vocab/culture/comm)
Difficulty: ${difficulty} (1-5, where 1 is beginner and 5 is advanced)

Output valid JSON only:
{"title": "short catchy title", "content": "the main insight (2-3 sentences)", "example": "a concrete example", "explanation": "why this matters for learners (1-2 sentences)"}`,
    },
    {
      role: "user",
      content: `Generate a ${pillar}-pillar cultural atom at difficulty ${difficulty} for ${language} learners.`,
    },
  ], { temperature: 0.8, max_tokens: 512 });

  return JSON.parse(response.content);
}

export async function generateConversationResponse(
  targetLanguage: string,
  learnerLevel: string,
  conversationHistory: { role: "learner" | "shadow"; text: string }[],
  nativeLanguage: string = "pt"
): Promise<string> {
  const historyText = conversationHistory
    .map((m) => `${m.role === "learner" ? "Learner" : "Shadow"}: ${m.text}`)
    .join("\n");

  const response = await callOpenRouter([
    {
      role: "system",
      content: `You are an AI Conversation Shadow for language learning. Your role:
- Respond ONLY in ${targetLanguage}
- Model natural, fluent, comprehensible ${targetLanguage}
- NEVER correct the learner's mistakes
- NEVER say "actually, it should be..." or "the correct way is..."
- Keep responses short (1-3 sentences) and at the learner's level (${learnerLevel})
- Reference prior conversation naturally
- If the learner writes in ${nativeLanguage}, gently model the ${targetLanguage} equivalent without explicit correction
- Maintain a warm, encouraging tone

Learner's native language: ${nativeLanguage}
Target language: ${targetLanguage}
Level: ${learnerLevel}`,
    },
    {
      role: "user",
      content: `Conversation history:\n${historyText}\n\nRespond as the Shadow in ${targetLanguage}:`,
    },
  ], { temperature: 0.7, max_tokens: 256 });

  return response.content;
}

export async function generateResearchSummary(topic: string, language: string = "en"): Promise<{
  summary: string;
  keyPoints: string[];
  relatedTopics: string[];
}> {
  const response = await callOpenRouter([
    {
      role: "system",
      content: `You are a research assistant for language learning. Given a topic, produce a concise research summary with key points and related topics. Output valid JSON only:
{"summary": "2-3 sentence summary", "keyPoints": ["point 1", "point 2", "point 3"], "relatedTopics": ["topic 1", "topic 2"]}`,
    },
    {
      role: "user",
      content: `Research topic: ${topic}\nLanguage context: ${language}`,
    },
  ], { temperature: 0.5, max_tokens: 1024 });

  return JSON.parse(response.content);
}

// ─── Agentic Capabilities ──────────────────────────────────────

export async function runAgentTask(
  task: string,
  context: Record<string, unknown> = {}
): Promise<string> {
  const response = await callOpenRouter([
    {
      role: "system",
      content: `You are an autonomous agent for Lexio Underground. You can:
- Generate and modify learning content
- Analyze learner data and provide insights
- Create study plans and roadmaps
- Research language learning topics
- Generate quiz questions and explanations

Given a task and context, execute it and return the result. Be thorough and specific.`,
    },
    {
      role: "user",
      content: `Task: ${task}\n\nContext: ${JSON.stringify(context, null, 2)}`,
    },
  ], { temperature: 0.7, max_tokens: 4096 });

  return response.content;
}

// ─── Cartografa AI Scoring (LexioMind-lite) ───────────────────

export async function scoreOpenTextResponse(
  question: string,
  response: string,
  pillar: string,
  difficulty: number
): Promise<{
  score: number; // 0-1
  feedback: string;
  gaps: string[];
}> {
  const aiResponse = await callOpenRouter([
    {
      role: "system",
      content: `You are an AI language assessor for Lexio Underground's Cartografa diagnostic. Score a learner's open-text response.

Pillar: ${pillar}
Difficulty: ${difficulty} (1-5)

Score from 0.0 to 1.0 based on:
- Accuracy (grammar, vocabulary)
- Fluency (naturalness, flow)
- Completeness (did they address the prompt?)

Output valid JSON only:
{"score": 0.0-1.0, "feedback": "brief encouraging feedback (1 sentence)", "gaps": ["specific area to improve 1", "area 2"]}

Be encouraging — this is a diagnostic, not a test. Focus on what they CAN do.`,
    },
    {
      role: "user",
      content: `Question: ${question}\n\nLearner response: ${response}`,
    },
  ], { temperature: 0.3, max_tokens: 256 });

  return JSON.parse(aiResponse.content);
}
