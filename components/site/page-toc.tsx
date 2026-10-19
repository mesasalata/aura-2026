"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; label: string };

/** Chapter rail - H2s only, on a solid pink tab. Active item gets the butter dot and a heavy underline. */
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
      <div className="hand bg-pink-deep px-4 py-5">
        <p className="mb-3 px-1 font-display text-lg text-butter">On this page</p>
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "group flex items-start gap-2.5 rounded-lg px-1 py-1.5 text-sm font-bold leading-snug transition-colors",
                    isActive ? "text-milk" : "text-milk/75 hover:text-milk",
                  )}
                >
                  <span
                    className={cn(
                      "mt-[0.3rem] h-2.5 w-2.5 shrink-0 rounded-full border-2 border-ink transition-[background-color,scale] duration-300",
                      isActive ? "scale-125 bg-butter" : "bg-milk group-hover:bg-pink-soft",
                    )}
                  />
                  <span
                    className={cn(
                      "underline decoration-[3px] underline-offset-4 transition-[text-decoration-color]",
                      isActive ? "decoration-butter" : "decoration-transparent group-hover:decoration-milk/40",
                    )}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
