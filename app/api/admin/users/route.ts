import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { logAdminAction } from "@/lib/admin-audit";

// ─── Helper: verify admin from request ───────────────────────────
async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Missing auth header", status: 401 };
  }

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return { error: "Invalid token", status: 401 };
  }

  const { data: profile } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    return { error: "Forbidden — admin only", status: 403 };
  }

  return { user, profile };
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ═════════════════════════════════════════════════════════════════
// GET /api/admin/users — List users with search + pagination
// ═════════════════════════════════════════════════════════════════
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("users")
    .select("id, email, name, role, tier, created_at, priority_language", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) {
    query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAdminAction(
    admin.user.id,
    "view_users",
    "users",
    null,
    { query: q, page, limit },
    getClientIp(request)
  );

  return NextResponse.json({
    users: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

// ═════════════════════════════════════════════════════════════════
// POST /api/admin/bypasses — Grant a bypass to a user
// ═════════════════════════════════════════════════════════════════
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const body = await request.json();
  const { user_email, bypass_type, reason, partnership_id, expires_at } = body;

  if (!user_email || !bypass_type || !reason) {
    return NextResponse.json(
      { error: "Missing required fields: user_email, bypass_type, reason" },
      { status: 400 }
    );
  }

  // Find user by email
  const { data: targetUser } = await supabaseAdmin
    .from("users")
    .select("id, email")
    .eq("email", user_email)
    .single();

  if (!targetUser) {
    return NextResponse.json({ error: `User not found: ${user_email}` }, { status: 404 });
  }

  // Create bypass
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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // If partnership, increment bypasses_used
  if (partnership_id) {
    await supabaseAdmin.rpc("increment_partnership_bypases", {
      p_partnership_id: partnership_id,
    });
  }

  await logAdminAction(
    admin.user.id,
    "grant_bypass",
    "bypass",
    bypass.id,
    { target_user: user_email, bypass_type, reason },
    getClientIp(request)
  );

  return NextResponse.json({ bypass }, { status: 201 });
}
