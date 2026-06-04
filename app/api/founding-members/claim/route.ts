// app/api/founding-members/claim/route.ts
// Founding member license claim (Phase 5.5)
// Only Cartografa completers can claim a founding member license

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

export async function POST(req: NextRequest) {
  try {
    const { license_key, user_id } = await req.json();

    if (!license_key || !user_id) {
      return NextResponse.json(
        { error: "license_key and user_id are required" },
        { status: 400 }
      );
    }

    // 1. Verify the user has completed Cartografa
    const { data: sessions, error: sessionError } = await _supabaseAdmin
      .from("diagnostic_sessions")
      .select("id, overall_readiness")
      .eq("user_id", user_id)
      .not("completed_at", "is", null)
      .limit(1);

    if (sessionError || !sessions || sessions.length === 0) {
      return NextResponse.json(
        { error: "Complete the Cartografa diagnostic first" },
        { status: 403 }
      );
    }

    // 2. Validate the license key
    const { data: license, error: licenseError } = await _supabaseAdmin
      .from("founders")
      .select("*")
      .eq("license_key", license_key)
      .is("claimed_at", null) // not yet claimed
      .single();

    if (licenseError || !license) {
      return NextResponse.json(
        { error: "Invalid or already claimed license key" },
        { status: 400 }
      );
    }

    // 3. Claim the license
    const { error: claimError } = await _supabaseAdmin
      .from("founders")
      .update({
        user_id,
        claimed_at: new Date().toISOString(),
      })
      .eq("id", license.id);

    if (claimError) {
      return NextResponse.json({ error: claimError.message }, { status: 500 });
    }

    // 4. Update user tier to pro_lifetime
    const { error: userError } = await _supabaseAdmin
      .from("users")
      .update({ tier: "pro_lifetime", found_member: true })
      .eq("id", user_id);

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, tier: "pro_lifetime" });
  } catch (err) {
    console.error("License claim error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Check if user is eligible (has completed Cartografa)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ eligible: false, reason: "user_id required" });
  }

  const { data: sessions } = await _supabaseAdmin
    .from("diagnostic_sessions")
    .select("id, overall_readiness")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .limit(1);

  const eligible = sessions && sessions.length > 0;

  return NextResponse.json({
    eligible,
    readiness: eligible ? sessions![0].overall_readiness : null,
  });
}
