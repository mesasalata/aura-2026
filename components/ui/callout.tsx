import { cn } from "@/lib/utils";
import { Info, TriangleAlert, FlaskConical, ShieldCheck } from "lucide-react";

const styles = {
  note: { icon: Info, ring: "border-signal/30 bg-signal/[0.06]", accent: "text-signal-deep" },
  warn: { icon: TriangleAlert, ring: "border-warn/30 bg-warn/[0.06]", accent: "text-warn" },
  lab: { icon: FlaskConical, ring: "border-bio/30 bg-bio/[0.06]", accent: "text-[#1c7a55]" },
  safety: { icon: ShieldCheck, ring: "border-coral/30 bg-coral/[0.06]", accent: "text-coral-deep" },
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
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", s.accent)} aria-hidden />
        <div className="space-y-1.5">
          {title && <p className={cn("font-semibold", s.accent)}>{title}</p>}
          <div className="text-sm leading-relaxed text-ink-70 [&_p]:mb-2 [&_p:last-child]:mb-0">
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
    <div className="hand flex min-h-32 items-center justify-center border-dashed border-ink/25 bg-ink/[0.02] p-6 text-center">
      <div className="space-y-1">
        <p className="font-mono text-[0.68rem] uppercase tracking-widest text-ink-40">
          Placeholder
        </p>
        <p className="text-sm text-ink-55">{label}</p>
      </div>
    </div>
  );
}
