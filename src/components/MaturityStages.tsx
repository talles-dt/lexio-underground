"use client";

import React, { useState, useEffect } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MaturityStage = "roots" | "sprouts" | "branches" | "canopy" | "underground";

interface StageInfo {
  id: MaturityStage;
  label: string;
  color: string;
  description: string;
  palaceState: string;
  rooms: number;
  items: number;
}

interface MaturityStagesProps {
  currentStage?: MaturityStage;
  onStageClick?: (stage: MaturityStage) => void;
}

/* ------------------------------------------------------------------ */
/*  Stage data (matches vault spec)                                    */
/* ------------------------------------------------------------------ */

const STAGES: StageInfo[] = [
  {
    id: "roots",
    label: "Roots",
    color: "#00FF88",
    description: "You know almost nothing. That's exactly where every language begins.",
    palaceState: "1 room, entrance only",
    rooms: 1,
    items: 3,
  },
  {
    id: "sprouts",
    label: "Sprouts",
    color: "#22C55E",
    description: "Your first words are finding their places.",
    palaceState: "5 rooms, walls but no doors",
    rooms: 5,
    items: 15,
  },
  {
    id: "branches",
    label: "Branches",
    color: "#FF9500",
    description: "You're reaching outward now.",
    palaceState: "All rooms, corridors forming",
    rooms: 10,
    items: 50,
  },
  {
    id: "canopy",
    label: "Canopy",
    color: "#166534",
    description: "You see the whole structure now.",
    palaceState: "Full structure, rooms connected, items at depth",
    rooms: 15,
    items: 150,
  },
  {
    id: "underground",
    label: "The Underground",
    color: "#A855F7",
    description: "You ARE the culture. Not fluent — embedded.",
    palaceState: "Invisible from outside, infinite depth inside",
    rooms: Infinity,
    items: Infinity,
  },
];

/* ------------------------------------------------------------------ */
/*  SVG tree silhouette per stage                                      */
/* ------------------------------------------------------------------ */

