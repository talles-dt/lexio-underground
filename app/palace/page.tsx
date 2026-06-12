"use client";

import React, { useState, useEffect, useCallback } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
import { createClient } from "@supabase/supabase-js";
import PalaceBlueprintComponent from "@/components/PalaceBlueprint";
import type { PalaceBlueprintProps, Room, MaturityStage } from "@/components/PalaceBlueprint";
import PalaceConstructionComponent from "@/components/PalaceConstruction";
import type { PalaceConstructionProps } from "@/components/PalaceConstruction";

/* ------------------------------------------------------------------ */
/*  Lazy wrappers (no SSR — SVG canvas)                               */
/* ------------------------------------------------------------------ */

import dynamic from "next/dynamic";
const PalaceBlueprint = dynamic<PalaceBlueprintProps>(
  () => Promise.resolve(PalaceBlueprintComponent),
  { ssr: false }
);
const PalaceConstruction = dynamic<PalaceConstructionProps>(
  () => Promise.resolve(PalaceConstructionComponent),
  { ssr: false }
);

/* ------------------------------------------------------------------ */
/*  Supabase client                                                    */
/* ------------------------------------------------------------------ */

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    { auth: { persistSession: false } }
  );
}

/* ------------------------------------------------------------------ */
/*  Palace Page                                                        */
/* ------------------------------------------------------------------ */

