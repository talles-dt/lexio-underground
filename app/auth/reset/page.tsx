"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { supabase } from "@/lib/auth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [tokenReady, setTokenReady] = useState(false);

  // Supabase puts the token in the URL fragment (#access_token=...).
  // Next.js can't read fragments server-side, so we extract them client-side
  // and exchange them for a session via the Supabase auth API.
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("access_token")) {
      // Parse the fragment params
      const params = new URLSearchParams(hash.replace("#", "?"));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        // Exchange the tokens for a session
        supabase().auth
          .setSession({ access_token, refresh_token })
          .then(({ error }) => {
            if (error) {
              setError("Invalid or expired reset link. Please request a new one.");
            } else {
              setTokenReady(true);
            }
          });
      } else {
        setError("Invalid reset link. Please request a new one.");
      }
    } else {
      // No hash fragment — check if there are query params (some Supabase configs use ? instead)
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      if (accessToken && refreshToken) {
        supabase().auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ error }) => {
            if (error) {
              setError("Invalid or expired reset link. Please request a new one.");
            } else {
              setTokenReady(true);
            }
          });
      } else {
        setError("Invalid reset link. Please request a new one.");
      }
    }
  }, [searchParams]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);
      try {
        const { error: updateError } = await supabase().auth.updateUser({ password });
        if (updateError) {
          setError(updateError.message);
        } else {
          setSuccess(true);
          setTimeout(() => router.push("/signin"), 3000);
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [password, confirmPassword, router]
  );

  // Loading state while we exchange the token
  if (!tokenReady && !error) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{
            width: 32, height: 32,
            border: `3px solid ${colors.borderSubtle}`,
            borderTopColor: colors.phosphor,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ ...s.subtitle, marginTop: spacing[3] }}>Verifying reset link…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !tokenReady) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Link Error</h1>
          <p style={s.message}>{error}</p>
          <button
            onClick={() => router.push("/signin")}
            style={{ ...s.submit, marginTop: spacing[4] }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Password Updated</h1>
          <p style={s.message}>Your password has been changed. Redirecting you to sign in…</p>
        </div>
      </div>
    );
  }

  // Reset form
  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>New Password</h1>
        <p style={s.subtitle}>Choose a strong password for your account</p>

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.inputGroup}>
            <label style={s.label}>New Password</label>
            <input
              type="password"
              style={s.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="new-password"
            />
          </div>

          <div style={s.inputGroup}>
            <label style={s.label}>Confirm Password</label>
            <input
              type="password"
              style={s.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            style={{
              ...s.submit,
              ...(loading ? { opacity: 0.5, pointerEvents: "none" as const } : {}),
            }}
            disabled={loading}
          >
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>

        {error && <p style={s.error}>{error}</p>}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
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
  message: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.zinc,
    textAlign: "center",
    margin: 0,
  },
  form: { display: "flex", flexDirection: "column" },
  inputGroup: { marginBottom: spacing.md },
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
  submit: {
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={s.page}>
        <div style={s.card}>
          <div style={{
            width: 32, height: 32,
            border: `3px solid ${colors.borderSubtle}`,
            borderTopColor: colors.phosphor,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
