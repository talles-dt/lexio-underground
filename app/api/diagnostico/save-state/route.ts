// app/api/diagnostico/save-state/route.ts
// Save individual answer state for drop-out rescue (Phase 1.4)
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } },
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      session_id, // generated client-side on start
      email,
      current_pillar,
      current_stage,
      current_difficulty,
      answered_ids, // string[]
      history, // AnswerRecord[]
      pillar_states, // Record<Pillar, PillarState>
      timestamp,
    } = body;

    if (!session_id || !email) {
      return NextResponse.json(
        { error: "session_id and email are required" },
        { status: 400 },
      );
    }

    // Upsert: create or update the session record
    const { error } = await supabaseAdmin.from("diagnostic_sessions").upsert(
      {
        id: session_id,
        email,
        state: {
          current_pillar,
          current_stage,
          current_difficulty,
          answered_ids,
          pillar_states,
        },
        raw_response_log: history,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (error) {
      console.error("Save-state error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: true });
  } catch (err) {
    console.error("Save-state parse error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
