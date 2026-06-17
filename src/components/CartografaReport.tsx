"use client";

import { useEffect, useState, useRef } from "react";
import { PillarRadar } from "@/components/PillarRadar";
import { MapOfIgnorance } from "@/components/MapOfIgnorance";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

type PillarKey = "grammar" | "logic" | "vocab" | "culture" | "comm";

interface PillarScoresMap {
  grammar: number;
  logic: number;
  vocab: number;
  culture: number;
  comm: number;
}

interface MapNodeInput {
  node_id: string;
  pillar: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface CartografaReportProps {
  pillarScores: PillarScoresMap;
  overallReadiness: string;
  identityCallout: string;
  totalQuestions: number;
  totalCorrect: number;
  durationSeconds: number;
  recommendedFocus: string[];
  mapData?: MapNodeInput[];
  shareToken: string | null;
  onShare: () => void;
  onContinue?: () => void;
  showContinue?: boolean;
  previousScores?: PillarScoresMap | null;
  isReCheck?: boolean;
}

const readinessColor: Record<string, string> = {
  roots: colors.phosphor,
  sprouts: "#22C55E",
  branches: colors.amber,
  canopy: colors.violet,
  underground: colors.crimson,
};

const readinessLabels: Record<string, string> = {
  roots: "Raízes",
  sprouts: "Brotos",
  branches: "Galhos",
  canopy: "Dossel",
  underground: "Subsolo",
};

const stageNames: Record<string, string> = {
  grammar: "Grammar",
  logic: "Logic",
  vocab: "Vocab",
  culture: "Culture",
  comm: "Comm",
};

// ─── Typewriter animation ────────────────────────────────
function useTypewriter(text: string, start: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    if (!start) {
      setDisplayed("");
      indexRef.current = 0;
      return;
    }

    if (indexRef.current >= text.length) return;

    const interval = setInterval(() => {
      setDisplayed((prev) => {
        const next = text[indexRef.current];
        indexRef.current += 1;
        if (indexRef.current >= text.length) {
          clearInterval(interval);
        }
        return prev + next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, start, speed]);

  return displayed || (start ? "" : "");
}

// ─── Report component ────────────────────────────────────
export function CartografaReport({
  pillarScores,
  overallReadiness,
  identityCallout,
  totalQuestions,
  totalCorrect,
  durationSeconds,
  recommendedFocus,
  mapData,
  shareToken,
  onShare,
  onContinue,
  showContinue = false,
  previousScores = null,
  isReCheck = false,
}: CartografaReportProps) {
  // Animation phase tracking:
  // Phase 0: Radar drawing (handled by PillarRadar internally, ~500ms)
  // Phase 1: Badge reveal (delay 600ms)
  // Phase 2: Identity typewriter (delay 1000ms)
  // Phase 2.5: Map of Ignorance (delay 1200ms)
  // Phase 3: Stats + focus (delay 1400ms)
  // Phase 4: Actions (after everything else)

  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 600));   // badge
    timers.push(setTimeout(() => setPhase(2), 1000));  // identity
    timers.push(setTimeout(() => setPhase(3), 1600));  // map + stats
    timers.push(setTimeout(() => setPhase(4), 2200));  // actions
    return () => timers.forEach(clearTimeout);
  }, []);

  const typewriterText = useTypewriter(
    identityCallout || "",
    phase >= 2,
    25
  );

  const badgeBg = readinessColor[overallReadiness] || colors.phosphor;
  const badgeLabel = readinessLabels[overallReadiness] || overallReadiness;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      {/* ── Radar ──────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: spacing[4] }}>
        <PillarRadar scores={pillarScores} size={260} animate={true} delay={0} />
      </div>

      {/* ── Re-check delta banner ──────────────────── */}
      {isReCheck && previousScores && phase >= 1 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: spacing[4],
          opacity: phase >= 1 ? 1 : 0,
          transition: `opacity ${duration.normal}ms ease`,
        }}>
          <div style={{
            backgroundColor: colors.surface,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius.card,
            padding: `${spacing[3]}px ${spacing[4]}px`,
            display: "flex",
            gap: spacing[4],
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
            {(Object.keys(pillarScores) as PillarKey[]).map((key) => {
              const delta = pillarScores[key] - previousScores[key];
              const isUp = delta > 0;
              const isFlat = delta === 0;
              const color = isUp ? colors.phosphor : isFlat ? colors.zinc : colors.crimson;
              const arrow = isUp ? "↑" : isFlat ? "→" : "↓";
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{
                    fontFamily: typography.caption.fontFamily,
                    fontSize: 11,
                    color: colors.zinc,
                    textTransform: "capitalize" as const,
                  }}>
                    {key}
                  </span>
                  <span style={{
                    fontFamily: typography.ui.fontFamily,
                    fontSize: 13,
                    fontWeight: 700,
                    color,
                  }}>
                    {arrow} {Math.abs(delta)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Readiness badge ────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: spacing[4],
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1)" : "scale(0.8)",
          transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <span
          style={{
            ...typography.ui,
            fontSize: 16,
            fontWeight: 700,
            padding: `${spacing[2]}px ${spacing[6]}px`,
            borderRadius: radius.full,
            backgroundColor: badgeBg,
            color: colors.obsidian,
          }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* ── Identity callout (typewriter) ──────────── */}
      <div
        style={{
          marginBottom: spacing[4],
          opacity: phase >= 2 ? 1 : 0,
          transition: "opacity 400ms ease",
        }}
      >
        <p
          style={{
            ...typography.bodyItalic,
            fontSize: 15,
            lineHeight: "20px",
            textAlign: "center",
            color: colors.ivory,
          }}
        >
          &ldquo;{typewriterText}&rdquo;
          {phase >= 2 && typewriterText.length < (identityCallout || "").length && (
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 18,
                backgroundColor: colors.phosphor,
                marginLeft: 2,
                animation: "cursor-blink 600ms step-end infinite",
                verticalAlign: "text-bottom",
              }}
            />
          )}
        </p>
      </div>

      {/* ── Map of Ignorance ───────────────────────── */}
      {mapData && mapData.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: spacing[6],
            opacity: phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 600ms ease, transform 600ms ease",
          }}
        >
          <MapOfIgnorance nodes={mapData} size={320} />
        </div>
      )}

      {/* ── Stats ──────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: spacing[8],
          marginBottom: spacing[4],
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ ...typography.heading, fontSize: 28, color: colors.phosphor }}>
            {totalQuestions}
          </span>
          <span style={{ ...typography.caption, color: colors.zinc }}>perguntas</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ ...typography.heading, fontSize: 28, color: colors.phosphor }}>
            {totalCorrect}
          </span>
          <span style={{ ...typography.caption, color: colors.zinc }}>corretas</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ ...typography.heading, fontSize: 28, color: colors.phosphor }}>
            {Math.round(durationSeconds / 60)}m
          </span>
          <span style={{ ...typography.caption, color: colors.zinc }}>tempo</span>
        </div>
      </div>

      {/* ── Recommended focus ──────────────────────── */}
      <div
        style={{
          marginTop: spacing[4],
          opacity: phase >= 3 ? 1 : 0,
          transition: "opacity 500ms ease 200ms",
        }}
      >
        <p
          style={{
            ...typography.caption,
            color: colors.zinc,
            marginBottom: spacing[2],
            textAlign: "center",
          }}
        >
          Foco recomendado
        </p>
        <div style={{ display: "flex", gap: spacing[2], justifyContent: "center" }}>
          {recommendedFocus.map((p) => (
            <span
              key={p}
              style={{
                ...typography.ui,
                fontSize: 12,
                padding: `${spacing[1]}px ${spacing[3]}px`,
                borderRadius: radius.md,
                backgroundColor: `${colors.ivory}10`,
                color: colors.ivory,
                border: `1px solid ${colors.ivory}20`,
              }}
            >
              {stageNames[p] || p}
            </span>
          ))}
        </div>
      </div>

      {/* ── Actions ────────────────────────────────── */}
      <div
        style={{
          marginTop: spacing[4],
          display: "flex",
          gap: spacing[3],
          opacity: phase >= 4 ? 1 : 0,
          transform: phase >= 4 ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 500ms ease, transform 500ms ease",
        }}
      >
        <button
          onClick={onShare}
          style={{
            ...typography.ui,
            fontSize: 14,
            fontWeight: 600,
            padding: `${spacing[3]}px ${spacing[6]}px`,
            borderRadius: radius.md,
            backgroundColor: colors.phosphor,
            color: colors.obsidian,
            border: "none",
            cursor: "pointer",
          }}
        >
          Compartilhar Resultados
        </button>
        {showContinue && onContinue && (
          <button
            onClick={onContinue}
            style={{
              ...typography.ui,
              fontSize: 14,
              fontWeight: 600,
              padding: `${spacing[3]}px ${spacing[6]}px`,
              borderRadius: radius.md,
              backgroundColor: colors.amber,
              color: colors.obsidian,
              border: "none",
              cursor: "pointer",
            }}
          >
            Continue your journey &rarr;
          </button>
        )}
      </div>

      {/* ── Share token ────────────────────────────── */}
      {shareToken && phase >= 4 && (
        <p
          style={{
            ...typography.caption,
            color: colors.phosphor,
            marginTop: spacing[3],
          }}
        >
          Token: {shareToken}
        </p>
      )}

      {/* ── Cursor blink keyframes ─────────────────── */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
