"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { getHomeLenis } from "@/lib/home-lenis";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22 }}
          onClick={() => {
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const lenis = getHomeLenis();
            if (lenis) {
              lenis.scrollTo(0, { immediate: reduce });
              return;
            }
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
          }}
          className="back-tab"
          aria-label="Back to top"
        >
          <span className="back-tab-label">top</span>
          <ArrowUp className="h-4 w-4" strokeWidth={2.2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
