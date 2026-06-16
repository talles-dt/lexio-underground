"use client";

import React, { useState, useEffect, useRef } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MaturityStage = "roots" | "sprouts" | "branches" | "canopy" | "underground";
type PillarKey = "grammar" | "logic" | "vocab" | "culture" | "comm";

interface PalaceItem {
  id: string;
  name: string;
  type: "cultural_atom" | "vocabulary" | "grammar_rule" | "logic_pattern" | "cultural_meme";
  depth: number;
  mastered: boolean;
  lastReviewed?: string;
}

interface PalaceRoomDetailProps {
  roomId: string;
  roomName: string;
  pillar: string;
  itemCount: number;
  connections: string[];
  maturityStage: MaturityStage;
  onClose: () => void;
  items?: PalaceItem[];
}

/* ------------------------------------------------------------------ */
/*  Pillar metadata                                                    */
/* ------------------------------------------------------------------ */

const PILLAR_META: Record<string, { color: string; icon: string; description: string }> = {
  grammar: {
    color: colors.phosphor,
    icon: "◆",
    description: "Rules of structure. Syntax lives here.",
  },
  logic: {
    color: colors.amber,
    icon: "◇",
    description: "Patterns of thought. Reasoning lives here.",
  },
  vocab: {
    color: "#22C55E",
    icon: "●",
    description: "Words and their places. Lexicon lives here.",
  },
  culture: {
    color: colors.violet,
    icon: "★",
    description: "Sapir-Whorf, memes, identity. Culture lives here.",
  },
  comm: {
    color: colors.phosphorFixedDim,
    icon: "◎",
    description: "Output, expression, connection. The Hall.",
  },
  none: {
    color: colors.zinc,
    icon: "○",
    description: "The starting point. All journeys begin here.",
  },
};

/* ------------------------------------------------------------------ */
/*  Depth label helper                                                 */
/* ------------------------------------------------------------------ */

function depthLabel(depth: number): { text: string; color: string } {
  if (depth === 0) return { text: "Surface", color: colors.phosphor };
  if (depth === 1) return { text: "Shallow", color: "#22C55E" };
  if (depth === 2) return { text: "Medium", color: colors.amber };
  if (depth >= 3) return { text: "Deep", color: colors.violet };
  return { text: "Unknown", color: colors.zinc };
}

/* ------------------------------------------------------------------ */
/*  SVG: Item shelf (isometric wooden shelf with nodes)                */
/* ------------------------------------------------------------------ */

