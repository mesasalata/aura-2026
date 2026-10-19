import { cn } from "@/lib/utils";
import { Info, TriangleAlert, FlaskConical, ShieldCheck } from "lucide-react";

const styles = {
  note: { icon: Info, ring: "bg-signal/20", accent: "text-signal-deep" },
  warn: { icon: TriangleAlert, ring: "bg-butter/45", accent: "text-[#9a4a12]" },
  lab: { icon: FlaskConical, ring: "bg-bio/20", accent: "text-[#1c7a55]" },
  safety: { icon: ShieldCheck, ring: "bg-pink-soft/35", accent: "text-coral-deep" },
} as const;

export function Callout({
  variant = "note",
  title,
  children,
  className,
}: {
  variant?: keyof typeof styles;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const s = styles[variant];
  const Icon = s.icon;
  return (
    <div className={cn("hand p-5", s.ring, className)}>
      <div className="flex gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", s.accent)} strokeWidth={2.5} aria-hidden />
        <div className="space-y-1.5">
          {title && <p className="font-display text-lg leading-snug text-ink">{title}</p>}
          <div className="text-sm leading-relaxed text-ink/80 [&_p]:mb-2 [&_p:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Explicit "data pending" placeholder box, per the brief. */
export function Placeholder({ label }: { label: string }) {
  return (
    <div className="hand flex min-h-32 items-center justify-center border-dashed bg-milk p-6 text-center">
      <div className="space-y-2">
        <p className="chip-pop kicker">Placeholder</p>
        <p className="text-sm text-ink-55">{label}</p>
      </div>
    </div>
  );
}
