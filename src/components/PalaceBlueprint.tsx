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
/*  Layout constants                                                   */
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

// 3D grid positions (x, y, z) — z is height/depth
const ROOM_POSITIONS_3D: Record<string, [number, number, number]> = {
  entrance: [1, 3, 0],
  grammar:  [0, 1, 1],
  vocab:    [2, 1, 1],
  logic:    [0, 3, 1],
  culture:  [2, 3, 1],
  comm:     [1, 4, 2],
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
/*  3D Room Card (CSS 3D transform)                                    */
/* ------------------------------------------------------------------ */

const ROOM_SIZE = 100;
const ROOM_DEPTH = 30;

function Room3D({
  room,
  gridPos,
  color,
  unlocked,
  hovered,
  visible,
  onHover,
  onClick,
  sceneRotX,
  sceneRotZ,
}: {
  room: Room;
  gridPos: [number, number, number];
  color: string;
  unlocked: boolean;
  hovered: boolean;
  visible: boolean;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  sceneRotX: number;
  sceneRotZ: number;
}) {
  const [gx, gy, gz] = gridPos;

  // Convert grid position to 3D translate
  // x: left-right, y: depth (into screen), z: height
  const tx = gx * (ROOM_SIZE + 20) - 110;
  const ty = gy * (ROOM_SIZE * 0.5 + 15) - 80;
  const tz = gz * ROOM_DEPTH;

  const opacity = unlocked ? 1 : 0.3;
  const strokeW = hovered && unlocked ? 2.5 : 1.5;
  const strokeColor = unlocked ? color : colors.zinc;
  const fillColor = unlocked ? `${color}18` : "transparent";
  const zIndex = Math.round(1000 - ty + tz);

  return (
    <div
      onMouseEnter={() => onHover(room.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => unlocked && onClick(room.id)}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: ROOM_SIZE,
        height: ROOM_SIZE * 0.6,
        transform: `translate(-50%, -50%) translate3d(${tx}px, ${ty}px, ${tz}px)`,
        transformStyle: "preserve-3d",
        zIndex,
        cursor: unlocked ? "pointer" : "default",
        opacity: visible ? opacity : 0,
        transition: `opacity ${duration.reveal}ms ease-out, transform ${duration.normal}ms ease-out`,
      }}
    >
      {/* Room floor (top face) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: fillColor,
          border: `${strokeW}px solid ${strokeColor}`,
          borderRadius: 8,
          transform: `translateZ(0px)`,
          transformStyle: "preserve-3d",
          backdropFilter: hovered && unlocked ? "blur(2px)" : "none",
          boxShadow: hovered && unlocked
            ? `0 0 20px ${color}40, 0 0 40px ${color}20`
            : `0 2px 8px rgba(0,0,0,0.3)`,
          transition: `all ${duration.normal}ms ease-out`,
        }}
      >
        {/* Room name */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          width: "100%",
          padding: `0 ${spacing[1]}px`,
        }}>
          <span style={{
            fontFamily: "JetBrainsMono-Medium, monospace",
            fontSize: 10,
            fontWeight: 500,
            color: unlocked ? colors.ivory : colors.zinc,
            letterSpacing: 0.5,
          }}>
            {room.name}
          </span>
          {unlocked && room.items > 0 && (
            <div style={{
              fontFamily: "JetBrainsMono-Regular, monospace",
              fontSize: 8,
              color,
              opacity: 0.7,
              marginTop: 2,
            }}>
              {room.items} items
            </div>
          )}
          {!unlocked && (
            <div style={{
              fontFamily: "JetBrainsMono-Regular, monospace",
              fontSize: 8,
              color: colors.zinc,
              opacity: 0.4,
              marginTop: 2,
            }}>
              🔒
            </div>
          )}
        </div>
      </div>

      {/* Room depth (side faces) — creates 3D extrusion */}
      {unlocked && (
        <>
          {/* Right face */}
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: ROOM_DEPTH,
              height: "100%",
              backgroundColor: `${color}08`,
              borderRight: `1px solid ${color}30`,
              borderTop: `1px solid ${color}30`,
              transform: `rotateY(90deg) translateZ(${ROOM_DEPTH / 2}px)`,
              transformOrigin: "right center",
              borderRadius: `0 4px 4px 0`,
            }}
          />
          {/* Bottom face */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: ROOM_DEPTH,
              backgroundColor: `${color}05`,
              borderBottom: `1px solid ${color}20`,
              borderLeft: `1px solid ${color}20`,
              transform: `rotateX(-90deg) translateZ(${ROOM_DEPTH / 2}px)`,
              transformOrigin: "bottom center",
              borderRadius: `0 0 4px 4px`,
            }}
          />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  3D Door (connection between rooms)                                 */
