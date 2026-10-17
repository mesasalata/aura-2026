"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/** Quiet chapter rail - H2s only. Active item is a pink pill. */
export function PageToc({ items }: { items: TocItem[] }) {
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

  return (
    <nav aria-label="On this page" className="sticky top-24 hidden self-start lg:block">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  "flex items-center gap-3 py-1.5 text-sm transition-colors",
                  isActive ? "font-medium text-pink-deep" : "text-ink-55 hover:text-ink",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 rounded-full transition-all duration-300",
                    isActive ? "h-2 w-6 bg-pink" : "h-2 w-2 bg-ink/20",
                  )}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
