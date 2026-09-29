"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Tilt - subtle pointer-reactive 3D tilt for cards. The card leans toward the
 * cursor and lifts a touch, with a soft spring so it feels physical rather than
 * snappy. Purely enhancement: on touch / reduced-motion it renders a plain div.
 */
export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.02,
}: {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees on each axis. */
  max?: number;
  /** Hover scale. */
  scale?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const springCfg = { stiffness: 220, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), springCfg);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), springCfg);

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ scale }}
      transition={{ type: "spring", ...springCfg }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}
