"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "motion/react";
import { setHomeLenis } from "@/lib/home-lenis";
import "lenis/dist/lenis.css";

/** Extra travel for a single wheel/trackpad event - slow ticks stay near 1×. */
function flickGain(delta: number) {
  const mag = Math.abs(delta);
  if (mag < 1) return delta;
  const extra = Math.min(0.7, 0.007 * mag);
  return Math.sign(delta) * mag * (1 + extra);
}

/**
 * Interpolated wheel/trackpad scrolling, the kind used on cinematic homepages.
 * Mount only on `/home-test` so the live homepage and wiki pages keep native scrolling.
 */
export function HomeSmoothScroll() {
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.11,
      wheelMultiplier: 1.06,
      anchors: true,
      virtualScroll: (event) => {
        event.deltaY = flickGain(event.deltaY);
        event.deltaX = flickGain(event.deltaX);
        return true;
      },
    });
    setHomeLenis(lenis);

    return () => {
      setHomeLenis(null);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
