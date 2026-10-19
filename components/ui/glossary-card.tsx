"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { GlossaryTerm } from "@/lib/content";
import { ACCENT_HEX } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** GlossaryCard - tap to expand from short analogy to full definition. */
export function GlossaryCard({ term }: { term: GlossaryTerm }) {
  const [open, setOpen] = useState(false);
  const hex = ACCENT_HEX[term.accent];

  return (
    <button
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
      className="hand group w-full border-ink/15 bg-milk/70 p-5 text-left transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className="font-mono text-[0.65rem] uppercase tracking-widest"
            style={{ color: hex }}
          >
            term
          </span>
          <h4 className="font-display text-2xl text-ink">{term.term}</h4>
          <p className="mt-0.5 text-sm font-medium text-ink-70">{term.short}</p>
        </div>
        <span
          className="hand-icon flex h-8 w-8 shrink-0 items-center justify-center border-ink/20"
          style={{ color: hex }}
        >
          <Plus className={cn("h-4 w-4 transition-transform", open && "rotate-45")} />
        </span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <p className="pt-3 text-sm leading-relaxed text-ink-70">{term.long}</p>
      </motion.div>
    </button>
  );
}
