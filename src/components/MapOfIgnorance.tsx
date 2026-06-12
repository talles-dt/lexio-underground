"use client";

import { useEffect, useState, useMemo } from "react";
import { colors } from "@/theme/tokens";

// ─── Types (matches adaptive-engine CartografaResult.map_of_ignorance) ──
interface MapNodeData {
  node_id: string;
  pillar: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface MapOfIgnoranceProps {
  nodes: MapNodeData[];
  size?: number;
  className?: string;
}

// ─── Severity visuals ─────────────────────────────────────
const SEVERITY_CONFIG = {
  high: { color: colors.crimson, radius: 8, glowRadius: 16, label: "Alto" },
  medium: { color: colors.amber, radius: 6, glowRadius: 12, label: "Médio" },
  low: { color: colors.phosphor, radius: 5, glowRadius: 10, label: "Baixo" },
};

const PILLAR_COLORS: Record<string, string> = {
  grammar: colors.phosphor,
  logic: colors.amber,
  vocab: colors.violet,
  culture: "#DC2626",
  comm: "#22C55E",
};

// ─── Layout engine: circular cluster per pillar ───────────
function layoutNodes(nodes: MapNodeData[], cx: number, cy: number, radius: number) {
  // Group by pillar
  const groups: Record<string, MapNodeData[]> = {};
  for (const node of nodes) {
    if (!groups[node.pillar]) groups[node.pillar] = [];
    groups[node.pillar].push(node);
  }

  const pillarKeys = Object.keys(groups);
  const positions: {
    node: MapNodeData;
    x: number;
    y: number;
    groupCenter: { x: number; y: number };
  }[] = [];

  // Spread pillar clusters evenly around a circle
  const pillarCount = pillarKeys.length || 1;
  for (let pi = 0; pi < pillarKeys.length; pi++) {
    const pillar = pillarKeys[pi];
    const clusterNodes = groups[pillar];

    // Cluster center on the ring
    const angle = (Math.PI * 2 * pi) / pillarCount - Math.PI / 2;
    const clusterCx = cx + radius * 0.6 * Math.cos(angle);
    const clusterCy = cy + radius * 0.6 * Math.sin(angle);

    // Spread nodes within cluster (spiral out from center)
    for (let ni = 0; ni < clusterNodes.length; ni++) {
      const subAngle = (Math.PI * 2 * ni) / Math.max(clusterNodes.length, 3) + ni * 0.5;
      const subRadius = 12 + ni * 8;
      positions.push({
        node: clusterNodes[ni],
        x: clusterCx + subRadius * Math.cos(subAngle),
        y: clusterCy + subRadius * Math.sin(subAngle),
        groupCenter: { x: clusterCx, y: clusterCy },
      });
    }
  }

  return { positions, pillarKeys };
}

// ─── Component ────────────────────────────────────────────
export function MapOfIgnorance({ nodes, size = 340, className }: MapOfIgnoranceProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [connectionsDrawn, setConnectionsDrawn] = useState(0);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.4;

  const { positions, pillarKeys } = useMemo(
    () => layoutNodes(nodes, cx, cy, radius),
    [nodes, cx, cy, radius]
  );

  // ── Progressive node reveal (300ms per node, 100ms stagger) ──
  useEffect(() => {
    if (revealedCount >= positions.length) return;

    const timer = setTimeout(() => {
      setRevealedCount((c) => c + 1);
    }, 100);

    return () => clearTimeout(timer);
  }, [revealedCount, positions.length]);

  // ── Connection lines draw (150ms each, after nodes appear) ──
  useEffect(() => {
    if (revealedCount < positions.length) return;
    if (connectionsDrawn >= positions.length) return;

    const timer = setTimeout(() => {
      setConnectionsDrawn((c) => c + 1);
    }, 150);

    return () => clearTimeout(timer);
  }, [revealedCount, connectionsDrawn, positions.length]);

  // ── Draw connection lines from nodes to their cluster center ──
  const connectionLines = positions.slice(0, connectionsDrawn).map((pos, i) => {
    const lineLength = Math.sqrt(
      (pos.x - pos.groupCenter.x) ** 2 + (pos.y - pos.groupCenter.y) ** 2
    );
    return (
      <line
        key={`conn-${i}`}
        x1={pos.groupCenter.x}
        y1={pos.groupCenter.y}
        x2={pos.x}
        y2={pos.y}
        stroke={PILLAR_COLORS[pos.node.pillar] || colors.zinc}
        strokeWidth={1}
        opacity={0.3}
        style={{
          strokeDasharray: lineLength,
          strokeDashoffset: lineLength,
          animation: `line-draw 300ms ease-out forwards`,
        }}
      />
    );
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* ── Background: gentle glow at center ── */}
      <defs>
        <radialGradient id="map-bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.amber} stopOpacity={0.06} />
          <stop offset="100%" stopColor="transparent" stopOpacity={0} />
        </radialGradient>
        <style>{`
          @keyframes node-appear {
            0% { transform: scale(0); opacity: 0; }
            70% { transform: scale(1.15); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes glow-pulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.5; }
          }
          @keyframes line-draw {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </defs>
      <circle cx={cx} cy={cy} r={radius * 0.8} fill="url(#map-bg-glow)" />

      {/* ── Pillar cluster labels ── */}
      {pillarKeys.map((pillar, pi) => {
        const angle = (Math.PI * 2 * pi) / pillarKeys.length - Math.PI / 2;
        const lx = cx + radius * 0.85 * Math.cos(angle);
        const ly = cy + radius * 0.85 * Math.sin(angle);
        return (
          <text
            key={`pillar-label-${pillar}`}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="central"
            fill={PILLAR_COLORS[pillar] || colors.zinc}
            fontSize={11}
            fontWeight={700}
            fontFamily="Inter, system-ui, sans-serif"
            opacity={0.5}
          >
            {pillar.charAt(0).toUpperCase() + pillar.slice(1)}
          </text>
        );
      })}

      {/* ── Connection lines ── */}
      {connectionLines}

      {/* ── Nodes ── */}
      {positions.slice(0, revealedCount).map((pos, i) => {
        const sev = SEVERITY_CONFIG[pos.node.severity] || SEVERITY_CONFIG.medium;
        const delayMs = i * 100;

        return (
          <g
            key={`node-${pos.node.node_id}-${i}`}
            style={{
              transformOrigin: `${pos.x}px ${pos.y}px`,
              animation: `node-appear 300ms ease-out forwards`,
              animationDelay: `${delayMs}ms`,
              opacity: 0,
            }}
          >
            {/* Amber glow pulse (fires once after appear) */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={sev.glowRadius}
              fill={sev.color}
              opacity={0}
              style={{
                animation: `glow-pulse 800ms ease-in-out 1`,
                animationDelay: `${delayMs + 300}ms`,
                animationFillMode: "forwards",
              }}
            />

            {/* Main dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={sev.radius}
              fill={sev.color}
            />
          </g>
        );
      })}

      {/* ── Center marker: "Your Known Unknowns" ── */}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        dominantBaseline="central"
        fill={colors.ivory}
        fontSize={10}
        fontWeight={600}
        fontFamily="Inter, system-ui, sans-serif"
        opacity={0.4}
      >
        Map of Ignorance
      </text>
    </svg>
  );
}
