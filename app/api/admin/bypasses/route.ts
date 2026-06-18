import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logAdminAction } from "@/lib/admin-audit";

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return { error: "Missing auth header", status: 401 };
  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return { error: "Invalid token", status: 401 };
  const { data: profile } = await supabaseAdmin.from("users").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) return { error: "Forbidden", status: 403 };
  return { user, profile };
}

function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

// ═════════════════════════════════════════════════════════════════
// GET /api/admin/bypasses — List active bypasses
// POST /api/admin/bypasses — Grant a bypass
// PATCH /api/admin/bypasses — Revoke a bypass
// ═════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get("active") !== "false";

  let query = supabaseAdmin
    .from("admin_bypasses")
    .select("*, users!admin_bypasses_user_id_fkey(email, name)")
    .order("created_at", { ascending: false });

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ bypasses: data });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const body = await request.json();
  const { user_email, bypass_type, reason, partnership_id, expires_at } = body;

  if (!user_email || !bypass_type || !reason) {
    return NextResponse.json({ error: "user_email, bypass_type, reason required" }, { status: 400 });
  }

  const { data: targetUser } = await supabaseAdmin
    .from("users").select("id, email").eq("email", user_email).single();

  if (!targetUser) return NextResponse.json({ error: `User not found: ${user_email}` }, { status: 404 });

  const { data: bypass, error } = await supabaseAdmin
    .from("admin_bypasses")
    .insert({
      user_id: targetUser.id,
      granted_by: admin.user.id,
      bypass_type,
      reason,
      partnership_id: partnership_id || null,
      expires_at: expires_at || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(admin.user.id, "grant_bypass", "bypass", bypass.id, { target_user: user_email, bypass_type, reason }, getClientIp(request));
  return NextResponse.json({ bypass }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const body = await request.json();
  const { bypass_id, is_active } = body;

  if (!bypass_id || typeof is_active !== "boolean") {
    return NextResponse.json({ error: "bypass_id and is_active required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("admin_bypasses")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", bypass_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(admin.user.id, is_active ? "reactivate_bypass" : "revoke_bypass", "bypass", bypass_id, {}, getClientIp(request));
  return NextResponse.json({ bypass: data });
}
