"use client";

import React, { useState, useCallback } from "react";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { supabase } from "@/lib/auth";

type Tab = "signin" | "signup";

export default function SignInPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOAuthGoogle = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { error: oauthError } = await supabase().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOAuthApple = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { error: oauthError } = await supabase().auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (oauthError) setError(oauthError.message);
    } catch {
      setError("Failed to sign in with Apple.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (!email.trim()) {
        setError("Email is required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      try {
        if (tab === "signin") {
          const { error: signInError } =
            await supabase().auth.signInWithPassword({ email, password });
          if (signInError) setError(signInError.message);
        } else {
          const { error: signUpError } = await supabase().auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (signUpError) {
            setError(signUpError.message);
          } else {
            setError(
              "Check your email for the confirmation link."
            );
          }
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, tab]
  );

  const tabActiveStyle: React.CSSProperties = {
    ...styles.tab,
    color: colors.phosphor,
    borderBottomColor: colors.phosphor,
  };

  const tabInactiveStyle: React.CSSProperties = {
    ...styles.tab,
    color: colors.zinc,
    borderBottomColor: "transparent",
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Title */}
        <h1 style={styles.title}>Enter the Underground</h1>
        <p style={styles.subtitle}>Your path begins here</p>

        {/* Tab Switcher */}
        <div style={styles.tabRow}>
          <button
            type="button"
            style={tab === "signin" ? tabActiveStyle : tabInactiveStyle}
            onClick={() => {
              setTab("signin");
              setError("");
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            style={tab === "signup" ? tabActiveStyle : tabInactiveStyle}
            onClick={() => {
              setTab("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* OAuth Buttons */}
        <button
          type="button"
          style={{
            ...styles.googleButton,
            ...(loading ? { opacity: 0.5, pointerEvents: "none" as const } : {}),
          }}
          onClick={handleOAuthGoogle}
          disabled={loading}
        >
          <span style={styles.googleIcon}>G</span>
          <span style={styles.googleButtonText}>Continue with Google</span>
        </button>

        <button
          type="button"
          style={{
            ...styles.appleButton,
            ...(loading ? { opacity: 0.5, pointerEvents: "none" as const } : {}),
          }}
          onClick={handleOAuthApple}
          disabled={loading}
        >
          <span style={styles.appleIcon}>&#63743;</span>
          <span style={styles.appleButtonText}>Continue with Apple</span>
        </button>

        {/* Divider */}
        <div style={styles.dividerRow}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleEmailSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete={
                tab === "signin" ? "current-password" : "new-password"
              }
            />
          </div>

          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(loading ? { opacity: 0.5, pointerEvents: "none" as const } : {}),
            }}
            disabled={loading}
          >
            {tab === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {/* Error Display */}
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    padding: spacing.md,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing[8],
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontFamily: typography.display.fontFamily,
    fontSize: typography.heading.xl.fontSize,
    lineHeight: typography.heading.xl.lineHeight,
    fontWeight: typography.heading.xl.fontWeight,
    color: colors.ivory,
    textAlign: "center",
    margin: 0,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontSize: typography.bodyItalic.fontSize,
    fontStyle: typography.bodyItalic.fontStyle,
    color: colors.zinc,
    textAlign: "center",
    margin: 0,
    marginBottom: spacing[6],
  },
  tabRow: {
    display: "flex",
    marginBottom: spacing[6],
    borderBottom: `1px solid ${colors.borderSubtle}`,
  },
  tab: {
    flex: 1,
    background: "none",
    border: "none",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    paddingBottom: spacing.sm,
    paddingTop: spacing.sm,
    cursor: "pointer",
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    fontWeight: typography.ui.fontWeight,
    transition: "color 0.2s, border-color 0.2s",
  },
  googleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: radius.btn,
    padding: `${spacing.sm}px ${spacing.md}px`,
    border: "none",
    cursor: "pointer",
    marginBottom: spacing.sm,
    width: "100%",
  },
  googleIcon: {
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#4285F4",
    marginRight: spacing.sm,
    fontFamily: "sans-serif",
  },
  googleButtonText: {
    color: "#3c4043",
    fontSize: 16,
    fontFamily: typography.ui.fontFamily,
  },
  appleButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    borderRadius: radius.btn,
    padding: `${spacing.sm}px ${spacing.md}px`,
    border: "none",
    cursor: "pointer",
    marginBottom: spacing.sm,
    width: "100%",
  },
  appleIcon: {
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "#FFFFFF",
    marginRight: spacing.sm,
  },
  appleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.ui.fontFamily,
  },
  dividerRow: {
    display: "flex",
    alignItems: "center",
    margin: `${spacing.md}px 0`,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    color: colors.zinc,
    fontSize: 13,
    fontFamily: typography.ui.fontFamily,
    paddingLeft: spacing.sm,
    paddingRight: spacing.sm,
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    display: "block",
    color: colors.zinc,
    fontSize: typography.ui.fontSize,
    fontFamily: typography.ui.fontFamily,
    marginBottom: spacing.xs,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    backgroundColor: colors.obsidian,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.sm,
    color: colors.ivory,
    fontSize: 16,
    padding: spacing.sm,
    fontFamily: typography.body.fontFamily,
    outline: "none",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.phosphor,
    color: colors.onPhosphor,
    borderRadius: radius.btn,
    padding: `${spacing.sm}px ${spacing.md}px`,
    border: "none",
    cursor: "pointer",
    fontFamily: typography.ui.fontFamily,
    fontSize: 16,
    fontWeight: "bold" as const,
    marginTop: spacing.sm,
  },
  error: {
    color: colors.crimson,
    fontSize: typography.ui.fontSize,
    fontFamily: typography.ui.fontFamily,
    textAlign: "center",
    marginTop: spacing.md,
    marginBottom: 0,
  },
};
