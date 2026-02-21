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
  isFavorite?: boolean;
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
  setPlayerFavorite: (playerId: string, isFavorite: boolean) => void;
}

/** Single source of truth for Survivor 50 cast (name + image URL). Used for initial state and migration. */
const SURVIVOR_50_ROSTER: Array<{
  tribe: TribeId;
  tribeOrder: number;
  name: string;
  image: string;
}> = [
  { tribe: "vatu", tribeOrder: 0, name: "Colby", image: "https://ew.com/thmb/M3yV0kOQGCq-WDyA8VEQhSP6SGU=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Colby-Donaldson-1-012326-8921175e3f044b1ea05aac250612fb54.jpg" },
  { tribe: "vatu", tribeOrder: 1, name: "Genevieve", image: "https://ew.com/thmb/c1wgr0ejs0c9fIsJp-Ix05hxqKA=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Genevieve-Mushaluk-012326-981b836f9e1d4a94ac630f7d1429d28a.jpg" },
  { tribe: "vatu", tribeOrder: 2, name: "Rizo", image: "https://ew.com/thmb/1YwMd0ivRCjvklElkQUZT29kP3c=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Rizo-Velovic-3-012326-e9d310b6e8da4db1aa3c54cca5942b2a.jpg" },
  { tribe: "vatu", tribeOrder: 3, name: "Angelina", image: "https://ew.com/thmb/UY2sv-WG40G1TC5gV3Ca7wa6Z8E=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Angelina-Keeley-012326-5ed4f2ed6195411e9c15a5ccfd15b736.jpg" },
  { tribe: "vatu", tribeOrder: 4, name: "Q", image: "https://ew.com/thmb/lbRCDn3luQGGHnjcMqNHG0WbX9s=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Q-Burdette-3-012326-716b9df35f2b42d8b0801e7d65ec09bd.jpg" },
  { tribe: "vatu", tribeOrder: 5, name: "Stephenie", image: "https://ew.com/thmb/TIb6enwpf22_KyxsQ86c7DKtwHI=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Stephenie-LaGrossa-Kendrick-2-012326-049ae9b206f24fbc981d71add6857f73.jpg" },
  { tribe: "vatu", tribeOrder: 6, name: "Kyle", image: "https://ew.com/thmb/ewavXKgvQtjOzelv5mCvZ0BHz5E=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Kyle-Fraser-3-012326-0a0fc9a7c30c4bac89fd672cc1f56fe8.jpg" },
  { tribe: "vatu", tribeOrder: 7, name: "Aubry", image: "https://ew.com/thmb/t7YHjGoWTlFZhAQWbZai7T0M8P4=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Aubry-Bracco-4-012326-fe44b61bf4b4495db7c362ad093aa770.jpg" },
  { tribe: "kalo", tribeOrder: 0, name: "Jonathan", image: "https://ew.com/thmb/Z8hnDCbVa4YvI-paz59icoUQMTU=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Jonathan-Young-012326-070892e2c7e44ae985310f3fcc5b940f.jpg" },
  { tribe: "kalo", tribeOrder: 1, name: "Dee", image: "https://ew.com/thmb/3Juwn1kXWvTIfFgt0vzNsjU89EQ=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Dee-Valladares-012326-9e96a58fd4644c649ab294f27ede3882.jpg" },
  { tribe: "kalo", tribeOrder: 2, name: "Mike", image: "https://ew.com/thmb/dX3vHssndiPpAp7KJA5D5iAUnMQ=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Mike-White-2-012326-55897a3d8a8147f580c447d4a1983411.jpg" },
  { tribe: "kalo", tribeOrder: 3, name: "Kamilla", image: "https://ew.com/thmb/d7RYJZaijpQfyyY35rCdIqUVw2w=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Kamilla-Karthigesu-012326-f1b2aed1cee5407f808925669b6c5f1c.jpg" },
  { tribe: "kalo", tribeOrder: 4, name: "Charlie", image: "https://ew.com/thmb/qtqREGoE-vBg3iramzXl8X3oD68=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Charlie-Davis-3-012326-a5ae22941a30480986b91367da38b603.jpg" },
  { tribe: "kalo", tribeOrder: 5, name: "Tiffany", image: "https://ew.com/thmb/ytFxFGoqO8uor_kQwZ-NKAmxsoI=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Tiffany-Ervin-012326-e2abe020f792441597f4c30f9a29abb6.jpg" },
  { tribe: "kalo", tribeOrder: 6, name: "Coach", image: "https://ew.com/thmb/pytjqkiVW3in8SayZkSIYfzxROE=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Benjamin-Coach-Wade-2-012326jpg-8b3f5c81f670444284ceaaf9ab17f6db.jpg" },
  { tribe: "kalo", tribeOrder: 7, name: "Chrissy", image: "https://ew.com/thmb/I02AYOfJpDnxyv8AhIrw-BpvJlg=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Chrissy-Hofbeck-3-012326-7b5f84272b8c44e89932dac982a9522a.jpg" },
  { tribe: "cila", tribeOrder: 0, name: "Joe", image: "https://ew.com/thmb/-WHWgKcWxGOFb6EfRaPQ_7435eE=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Joe-Hunter-3-012326-0f1fecee927f4112a97e323997ff09af.jpg" },
  { tribe: "cila", tribeOrder: 1, name: "Savannah", image: "https://ew.com/thmb/fCVJTauzPoHIFQON71UdoepGYrA=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Savannah-Louie-3-012326-bf39735c43164273a997f5fbdb911696.jpg" },
  { tribe: "cila", tribeOrder: 2, name: "Christian", image: "https://ew.com/thmb/Fs6Z36CYQVXb7Km4ZIveklWVON4=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Christian-Hubicki-3-012326-c0332efc7d3e499d8fc24f7e6b75ba70.jpg" },
  { tribe: "cila", tribeOrder: 3, name: "Cirie", image: "https://ew.com/thmb/PiLmMPEFmbAxsybHb0RMpsdweMk=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Cirie-Fields-012326-bd752be33b4b401babe73e04c3029884.jpg" },
  { tribe: "cila", tribeOrder: 4, name: "Ozzy", image: "https://ew.com/thmb/AOkP2xEpZiWi0de-NmX3xr8OGfc=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Ozzy-Lusth-3-012326-e720e13e4a9f4911a3cb4b2fc7cf7938.jpg" },
  { tribe: "cila", tribeOrder: 5, name: "Emily", image: "https://ew.com/thmb/5f2lCUBmp0zEPY5Xf0p_J_0Y-rk=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Emily-Flippen-012326-19c641774e1c4207a86fdcd84a7fa87d.jpg" },
  { tribe: "cila", tribeOrder: 6, name: "Rick", image: "https://ew.com/thmb/4SZiQcq7-3c2sB-oYzILb0IZQSc=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Rick-Devens-3-012326-709aa25102b5405e8700a3df3b357096.jpg" },
  { tribe: "cila", tribeOrder: 7, name: "Jenna", image: "https://ew.com/thmb/oTSdWpkyFiwpgu6JiQyyvsud254=/2000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Survivor-Jenna-Lewis-Dougherty-2-012326-5a1195db8aa94b2580aeb0f6e4559896.jpg" },
];

