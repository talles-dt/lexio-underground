"use client";

import { create } from "zustand";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type NotificationType =
  | "session_reminder"
  | "streak"
  | "maturity_stage"
  | "family_challenge"
  | "system"
  | "review_due";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  actionHref?: string;
  createdAt: number;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  add: (n: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

let notifCounter = 0;
function nextId(): string {
  return `notif_${Date.now()}_${++notifCounter}`;
}

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  add: (n) => {
    const notif: AppNotification = {
      ...n,
      id: nextId(),
      read: false,
      createdAt: Date.now(),
    };
    set((s) => ({
      notifications: [notif, ...s.notifications],
      unreadCount: s.unreadCount + 1,
    }));
  },

  markRead: (id) => {
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  markAllRead: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  dismiss: (id) => {
    set((s) => {
      const notifications = s.notifications.filter((n) => n.id !== id);
      const unreadCount = notifications.filter((n) => !n.read).length;
      return { notifications, unreadCount };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));

/* ------------------------------------------------------------------ */
/*  Helper: generate contextual notifications                          */
/* ------------------------------------------------------------------ */

export function createSessionReminderNotification(): Omit<AppNotification, "id" | "read" | "createdAt"> {
  const hour = new Date().getHours();
  const isMorning = hour < 12;

  return {
    type: "session_reminder",
    title: isMorning ? "Bom dia, cartógrafo!" : "Hora de praticar!",
    body: isMorning
      ? "Seu mapa de ignorância está esperando. 3 minutos podem mudar tudo."
      : "Uma sessão rápida agora consolida o que você aprendeu hoje.",
    actionHref: "/pulse",
  };
}

export function createReviewDueNotification(count: number): Omit<AppNotification, "id" | "read" | "createdAt"> {
  return {
    type: "review_due",
    title: `${count} ${count === 1 ? "item precisa" : "itens precisam"} de revisão`,
    body: "A repetição espaçada é a chave. Revise agora para não esquecer.",
    actionHref: "/pulse",
  };
}

export function createMaturityNotification(stage: string): Omit<AppNotification, "id" | "read" | "createdAt"> {
  const labels: Record<string, string> = {
    sprouts: "🌱 Sprouts",
    branches: "🌿 Branches",
    canopy: "🌳 Canopy",
    underground: "🕳️ The Underground",
  };
  return {
    type: "maturity_stage",
    title: `Novo estágio: ${labels[stage] || stage}`,
    body: "Sua identidade linguística evoluiu. Veja seu novo palácio.",
    actionHref: "/palace",
  };
}
