"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type MaturityStage = "roots" | "sprouts" | "branches" | "canopy" | "underground";

interface Room {
  id: string;
  name: string;
  pillar: string;
  unlocked: boolean;
  items: number;
  connectedTo: string[];
}

interface PalaceConstructionProps {
  rooms?: Room[];
  maturityStage?: MaturityStage;
  onRoomClick?: (roomId: string) => void;
  onComplete?: () => void;
  skip?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Layout constants (shared with PalaceBlueprint)                     */
/* ------------------------------------------------------------------ */

const ROOM_DEFS: Room[] = [
  { id: "entrance", name: "Entrance", pillar: "none", unlocked: true, items: 0, connectedTo: ["grammar", "vocab"] },
  { id: "grammar", name: "Grammar Room", pillar: "grammar", unlocked: false, items: 0, connectedTo: ["entrance", "vocab", "logic"] },
  { id: "vocab", name: "Vocab Room", pillar: "vocab", unlocked: false, items: 0, connectedTo: ["entrance", "grammar", "culture"] },
  { id: "logic", name: "Logic Room", pillar: "logic", unlocked: false, items: 0, connectedTo: ["grammar", "comm"] },
  { id: "culture", name: "Culture Room", pillar: "culture", unlocked: false, items: 0, connectedTo: ["vocab", "comm"] },
  { id: "comm", name: "Communication Hall", pillar: "comm", unlocked: false, items: 0, connectedTo: ["logic", "culture"] },
];

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: "#22C55E",
  culture: colors.violet,
  comm: colors.phosphorFixedDim,
  none: colors.zinc,
};

const ROOM_WIDTH = 120;
const ROOM_HEIGHT = 60;

// Isometric projection
function isoProject(gridX: number, gridY: number, scale = 1): { x: number; y: number } {
  return {
    x: (gridX - gridY) * 60 * scale,
    y: (gridX + gridY) * 30 * scale,
  };
}

const ROOM_POSITIONS: Record<string, [number, number]> = {
  entrance: [1, 3],
  grammar:  [0, 1],
  vocab:    [2, 1],
  logic:    [0, 3],
  culture:  [2, 3],
  comm:     [1, 4],
};

// Construction sequence defines the order rooms draw in.
// Frame 2: Entrance only. Frame 3: 4 pillar rooms. Frame 4: Comm hall.
const CONSTRUCTION_FRAMES = {
  // Frame 1 (2s): Grid — handled by phase
  // Frame 2 (3s): Entrance room draws wall-by-wall
  entrance: ["entrance"],
  // Frame 3 (4s): Pillar rooms outline in sequence (dotted, unlabeled)
  pillars: ["grammar", "vocab", "logic", "culture"],
  // Frame 4 (2s): Communication Hall draws, corridor lines connect rooms
  commhall: ["comm"],
} as const;

/* ------------------------------------------------------------------ */
/*  Animation phases                                                   */
/* ------------------------------------------------------------------ */

// Total ~13s:
// Phase 0 (0-2s):    Grid fades in
// Phase 1 (2-5s):    Entrance room draws, wall by wall (stroke-dasharray)
// Phase 2 (5-9s):    Pillar rooms outline in sequence (dotted, unlabeled)
// Phase 3 (9-11s):   Comm Hall draws, corridor connection lines draw
// Phase 4 (11-13s):  Rooms fill with surface color, doors draw open
// Phase 5 (13s+):    Complete — interactive blueprint

const PHASE_MS = [0, 2000, 5000, 9000, 11000, 13000];

type AnimPhase = 0 | 1 | 2 | 3 | 4 | 5;

/* ------------------------------------------------------------------ */
/*  SVG helpers                                                        */
/* ------------------------------------------------------------------ */

