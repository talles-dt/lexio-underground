// app/api/conversation-shadow/route.ts
// Async Conversation Shadow — record → AI response → review (Phase 5.6)
// 3-turn history maintained per user

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { ShadowMessage } from "@/types/lexio-mind";

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

// POST: Submit a message and get AI response
export async function POST(req: NextRequest) {
  try {
    const { user_id, message, session_id } = await req.json();

    if (!user_id || !message) {
      return NextResponse.json(
        { error: "user_id and message are required" },
        { status: 400 }
      );
    }

    // Load previous messages (last 6 = 3 turns)
    const { data: prevMessages } = await getSupabaseAdmin()
      .from("conversation_shadow")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(6);

    const history: ShadowMessage[] = (prevMessages || [])
      .reverse()
      .map((m) => ({
        role: m.role,
        content: m.content,
        corrected: m.corrected,
        grammarNotes: m.grammar_notes,
      }));

    // Generate AI response
    const generateShadowResponse = async (
      _history: ShadowMessage[],
      _message: string
    ) => {
      return {
        content: "Mock shadow response",
        corrected: false,
        grammarNotes: null,
      };
    };

    const aiResponse = await generateShadowResponse(history, message);

    // Save user message
    const { error: userMsgError } = await getSupabaseAdmin()
      .from("conversation_shadow")
      .insert([
        {
          user_id,
          session_id: session_id || null,
          role: "user",
          content: message,
        },
      ]);

    if (userMsgError) {
      console.error("Failed to save user message:", userMsgError);
    }

    // Save AI response
    const { error: aiMsgError } = await getSupabaseAdmin()
      .from("conversation_shadow")
      .insert([
        {
          user_id,
          session_id: session_id || null,
          role: "assistant",
          content: aiResponse.content,
          corrected: aiResponse.corrected,
          grammar_notes: aiResponse.grammarNotes,
        },
      ]);

    if (aiMsgError) {
      console.error("Failed to save AI response:", aiMsgError);
    }

    return NextResponse.json({
      response: aiResponse.content,
      corrected: aiResponse.corrected,
      grammarNotes: aiResponse.grammarNotes,
    });
  } catch (err) {
    console.error("Conversation shadow error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// GET: Get conversation history
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("conversation_shadow")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    messages: (data || []).reverse(),
  });
}
