"use client";

import React from "react";
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
import type { CookieOptions } from "@supabase/ssr";
import { useLearnerStore } from "@/stores/learnerStore";

// ─── Cookie helpers ────────────────────────────────────────────
const COOKIE_PREFIX = "sb";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, options?: CookieOptions) {
  let cookie = `${name}=${encodeURIComponent(value)}`;
  if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
  if (options?.path) cookie += `; path=${options.path}`;
  if (options?.domain) cookie += `; domain=${options.domain}`;
  if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
  if (options?.secure || typeof window !== "undefined" && window.location.protocol === "https:") {
    cookie += "; secure";
  }
  document.cookie = cookie;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; max-age=0; path=/`;
}

// ─── Supabase client factory ───────────────────────────────────
let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    if (!url || !key) {
      return createClient("https://placeholder.supabase.co", "placeholder");
    }

    _supabase = createClient(url, key, {
      auth: {
        storage: {
          getItem: (key: string) => {
            // Try cookie first, then localStorage
            return getCookie(key) ?? localStorage.getItem(key);
          },
          setItem: (key: string, value: string) => {
            setCookie(key, value, { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" });
            localStorage.setItem(key, value);
          },
          removeItem: (key: string) => {
            removeCookie(key);
            localStorage.removeItem(key);
          },
        },
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
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
  signInWithApple: () => Promise<{ error: string | null }>;
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
    const client = getSupabase();

    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync auth state → learner store
  const setAuth = useLearnerStore((s) => s.setAuth);
  useEffect(() => {
    if (state.user && !state.loading) {
      setAuth(state.user.id, state.user.email || "");
    }
  }, [state.user, state.loading, setAuth]);

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
    const { error, data } = await getSupabase().auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message || null, data };
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

  // Sign in with Apple OAuth
  const signInWithApple = useCallback(async () => {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { error: error?.message || null };
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut();
    // Clear all auth cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      if (name.startsWith("sb-") || name.startsWith("supabase")) {
        removeCookie(name);
      }
    });
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
        signInWithApple,
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