function ItemShelf({ items, pillar, visible }: { items: PalaceItem[]; pillar: string; visible: boolean }) {
  const color = PILLAR_META[pillar]?.color || colors.zinc;
  const shelfWidth = 400;
  const shelfHeight = 6;
  const nodeSpacing = 56;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${shelfWidth} 100`}
      style={{ display: "block", overflow: "visible" }}
    >
      {/* Shelf line */}
      <line
        x1={20}
        y1={60}
        x2={shelfWidth - 20}
        y2={60}
        stroke={visible ? color : colors.borderSubtle}
        strokeWidth={shelfHeight}
        strokeLinecap="round"
        strokeDasharray={visible ? `${shelfWidth - 40}` : "4 4"}
        strokeDashoffset={visible ? 0 : 0}
        style={{ transition: `stroke-dashoffset ${duration.slow}ms ease, stroke ${duration.normal}ms ease` }}
      />

      {/* Items on shelf */}
      {items.slice(0, 7).map((item, i) => {
        const cx = 50 + i * nodeSpacing;
        const cy = 40;
        const delay = i * 100;
        const d = depthLabel(item.depth);

        return (
          <g
            key={item.id}
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0)",
              transformOrigin: `${cx}px ${cy}px`,
              transition: `opacity ${duration.normal}ms ease ${delay}ms, transform ${duration.normal}ms ease ${delay}ms`,
            }}
          >
            {/* Node circle */}
            <circle
              cx={cx}
              cy={cy}
              r={item.mastered ? 12 : 8}
              fill={item.mastered ? color : "transparent"}
              stroke={color}
              strokeWidth={1.5}
              opacity={item.mastered ? 0.9 : 0.6}
            />
            {/* Mastered glow */}
            {item.mastered && (
              <circle
                cx={cx}
                cy={cy}
                r={18}
                fill={`${color}15`}
                stroke="none"
              />
            )}
            {/* Depth indicator (small dot below) */}
            <circle
              cx={cx}
              cy={72}
              r={2}
              fill={d.color}
              opacity={0.5}
            />
          </g>
        );
      })}

      {/* Overflow indicator */}
      {items.length > 7 && (
        <text
          x={50 + 7 * nodeSpacing}
          y={44}
          fontFamily={typography.ui.fontFamily}
          fontSize={12}
          fill={colors.zinc}
        >
          +{items.length - 7}
        </text>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component — slide-up drawer                                   */
/* ------------------------------------------------------------------ */

export function PalaceRoomDetail({
  roomId,
  roomName,
  pillar,
  itemCount,
  connections,
  maturityStage,
  onClose,
  items = [],
}: PalaceRoomDetailProps) {
  const [open, setOpen] = useState(false);
  const [bodyVisible, setBodyVisible] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const meta = PILLAR_META[pillar] || PILLAR_META.none;

  // Stagger entrance: drawer slides up, then body fades in
  useEffect(() => {
    const t1 = setTimeout(() => setOpen(true), 50);
    const t2 = setTimeout(() => setBodyVisible(true), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Close with reverse animation
  const handleClose = () => {
    setBodyVisible(false);
    setOpen(false);
    setTimeout(onClose, 300);
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Depth distribution
  const depthBuckets = [0, 0, 0, 0]; // surface, shallow, medium, deep
  items.forEach((item) => {
    const idx = Math.min(item.depth, 3);
    depthBuckets[idx]++;
  });
  const maxBucket = Math.max(...depthBuckets, 1);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: `${colors.obsidian}CC`,
          zIndex: 40,
          opacity: open ? 1 : 0,
          transition: `opacity ${duration.normal}ms ease`,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "80vh",
          backgroundColor: colors.surface,
          borderTopLeftRadius: radius.card,
          borderTopRightRadius: radius.card,
          borderTop: `1px solid ${meta.color}40`,
          zIndex: 50,
          transform: open ? "translateY(0)" : "translateY(100%)",
          transition: `transform ${duration.slow}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          overflowY: "auto",
          padding: spacing[6],
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.borderSubtle,
          margin: "0 auto",
          marginBottom: spacing[4],
        }} />

        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: spacing[6],
          opacity: bodyVisible ? 1 : 0,
          transform: bodyVisible ? "translateY(0)" : "translateY(10px)",
          transition: `opacity ${duration.normal}ms ease, transform ${duration.normal}ms ease`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: spacing[3] }}>
            <span style={{
              fontSize: 28,
              color: meta.color,
              filter: `drop-shadow(0 0 8px ${meta.color}40)`,
            }}>
              {meta.icon}
            </span>
            <div>
              <h2 style={{
                fontFamily: typography.h2.fontFamily,
                fontSize: typography.h2.fontSize,
                color: colors.ivory,
                margin: 0,
              }}>
                {roomName}
              </h2>
              <p style={{
                fontFamily: typography.bodyItalic.fontFamily,
                fontStyle: typography.bodyItalic.fontStyle,
                fontSize: typography.caption.fontSize,
                color: colors.zinc,
                margin: 0,
              }}>
                {meta.description}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: `1px solid ${colors.borderSubtle}`,
              borderRadius: radius.sm,
              color: colors.zinc,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex",
          gap: spacing[4],
          marginBottom: spacing[6],
          opacity: bodyVisible ? 1 : 0,
          transition: `opacity ${duration.normal}ms ease 100ms`,
        }}>
          <StatChip label="Items" value={itemCount} color={meta.color} />
          <StatChip label="Depth" value={items.length > 0 ? Math.max(...items.map((i) => i.depth)) : 0} color={colors.violet} />
          <StatChip label="Mastered" value={items.filter((i) => i.mastered).length} color={colors.phosphor} />
          <StatChip label="Stage" value={maturityStage} color={meta.color} />
        </div>

        {/* Depth distribution bar */}
        {items.length > 0 && (
          <div style={{
            marginBottom: spacing[6],
            opacity: bodyVisible ? 1 : 0,
            transition: `opacity ${duration.normal}ms ease 200ms`,
          }}>
            <p style={{
              fontFamily: typography.caption.fontFamily,
              fontSize: typography.caption.fontSize,
              color: colors.zinc,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              margin: 0,
              marginBottom: spacing[2],
            }}>
              Depth Distribution
            </p>
            <div style={{ display: "flex", gap: 2, height: 48, alignItems: "flex-end" }}>
              {depthBuckets.map((count, i) => {
                const labels = ["Surface", "Shallow", "Medium", "Deep"];
                const barColors = [colors.phosphor, "#22C55E", colors.amber, colors.violet];
                const h = Math.max((count / maxBucket) * 48, 2);
                return (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{
                      height: h,
                      backgroundColor: barColors[i],
                      borderRadius: "4px 4px 0 0",
                      transition: `height ${duration.slow}ms ease ${i * 100}ms`,
                      marginBottom: 4,
                    }} />
                    <span style={{
                      fontFamily: typography.ui.fontFamily,
                      fontSize: 10,
                      color: colors.zinc,
                    }}>
                      {labels[i]}
                    </span>
                    <br />
                    <span style={{
                      fontFamily: typography.ui.fontFamily,
                      fontSize: 11,
                      color: barColors[i],
                      fontWeight: 600,
                    }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Item shelf visualization */}
        <div style={{
          marginBottom: spacing[6],
          opacity: bodyVisible ? 1 : 0,
          transition: `opacity ${duration.normal}ms ease 300ms`,
        }}>
          <p style={{
            fontFamily: typography.caption.fontFamily,
            fontSize: typography.caption.fontSize,
            color: colors.zinc,
            textTransform: "uppercase" as const,
            letterSpacing: 2,
            margin: 0,
            marginBottom: spacing[2],
          }}>
            Items on Shelf
          </p>
          {items.length > 0 ? (
            <ItemShelf items={items} pillar={pillar} visible={bodyVisible} />
          ) : (
            <p style={{
              fontFamily: typography.bodyItalic.fontFamily,
              fontStyle: typography.bodyItalic.fontStyle,
              fontSize: typography.body.fontSize,
              color: colors.zinc,
              margin: 0,
            }}>
              This room is empty. Start learning to place items here.
            </p>
          )}
        </div>

        {/* Item list */}
        {items.length > 0 && (
          <div style={{
            marginBottom: spacing[6],
            opacity: bodyVisible ? 1 : 0,
            transition: `opacity ${duration.normal}ms ease 400ms`,
          }}>
            <p style={{
              fontFamily: typography.caption.fontFamily,
              fontSize: typography.caption.fontSize,
              color: colors.zinc,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              margin: 0,
              marginBottom: spacing[2],
            }}>
              Contents
            </p>
            {items.map((item, i) => {
              const d = depthLabel(item.depth);
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: `${spacing[2]}px 0`,
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                    opacity: bodyVisible ? 1 : 0,
                    transform: bodyVisible ? "translateX(0)" : "translateX(-10px)",
                    transition: `opacity ${duration.normal}ms ease ${400 + i * 50}ms, transform ${duration.normal}ms ease ${400 + i * 50}ms`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: spacing[2] }}>
                    <span style={{
                      fontSize: 10,
                      color: item.mastered ? meta.color : colors.zinc,
                    }}>
                      {item.mastered ? "◆" : "◇"}
                    </span>
                    <span style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: item.mastered ? colors.ivory : colors.zinc,
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: spacing[3] }}>
                    <span style={{
                      fontFamily: typography.caption.fontFamily,
                      fontSize: 10,
                      color: d.color,
                    }}>
                      {d.text}
                    </span>
                    <span style={{
                      fontFamily: typography.caption.fontFamily,
                      fontSize: 10,
                      color: colors.zinc,
                    }}>
                      {item.type.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Connections */}
        {connections.length > 0 && (
          <div style={{
            marginBottom: spacing[4],
            opacity: bodyVisible ? 1 : 0,
            transition: `opacity ${duration.normal}ms ease 500ms`,
          }}>
            <p style={{
              fontFamily: typography.caption.fontFamily,
              fontSize: typography.caption.fontSize,
              color: colors.zinc,
              textTransform: "uppercase" as const,
              letterSpacing: 2,
              margin: 0,
              marginBottom: spacing[2],
            }}>
              Connected Rooms
            </p>
            <div style={{ display: "flex", gap: spacing[2], flexWrap: "wrap" }}>
              {connections.map((connId) => {
                const connMeta = PILLAR_META[connId] || PILLAR_META.none;
                return (
                  <span
                    key={connId}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: `${spacing[1]}px ${spacing[3]}px`,
                      borderRadius: radius.sm,
                      border: `1px solid ${connMeta.color}30`,
                      backgroundColor: `${connMeta.color}08`,
                      fontFamily: typography.ui.fontFamily,
                      fontSize: typography.caption.fontSize,
                      color: connMeta.color,
                      textTransform: "capitalize" as const,
                    }}
                  >
                    {connMeta.icon} {connId === "comm" ? "Communication Hall" : connId}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat chip sub-component                                            */
/* ------------------------------------------------------------------ */

function StatChip({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      flex: 1,
      textAlign: "center",
      padding: spacing[2],
      backgroundColor: `${color}08`,
      borderRadius: radius.sm,
      border: `1px solid ${color}15`,
    }}>
      <div style={{
        fontFamily: typography.display.fontFamily,
        fontSize: 20,
        color,
        fontWeight: 700,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: typography.caption.fontFamily,
        fontSize: typography.caption.fontSize,
        color: colors.zinc,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
      }}>
        {label}
      </div>
    </div>
  );
}

export type { PalaceRoomDetailProps, PalaceItem };
