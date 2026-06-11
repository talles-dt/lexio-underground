"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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

interface PalaceBlueprintProps {
  rooms?: Room[];
  maturityStage?: MaturityStage;
  onRoomClick?: (roomId: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Floor Plan Layout (isometric grid positions)                       */
/* ------------------------------------------------------------------ */

const ROOM_DEFS: Room[] = [
  { id: "entrance", name: "Entrance", pillar: "none", unlocked: true, items: 0, connectedTo: ["grammar", "vocab"] },
  { id: "grammar", name: "Grammar Room", pillar: "grammar", unlocked: false, items: 0, connectedTo: ["entrance", "vocab", "logic"] },
  { id: "vocab", name: "Vocab Room", pillar: "vocab", unlocked: false, items: 0, connectedTo: ["entrance", "grammar", "culture"] },
  { id: "logic", name: "Logic Room", pillar: "logic", unlocked: false, items: 0, connectedTo: ["grammar", "comm"] },
  { id: "culture", name: "Culture Room", pillar: "culture", unlocked: false, items: 0, connectedTo: ["vocab", "comm"] },
  { id: "comm", name: "Communication Hall", pillar: "comm", unlocked: false, items: 0, connectedTo: ["logic", "culture"] },
];

const STAGE_ROOMS: Record<MaturityStage, string[]> = {
  roots: ["entrance"],
  sprouts: ["entrance", "grammar", "vocab", "logic", "culture"],
  branches: ["entrance", "grammar", "vocab", "logic", "culture", "comm"],
  canopy: ["entrance", "grammar", "vocab", "logic", "culture", "comm"],
  underground: ["entrance", "grammar", "vocab", "logic", "culture", "comm"],
};

const STAGE_DOORS: Record<MaturityStage, [string, string][]> = {
  roots: [],
  sprouts: [],
  branches: [["grammar", "vocab"], ["grammar", "logic"]],
  canopy: [["grammar", "vocab"], ["grammar", "logic"], ["logic", "comm"], ["culture", "vocab"], ["culture", "comm"]],
  underground: [["grammar", "vocab"], ["grammar", "logic"], ["logic", "comm"], ["culture", "vocab"], ["culture", "comm"], ["entrance", "grammar"], ["entrance", "vocab"]],
};

/* ------------------------------------------------------------------ */
/*  Isometric projection helpers                                       */
/* ------------------------------------------------------------------ */

// Isometric transform: x-axis goes right-down, y-axis goes left-down
function isoProject(gridX: number, gridY: number, scale = 1): { x: number; y: number } {
  return {
    x: (gridX - gridY) * 60 * scale,
    y: (gridX + gridY) * 30 * scale,
  };
}

// Room positions on isometric grid (col, row)
const ROOM_POSITIONS: Record<string, [number, number]> = {
  entrance: [1, 3],
  grammar:  [0, 1],
  vocab:    [2, 1],
  logic:    [0, 3],
  culture:  [2, 3],
  comm:     [1, 4],
};

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: "#22C55E",
  culture: colors.violet,
  comm: colors.phosphorFixedDim,
  none: colors.zinc,
};

/* ------------------------------------------------------------------ */
/*  SVG Room Component                                                 */
/* ------------------------------------------------------------------ */

const ROOM_WIDTH = 120;
const ROOM_HEIGHT = 60;

function IsoRoom({
  room,
  center,
  color,
  unlocked,
  hovered,
  onHover,
  onClick,
  animDelay,
}: {
  room: Room;
  center: { x: number; y: number };
  color: string;
  unlocked: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  animDelay: number;
}) {
  const hw = ROOM_WIDTH / 2;
  const hh = ROOM_HEIGHT / 2;

  // Isometric diamond points
  const top =    `${center.x},${center.y - hh}`;
  const right =  `${center.x + hw},${center.y}`;
  const bottom = `${center.x},${center.y + hh}`;
  const left =   `${center.x - hw},${center.y}`;

  const opacity = unlocked ? 1 : 0.35;
  const strokeW = hovered && unlocked ? 2.5 : 1.5;
  const strokeColor = unlocked ? color : colors.zinc;
  const fillColor = unlocked ? `${color}15` : "transparent";
  const glowFilter = hovered && unlocked ? `url(#glow-${room.id})` : undefined;

  return (
    <g
      onMouseEnter={() => onHover(room.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => unlocked && onClick(room.id)}
      style={{ cursor: unlocked ? "pointer" : "default" }}
    >
      {/* Glow filter definition */}
      <defs>
        <filter id={`glow-${room.id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Room diamond */}
      <polygon
        points={`${top} ${right} ${bottom} ${left}`}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeW}
        opacity={opacity}
        filter={glowFilter}
        style={{
          transition: `all ${duration.normal}ms ease-out`,
        }}
      />

      {/* Dotted outline for locked rooms */}
      {!unlocked && (
        <polygon
          points={`${top} ${right} ${bottom} ${left}`}
          fill="none"
          stroke={colors.zinc}
          strokeWidth={1}
          strokeDasharray="4 4"
          opacity={0.4}
        />
      )}

      {/* Room name label */}
      <text
        x={center.x}
        y={center.y - 4}
        textAnchor="middle"
        fill={unlocked ? colors.ivory : colors.zinc}
        fontFamily="JetBrainsMono-Medium, monospace"
        fontSize={10}
        fontWeight={500}
        opacity={opacity}
        style={{ transition: `all ${duration.normal}ms ease-out` }}
      >
        {room.name}
      </text>

      {/* Item count */}
      {unlocked && room.items > 0 && (
        <text
          x={center.x}
          y={center.y + 12}
          textAnchor="middle"
          fill={color}
          fontFamily="JetBrainsMono-Regular, monospace"
          fontSize={8}
          opacity={0.7}
        >
          {room.items} items
        </text>
      )}

      {/* Lock icon for locked rooms */}
      {!unlocked && (
        <text
          x={center.x}
          y={center.y + 12}
          textAnchor="middle"
          fill={colors.zinc}
          fontSize={10}
          opacity={0.4}
        >
          🔒
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  SVG Door (connection between rooms)                                */
/* ------------------------------------------------------------------ */

function IsoDoor({
  from,
  to,
  active,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  active: boolean;
}) {
  if (!active) return null;

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;

  return (
    <g>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={colors.phosphorFixedDim}
        strokeWidth={1}
        strokeDasharray="6 3"
        opacity={0.5}
      />
      {/* Door marker (small diamond at midpoint) */}
      <rect
        x={mx - 3}
        y={my - 3}
        width={6}
        height={6}
        fill={colors.phosphorFixedDim}
        opacity={0.6}
        transform={`rotate(45, ${mx}, ${my})`}
      />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Grid overlay                                                       */
/* ------------------------------------------------------------------ */

function BlueprintGrid({ width, height }: { width: number; height: number }) {
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
/*  PalaceBlueprint Component                                          */
/* ------------------------------------------------------------------ */

const PalaceBlueprint: React.FC<PalaceBlueprintProps> = ({
  rooms: propRooms,
  maturityStage = "roots",
  onRoomClick,
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [revealedRooms, setRevealedRooms] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge prop rooms with defaults
  const rooms = (propRooms && propRooms.length > 0 ? propRooms : ROOM_DEFS).map((r) => {
    const def = ROOM_DEFS.find((d) => d.id === r.id);
    return { ...def, ...r } as Room;
  });

  // Unlock rooms based on maturity stage
  const unlockedIds = STAGE_ROOMS[maturityStage] || STAGE_ROOMS.roots;
  const activeDoors = STAGE_DOORS[maturityStage] || [];

  const enrichedRooms = rooms.map((r) => ({
    ...r,
    unlocked: r.unlocked || unlockedIds.includes(r.id),
  }));

  // Staggered room reveal animation
  useEffect(() => {
    const ids = unlockedIds;
    ids.forEach((id, i) => {
      setTimeout(() => {
        setRevealedRooms((prev) => new Set(prev).add(id));
      }, i * 300);
    });
  }, [maturityStage]);

  // Compute SVG positions
  const svgWidth = 600;
  const svgHeight = 450;
  const offsetX = svgWidth / 2;
  const offsetY = 60;

  const positions: Record<string, { x: number; y: number }> = {};
  for (const [id, [gx, gy]] of Object.entries(ROOM_POSITIONS)) {
    const p = isoProject(gx, gy);
    positions[id] = { x: p.x + offsetX, y: p.y + offsetY };
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      {/* Maturity stage label */}
      <div style={{
        textAlign: "center" as const,
        marginBottom: spacing[3],
        fontFamily: typography.display.fontFamily,
        fontSize: 14,
        color: colors.zinc,
        textTransform: "uppercase" as const,
        letterSpacing: 3,
      }}>
        {maturityStage === "underground" ? "The Underground" : maturityStage}
      </div>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        {/* Background grid */}
        <BlueprintGrid width={svgWidth} height={svgHeight} />

        {/* Doors (connections) */}
        {activeDoors.map(([fromId, toId]) => (
          <IsoDoor
            key={`${fromId}-${toId}`}
            from={positions[fromId]}
            to={positions[toId]}
            active={true}
          />
        ))}

        {/* Rooms */}
        {enrichedRooms.map((room, i) => {
          const pos = positions[room.id];
          if (!pos) return null;
          const isVisible = revealedRooms.has(room.id);
          const color = PILLAR_COLORS[room.pillar] || colors.zinc;

          return (
            <g
              key={room.id}
              opacity={isVisible ? 1 : 0}
              style={{
                transition: `opacity ${duration.reveal}ms ease-out`,
              }}
            >
              <IsoRoom
                room={room}
                center={pos}
                color={color}
                unlocked={room.unlocked}
                hovered={hoveredRoom === room.id}
                onHover={setHoveredRoom}
                onClick={onRoomClick || (() => {})}
                animDelay={i * 300}
              />
            </g>
          );
        })}

        {/* "New Rooms" indicator for branches+ */}
        {(maturityStage === "branches" || maturityStage === "canopy" || maturityStage === "underground") && positions["comm"] && (
          <text
            x={positions["comm"].x}
            y={positions["comm"].y + ROOM_HEIGHT / 2 + 20}
            textAnchor="middle"
            fill={colors.amber}
            fontFamily="JetBrainsMono-Regular, monospace"
            fontSize={9}
            opacity={0.7}
          >
            ← newly unlocked
          </text>
        )}
      </svg>

      {/* Room detail tooltip */}
      {hoveredRoom && enrichedRooms.find((r) => r.id === hoveredRoom)?.unlocked && (
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
          {enrichedRooms.find((r) => r.id === hoveredRoom)?.name}
          {enrichedRooms.find((r) => r.id === hoveredRoom)?.items
            ? ` — ${enrichedRooms.find((r) => r.id === hoveredRoom)?.items} items`
            : " — empty room"}
        </div>
      )}
    </div>
  );
};

export default PalaceBlueprint;
export type { PalaceBlueprintProps, Room, MaturityStage };
