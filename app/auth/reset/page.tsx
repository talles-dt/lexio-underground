"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { supabase } from "@/lib/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
          // Redirect to sign in after a short delay
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

  if (success) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <h1 style={s.title}>Password Updated</h1>
          <p style={s.message}>
            Your password has been changed successfully. Redirecting you to sign in…
          </p>
        </div>
      </div>
    );
  }

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
