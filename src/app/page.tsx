import { TribeBoard } from "@/components/TribeBoard";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-7xl flex-1 flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Survivor 50 Strategic Companion
          </h1>
          <p className="font-body mt-2 text-base leading-relaxed text-muted">
            The Ultimate Survivor 50 Strategy Companion!
          </p>
        </header>

        <main className="w-full flex-1">
          <TribeBoard />
        </main>
      </div>
    </div>
  );
}
