"use client";

import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Player, TribeId } from "@/store/useSurvivorStore";
import { useSurvivorStore } from "@/store/useSurvivorStore";
import { TribeColumn } from "./TribeColumn";

const TRIBE_CONFIG: Array<{
  tribeId: TribeId;
  tribeName: string;
  headerColorClass: "text-tribeVatu" | "text-tribeKalo" | "text-tribeCila";
}> = [
  { tribeId: "vatu", tribeName: "Vatu Tribe", headerColorClass: "text-tribeVatu" },
  { tribeId: "kalo", tribeName: "Kalo Tribe", headerColorClass: "text-tribeKalo" },
  { tribeId: "cila", tribeName: "Cila Tribe", headerColorClass: "text-tribeCila" },
];

function getPlayersByTribe(players: Player[]) {
  const byTribe = (tribeId: TribeId) =>
    players
      .filter((p) => p.tribe === tribeId)
      .sort((a, b) => a.tribeOrder - b.tribeOrder);
  return {
    vatu: byTribe("vatu"),
    kalo: byTribe("kalo"),
    cila: byTribe("cila"),
  };
}

function withTribeOrder<T extends Player>(list: T[]): T[] {
  return list.map((p, i) => ({ ...p, tribeOrder: i })) as T[];
}

function rebuildPlayers(
  vatu: Player[],
  kalo: Player[],
  cila: Player[]
): Player[] {
  return [
    ...withTribeOrder(vatu),
    ...withTribeOrder(kalo),
    ...withTribeOrder(cila),
  ];
}

const TEST_ALLIANCE_COLORS = [
  "#b8860b", /* tribalGold */
  "#d97706", /* fireGlow */
  "#c2410c", /* firePrimary */
  "#f527da", /* tribeVatu */
  "#27e7f5", /* tribeKalo */
  "#f57d27", /* tribeCila */
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function TribeBoard() {
  const players = useSurvivorStore((s) => s.players);
  const setPlayers = useSurvivorStore((s) => s.setPlayers);
  const setPlayerAllianceColor = useSurvivorStore((s) => s.setPlayerAllianceColor);

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

    const overPlayer = players.find((p) => p.id === overId);
    if (!overPlayer) return;

    const targetTribe = overPlayer.tribe;
    const targetList = byTribe[targetTribe];
    const targetIndex = targetList.findIndex((p) => p.id === overId);
    if (targetIndex === -1) return;

    if (sourceTribe === targetTribe) {
      const newList = arrayMove(sourceList, sourceIndex, targetIndex);
      const next = { ...byTribe, [sourceTribe]: newList };
      setPlayers(rebuildPlayers(next.vatu, next.kalo, next.cila));
      return;
    }

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

  function handleTestAllianceColor() {
    const target = pickRandom(players);
    const color = pickRandom(TEST_ALLIANCE_COLORS);
    setPlayerAllianceColor(target.id, color);
  }

  return (
    <DndContext
      id="tribe-board-dnd"
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={handleTestAllianceColor}
          className="self-center rounded-card border border-border/80 bg-surfaceCard px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surfaceCard/80 hover:shadow-fire-glow"
        >
          Test: random alliance color
        </button>
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
      </div>
    </DndContext>
  );
}
