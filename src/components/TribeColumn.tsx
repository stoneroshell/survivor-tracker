"use client";

import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Player, TribeId, ViewMode } from "@/store/useSurvivorStore";
import { PlayerCard } from "./PlayerCard";

/** Display order only; does not mutate tribeOrder. */
function sortPlayersForDisplay(players: Player[], viewMode: ViewMode): Player[] {
  if (viewMode === "tribe") {
    return [...players].sort((a, b) => a.tribeOrder - b.tribeOrder);
  }
  // viewMode === "alliance": group by allianceColor, sort groups, then by tribeOrder within
  const byColor = new Map<string | null, Player[]>();
  for (const p of players) {
    const key = p.allianceColor;
    if (!byColor.has(key)) byColor.set(key, []);
    byColor.get(key)!.push(p);
  }
  // Sort within each group by tribeOrder (display only; no mutation)
  for (const arr of byColor.values()) {
    arr.sort((a, b) => a.tribeOrder - b.tribeOrder);
  }
  // Sort groups: null last, then by count desc, then by color string asc
  const entries = Array.from(byColor.entries());
  entries.sort(([colorA, groupA], [colorB, groupB]) => {
    if (colorA === null) return 1;
    if (colorB === null) return -1;
    const countDiff = groupB.length - groupA.length;
    if (countDiff !== 0) return countDiff;
    return String(colorA).localeCompare(String(colorB));
  });
  return entries.flatMap(([, group]) => group);
}

const HEADER_TO_BORDER = {
  "text-tribeVatu": "border-tribeVatu" as const,
  "text-tribeKalo": "border-tribeKalo" as const,
  "text-tribeCila": "border-tribeCila" as const,
};

export interface TribeColumnProps {
  tribeId: TribeId;
  tribeName: string;
  headerColorClass: "text-tribeVatu" | "text-tribeKalo" | "text-tribeCila";
  players: Player[];
  viewMode: ViewMode;
}

function SortablePlayerCard({
  player,
  tribeBorderClass,
}: {
  player: Player;
  tribeBorderClass: "border-tribeVatu" | "border-tribeKalo" | "border-tribeCila";
}) {
  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({ id: player.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li key={player.id}>
      <PlayerCard
        ref={setNodeRef}
        style={style}
        isDragging={isDragging}
        playerId={player.id}
        name={player.name}
        image={player.image}
        allianceColor={player.allianceColor}
        tribeBorderClass={tribeBorderClass}
        advantages={player.advantages}
        status={player.status}
        isFavorite={player.isFavorite ?? false}
        {...attributes}
        {...listeners}
      />
    </li>
  );
}

export function TribeColumn({
  tribeId,
  tribeName,
  headerColorClass,
  players,
  viewMode,
}: TribeColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `tribe-${tribeId}`,
  });
  const tribeBorderClass = HEADER_TO_BORDER[headerColorClass];

  const displayPlayers = useMemo(
    () => sortPlayersForDisplay(players, viewMode),
    [players, viewMode]
  );

  return (
    <section
      ref={setNodeRef}
      className={`flex flex-col gap-4 rounded-card transition-colors duration-150 ${
        isOver ? "bg-surfaceCard/50" : ""
      }`}
      aria-label={`Tribe: ${tribeName}`}
    >
      <h2
        className={`font-heading text-xl font-semibold tracking-tight ${headerColorClass}`}
      >
        {tribeName}
      </h2>
      <SortableContext
        items={displayPlayers.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={viewMode === "tribe" ? "relative" : ""}>
          {viewMode === "tribe" && (
            <div
              className="tribe-hierarchy-bar absolute left-0 top-0 bottom-0 w-1.5 rounded-full"
              aria-hidden
            />
          )}
          <ul
            className={`flex min-h-[2rem] flex-col gap-3 ${viewMode === "tribe" ? "pl-4" : ""}`}
            aria-label={`Players in ${tribeName}`}
          >
            {displayPlayers.map((player) => (
              <SortablePlayerCard
                key={player.id}
                player={player}
                tribeBorderClass={tribeBorderClass}
              />
            ))}
          </ul>
        </div>
      </SortableContext>
    </section>
  );
}
