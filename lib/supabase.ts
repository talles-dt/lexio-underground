import { createClient } from "@supabase/supabase-js";

let supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseInstance;

if (
  process.env.NODE_ENV === "test" ||
  process.env.BUILD_ENV === "EXPO" ||
  process.env.NODE_ENV === "production"
) {
  supabaseInstance = {};
} else {
  if (!supabaseUrl || !supabaseAnonKey) {
    const { createClient } = require("@supabase/supabase-js");
    const dotenv = require("dotenv");
    dotenv.config({ path: "../../.env.local" });
    // Re-check after loading .env.local
    supabaseUrl =
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    supabaseAnonKey =
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or anon key not provided");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
export { supabaseInstance as default };
