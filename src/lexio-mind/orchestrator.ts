// src/lexio-mind/orchestrator.ts
// LexioMind v1 — AI orchestrator for Cartografa scoring, lesson gen, conversation (Phase 5.2)
// Uses the multi-tier LLM client with NVIDIA NIM via OpenRouter

import { callLLM, extractJson, LLMMessage } from "./llm-client";
import type { Question } from "@/cartografa/question-bank";

// ─── CARTOGRAFA OPEN-TEXT SCORING ──────────────────────────
export interface ScoredOpenAnswer {
  score: number; // 0.0–1.0
  confidence: number; // 0.0–1.0
  feedback: string; // PT-BR feedback
  keywordsFound: string[];
  keywordsMissing: string[];
  grammarIssues: string[];
}

export async function scoreOpenAnswer(
  question: Question,
  answer: string
): Promise<ScoredOpenAnswer> {
  const systemPrompt = `Você é o LexioMind, um avaliador de proficiência em inglês para brasileiros.
Avalie a resposta do aluno para a pergunta: "${question.prompt}".
As palavras-chave esperadas são: ${(question.keywords || []).join(", ")}.
Responda APENAS com JSON no formato:
{
  "score": 0.0-1.0,
  "confidence": 0.0-1.0,
  "feedback": "feedback em português",
  "keywordsFound": ["palavras-chave encontradas"],
  "keywordsMissing": ["palavras-chave ausentes"],
  "grammarIssues": ["problemas gramaticais identificados"]
}`;

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: answer },
  ];

  const response = await callLLM(messages, {
    temperature: 0.2,
    maxTokens: 512,
  });
  const parsed = extractJson<ScoredOpenAnswer>(response.content);

  if (parsed && typeof parsed.score === "number") {
    return {
      ...parsed,
      score: Math.max(0, Math.min(1, parsed.score)),
      confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
    };
  }

  // Fallback: keyword-based scoring
  const text = answer.toLowerCase();
  const keywords = question.keywords || [];
  const found = keywords.filter((kw) => text.includes(kw.toLowerCase()));
  const fallbackScore =
    keywords.length > 0 ? found.length / keywords.length : 0.5;

  return {
    score: fallbackScore,
    confidence: 0.3,
    feedback:
      "Não foi possível avaliar automaticamente. Revisão manual necessária.",
    keywordsFound: found,
    keywordsMissing: keywords.filter((kw) => !found.includes(kw)),
    grammarIssues: [],
  };
}

// ─── LESSON GENERATION ─────────────────────────────────────
export interface GeneratedLesson {
  grammar: string;
  logic: string;
  communication: string;
  mnemonic: string;
  pillar: string;
  difficulty: string;
}

export async function generateLesson(
  pillar: string,
  difficulty: string,
  interest: string
): Promise<GeneratedLesson> {
  const archetypes: Record<string, string> = {
    grammar: "Interferência PT-BR → Regra inglesa concreta",
    logic: "Silogismo linguístico → Argumento estruturado",
    vocab: "Sinônimo PT → Sinônimo EN",
    culture: "Empréstimo cultural → Sistema equivalente",
    comm: "Exemplo real → Situação cultural",
  };

  const prompt = `You are Lexio, an AI tutor for ${difficulty} level English.
Anchor the lesson to a memory palace hook: **${interest}**.
Focus pillar: **${pillar}** (${archetypes[pillar] || archetypes.grammar}).

Output **JSON-only** with keys:
- **grammar**: PT-BR interference warning + English rule
- **logic**: Linguistic reasoning + cultural insight
- **communication**: Real-world example/scenario
- **mnemonic**: CONCEPT **→** LOCATION **→** VISUAL HOOK **→** PORTUGUESE ANCHOR`;

  const messages: LLMMessage[] = [
    {
      role: "system",
      content:
        "You are an English tutor for Brazilian Portuguese speakers. Always output valid JSON.",
    },
    { role: "user", content: prompt },
  ];

  const response = await callLLM(messages, {
    temperature: 0.3,
    maxTokens: 1024,
  });
  const parsed = extractJson<GeneratedLesson>(response.content);

  if (parsed && parsed.grammar && parsed.mnemonic) {
    return { ...parsed, pillar, difficulty };
  }

  // Fallback mock
  return {
    grammar: `**[${pillar}]** PT-BR interference: "Eu tenho 25 anos" → English omits the article. Rule: *Zero article for age statements*.`,
    logic:
      "English avoids implicit subjects in formal writing. Prefer *It is* over *Is* for existential statements.",
    communication:
      "Example: When writing an email, start with *Dear X* and close with *Best regards*.",
    mnemonic: `CONCEPT: ${pillar} **→** LOCATION: ${interest} **→** HOOK: golden retriever wearing a tie **→** ANCHOR: *"meu cachorro usa gravata"*`,
    pillar,
    difficulty,
  };
}

// ─── CONVERSATION SHADOW ───────────────────────────────────
export interface ShadowMessage {
  role: "user" | "assistant";
  content: string;
  corrected?: string; // AI correction of user's message
  grammarNotes?: string[];
}

export async function generateShadowResponse(
  history: ShadowMessage[],
  userMessage: string
): Promise<ShadowMessage> {
  const systemPrompt = `You are Lexio, an English conversation partner for Brazilian learners.
Rules:
1. Respond naturally to keep the conversation flowing
2. After your response, include a brief correction in Portuguese in a "corrected" field
3. Include 1-2 grammar/vocab notes in a "grammarNotes" array
4. Respond ONLY with JSON: { "response": "...", "corrected": "...", "grammarNotes": [...] }`;

  const historyMessages: LLMMessage[] = history.slice(-6).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const messages: LLMMessage[] = [
    { role: "system", content: systemPrompt },
    ...historyMessages,
    { role: "user", content: userMessage },
  ];

  const response = await callLLM(messages, {
    temperature: 0.5,
    maxTokens: 512,
  });
  const parsed = extractJson<{
    response: string;
    corrected?: string;
    grammarNotes?: string[];
  }>(response.content);

  if (parsed && parsed.response) {
    return {
      role: "assistant",
      content: parsed.response,
      corrected: parsed.corrected,
      grammarNotes: parsed.grammarNotes,
    };
  }

  return {
    role: "assistant",
    content: response.content,
    corrected: undefined,
    grammarNotes: [],
  };
}
