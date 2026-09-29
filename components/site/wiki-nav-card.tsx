import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCENT_HEX, type Accent } from "@/components/ui/badge";

export type WikiNavCardProps = {
  href: string;
  label: string;
  desc: string;
  accent: Accent;
  className?: string;
  /** Tighter layout for mega-menu / mobile drawers */
  variant?: "default" | "compact";
  showCta?: boolean;
  onNavigate?: () => void;
};

/** WikiNavCard - solid milk surface, accent bar, pink CTA on hover. */
export function WikiNavCard({
  href,
  label,
  desc,
  accent,
  className,
  variant = "default",
  showCta = true,
  onNavigate,
}: WikiNavCardProps) {
  const hex = ACCENT_HEX[accent];
  const compact = variant === "compact";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] border border-ink/10 bg-milk transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/10",
        compact ? "p-4" : "p-6",
        className,
      )}
    >
      <div className="relative">
        <span
          className={cn(
            "block h-1 rounded-full transition-all duration-300 group-hover:w-14",
            compact ? "w-6" : "w-8",
          )}
          style={{ background: hex }}
          aria-hidden
        />
        <h3
          className={cn(
            "font-display text-ink",
            compact ? "mt-2 text-base font-semibold" : "mt-4 text-2xl",
          )}
        >
          {label}
        </h3>
        <p className={cn("leading-relaxed text-ink-70", compact ? "mt-1 text-xs" : "mt-2 text-sm")}>
          {desc}
        </p>
      </div>
      {showCta && (
        <span
          className={cn(
            "relative inline-flex items-center gap-1 font-medium text-ink transition-colors group-hover:text-pink-deep",
            compact ? "mt-3 text-xs" : "mt-6 text-sm",
          )}
        >
          Open page
          <ArrowUpRight
            className={cn(
              "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
              compact ? "h-3 w-3" : "h-4 w-4",
            )}
          />
        </span>
      )}
    </Link>
  );
}
