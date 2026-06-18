"use client";

import { useAuth } from "@/lib/auth";
import { useLearnerStore } from "@/stores/learnerStore";

/**
 * Returns true when user has full app access:
 * - Authenticated AND diagnostic complete
 */
export function useHasAccess(): boolean {
  const { user } = useAuth();
  const cartografaComplete = useLearnerStore((s) => s.cartografaComplete);
  if (!user) return false;
  return cartografaComplete;
}

/**
 * Returns true when user is an admin or super_admin.
 * Checks the `role` field loaded from the users table.
 */
export function useIsAdmin(): boolean {
  const role = useLearnerStore((s) => s.role);
  return role === "admin" || role === "super_admin";
}
