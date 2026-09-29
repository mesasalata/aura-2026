import { cn } from "@/lib/utils";
import { ACCENT_HEX, type Accent } from "@/components/ui/badge";

/**
 * ScienceExplainer - friendly "explain like I'm curious" block:
 * a plain-language analogy paired with the precise version.
 */
export function ScienceExplainer({
  analogy,
  precise,
  accent = "signal",
  minutes,
  className,
}: {
  analogy: React.ReactNode;
  precise: React.ReactNode;
  accent?: Accent;
  minutes?: number;
  className?: string;
}) {
  const hex = ACCENT_HEX[accent];
  return (
    <div className={cn("grid gap-4 rounded-[var(--radius-card)] border border-ink/10 bg-milk/60 p-6 sm:grid-cols-2", className)}>
      <div className="border-b border-ink/10 pb-4 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="kicker" style={{ color: hex }}>
            The analogy
          </span>
          {minutes != null && (
            <span className="font-mono text-[0.65rem] text-ink-40">{minutes} min read</span>
          )}
        </div>
        <div className="text-lg leading-snug text-ink">{analogy}</div>
      </div>
      <div>
        <span className="kicker mb-2 block text-ink-40">The precise version</span>
        <div className="text-sm leading-relaxed text-ink-70">{precise}</div>
      </div>
    </div>
  );
}
