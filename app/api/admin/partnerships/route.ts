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

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_partnerships")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ partnerships: data });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const body = await request.json();
  const { name, contact_email, contact_name, partnership_type, max_bypasses, expires_at, notes } = body;

  if (!name || !partnership_type) {
    return NextResponse.json({ error: "name and partnership_type required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("admin_partnerships")
    .insert({
      name,
      contact_email,
      contact_name,
      partnership_type,
      max_bypasses: max_bypasses || 50,
      expires_at: expires_at || null,
      notes: notes || null,
      created_by: admin.user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction(admin.user.id, "create_partnership", "partnership", data.id, { name, partnership_type }, getClientIp(request));
  return NextResponse.json({ partnership: data }, { status: 201 });
}
