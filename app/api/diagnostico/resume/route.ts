// app/api/diagnostico/resume/route.ts
// Resume a Cartografa session from saved state (drop-out rescue)
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  { auth: { persistSession: false } },
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");
  const email = searchParams.get("email");

  if (!sessionId && !email) {
    return NextResponse.json(
      { error: "Provide session_id or email to resume" },
      { status: 400 },
    );
  }

  let query = supabaseAdmin
    .from("diagnostic_sessions")
    .select("id, email, state, raw_response_log")
    .is("completed_at", null) // only incomplete sessions
    .order("updated_at", { ascending: false })
    .limit(1);

  if (sessionId) {
    query = query.eq("id", sessionId);
  } else {
    query = query.eq("email", email!);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return NextResponse.json(
      { session: null, error: error?.message || null },
      { status: 200 },
    );
  }

  return NextResponse.json({
    session: {
      session_id: data.id,
      email: data.email,
      state: data.state,
      history: data.raw_response_log || [],
    },
  });
}