import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChecklistItem = { text: string; done?: boolean };

/** SafetyChecklist - a card of confirmed safety commitments. */
export function SafetyChecklist({
  title,
  items,
  className,
}: {
  title: string;
  items: ChecklistItem[];
  className?: string;
}) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-ink/10 bg-milk/60 p-6", className)}>
      <h3 className="font-display text-xl text-ink">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm">
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                item.done === false ? "border border-dashed border-ink/25 text-ink-40" : "bg-bio/20 text-[#1c7a55]",
              )}
            >
              {item.done === false ? "·" : <Check className="h-3 w-3" />}
            </span>
            <span className={cn("leading-relaxed", item.done === false ? "text-ink-55" : "text-ink-70")}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
