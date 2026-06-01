"use client";

import { useState, useCallback, useEffect } from "react";
import { colors, spacing, radius } from "@/theme/tokens";
import {
  applySM2,
  getDailyReviewQueue,
  SM2State,
  ReviewResult,
} from "@/palace/spaced-repetition";

// ─── TYPES ──────────────────────────────────────────────────
export interface PulseItem {
  id: string;
  pillar: string;
  title: string;
  content: string;
  explanation?: string;
  itemType: string;
  icon: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReview: string;
}

interface PulseModeProps {
  items: PulseItem[];
  palaceId?: string;
  onReviewComplete?: (
    itemId: string,
    quality: ReviewResult["quality"],
    updatedSM2: {
      easeFactor: number;
      intervalDays: number;
      repetitions: number;
      nextReview: Date;
      isMastered: boolean;
    },
  ) => void;
  onClose?: () => void;
}

// ─── STYLES ─────────────────────────────────────────────────
const s = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(13, 13, 15, 0.95)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: spacing[4],
  } as React.CSSProperties,
  card: {
    maxWidth: 480,
    width: "100%",
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[6],
    textAlign: "center" as const,
  } as React.CSSProperties,
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.ivory,
    marginBottom: spacing[1],
  } as React.CSSProperties,
  subtitle: {
    fontSize: 14,
    color: colors.zinc,
    fontStyle: "italic",
    marginBottom: spacing[4],
  } as React.CSSProperties,
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 2,
    marginBottom: spacing[4],
    overflow: "hidden",
  } as React.CSSProperties,
  progressFill: {
    height: "100%",
    backgroundColor: colors.phosphor,
    borderRadius: 2,
    transition: "width 0.3s ease",
  } as React.CSSProperties,
  itemCard: {
    backgroundColor: colors.surfaceContainerLow,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[4],
    marginBottom: spacing[4],
    textAlign: "left" as const,
  } as React.CSSProperties,
  pillarTag: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: spacing[2],
  } as React.CSSProperties,
  itemTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ivory,
    marginBottom: spacing[2],
  } as React.CSSProperties,
  itemContent: {
    fontSize: 22,
    fontWeight: 600,
    color: colors.phosphor,
    marginBottom: spacing[2],
    fontStyle: "italic",
  } as React.CSSProperties,
  explanationBox: {
    backgroundColor: colors.surfaceContainerHigh,
    padding: spacing[3],
    borderRadius: radius.btn,
    marginBottom: spacing[3],
  } as React.CSSProperties,
  explanationText: {
    fontSize: 13,
    color: colors.amber,
    fontStyle: "italic",
    lineHeight: 1.5,
  } as React.CSSProperties,
  qualityRow: {
    display: "flex",
    gap: 8,
    justifyContent: "center",
    marginBottom: spacing[3],
  } as React.CSSProperties,
  qualityBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    border: `2px solid ${colors.zinc}`,
    backgroundColor: "transparent",
    color: colors.ivory,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  qualityBtnSelected: {
    borderColor: colors.phosphor,
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
  } as React.CSSProperties,
  qualityLabel: {
    fontSize: 10,
    color: colors.zinc,
    marginTop: 2,
  } as React.CSSProperties,
  btn: {
    padding: "12px 28px",
    backgroundColor: colors.phosphor,
    color: colors.obsidian,
    border: "none",
    borderRadius: radius.btn,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  } as React.CSSProperties,
  btnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  } as React.CSSProperties,
};

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: colors.violet,
  culture: "#DC2626",
  comm: "#22C55E",
};

const PILLAR_NAMES: Record<string, string> = {
  grammar: "Gramática",
  logic: "Lógica",
  vocab: "Vocabulário",
  culture: "Cultura",
  comm: "Comunicação",
};

