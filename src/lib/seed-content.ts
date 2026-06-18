/**
 * Lexio Underground — Study Content Population
 *
 * Seeds the database with initial learning content:
 * - Cultural atoms (from Pulse Mode)
 * - Vocabulary items per pillar
 * - Palace room definitions
 *
 * This module provides functions to populate Supabase tables
 * with initial content for the MVP.
 */

import { supabase } from "@/lib/supabase";
import { CULTURAL_ATOMS } from "@/lib/pulse-content";

/* ------------------------------------------------------------------ */
/*  Palace Room Definitions                                            */
/* ------------------------------------------------------------------ */

export interface PalaceRoomDef {
  id: string;
  name: string;
  pillar: "grammar" | "logic" | "vocab" | "culture" | "comm" | "none";
  description: string;
  icon: string;
  unlock_stage: "roots" | "sprouts" | "branches" | "canopy" | "underground";
  grid_x: number;
  grid_y: number;
  connected_to: string[];
}

export const PALACE_ROOMS: PalaceRoomDef[] = [
  {
    id: "entrance",
    name: "Entrance Hall",
    pillar: "none",
    description: "The gateway to your Memory Palace. Every journey begins here.",
    icon: "🚪",
    unlock_stage: "roots",
    grid_x: 1,
    grid_y: 3,
    connected_to: ["grammar", "vocab"],
  },
  {
    id: "grammar",
    name: "Grammar Sanctum",
    pillar: "grammar",
    description: "Where rules become intuition. Transform surface into deep structure.",
    icon: "📐",
    unlock_stage: "sprouts",
    grid_x: 0,
    grid_y: 1,
    connected_to: ["entrance", "vocab", "logic"],
  },
  {
    id: "vocab",
    name: "Vocabulary Vault",
    pillar: "vocab",
    description: "Chunks, collocations, and the words that belong together.",
    icon: "📚",
    unlock_stage: "sprouts",
    grid_x: 2,
    grid_y: 1,
    connected_to: ["entrance", "grammar", "culture"],
  },
  {
    id: "logic",
    name: "Logic Labyrinth",
    pillar: "logic",
    description: "The map of what you don't know you don't know.",
    icon: "🧩",
    unlock_stage: "sprouts",
    grid_x: 0,
    grid_y: 3,
    connected_to: ["grammar", "comm"],
  },
  {
    id: "culture",
    name: "Cultural Observatory",
    pillar: "culture",
    description: "Where language meets world. Memes, atoms, and hidden meanings.",
    icon: "🌍",
    unlock_stage: "sprouts",
    grid_x: 2,
    grid_y: 3,
    connected_to: ["vocab", "comm"],
  },
  {
    id: "comm",
    name: "Communication Hall",
    pillar: "comm",
    description: "The bridge between thought and expression. Speak without fear.",
    icon: "💬",
    unlock_stage: "branches",
    grid_x: 1,
    grid_y: 4,
    connected_to: ["logic", "culture"],
  },
];

/* ------------------------------------------------------------------ */
/*  Vocabulary Items (seed data)                                       */
/* ------------------------------------------------------------------ */

export interface VocabSeed {
  pillar: "grammar" | "logic" | "vocab" | "culture" | "comm";
  item_type: "word" | "chunk" | "phrase" | "rule";
  title: string;
  content: string;
  explanation: string;
  example: string;
  room: string;
  difficulty: number;
}

