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
import { arrayMove } from "@dnd-kit/sortable";
import { TribeColumn } from "./TribeColumn";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

export type TribeId = "vatu" | "kalo" | "cila";

export interface Player {
  id: string;
  name: string;
  image: string;
  icons: string[];
  tribe: TribeId;
}

function buildPlaceholderPlayers(
  tribeId: TribeId,
  startIndex: number,
  count: number
): Player[] {
  return Array.from({ length: count }, (_, i) => {
    const num = startIndex + i + 1;
    return {
      id: `${tribeId}-${i}`,
      name: `Player ${num}`,
      image: PLACEHOLDER_IMAGE,
      icons: [],
      tribe: tribeId,
    };
  });
}

const TRIBE_CONFIG: Array<{
  tribeId: TribeId;
  tribeName: string;
  headerColorClass: "text-tribeVatu" | "text-tribeKalo" | "text-tribeCila";
}> = [
  {
    tribeId: "vatu",
    tribeName: "Vatu Tribe",
    headerColorClass: "text-tribeVatu",
  },
  {
    tribeId: "kalo",
    tribeName: "Kalo Tribe",
    headerColorClass: "text-tribeKalo",
  },
  {
    tribeId: "cila",
    tribeName: "Cila Tribe",
    headerColorClass: "text-tribeCila",
  },
];

function getPlayersByTribe(players: Player[]) {
  return {
    vatu: players.filter((p) => p.tribe === "vatu"),
    kalo: players.filter((p) => p.tribe === "kalo"),
    cila: players.filter((p) => p.tribe === "cila"),
  };
}

function rebuildPlayers(
  vatu: Player[],
  kalo: Player[],
  cila: Player[]
): Player[] {
  return [...vatu, ...kalo, ...cila];
}

const initialPlayers = rebuildPlayers(
  buildPlaceholderPlayers("vatu", 0, 8),
  buildPlaceholderPlayers("kalo", 8, 8),
  buildPlaceholderPlayers("cila", 16, 8)
);

export function TribeBoard() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over == null) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activePlayer = players.find((p) => p.id === activeId);
    if (!activePlayer) return;

    const byTribe = getPlayersByTribe(players);
    const sourceTribe = activePlayer.tribe;
    const sourceList = byTribe[sourceTribe];
    const sourceIndex = sourceList.findIndex((p) => p.id === activeId);
    if (sourceIndex === -1) return;

    // Dropped on a tribe droppable (empty area) -> append to that tribe
    if (overId === "tribe-vatu" || overId === "tribe-kalo" || overId === "tribe-cila") {
      const targetTribe = overId.replace("tribe-", "") as TribeId;
      if (sourceTribe === targetTribe) return;

      const targetList = byTribe[targetTribe];
      const updatedPlayer = { ...activePlayer, tribe: targetTribe };
      const newSourceList = sourceList.filter((p) => p.id !== activeId);
      const newTargetList = [...targetList, updatedPlayer];

      const next = {
        ...byTribe,
        [sourceTribe]: newSourceList,
        [targetTribe]: newTargetList,
      };
      setPlayers(rebuildPlayers(next.vatu, next.kalo, next.cila));
      return;
    }

    // Dropped on another player
    const overPlayer = players.find((p) => p.id === overId);
    if (!overPlayer) return;

    const targetTribe = overPlayer.tribe;
    const targetList = byTribe[targetTribe];
    const targetIndex = targetList.findIndex((p) => p.id === overId);
    if (targetIndex === -1) return;

    if (sourceTribe === targetTribe) {
      // Reorder within same tribe
      const newList = arrayMove(sourceList, sourceIndex, targetIndex);
      const next = { ...byTribe, [sourceTribe]: newList };
      setPlayers(rebuildPlayers(next.vatu, next.kalo, next.cila));
      return;
    }

    // Move to different tribe
    const updatedPlayer = { ...activePlayer, tribe: targetTribe };
    const newSourceList = sourceList.filter((p) => p.id !== activeId);
    const newTargetList = [
      ...targetList.slice(0, targetIndex),
      updatedPlayer,
      ...targetList.slice(targetIndex),
    ];
    const next = {
      ...byTribe,
      [sourceTribe]: newSourceList,
      [targetTribe]: newTargetList,
    };
    setPlayers(rebuildPlayers(next.vatu, next.kalo, next.cila));
  }

  const byTribe = getPlayersByTribe(players);

  return (
    <DndContext
      id="tribe-board-dnd"
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
        role="region"
        aria-label="Tribe board"
      >
        {TRIBE_CONFIG.map((config) => (
          <TribeColumn
            key={config.tribeId}
            tribeId={config.tribeId}
            tribeName={config.tribeName}
            headerColorClass={config.headerColorClass}
            players={byTribe[config.tribeId]}
          />
        ))}
      </div>
    </DndContext>
  );
}
