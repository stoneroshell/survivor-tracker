export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-7xl flex-1 flex-col items-center">
        <header className="mb-8 text-center">
          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl">
            Survivor 50 Tracker
          </h1>
          <p className="font-body mt-2 text-lg leading-relaxed text-muted">
            Strategy Companion Board
          </p>
        </header>

        <main className="w-full flex-1">
          <div
            className="min-h-[400px] w-full rounded-2xl border border-white/10 bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_rgba(247,147,26,0.2)]"
            aria-label="Tracker grid placeholder"
          />
        </main>
      </div>
    </div>
  );
}
