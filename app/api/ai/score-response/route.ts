// app/api/ai/score-response/route.ts
// AI scoring for Cartografa open-text responses
import { NextRequest, NextResponse } from "next/server";
import { scoreOpenTextResponse } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { question, response, pillar, difficulty } = await request.json();

    if (!question || !response || !pillar) {
      return NextResponse.json({ error: "question, response, and pillar required" }, { status: 400 });
    }

    const result = await scoreOpenTextResponse(question, response, pillar, difficulty || 3);
    return NextResponse.json(result);
  } catch (err) {
    console.error("AI scoring error:", err);
    return NextResponse.json({ error: "Scoring failed" }, { status: 500 });
  }
}
