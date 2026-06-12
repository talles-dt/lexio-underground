import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  "";

// Regular client (for reads, auth)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (bypasses RLS — for inserts/writes in API routes)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          priority_language: string;
          tier: "free" | "pro_lifetime" | "family";
          created_at: string;
          family_group_id: string | null;
          locale: string;
          found_member: boolean;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      cartografa_sessions: {
        Row: {
          id: string;
          user_id: string;
          language: string;
          timestamp: string;
          pillar_scores: Record<string, unknown>;
          map_of_ignorance: Record<string, unknown>;
          raw_response_log: Record<string, unknown> | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cartografa_sessions"]["Row"],
          "id" | "timestamp"
        >;
        Update: Partial<
          Database["public"]["Tables"]["cartografa_sessions"]["Insert"]
        >;
      };
      palace_items: {
      Row: {
      id: string;
      palace_id: string;
      word: string;
      chunk: string;
      grammar_notes: string | null;
      cultural_atom_id: string | null;
      pronunciation_url: string | null;
      learned_at: number;
      next_review: number | null;
      };
      Insert: Omit<Database["public"]["Tables"]["palace_items"]["Row"], "id">;
      Update: Partial<Database["public"]["Tables"]["palace_items"]["Insert"]>;
      };
      learner_progression: {
      Row: {
      user_id: string;
      language: string;
      maturity_stage: string;
      pillar_weights: Record<string, number>;
      last_cartografa_date: string | null;
      palace_room_names: string[];
      };
      Insert: Omit<
      Database["public"]["Tables"]["learner_progression"]["Row"],
      "user_id" | "language"
      > & { user_id: string; language: string };
      Update: Partial<Database["public"]["Tables"]["learner_progression"]["Insert"]>;
      };
      };
      };
};
