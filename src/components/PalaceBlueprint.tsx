"use client";

import { useEffect, useRef, useState } from "react";
import { colors, spacing } from "@/theme/tokens";

// ─── TYPES ──────────────────────────────────────────────────
export interface RoomData {
  slug: string;
  name: string;
  pillar: string;
  description: string;
  icon: string;
  unlocked: boolean;
  itemsCount: number;
  color: string;
}

export interface BlueprintConfig {
  gridSize: number;
  roomPositions: Record<string, { x: number; y: number }>;
}

interface PalaceBlueprintProps {
  rooms: RoomData[];
  config?: BlueprintConfig;
  animate?: boolean;
  onRoomClick?: (slug: string) => void;
  activeRoom?: string;
}

// ─── DEFAULT CONFIG ─────────────────────────────────────────
const DEFAULT_CONFIG: BlueprintConfig = {
  gridSize: 6,
  roomPositions: {
    grammar: { x: 0, y: 0 },
    logic: { x: 2, y: 1 },
    vocab: { x: 1, y: 2 },
    culture: { x: 3, y: 2 },
    comm: { x: 1, y: 3 },
  },
};

const DEFAULT_ROOMS: RoomData[] = [
  {
    slug: "transformation-hall",
    name: "Transformation Hall",
    pillar: "grammar",
    description: "Surface → deep structure drills",
    icon: "🏛️",
    unlocked: true,
    itemsCount: 0,
    color: colors.phosphor,
  },
  {
    slug: "ignorance-map",
    name: "Ignorance Map Room",
    pillar: "logic",
    description: "What you don't know you don't know",
    icon: "🗺️",
    unlocked: true,
    itemsCount: 0,
    color: colors.amber,
  },
  {
    slug: "chunking-workshop",
    name: "Chunking Workshop",
    pillar: "vocab",
    description: "Words that travel together",
    icon: "🧩",
    unlocked: true,
    itemsCount: 0,
    color: colors.violet,
  },
  {
    slug: "context-reading-room",
    name: "Context Reading Room",
    pillar: "culture",
    description: "What they mean vs. what they say",
    icon: "📚",
    unlocked: true,
    itemsCount: 0,
    color: "#DC2626",
  },
  {
    slug: "fluency-arena",
    name: "Fluency Arena",
    pillar: "comm",
    description: "Speak before you're ready",
    icon: "🏟️",
    unlocked: true,
    itemsCount: 0,
    color: "#22C55E",
  },
];

// ─── ISOMETRIC HELPERS ──────────────────────────────────────
function toIsometric(
  x: number,
  y: number,
  tileW: number,
  tileH: number,
  ox: number,
  oy: number,
): [number, number] {
  const isoX = (x - y) * tileW + ox;
  const isoY = (x + y) * tileH + oy;
  return [isoX, isoY];
}

// Room dimensions in isometric space (width, height in pixels)
const ROOM_W = 120;
const ROOM_H = 80;

