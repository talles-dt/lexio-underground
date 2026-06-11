"use client";

import { useState, useEffect } from "react";
import { colors, spacing, radius } from "@/theme/tokens";

interface RoadmapPreviewProps {
  recommendedFocus: string[]; // two weakest pillars
  overallReadiness: string;
  animate?: boolean;
}

interface Room {
  name: string;
  pillar: string;
  description: string;
  icon: string;
  locked: boolean;
}

const PILLAR_ROOMS: Record<string, Room[]> = {
  grammar: [
    {
      name: "Transformation Hall",
      pillar: "grammar",
      description:
        "Surface → deep structure drills. Identify the rules behind what sounds right.",
      icon: "🏛️",
      locked: false,
    },
    {
      name: "Tense Observatory",
      pillar: "grammar",
      description:
        "Map the timeline. Past, present, future — and the spaces between.",
      icon: "🔭",
      locked: true,
    },
  ],
  logic: [
    {
      name: "Ignorance Map Room",
      pillar: "logic",
      description:
        "What you don't know you don't know. The map of your blind spots.",
      icon: "🗺️",
      locked: false,
    },
    {
      name: "Syllogism Chamber",
      pillar: "logic",
      description: "Build arguments. Tear them down. Rebuild stronger.",
      icon: "⚖️",
      locked: true,
    },
  ],
  vocab: [
    {
      name: "Chunking Workshop",
      pillar: "vocab",
      description:
        "Words that travel together. Collocations, phrasal verbs, fixed expressions.",
      icon: "🧩",
      locked: false,
    },
    {
      name: "Cultural Atom Vault",
      pillar: "vocab",
      description:
        "Memes, idioms, slang — the living language no textbook teaches.",
      icon: "💎",
      locked: true,
    },
  ],
  culture: [
    {
      name: "Context Reading Room",
      pillar: "culture",
      description:
        "What they mean vs. what they say. The gap is where culture lives.",
      icon: "📚",
      locked: false,
    },
    {
      name: "Sapir-Whorf Lab",
      pillar: "culture",
      description:
        "How language shapes thought. See the world through another tongue.",
      icon: "🧪",
      locked: true,
    },
  ],
  comm: [
    {
      name: "Fluency Arena",
      pillar: "comm",
      description:
        "Speak before you're ready. Write before it's perfect. Ship it.",
      icon: "🏟️",
      locked: false,
    },
    {
      name: "Conversation Shadow",
      pillar: "comm",
      description:
        "AI conversations that model correct speech without correcting you.",
      icon: "👤",
      locked: true,
    },
  ],
};

const PILLAR_NAMES: Record<string, string> = {
  grammar: "Gramática",
  logic: "Lógica",
  vocab: "Vocabulário",
  culture: "Cultura",
  comm: "Comunicação",
};

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: colors.violet,
  culture: "#DC2626",
  comm: "#22C55E",
};

