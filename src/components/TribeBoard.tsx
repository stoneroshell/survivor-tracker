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
import { PlayerCard } from "./PlayerCard";
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

const ACTIVE = "active" as const;

function getActivePlayersByTribe(players: Player[]) {
  const active = players.filter((p) => p.status === ACTIVE);
  const byTribe = (tribeId: TribeId) =>
    active
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

function mergeActiveIntoPlayers(
  allPlayers: Player[],
  vatu: Player[],
  kalo: Player[],
  cila: Player[]
): Player[] {
  const jury = allPlayers.filter((p) => p.status === "jury");
  const eliminated = allPlayers.filter((p) => p.status === "eliminated");
  return [
    ...withTribeOrder(vatu),
    ...withTribeOrder(kalo),
    ...withTribeOrder(cila),
    ...jury,
    ...eliminated,
  ];
}

const TRIBE_BORDER: Record<TribeId, "border-tribeVatu" | "border-tribeKalo" | "border-tribeCila"> = {
  vatu: "border-tribeVatu",
  kalo: "border-tribeKalo",
  cila: "border-tribeCila",
};

function TribeBoardStaticCard({ player }: { player: Player }) {
  return (
    <PlayerCard
      playerId={player.id}
      name={player.name}
      image={player.image}
      allianceColor={player.allianceColor}
      tribeBorderClass={TRIBE_BORDER[player.tribe]}
      advantages={player.advantages}
      status={player.status}
      openMenuUpward
    />
  );
}

export function TribeBoard() {
  const players = useSurvivorStore((s) => s.players);
  const setPlayers = useSurvivorStore((s) => s.setPlayers);
  const viewMode = useSurvivorStore((s) => s.viewMode);
  const setViewMode = useSurvivorStore((s) => s.setViewMode);

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
    if (!activePlayer || activePlayer.status !== ACTIVE) return;

    const byTribe = getActivePlayersByTribe(players);
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
      setPlayers(mergeActiveIntoPlayers(players, next.vatu, next.kalo, next.cila));
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
      setPlayers(mergeActiveIntoPlayers(players, next.vatu, next.kalo, next.cila));
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
    setPlayers(mergeActiveIntoPlayers(players, next.vatu, next.kalo, next.cila));
  }

  const byTribe = getActivePlayersByTribe(players);
  const juryPlayers = players
    .filter((p) => p.status === "jury")
    .sort((a, b) => a.tribeOrder - b.tribeOrder);
  const eliminatedPlayers = players
    .filter((p) => p.status === "eliminated")
    .sort((a, b) => a.tribeOrder - b.tribeOrder);

  return (
    <DndContext
      id="tribe-board-dnd"
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-4">
        <div
          className="flex justify-center gap-0 rounded-card border border-border/80 bg-surfaceCard p-0.5"
          role="tablist"
          aria-label="View mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "tribe"}
            onClick={() => setViewMode("tribe")}
            className={`rounded-[calc(0.5rem-2px)] px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "tribe"
                ? "bg-border/60 text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            Tribe Hierarchy View
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === "alliance"}
            onClick={() => setViewMode("alliance")}
            className={`rounded-[calc(0.5rem-2px)] px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "alliance"
                ? "bg-border/60 text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            Alliance View
          </button>
        </div>
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
            viewMode={viewMode}
          />
        ))}
        </div>

        {juryPlayers.length > 0 && (
          <section
            className="flex flex-col gap-3"
            aria-label="Jury members"
          >
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted">
              Jury Members
            </h3>
            <div className="flex flex-wrap gap-3">
              {juryPlayers.map((player) => (
                <TribeBoardStaticCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        )}

        {eliminatedPlayers.length > 0 && (
          <section
            className="flex flex-col gap-3"
            aria-label="Eliminated"
          >
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted">
              Eliminated
            </h3>
            <div className="flex flex-wrap gap-3">
              {eliminatedPlayers.map((player) => (
                <TribeBoardStaticCard key={player.id} player={player} />
              ))}
            </div>
          </section>
        )}
      </div>
    </DndContext>
  );
}
