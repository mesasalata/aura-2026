"use client";

import { motion } from "motion/react";
import { ACCENT_HEX, type Accent } from "@/components/ui/badge";

export type Member = {
  name: string;
  role: string;
  track: string;
  accent: Accent;
  quote: string;
  initials: string;
};

/** TeamCard - professional hover; reveals role, contribution and a quote. */
export function TeamCard({ member }: { member: Member }) {
  const hex = ACCENT_HEX[member.accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-milk p-6 sm:p-7"
    >
      <div
        className="absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-35"
        style={{ background: hex }}
        aria-hidden
      />
      <div className="relative flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl text-ink"
          style={{ background: `color-mix(in srgb, ${hex} 22%, transparent)` }}
        >
          {member.initials}
        </div>
        <div>
          <p className="font-display text-xl text-ink">{member.name}</p>
          <p className="text-sm text-ink-55">{member.role}</p>
        </div>
      </div>
      <span
        className="mt-4 inline-block rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest"
        style={{ background: `color-mix(in srgb, ${hex} 15%, transparent)`, color: "var(--color-ink)" }}
      >
        {member.track}
      </span>
      <p className="mt-4 text-sm italic leading-relaxed text-ink-70">“{member.quote}”</p>
    </motion.div>
  );
}