export default function RoadmapPreview({
  recommendedFocus,
  overallReadiness,
  animate = true,
}: RoadmapPreviewProps) {
  const [visible, setVisible] = useState(!animate);
  const [roomsVisible, setRoomsVisible] = useState([false, false, false]);

  useEffect(() => {
    if (!animate) return;

    // Fade in the section
    const t1 = setTimeout(() => setVisible(true), 100);

    // Stagger room reveals
    const t2 = setTimeout(() => setRoomsVisible([true, false, false]), 400);
    const t3 = setTimeout(() => setRoomsVisible([true, true, false]), 700);
    const t4 = setTimeout(() => setRoomsVisible([true, true, true]), 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [animate]);

  // Pick 3 rooms: first from weakest pillar, second from second weakest, third random
  const rooms: Room[] = [];
  for (const pillar of recommendedFocus) {
    const pillarRooms = PILLAR_ROOMS[pillar];
    if (pillarRooms && pillarRooms.length > 0) {
      rooms.push(pillarRooms[0]); // unlocked room
    }
  }

  // Third room: pick from a different pillar
  const allPillars = ["grammar", "logic", "vocab", "culture", "comm"];
  const thirdPillar =
    allPillars.find((p) => !recommendedFocus.includes(p) && PILLAR_ROOMS[p]) ||
    "grammar";
  const thirdRooms = PILLAR_ROOMS[thirdPillar];
  if (thirdRooms && thirdRooms.length > 0) {
    rooms.push(thirdRooms[0]);
  }

  // Pad to 3 if needed
  while (rooms.length < 3) {
    rooms.push({
      name: "Coming Soon",
      pillar: "grammar",
      description: "More rooms unlock as you progress.",
      icon: "🔮",
      locked: true,
    });
  }

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "all 0.4s ease",
        marginTop: spacing[4],
        marginBottom: spacing[4],
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: spacing[4] }}>
        <p
          style={{
            fontSize: 12,
            color: colors.zinc,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: spacing[2],
          }}
        >
          Your First Month
        </p>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: colors.ivory,
            marginBottom: spacing[2],
          }}
        >
          Here's where it starts
        </h3>
        <p
          style={{
            fontSize: 14,
            color: colors.zinc,
            fontStyle: "italic",
          }}
        >
          3 rooms to explore based on your Cartografa results
        </p>
      </div>

      {/* Room cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing[3],
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        {rooms.slice(0, 3).map((room, i) => (
          <div
            key={i}
            style={{
              opacity: roomsVisible[i] ? 1 : 0,
              transform: roomsVisible[i]
                ? "translateX(0)"
                : "translateX(-20px)",
              transition: "all 0.4s ease",
              display: "flex",
              alignItems: "flex-start",
              gap: spacing[3],
              padding: spacing[3],
              backgroundColor: room.locked
                ? colors.surface
                : colors.surfaceContainerHigh,
              border: `1px solid ${
                room.locked
                  ? colors.borderSubtle
                  : `${PILLAR_COLORS[room.pillar]}40`
              }`,
              borderRadius: radius.card,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Room number */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: radius.sm,
                backgroundColor: `${PILLAR_COLORS[room.pillar]}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {room.icon}
            </div>

            {/* Room info */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing[1],
                }}
              >
                <span
                  style={{ fontSize: 15, fontWeight: 600, color: colors.ivory }}
                >
                  {room.name}
                </span>
                {room.locked && (
                  <span
                    style={{
                      fontSize: 10,
                      color: colors.amber,
                      backgroundColor: `${colors.amber}20`,
                      padding: "2px 6px",
                      borderRadius: 4,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Pro
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: colors.zinc,
                  lineHeight: 1.4,
                  marginTop: spacing[1],
                }}
              >
                {room.description}
              </p>
              <span
                style={{
                  fontSize: 11,
                  color: PILLAR_COLORS[room.pillar],
                  fontWeight: 600,
                  marginTop: spacing[2],
                  display: "block",
                }}
              >
                {PILLAR_NAMES[room.pillar]}
              </span>
            </div>

            {/* Locked overlay */}
            {room.locked && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: 60,
                  background: `linear-gradient(90deg, transparent, ${colors.surface})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: spacing[2],
                }}
              >
                <span style={{ fontSize: 18, opacity: 0.5 }}>🔒</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Cultural atom teaser */}
      <div
        style={{
          textAlign: "center",
          marginTop: spacing[4],
          padding: spacing[3],
          backgroundColor: `${colors.violet}10`,
          border: `1px solid ${colors.violet}30`,
          borderRadius: radius.card,
          maxWidth: 480,
          margin: `${spacing[4]}px auto 0`,
        }}
      >
        <p
          style={{
            fontSize: 16,
            color: colors.violet,
            marginBottom: spacing[2],
          }}
        >
          💎 Cultural Atom Preview
        </p>
        <p
          style={{
            fontSize: 13,
            color: colors.zinc,
            fontStyle: "italic",
            lineHeight: 1.5,
            marginBottom: spacing[2],
          }}
        >
          &ldquo;Break a leg&rdquo; — Inglês não é sobre traduzir palavras. É
          sobre entender o que eles realmente querem dizer.
        </p>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: spacing[4] }}>
        <p style={{ fontSize: 13, color: colors.zinc }}>
          Complete your Cartografa to unlock your full palace blueprint
        </p>
      </div>
    </div>
  );
}
