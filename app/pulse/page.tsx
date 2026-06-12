"use client";

import React, { useState, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

// ─── Inline SM-2 (minimal, no external import to avoid ESM/CJS mismatch) ──
function miniSM2(easeFactor: number, intervalDays: number, repetitions: number, quality: number) {
  let ef = easeFactor;
  let rep = repetitions;
  let interval = intervalDays;

  if (quality >= 3) {
    rep += 1;
    if (rep === 1) interval = 1;
    else if (rep === 2) interval = 6;
    else interval = Math.round(interval * ef);
    ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  } else {
    rep = 0;
    interval = 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return { easeFactor: ef, intervalDays: interval, repetitions: rep, nextReview, isMastered: rep >= 5 };
}

// ─── Types ─────────────────────────────────────────────────
interface PulseItem {
  id: string;
  pillar: string;
  title: string;
  content: string;
  explanation?: string;
  itemType: "word" | "chunk" | "cultural_atom";
  icon: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
}

// ─── First pulse items ─────────────────────────────────────
const FIRST_PULSE_ITEMS: PulseItem[] = [
  {
    id: "pulse_welcome_1",
    pillar: "vocab",
    title: "Serendipity",
    content: "The occurrence of events by chance in a happy way",
    explanation: "From Arabic _siriṣāndip_ via Portuguese — a word that travelled the Silk Road to English.",
    itemType: "word",
    icon: "✨",
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
  },
  {
    id: "pulse_welcome_2",
    pillar: "culture",
    title: "British understatement",
    content: "\"Not bad\" means \"quite good\". \"Rather good\" means \"exceptional\".",
    explanation: "Indirectness is a cultural atom — it signals politeness, not weakness.",
    itemType: "cultural_atom",
    icon: "🎭",
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
  },
  {
    id: "pulse_welcome_3",
    pillar: "grammar",
    title: "Used to vs. Would",
    content: "\"I used to play tennis\" (past habit, any verb) vs. \"I would play tennis\" (past habit, action verbs only)",
    explanation: "\"Used to\" works with stative verbs (be, know, like). \"Would\" does not.",
    itemType: "chunk",
    icon: "📐",
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
  },
];

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: colors.violet,
  culture: "#DC2626",
  comm: "#22C55E",
};

const QUALITY_LABELS = [
  "Complete blackout",
  "Wrong, but recognized after seeing",
  "Wrong, but seemed easy to recall",
  "Hard — correct with serious effort",
  "Good — correct with hesitation",
  "Perfect — effortless recall",
];

// ─── Component ─────────────────────────────────────────────
export default function PulsePage() {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"reveal" | "rate" | "explain">("reveal");
  const [selected, setSelected] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const item = FIRST_PULSE_ITEMS[idx];

  const handleRate = useCallback((quality: number) => {
    setSelected(quality);
    setPhase("explain");
  }, []);

  const handleNext = useCallback(() => {
    if (idx + 1 >= FIRST_PULSE_ITEMS.length) {
      setCompleted(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("lexio_pulse_complete", "true");
      }
    } else {
      setIdx(idx + 1);
      setPhase("reveal");
      setSelected(null);
    }
  }, [idx]);

  const s: Record<string, React.CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: colors.obsidian,
      padding: spacing[4],
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.card,
      padding: spacing[8],
      maxWidth: 520,
      width: "100%",
    },
    title: {
      ...typography.h1,
      color: colors.phosphor,
      fontWeight: 700,
      marginBottom: spacing[4],
      textAlign: "center" as const,
    },
    pillarTag: {
      display: "inline-block",
      padding: `${spacing[1]}px ${spacing[3]}px`,
      borderRadius: radius.full,
      fontSize: 12,
      fontWeight: 600,
      marginBottom: spacing[3],
    },
    itemTitle: {
      ...typography.h2,
      color: colors.ivory,
      fontWeight: 700,
      marginBottom: spacing[3],
    },
    itemContent: {
      ...typography.body,
      color: colors.ivory,
      marginBottom: spacing[6],
      lineHeight: 1.6,
    },
    explanation: {
      ...typography.body,
      color: colors.amber,
      fontStyle: "italic",
      padding: spacing[4],
      borderRadius: radius.md,
      backgroundColor: `${colors.amber}10`,
      marginBottom: spacing[6],
    },
    ratingGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: spacing[2],
      marginBottom: spacing[4],
    },
    ratingBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      borderRadius: radius.card,
      border: `1px solid ${colors.zinc}`,
      backgroundColor: "transparent",
      color: colors.ivory,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 16,
      transition: `all ${duration.normal}ms ease`,
    },
    ratingBtnSelected: {
      backgroundColor: colors.phosphor,
      color: colors.obsidian,
      borderColor: colors.phosphor,
    },
    ratingLabels: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: spacing[6],
    },
    ratingLabel: {
      ...typography.caption,
      color: colors.zinc,
      fontSize: 10,
      textAlign: "center" as const,
      flex: 1,
      padding: `0 ${spacing[1]}px`,
    },
    primaryBtn: {
      backgroundColor: colors.phosphor,
      color: colors.obsidian,
      borderRadius: radius.btn,
      padding: `${spacing[3]}px ${spacing[8]}px`,
      border: "none",
      cursor: "pointer",
      fontSize: 16,
      fontWeight: 600,
      width: "100%",
    },
    counter: {
      ...typography.caption,
      color: colors.zinc,
      textAlign: "center" as const,
      marginBottom: spacing[4],
    },
    completionMsg: {
      ...typography.h2,
      color: colors.amber,
      fontStyle: "italic",
      marginBottom: spacing[4],
      textAlign: "center" as const,
    },
    subtitle: {
      ...typography.body,
      color: colors.zinc,
      marginBottom: spacing[6],
      textAlign: "center" as const,
    },
  };

  // ── Completion screen ──────────────────────────────────
  if (completed) {
    const inOnboarding = typeof window !== "undefined" && localStorage.getItem("lexio_ob_step");
    return (
      <div style={s.container}>
        <div style={s.card}>
          <h2 style={s.title}>Pulse Complete</h2>
          <p style={s.completionMsg}>
            You&apos;ve placed your first items. Your Memory Palace is taking shape.
          </p>
          <p style={s.subtitle}>
            {FIRST_PULSE_ITEMS.length} items reviewed. Come back tomorrow for more.
          </p>
          {inOnboarding ? (
            <button style={s.primaryBtn} onClick={() => window.location.href = "/onboarding"}>
              Continue your journey →
            </button>
          ) : (
            <button style={s.primaryBtn} onClick={() => window.location.href = "/palace"}>
              Visit your Palace →
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Active pulse ───────────────────────────────────────
  return (
    <div style={s.container}>
      <div style={s.card}>
        <p style={s.counter}>
          {idx + 1} / {FIRST_PULSE_ITEMS.length}
        </p>

        {/* Pillar tag */}
        <div style={{ textAlign: "center" }}>
          <span style={{
            ...s.pillarTag,
            backgroundColor: `${PILLAR_COLORS[item.pillar] || colors.zinc}20`,
            color: PILLAR_COLORS[item.pillar] || colors.zinc,
          }}>
            {item.icon} {item.pillar}
          </span>
        </div>

        {/* Item content */}
        <div style={{ textAlign: "center", marginTop: spacing[4] }}>
          <h3 style={s.itemTitle}>{item.title}</h3>
          <p style={s.itemContent}>{item.content}</p>
        </div>

        {/* Rating phase */}
        {phase === "reveal" && (
          <div style={{ textAlign: "center" }}>
            <p style={{ ...typography.caption, color: colors.zinc, marginBottom: spacing[4] }}>
              How well did you know this?
            </p>
            <button
              style={{ ...s.primaryBtn, marginBottom: spacing[2] }}
              onClick={() => setPhase("rate")}
            >
              Show me →
            </button>
          </div>
        )}

        {phase === "rate" && (
          <>
            <div style={s.ratingGrid}>
              {[0, 1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  style={{
                    ...s.ratingBtn,
                    ...(selected === q ? s.ratingBtnSelected : {}),
                  }}
                  onClick={() => handleRate(q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <div style={s.ratingLabels}>
              {QUALITY_LABELS.map((label, i) => (
                <span key={i} style={s.ratingLabel}>{i === 0 || i === 5 ? label : ""}</span>
              ))}
            </div>
          </>
        )}

        {/* Explanation phase */}
        {phase === "explain" && selected !== null && (
          <>
            {item.explanation && (
              <div style={s.explanation}>{item.explanation}</div>
            )}
            <div style={{
              ...typography.caption,
              color: colors.zinc,
              textAlign: "center" as const,
              marginBottom: spacing[4],
            }}>
              {selected >= 3
                ? "Great recall! This item will reappear less frequently."
                : "No worries — this item will come back soon so it sticks."}
            </div>
            <button style={s.primaryBtn} onClick={handleNext}>
              {idx + 1 >= FIRST_PULSE_ITEMS.length ? "Complete" : "Next item →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
