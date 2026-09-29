"use client";

import { createContext, useContext } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Blob } from "@/components/viz/sketch";
import { ART, artUrl, type ArtGlow, type ArtId, type ArtMotion } from "@/lib/art";
import { cn } from "@/lib/utils";

type Field = { sx: MotionValue<number>; sy: MotionValue<number> };
const FieldCtx = createContext<Field | null>(null);

/**
 * Stage - a relative frame that can lean its pins toward the pointer.
 * Every composed illustration should sit in one of these.
 */
export function ArtStage({
  pointer = false,
  className,
  children,
}: {
  pointer?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 70, damping: 22, mass: 0.55 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);

  return (
    <FieldCtx.Provider value={{ sx, sy }}>
      <div
        className={cn("relative", className)}
        onPointerMove={
          pointer && !reduce
            ? (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
                my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
              }
            : undefined
        }
        onPointerLeave={pointer && !reduce ? () => { mx.set(0); my.set(0); } : undefined}
      >
        {children}
      </div>
    </FieldCtx.Provider>
  );
}

/**
 * Pin - places a sprite on the stage. `x`/`y` are the centre. `depth` makes
 * the piece chase the pointer (and can be used as a parallax weight).
 */
export function ArtPin({
  x,
  y,
  depth = 0.6,
  hide,
  className,
  children,
}: {
  x: string;
  y: string;
  depth?: number;
  hide?: "mobile" | "desktop";
  className?: string;
  children: React.ReactNode;
}) {
  const field = useContext(FieldCtx);
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);
  const ox = useTransform(field?.sx ?? fallbackX, (v) => v * depth * 18);
  const oy = useTransform(field?.sy ?? fallbackY, (v) => v * depth * 12);

  return (
    <motion.div
      aria-hidden
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2",
        hide === "mobile" && "hidden sm:block",
        hide === "desktop" && "sm:hidden",
        className,
      )}
      style={{ left: x, top: y, x: ox, y: oy }}
    >
      {children}
    </motion.div>
  );
}

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
  const animate = reduce || kind === "none" ? undefined : preset(kind, delay);

  return (
    <motion.div
      className={cn("relative", flip && "-scale-x-100", className)}
      style={{ width: size, height: size, rotate, opacity }}
      animate={animate?.animate}
      transition={animate?.transition}
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
    </motion.div>
  );
}

function preset(kind: ArtMotion, delay: number) {
  const ease = "easeInOut" as const;
  switch (kind) {
    case "breathe":
      return {
        animate: { y: [0, -6, 0], scale: [1, 1.025, 1] },
        transition: { duration: 5.8, delay, repeat: Infinity, ease },
      };
    case "float":
      return {
        animate: { y: [0, -10, 0] },
        transition: { duration: 6.4, delay, repeat: Infinity, ease },
      };
    case "bob":
      return {
        animate: { y: [0, -5, 0] },
        transition: { duration: 4.2, delay, repeat: Infinity, ease },
      };
    case "sway":
      return {
        animate: { rotate: [-2.4, 2.4, -2.4] },
        transition: { duration: 6.2, delay, repeat: Infinity, ease },
      };
    default:
      return undefined;
  }
}
