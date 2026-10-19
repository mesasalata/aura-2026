"use client";

import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

/** Round butter button; the pink ring around it fills as the page is read. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 800));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group fixed bottom-6 right-6 z-40 grid h-16 w-16 place-items-center"
          aria-label="Back to top"
        >
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
            <circle cx="32" cy="32" r="29" fill="var(--color-milk)" stroke="var(--color-ink)" strokeWidth="2.5" />
            <motion.circle
              cx="32"
              cy="32"
              r="29"
              fill="none"
              stroke="var(--color-pink)"
              strokeWidth="5"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <span className="press relative grid h-11 w-11 place-items-center rounded-full border-[2.5px] border-ink bg-butter text-ink shadow-[2px_3px_0_0_var(--color-ink)] transition-transform group-hover:-translate-y-0.5">
            <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" strokeWidth={3} />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
