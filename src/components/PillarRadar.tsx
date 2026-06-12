"use client";

import { useEffect, useState } from "react";
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
  delay?: number; // ms before animation starts
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

// ─── SVG polygon math ─────────────────────────────────────
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

function scalePoint(
  point: [number, number],
  cx: number,
  cy: number,
  factor: number
): [number, number] {
  return [cx + (point[0] - cx) * factor, cy + (point[1] - cy) * factor];
}

function pointsToString(points: [number, number][]): string {
  return points.map((p) => `${p[0]},${p[1]}`).join(" ");
}

// ─── Component ───────────────────────────────────────────
export function PillarRadar({
  scores,
  size = 280,
  animate = true,
  delay = 0,
}: PillarRadarProps) {
  const [revealStep, setRevealStep] = useState(animate ? 0 : 5);

  useEffect(() => {
    if (!animate || revealStep >= 5) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Progressive pillar reveal: 80ms stagger per the motion-philosophy spec
    for (let i = 0; i < 5; i++) {
      timers.push(
        setTimeout(() => {
          setRevealStep(i + 1);
        }, delay + i * 80)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [animate, delay, revealStep]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.38;
  const outerR = radius;
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const outerPoints = getPentagonPoints(cx, cy, outerR);

  // ─── Radar polygon (the actual scores shape) ──────
  const radarPointsFull = outerPoints.map((point, i) => {
    const key = PILLAR_KEYS[i];
    const factor = Math.max(0.05, (scores[key] || 0) / 5);
    return scalePoint(point, cx, cy, factor);
  });

  // Only include pillars that have been revealed
  const visibleRadarPoints = radarPointsFull.slice(0, revealStep);
  const radarPath = pointsToString(visibleRadarPoints);

  // ─── Compute path length for stroke-dashoffset ────
  // Total perimeter approximation for dashoffset animation
  const totalPerimeter = visibleRadarPoints.reduce((acc, p, i) => {
    const next = visibleRadarPoints[(i + 1) % visibleRadarPoints.length];
    const dx = next[0] - p[0];
    const dy = next[1] - p[1];
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {/* Grid levels (concentric pentagons) */}
      {gridLevels.map((level, li) => {
        const gridPoints = getPentagonPoints(cx, cy, outerR * level);
        return (
          <polygon
            key={`grid-${li}`}
            points={pointsToString(gridPoints)}
            fill="none"
            stroke={colors.zinc}
            strokeWidth={0.5}
            opacity={0.3}
          />
        );
      })}

      {/* Axis lines */}
      {outerPoints.map((point, i) => (
        <line
          key={`axis-${i}`}
          x1={cx}
          y1={cy}
          x2={point[0]}
          y2={point[1]}
          stroke={colors.zinc}
          strokeWidth={0.5}
          opacity={0.4}
        />
      ))}

      {/* Axis labels */}
      {outerPoints.map((point, i) => {
        const labelX = point[0] + (point[0] - cx) * 0.22;
        const labelY = point[1] + (point[1] - cy) * 0.22;
        return (
          <text
            key={`label-${i}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={PILLAR_COLORS[PILLAR_KEYS[i]]}
            fontSize={13}
            fontWeight={700}
            fontFamily="Inter, system-ui, sans-serif"
            opacity={revealStep > i ? 1 : 0.2}
            style={{
              transition: "opacity 300ms ease",
            }}
          >
            {PILLAR_LABELS[i]}
          </text>
        );
      })}

      {/* Score numbers next to labels */}
      {outerPoints.map((point, i) => {
        const key = PILLAR_KEYS[i];
        const scoreVal = scores[key] || 0;
        const labelX = point[0] + (point[0] - cx) * 0.38;
        const labelY = point[1] + (point[1] - cy) * 0.38;
        return (
          <text
            key={`score-${i}`}
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill={colors.ivory}
            fontSize={11}
            fontWeight={600}
            fontFamily="Inter, system-ui, sans-serif"
            opacity={revealStep > i ? 0.7 : 0}
            style={{
              transition: "opacity 300ms ease 100ms",
            }}
          >
            {scoreVal.toFixed(1)}
          </text>
        );
      })}

      {/* Radar polygon fill */}
      {visibleRadarPoints.length >= 3 && (
        <polygon
          points={radarPath}
          fill={`${colors.phosphor}15`}
          stroke="none"
          opacity={0.6}
          style={{
            transition: "opacity 500ms ease",
          }}
        />
      )}

      {/* Radar polygon stroke with dashoffset animation */}
      {visibleRadarPoints.length >= 3 && (
        <polygon
          points={radarPath}
          fill="none"
          stroke={colors.phosphor}
          strokeWidth={2.5}
          strokeLinejoin="round"
          style={{
            strokeDasharray: totalPerimeter,
            strokeDashoffset: totalPerimeter,
            animation: `radar-draw 500ms ease-out forwards`,
            animationDelay: `${delay}ms`,
          }}
        />
      )}

      {/* Vertex dots for revealed pillars */}
      {visibleRadarPoints.map((point, i) => (
        <g key={`dot-${i}`}>
          {/* Glow */}
          <circle
            cx={point[0]}
            cy={point[1]}
            r={8}
            fill={PILLAR_COLORS[PILLAR_KEYS[i]]}
            opacity={0.2}
            style={{
              animation: `pulse-glow 2s ease-in-out infinite`,
              animationDelay: `${delay + i * 80 + 300}ms`,
            }}
          />
          {/* Actual dot */}
          <circle
            cx={point[0]}
            cy={point[1]}
            r={4}
            fill={PILLAR_COLORS[PILLAR_KEYS[i]]}
            style={{
              opacity: 0,
              animation: `dot-appear 300ms ease-out forwards`,
              animationDelay: `${delay + i * 80 + 200}ms`,
            }}
          />
        </g>
      ))}

      {/* Inline keyframes */}
      <defs>
        <style>{`
          @keyframes radar-draw {
            to { stroke-dashoffset: 0; }
          }
          @keyframes dot-appear {
            0% { opacity: 0; transform: scale(0); }
            60% { opacity: 1; transform: scale(1.3); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.15; r: 8; }
            50% { opacity: 0.35; r: 11; }
          }
        `}</style>
      </defs>
    </svg>
  );
}
