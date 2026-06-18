import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { logAdminAction } from "@/lib/admin-audit";

async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return { error: "Missing auth header", status: 401 };
  const token = authHeader.replace("Bearer ", "");
  const supabase = getSupabaseAdmin();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return { error: "Invalid token", status: 401 };
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) return { error: "Forbidden", status: 403 };
  return { user, profile };
}

function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
  const offset = (page - 1) * limit;

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("users")
    .select("id, email, name, role, tier, created_at, priority_language", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (q) query = query.or(`email.ilike.%${q}%,name.ilike.%${q}%`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(admin.user.id, "view_users", "users", null, { query: q, page, limit }, getClientIp(request));

  return NextResponse.json({
    users: data,
    total: count,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const body = await request.json();
  const { user_email, bypass_type, reason, partnership_id, expires_at } = body;

  if (!user_email || !bypass_type || !reason) {
    return NextResponse.json({ error: "user_email, bypass_type, reason required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: targetUser } = await supabase.from("users").select("id, email").eq("email", user_email).single();
  if (!targetUser) return NextResponse.json({ error: `User not found: ${user_email}` }, { status: 404 });

  const { data: bypass, error } = await supabase
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

  if (partnership_id) {
    await supabase.rpc("increment_partnership_bypases", { p_partnership_id: partnership_id });
  }

  await logAdminAction(admin.user.id, "grant_bypass", "bypass", bypass.id, { target_user: user_email, bypass_type, reason }, getClientIp(request));
  return NextResponse.json({ bypass }, { status: 201 });
}
