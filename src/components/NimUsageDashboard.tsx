"use client";

import React, { useState, useEffect, useCallback } from "react";
import { colors, spacing, radius, typography } from "@/theme/tokens";
import { getNimUsageSummary, estimateCost } from "@/lib/nimTracker";
import type { NimUsageRecord } from "@/lib/nimTracker";

/* ------------------------------------------------------------------ */
/*  NIM Usage Dashboard                                                */
/* ------------------------------------------------------------------ */

export function NimUsageDashboard() {
  const [records, setRecords] = useState<NimUsageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthYear, setMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const fetchUsage = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getNimUsageSummary(monthYear);
    if (!error) setRecords(data);
    setLoading(false);
  }, [monthYear]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  const totalTokens = records.reduce((sum, r) => sum + r.tokens_used, 0);
  const totalCalls = records.reduce((sum, r) => sum + r.calls_count, 0);
  const estimatedCost = estimateCost(totalTokens);

  // Group by endpoint
  const byEndpoint = records.reduce<Record<string, { tokens: number; calls: number }>>((acc, r) => {
    if (!acc[r.endpoint]) acc[r.endpoint] = { tokens: 0, calls: 0 };
    acc[r.endpoint].tokens += r.tokens_used;
    acc[r.endpoint].calls += r.calls_count;
    return acc;
  }, {});

  const endpointEntries = Object.entries(byEndpoint).sort((a, b) => b[1].tokens - a[1].tokens);
  const maxTokens = Math.max(...endpointEntries.map(([, v]) => v.tokens), 1);

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: spacing[4] }}>
      <h2 style={{
        fontFamily: typography.h2.fontFamily,
        fontSize: typography.h2.fontSize,
        color: colors.ivory,
        margin: 0,
        marginBottom: spacing[2],
      }}>
        Uso de IA (NIM)
      </h2>
      <p style={{
        fontFamily: typography.bodyItalic.fontFamily,
        fontStyle: typography.bodyItalic.fontStyle,
        fontSize: typography.body.fontSize,
        color: colors.zinc,
        margin: 0,
        marginBottom: spacing[6],
      }}>
        Monitoramento de uso da API NVIDIA NIM. Custos estimados.
      </p>

      {/* Month selector */}
      <div style={{ marginBottom: spacing[6] }}>
        <input
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          style={{
            backgroundColor: colors.obsidian,
            border: `1px solid ${colors.borderSubtle}`,
            borderRadius: radius.sm,
            color: colors.ivory,
            padding: spacing[2],
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
            outline: "none",
          }}
        />
      </div>

      {/* Summary stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: spacing[3],
        marginBottom: spacing[6],
      }}>
        <StatBox label="Tokens" value={totalTokens.toLocaleString()} color={colors.phosphor} />
        <StatBox label="Chamadas" value={totalCalls.toLocaleString()} color={colors.amber} />
        <StatBox label="Custo est." value={`$${estimatedCost.toFixed(4)}`} color={colors.violet} />
      </div>

      {/* Endpoint breakdown */}
      {loading ? (
        <p style={{
          fontFamily: typography.bodyItalic.fontFamily,
          fontStyle: typography.bodyItalic.fontStyle,
          color: colors.zinc,
          textAlign: "center",
          padding: spacing[6],
        }}>
          Carregando...
        </p>
      ) : endpointEntries.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: spacing[6],
          color: colors.zinc,
        }}>
          <div style={{ fontSize: 32, marginBottom: spacing[2] }}>🤖</div>
          <p style={{
            fontFamily: typography.bodyItalic.fontFamily,
            fontStyle: typography.bodyItalic.fontStyle,
            margin: 0,
          }}>
            Nenhum uso de IA registrado neste mês.
          </p>
          <p style={{
            fontFamily: typography.caption.fontFamily,
            fontSize: typography.caption.fontSize,
            color: `${colors.zinc}80`,
            marginTop: spacing[2],
          }}>
            Complete sessões para gerar uso de IA.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: spacing[3] }}>
          <p style={{
            fontFamily: typography.caption.fontFamily,
            fontSize: typography.caption.fontSize,
            color: colors.zinc,
            textTransform: "uppercase" as const,
            letterSpacing: 2,
            margin: 0,
            marginBottom: spacing[1],
          }}>
            Por endpoint
          </p>
          {endpointEntries.map(([endpoint, data]) => (
            <div key={endpoint}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: spacing[1],
              }}>
                <span style={{
                  fontFamily: typography.ui.fontFamily,
                  fontSize: 13,
                  color: colors.ivory,
                }}>
                  {endpoint}
                </span>
                <div style={{ display: "flex", gap: spacing[3] }}>
                  <span style={{
                    fontFamily: typography.caption.fontFamily,
                    fontSize: 11,
                    color: colors.phosphor,
                  }}>
                    {data.tokens.toLocaleString()} tokens
                  </span>
                  <span style={{
                    fontFamily: typography.caption.fontFamily,
                    fontSize: 11,
                    color: colors.amber,
                  }}>
                    {data.calls} calls
                  </span>
                </div>
              </div>
              {/* Bar */}
              <div style={{
                height: 6,
                backgroundColor: colors.obsidian,
                borderRadius: 3,
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${(data.tokens / maxTokens) * 100}%`,
                  height: "100%",
                  backgroundColor: colors.phosphor,
                  borderRadius: 3,
                  transition: "width 500ms ease",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      textAlign: "center",
      padding: spacing[3],
      backgroundColor: `${color}08`,
      borderRadius: radius.sm,
      border: `1px solid ${color}15`,
    }}>
      <div style={{
        fontFamily: typography.display.fontFamily,
        fontSize: 20,
        color,
        fontWeight: 700,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: typography.caption.fontFamily,
        fontSize: typography.caption.fontSize,
        color: colors.zinc,
        textTransform: "uppercase" as const,
        letterSpacing: 1,
      }}>
        {label}
      </div>
    </div>
  );
}