function roomDiamond(center: { x: number; y: number }) {
  const hw = ROOM_WIDTH / 2;
  const hh = ROOM_HEIGHT / 2;
  return {
    top:    { x: center.x, y: center.y - hh },
    right:  { x: center.x + hw, y: center.y },
    bottom: { x: center.x, y: center.y + hh },
    left:   { x: center.x - hw, y: center.y },
  };
}

function diamondPointsStr(center: { x: number; y: number }): string {
  const d = roomDiamond(center);
  return `${d.top.x},${d.top.y} ${d.right.x},${d.right.y} ${d.bottom.x},${d.bottom.y} ${d.left.x},${d.left.y}`;
}

// Perimeter length of diamond for stroke-dasharray animation
function diamondPerimeter(): number {
  const hw = ROOM_WIDTH / 2;
  const hh = ROOM_HEIGHT / 2;
  const side = Math.sqrt(hw * hw + hh * hh);
  return side * 4;
}

/* ------------------------------------------------------------------ */
/*  Grid overlay                                                       */
/* ------------------------------------------------------------------ */

function BlueprintGrid({ width, height, visible }: { width: number; height: number; visible: boolean }) {
  if (!visible) return null;
  const lines: React.ReactNode[] = [];
  const step = 30;
  for (let x = 0; x < width; x += step) {
    lines.push(
      <line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} stroke={colors.zinc} strokeWidth={0.3} opacity={0.15} />
    );
  }
  for (let y = 0; y < height; y += step) {
    lines.push(
      <line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} stroke={colors.zinc} strokeWidth={0.3} opacity={0.15} />
    );
  }
  return <g>{lines}</g>;
}

/* ------------------------------------------------------------------ */
/*  Animated room polygon — wall-by-wall drawing for entrance          */
/* ------------------------------------------------------------------ */

