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
  delay?: number;
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
    points.push([
      cx + radius * Math.cos(angle),
      cy + radius * Math.sin(angle),
    ]);
  }
  return points;
}

// Scale points by scores
function getScaledPoints(
  cx: number,
  cy: number,
  radius: number,
  scores: Record<string, number>
): [number, number][] {
  const basePoints = getPentagonPoints(cx, cy, radius);
  return basePoints.map(([x, y], i) => {
    const key = PILLAR_KEYS[i];
    const score = scores[key] ?? 0;
    const dx = x - cx;
    const dy = y - cy;
    return [cx + dx * score, cy + dy * score];
  });
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
  const [progress, setProgress] = useState(animate ? 0 : 1);
  const animRef = useRef<number | null>(null);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const labelRadius = size * 0.46;

  // Animate from 0 to 1
  useEffect(() => {
    if (!animate) return;

    const startTime = Date.now() + delay;
    const duration = 1200; // ms

    const tick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate, delay]);

  // Apply progress to scores
  const animatedScores = {
    grammar: scores.grammar * progress,
    logic: scores.logic * progress,
    vocab: scores.vocab * progress,
    culture: scores.culture * progress,
    comm: scores.comm * progress,
  };

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const basePoints = getPentagonPoints(cx, cy, radius);
  const dataPoints = getScaledPoints(cx, cy, radius, animatedScores);
  const labelPoints = getPentagonPoints(cx, cy, labelRadius);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {/* Grid levels */}
      {gridLevels.map((level, i) => {
        const gridPoints = getPentagonPoints(cx, cy, radius * level);
        return (
          <polygon
            key={i}
            points={pointsToString(gridPoints)}
            fill="none"
            stroke={colors.zinc}
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}

      {/* Axis lines */}
      {basePoints.map(([x, y], i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke={colors.zinc}
          strokeWidth={0.5}
          opacity={0.3}
        />
      ))}

      {/* Data polygon — fill */}
      <polygon
        points={pointsToString(dataPoints)}
        fill={colors.phosphor}
        fillOpacity={0.15}
        stroke="none"
      />

      {/* Data polygon — stroke */}
      <polygon
        points={pointsToString(dataPoints)}
        fill="none"
        stroke={colors.phosphor}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Data points */}
      {dataPoints.map(([x, y], i) => {
        const key = PILLAR_KEYS[i];
        const score = animatedScores[key];
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={4}
              fill={PILLAR_COLORS[key]}
              stroke={colors.obsidian}
              strokeWidth={2}
            />
            {/* Score tooltip */}
            {progress >= 1 && (
              <text
                x={x}
                y={y - 10}
                textAnchor="middle"
                fill={colors.ivory}
                fontSize={11}
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight={600}
              >
                {Math.round(score * 100)}%
              </text>
            )}
          </g>
        );
      })}

      {/* Labels */}
      {labelPoints.map(([x, y], i) => {
        const key = PILLAR_KEYS[i];
        const score = animatedScores[key];
        const isTop = i === 0;
        const isBottom = i === 3;

        return (
          <g key={i}>
            {/* Pillar name */}
            <text
              x={x}
              y={isTop ? y - 8 : isBottom ? y + 16 : y}
              textAnchor="middle"
              dominantBaseline={isTop ? "auto" : isBottom ? "hanging" : "middle"}
              fill={PILLAR_COLORS[key]}
              fontSize={12}
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight={600}
            >
              {PILLAR_LABELS[i]}
            </text>
            {/* Score below label */}
            {progress >= 1 && (
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
