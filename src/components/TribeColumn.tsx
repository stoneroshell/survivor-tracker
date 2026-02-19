"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Player, TribeId } from "./TribeBoard";
import { PlayerCard } from "./PlayerCard";

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
        name={player.name}
        image={player.image}
        icons={player.icons}
        tribeBorderClass={tribeBorderClass}
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
}: TribeColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `tribe-${tribeId}`,
  });
  const tribeBorderClass = HEADER_TO_BORDER[headerColorClass];

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
        items={players.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul
          className="flex min-h-[2rem] flex-col gap-3"
          aria-label={`Players in ${tribeName}`}
        >
          {players.map((player) => (
            <SortablePlayerCard
              key={player.id}
              player={player}
              tribeBorderClass={tribeBorderClass}
            />
          ))}
        </ul>
      </SortableContext>
    </section>
  );
}
