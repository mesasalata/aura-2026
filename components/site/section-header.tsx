import { cn } from "@/lib/utils";
import type { Accent } from "@/components/ui/badge";
import { ACCENT_HEX } from "@/components/ui/badge";

/** SectionHeader - a kicker + heading pattern used across pages and the homepage. */
export function SectionHeader({
  kicker,
  title,
  lede,
  accent = "signal",
  align = "left",
  onDark = false,
  className,
}: {
  kicker?: string;
  title: React.ReactNode;
  lede?: string;
  accent?: Accent;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto text-center",
        align === "center" ? "max-w-3xl" : "max-w-4xl",
        className,
      )}
    >
      {kicker && (
        <p className="chip-pop kicker mb-4" style={{ background: ACCENT_HEX[accent] }}>
          {kicker}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-balance display-2",
          onDark ? "text-milk" : "text-ink",
        )}
      >
        {title}
      </h2>
      <span className={cn("rule-pop", align === "center" && "mx-auto")} style={{ background: ACCENT_HEX[accent] }} aria-hidden />
      {lede && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-pretty",
            onDark ? "text-milk/70" : "text-ink-70",
          )}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
