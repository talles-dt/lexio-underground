import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin: any = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    _supabaseAdmin = createClient(
      url || "https://placeholder.supabase.co",
      key || "placeholder",
      { auth: { persistSession: false } }
    );
  }
  return _supabaseAdmin;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, email, interest } = body as {
      session_id?: string;
      email?: string;
      interest?: string;
    };

    if (!session_id || !email) {
      return NextResponse.json(
        { error: "session_id and email are required" },
        { status: 400 }
      );
    }

    const { error } = await getSupabaseAdmin()
      .from("diagnostic_sessions")
      .upsert(
        {
          id: session_id,
          email,
          interest: interest ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("diagnostico/start error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, session_id });
  } catch (err) {
    console.error("diagnostico/start parse error:", err);
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
