"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Parallax - translates its children on the Y axis as the element scrolls
 * through the viewport, creating real depth (not just a fade-in). Positive
 * `speed` means the layer trails the scroll (drifts up as you scroll down);
 * larger values = more travel, use bigger numbers for background/decorative
 * layers and smaller ones for foreground content. Respects reduced-motion.
 */
export function Parallax({
  children,
  className,
  speed = 60,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Total travel in px across the scroll pass (split +/- around centre). */
  speed?: number;
  as?: "div" | "span";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  const MotionTag = as === "span" ? motion.span : motion.div;

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag ref={ref} style={{ y }} className={cn(className)}>
      {children}
    </MotionTag>
  );
}
