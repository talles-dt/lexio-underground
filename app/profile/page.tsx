"use client";

import React from "react";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { MaturityStages } from "@/components/MaturityStages";

export default function ProfilePage() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
    }}>
      <MaturityStages currentStage="sprouts" />
    </div>
  );
}
