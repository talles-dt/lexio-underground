"use client";

import { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Time-of-day classification                                         */
/* ------------------------------------------------------------------ */

export type TimeOfDay = "early_morning" | "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(hour?: number): TimeOfDay {
  const h = hour ?? new Date().getHours();
  if (h >= 5 && h < 8) return "early_morning";
  if (h >= 8 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

export function getTimeOfDayLabel(tod: TimeOfDay): string {
  const labels: Record<TimeOfDay, string> = {
    early_morning: "Madrugada",
    morning: "Manhã",
    afternoon: "Tarde",
    evening: "Noite",
    night: "Noite",
  };
  return labels[tod];
}

export function getTimeOfDayGreeting(tod: TimeOfDay): string {
  const greetings: Record<TimeOfDay, string> = {
    early_morning: "Bem cedo, cartógrafo!",
    morning: "Bom dia, cartógrafo!",
    afternoon: "Boa tarde, cartógrafo!",
    evening: "Boa noite, cartógrafo!",
    night: "Ainda acordado? Ótimo.",
  };
  return greetings[tod];
}

/* ------------------------------------------------------------------ */
/*  User chronotype tracking                                           */
/* ------------------------------------------------------------------ */

const CHRONOTYPE_KEY = "lexio_chronotype_history";

interface ChronotypeEntry {
  hour: number;
  dayOfWeek: number;
  timestamp: number;
}

interface ChronotypeProfile {
  morningScore: number;   // 0-100
  afternoonScore: number;
  eveningScore: number;
  nightScore: number;
  dominant: TimeOfDay;
  totalSessions: number;
}

function loadChronotypeHistory(): ChronotypeEntry[] {
  try {
    const raw = localStorage.getItem(CHRONOTYPE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ChronotypeEntry[];
    // Keep last 90 days
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    return parsed.filter((e) => e.timestamp > cutoff);
  } catch {
    return [];
  }
}

function saveChronotypeEntry(entry: ChronotypeEntry): void {
  const history = loadChronotypeHistory();
  history.push(entry);
  // Keep max 200 entries
  const trimmed = history.slice(-200);
  localStorage.setItem(CHRONOTYPE_KEY, JSON.stringify(trimmed));
}

export function recordSessionStart(): void {
  const now = new Date();
  saveChronotypeEntry({
    hour: now.getHours(),
    dayOfWeek: now.getDay(),
    timestamp: Date.now(),
  });
}

export function getChronotypeProfile(): ChronotypeProfile {
  const history = loadChronotypeHistory();
  const total = history.length;

  if (total === 0) {
    return {
      morningScore: 25,
      afternoonScore: 25,
      eveningScore: 25,
      nightScore: 25,
      dominant: getTimeOfDay(),
      totalSessions: 0,
    };
  }

  let morning = 0, afternoon = 0, evening = 0, night = 0;

  history.forEach((entry) => {
    const tod = getTimeOfDay(entry.hour);
    switch (tod) {
      case "early_morning":
      case "morning":
        morning++;
        break;
      case "afternoon":
        afternoon++;
        break;
      case "evening":
        evening++;
        break;
      case "night":
        night++;
        break;
    }
  });

  const scores = {
    morningScore: Math.round((morning / total) * 100),
    afternoonScore: Math.round((afternoon / total) * 100),
    eveningScore: Math.round((evening / total) * 100),
    nightScore: Math.round((night / total) * 100),
  };

  const dominant = Object.entries({
    morning: scores.morningScore,
    afternoon: scores.afternoonScore,
    evening: scores.eveningScore,
    night: scores.nightScore,
  }).reduce((a, b) => (b[1] > a[1] ? b : a))[0] as TimeOfDay;

  return { ...scores, dominant, totalSessions: total };
}

/* ------------------------------------------------------------------ */
/*  Time-aware content selection                                       */
/* ------------------------------------------------------------------ */

export interface TimeAwareContent {
  greeting: string;
  notificationTitle: string;
  notificationBody: string;
  suggestedAction: string;
  actionHref: string;
  culturalAtom?: string;
}

const MORNING_ATOMS = [
  "Saudade — não é só tristeza. É a falta de algo que você ama.",
  "Cafuné — o gesto de passar os dedos pelo cabelo de alguém querido.",
  "Xodó — carinho profundo, quase ternura.",
  "Dengo — aquele pedido de carinho que derrete qualquer um.",
];

const AFTERNOON_ATOMS = [
  "Jeitinho — a arte brasileira de encontrar soluções criativas.",
  "Gambiarra — quando o jeitinho vira engenharia.",
  "Malandro — não é vilão. É quem sobrevive com charme.",
  "Esperto — esperteza brasileira, entre a malícia e a sabedoria.",
];

const EVENING_ATOMS = [
  "Saudade — à noite, ela pesa mais.",
  "Aconchego — o conforto de estar em casa, com os seus.",
  "Desencontro — quando dois caminhos se separam sem querer.",
  "Remexer — mexer em coisas antigas, encontrando memórias.",
];

const NIGHT_ATOMS = [
  "Madrugada — o silêncio onde os pensamentos falam mais alto.",
  "Insônia — quando a mente viaja e o corpo não acompanha.",
  "Vira-lato — o gato da rua, livre e noturno.",
  "Serenata — cantar para quem se ama, debaixo da janela.",
];

function pickAtom(tod: TimeOfDay): string {
  const atoms = tod === "morning" || tod === "early_morning"
    ? MORNING_ATOMS
    : tod === "afternoon"
    ? AFTERNOON_ATOMS
    : tod === "evening"
    ? EVENING_ATOMS
    : NIGHT_ATOMS;
  return atoms[Math.floor(Math.random() * atoms.length)];
}

export function getTimeAwareContent(tod?: TimeOfDay): TimeAwareContent {
  const timeOfDay = tod ?? getTimeOfDay();
  const chronotype = getChronotypeProfile();
  const isDominantTime = chronotype.dominant === timeOfDay;

  const greeting = getTimeOfDayGreeting(timeOfDay);
  const atom = pickAtom(timeOfDay);

  if (isDominantTime && chronotype.totalSessions > 3) {
    return {
      greeting,
      notificationTitle: atom.split("—")[0].trim(),
      notificationBody: `${atom} — Seu horário de pico. Aproveite.`,
      suggestedAction: "Sessão Pulse",
      actionHref: "/pulse",
      culturalAtom: atom,
    };
  }

  switch (timeOfDay) {
    case "early_morning":
      return {
        greeting,
        notificationTitle: "Átomo cultural da madrugada",
        notificationBody: atom,
        suggestedAction: "Explorar",
        actionHref: "/meme-vault",
        culturalAtom: atom,
      };
    case "morning":
      return {
        greeting,
        notificationTitle: "Comece o dia com cultura",
        notificationBody: atom,
        suggestedAction: "Pulse 3min",
        actionHref: "/pulse",
        culturalAtom: atom,
      };
    case "afternoon":
      return {
        greeting,
        notificationTitle: "Pausa para aprender",
        notificationBody: atom,
        suggestedAction: "Pulse 3min",
        actionHref: "/pulse",
        culturalAtom: atom,
      };
    case "evening":
      return {
        greeting,
        notificationTitle: "Revisão noturna",
        notificationBody: "Consolide o que aprendeu hoje. 5 minutos bastam.",
        suggestedAction: "Revisar",
        actionHref: "/pulse",
        culturalAtom: atom,
      };
    case "night":
      return {
        greeting,
        notificationTitle: "Modo noturno",
        notificationBody: atom,
        suggestedAction: "Explorar",
        actionHref: "/meme-vault",
        culturalAtom: atom,
      };
  }
}

/* ------------------------------------------------------------------ */
/*  React hook: useTimeOfDay                                           */
/* ------------------------------------------------------------------ */

export function useTimeOfDay(): {
  timeOfDay: TimeOfDay;
  label: string;
  greeting: string;
  content: TimeAwareContent;
  chronotype: ChronotypeProfile;
  recordSession: () => void;
} {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(getTimeOfDay());
  const [chronotype, setChronotype] = useState<ChronotypeProfile>(getChronotypeProfile());

  // Update time-of-day every minute
  useEffect(() => {
    const id = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const recordSession = useCallback(() => {
    recordSessionStart();
    setChronotype(getChronotypeProfile());
  }, []);

  return {
    timeOfDay,
    label: getTimeOfDayLabel(timeOfDay),
    greeting: getTimeOfDayGreeting(timeOfDay),
    content: getTimeAwareContent(timeOfDay),
    chronotype,
    recordSession,
  };
}
