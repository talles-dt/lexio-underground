"use client";

import React, { useState, useEffect, useCallback } from "react";
import { NotificationBell, NotificationCenter, triggerDemoNotification } from "@/components/NotificationCenter";
import { useNotificationStore } from "@/stores/notificationStore";
import { createSessionReminderNotification, createReviewDueNotification } from "@/stores/notificationStore";

/**
 * NotificationProvider — renders a floating bell + slide-in panel.
 * Also seeds a demo notification on first visit so the user sees it.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const add = useNotificationStore((s) => s.add);

  // Seed a welcome notification on first mount
  useEffect(() => {
    if (!seeded) {
      setSeeded(true);
      // Small delay so it appears after page load
      const t = setTimeout(() => {
        add({
          type: "system",
          title: "Bem-vindo ao Lexio Underground",
          body: "Seu mapa de ignorância está sendo construído. Complete o diagnóstico para começar.",
          actionHref: "/diagnostico",
        });
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [seeded, add]);

  return (
    <>
      {children}

      {/* Floating bell — top right, above bottom nav */}
      <div style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 35,
      }}>
        <NotificationBell onClick={() => setPanelOpen(true)} />
      </div>

      {/* Demo: trigger notification on every 30s (for testing) */}
      <DemoNotificationTimer />

      {/* Slide-in panel */}
      {panelOpen && <NotificationCenter onClose={() => setPanelOpen(false)} />}
    </>
  );
}

/**
 * Demo timer — fires a contextual notification every 45s.
 * Remove in production.
 */
function DemoNotificationTimer() {
  const add = useNotificationStore((s) => s.add);

  useEffect(() => {
    const id = setInterval(() => {
      const store = useNotificationStore.getState();
      // Don't spam — only add if fewer than 5 unread
      if (store.unreadCount < 5) {
        const hour = new Date().getHours();
        if (hour < 12) {
          add(createSessionReminderNotification());
        } else {
          add(createReviewDueNotification(Math.floor(Math.random() * 8) + 1));
        }
      }
    }, 45000);
    return () => clearInterval(id);
  }, [add]);

  return null;
}
