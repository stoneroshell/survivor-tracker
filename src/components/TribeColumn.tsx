import { PlayerCard } from "./PlayerCard";

const HEADER_TO_BORDER = {
  "text-tribeVatu": "border-tribeVatu" as const,
  "text-tribeKalo": "border-tribeKalo" as const,
  "text-tribeCila": "border-tribeCila" as const,
};

export interface TribeColumnProps {
  tribeName: string;
  headerColorClass: "text-tribeVatu" | "text-tribeKalo" | "text-tribeCila";
  players: Array<{ name: string; imageUrl: string }>;
}

export function TribeColumn({
  tribeName,
  headerColorClass,
  players,
}: TribeColumnProps) {
  const tribeBorderClass = HEADER_TO_BORDER[headerColorClass];
  return (
    <section
      className="flex flex-col gap-4"
      aria-label={`Tribe: ${tribeName}`}
    >
      <h2
        className={`font-heading text-xl font-semibold tracking-tight ${headerColorClass}`}
      >
        {tribeName}
      </h2>
      <ul className="flex flex-col gap-3" aria-label={`Players in ${tribeName}`}>
        {players.map((player) => (
          <li key={player.name}>
            <PlayerCard
              name={player.name}
              imageUrl={player.imageUrl}
              tribeBorderClass={tribeBorderClass}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
