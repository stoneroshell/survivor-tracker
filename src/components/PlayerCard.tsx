import { forwardRef } from "react";

export interface PlayerCardProps
  extends Omit<
    React.ComponentPropsWithoutRef<"article">,
    "className" | "style"
  > {
  name: string;
  image: string;
  icons: string[];
  tribeBorderClass: "border-tribeVatu" | "border-tribeKalo" | "border-tribeCila";
  style?: React.CSSProperties;
  isDragging?: boolean;
}

export const PlayerCard = forwardRef<HTMLElement, PlayerCardProps>(
  function PlayerCard(
    { name, image, icons, tribeBorderClass, style, isDragging, ...rest },
    ref
  ) {
    return (
      <article
        ref={ref}
        style={style}
        className={`flex min-h-[4rem] items-stretch gap-6 rounded-card border border-border/80 bg-surfaceCard px-3 py-2.5 ${
          isDragging
            ? "scale-[1.02] shadow-fire-glow transition-none"
            : "transition-all duration-100 hover:scale-[1.08] hover:shadow-fire-glow"
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
            {icons.length > 0
              ? icons.map((icon, i) => (
                  <span
                    key={i}
                    className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard"
                    title={icon}
                  />
                ))
              : [
                  <span
                    key="1"
                    className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard"
                  />,
                  <span
                    key="2"
                    className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard"
                  />,
                  <span
                    key="3"
                    className="h-4 w-4 shrink-0 rounded-full border border-border/60 bg-surfaceCard"
                  />,
                ]}
          </div>
        </div>
      </article>
    );
  }
);
