import { TribeColumn } from "./TribeColumn";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

export interface Player {
  id: string;
  name: string;
  imageUrl: string;
}

function buildPlaceholderPlayers(
  prefix: string,
  startIndex: number,
  count: number
): Player[] {
  return Array.from({ length: count }, (_, i) => {
    const num = startIndex + i + 1;
    return {
      id: `${prefix}-${i}`,
      name: `Player ${num}`,
      imageUrl: PLACEHOLDER_IMAGE,
    };
  });
}

const TRIBE_CONFIG = [
  {
    tribeName: "Vatu Tribe",
    headerColorClass: "text-tribeVatu" as const,
    players: buildPlaceholderPlayers("vatu", 0, 8),
  },
  {
    tribeName: "Kalo Tribe",
    headerColorClass: "text-tribeKalo" as const,
    players: buildPlaceholderPlayers("kalo", 8, 8),
  },
  {
    tribeName: "Cila Tribe",
    headerColorClass: "text-tribeCila" as const,
    players: buildPlaceholderPlayers("cila", 16, 8),
  },
];

export function TribeBoard() {
  return (
    <div
      className="grid grid-cols-1 gap-8 md:grid-cols-3"
      role="region"
      aria-label="Tribe board"
    >
      {TRIBE_CONFIG.map((config) => (
        <TribeColumn
          key={config.tribeName}
          tribeName={config.tribeName}
          headerColorClass={config.headerColorClass}
          players={config.players}
        />
      ))}
    </div>
  );
}