/* ------------------------------------------------------------------ */

function Door3D({
  fromPos,
  toPos,
  active,
  sceneRotX,
  sceneRotZ,
}: {
  fromPos: [number, number, number];
  toPos: [number, number, number];
  active: boolean;
  sceneRotX: number;
  sceneRotZ: number;
}) {
  if (!active) return null;

  const [fx, fy, fz] = fromPos;
  const [tx, ty, tz] = toPos;

  const midX = (fx + tx) / 2 * (ROOM_SIZE + 20) - 110;
  const midY = (fy + ty) / 2 * (ROOM_SIZE * 0.5 + 15) - 80;
  const midZ = (fz + tz) / 2 * ROOM_DEPTH;

  const dx = (tx - fx) * (ROOM_SIZE + 20);
  const dy = (ty - fy) * (ROOM_SIZE * 0.5 + 15);
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: length,
        height: 4,
        transform: `translate(-50%, -50%) translate3d(${midX}px, ${midY}px, ${midZ + 2}px) rotateZ(${angle}deg)`,
        transformStyle: "preserve-3d",
        zIndex: Math.round(1000 - midY + midZ),
        pointerEvents: "none",
      }}
    >
      <div style={{
        width: "100%",
        height: "100%",
        background: `repeating-linear-gradient(90deg, ${colors.phosphorFixedDim}80 0px, ${colors.phosphorFixedDim}80 6px, transparent 6px, transparent 12px)`,
        borderRadius: 2,
      }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PalaceBlueprint Component (CSS 3D)                                 */
/* ------------------------------------------------------------------ */

const PalaceBlueprint: React.FC<PalaceBlueprintProps> = ({
  rooms: propRooms,
  maturityStage = "roots",
  onRoomClick,
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [revealedRooms, setRevealedRooms] = useState<Set<string>>(new Set());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const rooms = (propRooms && propRooms.length > 0 ? propRooms : ROOM_DEFS).map((r) => {
    const def = ROOM_DEFS.find((d) => d.id === r.id);
    return { ...def, ...r } as Room;
  });

  const unlockedIds = STAGE_ROOMS[maturityStage] || STAGE_ROOMS.roots;
  const activeDoors = STAGE_DOORS[maturityStage] || [];

  const enrichedRooms = rooms.map((r) => ({
    ...r,
    unlocked: r.unlocked || unlockedIds.includes(r.id),
  }));

  // Staggered room reveal
  useEffect(() => {
    const ids = unlockedIds;
    ids.forEach((id, i) => {
      setTimeout(() => {
        setRevealedRooms((prev) => new Set(prev).add(id));
      }, i * 250);
    });
    // Reset and re-reveal on stage change
    setRevealedRooms(new Set());
    setTimeout(() => {
      ids.forEach((id, i) => {
        setTimeout(() => {
          setRevealedRooms((prev) => new Set(prev).add(id));
        }, i * 250);
      });
    }, 50);
  }, [maturityStage]);

  // Parallax: track mouse for subtle 3D rotation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  // Base rotation + parallax offset
  const baseRotX = 55;
  const baseRotZ = -35;
  const parallaxX = mousePos.y * 8; // tilt up/down based on mouse Y
  const parallaxZ = mousePos.x * 6; // rotate left/right based on mouse X
  const rotX = baseRotX + parallaxX;
  const rotZ = baseRotZ + parallaxZ;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 680,
        margin: "0 auto",
        perspective: "1200px",
        perspectiveOrigin: "50% 40%",
        height: 420,
        userSelect: "none",
      }}
    >
      {/* Maturity stage label */}
      <div style={{
        textAlign: "center",
        marginBottom: spacing[3],
        fontFamily: typography.display.fontFamily,
        fontSize: 13,
        color: colors.zinc,
        textTransform: "uppercase",
        letterSpacing: 3,
        transition: `color ${duration.normal}ms ease-out`,
      }}>
        {maturityStage === "underground" ? "⟐ The Underground ⟐" : maturityStage}
      </div>

      {/* 3D Scene container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 340,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Floor grid (3D plane) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 400,
            height: 300,
            transform: "translate(-50%, -50%) rotateX(90deg) translateZ(-10px)",
            transformStyle: "preserve-3d",
            backgroundImage: `
              linear-gradient(${colors.borderSubtle}20 1px, transparent 1px),
              linear-gradient(90deg, ${colors.borderSubtle}20 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            borderRadius: 12,
            border: `1px solid ${colors.borderSubtle}30`,
          }}
        />

        {/* Doors (connections) */}
        {activeDoors.map(([fromId, toId]) => (
          <Door3D
            key={`${fromId}-${toId}`}
            fromPos={ROOM_POSITIONS_3D[fromId]}
            toPos={ROOM_POSITIONS_3D[toId]}
            active={true}
            sceneRotX={rotX}
            sceneRotZ={rotZ}
          />
        ))}

        {/* Rooms */}
        {enrichedRooms.map((room, i) => {
          const pos = ROOM_POSITIONS_3D[room.id];
          if (!pos) return null;
          const isVisible = revealedRooms.has(room.id);
          const color = PILLAR_COLORS[room.pillar] || colors.zinc;

          return (
            <Room3D
              key={room.id}
              room={room}
              gridPos={pos}
              color={color}
              unlocked={room.unlocked}
              hovered={hoveredRoom === room.id}
              visible={isVisible}
              onHover={setHoveredRoom}
              onClick={onRoomClick || (() => {})}
              sceneRotX={rotX}
              sceneRotZ={rotZ}
            />
          );
        })}

        {/* "New Rooms" indicator */}
        {(maturityStage === "branches" || maturityStage === "canopy" || maturityStage === "underground") && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) translate3d(${1 * (ROOM_SIZE + 20) - 110}px, ${4 * (ROOM_SIZE * 0.5 + 15) - 80 + ROOM_SIZE * 0.6 + 10}px, ${2 * ROOM_DEPTH}px)`,
              fontFamily: "JetBrainsMono-Regular, monospace",
              fontSize: 9,
              color: colors.amber,
              opacity: 0.7,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            ← newly unlocked
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      {hoveredRoom && enrichedRooms.find((r) => r.id === hoveredRoom)?.unlocked && (
        <div style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: colors.surface,
          border: `1px solid ${colors.borderSubtle}`,
          borderRadius: radius.card,
          padding: `${spacing[2]}px ${spacing[3]}px`,
          fontFamily: typography.ui.fontFamily,
          fontSize: 12,
          color: colors.ivory,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: `0 4px 12px rgba(0,0,0,0.4)`,
        }}>
          {enrichedRooms.find((r) => r.id === hoveredRoom)?.name}
          {enrichedRooms.find((r) => r.id === hoveredRoom)?.items
            ? ` — ${enrichedRooms.find((r) => r.id === hoveredRoom)?.items} items`
            : " — empty room"}
        </div>
      )}

      {/* Ambient glow under the palace */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 40,
          background: `radial-gradient(ellipse, ${colors.phosphor}10 0%, transparent 70%)`,
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default PalaceBlueprint;
export type { PalaceBlueprintProps, Room, MaturityStage };
