"use client";

import React, { useState, useEffect } from "react";
import { colors, spacing, radius, typography, duration } from "@/theme/tokens";
import {
  useNotificationStore,
  createSessionReminderNotification,
  createReviewDueNotification,
} from "@/stores/notificationStore";
import type { AppNotification, NotificationType } from "@/stores/notificationStore";

/* ------------------------------------------------------------------ */
/*  Type icons & colors                                                */
/* ------------------------------------------------------------------ */

const TYPE_META: Record<NotificationType, { icon: string; color: string }> = {
  session_reminder: { icon: "⏰", color: colors.phosphor },
  streak: { icon: "🔥", color: colors.amber },
  maturity_stage: { icon: "🌱", color: "#22C55E" },
  family_challenge: { icon: "👥", color: colors.violet },
  system: { icon: "⚙", color: colors.zinc },
  review_due: { icon: "📚", color: colors.amber },
};

/* ------------------------------------------------------------------ */
/*  Single notification row                                            */
/* ------------------------------------------------------------------ */

function NotificationRow({ n, onRead, onDismiss }: {
  n: AppNotification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const meta = TYPE_META[n.type];
  const timeAgo = getTimeAgo(n.createdAt);

  return (
    <div
      onClick={() => onRead(n.id)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: spacing[3],
        padding: spacing[3],
        borderRadius: radius.sm,
        backgroundColor: n.read ? "transparent" : `${meta.color}08`,
        borderLeft: n.read ? "none" : `3px solid ${meta.color}`,
        cursor: "pointer",
        transition: `background-color ${duration.fast}ms ease`,
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{meta.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            fontFamily: typography.ui.fontFamily,
            fontSize: typography.ui.fontSize,
            fontWeight: n.read ? 400 : 600,
            color: n.read ? colors.zinc : colors.ivory,
          }}>
            {n.title}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }}
            style={{
              background: "none",
              border: "none",
              color: colors.zinc,
              cursor: "pointer",
              fontSize: 14,
              padding: 2,
              marginLeft: spacing[2],
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
        <p style={{
          fontFamily: typography.body.fontFamily,
          fontSize: 13,
          color: colors.zinc,
          margin: `${spacing[1]}px 0 0 0`,
          lineHeight: 1.4,
        }}>
          {n.body}
        </p>
        <span style={{
          fontFamily: typography.caption.fontFamily,
          fontSize: 10,
          color: `${colors.zinc}80`,
          marginTop: spacing[1],
          display: "block",
        }}>
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

function getTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "agora";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}min atrás`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h atrás`;
  const days = Math.floor(hr / 24);
  return `${days}d atrás`;
}

/* ------------------------------------------------------------------ */
/*  NotificationCenter panel                                           */
/* ------------------------------------------------------------------ */

export function NotificationCenter({ onClose }: { onClose: () => void }) {
  const notifications = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const dismiss = useNotificationStore((s) => s.dismiss);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: `${colors.obsidian}90`,
          zIndex: 60,
          opacity: visible ? 1 : 0,
          transition: `opacity ${duration.fast}ms ease`,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: "90vw",
          backgroundColor: colors.surface,
          borderLeft: `1px solid ${colors.borderSubtle}`,
          zIndex: 61,
          transform: visible ? "translateX(0)" : "translateX(100%)",
          transition: `transform ${duration.normal}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing[4],
          borderBottom: `1px solid ${colors.borderSubtle}`,
        }}>
          <h2 style={{
            fontFamily: typography.h2.fontFamily,
            fontSize: typography.h2.fontSize,
            color: colors.ivory,
            margin: 0,
          }}>
            Notificações
          </h2>
          <div style={{ display: "flex", gap: spacing[2] }}>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllRead}
                style={{
                  background: "none",
                  border: `1px solid ${colors.borderSubtle}`,
                  borderRadius: radius.sm,
                  color: colors.zinc,
                  cursor: "pointer",
                  fontFamily: typography.caption.fontFamily,
                  fontSize: 11,
                  padding: `${spacing[1]}px ${spacing[2]}px`,
                }}
              >
                Marcar todas
              </button>
            )}
            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                color: colors.zinc,
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notification list */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: spacing[3],
          display: "flex",
          flexDirection: "column",
          gap: spacing[2],
        }}>
          {notifications.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: `${spacing[8]}px ${spacing[4]}px`,
              color: colors.zinc,
            }}>
              <div style={{ fontSize: 32, marginBottom: spacing[3] }}>🔔</div>
              <p style={{
                fontFamily: typography.bodyItalic.fontFamily,
                fontStyle: typography.bodyItalic.fontStyle,
                fontSize: typography.body.fontSize,
                margin: 0,
              }}>
                Nenhuma notificação ainda.
              </p>
              <p style={{
                fontFamily: typography.caption.fontFamily,
                fontSize: typography.caption.fontSize,
                color: `${colors.zinc}80`,
                marginTop: spacing[2],
              }}>
                Complete sessões para receber lembretes.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationRow
                key={n.id}
                n={n}
                onRead={markRead}
                onDismiss={dismiss}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Notification bell (for top nav)                                    */
/* ------------------------------------------------------------------ */

export function NotificationBell({ onClick }: { onClick: () => void }) {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: spacing[2],
        color: colors.zinc,
      }}
    >
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {unreadCount > 0 && (
        <span style={{
          position: "absolute",
          top: 2,
          right: 2,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.crimson,
          color: "#FFF",
          fontSize: 10,
          fontFamily: typography.ui.fontFamily,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 4px",
        }}>
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Demo: trigger a notification (for testing)                         */
/* ------------------------------------------------------------------ */

export function triggerDemoNotification() {
  const store = useNotificationStore.getState();
  const hour = new Date().getHours();
  if (hour < 12) {
    store.add(createSessionReminderNotification());
  } else {
    store.add(createReviewDueNotification(Math.floor(Math.random() * 8) + 1));
  }
}