function buildInitialPlayers(): Player[] {
  return SURVIVOR_50_ROSTER.map((entry) => ({
    id: `${entry.tribe}-${entry.tribeOrder}`,
    name: entry.name,
    image: entry.image,
    tribe: entry.tribe,
    tribeOrder: entry.tribeOrder,
    allianceColor: null,
    status: "active" as PlayerStatus,
    advantages: [],
    isFavorite: false,
  }));
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
      setPlayerFavorite: (playerId, isFavorite) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, isFavorite } : p
          ),
        })),
    }),
    {
      name: "survivor-50-tracker",
      partialize: (state) => ({ players: state.players, viewMode: state.viewMode }),
      migrate: (persisted: unknown) => {
        const p = persisted as { players?: Player[]; viewMode?: ViewMode };
        const rosterById = Object.fromEntries(
          SURVIVOR_50_ROSTER.map((e) => [`${e.tribe}-${e.tribeOrder}`, e])
        );
        const players = (p?.players ?? []).map((player) => {
          const base = {
            ...player,
            status: (player as Player).status ?? "active",
            advantages: (player as Player).advantages ?? [],
            isFavorite: (player as Player).isFavorite ?? false,
          };
          const roster = rosterById[base.id];
          if (roster) {
            return { ...base, name: roster.name, image: roster.image };
          }
          return base;
        });
        return { ...p, players } as { players: Player[]; viewMode: ViewMode };
      },
      version: 3,
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);