function DrawingRoom({
  center,
  color,
  progress, // 0→1, how much of the outline is drawn
  dotted,
  filled,
  label,
}: {
  center: { x: number; y: number };
  color: string;
  progress: number;  // 0→1
  dotted?: boolean;
  filled?: boolean;
  label?: string;
}) {
  const perimeter = diamondPerimeter();
  const dashOffset = perimeter * (1 - progress);

  return (
    <g>
      <polygon
        points={diamondPointsStr(center)}
        fill={filled ? `${color}15` : "transparent"}
        stroke={color}
        strokeWidth={dotted ? 1 : 1.5}
        strokeDasharray={dotted ? "4 4" : `${perimeter}`}
        strokeDashoffset={dashOffset}
        opacity={dotted ? 0.4 : progress > 0 ? 1 : 0}
        style={{
          transition: "fill 600ms ease, stroke-dashoffset 50ms linear, opacity 300ms ease",
        }}
      />
      {label && filled && (
        <text
          x={center.x}
          y={center.y - 4}
          textAnchor="middle"
          fill={colors.ivory}
          fontFamily="JetBrainsMono-Medium, monospace"
          fontSize={10}
          fontWeight={500}
          opacity={0.8}
          style={{ transition: "opacity 500ms ease" }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Corridor line drawing (stroke-dasharray)                           */
/* ------------------------------------------------------------------ */

function DrawingCorridor({
  from,
  to,
  progress,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  progress: number; // 0→1
}) {
  const length = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
  const dashOffset = length * (1 - progress);

  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={colors.phosphorFixedDim}
      strokeWidth={1}
      strokeDasharray={`${length}`}
      strokeDashoffset={dashOffset}
      opacity={0.5}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PalaceConstruction({
  rooms: propRooms,
  maturityStage = "roots",
  onRoomClick,
  onComplete,
  skip = false,
}: PalaceConstructionProps) {
  const [phase, setPhase] = useState<AnimPhase>(0);
  const [entranceProgress, setEntranceProgress] = useState(0);
  const [pillarProgress, setPillarProgress] = useState<Record<string, number>>({});
  const [commProgress, setCommProgress] = useState(0);
  const [corridorProgress, setCorridorProgress] = useState<Record<string, number>>({});
  const [filledRooms, setFilledRooms] = useState<Set<string>>(new Set());
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const rooms = (propRooms && propRooms.length > 0 ? propRooms : ROOM_DEFS).map((r) => {
    const def = ROOM_DEFS.find((d) => d.id === r.id);
    return { ...def, ...r } as Room;
  });

  // SVG layout
  const svgWidth = 600;
  const svgHeight = 450;
  const offsetX = svgWidth / 2;
  const offsetY = 60;

  const positions: Record<string, { x: number; y: number }> = {};
  for (const [id, [gx, gy]] of Object.entries(ROOM_POSITIONS)) {
    const p = isoProject(gx, gy);
    positions[id] = { x: p.x + offsetX, y: p.y + offsetY };
  }

  // Corridors: entrance↔grammar, entrance↔vocab, grammar↔logic,
  // grammar↔vocab, vocab↔culture, logic↔comm, culture↔comm
  const corridorPairs: [string, string][] = [
    ["entrance", "grammar"],
    ["entrance", "vocab"],
    ["grammar", "logic"],
    ["grammar", "vocab"],
    ["vocab", "culture"],
    ["logic", "comm"],
    ["culture", "comm"],
  ];

  // ─── Skip mode: jump to final state ──────────────────────
  useEffect(() => {
    if (!skip) return;
    setPhase(5);
    setEntranceProgress(1);
    setPillarProgress(Object.fromEntries(CONSTRUCTION_FRAMES.pillars.map((id) => [id, 1])));
    setCommProgress(1);
    setCorridorProgress(Object.fromEntries(corridorPairs.map(([a, b]) => [`${a}-${b}`, 1])));
    setFilledRooms(new Set(ROOM_DEFS.map((r) => r.id)));
    onComplete?.();
  }, [skip]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Phase timer ──────────────────────────────────────────
  useEffect(() => {
    if (skip) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    PHASE_MS.forEach((ms, i) => {
      if (i === 0) return; // phase 0 is initial
      timers.push(setTimeout(() => setPhase(i as AnimPhase), ms));
    });
    // Final callback
    timers.push(setTimeout(() => onComplete?.(), 13500));
    return () => timers.forEach(clearTimeout);
  }, [skip]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Per-phase animation loops ────────────────────────────
  // Phase 1: Entrance wall-by-wall (2s → 5s, 3s duration)
  useEffect(() => {
    if (phase < 1 || skip) return;
    startTimeRef.current = performance.now();
    const FRAME_DURATION = 3000; // 3s for full draw

    function animate(now: number) {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / FRAME_DURATION);
      setEntranceProgress(t);
      if (t < 1) frameRef.current = requestAnimationFrame(animate);
    }
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [phase, skip]);

  // Phase 2: Pillar rooms outline one-by-one (5s → 9s, 4 rooms, 1s each)
  useEffect(() => {
    if (phase < 2 || skip) return;
    const pillarIds = [...CONSTRUCTION_FRAMES.pillars];
    const ROOM_DURATION = 1000; // 1s per room

    pillarIds.forEach((id, i) => {
      const roomStart = performance.now() + i * ROOM_DURATION;
      let frame = 0;

      function animate(now: number) {
        const elapsed = now - roomStart;
        const t = Math.min(1, Math.max(0, elapsed / ROOM_DURATION));
        setPillarProgress((prev) => ({ ...prev, [id]: t }));
        if (t < 1) frame = requestAnimationFrame(animate);
      }
      // Start each room's animation staggered
      setTimeout(() => {
        frame = requestAnimationFrame(animate);
      }, i * ROOM_DURATION);

      // This is imperfect cleanup but acceptable for a one-shot animation
      return () => cancelAnimationFrame(frame);
    });
  }, [phase, skip]);

  // Phase 3: Comm hall + corridor lines (9s → 11s, 2s duration)
  useEffect(() => {
    if (phase < 3 || skip) return;
    const FRAME_DURATION = 2000;
    const start = performance.now();
    let frame = 0;

    function animate(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / FRAME_DURATION);
      setCommProgress(t);
      // Corridors draw proportionally
      corridorPairs.forEach(([a, b], i) => {
        const corridorT = Math.min(1, Math.max(0, (t * corridorPairs.length - i)));
        setCorridorProgress((prev) => ({ ...prev, [`${a}-${b}`]: corridorT }));
      });
      if (t < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [phase, skip]); // eslint-disable-line react-hooks/exhaustive-deps

  // Phase 4: Rooms fill, doors "open" (11s → 13s)
  useEffect(() => {
    if (phase < 4 || skip) return;
    const ROOMS = [...CONSTRUCTION_FRAMES.entrance, ...CONSTRUCTION_FRAMES.pillars, ...CONSTRUCTION_FRAMES.commhall];
    ROOMS.forEach((id, i) => {
      setTimeout(() => {
        setFilledRooms((prev) => new Set(prev).add(id));
      }, i * 150);
    });
  }, [phase, skip]);

  // ─── Hover state for interactive phase ────────────────────
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const handleRoomClick = useCallback((roomId: string) => {
    if (phase >= 5) onRoomClick?.(roomId);
  }, [phase, onRoomClick]);

  // ─── Render ──────────────────────────────────────────────
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 640, margin: "0 auto" }}>
      {/* Phase label */}
      <div style={{
        textAlign: "center" as const,
        marginBottom: spacing[3],
        fontFamily: typography.display.fontFamily,
        fontSize: 14,
        color: phase >= 5 ? colors.zinc : colors.phosphor,
        textTransform: "uppercase" as const,
        letterSpacing: 3,
        transition: `color ${duration.reveal}ms ease`,
      }}>
        {phase === 0 && "Scanning site…"}
        {phase === 1 && "Drawing foundation…"}
        {phase === 2 && "Outlining rooms…"}
        {phase === 3 && "Connecting halls…"}
        {phase === 4 && "Opening doors…"}
        {phase >= 5 && (maturityStage === "underground" ? "The Underground" : maturityStage)}
      </div>

      {/* Skip button */}
      {phase < 5 && (
        <button
          type="button"
          onClick={() => {
            // Jump to end
            setPhase(5);
            setEntranceProgress(1);
            setPillarProgress(Object.fromEntries(CONSTRUCTION_FRAMES.pillars.map((id) => [id, 1])));
            setCommProgress(1);
            setCorridorProgress(Object.fromEntries(corridorPairs.map(([a, b]) => [`${a}-${b}`, 1])));
            setFilledRooms(new Set(ROOM_DEFS.map((r) => r.id)));
            onComplete?.();
          }}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "transparent",
            border: `1px solid ${colors.zinc}`,
            borderRadius: radius.btn,
            color: colors.zinc,
            padding: "4px 12px",
            fontFamily: typography.caption.fontFamily,
            fontSize: typography.caption.fontSize,
            cursor: "pointer",
          }}
        >
          Skip →
        </button>
      )}

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" style={{ display: "block" }}>
        {/* Frame 1 (2s): Grid fades in */}
        <g style={{ opacity: phase >= 0 ? 1 : 0, transition: "opacity 800ms ease" }}>
          <BlueprintGrid width={svgWidth} height={svgHeight} visible={phase >= 0} />
        </g>

        {/* Frame 2 (3s): Entrance room draws wall-by-wall */}
        {phase >= 1 && (
          <DrawingRoom
            center={positions.entrance}
            color={PILLAR_COLORS.none}
            progress={entranceProgress}
            filled={filledRooms.has("entrance")}
            label="Entrance"
          />
        )}

        {/* Frame 3 (4s): Pillar rooms outline in sequence (dotted, unlabeled initially) */}
        {phase >= 2 && CONSTRUCTION_FRAMES.pillars.map((id) => {
          const pos = positions[id];
          if (!pos) return null;
          const t = pillarProgress[id] ?? 0;
          return (
            <DrawingRoom
              key={id}
              center={pos}
              color={PILLAR_COLORS[ROOM_DEFS.find((r) => r.id === id)?.pillar || "none"]}
              progress={t}
              dotted={phase < 4}
              filled={filledRooms.has(id)}
              label={phase >= 4 ? ROOM_DEFS.find((r) => r.id === id)?.name : undefined}
            />
          );
        })}

        {/* Frame 4 (2s): Communication Hall draws */}
        {phase >= 3 && (
          <DrawingRoom
            center={positions.comm}
            color={PILLAR_COLORS.comm}
            progress={commProgress}
            filled={filledRooms.has("comm")}
            label={phase >= 4 ? "Communication Hall" : undefined}
          />
        )}

        {/* Frame 4: Corridor connection lines draw */}
        {phase >= 3 && corridorPairs.map(([a, b]) => {
          const key = `${a}-${b}`;
          const t = corridorProgress[key] ?? 0;
          if (t <= 0) return null;
          return (
            <DrawingCorridor
              key={key}
              from={positions[a]}
              to={positions[b]}
              progress={t}
            />
          );
        })}

        {/* Frame 5 (2s): Door markers appear on corridors once rooms are filled */}
        {phase >= 4 && corridorPairs.map(([a, b]) => {
          if (!filledRooms.has(a) || !filledRooms.has(b)) return null;
          const from = positions[a];
          const to = positions[b];
          if (!from || !to) return null;
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2;
          return (
            <rect
              key={`door-${a}-${b}`}
              x={mx - 3}
              y={my - 3}
              width={6}
              height={6}
              fill={colors.phosphorFixedDim}
              opacity={0.6}
              transform={`rotate(45, ${mx}, ${my})`}
              style={{ transition: "opacity 400ms ease" }}
            />
          );
        })}

        {/* Phase 5: Interactive hover glow filters + clickable rooms */}
        {phase >= 5 && rooms.map((room) => {
          const pos = positions[room.id];
          if (!pos) return null;
          const roomDef = ROOM_DEFS.find((r) => r.id === room.id);
          const color = PILLAR_COLORS[roomDef?.pillar || "none"];
          const isHovered = hoveredRoom === room.id;

          return (
            <g
              key={room.id}
              onMouseEnter={() => setHoveredRoom(room.id)}
              onMouseLeave={() => setHoveredRoom(null)}
              onClick={() => handleRoomClick(room.id)}
              style={{ cursor: "pointer" }}
            >
              {/* Hover glow */}
              {isHovered && (
                <polygon
                  points={diamondPointsStr(pos)}
                  fill={`${color}20`}
                  stroke={color}
                  strokeWidth={2.5}
                  style={{ transition: `all ${duration.normal}ms ease-out` }}
                />
              )}

              {/* Item count */}
              {room.items > 0 && (
                <text
                  x={pos.x}
                  y={pos.y + 12}
                  textAnchor="middle"
                  fill={color}
                  fontFamily="JetBrainsMono-Regular, monospace"
                  fontSize={8}
                  opacity={0.7}
                >
                  {room.items} items
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip (interactive phase) */}
      {phase >= 5 && hoveredRoom && (() => {
        const room = rooms.find((r) => r.id === hoveredRoom);
        if (!room) return null;
        return (
          <div style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: colors.surface,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius.card,
            padding: `${spacing[2]}px ${spacing[3]}px`,
            fontFamily: typography.ui.fontFamily,
            fontSize: 12,
            color: colors.ivory,
            whiteSpace: "nowrap" as const,
            pointerEvents: "none" as const,
          }}>
            {room.name}
            {room.items ? ` — ${room.items} items` : " — empty room"}
          </div>
        );
      })()}
    </div>
  );
}

export type { PalaceConstructionProps, Room, MaturityStage };
