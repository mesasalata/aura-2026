import { cn } from "@/lib/utils";

const accentMap = {
  pink: "border-pink/40 text-pink-deep bg-pink/10",
  signal: "border-signal/40 text-signal-deep bg-signal/10",
  butter: "border-butter/50 text-[#8a6a12] bg-butter/15",
  coral: "border-coral/40 text-coral-deep bg-coral/10",
  bio: "border-bio/40 text-[#1c7a55] bg-bio/12",
  ink: "border-ink/20 text-ink-70 bg-ink/5",
} as const;

export type Accent = keyof typeof accentMap;

export function Badge({
  children,
  accent = "ink",
  className,
  mono = true,
}: {
  children: React.ReactNode;
  accent?: Accent;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "hand-chip inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium",
        mono && "font-mono uppercase tracking-wider text-[0.68rem]",
        accentMap[accent],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const ACCENT_HEX: Record<Accent, string> = {
  pink: "var(--color-pink)",
  signal: "var(--color-signal)",
  butter: "var(--color-butter)",
  coral: "var(--color-coral)",
  bio: "var(--color-bio)",
  ink: "var(--color-ink)",
};
