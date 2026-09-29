"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

const SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 };

/** Bar thickness - 8px slimmer than the first pass. */
const BAR_H = 24;
/** Leading-edge strip. About one-third the previous amplitude. */
const WAVE_W = 11;
/**
 * Wavelength - previously 12px (two crests in the bar). 3× stretch so the
 * edge is a slow pour, not a spike. Two periods in the sheet so translateY(-50%) loops.
 */
const PERIOD_H = 36;
const LOOPS = 2;
const SVG_H = PERIOD_H * LOOPS;

/**
 * Periodic milk meniscus: left of the strip stays flush (x=0), the right
 * edge is a rounded pour. Integer periods so a 50% translateY loops.
 */
function milkEdgePath(width: number, height: number, periods: number) {
  const steps = 96;
  let d = "M0 0";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const y = t * height;
    // Soften the sine so crests stay round (milk), not triangular.
    const s = Math.sin(t * periods * Math.PI * 2);
    const n = Math.sign(s) * Math.pow(Math.abs(s), 0.55);
    const x = (width / 2) * (1 + n);
    d += `L${x.toFixed(3)} ${y.toFixed(3)}`;
  }
  d += `L0 ${height.toFixed(3)}Z`;
  return d;
}

const WAVE_PATH = milkEdgePath(WAVE_W, SVG_H, LOOPS);

/** Pink milk rail under the nav. Straight on three sides; the leading edge ripples. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING);
  const width = useTransform(progress, (v) =>
    v <= 0 ? "0px" : `max(${WAVE_W}px, ${v * 100}%)`,
  );
  const [now, setNow] = useState(0);

  useEffect(() => {
    let last = -1;
    return scrollYProgress.on("change", (v) => {
      const next = Math.round(v * 100);
      if (next === last) return;
      last = next;
      setNow(next);
    });
  }, [scrollYProgress]);

  const ticks = ["0%", "50%", "100%"] as const;

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={now}
      className="pointer-events-none fixed inset-x-0 top-16 z-60 overflow-visible"
      style={{ height: BAR_H }}
    >
      {ticks.map((at) => (
        <span key={at} className="progress-tick" style={{ left: at }} />
      ))}
      <motion.div style={{ width }} className="relative h-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-pink"
          style={{ right: WAVE_W - 1 }}
        />
        <svg
          viewBox={`0 0 ${WAVE_W} ${SVG_H}`}
          preserveAspectRatio="none"
          className={reduce ? "absolute top-0 right-0 block" : "milk-edge absolute top-0 right-0 block"}
          style={{ width: WAVE_W, height: SVG_H }}
          aria-hidden
        >
          <path d={WAVE_PATH} className="fill-pink" />
        </svg>
      </motion.div>
    </div>
  );
}