export const VOCAB_SEEDS: VocabSeed[] = [
  // Grammar items
  {
    pillar: "grammar",
    item_type: "rule",
    title: "Present Perfect vs Simple Past",
    content: "Use Present Perfect for actions connected to now. Use Simple Past for completed actions.",
    explanation: "I have lived here for 5 years (still living) vs I lived there in 2010 (not anymore)",
    example: "\"I have seen that movie\" (relevant now) vs \"I saw that movie last week\" (specific past)",
    room: "grammar",
    difficulty: 2,
  },
  {
    pillar: "grammar",
    item_type: "rule",
    title: "The Subjunctive Were",
    content: "\"If I were\" (not \"was\") for hypothetical situations.",
    explanation: "The subjunctive mood signals unreal/hypothetical. \"Were\" for all persons in formal English.",
    example: "\"If I were rich, I would travel the world\"",
    room: "grammar",
    difficulty: 3,
  },
  {
    pillar: "grammar",
    item_type: "chunk",
    title: "Make vs Do",
    content: "\"Make\" = create/produce. \"Do\" = perform an activity.",
    explanation: "\"Make a mistake\" (create it), \"Do homework\" (perform it)",
    example: "\"I made dinner\" vs \"I did the dishes\"",
    room: "grammar",
    difficulty: 1,
  },
  // Vocab items
  {
    pillar: "vocab",
    item_type: "chunk",
    title: "Take a shower",
    content: "\"Take a shower\" is the standard American collocation.",
    explanation: "\"Have a shower\" is British. \"Do a shower\" doesn't exist.",
    example: "\"I need to take a shower before we leave\"",
    room: "vocab",
    difficulty: 1,
  },
  {
    pillar: "vocab",
    item_type: "chunk",
    title: "Actually ≠ Atualmente",
    content: "\"Actually\" means 'in fact' or 'really' — not 'currently'.",
    explanation: "\"Actually\" is one of the most common false friends. Portuguese \"atualmente\" = English \"currently\", not \"actually\".",
    example: "\"I'm actually working on it\" = I'm really working on it",
    room: "vocab",
    difficulty: 1,
  },
  {
    pillar: "vocab",
    item_type: "phrase",
    title: "It makes sense",
    content: "\"Make sense\" is a fixed chunk. Not \"do sense\" or \"have sense\".",
    explanation: "\"Make sense\" = to be logical/reasonable. The verb \"make\" collocates with \"sense\" in a fixed expression.",
    example: "\"That makes sense\" = That is logical/reasonable",
    room: "vocab",
    difficulty: 2,
  },
  {
    pillar: "vocab",
    item_type: "chunk",
    title: "Put off (postpone)",
    content: "\"Put off\" = postpone. Different from put away/put down/put out.",
    explanation: "Phrasal verbs with \"put\" have very different meanings. \"Put off\" specifically means to delay or postpone something.",
    example: "\"Don't put off until tomorrow what you can do today\"",
    room: "vocab",
    difficulty: 2,
  },
  // Logic items
  {
    pillar: "logic",
    item_type: "rule",
    title: "False Friends: Pretender",
    content: "\"Pretender\" (PT) ≠ \"Pretend\" (EN). \"Pretend\" = fake/false.",
    explanation: "\"Pretender\" in Portuguese means \"to intend\". \"Pretend\" in English means \"to fake\". Classic false friend.",
    example: "\"Pretendo estudar\" → \"I intend to study\" (NOT \"I pretend to study\")",
    room: "logic",
    difficulty: 1,
  },
  {
    pillar: "logic",
    item_type: "rule",
    title: "Article Logic",
    content: "English articles don't map to Portuguese. Zero article for general, \"the\" for specific.",
    explanation: "Portuguese uses articles more freely. English has specific rules: no article for general statements, \"the\" for specific references.",
    example: "\"I love music\" (general) vs \"I love the music in this film\" (specific)",
    room: "logic",
    difficulty: 3,
  },
  // Culture items
  {
    pillar: "culture",
    item_type: "phrase",
    title: "\"That's Interesting\" — The Polite No",
    content: "In American culture, \"That's interesting\" with flat tone often means disagreement.",
    explanation: "Americans often avoid direct disagreement. \"That's interesting\" said without enthusiasm is a polite way to say \"I disagree.\"",
    example: "\"That's interesting...\" (pause, no follow-up) = I disagree",
    room: "culture",
    difficulty: 2,
  },
  {
    pillar: "culture",
    item_type: "phrase",
    title: "RSVP Obligation",
    content: "RSVP = \"Répondez s'il vous plaît\". You MUST respond — even if you can't attend.",
    explanation: "In Anglo culture, ignoring an RSVP is considered rude. Always respond, even if you can't go.",
    example: "\"Thank you for the invitation, but I won't be able to attend.\"",
    room: "culture",
    difficulty: 1,
  },
  // Communication items
  {
    pillar: "comm",
    item_type: "phrase",
    title: "\"Could You\" — Polite Requests",
    content: "\"Could you\" is more polite than \"Can you\". \"Would you mind\" is even more polite.",
    explanation: "English has a politeness hierarchy: \"Can you\" < \"Could you\" < \"Would you mind\" < \"I was wondering if\".",
    example: "\"Could you pass the salt?\" (polite) → \"Would you mind passing the salt?\" (very polite)",
    room: "comm",
    difficulty: 1,
  },
  {
    pillar: "comm",
    item_type: "rule",
    title: "Hedging Language",
    content: "Americans hedge to sound less direct: \"I think maybe we could possibly...\"",
    explanation: "Hedging softens requests and opinions. It's not weakness — it's cultural politeness.",
    example: "\"I was wondering if you might be able to...\" (polite request)",
    room: "comm",
    difficulty: 2,
  },
];

/* ------------------------------------------------------------------ */
/*  Population Functions                                               */
/* ------------------------------------------------------------------ */

export async function populatePalaceRooms(userId: string, palaceId: string) {
  const rooms = PALACE_ROOMS.map((room) => ({
    palace_id: palaceId,
    user_id: userId,
    room_id: room.id,
    name: room.name,
    pillar: room.pillar,
    description: room.description,
    icon: room.icon,
    unlocked: room.unlock_stage === "roots",
    grid_x: room.grid_x,
    grid_y: room.grid_y,
    connected_to: room.connected_to,
  }));

  const { error } = await supabase.from("palace_rooms").upsert(rooms, {
    onConflict: "palace_id,room_id",
  });
  return { error };
}

export async function populateVocabItems(userId: string, palaceId: string) {
  const items = VOCAB_SEEDS.map((item) => ({
    palace_id: palaceId,
    user_id: userId,
    pillar: item.pillar,
    item_type: item.item_type,
    title: item.title,
    content: item.content,
    explanation: item.explanation,
    example: item.example,
    room: item.room,
    difficulty: item.difficulty,
    source: "manual" as const,
    ease_factor: 2.5,
    interval_days: 0,
    repetitions: 0,
    next_review: new Date().toISOString(),
    last_review: null,
    status: "new" as const,
    created_at: new Date().toISOString(),
    review_count: 0,
    correct_count: 0,
  }));

  const { error } = await supabase.from("palace_items").upsert(items, {
    onConflict: "palace_id,title",
  });
  return { error };
}

export async function populateCulturalAtoms() {
  const atoms = CULTURAL_ATOMS.map((atom) => ({
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

  const { error } = await supabase.from("cultural_atoms").upsert(atoms, {
    onConflict: "atom_name",
  });
  return { error };
}

// Master function to populate all content
export async function populateAllContent(userId: string, palaceId: string) {
  const results = {
    rooms: await populatePalaceRooms(userId, palaceId),
    vocab: await populateVocabItems(userId, palaceId),
    atoms: await populateCulturalAtoms(),
  };
  return results;
}
