import { create } from "zustand";
import type { PillarScores, MapNode, MaturityStage } from "@/types/stubs";
import { supabase } from "@/lib/supabase";

// Re-export MapNode as MapNodeInput for components that need it
export type { MapNode as MapNodeInput };

// Debounce timer (module-level, not in state)
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 2000;

interface LearnerState {
  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: "user" | "admin" | "super_admin";
  language: string;

  // Cartografa
  cartografaComplete: boolean;
  pillarScores: PillarScores | null;
  mapOfIgnorance: MapNode[];
  maturityStage: MaturityStage;
  pillarWeights: Record<string, number>;

  // Palace
  palaceRooms: string[];
  palaceItems: number;

  // Live update
  updatePillarScore: (pillar: string, delta: number) => void;
  lastScoreUpdate: number | null;

  // Sync state
  isLoaded: boolean;
  isSyncing: boolean;

  // Actions
  setAuth: (userId: string, email: string) => void;
  setCartografaResults: (scores: PillarScores, map: MapNode[]) => void;
  addPalaceItem: (room: string) => void;
  setMaturityStage: (stage: MaturityStage) => void;
  setPalaceRooms: (rooms: string[]) => void;
  loadFromSupabase: (userId: string, language?: string) => Promise<void>;
  syncToSupabase: () => Promise<void>;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  role: "user" as "user" | "admin" | "super_admin",
  language: "en",
  cartografaComplete: false,
  pillarScores: null,
  mapOfIgnorance: [],
  maturityStage: "roots" as MaturityStage,
  pillarWeights: {} as Record<string, number>,
  palaceRooms: ["entrance"],
  palaceItems: 0,
  isLoaded: false,
  isSyncing: false,
  lastScoreUpdate: null as number | null,
};

function scheduleSync(store: () => LearnerState) {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    store().syncToSupabase();
  }, DEBOUNCE_MS);
}

export const useLearnerStore = create<LearnerState>((set, get) => ({
  ...initialState,

  setAuth: (userId, email) => {
    set({ isAuthenticated: true, userId, email });
    get().loadFromSupabase(userId);
  },

  setCartografaResults: (scores, map) => {
    // Guard against null/undefined pillar scores (partial diagnostic)
    const values = Object.values(scores).filter((v): v is number => typeof v === "number" && !isNaN(v));
    const avg = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
    let stage: MaturityStage = "roots";
    if (avg >= 80) stage = "underground";
    else if (avg >= 60) stage = "canopy";
    else if (avg >= 40) stage = "branches";
    else if (avg >= 20) stage = "sprouts";

    set({
      cartografaComplete: true,
      pillarScores: scores,
      mapOfIgnorance: map,
      maturityStage: stage,
    });
    scheduleSync(get);
  },

  updatePillarScore: (pillar, delta) => {
    const current = get().pillarScores;
    if (!current) return;
    const updated = { ...current };
    const key = pillar as keyof typeof updated;
    if (key in updated) {
      updated[key] = Math.max(0, Math.min(100, (updated[key] as number) + delta));
    }
    set({ pillarScores: updated, lastScoreUpdate: Date.now() });
    scheduleSync(get);
  },

  addPalaceItem: (room) => {
    set((state) => ({
      palaceItems: state.palaceItems + 1,
      palaceRooms: state.palaceRooms.includes(room)
        ? state.palaceRooms
        : [...state.palaceRooms, room],
    }));
    scheduleSync(get);
  },

  setMaturityStage: (stage) => {
    set({ maturityStage: stage });
    scheduleSync(get);
  },

  setPalaceRooms: (rooms) => {
    set({ palaceRooms: rooms });
    scheduleSync(get);
  },

  loadFromSupabase: async (userId, language = "en") => {
    if (!userId) return;
    set({ isLoaded: false });
    try {
      // Fetch learner progression data
      const [progRes, userRes] = await Promise.all([
        fetch(`/api/learner-progression?user_id=${encodeURIComponent(userId)}&language=${language}`),
        supabase
          .from("users")
          .select("role")
          .eq("id", userId)
          .single(),
      ]);
      const data = progRes.ok ? await progRes.json() : {};
      set({
        language,
        maturityStage: (data.maturity_stage as MaturityStage) || "roots",
        pillarWeights: data.pillar_weights || {},
        palaceRooms: data.palace_room_names || ["entrance"],
        cartografaComplete: !!data.last_cartografa_date,
        role: userRes.data?.role || "user",
        isLoaded: true,
      });
    } catch {
      set({ isLoaded: true });
    }
  },

  syncToSupabase: async () => {
    const { userId, language, maturityStage, pillarWeights, palaceRooms, cartografaComplete, isSyncing } = get();
    if (!userId || isSyncing) return;

    set({ isSyncing: true });
    try {
      await fetch("/api/learner-progression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          language: language || "en",
          maturity_stage: maturityStage,
          pillar_weights: pillarWeights,
          last_cartografa_date: cartografaComplete ? new Date().toISOString() : null,
          palace_room_names: palaceRooms,
        }),
      });
    } catch {
      // Will retry on next debounced sync
    } finally {
      set({ isSyncing: false });
    }
  },

  reset: () => {
    if (syncTimeout) clearTimeout(syncTimeout);
    set(initialState);
  },
}));
