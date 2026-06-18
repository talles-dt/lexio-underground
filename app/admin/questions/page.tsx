"use client";

import React from "react";
import { colors, spacing, typography } from "@/theme/tokens";

export default function AdminQuestionsPage() {
  return (
    <div>
      <h1 style={{ ...typography.display, color: colors.ivory, margin: 0, marginBottom: spacing[1] }}>
        Question Bank
      </h1>
      <p style={{ ...typography.body, color: colors.zinc, margin: 0, marginBottom: spacing[6] }}>
        Manage Cartografa diagnostic questions — add, edit, reorder, and tune difficulty.
      </p>

      <div style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.borderSubtle}`,
        borderRadius: 12,
        padding: spacing[8],
        textAlign: "center",
      }}>
        <p style={{ ...typography.bodyLg, color: colors.zinc, margin: 0 }}>
          🚧 Coming soon — question bank editor
        </p>
        <p style={{ ...typography.caption, color: `${colors.zinc}80`, margin: 0, marginTop: spacing[2] }}>
          This page will let you CRUD questions per pillar, adjust difficulty tiers, and preview the adaptive flow.
        </p>
      </div>
    </div>
  );
}
