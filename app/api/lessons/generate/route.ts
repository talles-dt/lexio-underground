// app/api/lessons/generate/route.ts
// Dynamic lesson generation with multi-tier LLM fallback + Supabase persistence

import { z } from "zod";
import { supabase } from "@/lib/supabase";

const LessonSchema = z.object({
  pillar: z.enum([
    "grammar",
    "logic",
    "communication",
    "vocabulary",
    "culture",
  ]),
  difficulty: z.enum(["A2", "B1", "B2", "C1"]),
  interest: z.string().min(3), // Memory palace anchor
});

const archetypes = {
  grammar: "Interferência PT-BR → Regra inglesa concreta",
  logic: "Silogismo linguístico → Argumento estruturado",
  communication: "Exemplo real → Situação cultural",
  vocabulary: "Sinônimo PT → Sinônimo EN",
  culture: "Empréstimo cultural → Sistema equivalente",
} as const;

type Pillar = keyof typeof archetypes;

async function generateLesson(
  pillar: Pillar,
  difficulty: string,
  interest: string,
) {
  const prompt = `
 You are Lexio, an AI tutor for ${difficulty} level English.
 Anchor the lesson to a memory palace hook: **${interest}**.
 Focus pillar: **${pillar}** (${archetypes[pillar as keyof typeof archetypes]}).

 Output **JSON-only** with keys:
 - **grammar**: PT-BR interference warning + English rule
 - **logic**: Linguistic reasoning + cultural insight
 - **communication**: Real-world example/scenario
 - **mnemonic**: CONCEPT **→** LOCATION **→** VISUAL HOOK **→** PORTUGUESE ANCHOR
 `;

  // Tier 1: OpenRouter NVIDIA NIM
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "nvidia/qwen3-14b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
        }),
      },
    );
    const data = await response.json();
    return LessonSchema.parse(JSON.parse(data.choices[0].message.content));
  } catch (err) {
    console.warn("OpenRouter fallback:", err);
  }

  // Tier 2: Llama (Railway/self-hosted)
  if (process.env.LLAMA_API_URL) {
    try {
      const response = await fetch(`${process.env.LLAMA_API_URL}/completions`, {
        method: "POST",
        body: JSON.stringify({ prompt, max_tokens: 1024 }),
      });
      return LessonSchema.parse(await response.json());
    } catch (err) {
      console.warn("Llama fallback:", err);
    }
  }

  // Tier 3: Mock (development)
  return {
    grammar: `**[Mock ${pillar}]** PT-BR interference: "Eu tenho 25 anos" → English omits the article. Rule: *Zero article for age statements*.`,
    logic:
      "English avoids implicit subjects in formal writing. Prefer *It is* over *Is* for existential statements.",
    communication:
      "Example: When writing an email, start with *Dear X* and close with *Best regards*.",
    mnemonic: `CONCEPT: ${pillar} **→** LOCATION: ${interest} **→** HOOK: golden retriever wearing a tie **→** ANCHOR: *"meu cachorro usa gravata"*`,
  };
}

export async function POST(req: Request) {
  const { pillar, difficulty, interest } = LessonSchema.parse(await req.json());
  const lesson = await generateLesson(pillar, difficulty, interest);

  // Persist to Supabase
  const { data, error } = await supabase
    .from("lessons")
    .insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        pillar,
        difficulty,
        content: JSON.stringify(lesson),
      },
    ])
    .select()
    .single();

  if (error) return new Response(JSON.stringify({ error }), { status: 500 });
  return new Response(JSON.stringify(data), { status: 201 });
}