// ─── COMPONENT ──────────────────────────────────────────────
export default function PalaceBlueprint({
  rooms = DEFAULT_ROOMS,
  config = DEFAULT_CONFIG,
  animate = true,
  onRoomClick,
  activeRoom,
}: PalaceBlueprintProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [reveal, setReveal] = useState(!animate);
  const [roomReveals, setRoomReveals] = useState<boolean[]>([
    false, false, false, false, false,
  ]);

  // Staggered reveal animation
  useEffect(() => {
    if (!animate) {
      setReveal(true);
      setRoomReveals([true, true, true, true, true]);
      return;
    }

    // Fade in the whole component
    const t1 = setTimeout(() => setReveal(true), 200);

    // Stagger room reveals every 300ms
    const timers = rooms.map((_, i) =>
      setTimeout(() => {
        setRoomReveals((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 400 + i * 300),
    );

    return () => {
      clearTimeout(t1);
      timers.forEach(clearTimeout);
    };
  }, [animate, rooms.length]);

  // Calculate SVG dimensions
  const tileW = ROOM_W / 2;
  const tileH = ROOM_H / 2;
  const padding = ROOM_W;
  const ox = padding;
  const oy = padding + ROOM_H / 2;

  // Calculate bounds
  let maxX = 0,
    maxY = 0;
  for (const room of rooms) {
    const pos = config.roomPositions[room.pillar] || { x: 0, y: 0 };
    const [ix, iy] = toIsometric(pos.x, pos.y, tileW, tileH, ox, oy);
    maxX = Math.max(maxX, ix + ROOM_W);
    maxY = Math.max(maxY, iy + ROOM_H / 2);
  }

  const svgW = maxX + padding;
  const svgH = maxY + padding;

  return (
    <div
      style={{
        opacity: reveal ? 1 : 0,
        transition: "opacity 0.5s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Label */}
      <p
        style={{
          fontSize: 13,
          color: colors.zinc,
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: spacing[2],
        }}
      >
        Your Memory Palace
      </p>

      {/* SVG Blueprint */}
      <svg
        ref={svgRef}
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ overflow: "visible", maxWidth: "100%" }}
      >
        {/* Grid lines (faint) */}
        {[0, 1, 2, 3, 4, 5].map((gx) =>
          [0, 1, 2, 3, 4, 5].map((gy) => {
            const [ix, iy] = toIsometric(gx, gy, tileW, tileH, ox, oy);
            return (
              <g key={`grid-${gx}-${gy}`}>
                <line
                  x1={ix}
                  y1={iy}
                  x2={ix + tileW}
                  y2={iy + tileH}
                  stroke={colors.zinc}
                  strokeWidth={0.3}
                  opacity={0.15}
                />
                <line
                  x1={ix}
                  y1={iy}
                  x2={ix - tileW}
                  y2={iy + tileH}
                  stroke={colors.zinc}
                  strokeWidth={0.3}
                  opacity={0.15}
                />
              </g>
            );
          }),
        )}

        {/* Rooms */}
        {rooms.map((room, i) => {
          const pos = config.roomPositions[room.pillar] || { x: 0, y: 0 };
          const [ix, iy] = toIsometric(pos.x, pos.y, tileW, tileH, ox, oy);
          const revealed = roomReveals[i] ?? false;
          const isActive = activeRoom === room.slug;

          // Room polygon points (isometric diamond)
          const top: [number, number] = [ix, iy - ROOM_H / 2];
          const right: [number, number] = [ix + ROOM_W / 2, iy];
          const bottom: [number, number] = [ix, iy + ROOM_H / 2];
          const left: [number, number] = [ix - ROOM_W / 2, iy];

          const points = [top, right, bottom, left]
            .map((p) => `${p[0]},${p[1]}`)
            .join(" ");

          return (
            <g
              key={room.slug}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.5s ease ${i * 0.1}s`,
                cursor: onRoomClick ? "pointer" : "default",
              }}
              onClick={() => onRoomClick?.(room.slug)}
            >
              {/* Room shape (fill) */}
              <polygon
                points={points}
                fill={room.unlocked ? `${room.color}12` : "transparent"}
                stroke={room.unlocked ? (isActive ? room.color : `${room.color}60`) : colors.zinc}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={room.unlocked ? "none" : "4 4"}
              />

              {/* Room top edge highlight */}
              <line
                x1={top[0]}
                y1={top[1]}
                x2={right[0]}
                y2={right[1]}
                stroke={room.unlocked ? `${room.color}40` : colors.zinc}
                strokeWidth={0.5}
              />
              <line
                x1={top[0]}
                y1={top[1]}
                x2={left[0]}
                y2={left[1]}
                stroke={room.unlocked ? `${room.color}40` : colors.zinc}
                strokeWidth={0.5}
              />

              {/* Room icon */}
              <text
                x={ix}
                y={iy - 4}
                textAnchor="middle"
                fontSize={24}
                opacity={room.unlocked ? 1 : 0.3}
              >
                {!room.unlocked ? "🔒" : room.icon}
              </text>

              {/* Room name */}
              <text
                x={ix}
                y={iy + 18}
                textAnchor="middle"
                fill={room.unlocked ? colors.ivory : colors.zinc}
                fontSize={10}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight={600}
              >
                {room.name}
              </text>

              {/* Item count badge */}
              {room.itemsCount > 0 && (
                <g>
                  <circle
                    cx={right[0] - 12}
                    cy={right[1] - 12}
                    r={10}
                    fill={room.color}
                  />
                  <text
                    x={right[0] - 12}
                    y={right[1] - 8}
                    textAnchor="middle"
                    fill={colors.obsidian}
                    fontSize={10}
                    fontWeight={700}
                  >
                    {room.itemsCount}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Connecting paths between unlocked rooms */}
        {rooms
          .filter((r) => r.unlocked)
          .map((room, i) => {
            if (i === 0) return null;
            const prev = rooms[i - 1];
            if (!prev.unlocked) return null;
            const pos = config.roomPositions[room.pillar] || { x: 0, y: 0 };
            const prevPos = config.roomPositions[prev.pillar] || { x: 0, y: 0 };
            const [ix, iy] = toIsometric(pos.x, pos.y, tileW, tileH, ox, oy);
            const [px, py] = toIsometric(
              prevPos.x,
              prevPos.y,
              tileW,
              tileH,
              ox,
              oy,
            );
            const revealed = roomReveals[i] ?? false;

            return (
              <line
                key={`path-${i}`}
                x1={px}
                y1={py}
                x2={ix}
                y2={iy}
                stroke={`${colors.phosphor}40`}
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={revealed ? 0.5 : 0}
                style={{ transition: "opacity 0.5s ease" }}
              />
            );
          })}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: spacing[4],
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: spacing[2],
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.slug}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: room.unlocked ? 1 : 0.4,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: room.unlocked ? room.color : colors.zinc,
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: room.unlocked ? colors.zinc : colors.zinc,
              }}
            >
              {room.icon} {room.name}
              {!room.unlocked && " 🔒"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}