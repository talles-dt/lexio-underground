"use client";

import { useAuth } from "@/lib/auth";
import { useLearnerStore } from "@/stores/learnerStore";

/**
 * Returns true when user has full app access.
 * Waits for the learner store to finish loading from Supabase
 * before returning a definitive answer.
 */
export function useHasAccess(): boolean {
  const { user } = useAuth();
  const cartografaComplete = useLearnerStore((s) => s.cartografaComplete);
  const isLoaded = useLearnerStore((s) => s.isLoaded);
  if (!user) return false;
  // If store hasn't loaded yet, don't gate — let the loading state show
  if (!isLoaded) return false;
  return cartografaComplete;
}

/**
 * Returns { access, loading } so pages can show a loading state
 * while the store is fetching user data.
 */
export function useHasAccessWithLoading(): { access: boolean; loading: boolean } {
  const { user } = useAuth();
  const cartografaComplete = useLearnerStore((s) => s.cartografaComplete);
  const isLoaded = useLearnerStore((s) => s.isLoaded);
  if (!user) return { access: false, loading: false };
  if (!isLoaded) return { access: false, loading: true };
  return { access: cartografaComplete, loading: false };
}

/**
 * Returns true when user is an admin or super_admin.
 */
export function useIsAdmin(): boolean {
  const role = useLearnerStore((s) => s.role);
  return role === "admin" || role === "super_admin";
}