export default function PalacePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [maturityStage, setMaturityStage] = useState<MaturityStage>("roots");
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [roomDetail, setRoomDetail] = useState<Record<string, unknown> | null>(null);
  const [showConstruction, setShowConstruction] = useState(false);
  const [constructionDone, setConstructionDone] = useState(false);

  // Check if user has seen the construction animation before
  useEffect(() => {
    const seen = typeof window !== "undefined" && localStorage.getItem("lexio_palace_construction_seen");
    if (!seen) {
      setShowConstruction(true);
    }
  }, []);

  // Fetch palace data from Supabase
  useEffect(() => {
    async function loadPalace() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("palaces")
          .select("rooms, total_rooms, maturity_stage")
          .limit(1)
          .single();

        if (data && !error) {
          setMaturityStage((data as Record<string, unknown>).maturity_stage as MaturityStage || "roots");
          const palaceRooms = (data as Record<string, unknown>).rooms as Room[] | undefined;
          if (palaceRooms && Array.isArray(palaceRooms)) {
            setRooms(palaceRooms);
          }
        }
      } catch {
        // No palace yet — use defaults
      } finally {
        setLoading(false);
      }
    }
    loadPalace();
  }, []);

  // Handle room click — fetch room detail
  const handleRoomClick = useCallback(async (roomId: string) => {
    setSelectedRoom(roomId);
    try {
      const supabase = getSupabase();
      const { data } = await supabase
        .from("palace_items")
        .select("*")
        .eq("room_id", roomId)
        .order("learned_at", { ascending: false })
        .limit(20);
      setRoomDetail(data as Record<string, unknown> | null);
    } catch {
      setRoomDetail(null);
    }
  }, []);

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <a href="/" style={styles.navLink}>
          <span style={styles.navLinkContent}>Home</span>
        </a>
        <a href="/diagnostico" style={styles.navLink}>
          <span style={styles.navLinkContent}>Cartografa</span>
        </a>
        <a href="/lessons" style={styles.navLink}>
          <span style={styles.navLinkContent}>Lessons</span>
        </a>
      </nav>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Memory Palace</h1>
        <p style={styles.subtitle}>
          {maturityStage === "roots" && "Your palace awaits. Begin with the Cartografa to unlock your first room."}
          {maturityStage === "sprouts" && "Five rooms stand before you. Each holds what you've yet to discover."}
          {maturityStage === "branches" && "Doors open between rooms. Knowledge flows where walls once stood."}
          {maturityStage === "canopy" && "All rooms connected. Some memories have taken root at depth."}
          {maturityStage === "underground" && "From outside: only a glowing door. Inside: infinite depth."}
        </p>
      </header>

      {/* Blueprint / Construction */}
      <main style={styles.main}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingPulse} />
            <span style={styles.loadingText}>Loading palace...</span>
          </div>
        ) : showConstruction && !constructionDone ? (
          <PalaceConstruction
            rooms={rooms}
            maturityStage={maturityStage}
            onRoomClick={handleRoomClick}
            onComplete={() => {
              setConstructionDone(true);
              setShowConstruction(false);
              if (typeof window !== "undefined") {
                localStorage.setItem("lexio_palace_construction_seen", "1");
              }
            }}
            skip={!showConstruction}
          />
        ) : (
          <PalaceBlueprint
            rooms={rooms}
            maturityStage={maturityStage}
            onRoomClick={handleRoomClick}
          />
        )}
      </main>

      {/* Room Detail Panel */}
      {selectedRoom && (
        <div style={styles.detailOverlay} onClick={() => setSelectedRoom(null)}>
          <div style={styles.detailCard} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.detailTitle}>{selectedRoom.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</h2>
            <div style={styles.detailContent}>
              {roomDetail && Array.isArray(roomDetail) && roomDetail.length > 0 ? (
                <ul style={styles.itemList}>
                  {roomDetail.map((item: unknown, i: number) => {
                    const record = item as Record<string, unknown>;
                    return (
                      <li key={i} style={styles.itemRow}>
                        <span style={styles.itemWord}>{String(record.word || record.chunk || "—")}</span>
                        <span style={styles.itemDate}>
                          {record.learned_at
                            ? new Date(String(record.learned_at)).toLocaleDateString()
                            : ""}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={styles.emptyRoom}>This room is empty. Complete lessons to fill it.</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              style={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stage legend */}
      <footer style={styles.legend}>
        {(["roots", "sprouts", "branches", "canopy", "underground"] as MaturityStage[]).map((stage) => (
          <span
            key={stage}
            style={{
              ...styles.legendItem,
              color: stage === maturityStage ? colors.phosphor : colors.zinc,
              fontWeight: stage === maturityStage ? 600 : 400,
            }}
          >
            {stage === "underground" ? "underground" : stage}
          </span>
        ))}
      </footer>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    backgroundColor: colors.obsidian,
    color: colors.ivory,
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  navLink: {
    textDecoration: "none",
  },
  navLinkContent: {
    backgroundColor: colors.phosphor,
    borderRadius: radius.btn,
    marginRight: spacing[3],
    padding: "12px 28px",
    display: "inline-block",
    color: colors.obsidian,
    fontWeight: 600,
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
  },
  header: {
    textAlign: "center",
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
  },
  title: {
    fontFamily: typography.display.fontFamily,
    fontSize: typography.display.fontSize,
    lineHeight: typography.display.lineHeight,
    color: colors.ivory,
    margin: 0,
    paddingBottom: spacing[3],
  },
  subtitle: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: typography.bodyItalic.fontStyle,
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    color: colors.zinc,
    margin: 0,
    maxWidth: 480,
    marginLeft: "auto",
    marginRight: "auto",
  },
  main: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: spacing[8],
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: spacing[3],
  },
  loadingPulse: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: colors.phosphor,
    opacity: 0.3,
    animation: `pulse 1.5s ease-in-out infinite`,
  },
  loadingText: {
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    color: colors.zinc,
  },
  detailOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(13, 13, 15, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  detailCard: {
    backgroundColor: colors.surface,
    border: `1px solid ${colors.borderSubtle}`,
    borderRadius: radius.card,
    padding: spacing[6],
    maxWidth: 480,
    width: "90%",
    maxHeight: "70vh",
    overflowY: "auto",
  },
  detailTitle: {
    fontFamily: typography.h1.fontFamily,
    fontSize: typography.h1.fontSize,
    lineHeight: typography.h1.lineHeight,
    color: colors.phosphor,
    margin: 0,
    paddingBottom: spacing[4],
  },
  detailContent: {
    paddingBottom: spacing[4],
  },
  itemList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: spacing[2],
    paddingBottom: spacing[2],
    borderBottom: `1px solid ${colors.borderSubtle}`,
  },
  itemWord: {
    fontFamily: typography.body.fontFamily,
    fontSize: typography.body.fontSize,
    color: colors.ivory,
  },
  itemDate: {
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    color: colors.zinc,
  },
  emptyRoom: {
    fontFamily: typography.bodyItalic.fontFamily,
    fontStyle: typography.bodyItalic.fontStyle,
    fontSize: typography.body.fontSize,
    color: colors.zinc,
    textAlign: "center",
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  closeButton: {
    backgroundColor: "transparent",
    border: `1px solid ${colors.zinc}`,
    borderRadius: radius.btn,
    color: colors.ivory,
    padding: "8px 20px",
    fontFamily: typography.ui.fontFamily,
    fontSize: typography.ui.fontSize,
    cursor: "pointer",
    width: "100%",
  },
  legend: {
    display: "flex",
    justifyContent: "center",
    gap: spacing[4],
    paddingBottom: spacing[6],
    fontFamily: typography.caption.fontFamily,
    fontSize: typography.caption.fontSize,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  legendItem: {
    transition: `color ${duration.normal}ms ease-out`,
  },
};
