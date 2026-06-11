// app/api/meme-vault/route.ts
// GET: list memes with filtering  |  POST: submit new meme (service_role)
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

/* ------------------------------------------------------------------ */
/* Supabase client                                                     */
/* ------------------------------------------------------------------ */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      "",
    { auth: { persistSession: false } }
  );
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Pillar = "grammar" | "logic" | "vocab" | "culture" | "comm";

interface MemeRow {
  id: string;
  title: string;
  image_url: string | null;
  alt_text: string | null;
  caption: string | null;
  translation: string | null;
  pillar: Pillar;
  difficulty: number;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/* GET /api/meme-vault                                                 */
/* ------------------------------------------------------------------ */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const pillar = searchParams.get("pillar") as Pillar | null;
    const difficultyParam = searchParams.get("difficulty");
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    const limit = Math.min(Number(limitParam) || 20, 100);
    const offset = Number(offsetParam) || 0;

    const supabase = getSupabase();

    let query = supabase
      .from("meme_vault")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (pillar && ["grammar", "logic", "vocab", "culture", "comm"].includes(pillar)) {
      query = query.eq("pillar", pillar);
    }

    if (difficultyParam) {
      const difficulty = Number(difficultyParam);
      if (difficulty >= 1 && difficulty <= 5) {
        query = query.eq("difficulty", difficulty);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Meme vault GET error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to fetch memes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ memes: (data as MemeRow[]) ?? [] });
  } catch (err) {
    console.error("Meme vault GET unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------------------ */
/* POST /api/meme-vault                                                */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    // Only allow service_role calls (check for service key presence)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.replace("Bearer ", "");

    if (serviceKey && bearerToken !== serviceKey) {
      // If a service key is configured, require it for POST
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, image_url, alt_text, caption, translation, pillar, difficulty, tags } =
      body as {
        title?: string;
        image_url?: string;
        alt_text?: string;
        caption?: string;
        translation?: string;
        pillar?: string;
        difficulty?: number;
        tags?: string[];
      };

    // Validate required fields
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "title is required" },
        { status: 400 }
      );
    }

    const validPillars: Pillar[] = ["grammar", "logic", "vocab", "culture", "comm"];
    if (!pillar || !validPillars.includes(pillar as Pillar)) {
      return NextResponse.json(
        { error: "pillar must be one of: grammar, logic, vocab, culture, comm" },
        { status: 400 }
      );
    }

    if (
      difficulty === undefined ||
      typeof difficulty !== "number" ||
      difficulty < 1 ||
      difficulty > 5
    ) {
      return NextResponse.json(
        { error: "difficulty must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("meme_vault")
      .insert([
        {
          title,
          image_url: image_url || null,
          alt_text: alt_text || null,
          caption: caption || null,
          translation: translation || null,
          pillar,
          difficulty,
          tags: tags || [],
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Meme vault POST error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to insert meme" },
        { status: 500 }
      );
    }

    return NextResponse.json({ meme: data }, { status: 201 });
  } catch (err) {
    console.error("Meme vault POST unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
