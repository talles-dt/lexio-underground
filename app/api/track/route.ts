// app/api/track/route.ts
// W&B-style experiment tracking (Phase 6.3)
// Lightweight event logging to Supabase for analytics

import { NextRequest, NextResponse } from "next/server.js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabaseAdmin: SupabaseClient | null = null;
function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!url || !key) {
      return createClient("https://placeholder.supabase.co", "placeholder");
    }
    _supabaseAdmin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _supabaseAdmin;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, user_id, properties } = body;

    if (!event) {
      return NextResponse.json(
        { error: "event name required" },
        { status: 400 }
      );
    }

    // Log the event
    const { error } = await getSupabaseAdmin()
      .from("telemetry")
      .insert([
        {
          event,
          user_id: user_id || null,
          properties: properties || {},
          user_agent: req.headers.get("user-agent") || null,
          ip: req.headers.get("x-forwarded-for") || null,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error("Track error:", error);
      // Don't fail the request — tracking is non-critical
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // silent fail
  }
}
