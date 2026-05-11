import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          priority_language: string;
          tier: 'free' | 'pro_lifetime' | 'family';
          created_at: string;
          family_group_id: string | null;
          locale: string;
          found_member: boolean;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['cartografa_sessions']['Row'], 'id' | 'timestamp'>;
        Update: Partial<Database['public']['Tables']['cartografa_sessions']['Insert']>;
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
        Insert: Omit<Database['public']['Tables']['palace_items']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['palace_items']['Insert']>;
      };
    };
  };
};