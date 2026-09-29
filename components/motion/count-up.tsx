"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useReducedMotion,
  useMotionValue,
  useMotionValueEvent,
  animate,
  type MotionValue,
} from "motion/react";

/** Animated number - counts on view, or scrubs with a scroll `progress` value. */
export function CountUp({
  to,
  from = 0,
  duration = 1.8,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  progress,
}: {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  progress?: MotionValue<number>;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const fallback = useMotionValue(0);
  const [value, setValue] = useState(reduce ? to : from);

  useMotionValueEvent(progress ?? fallback, "change", (v) => {
    if (!progress) return;
    setValue(from + (to - from) * v);
  });

  useEffect(() => {
    if (progress || !inView || reduce) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration, progress]);

  const displayValue = reduce && !progress ? to : value;

  return (
    <span ref={ref} className={className}>
      {prefix}
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
