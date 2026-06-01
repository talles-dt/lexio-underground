import React from "react";
("use client");

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { colors, spacing, radius } from "@/theme/tokens";
import PalaceBlueprint from "@/components/PalaceBlueprint";
import PulseMode from "@/components/PulseMode";
import { useAuth } from "@/lib/auth";
import type { RoomData } from "@/components/PalaceBlueprint";
import type { PulseItem } from "@/components/PulseMode";
import type { ReviewResult } from "@/palace/spaced-repetition";

// ─── STYLES ─────────────────────────────────────────────────
const s = {
  page: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    padding: spacing[6],
    fontFamily: "system-ui, -apple-system, sans-serif",
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing[6],
    flexWrap: "wrap" as const,
    gap: spacing[3],
  } as React.CSSProperties,
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.ivory,
  } as React.CSSProperties,
  subtitle: {
    fontSize: 14,
    color: colors.zinc,
    fontStyle: "italic",
  } as React.CSSProperties,
  pulseBtn: {
    padding: "10px 24px",
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    border: "none",
    borderRadius: radius.btn,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
  } as React.CSSProperties,
  pulseBtnPulse: {
    animation: "pulse 2s infinite",
  } as React.CSSProperties,
  statRow: {
    display: "flex",
    gap: spacing[6],
    marginBottom: spacing[6],
    flexWrap: "wrap" as const,
    justifyContent: "center",
  } as React.CSSProperties,
  statCard: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: `${spacing[3]}px ${spacing[4]}px`,
    textAlign: "center" as const,
    minWidth: 120,
  } as React.CSSProperties,
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.phosphor,
  } as React.CSSProperties,
  statLabel: {
    fontSize: 11,
    color: colors.zinc,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginTop: spacing[1],
  } as React.CSSProperties,
  section: {
    marginBottom: spacing[8],
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: colors.ivory,
    marginBottom: spacing[3],
  } as React.CSSProperties,
  emptyState: {
    textAlign: "center" as const,
    padding: spacing[8],
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
  } as React.CSSProperties,
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  } as React.CSSProperties,
};

// ─── MOCK DATA (will be replaced by Supabase queries) ──────
const MOCK_ROOMS: RoomData[] = [
  {
    slug: "transformation-hall",
    name: "Transformation Hall",
    pillar: "grammar",
    description: "Surface → deep structure drills",
    icon: "🏛️",
    unlocked: true,
    itemsCount: 3,
    color: colors.phosphor,
  },
  {
    slug: "ignorance-map",
    name: "Ignorance Map Room",
    pillar: "logic",
    description: "What you don't know",
    icon: "🗺️",
    unlocked: true,
    itemsCount: 2,
    color: colors.amber,
  },
  {
    slug: "chunking-workshop",
    name: "Chunking Workshop",
    pillar: "vocab",
    description: "Words that travel together",
    icon: "🧩",
    unlocked: true,
    itemsCount: 5,
    color: colors.violet,
  },
  {
    slug: "context-reading-room",
    name: "Context Reading Room",
    pillar: "culture",
    description: "Meaning vs. words",
    icon: "📚",
    unlocked: false,
    itemsCount: 0,
    color: "#DC2626",
  },
  {
    slug: "fluency-arena",
    name: "Fluency Arena",
    pillar: "comm",
    description: "Speak before ready",
    icon: "🏟️",
    unlocked: false,
    itemsCount: 0,
    color: "#22C55E",
  },
];

const MOCK_PULSE_ITEMS: PulseItem[] = [
  {
    id: "p1",
    pillar: "grammar",
    title: "Make vs Do",
    content: "make a mistake",
    explanation:
      '"Make a mistake" é colocação fixa. Brasileiros frequentemente confundem porque "fazer" serve para ambos.',
    itemType: "chunk",
    icon: "🧩",
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
  },
  {
    id: "p2",
    pillar: "vocab",
    title: "Phrasal Verb",
    content: "put off = adiar",
    explanation: '"Put off" = adiar. Não confunda com "put away" (guardar).',
    itemType: "word",
    icon: "💎",
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
  },
  {
    id: "p3",
    pillar: "logic",
    title: "Since vs For",
    content: "since 2019 / for 3 years",
    explanation: '"Since" = ponto no tempo. "For" = duração.',
    itemType: "chunk",
    icon: "🔍",
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
  },
  {
    id: "p4",
    pillar: "culture",
    title: "Small Talk",
    content: '"How are you?" is not a question',
    explanation:
      'Nos EUA é saudação, não pergunta literal. Responda "Good, thanks!"',
    itemType: "cultural_atom",
    icon: "🌍",
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
  },
];

