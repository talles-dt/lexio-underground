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

// Draw axis line
function drawAxis(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.stroke();
}

// Draw pillar label
function drawLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string
) {
  ctx.fillStyle = color;
  ctx.font = "bold 14px Inter";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}

// Draw polygon
function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  color: string,
  alpha: number,
  fill: boolean
) {
  if (points.length === 0) return;
  ctx.globalAlpha = alpha;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.globalAlpha = 1;
}

export function PillarRadar({
  scores,
  size = 250,
  animate = false,
  delay = 0,
}: PillarRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scoreBounds] = useState({
    min: 0,
    max: 5,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isMounted) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Center and radius
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.4;

    // Scores as fractions
    const scoresNormalized = PILLAR_KEYS.reduce(
      (acc, key) => {
        acc[key] =
          (scores[key] - scoreBounds.min) / (scoreBounds.max - scoreBounds.min);
        return acc;
      },
      {} as Record<(typeof PILLAR_KEYS)[number], number>
    );

    // Generate main pentagon points
    const pentagonPoints = getPentagonPoints(cx, cy, radius);
    // Build axes and labels
    pentagonPoints.forEach((point, i) => {
      // Draw axis
      drawAxis(ctx, cx, cy, cx, cy, point[0], point[1]);
      // Draw label
      const labelX = point[0] + (point[0] - cx) * 0.2;
      const labelY = point[1] + (point[1] - cy) * 0.2;
      drawLabel(
        ctx,
        labelX,
        labelY,
        PILLAR_LABELS[i],
        PILLAR_COLORS[PILLAR_KEYS[i]]
      );
    });

    // Build radar shape
    const radarPoints = pentagonPoints.map((point, i) => {
      const key = PILLAR_KEYS[i];
      return scalePoint(point, cx, cy, scoresNormalized[key]);
    });
    // Draw radar polygon
    drawPolygon(ctx, radarPoints, "#0ea5e9", 0.4, true);
  }, [scores, size, animate, delay, isMounted, scoreBounds]);

  return <canvas ref={canvasRef} width={size} height={size} />;
}
