// app/api/ai/generate-content/route.ts
// AI content generation for cultural atoms, quiz questions, etc.
import { NextRequest, NextResponse } from "next/server";
import { generateCulturalAtom, runAgentTask } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { type, params } = await request.json();

    switch (type) {
      case "cultural-atom": {
        const { pillar, difficulty, language } = params;
        const atom = await generateCulturalAtom(pillar, difficulty, language);
        return NextResponse.json({ atom });
      }

      case "agent-task": {
        const { task, context } = params;
        const result = await runAgentTask(task, context);
        return NextResponse.json({ result });
      }

      default:
        return NextResponse.json({ error: "Unknown generation type" }, { status: 400 });
    }
  } catch (err) {
    console.error("AI content generation error:", err);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
