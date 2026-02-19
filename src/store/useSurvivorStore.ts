import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TribeId = "vatu" | "kalo" | "cila";

export type ViewMode = "tribe" | "alliance";

export type PlayerStatus = "active" | "eliminated" | "jury";

export type AdvantageId = "immunity_idol" | "advantage" | "celebrity_advantage";

export interface Player {
  id: string;
  name: string;
  image: string;
  tribe: TribeId;
  tribeOrder: number;
  allianceColor: string | null;
  status: PlayerStatus;
  advantages: AdvantageId[];
}

interface SurvivorState {
  players: Player[];
  viewMode: ViewMode;
  setPlayers: (players: Player[]) => void;
  setViewMode: (viewMode: ViewMode) => void;
  setPlayerAllianceColor: (playerId: string, allianceColor: string | null) => void;
  setPlayerStatus: (playerId: string, status: PlayerStatus) => void;
  addPlayerAdvantage: (playerId: string, advantageId: AdvantageId) => void;
  removePlayerAdvantages: (playerId: string) => void;
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
        status: "active",
        advantages: [],
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
      setPlayerStatus: (playerId, status) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, status } : p
          ),
        })),
      addPlayerAdvantage: (playerId, advantageId) =>
        set((state) => ({
          players: state.players.map((p) => {
            const list = p.advantages ?? [];
            if (p.id !== playerId || list.length >= 3) return p;
            return { ...p, advantages: [...list, advantageId] };
          }),
        })),
      removePlayerAdvantages: (playerId) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, advantages: [] } : p
          ),
        })),
    }),
    {
      name: "survivor-50-tracker",
      partialize: (state) => ({ players: state.players, viewMode: state.viewMode }),
      migrate: (persisted: unknown) => {
        const p = persisted as { players?: Player[]; viewMode?: ViewMode };
        const players = (p?.players ?? []).map((player) => ({
          ...player,
          status: (player as Player).status ?? "active",
          advantages: (player as Player).advantages ?? [],
        }));
        return { ...p, players } as { players: Player[]; viewMode: ViewMode };
      },
      version: 1,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
