export interface PlayerCardProps {
  name: string;
  imageUrl: string;
  tribeBorderClass: "border-tribeVatu" | "border-tribeKalo" | "border-tribeCila";
}

export function PlayerCard({
  name,
  imageUrl,
  tribeBorderClass,
}: PlayerCardProps) {
  return (
    <article
      className="flex min-h-[4rem] items-stretch gap-6 rounded-card border border-border/80 bg-surfaceCard px-3 py-2.5 transition-shadow duration-300 hover:shadow-fire-glow"
      aria-label={`Player: ${name}`}
    >
      <div
        className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 ${tribeBorderClass}`}
      >
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
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
    </article>
  );
}
