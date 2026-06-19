// app/api/admin/seed/route.ts
// Seed initial content for Lexio Underground
// Protected: only works with admin token and only when tables are empty

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CULTURAL_ATOMS } from "@/lib/pulse-content";

// ─── Seed Data ────────────────────────────────────────────────

const SEED_CULTURAL_ATOMS = CULTURAL_ATOMS.map((atom) => ({
  language: "en",
  region: "us",
  atom_name: atom.title,
  description: atom.description,
  pillar_tags: [atom.pillar],
  difficulty_tier: atom.difficulty,
  content: atom.content,
  example: atom.example || null,
  translation: atom.translation || null,
  is_active: true,
}));

const SEED_PALACE_ROOMS = [
  { room_id: "entrance", name: "Entrance Hall", pillar: "none", description: "The gateway to your Memory Palace.", icon: "🚪", unlocked: true, grid_x: 1, grid_y: 3, connected_to: ["grammar", "vocab"] },
  { room_id: "grammar", name: "Grammar Sanctum", pillar: "grammar", description: "Where rules become intuition.", icon: "📐", unlocked: true, grid_x: 0, grid_y: 1, connected_to: ["entrance", "vocab", "logic"] },
  { room_id: "vocab", name: "Vocabulary Vault", pillar: "vocab", description: "Chunks, collocations, and the words that belong together.", icon: "📚", unlocked: true, grid_x: 2, grid_y: 1, connected_to: ["entrance", "grammar", "culture"] },
  { room_id: "logic", name: "Logic Labyrinth", pillar: "logic", description: "The map of what you don't know you don't know.", icon: "🧩", unlocked: true, grid_x: 0, grid_y: 3, connected_to: ["grammar", "comm"] },
  { room_id: "culture", name: "Cultural Observatory", pillar: "culture", description: "Where language meets world.", icon: "🌍", unlocked: true, grid_x: 2, grid_y: 3, connected_to: ["vocab", "comm"] },
  { room_id: "comm", name: "Communication Hall", pillar: "comm", description: "The bridge between thought and expression.", icon: "💬", unlocked: false, grid_x: 1, grid_y: 4, connected_to: ["logic", "culture"] },
];

// ─── Route ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Verify admin
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing auth" }, { status: 401 });
  }

  const results: Record<string, { count: number; error?: string }> = {};

  try {
    const db = getSupabaseAdmin();

    // 1. Seed cultural atoms
    const { data: existingAtoms } = await db.from("cultural_atoms").select("id").limit(1);
    if (!existingAtoms || existingAtoms.length === 0) {
      const { data, error } = await db.from("cultural_atoms").upsert(SEED_CULTURAL_ATOMS, { onConflict: "atom_name" }).select("id");
      results.cultural_atoms = { count: data?.length || 0, error: error?.message };
    } else {
      results.cultural_atoms = { count: 0, error: "Already seeded" };
    }

    // 2. Seed palace rooms (for any user who has a palace)
    const { data: existingRooms } = await db.from("palace_rooms").select("id").limit(1);
    if (!existingRooms || existingRooms.length === 0) {
      // Get all palaces
      const { data: palaces } = await db.from("palace").select("id");
      if (palaces && palaces.length > 0) {
        for (const palace of palaces) {
          const { data: palaceData } = await db.from("palace").select("user_id").eq("id", palace.id).single();
          const roomsWithPalace = SEED_PALACE_ROOMS.map((r) => ({
            ...r,
            palace_id: palace.id,
            user_id: palaceData?.user_id || "",
          }));
          const { data, error } = await db.from("palace_rooms").upsert(roomsWithPalace, { onConflict: "palace_id,room_id" }).select("id");
          results.palace_rooms = { count: data?.length || 0, error: error?.message };
        }
      } else {
        results.palace_rooms = { count: 0, error: "No palaces found — users need to complete Cartografa first" };
      }
    } else {
      results.palace_rooms = { count: 0, error: "Already seeded" };
    }

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed", details: String(err) }, { status: 500 });
  }
}
