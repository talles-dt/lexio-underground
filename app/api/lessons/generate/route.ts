// app/api/lessons/generate/route.ts
// AI-powered lesson generation using LexioMind + NVIDIA NIM (Phase 5.3 fix)
// Multi-tier fallback: OpenRouter → Mock
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const RequestSchema = z.object({
  pillar: z.enum(["grammar", "logic", "vocab", "culture", "comm"]),
  difficulty: z.enum(["A2", "B1", "B2", "C1"]),
  interest: z.string().min(3),
  user_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = RequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { pillar, difficulty, interest, user_id } = parsed.data;

  // Delegate to LexioMind orchestrator (dynamic import so it's not bundled on serverless edge)
  const { generateLesson } = await import("@/stubs/lexio-mind-orchestrator.js");
  const lesson = await generateLesson({ pillar, difficulty, interest });

  // Persist to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    { auth: { persistSession: false } }
  );
  const { data, error } = await supabase
    .from("lessons")
    .insert([
      {
        user_id: user_id || null,
        pillar,
        difficulty,
        content: JSON.stringify(lesson),
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
