"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLearnerStore } from "@/stores/learnerStore";
import { PillarRadar } from "@/components/PillarRadar";
import { colors } from "@/theme/tokens";

/**
 * LivePillarRadar — subscribes to learnerStore.pillarScores and
 * re-animates the radar whenever scores change (post-session updates).
 *
 * Usage: drop in place of <PillarRadar ... /> wherever you want
 * live-updating scores (e.g. dashboard, post-session summary).
 */
export function LivePillarRadar({
  size = 280,
  fallbackScores,
}: {
  size?: number;
  fallbackScores?: {
    grammar: number;
    logic: number;
    vocab: number;
    culture: number;
    comm: number;
  };
}) {
  const pillarScores = useLearnerStore((s) => s.pillarScores);
  const lastUpdate = useLearnerStore((s) => s.lastScoreUpdate);
  const prevUpdateRef = useRef<number | null>(null);
  const [animate, setAnimate] = useState(true);
  const [flash, setFlash] = useState(false);

  const scores: { grammar: number; logic: number; vocab: number; culture: number; comm: number } = {
    grammar: 0,
    logic: 0,
    vocab: 0,
    culture: 0,
    comm: 0,
  };

  if (pillarScores) {
    scores.grammar = pillarScores.grammar ?? 0;
    scores.logic = pillarScores.logic ?? 0;
    scores.vocab = pillarScores.vocab ?? 0;
    scores.culture = pillarScores.culture ?? 0;
    scores.comm = pillarScores.comm ?? 0;
  } else if (fallbackScores) {
    scores.grammar = fallbackScores.grammar;
    scores.logic = fallbackScores.logic;
    scores.vocab = fallbackScores.vocab;
    scores.culture = fallbackScores.culture;
    scores.comm = fallbackScores.comm;
  }

  // When lastScoreUpdate changes, trigger re-animation + flash
  useEffect(() => {
    if (lastUpdate !== null && lastUpdate !== prevUpdateRef.current) {
      prevUpdateRef.current = lastUpdate;
      setAnimate(false);
      setFlash(true);
      // Small delay to let React process the state reset, then re-enable animation
      const t1 = setTimeout(() => setAnimate(true), 50);
      const t2 = setTimeout(() => setFlash(false), 600);
      return () => { clearTimeout(t1); clearTimeout(t2); }
    }
  }, [lastUpdate]);

  return (
    <div style={{ position: "relative" }}>
      <PillarRadar
        scores={scores}
        size={size}
        animate={animate}
        delay={0}
      />
      {/* Flash overlay when scores update */}
      {flash && (
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          backgroundColor: `${colors.phosphor}08`,
          pointerEvents: "none",
          animation: "radar-flash 600ms ease-out forwards",
        }} />
      )}
      <style>{`
        @keyframes radar-flash {
          0% { opacity: 1; transform: scale(0.95); }
          100% { opacity: 0; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
