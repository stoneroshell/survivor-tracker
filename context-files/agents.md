# Survivor 50 Tracker – Agent Guide

This document gives AI agents enough context to work effectively on the project: mission, tech stack, architecture, and conventions.

---

## Mission

**Survivor 50 Companion** is a strategy tracker for Survivor Season 50. It is a single-page app that lets users:

- View and reorder the 24 cast members across three tribes (Vatu, Kalo, Cila).
- Assign alliance colors to players and switch between Tribe Hierarchy View and Alliance View.
- Track elimination (active / eliminated / jury) and optionally resurrect players.
- Add up to three advantage icons per player (Immunity Idol, Advantage, Celebrity Advantage).

The UI aims for a **dark tribal firelight** look: tribal council at night, firelight glow, serious and immersive. It is a strategy board, not a generic dashboard. See `context-files/styles.md` for the full design system.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19.
- **Language:** TypeScript.
- **State:** Zustand with `persist` (localStorage, key `survivor-50-tracker`).
- **Drag-and-drop:** @dnd-kit (core, sortable, utilities).
- **Styling:** Tailwind CSS v4. Design tokens and theme in `src/styles/globals.css`.
- **No** external animation libs; prefer CSS transitions.

---

## Data Model (Zustand Store)

**File:** `src/store/useSurvivorStore.ts`

- **Player:** `id`, `name`, `image`, `tribe`, `tribeOrder`, `allianceColor`, `status` (`"active" | "eliminated" | "jury"`), `advantages` (`AdvantageId[]`, max 3).
- **Player id:** `${tribe}-${tribeOrder}` (e.g. `vatu-0`, `kalo-7`, `cila-6`). Three tribes, 8 players each = 24 players.
- **Tribes:** `TribeId = "vatu" | "kalo" | "cila"`.
- **ViewMode:** `"tribe" | "alliance"`. Persisted with players.
- **Store actions:** `setPlayers`, `setViewMode`, `setPlayerAllianceColor`, `setPlayerStatus`, `addPlayerAdvantage`, `removePlayerAdvantages`.

Initial roster is built from `SURVIVOR_50_ROSTER` (name + image URL per player). Persist `migrate` applies roster name/image by `id` so existing saves get updated cast data when the app version bumps.

---

## Architecture

- **Page:** `src/app/page.tsx` – Header, subhead (SURVIVOR font), main content, footer with red Reset button (confirmation → clear localStorage + reload). Reset is in normal document flow (bottom of page), not viewport-fixed.
- **TribeBoard** (`src/components/TribeBoard.tsx`): Top-level board. Holds `DndContext`, view toggle (Tribe Hierarchy / Alliance View), three `TribeColumn`s for active players, then Jury and Eliminated sections. Reads/writes `players` and `viewMode` from the store. Handles drag-end: reorder within tribe or move between tribes; updates `tribe` and `tribeOrder` via `setPlayers`.
- **TribeColumn** (`src/components/TribeColumn.tsx`): One tribe column. Receives `players` (already filtered by tribe), `viewMode`, and tribe config. Uses `useDroppable` and `SortableContext` (verticalListSortingStrategy). **Sorting:** tribe view = by `tribeOrder`; alliance view = group by `allianceColor`, sort groups (null last, then by count desc, then color asc), within group by `tribeOrder`. Does **not** mutate `tribeOrder`; display order only.
- **PlayerCard** (`src/components/PlayerCard.tsx`): Single player card. Uses `useSortable` when used in a column (receives ref, style, listeners, `isDragging`). Shows avatar (with optional face-focus zoom and pan left/right for specific players), name, advantage slots (or placeholders), alliance strip if `allianceColor`, menu (•••). Menu: Set/Remove Alliance, Add Advantage (if &lt; 3), Remove Advantages (if any), Eliminate / Eliminate to Jury (if active), Resurrect (if not active). Eliminated/jury cards: reduced opacity, grayscale avatar, red X overlay, no drag. Portal for dropdown so it renders above other cards (high z-index). Menus for jury/eliminated cards open upward (`openMenuUpward`) so they are not cut off at the bottom of the window.
- **AdvantageIcon** (`src/components/AdvantageIcon.tsx`): Renders one advantage icon with optional mount animation (scale in + brief glow) and type-specific hover glow (idol=gold, advantage=blue, celebrity=purple). Only animates when `animateOnMount` is true (e.g. just added); no animation on refresh.

Avatar cropping: default `object-cover object-top`. Some players have `scale-150 origin-top` (face zoom) and/or horizontal pan via `object-[35%_0%]` or `object-[65%_0%]` (see `FACE_FOCUS_PLAYER_IDS`, `AVATAR_PAN_RIGHT_IDS`, `AVATAR_PAN_LEFT_IDS` in PlayerCard).

---

## Key Conventions

- **Drag:** Transitions are disabled while dragging (`transition-none` when `isDragging`) so the dragged card follows the cursor; hover uses `transition-all duration-100` and slight scale/shadow.
- **Advantage icons:** Card slot size is explicit (e.g. `h-[1.8rem] w-[1.8rem]`) on both wrapper and `img`, with `object-contain`, to avoid accidental blow-up. Picker menu icons stay at a different size; only the card row uses the larger rem value.
- **Persistence:** Only `players` and `viewMode` are persisted. Version bump in store triggers migration (e.g. to apply roster name/image).
- **Reset:** Red button in footer; confirmation modal; on Yes: `localStorage.removeItem("survivor-50-tracker")` then `window.location.reload()`.
- **Assets:** Fonts in `public/fonts/`, images in `public/images/` (e.g. advantage icons, eliminated X). Player images are external URLs (e.g. EW.com) in the roster; avatar uses `object-cover` and optional per-player zoom/pan.

---

## File Map

| Path | Purpose |
|------|--------|
| `src/app/page.tsx` | Home: header, subhead, TribeBoard, footer Reset + confirmation modal |
| `src/app/layout.tsx` | Root layout, metadata, global styles |
| `src/store/useSurvivorStore.ts` | Zustand store: players, viewMode, actions, persist, SURVIVOR_50_ROSTER, migration |
| `src/components/TribeBoard.tsx` | DndContext, view toggle, 3 TribeColumns (active), Jury + Eliminated sections |
| `src/components/TribeColumn.tsx` | Droppable column, SortableContext, sort logic, SortablePlayerCard list |
| `src/components/PlayerCard.tsx` | Card UI, menu portal, alliance/advantages/elimination/resurrect, avatar crop constants |
| `src/components/AdvantageIcon.tsx` | Single advantage icon: mount animation + hover glow by type |
| `src/styles/globals.css` | Theme, SURVIVOR font, firelight, tribe colors, utilities |
| `context-files/styles.md` | Design system (colors, typography, firelight, tribe) |
| `context-files/agents.md` | This file |

---

## When Making Changes

- Preserve the dark tribal firelight aesthetic and existing hover/drag styling.
- Do not mutate `tribeOrder` for display-only logic (e.g. alliance view); only change it when the user reorders or moves players (drag-end, resurrect).
- Keep advantage icon sizes constrained (explicit rem on container and img, `object-contain`).
- Ensure menus/dropdowns render in a portal with high z-index so they appear above all cards.
- For new player-specific avatar behavior, extend the existing sets/constants in PlayerCard rather than scattering conditionals.
