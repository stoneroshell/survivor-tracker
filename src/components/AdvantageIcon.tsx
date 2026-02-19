"use client";

import { useEffect, useState } from "react";
import type { AdvantageId } from "@/store/useSurvivorStore";

const GLOW_CLASS: Record<AdvantageId, string> = {
  immunity_idol: "drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]",
  advantage: "drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]",
  celebrity_advantage: "drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]",
};

const HOVER_GLOW_CLASS: Record<AdvantageId, string> = {
  immunity_idol: "hover:drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]",
  advantage: "hover:drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]",
  celebrity_advantage: "hover:drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]",
};

export interface AdvantageIconProps {
  id: AdvantageId;
  imagePath: string;
  animateOnMount?: boolean;
}

export function AdvantageIcon({
  id,
  imagePath,
  animateOnMount = false,
}: AdvantageIconProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [scaleFull, setScaleFull] = useState(!animateOnMount);

  useEffect(() => {
    if (!animateOnMount) return;
    setIsAnimating(true);
    const raf = requestAnimationFrame(() => setScaleFull(true));
    const t = setTimeout(() => setIsAnimating(false), 300);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [animateOnMount]);

  const scaleClass =
    animateOnMount && !scaleFull ? "scale-0" : "scale-100";
  const glowClass = isAnimating ? GLOW_CLASS[id] : "";
  const hoverGlowClass = HOVER_GLOW_CLASS[id];

  return (
    <img
      src={imagePath}
      alt=""
      className={`h-[1.8rem] w-[1.8rem] object-contain transition-[transform_0.2s_ease-out,filter_0.15s_ease-out] ${scaleClass} ${glowClass} ${hoverGlowClass}`}
    />
  );
}
