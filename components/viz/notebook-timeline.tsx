"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export type NotebookTrack = "wet" | "dry" | "hp" | "design" | "modeling" | "meeting";

export type NotebookEntry = {
  date: string;
  month: string;
  track: NotebookTrack;
  title: string;
  body: string;
};

const TRACK_META: Record<NotebookTrack, { label: string; color: string }> = {
  wet: { label: "Wet Lab", color: "var(--color-bio)" },
  dry: { label: "Dry Lab", color: "var(--color-signal)" },
  hp: { label: "Human Practices", color: "var(--color-pink)" },
  design: { label: "Design", color: "var(--color-butter)" },
  modeling: { label: "Modeling", color: "var(--color-signal-deep)" },
  meeting: { label: "Meeting", color: "var(--color-coral)" },
};

const FILTERS: { key: NotebookTrack | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "wet", label: "Wet Lab" },
  { key: "dry", label: "Dry Lab" },
  { key: "hp", label: "Human Practices" },
  { key: "modeling", label: "Modeling" },
  { key: "design", label: "Design" },
  { key: "meeting", label: "Meetings" },
];

export function NotebookTimeline({ entries }: { entries: NotebookEntry[] }) {
  const [filter, setFilter] = useState<NotebookTrack | "all">("all");
  const visible = entries.filter((e) => filter === "all" || e.track === filter);

  return (
    <div>
      {/* Filter chips */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter notebook by track">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(f.key)}
              className={cn(
                "hand-chip px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-ink bg-ink text-milk"
                  : "border-ink/15 text-ink-70 hover:border-ink/40",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative border-l border-ink/12 pl-8">
        <AnimatePresence mode="popLayout">
          {visible.map((e, i) => {
            const meta = TRACK_META[e.track];
            return (
              <motion.div
                key={`${e.date}-${e.title}`}
                layout
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="relative mb-8 last:mb-0"
              >
                <span
                  className="absolute -left-[41px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-milk"
                  style={{ background: meta.color }}
                  aria-hidden
                />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-ink-40">{e.date}</span>
                  <span
                    className="hand-chip border-transparent px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest"
                    style={{ background: `color-mix(in srgb, ${meta.color} 16%, transparent)`, color: "var(--color-ink)" }}
                  >
                    {meta.label}
                  </span>
                </div>
                <h4 className="mt-1.5 font-display text-xl text-ink">{e.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-ink-70">{e.body}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
