"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { asset } from "@/lib/utils";

const SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 };

/** Half the previous 24px rail. */
const BAR_H = 12;
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

/** Walk frames. The art faces left; the bar grows right, so the sprite is flipped. */
const COW_FRAMES = ["/art/images/cow-walk-1.png", "/art/images/cow-walk-2.png"] as const;
const COW_H = 46;
const COW_W = Math.round(COW_H * (2420 / 1815));
/** Opaque pixels sit inset from the PNG edges. After the horizontal flip these swap sides. */
const COW_TAIL = 0.0992 * COW_W;
const COW_NOSE = (1 - 0.1326) * COW_W;
/** How far the nose runs past the pink leading edge, until the screen edge stops it. */
const COW_OVERHANG = 18;
/** Distance from the sprite's left edge to the opaque cow's middle, after the flip. */
const COW_CENTER = (COW_TAIL + COW_NOSE) / 2;
const COW_SHIFT = COW_NOSE - COW_OVERHANG;

/** Pink milk rail under the nav. Straight on three sides; the leading edge ripples. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING);
  const width = useTransform(
    progress,
    (v) =>
      `clamp(${-COW_TAIL + COW_CENTER}px, calc(${v * 100}% - ${COW_SHIFT - COW_CENTER}px), calc(100% - ${COW_NOSE - COW_CENTER}px))`,
  );
  const cowLeft = useTransform(
    progress,
    (v) =>
      `clamp(${-COW_TAIL}px, calc(${v * 100}% - ${COW_SHIFT}px), calc(100% - ${COW_NOSE}px))`,
  );
  const [now, setNow] = useState(0);
  const [walking, setWalking] = useState(false);

  useEffect(() => {
    let last = -1;
    return scrollYProgress.on("change", (v) => {
      const next = Math.round(v * 100);
      if (next === last) return;
      last = next;
      setNow(next);
    });
  }, [scrollYProgress]);

  useEffect(() => {
    if (reduce) return;
    let timer = 0;
    let moving = false;
    const unsub = scrollYProgress.on("change", () => {
      if (!moving) {
        moving = true;
        setWalking(true);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        moving = false;
        setWalking(false);
      }, 140);
    });
    return () => {
      window.clearTimeout(timer);
      unsub();
    };
  }, [reduce, scrollYProgress]);

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
      <motion.div style={{ width }} className="relative h-full">
        <div className="absolute inset-0 overflow-hidden">
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
        </div>
      </motion.div>
      <motion.div
        aria-hidden
        style={{ left: cowLeft, width: COW_W, height: COW_H, bottom: -14, transform: "scaleX(-1)" }}
        className={walking ? "pointer-events-none absolute z-10" : "cow-walk-paused pointer-events-none absolute z-10"}
      >
        {COW_FRAMES.map((src, i) => (
          <img
            key={src}
            src={asset(src)}
            alt=""
            draggable={false}
            className={
              reduce && i === 1
                ? "absolute inset-0 hidden h-full w-full object-contain"
                : `cow-walk-${i === 0 ? "a" : "b"} absolute inset-0 h-full w-full object-contain`
            }
          />
        ))}
      </motion.div>
    </div>
  );
}
