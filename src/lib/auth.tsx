"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { User, Session } from "@supabase/supabase-js";

// Lazy-init so SSR prerendering doesn't crash when env vars are missing
let _supabase: SupabaseClient | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url || !key) {
      // Return a dummy client that will fail gracefully
      // This only happens during SSR prerendering of static pages
      return createClient("https://placeholder.supabase.co", "placeholder");
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

// ─── TYPES ──────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signUp: (
    email: string,
    password: string,
    name?: string
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  linkSession: (shareToken: string) => Promise<{ error: string | null }>;
}

// ─── CONTEXT ────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ─── PROVIDER ───────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = getSupabase().auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Get initial session
    getSupabase().auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up with email/password
  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      const { error } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: name ? { name } : undefined,
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      return { error: error?.message || null };
    },
    []
  );

  // Sign in with email/password
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message || null };
  }, []);

  // Sign in with Google OAuth
  const signInWithGoogle = useCallback(async () => {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error?.message || null };
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
  }, []);

  // Link a diagnostic session to the current user
  const linkSession = useCallback(
    async (shareToken: string) => {
      if (!state.user) return { error: "Not authenticated" };

      const { error } = await getSupabase()
        .from("diagnostic_sessions")
        .update({ user_id: state.user.id })
        .eq("share_token", shareToken);

      return { error: error?.message || null };
    },
    [state.user]
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        linkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ───────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { getSupabase as supabase };
