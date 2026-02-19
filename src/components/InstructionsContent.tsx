"use client";

const ICON_SIZE = 32;

function TorchIcon() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-tribalGold"
      aria-hidden
    >
      {/* Flame */}
      <path
        d="M16 2c0 4-4 8-4 12 0 3 1.5 5 4 5s4-2 4-5c0-4-4-8-4-12z"
        fill="currentColor"
        opacity={0.95}
      />
      <path
        d="M16 6c0 2-2 5-2 8 0 2 1 3 2 3s2-1 2-3c0-3-2-6-2-8z"
        fill="currentColor"
        opacity={0.6}
      />
      {/* Stick */}
      <line
        x1="16"
        y1="18"
        x2="16"
        y2="28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RedFlagIcon() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-firePrimary"
      aria-hidden
    >
      <path d="M6 4v24M6 4l18 6v8L6 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 10v8L6 22V4l18 6z" fill="currentColor" fillOpacity={0.9} />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width={ICON_SIZE}
      height={ICON_SIZE}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto text-tribalGold"
      aria-hidden
    >
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="2" fill="currentColor" />
      <rect x="14" y="17" width="4" height="8" rx="1" fill="currentColor" />
    </svg>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <hr className="border-border" />
      <div className="text-center text-sm text-muted">{children}</div>
    </section>
  );
}

export function InstructionsContent() {
  return (
    <div className="space-y-8 text-center">
      <div>
        <h2 className="font-survivor text-2xl tracking-wide text-foreground">
          Survivor 50 Tracker
        </h2>
      </div>

      <Section icon={<TorchIcon />} title="Tribes">
        <ul className="mx-auto list-disc list-inside space-y-2 text-left [max-width:theme(spacing.80)]">
          <li>Drag players to rank tribe hierarchy</li>
          <li>Move players between tribes</li>
          <li>Adjust as the game shifts</li>
        </ul>
      </Section>

      <Section icon={<RedFlagIcon />} title="Alliances">
        <ul className="mx-auto list-disc list-inside space-y-2 text-left [max-width:theme(spacing.80)]">
          <li>Assign a single color banner to any player</li>
          <li>Switch to <strong>Alliance View</strong></li>
          <li>See voting blocs instantly</li>
        </ul>
      </Section>

      <Section
        icon={
          <img
            src="/images/advantage.svg"
            alt=""
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="mx-auto h-8 w-8 object-contain"
            aria-hidden
          />
        }
        title="Advantages"
      >
        <p className="mb-3">Track up to three per player:</p>
        <ul className="mx-auto space-y-2 text-left [max-width:theme(spacing.80)]">
          <li className="flex items-center justify-center gap-2">
            <img
              src="/images/immunity-idol.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 object-contain"
              aria-hidden
            />
            <span>Immunity Idol</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <img
              src="/images/advantage.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 object-contain"
              aria-hidden
            />
            <span>Advantage</span>
          </li>
          <li className="flex items-center justify-center gap-2">
            <img
              src="/images/celebrity-advantage.svg"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 shrink-0 object-contain"
              aria-hidden
            />
            <span>Celebrity Advantage</span>
          </li>
        </ul>
      </Section>

      <Section
        icon={
          <img
            src="/images/eliminated-x.png"
            alt=""
            width={ICON_SIZE}
            height={ICON_SIZE}
            className="mx-auto h-8 w-8 object-contain"
            aria-hidden
          />
        }
        title="Elimination"
      >
        <ul className="mx-auto list-disc list-inside space-y-2 text-left [max-width:theme(spacing.80)]">
          <li>Eliminate players</li>
          <li>Send players to the Jury</li>
        </ul>
      </Section>

      <Section icon={<InfoIcon />} title="Your Tracker">
        <ul className="mx-auto list-disc list-inside space-y-2 text-left [max-width:theme(spacing.80)]">
          <li>Your board is saved automatically in your browser</li>
          <li>Close the tab and return anytime — your changes remain</li>
          <li>Clearing your browser data will reset the tracker</li>
        </ul>
      </Section>

      <hr className="border-border" />

      <div className="font-survivor space-y-1 text-firePrimary">
        <p>Outwit.</p>
        <p>Outplay.</p>
        <p>Outtrack.</p>
      </div>
    </div>
  );
}
