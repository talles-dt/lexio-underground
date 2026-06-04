// Supabase client auto-initialized via environment
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
if (process.env.NODE_ENV !== "test" && process.env.BUILD_ENV !== "EXPO") {
  process.env.SUPABASE_URL =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.SUPABASE_ANON_KEY =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    dotenv.config({ path: path.resolve("../../.env.local") });
    process.env.SUPABASE_URL =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.SUPABASE_ANON_KEY =
      process.env.SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase =
  !supabaseUrl || !supabaseAnonKey
    ? // Mock during build/test
      {}
    : createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
