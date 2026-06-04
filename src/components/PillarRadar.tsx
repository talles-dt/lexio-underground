"use client";

import { useEffect, useRef, useState } from "react";
import { colors } from "@/theme/tokens";

interface PillarRadarProps {
  scores: {
    grammar: number;
    logic: number;
    vocab: number;
    culture: number;
    comm: number;
  };
  size?: number;
  animate?: boolean;
  delay?: number; // initial delay before starting
}

const PILLAR_LABELS = ["Grammar", "Logic", "Vocab", "Culture", "Comm"];
const PILLAR_KEYS = ["grammar", "logic", "vocab", "culture", "comm"] as const;

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: colors.violet,
  culture: "#DC2626",
  comm: "#22C55E",
};

// Generate pentagon vertices
function getPentagonPoints(
  cx: number,
  cy: number,
  radius: number
): [number, number][] {
  const points: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2; // start from top
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  return points;
}

// Scale a single point by a score factor (0 = at center, 1 = at full radius)
function scalePoint(
  point: [number, number],
  cx: number,
  cy: number,
  factor: number
): [number, number] {
  return [cx + (point[0] - cx) * factor, cy + (point[1] - cy) * factor];
}

// Convert points to SVG polygon string
function pointsToString(points: [number, number][]): string {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function PillarRadar({
  scores,
  size = 280,
  animate = true,
  delay = 0,
}: PillarRadarProps) {
  // Per-pillar progress: 0 = not started, 0→1 = animating, 1 = done
  const [pillarProgress, setPillarProgress] = useState<number[]>([
    0, 0, 0, 0, 0,
  ]);
  const animRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const labelRadius = size * 0.46;

  // Progressive reveal: Grammar first, then Logic, Vocab, Culture, Comm
  // Each pillar takes ~600ms to animate. Next pillar starts when previous hits 1.
  // Stagger delays: pillar 0 starts at 0ms, pillar 1 at 600ms, pillar 2 at 1200ms, etc.
  useEffect(() => {
    if (!animate) {
      setPillarProgress([1, 1, 1, 1, 1]);
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const PILLAR_DURATION = 700; // ms per pillar
    const STAGGER = 500; // ms between pillar starts (overlap so next starts before prev finishes)

    const tick = () => {
      const baseTime = Date.now() - delay;
      const progresses = PILLAR_KEYS.map((_, i) => {
        const pillarStart = i * STAGGER;
        const elapsedMs = Math.max(0, baseTime - pillarStart);
        const t = Math.min(1, elapsedMs / PILLAR_DURATION);
        // Ease out cubic
        return 1 - Math.pow(1 - t, 3);
      });

      setPillarProgress(progresses);

      // Keep animating until last pillar is complete
      if (progresses[4] < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate, delay]);

  // Build animated scores based on per-pillar progress
  const animatedScores = {
    grammar: scores.grammar * pillarProgress[0],
    logic: scores.logic * pillarProgress[1],
    vocab: scores.vocab * pillarProgress[2],
    culture: scores.culture * pillarProgress[3],
    comm: scores.comm * pillarProgress[4],
  };

  const basePoints = getPentagonPoints(cx, cy, radius);

  const currentDataPoints = basePoints.map((pt, i) => {
    const key = PILLAR_KEYS[i];
    const score = scores[key] ?? 0;
    const target = scalePoint(pt, cx, cy, score);
    const prog = pillarProgress[i] ?? 0;
    return scalePoint(target, cx, cy, prog);
  }) as [number, number][];

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const labelPoints = getPentagonPoints(cx, cy, labelRadius);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {/* Grid levels — only reveal as pillars progress */}
      {gridLevels.map((level, i) => {
        const gridPoints = getPentagonPoints(cx, cy, radius * level);
        // Fade in grid as first pillar progresses
        const gridOpacity = Math.min(0.3, pillarProgress[0] * 0.3);
        return (
          <polygon
            key={i}
            points={pointsToString(gridPoints)}
            fill="none"
            stroke={colors.zinc}
            strokeWidth={0.5}
            opacity={gridOpacity}
            style={{ transition: "opacity 0.3s ease" }}
          />
        );
      })}

      {/* Axis lines — reveal progressively */}
      {basePoints.map(([x, y], i) => {
        const prog = pillarProgress[i] ?? 0;
        // Axis line: endpoint animates from center outward
        const endX = cx + (x - cx) * Math.min(1, prog * 2);
        const endY = cy + (y - cy) * Math.min(1, prog * 2);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={endX}
            y2={endY}
            stroke={colors.zinc}
            strokeWidth={0.5}
            opacity={0.3}
            style={{ transition: "all 0.3s ease" }}
          />
        );
      })}

      {/* Data polygon — fill (only from started pillars) */}
      {pillarProgress.some((p) => p > 0) && (
        <polygon
          points={pointsToString(currentDataPoints)}
          fill={colors.phosphor}
          fillOpacity={0.15}
          stroke="none"
        />
      )}

      {/* Data polygon — stroke */}
      {pillarProgress.some((p) => p > 0) && (
        <polygon
          points={pointsToString(currentDataPoints)}
          fill="none"
          stroke={colors.phosphor}
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ transition: "all 0.3s ease" }}
        />
      )}

      {/* Data points — each appears when its pillar starts */}
      {currentDataPoints.map(([x, y], i) => {
        const key = PILLAR_KEYS[i];
        const score = animatedScores[key];
        const prog = pillarProgress[i] ?? 0;
        const isActive = prog > 0;
        const isComplete = prog >= 1;

        return (
          <g key={i}>
            {/* Connecting line from previous point (if both pillars active) */}
            {i > 0 && pillarProgress[i - 1] > 0 && pillarProgress[i] > 0 && (
              <line
                x1={currentDataPoints[i - 1][0]}
                y1={currentDataPoints[i - 1][1]}
                x2={x}
                y2={y}
                stroke={PILLAR_COLORS[key]}
                strokeWidth={1.5}
                strokeOpacity={isComplete ? 0.6 : 0.3}
                style={{ transition: "all 0.2s ease" }}
              />
            )}
            {/* Connect last to first to close the pentagon if all active */}
            {i === 4 && pillarProgress[0] > 0 && pillarProgress[4] > 0 && (
              <line
                x1={x}
                y1={y}
                x2={currentDataPoints[0][0]}
                y2={currentDataPoints[0][1]}
                stroke={colors.phosphor}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                style={{ transition: "all 0.2s ease" }}
              />
            )}

            {/* Data point circle */}
            {isActive && (
              <circle
                cx={x}
                cy={y}
                r={isComplete ? 5 : 3 + prog * 2}
                fill={PILLAR_COLORS[key]}
                stroke={colors.obsidian}
                strokeWidth={2}
                style={{
                  transition: "all 0.3s ease",
                  opacity: Math.min(1, prog * 2),
                }}
              />
            )}

            {/* Score tooltip — only when pillar is complete */}
            {isComplete && (
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                fill={colors.ivory}
                fontSize={11}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight={600}
                style={{
                  opacity: isComplete ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              >
                {Math.round(score * 100)}%
              </text>
            )}
          </g>
        );
      })}

      {/* Labels — reveal as each pillar starts */}
      {labelPoints.map(([x, y], i) => {
        const key = PILLAR_KEYS[i];
        const score = animatedScores[key];
        const prog = pillarProgress[i] ?? 0;
        const isTop = i === 0;
        const isBottom = i === 3;
        const isActive = prog > 0;
        const isComplete = prog >= 1;

        return (
          <g
            key={i}
            style={{
              opacity: isActive ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            {/* Pillar name */}
            <text
              x={x}
              y={isTop ? y - 8 : isBottom ? y + 16 : y}
              textAnchor="middle"
              dominantBaseline={
                isTop ? "auto" : isBottom ? "hanging" : "middle"
              }
              fill={PILLAR_COLORS[key]}
              fontSize={12}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight={600}
            >
              {PILLAR_LABELS[i]}
            </text>
            {/* Score below label */}
            {isComplete && (
              <text
                x={x}
                y={isTop ? y + 4 : isBottom ? y + 28 : y + 14}
                textAnchor="middle"
                fill={colors.zinc}
                fontSize={10}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {Math.round(score * 100)}%
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