// ─── PAGE ───────────────────────────────────────────────────
export default function PalacePage() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomData[]>(MOCK_ROOMS);
  const [pulseItems, setPulseItems] = useState<PulseItem[]>(MOCK_PULSE_ITEMS);
  const [showPulse, setShowPulse] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | undefined>();
  const [paletteItems, setPaletteItems] = useState<PulseItem[]>([]);
  const [palaceCreated, setPalaceCreated] = useState(true); // mock

  // Total items count
  const totalItems = rooms.reduce((sum, r) => sum + r.itemsCount, 0);
  const unlockedRooms = rooms.filter((r) => r.unlocked).length;
  const pulseDue = pulseItems.filter(
    (i) => new Date(i.nextReview) <= new Date(),
  ).length;

  // Handle Pulse Mode review complete
  const handleReviewComplete = useCallback(
    (itemId: string, quality: ReviewResult["quality"]) => {
      // In production: update Supabase `palace_items` row
      setPulseItems((prev) => prev.filter((i) => i.id !== itemId));
    },
    [],
  );

  // Handle room click
  const handleRoomClick = useCallback(
    (slug: string) => {
      setActiveRoom(slug === activeRoom ? undefined : slug);
      // In production: fetch items for that room
      const room = rooms.find((r) => r.slug === slug);
      if (room) {
        setPaletteItems(pulseItems.filter((i) => i.pillar === room.pillar));
      }
    },
    [activeRoom, rooms, pulseItems],
  );

  if (!palaceCreated) {
    return (
      <div style={s.page}>
        <div style={{ ...s.emptyState, maxWidth: 480, margin: "80px auto" }}>
          <div style={s.emptyIcon}>🏗️</div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              marginBottom: spacing[2],
              color: colors.ivory,
            }}
          >
            Your Palace Awaits
          </h2>
          <p style={s.subtitle}>
            Complete the Cartografa diagnostic to unlock your Memory Palace.
            Your results will automatically place items in the right rooms.
          </p>
          <Link
            href="/diagnostico"
            style={{
              display: "inline-block",
              marginTop: spacing[4],
              padding: "12px 28px",
              backgroundColor: colors.phosphor,
              color: colors.obsidian,
              borderRadius: radius.btn,
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Begin Cartografa
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>🧠 Memory Palace</h1>
          <p style={s.subtitle}>
            {user ? user.email?.split("@")[0] : "Explorer"}'s palace
          </p>
        </div>

        {/* Pulse Mode button */}
        <div style={{ display: "flex", gap: spacing[3] }}>
          <button
            style={{
              ...s.pulseBtn,
              ...(pulseDue > 0 ? s.pulseBtnPulse : {}),
            }}
            onClick={() => setShowPulse(true)}
          >
            ⚡ Pulse Mode
            {pulseDue > 0 && (
              <span
                style={{
                  backgroundColor: colors.obsidian,
                  color: colors.phosphor,
                  padding: "2px 8px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {pulseDue}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statRow}>
        <div style={s.statCard}>
          <div style={s.statValue}>{totalItems}</div>
          <div style={s.statLabel}>Items</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>
            {unlockedRooms}/{rooms.length}
          </div>
          <div style={s.statLabel}>Rooms</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statValue}>{pulseDue}</div>
          <div style={s.statLabel}>Due for Review</div>
        </div>
      </div>

      {/* Blueprint */}
      <div style={s.section}>
        <PalaceBlueprint
          rooms={rooms}
          animate={true}
          onRoomClick={handleRoomClick}
          activeRoom={activeRoom}
        />
      </div>

      {/* Selected room items */}
      {activeRoom && (
        <div style={s.section}>
          <h3 style={s.sectionTitle}>
            {rooms.find((r) => r.slug === activeRoom)?.icon}{" "}
            {rooms.find((r) => r.slug === activeRoom)?.name}
          </h3>

          {paletteItems.length === 0 ? (
            <div style={s.emptyState}>
              <p style={{ fontSize: 14, color: colors.zinc }}>
                No items in this room yet. Complete Pulse Mode sessions to
                populate your palace.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing[3],
                maxWidth: 480,
              }}
            >
              {paletteItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: colors.surface,
                    border: `1px solid ${colors.borderSubtle}`,
                    borderRadius: radius.card,
                    padding: spacing[3],
                    display: "flex",
                    alignItems: "center",
                    gap: spacing[3],
                  }}
                >
                  <span style={{ fontSize: 24 }}>{item.icon || "💎"}</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: colors.ivory,
                      }}
                    >
                      {item.title}
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: colors.phosphor,
                        fontStyle: "italic",
                      }}
                    >
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pulse Mode overlay */}
      {showPulse && (
        <PulseMode
          items={pulseItems}
          onReviewComplete={handleReviewComplete}
          onClose={() => setShowPulse(false)}
        />
      )}

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          marginTop: spacing[8],
          paddingTop: spacing[4],
          borderTop: `1px solid ${colors.borderSubtle}`,
        }}
      >
        <Link
          href="/"
          style={{
            color: colors.zinc,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
