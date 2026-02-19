"use client";

import { forwardRef, useRef, useState, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import type { PlayerStatus } from "@/store/useSurvivorStore";
import { useSurvivorStore } from "@/store/useSurvivorStore";

const ALLIANCE_PRESET_COLORS = [
  "#E10600", // Crimson Red
  "#1F3C88", // Deep Royal Blue
  "#FFD100", // Tribal Gold
  "#6A0DAD", // Royal Purple
  "#228B22", // Forest Green
  "#D4D4D4", // Light Gray
  "#4B0082", // Indigo
  "#A52A2A", // Burnt Brown
  "#572C2C", // Dark Brown
  "#9DC209", // Acid Lime
] as const;

export interface PlayerCardProps
  extends Omit<
    React.ComponentPropsWithoutRef<"article">,
    "className" | "style"
  > {
  playerId: string;
  name: string;
  image: string;
  allianceColor: string | null;
  tribeBorderClass: "border-tribeVatu" | "border-tribeKalo" | "border-tribeCila";
  status?: PlayerStatus;
  style?: React.CSSProperties;
  isDragging?: boolean;
}

type MenuView = "closed" | "menu" | "colors";

export const PlayerCard = forwardRef<HTMLElement, PlayerCardProps>(
  function PlayerCard(
    {
      playerId,
      name,
      image,
      allianceColor,
      tribeBorderClass,
      status = "active",
      style,
      isDragging,
      ...rest
    },
    ref
  ) {
    const setPlayerAllianceColor = useSurvivorStore(
      (s) => s.setPlayerAllianceColor
    );
    const setPlayerStatus = useSurvivorStore((s) => s.setPlayerStatus);
    const isActive = status === "active";
    const [menuView, setMenuView] = useState<MenuView>("closed");
    const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (menuView === "closed") {
        setDropdownRect(null);
        return;
      }
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setDropdownRect(rect);
    }, [menuView]);

    useEffect(() => {
      if (menuView === "closed") return;
      function handleClickOutside(e: MouseEvent) {
        const target = e.target as Node;
        if (
          triggerRef.current?.contains(target) ||
          portalRef.current?.contains(target)
        ) {
          return;
        }
        setMenuView("closed");
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuView]);

    const stripStyle =
      allianceColor != null
        ? {
            backgroundColor: allianceColor,
            boxShadow: `0 0 12px ${allianceColor}50`,
          }
        : undefined;

    function handleSetAlliance(color: string) {
      setPlayerAllianceColor(playerId, color);
      setMenuView("closed");
    }

    function handleRemoveAlliance() {
      setPlayerAllianceColor(playerId, null);
      setMenuView("closed");
    }

    function handleEliminate() {
      setPlayerStatus(playerId, "eliminated");
      setMenuView("closed");
    }

    function handleEliminateToJury() {
      setPlayerStatus(playerId, "jury");
      setMenuView("closed");
    }

    function handleResurrect() {
      setPlayerStatus(playerId, "active");
      setMenuView("closed");
    }

    const isMenuOpen = menuView !== "closed";

    return (
      <article
        ref={ref}
        style={style}
        className={`relative flex min-h-[4rem] items-stretch gap-6 rounded-card border border-border/80 bg-surfaceCard px-3 py-2.5 ${
          !isActive
            ? "opacity-55"
            : isDragging
              ? "scale-[1.02] shadow-fire-glow transition-none"
              : "transition-all duration-100 hover:scale-[1.04] hover:shadow-fire-glow"
        }`}
        aria-label={`Player: ${name}`}
        {...rest}
      >
        <div
          className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 ${tribeBorderClass}`}
        >
          <img
            src={image}
            alt={name}
            className={`h-full w-full object-cover ${!isActive ? "grayscale" : ""}`}
            width={40}
            height={40}
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col self-stretch">
          <div className="flex flex-1 items-center">
            <p className="font-body truncate text-lg font-medium text-foreground">
              {name}
            </p>
          </div>
          <div className="flex justify-end gap-1.5" aria-hidden="true">
            <span className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard" />
            <span className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard" />
            <span className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard" />
          </div>
        </div>

        {/* Menu button – dropdown renders in portal so it appears above all cards */}
        <div
          ref={triggerRef}
          className="absolute right-2 top-2"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() =>
              setMenuView((v) => (v === "closed" ? "menu" : "closed"))
            }
            className="rounded px-1.5 py-0.5 text-[0.85em] text-muted transition-opacity duration-150 hover:bg-border/40 hover:text-foreground"
            aria-label="Alliance options"
            aria-expanded={isMenuOpen}
          >
            •••
          </button>
        </div>

        {/* Portal: menu and color picker render above all cards */}
        {dropdownRect &&
          createPortal(
            <div
              ref={portalRef}
              className="fixed z-[9999] transition-opacity duration-150"
              style={{
                top: dropdownRect.bottom + 4,
                right: window.innerWidth - dropdownRect.right,
              }}
            >
              {menuView === "menu" && (
                <div
                  className="w-40 rounded-card border border-border bg-surfaceCard py-1 shadow-fire-glow"
                  role="menu"
                >
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-border/40"
                    role="menuitem"
                    onClick={() => setMenuView("colors")}
                  >
                    Set Alliance
                  </button>
                  {allianceColor != null && (
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-border/40"
                      role="menuitem"
                      onClick={handleRemoveAlliance}
                    >
                      Remove Alliance
                    </button>
                  )}
                  {isActive && (
                    <>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-firePrimary transition-colors hover:bg-border/40"
                        role="menuitem"
                        onClick={handleEliminate}
                      >
                        Eliminate
                      </button>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm text-firePrimary transition-colors hover:bg-border/40"
                        role="menuitem"
                        onClick={handleEliminateToJury}
                      >
                        Eliminate and Send to Jury
                      </button>
                    </>
                  )}
                  {!isActive && (
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-border/40"
                      role="menuitem"
                      onClick={handleResurrect}
                    >
                      Resurrect
                    </button>
                  )}
                </div>
              )}
              {menuView === "colors" && (
                <div
                  className="grid grid-cols-5 gap-1.5 rounded-card border border-border bg-surfaceCard p-2 shadow-fire-glow"
                  role="menu"
                >
                  {ALLIANCE_PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="h-7 w-7 rounded-sm border border-border/60 transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}40`,
                      }}
                      aria-label={`Set alliance color ${color}`}
                      onClick={() => handleSetAlliance(color)}
                    />
                  ))}
                </div>
              )}
            </div>,
            document.body
          )}

        {allianceColor != null && (
          <div
            className="absolute right-0 top-0 h-full w-[5px] rounded-l-sm"
            style={stripStyle}
            aria-hidden
          />
        )}

        {!isActive && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-card bg-black/20"
            aria-hidden
          >
            <svg
              viewBox="0 0 100 100"
              className="h-full w-full max-h-[80%] max-w-[80%] text-firePrimary"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="20" y1="20" x2="80" y2="80" />
              <line x1="80" y1="20" x2="20" y2="80" />
            </svg>
          </div>
        )}
      </article>
    );
  }
);
