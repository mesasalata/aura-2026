"use client";

import { useReducedMotion } from "motion/react";
import { Blob } from "@/components/viz/sketch";
import { ART, artUrl, type ArtGlow, type ArtId, type ArtMotion } from "@/lib/art";
import { cn } from "@/lib/utils";

/** One catalog sprite, with a named motion preset. */
export function Art({
  id,
  motion: kind = "none",
  size = 96,
  rotate = 0,
  flip = false,
  delay = 0,
  glow,
  opacity = 1,
  alt,
  decorative = true,
  className,
}: {
  id: ArtId;
  motion?: ArtMotion;
  size?: number;
  rotate?: number;
  flip?: boolean;
  delay?: number;
  glow?: ArtGlow;
  opacity?: number;
  alt?: string;
  decorative?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const meta = ART[id];
  const idle = reduce || kind === "none" ? undefined : IDLE_CLASS[kind];

  return (
    <div
      className={cn("relative", flip && "-scale-x-100", className)}
      style={{ width: size, height: size, rotate: rotate ? `${rotate}deg` : undefined, opacity }}
    >
      <div
        className={cn("relative isolate h-full w-full", idle)}
        style={idle && delay ? { animationDelay: `${delay}s` } : undefined}
      >
        {glow && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute left-1/2 top-[52%] -z-10 h-[108%] w-[108%] -translate-x-1/2 -translate-y-1/2",
              !reduce && "animate-art-glow",
            )}
          >
            {/* flat organic wash, not a blur - same family as the herd auras */}
            <Blob
              shape="d"
              fill={glow === "pink" ? "var(--color-pink)" : glow === "signal" ? "var(--color-signal)" : "var(--color-butter)"}
              className="h-full w-full opacity-30"
            />
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artUrl(id)}
          alt={decorative ? "" : (alt ?? meta.alt)}
          width={meta.w}
          height={meta.h}
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-contain"
        />
      </div>
    </div>
  );
}

/** Keep these as CSS keyframes. Script-driven transforms repaint each frame and snap the sprite to whole pixels. */
const IDLE_CLASS: Record<Exclude<ArtMotion, "none">, string> = {
  breathe: "animate-art-breathe",
  float: "animate-art-float",
  bob: "animate-art-bob",
  sway: "animate-art-sway",
};
