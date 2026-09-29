"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

function pip(i: number) {
  return String(i + 1).padStart(2, "0");
}

function TocLinks({
  items,
  active,
}: {
  items: TocItem[];
  active: string | undefined;
}) {
  return (
    <ul className="space-y-0.5">
      {items.map((item, i) => {
        const isActive = active === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "flex items-center gap-2.5 py-1.5 text-sm transition-colors",
                isActive ? "font-medium text-pink-deep" : "text-ink-55 hover:text-ink",
              )}
            >
              <span className={cn("booklet-pip shrink-0", isActive && "is-here")}>{pip(i)}</span>
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Quiet chapter rail - H2s only. Active item is a hand-circled pip. */
export function PageToc({ items, here }: { items: TocItem[]; here?: string }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const label = here ? `this page · ${here.toLowerCase()}` : "on this page";

  return (
    <>
      <nav aria-label="On this page" className="booklet-toc mb-2 lg:hidden">
        <details
          className="group rounded-xl border border-ink/10 bg-milk/80 px-3.5 py-2.5"
          onClick={(e) => {
            if (!(e.target as HTMLElement).closest("a")) return;
            (e.currentTarget as HTMLDetailsElement).open = false;
          }}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
            <span className="font-display">{label}</span>
            <span className="text-ink-40 group-open:hidden" aria-hidden>
              +
            </span>
            <span className="hidden text-ink-40 group-open:inline" aria-hidden>
              –
            </span>
          </summary>
          <div className="mt-2 border-t border-ink/10 pt-1">
            <TocLinks items={items} active={active} />
          </div>
        </details>
      </nav>

      <nav aria-label="On this page" className="booklet-toc sticky top-24 hidden self-start lg:block">
        <p className="booklet-toc-label">{label}</p>
        <TocLinks items={items} active={active} />
      </nav>
    </>
  );
}
