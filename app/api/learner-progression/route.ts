import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  const language = req.nextUrl.searchParams.get("language") || "en";

  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("learner_progression")
    .select("*")
    .eq("user_id", userId)
    .eq("language", language)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({
      user_id: userId,
      language,
      maturity_stage: "roots",
      pillar_weights: { grammar: 0, logic: 0, vocab: 0, culture: 0, comm: 0 },
      last_cartografa_date: null,
      palace_room_names: ["entrance"],
    });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, language, maturity_stage, pillar_weights, last_cartografa_date, palace_room_names } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("learner_progression")
    .upsert({
      user_id,
      language: language || "en",
      maturity_stage: maturity_stage || "roots",
      pillar_weights: pillar_weights || {},
      last_cartografa_date: last_cartografa_date || null,
      palace_room_names: palace_room_names || ["entrance"],
    }, { onConflict: "user_id,language" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
