"use client";

import React, { useState } from "react";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { MaturityStages } from "@/components/MaturityStages";
import { NimUsageDashboard } from "@/components/NimUsageDashboard";
import { getTimeAwareContent } from "@/lib/timeOfDay";

type ProfileTab = "identity" | "usage";

export default function ProfilePage() {
  const [tab, setTab] = useState<ProfileTab>("identity");
  const timeContent = getTimeAwareContent();

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      color: colors.ivory,
      paddingBottom: 80,
    }}>
      {/* Greeting banner */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.surface} 0%, ${colors.obsidian} 100%)`,
        borderBottom: `1px solid ${colors.borderSubtle}`,
        padding: `${spacing[4]}px ${spacing[4]}px`,
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p style={{
            fontFamily: typography.bodyItalic.fontFamily,
            fontStyle: typography.bodyItalic.fontStyle,
            fontSize: 13,
            color: colors.phosphor,
            margin: 0,
            marginBottom: spacing[1],
          }}>
            {timeContent.greeting}
          </p>
          <h1 style={{
            ...typography.h1,
            color: colors.ivory,
            margin: 0,
            marginBottom: spacing[1],
          }}>
            Your Profile
          </h1>
          {timeContent.culturalAtom && (
            <p style={{
              fontFamily: typography.bodyItalic.fontFamily,
              fontStyle: typography.bodyItalic.fontStyle,
              fontSize: 12,
              color: colors.zinc,
              margin: 0,
            }}>
              💡 {timeContent.culturalAtom}
            </p>
          )}
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: spacing[3],
        padding: `${spacing[3]}px ${spacing[4]}px ${spacing[1]}px`,
      }}>
        <TabButton active={tab === "identity"} onClick={() => setTab("identity")}>
          🌱 Identity
        </TabButton>
        <TabButton active={tab === "usage"} onClick={() => setTab("usage")}>
          🤖 Uso de IA
        </TabButton>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: `0 ${spacing[4]}px` }}>
        {tab === "identity" && <MaturityStages currentStage="sprouts" />}
        {tab === "usage" && <NimUsageDashboard />}
      </div>
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
        fontSize: typography.ui.fontFamily,
        fontWeight: active ? 600 : 400,
        padding: `${spacing[1]}px ${spacing[3]}px`,
        transition: "color 0.2s, border-color 0.2s",
      }}
    >
      {children}
    </button>
  );
}
