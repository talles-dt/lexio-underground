"use client";

import React, { useState } from "react";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { MaturityStages } from "@/components/MaturityStages";
import { NimUsageDashboard } from "@/components/NimUsageDashboard";

type ProfileTab = "identity" | "usage";

export default function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("identity");

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
      paddingBottom: 80, // space for bottom nav
    }}>
      {/* Tab switcher */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: spacing[2],
        padding: `${spacing[4]}px ${spacing[4]}px ${spacing[2]}px`,
      }}>
        <TabButton active={tab === "identity"} onClick={() => setTab("identity")}>
          Identidade
        </TabButton>
        <TabButton active={tab === "usage"} onClick={() => setTab("usage")}>
          Uso de IA
        </TabButton>
      </div>

      {tab === "identity" && <MaturityStages currentStage="sprouts" />}
      {tab === "usage" && <NimUsageDashboard />}
    </div>
  );
}

function TabButton({ active, onClick, children }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        borderBottom: active ? `2px solid ${colors.phosphor}` : "2px solid transparent",
        color: active ? colors.phosphor : colors.zinc,
        cursor: "pointer",
        fontFamily: typography.ui.fontFamily,
        fontSize: typography.ui.fontSize,
        fontWeight: active ? 600 : 400,
        padding: `${spacing[1]}px ${spacing[3]}px`,
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {children}
    </button>
  );
}
