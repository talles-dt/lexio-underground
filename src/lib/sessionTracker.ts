"use client";

import { useCallback } from "react";
import { supabase } from "@/lib/auth";
import { useLearnerStore } from "@/stores/learnerStore";
import { recordSessionStart } from "@/lib/timeOfDay";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type SessionType = "pulse" | "deep" | "shadow";

export interface SessionEventInput {
  session_type: SessionType;
  duration_seconds: number;
  items_covered: number;
  completed_flag: boolean;
  pillar?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionEvent extends SessionEventInput {
  id: string;
  user_id: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Log a session event (client-side, fire-and-forget)                 */
/* ------------------------------------------------------------------ */

export async function logSessionEvent(
  input: SessionEventInput
): Promise<{ error: string | null }> {
  try {
    const client = supabase();
    const {
      data: { user },
    } = await client.auth.getUser();

    if (!user) {
      // Store locally for later sync — queue in localStorage
      queueOfflineEvent(input);
      return { error: null };
    }

    const { error } = await client.from("session_events").insert({
      user_id: user.id,
      session_type: input.session_type,
      duration_seconds: input.duration_seconds,
      items_covered: input.items_covered,
      completed_flag: input.completed_flag,
      pillar: input.pillar || null,
      metadata: input.metadata || {},
    });

    return { error: error?.message || null };
  } catch (err) {
    queueOfflineEvent(input);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/* ------------------------------------------------------------------ */
/*  Offline queue (localStorage)                                       */
/* ------------------------------------------------------------------ */

const QUEUE_KEY = "lexio_session_events_queue";

function queueOfflineEvent(input: SessionEventInput): void {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const queue: SessionEventInput[] = raw ? JSON.parse(raw) : [];
    queue.push(input);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // localStorage full or unavailable — silently drop
  }
}

export async function flushOfflineQueue(): Promise<number> {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return 0;
    const queue: SessionEventInput[] = JSON.parse(raw);
    if (queue.length === 0) return 0;

    const client = supabase();
    const {
      data: { user },
    } = await client.auth.getUser();
    if (!user) return 0;

    const rows = queue.map((evt) => ({
      user_id: user.id,
      session_type: evt.session_type,
      duration_seconds: evt.duration_seconds,
      items_covered: evt.items_covered,
      completed_flag: evt.completed_flag,
      pillar: evt.pillar || null,
      metadata: evt.metadata || {},
    }));

    const { error } = await client.from("session_events").insert(rows);
    if (error) return 0;

    localStorage.removeItem(QUEUE_KEY);
    return rows.length;
  } catch {
    return 0;
  }
}

/* ------------------------------------------------------------------ */
/*  React hook: useSessionTracker                                      */
/* ------------------------------------------------------------------ */

export function useSessionTracker() {
  const addPalaceItem = useLearnerStore((s) => s.addPalaceItem);
  const updatePillarScore = useLearnerStore((s) => s.updatePillarScore);

  const startSession = useCallback((): {
    elapsed: () => number;
    end: (input: Omit<SessionEventInput, "duration_seconds">) => Promise<{ error: string | null }>;
  } => {
    const started = Date.now();
    recordSessionStart(); // Track chronotype

    return {
      elapsed: () => Math.floor((Date.now() - started) / 1000),
      end: async (input) => {
        const duration_seconds = Math.floor((Date.now() - started) / 1000);
        const result = await logSessionEvent({ ...input, duration_seconds });

        // Update local store on successful session
        if (!result.error) {
          if (input.pillar) {
            // Small score bump for completing a session
            const delta = input.completed_flag ? 2 : 0.5;
            updatePillarScore(input.pillar, delta);
          }
          // Add palace items if any were covered
          if (input.items_covered > 0 && input.pillar) {
            for (let i = 0; i < Math.min(input.items_covered, 5); i++) {
              addPalaceItem(input.pillar);
            }
          }
        }

        return result;
      },
    };
  }, [addPalaceItem, updatePillarScore]);

  return { startSession, logSessionEvent, flushOfflineQueue };
}
