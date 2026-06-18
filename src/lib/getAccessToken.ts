"use client";

import { supabase } from "@/lib/supabase";

/**
 * Get the current user's access token from the Supabase session.
 * Use this in admin page components to authenticate API calls.
 */
export async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || "";
}