function TreeIcon({ stage, active, color }: { stage: MaturityStage; active: boolean; color: string }) {
  const opacity = active ? 1 : 0.25;
  const fillColor = active ? color : colors.zinc;
  const size = 48;

  const paths: Record<MaturityStage, string> = {
    roots: "M24 44 L24 30 M20 44 L28 44 M20 30 Q16 24 20 20", // just roots, tiny sprout
    sprouts: "M24 44 L24 22 M20 44 L28 44 Q18 30 24 22 M22 26 Q16 22 18 18", // small sprout + leaves
    branches: "M24 44 L24 14 M20 44 L28 44 M24 14 L16 22 M24 14 L32 22 M24 22 L14 28 M24 22 L34 28", // branching
    canopy: "M24 44 L24 10 M20 44 L28 44 M24 10 Q12 6 10 14 M24 10 Q36 6 38 14 M16 20 L32 20 M12 16 Q24 2 36 16", // full canopy
    underground: "M24 44 L24 10 M20 44 L28 44 M24 10 Q10 2 8 16 M24 10 Q38 2 40 16 M20 32 Q8 28 6 36 M28 32 Q40 28 42 36 M24 20 L10 14 M24 20 L38 14", // vast underground network
  };

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ opacity, transition: `opacity ${duration.slow}ms ease` }}>
      <path d={paths[stage]} stroke={fillColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MaturityStages({ currentStage = "roots", onStageClick }: MaturityStagesProps) {
  const [visibleStages, setVisibleStages] = useState(0);

  // Progressive reveal: one stage at a time
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= STAGES.length; i++) {
      timers.push(setTimeout(() => setVisibleStages(i), i * 200));
    }
    return () => timers.forEach(clearTimeout);
  }, []);

  const currentIdx = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div style={{
      maxWidth: 720,
      width: "100%",
      margin: "0 auto",
      padding: `${spacing[6]}px ${spacing[4]}px`,
    }}>
      <h2 style={{
        fontFamily: typography.display.fontFamily,
        fontSize: typography.display.fontSize,
        color: colors.ivory,
        margin: 0,
        paddingBottom: spacing[2],
        textAlign: "center",
      }}>
        Identity Path
      </h2>
      <p style={{
        fontFamily: typography.bodyItalic.fontFamily,
        fontStyle: typography.bodyItalic.fontStyle,
        fontSize: typography.body.fontSize,
        color: colors.zinc,
        margin: 0,
        paddingBottom: spacing[8],
        textAlign: "center",
      }}>
        Not a progress bar. An identity.
      </p>

      {/* Vertical timeline */}
      <div style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}>
        {/* Connecting line */}
        <div style={{
          position: "absolute",
          left: 23,
          top: 24,
          bottom: 24,
          width: 2,
          backgroundColor: colors.borderSubtle,
        }}>
          {/* Colored portion up to current stage */}
          <div style={{
            width: "100%",
            height: `${((currentIdx + 1) / STAGES.length) * 100}%`,
            background: `linear-gradient(to bottom, ${STAGES[0].color}, ${STAGES[currentIdx].color})`,
            transition: `height ${duration.slow}ms ease`,
          }} />
        </div>

        {STAGES.map((stage, i) => {
          const isVisible = i < visibleStages;
          const isCurrent = stage.id === currentStage;
          const isPast = i < currentIdx;
          const isFuture = i > currentIdx;

          return (
            <div
              key={stage.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: spacing[4],
                padding: `${spacing[4]}px 0`,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                transition: `opacity ${duration.normal}ms ease, transform ${duration.normal}ms ease`,
                cursor: onStageClick ? "pointer" : "default",
              }}
              onClick={() => onStageClick?.(stage.id)}
              onMouseEnter={(e) => {
                if (onStageClick) {
                  (e.currentTarget as HTMLElement).style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateX(0)";
              }}
            >
              {/* Node circle */}
              <div style={{
                position: "relative",
                width: 48,
                height: 48,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <div style={{
                  width: isCurrent ? 40 : 32,
                  height: isCurrent ? 40 : 32,
                  borderRadius: "50%",
                  border: `2px solid ${isCurrent ? stage.color : isPast ? stage.color : colors.borderSubtle}`,
                  backgroundColor: isCurrent || isPast ? `${stage.color}15` : "transparent",
                  transition: `all ${duration.normal}ms ease`,
                }}>
                  {/* Current stage pulse */}
                  {isCurrent && (
                    <div style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0, bottom: 0,
                      borderRadius: "50%",
                      border: `2px solid ${stage.color}`,
                      animation: "maturity-pulse 2s ease-in-out infinite",
                    }} />
                  )}
                  <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isCurrent ? 16 : 12,
                    fontWeight: 700,
                    fontFamily: typography.display.fontFamily,
                    color: isCurrent ? stage.color : isPast ? stage.color : colors.zinc,
                  }}>
                    {i + 1}
                  </div>
                </div>
                {/* Current stage glow */}
                {isCurrent && (
                  <div style={{
                    position: "absolute",
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: `${stage.color}10`,
                    filter: "blur(8px)",
                    zIndex: -1,
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                paddingBottom: spacing[2],
                borderBottom: i < STAGES.length - 1 ? `1px solid ${colors.borderSubtle}` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: spacing[2], marginBottom: spacing[1] }}>
                  <h3 style={{
                    fontFamily: typography.h2.fontFamily,
                    fontSize: isCurrent ? typography.h2.fontSize : 16,
                    color: isCurrent ? stage.color : isPast ? stage.color : colors.zinc,
                    margin: 0,
                    transition: `color ${duration.normal}ms ease`,
                  }}>
                    {stage.label}
                  </h3>
                  {isCurrent && (
                    <span style={{
                      fontSize: typography.caption.fontSize,
                      fontFamily: typography.caption.fontFamily,
                      textTransform: "uppercase" as const,
                      letterSpacing: 2,
                      color: stage.color,
                      backgroundColor: `${stage.color}15`,
                      padding: "2px 8px",
                      borderRadius: 10,
                    }}>
                      You are here
                    </span>
                  )}
                </div>

                <p style={{
                  fontFamily: typography.bodyItalic.fontFamily,
                  fontStyle: typography.bodyItalic.fontStyle,
                  fontSize: typography.body.fontSize,
                  color: isCurrent ? colors.ivory : isPast ? colors.zinc : `${colors.zinc}60`,
                  margin: 0,
                  paddingBottom: spacing[2],
                  lineHeight: 1.5,
                }}>
                  &ldquo;{stage.description}&rdquo;
                </p>

                <div style={{
                  display: "flex",
                  gap: spacing[4],
                  fontSize: typography.caption.fontSize,
                  fontFamily: typography.caption.fontFamily,
                  color: colors.zinc,
                }}>
                  <span style={{ color: isPast || isCurrent ? stage.color : colors.zinc }}>
                    ◇ {stage.rooms === Infinity ? "∞" : stage.rooms} rooms
                  </span>
                  <span>
                    ◇ {stage.items === Infinity ? "∞" : stage.items} items
                  </span>
                  <span style={{ color: `${colors.zinc}80` }}>
                    {stage.palaceState}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes maturity-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
}

export type { MaturityStage };
