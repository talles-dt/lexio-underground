"use client";

import React from "react";
import { colors, spacing, typography, radius } from "@/theme/tokens";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: "100dvh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing[4],
    }}>
      <div style={{
        maxWidth: 480,
        textAlign: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        padding: spacing[8],
      }}>
        <h1 style={{
          ...typography.h1,
          color: colors.crimson,
          margin: 0,
          marginBottom: spacing[2],
        }}>
          Something went wrong
        </h1>
        <p style={{
          ...typography.body,
          color: colors.zinc,
          margin: 0,
          marginBottom: spacing[4],
        }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          style={{
            backgroundColor: colors.phosphor,
            color: colors.obsidian,
            border: "none",
            borderRadius: radius.btn,
            cursor: "pointer",
            fontFamily: typography.ui.fontFamily,
            fontSize: 14,
            fontWeight: 700,
            padding: `${spacing[2]}px ${spacing[4]}px`,
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
