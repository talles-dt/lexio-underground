// app/api/diagnostico/route.ts
// Submit completed Cartografa results — uses new schema (Phase 3.4 fix)
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { z } from "zod";

let _supabaseAdmin: any = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const { createClient } = require("@supabase/supabase-js");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!url || !key) {
      _supabaseAdmin = createClient(
        "https://placeholder.supabase.co",
        "placeholder"
      );
    } else {
      _supabaseAdmin = createClient(url, key, {
        auth: { persistSession: false },
      });
    }
  }
  return _supabaseAdmin;
}

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
  session_id: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = DiagnosticSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email, interest, answers, results, session_id } = parsed.data;

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

  // Prepare record matching the new schema
  const record: Record<string, unknown> = {
    email,
    interest,
    pillar_scores: results.pillar_scores,
    map_of_ignorance: results.map_of_ignorance,
    overall_readiness: results.overall_readiness,
    recommended_focus: results.recommended_focus,
    identity_callout: results.identity_callout,
    archetype_key: archetype.key,
    archetype_name: archetype.name,
    raw_response_log: answers,
    total_questions: results.total_questions,
    total_correct: results.total_correct,
    duration_seconds: results.duration_seconds,
    completed_at: new Date().toISOString(),
  };

  // If session_id provided, update existing save-state record; otherwise insert new
  let query;
  if (session_id) {
    query = getSupabaseAdmin()
      .from("diagnostic_sessions")
      .update(record)
      .eq("id", session_id)
      .select("share_token");
  } else {
    query = getSupabaseAdmin()
      .from("diagnostic_sessions")
      .insert([record])
      .select("share_token");
  }

  const { data: result, error: insertError } = await query.single();

  if (insertError || !result) {
    console.error("Diagnostic insert error:", insertError);
    return NextResponse.json(
      { error: insertError?.message || "Failed to create session" },
      { status: 500 }
    );
  }

  const share_token = result.share_token;

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

  return NextResponse.json({ share_token }, { status: 200 });
}
