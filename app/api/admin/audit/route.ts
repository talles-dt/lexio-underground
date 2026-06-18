import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

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

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return NextResponse.json({ error: admin.error }, { status: admin.status });

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
  const action = searchParams.get("action");

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (action) query = query.eq("action", action);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ logs: data });
}
