import { createClient, SupabaseClient } from "@supabase/supabase-js";

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
// Throws if service key is missing — fail fast, don't silently degrade
let _supabaseAdmin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    if (!supabaseServiceKey) {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY is not set. " +
        "Admin APIs cannot function without the service role key."
      );
    }
    _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  }
  return _supabaseAdmin;
}

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
          stripe_customer_id: string | null;
          role: "user" | "admin" | "super_admin";
          consent_given: boolean;
          consent_date: string | null;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      admin_bypasses: {
        Row: {
          id: string;
          user_id: string;
          granted_by: string;
          bypass_type: "payment" | "early_access" | "partnership" | "other";
          reason: string;
          partnership_id: string | null;
          is_active: boolean;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_bypasses"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["admin_bypasses"]["Insert"]>;
      };
      admin_partnerships: {
        Row: {
          id: string;
          name: string;
          contact_email: string | null;
          contact_name: string | null;
          partnership_type: "school" | "company" | "influencer" | "other";
          max_bypasses: number;
          bypasses_used: number;
          is_active: boolean;
          starts_at: string;
          expires_at: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_partnerships"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["admin_partnerships"]["Insert"]>;
      };
      admin_audit_log: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Record<string, unknown> | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_audit_log"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["admin_audit_log"]["Insert"]>;
      };
      diagnostic_sessions: {
        Row: {
          id: string;
          email: string;
          user_id: string | null;
          interest: string | null;
          pillar_scores: Record<string, unknown>;
          map_of_ignorance: Record<string, unknown>[];
          overall_readiness: string;
          recommended_focus: string[];
          identity_callout: string | null;
          archetype_key: string;
          archetype_name: string;
          raw_response_log: Record<string, unknown> | null;
          total_questions: number;
          total_correct: number;
          duration_seconds: number;
          share_token: string;
          completed_at: string | null;
          state: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["diagnostic_sessions"]["Row"],
          "id" | "created_at" | "updated_at" | "share_token"
        >;
        Update: Partial<
          Database["public"]["Tables"]["diagnostic_sessions"]["Insert"]
        >;
      };
      palace: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string | null;
          rooms: Record<string, unknown>[];
          blueprint: Record<string, unknown>;
          pulse_streak: number;
          last_pulse_at: string | null;
          next_pulse_at: string;
          overall_readiness: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["palace"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["palace"]["Insert"]>;
      };
      palace_items: {
        Row: {
          id: string;
          palace_id: string;
          user_id: string | null;
          source: string;
          pillar: string;
          item_type: string;
          title: string;
          content: string;
          explanation: string | null;
          difficulty: number;
          room: string;
          grid_x: number;
          grid_y: number;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          next_review: string;
          last_review: string | null;
          review_count: number;
          icon: string | null;
          is_mastered: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["palace_items"]["Row"],
          "id" | "created_at"
        >;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["learner_progression"]["Row"],
          "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["learner_progression"]["Insert"]
        >;
      };
      cultural_atoms: {
        Row: {
          id: string;
          language: string;
          region: string;
          atom_name: string;
          description: string;
          pillar_tags: string[];
          difficulty_tier: number;
          meme_vault_id: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["cultural_atoms"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["cultural_atoms"]["Insert"]>;
      };
      session_events: {
        Row: {
          id: string;
          user_id: string;
          session_type: "pulse" | "deep" | "shadow";
          duration_seconds: number;
          items_covered: number;
          completed_flag: boolean;
          pillar: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["session_events"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["session_events"]["Insert"]>;
      };
      family_challenges: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          language: string;
          content_type: "text" | "image" | "audio";
          content_url: string | null;
          text_caption: string | null;
          created_at: string;
          expires_at: string | null;
          receiver_response: "accepted" | "declined" | "pending" | null;
          responded_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["family_challenges"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["family_challenges"]["Insert"]
        >;
      };
      nim_usage: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          tokens_used: number;
          calls_count: number;
          month_year: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["nim_usage"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<Database["public"]["Tables"]["nim_usage"]["Insert"]>;
      };
    };
  };
};
