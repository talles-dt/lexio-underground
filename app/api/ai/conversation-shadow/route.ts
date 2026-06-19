// app/api/ai/conversation-shadow/route.ts
// AI Conversation Shadow — async conversation partner
import { NextRequest, NextResponse } from "next/server";
import { generateConversationResponse } from "@/lib/ai";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { message, targetLanguage, nativeLanguage, level, history, sessionId } = await request.json();

    if (!message || !targetLanguage) {
      return NextResponse.json({ error: "message and targetLanguage required" }, { status: 400 });
    }

    // Generate AI response
    const response = await generateConversationResponse(
      targetLanguage,
      level || "intermediate",
      history || [],
      nativeLanguage || "pt"
    );

    // Store conversation turn if sessionId provided
    if (sessionId) {
      const db = getSupabaseAdmin();
      await db.from("conversation_shadow_turns").insert({
        session_id: sessionId,
        user_message: message,
        shadow_response: response,
        target_language: targetLanguage,
        level: level || "intermediate",
      });
    }

    return NextResponse.json({ response });
  } catch (err) {
    console.error("Conversation shadow error:", err);
    return NextResponse.json({ error: "AI response failed" }, { status: 500 });
  }
}
