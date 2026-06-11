import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

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
    const share_token = randomUUID().replace(/-/g, "").slice(0, 12);

    const { session_id, email, ...results } = body as Record<string, unknown>;

    if (session_id && typeof session_id === "string") {
      const { error } = await getSupabaseAdmin()
        .from("diagnostic_sessions")
        .update({
          share_token,
          pillar_scores: results.pillar_scores ?? null,
          overall_readiness: results.overall_readiness ?? null,
          recommended_focus: results.recommended_focus ?? null,
          identity_callout: results.identity_callout ?? null,
          updated_at: new Date().toISOString(),
          ...(email ? { email: String(email) } : {}),
        })
        .eq("id", session_id);

      if (error) {
        console.error("diagnostico/share error:", error);
      }
    }

    return NextResponse.json({ share_token });
  } catch (err) {
    console.error("diagnostico/share parse error:", err);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
