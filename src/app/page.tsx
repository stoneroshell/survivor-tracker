"use client";

import { useState } from "react";
import { TribeBoard } from "@/components/TribeBoard";

const PERSIST_KEY = "survivor-50-tracker";

export default function Home() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleResetConfirm() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(PERSIST_KEY);
      window.location.reload();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-7xl flex-1 flex-col items-center">
        <header className="mb-8 text-center font-survivor">
          <h1 className="text-3xl font-semibold leading-tight tracking-[0.2em] text-foreground sm:text-4xl md:text-5xl">
            Survivor 50 Companion
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted">
            The Ultimate Survivor 50 Tracker!
          </p>
        </header>

        <main className="w-full flex-1">
          <TribeBoard />
        </main>

        <footer className="mt-8 w-full flex justify-end px-2 pb-8">
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="rounded-card border border-border/80 bg-surfaceCard px-4 py-2 text-sm font-medium text-firePrimary transition-colors hover:bg-border/40 hover:text-firePrimary"
            aria-label="Reset tracker to original state"
          >
            Reset
          </button>
        </footer>
      </div>

      {showResetConfirm && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-confirm-title"
        >
          <div className="mx-4 w-full max-w-sm rounded-card border border-border bg-surfaceCard p-5 shadow-fire-glow">
            <p
              id="reset-confirm-title"
              className="text-base font-medium text-foreground"
            >
              Are you sure you want to reset the tracker?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-border/40"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetConfirm}
                className="rounded px-3 py-1.5 text-sm font-medium text-firePrimary transition-colors hover:bg-border/40"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
