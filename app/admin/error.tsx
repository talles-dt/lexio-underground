"use client";

import React from "react";
import { colors, spacing, typography, radius } from "@/theme/tokens";

export default function PageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      minHeight: "60dvh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing[4],
    }}>
      <div style={{
        maxWidth: 420,
        textAlign: "center",
        backgroundColor: colors.surface,
        borderRadius: radius.card,
        padding: spacing[6],
      }}>
        <h2 style={{
          ...typography.h2,
          color: colors.crimson,
          margin: 0,
          marginBottom: spacing[2],
        }}>
          Error loading page
        </h2>
        <p style={{
          ...typography.body,
          color: colors.zinc,
          margin: 0,
          marginBottom: spacing[4],
        }}>
          Something went wrong while loading this section.
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
            fontSize: 13,
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
