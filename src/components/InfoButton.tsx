"use client";

type InfoButtonProps = {
  onClick: () => void;
  "aria-label"?: string;
  className?: string;
};

export function InfoButton({ onClick, "aria-label": ariaLabel = "Show instructions", className }: InfoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`rounded-full p-1 text-[#E6C068] transition-[transform,opacity] duration-150 hover:scale-110 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#E6C068]/50 focus:ring-offset-2 focus:ring-offset-[var(--backgroundPrimary)] ${className ?? ""}`}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
        className="block"
        aria-hidden
      >
        <defs>
          <filter id="info-btn-rough">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
          </filter>
        </defs>
        <circle
          cx="64"
          cy="64"
          r="54"
          fill="none"
          stroke="#E6C068"
          strokeWidth="8"
          strokeLinecap="round"
          filter="url(#info-btn-rough)"
        />
        <circle
          cx="64"
          cy="64"
          r="46"
          fill="none"
          stroke="#8B5E1A"
          strokeWidth="3"
          opacity="0.6"
        />
        <circle cx="64" cy="42" r="6" fill="#E6C068" />
        <rect x="60" y="54" width="8" height="32" rx="4" fill="#E6C068" />
      </svg>
    </button>
  );
}
