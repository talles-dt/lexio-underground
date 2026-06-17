"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/auth";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface NimUsageInput {
  endpoint: string;
  tokens_used: number;
  calls_count?: number;
  month_year?: string; // YYYY-MM format, defaults to current month
}

export interface NimUsageRecord {
  id: string;
  user_id: string;
  endpoint: string;
  tokens_used: number;
  calls_count: number;
  month_year: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Log NIM usage (fire-and-forget)                                    */
/* ------------------------------------------------------------------ */

export async function logNimUsage(
  input: NimUsageInput
): Promise<{ error: string | null }> {
  try {
    const client = supabase();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) return { error: "Not authenticated" };

    const now = new Date();
    const month_year = input.month_year || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // Upsert: increment existing record for this user/endpoint/month
    const { data: existing } = await client
      .from("nim_usage")
      .select("id, tokens_used, calls_count")
      .eq("user_id", user.id)
      .eq("endpoint", input.endpoint)
      .eq("month_year", month_year)
      .limit(1)
      .single();

    if (existing && existing.id) {
      const { error } = await client
        .from("nim_usage")
        .update({
          tokens_used: (existing.tokens_used || 0) + input.tokens_used,
          calls_count: (existing.calls_count || 0) + (input.calls_count || 1),
        })
        .eq("id", existing.id);
      return { error: error?.message || null };
    }

    const { error } = await client.from("nim_usage").insert({
      user_id: user.id,
      endpoint: input.endpoint,
      tokens_used: input.tokens_used,
      calls_count: input.calls_count || 1,
      month_year,
    });

    return { error: error?.message || null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ------------------------------------------------------------------ */
/*  Fetch usage summary                                                */
/* ------------------------------------------------------------------ */

export async function getNimUsageSummary(
  month_year?: string
): Promise<{ data: NimUsageRecord[]; error: string | null }> {
  try {
    const client = supabase();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) return { data: [], error: "Not authenticated" };

    const now = new Date();
    const ym = month_year || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const { data, error } = await client
      .from("nim_usage")
      .select("*")
      .eq("user_id", user.id)
      .eq("month_year", ym)
      .order("tokens_used", { ascending: false });

    return { data: (data as NimUsageRecord[]) || [], error: error?.message || null };
  } catch (err) {
    return { data: [], error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ------------------------------------------------------------------ */
/*  React hook: useNimTracker                                          */
/* ------------------------------------------------------------------ */

export function useNimTracker() {
  const log = useCallback(async (input: NimUsageInput) => {
    return logNimUsage(input);
  }, []);

  const getSummary = useCallback(async (month_year?: string) => {
    return getNimUsageSummary(month_year);
  }, []);

  return { log, getSummary };
}

/* ------------------------------------------------------------------ */
/*  Helper: estimate tokens from text                                  */
/* ------------------------------------------------------------------ */

export function estimateTokens(text: string): number {
  // Rough estimate: ~4 chars per token for English/Portuguese
  return Math.ceil(text.length / 4);
}

/* ------------------------------------------------------------------ */
/*  Helper: cost estimate                                             */
/* ------------------------------------------------------------------ */

export function estimateCost(tokens: number, model: string = "gpt-4o"): number {
  // Approximate costs per 1K tokens (USD)
  const rates: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 0.0025, output: 0.01 },
    "gpt-4o-mini": { input: 0.00015, output: 0.0006 },
    "llama-3.1-70b": { input: 0.0009, output: 0.0009 },
    "mistral-large": { input: 0.002, output: 0.006 },
  };

  const rate = rates[model] || rates["gpt-4o"];
  // Assume 60% input, 40% output
  const inputTokens = Math.floor(tokens * 0.6);
  const outputTokens = Math.floor(tokens * 0.4);
  return (inputTokens / 1000) * rate.input + (outputTokens / 1000) * rate.output;
}
