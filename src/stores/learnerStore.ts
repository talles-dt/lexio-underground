import { create } from 'zustand';
import type { PillarScores, MapNode, MaturityStage } from '@/types';

interface LearnerState {
  // Auth
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;

  // Cartografa
  cartografaComplete: boolean;
  pillarScores: PillarScores | null;
  mapOfIgnorance: MapNode[];
  maturityStage: MaturityStage;

  // Palace
  palaceRooms: string[];
  palaceItems: number;

  // Actions
  setAuth: (userId: string, email: string) => void;
  setCartografaResults: (scores: PillarScores, map: MapNode[]) => void;
  addPalaceItem: (room: string) => void;
  reset: () => void;
}

const initialState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  cartografaComplete: false,
  pillarScores: null,
  mapOfIgnorance: [],
  maturityStage: 'roots' as MaturityStage,
  palaceRooms: ['entrance'],
  palaceItems: 0,
};

export const useLearnerStore = create<LearnerState>((set) => ({
  ...initialState,

  setAuth: (userId, email) =>
    set({ isAuthenticated: true, userId, email }),

  setCartografaResults: (scores, map) =>
    set({
      cartografaComplete: true,
      pillarScores: scores,
      mapOfIgnorance: map,
    }),

  addPalaceItem: (room) =>
    set((state) => ({
      palaceItems: state.palaceItems + 1,
      palaceRooms: state.palaceRooms.includes(room)
        ? state.palaceRooms
        : [...state.palaceRooms, room],
    })),

  reset: () => set(initialState),
}));