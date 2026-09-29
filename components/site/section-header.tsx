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
  pip,
}: {
  kicker?: string;
  title: React.ReactNode;
  lede?: string;
  accent?: Accent;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  /** Optional hand-numbered pip - unused on the homepage. */
  pip?: string;
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
        <p
          className="kicker mb-3 flex items-center gap-2"
          style={{ color: ACCENT_HEX[accent] }}
        >
          {pip ? (
            <span className="booklet-pip" style={{ color: ACCENT_HEX[accent] }}>
              {pip}
            </span>
          ) : (
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT_HEX[accent] }}
            />
          )}
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
