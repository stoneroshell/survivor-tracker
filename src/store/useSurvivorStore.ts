import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TribeId = "vatu" | "kalo" | "cila";

export type ViewMode = "tribe" | "alliance";

export interface Player {
  id: string;
  name: string;
  image: string;
  tribe: TribeId;
  tribeOrder: number;
  allianceColor: string | null;
}

interface SurvivorState {
  players: Player[];
  viewMode: ViewMode;
  setPlayers: (players: Player[]) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setPlayerAllianceColor: (playerId: string, allianceColor: string | null) => void;
}

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

function buildInitialPlayers(): Player[] {
  const tribes: TribeId[] = ["vatu", "kalo", "cila"];
  const countPerTribe = 8;
  const players: Player[] = [];

  tribes.forEach((tribeId, tribeIndex) => {
    const startNum = tribeIndex * countPerTribe + 1;
    for (let i = 0; i < countPerTribe; i++) {
      players.push({
        id: `${tribeId}-${i}`,
        name: `Player ${startNum + i}`,
        image: PLACEHOLDER_IMAGE,
        tribe: tribeId,
        tribeOrder: i,
        allianceColor: null,
      });
    }
  });

  return players;
}

const initialPlayers = buildInitialPlayers();

export const useSurvivorStore = create<SurvivorState>()(
  persist(
    (set) => ({
      players: initialPlayers,
      viewMode: "tribe",
      setPlayers: (players) => set({ players }),
      setViewMode: (viewMode) => set({ viewMode }),
      setPlayerAllianceColor: (playerId, allianceColor) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, allianceColor } : p
          ),
        })),
    }),
    {
      name: "survivor-50-tracker",
      partialize: (state) => ({ players: state.players, viewMode: state.viewMode }),
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
