import { create } from "zustand";

export type TribeId = "vatu" | "kalo" | "cila";

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
  setPlayers: (players: Player[]) => void;
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

export const useSurvivorStore = create<SurvivorState>((set) => ({
  players: buildInitialPlayers(),
  setPlayers: (players) => set({ players }),
  setPlayerAllianceColor: (playerId, allianceColor) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === playerId ? { ...p, allianceColor } : p
      ),
    })),
}));
