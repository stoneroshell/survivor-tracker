"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Player } from "./TribeBoard";
import { PlayerCard } from "./PlayerCard";

const HEADER_TO_BORDER = {
  "text-tribeVatu": "border-tribeVatu" as const,
  "text-tribeKalo": "border-tribeKalo" as const,
  "text-tribeCila": "border-tribeCila" as const,
};

export interface TribeColumnProps {
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
        imageUrl={player.imageUrl}
        tribeBorderClass={tribeBorderClass}
        {...attributes}
        {...listeners}
      />
    </li>
  );
}

export function TribeColumn({
  tribeName,
  headerColorClass,
  players: initialPlayers,
}: TribeColumnProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const tribeBorderClass = HEADER_TO_BORDER[headerColorClass];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over == null || active.id === over.id) return;
    const oldIndex = players.findIndex((p) => p.id === active.id);
    const newIndex = players.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    setPlayers((prev) => arrayMove(prev, oldIndex, newIndex));
  }

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
      <DndContext
        id={`tribe-dnd-${tribeName.replace(/\s+/g, "-")}`}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={players.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul
            className="flex flex-col gap-3"
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
      </DndContext>
    </section>
  );
}
