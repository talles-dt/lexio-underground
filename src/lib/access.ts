"use client";

import { useAuth } from "@/lib/auth";
import { useLearnerStore } from "@/stores/learnerStore";

/**
 * Returns true only when:
 * 1. User is authenticated (has a Supabase session)
 * 2. User has completed the Cartografa diagnostic
 *
 * Used to gate all app sections (nav, quick links, etc.)
 */
export function useHasAccess(): boolean {
  const { user } = useAuth();
  const cartografaComplete = useLearnerStore((s) => s.cartografaComplete);
  return !!user && cartografaComplete;
}