// ─── COMPONENT ──────────────────────────────────────────────
export default function PulseMode({
  items,
  palaceId,
  onReviewComplete,
  onClose,
}: PulseModeProps) {
  const [queue, setQueue] = useState<PulseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState<
    ReviewResult["quality"] | null
  >(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  // Build daily review queue on mount
  useEffect(() => {
    const daily = getDailyReviewQueue(items, 7);
    setQueue(daily);
  }, [items]);

  const currentItem = queue[currentIndex];
  const progress = queue.length > 0 ? (currentIndex / queue.length) * 100 : 0;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  const handleSubmit = useCallback(() => {
    if (selectedQuality === null || !currentItem) return;

    // Apply SM-2
    const sm2Result = applySM2(
      {
        easeFactor: currentItem.easeFactor,
        intervalDays: currentItem.intervalDays,
        repetitions: currentItem.repetitions,
      },
      { quality: selectedQuality },
    );

    onReviewComplete?.(currentItem.id, selectedQuality, sm2Result);

    // Move to next or complete
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedQuality(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  }, [
    selectedQuality,
    currentItem,
    currentIndex,
    queue.length,
    onReviewComplete,
  ]);

  // Loading state
  if (queue.length === 0) {
    return (
      <div style={s.overlay}>
        <div style={s.card}>
          <p style={{ fontSize: 48, marginBottom: spacing[3] }}>🎉</p>
          <h2 style={s.title}>All caught up!</h2>
          <p style={s.subtitle}>
            No items due for review. Come back later or add more items to your
            palace.
          </p>
          {onClose && (
            <button style={s.btn} onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  // Completed state
  if (completed) {
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return (
      <div style={s.overlay}>
        <div style={s.card}>
          <p style={{ fontSize: 48, marginBottom: spacing[3] }}>⚡</p>
          <h2 style={s.title}>Pulse Complete!</h2>
          <p style={s.subtitle}>
            {queue.length} items reviewed in {minutes}:
            {seconds.toString().padStart(2, "0")}
          </p>
          <p
            style={{
              fontSize: 14,
              color: colors.phosphor,
              fontStyle: "italic",
              marginBottom: spacing[4],
            }}
          >
            Your palace grows stronger.
          </p>
          {onClose && (
            <button style={s.btn} onClick={onClose}>
              Return to Palace
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!currentItem) return null;

  return (
    <div style={s.overlay}>
      <div style={s.card}>
        {/* Header */}
        <p
          style={{ fontSize: 11, color: colors.zinc, marginBottom: spacing[1] }}
        >
          Pulse Mode — {currentIndex + 1} of {queue.length}
        </p>
        <div style={s.progressBar}>
          <div style={{ ...s.progressFill, width: `${progress}%` }} />
        </div>

        {/* Timer */}
        <p
          style={{ fontSize: 11, color: colors.zinc, marginBottom: spacing[3] }}
        >
          ⏱ {Math.floor(elapsed / 60)}:
          {(elapsed % 60).toString().padStart(2, "0")}
        </p>

        {/* Item card */}
        <div style={s.itemCard}>
          {/* Pillar tag */}
          <span
            style={{
              ...s.pillarTag,
              backgroundColor: `${PILLAR_COLORS[currentItem.pillar]}20`,
              color: PILLAR_COLORS[currentItem.pillar],
            }}
          >
            {PILLAR_NAMES[currentItem.pillar] || currentItem.pillar}
          </span>

          {/* Icon + Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: spacing[2],
              marginBottom: spacing[2],
            }}
          >
            <span style={{ fontSize: 28 }}>{currentItem.icon || "💎"}</span>
            <span style={s.itemTitle}>{currentItem.title}</span>
          </div>

          {/* The content to recall */}
          <p style={s.itemContent}>"{currentItem.content}"</p>

          {/* Explanation toggle */}
          {currentItem.explanation && (
            <>
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                style={{
                  background: "none",
                  border: `1px solid ${colors.zinc}`,
                  borderRadius: radius.btn,
                  color: colors.ivory,
                  fontSize: 12,
                  padding: "4px 12px",
                  cursor: "pointer",
                  marginBottom: spacing[2],
                }}
              >
                {showExplanation ? "Hide explanation" : "Why?"}
              </button>
              {showExplanation && (
                <div style={s.explanationBox}>
                  <p style={s.explanationText}>{currentItem.explanation}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quality self-assessment */}
        <p
          style={{
            fontSize: 13,
            color: colors.zinc,
            marginBottom: spacing[2],
          }}
        >
          How well did you know this?
        </p>
        <div style={s.qualityRow}>
          {[
            { val: 0, label: "?" },
            { val: 1, label: "✗" },
            { val: 2, label: "…" },
            { val: 3, label: "✓" },
            { val: 4, label: "✓✓" },
            { val: 5, label: "✓✓✓" },
          ].map(({ val, label }) => (
            <div key={val} style={{ textAlign: "center" }}>
              <button
                onClick={() =>
                  setSelectedQuality(val as ReviewResult["quality"])
                }
                style={{
                  ...s.qualityBtn,
                  ...(selectedQuality === val ? s.qualityBtnSelected : {}),
                }}
              >
                {label}
              </button>
              <div style={s.qualityLabel}>{val}</div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <button
          style={{
            ...s.btn,
            ...(selectedQuality === null ? s.btnDisabled : {}),
          }}
          disabled={selectedQuality === null}
          onClick={handleSubmit}
        >
          {currentIndex < queue.length - 1 ? "Next →" : "Complete Pulse"}
        </button>

        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              display: "block",
              margin: `${spacing[3]}px auto 0`,
              background: "none",
              border: "none",
              color: colors.zinc,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Exit Pulse Mode
          </button>
        )}
      </div>
    </div>
  );
}
