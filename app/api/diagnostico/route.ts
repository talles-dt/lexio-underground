// app/api/diagnostico/route.ts
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const DiagnosticSchema = z.object({
  email: z.string().email(),
  interest: z.string().min(1),
  answers: z.array(z.any()),
  results: z.object({
    pillar_scores: z.record(
      z.string(),
      z.object({
        score: z.number(),
        confidence: z.number(),
        gap_nodes: z.array(z.any()),
      })
    ),
    map_of_ignorance: z.array(z.any()),
    overall_readiness: z.string(),
    recommended_focus: z.array(z.string()),
    identity_callout: z.string(),
    total_questions: z.number(),
    total_correct: z.number(),
    duration_seconds: z.number(),
  }),
});

export async function POST(req: Request) {
  const body = await req.json();
  const { email, interest, answers, results } = DiagnosticSchema.parse(body);

  // Determine archetype from strongest pillar
  const pillarScores = results.pillar_scores;
  const strongest = Object.entries(pillarScores).sort(
    (a, b) => b[1].score - a[1].score
  )[0];

  const archetypeMap: Record<string, { key: string; name: string }> = {
    grammar: { key: "grammarian", name: "O Gramático" },
    logic: { key: "architect", name: "O Arquiteto" },
    vocab: { key: "collector", name: "O Colecionador" },
    culture: { key: "interpreter", name: "O Intérprete" },
    comm: { key: "orator", name: "O Orador" },
  };

  const archetype = archetypeMap[strongest[0]] || {
    key: "unknown",
    name: "Desconhecido",
  };

  // Insert into Supabase
  const { data: insertData, error: insertError } = await supabaseAdmin
    .from("diagnostic_sessions")
    .insert([
      {
        email,
        answers: { interest, answers, results },
        scores: pillarScores,
        archetype_key: archetype.key,
        archetype_name: archetype.name,
      },
    ])
    .select("share_token")
    .single();

  if (insertError || !insertData) {
    return new Response(
      JSON.stringify({
        error: insertError?.message || "Failed to create session",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const share_token = insertData.share_token;

  // Fire-and-forget email notification
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/diagnostico/notify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name: email.split("@")[0],
        archetype_key: archetype.key,
        archetype_name: archetype.name,
        share_token,
      }),
    });
  } catch (notifyErr) {
    console.error("Failed to send notification:", notifyErr);
  }

  return new Response(JSON.stringify({ share_token }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
