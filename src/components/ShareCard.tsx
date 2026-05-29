"use client";

import { useRef, useCallback, useState } from "react";
import { colors, spacing, radius } from "@/theme/tokens";

interface ShareCardProps {
  scores: {
    grammar: number;
    logic: number;
    vocab: number;
    culture: number;
    comm: number;
  };
  identityCallout: string;
  readinessLabel: string;
  shareUrl: string;
}

const PILLAR_KEYS = ["grammar", "logic", "vocab", "culture", "comm"] as const;
const PILLAR_NAMES: Record<string, string> = {
  grammar: "Gramática",
  logic: "Lógica",
  vocab: "Vocabulário",
  culture: "Cultura",
  comm: "Comunicação",
};
const PILLAR_COLORS: Record<string, string> = {
  grammar: "#00FF88",
  logic: "#FF9500",
  vocab: "#A855F7",
  culture: "#DC2626",
  comm: "#22C55E",
};

// ─── CANVAS RENDERING ──────────────────────────────────────
function renderShareCard(
  canvas: HTMLCanvasElement,
  props: ShareCardProps,
): void {
  const ctx = canvas.getContext("2d")!;
  const w = 600;
  const h = 800;
  canvas.width = w;
  canvas.height = h;

  // Background
  ctx.fillStyle = "#0D0D0F";
  ctx.fillRect(0, 0, w, h);

  // Border
  ctx.strokeStyle = "#27272A";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

  // Title
  ctx.fillStyle = "#F5F0E8";
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Lexio Underground", w / 2, 50);

  // Subtitle
  ctx.fillStyle = "#00FF88";
  ctx.font = "italic 16px system-ui, -apple-system, sans-serif";
  ctx.fillText("Cartografa Result", w / 2, 78);

  // Radar center
  const cx = w / 2;
  const cy = 240;
  const radius = 120;

  // Draw radar grid
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  for (const level of gridLevels) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const r = radius * level;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(113, 113, 122, 0.3)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Draw axis lines
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    ctx.strokeStyle = "rgba(113, 113, 122, 0.3)";
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Draw data polygon
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const key = PILLAR_KEYS[i];
    const score = props.scores[key];
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const r = radius * score;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(0, 255, 136, 0.15)";
  ctx.fill();
  ctx.strokeStyle = "#00FF88";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw data points
  for (let i = 0; i < 5; i++) {
    const key = PILLAR_KEYS[i];
    const score = props.scores[key];
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const r = radius * score;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = PILLAR_COLORS[key];
    ctx.fill();
    ctx.strokeStyle = "#0D0D0F";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Draw labels
  const labelRadius = radius + 30;
  for (let i = 0; i < 5; i++) {
    const key = PILLAR_KEYS[i];
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const x = cx + labelRadius * Math.cos(angle);
    const y = cy + labelRadius * Math.sin(angle);

    ctx.fillStyle = PILLAR_COLORS[key];
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(PILLAR_NAMES[key], x, y - 8);

    ctx.fillStyle = "#71717A";
    ctx.font = "11px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${Math.round(score * 100)}%`, x, y + 8);
  }

  // Readiness badge
  const badgeY = 420;
  ctx.fillStyle = "#18221a";
  const badgeText = props.readinessLabel;
  ctx.font = "bold 14px system-ui, -apple-system, sans-serif";
  const badgeWidth = ctx.measureText(badgeText).width + 32;
  const badgeX = (w - badgeWidth) / 2;
  roundRect(ctx, badgeX, badgeY, badgeWidth, 32, 8);
  ctx.fill();
  ctx.strokeStyle = "#00FF88";
  ctx.lineWidth = 1;
  roundRect(ctx, badgeX, badgeY, badgeWidth, 32, 8);
  ctx.stroke();
  ctx.fillStyle = "#00FF88";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(badgeText, w / 2, badgeY + 16);

  // Identity callout (wrapped)
  ctx.fillStyle = "#00FF88";
  ctx.font = "italic 15px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  wrapText(ctx, props.identityCallout, w / 2, 480, w - 80, 22);

  // Pillar bars
  const barStartY = 560;
  const barWidth = 300;
  const barHeight = 10;
  const barX = (w - barWidth) / 2;

  for (let i = 0; i < 5; i++) {
    const key = PILLAR_KEYS[i];
    const score = props.scores[key];
    const y = barStartY + i * 30;

    // Label
    ctx.fillStyle = "#71717A";
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(PILLAR_NAMES[key], barX - 80, y + barHeight / 2);

    // Bar background
    ctx.fillStyle = "#141416";
    roundRect(ctx, barX, y, barWidth, barHeight, 4);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = PILLAR_COLORS[key];
    roundRect(ctx, barX, y, barWidth * score, barHeight, 4);
    ctx.fill();

    // Score
    ctx.fillStyle = "#F5F0E8";
    ctx.font = "bold 12px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(
      `${Math.round(score * 100)}%`,
      barX + barWidth + 10,
      y + barHeight / 2,
    );
  }

  // Footer
  ctx.fillStyle = "#71717A";
  ctx.font = "11px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("lexio.oliceu.com", w / 2, h - 30);
}

// Canvas helper: rounded rect
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Canvas helper: wrap text
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, currentY);
      line = word + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

// ─── COMPONENT ──────────────────────────────────────────────
export default function ShareCard({
  scores,
  identityCallout,
  readinessLabel,
  shareUrl,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setDownloading(true);

    // Render to canvas
    renderShareCard(canvas, {
      scores,
      identityCallout,
      readinessLabel,
      shareUrl,
    });

    // Download
    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "lexio-cartografa-result.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      setDownloading(false);
    }, 100);
  }, [scores, identityCallout, readinessLabel, shareUrl]);

  const shareText = `${identityCallout}\n\nMy Cartografa result: ${shareUrl}`;

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div>
      {/* Hidden canvas for rendering */}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width={600}
        height={800}
      />

      {/* Share buttons */}
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: spacing[3],
        }}
      >
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            padding: "10px 20px",
            backgroundColor: colors.phosphor,
            color: colors.obsidian,
            border: "none",
            borderRadius: radius.btn,
            fontSize: 14,
            fontWeight: 600,
            cursor: downloading ? "wait" : "pointer",
            opacity: downloading ? 0.7 : 1,
          }}
        >
          {downloading ? "Generating..." : "📥 Download PNG"}
        </button>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 20px",
            backgroundColor: "#0077B5",
            color: "#fff",
            border: "none",
            borderRadius: radius.btn,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          LinkedIn
        </a>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 20px",
            backgroundColor: "#1DA1F2",
            color: "#fff",
            border: "none",
            borderRadius: radius.btn,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Twitter
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 20px",
            backgroundColor: "#25D366",
            color: "#fff",
            border: "none",
            borderRadius: radius.btn,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
