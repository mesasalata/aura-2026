import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageToc, type TocItem } from "./page-toc";
import { ALL_PAGES, pageDesc } from "@/lib/nav";
import type { ArtScene } from "@/lib/art";
import { asset, cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

/** Section block that also serves as a TOC scroll target. */
export function WikiSection({
  id,
  title,
  kicker,
  children,
  className,
}: {
  id: string;
  title?: string;
  kicker?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const numbered = kicker && /^\d+$/.test(kicker.trim());
  return (
    <section id={id} className={cn("scroll-mt-28 py-10 first:pt-0", className)}>
      {kicker && !numbered && <p className="chip-pop kicker mb-4">{kicker}</p>}
      {title && (
        <div className="mb-6">
          <div className="flex items-center gap-4">
            {numbered && (
              <span className="num-pop" aria-hidden>
                {Number(kicker)}
              </span>
            )}
            <h2 className="font-display text-ink display-2">{title}</h2>
          </div>
          <span className="rule-pop" aria-hidden />
        </div>
      )}
      <div className="space-y-4 text-ink/80 leading-relaxed [&_p]:text-pretty">{children}</div>
    </section>
  );
}

/** Centered figure. The caption is also the image alt. See DESIGN.md. */
export function WikiFigure({
  src,
  caption,
  width = "md",
  className,
}: {
  src: string;
  /** Visible caption and alt text. Same sentence. */
  caption: string;
  /** sm ≈ 40%, md ≈ 60%, lg ≈ 80% of the column. */
  width?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <figure className={cn("my-8 text-center", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src.startsWith("http") ? src : asset(src)}
        alt={caption}
        draggable={false}
        className={cn(
          "radius-hand mx-auto select-none",
          width === "sm" && "w-2/5 min-w-52",
          width === "md" && "w-3/5 min-w-64",
          width === "lg" && "w-4/5",
        )}
      />
      <figcaption className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-55">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Read-next cards at the end of an article. */
export function ReadNext({ current }: { current: string }) {
  const idx = ALL_PAGES.findIndex((p) => p.href === current);
  const prev = idx > 0 ? ALL_PAGES[idx - 1] : null;
  const next = idx >= 0 && idx < ALL_PAGES.length - 1 ? ALL_PAGES[idx + 1] : null;
  if (!prev && !next) return null;

  return (
    <div className="mt-14 grid gap-5 sm:grid-cols-2">
      {prev && prev.href !== "/" ? (
        <Link href={prev.href} className="hand press group bg-milk p-5 hover:bg-butter/40">
          <span className="kicker flex items-center gap-1.5 text-ink/70">
            <ArrowLeft className="h-4 w-4" strokeWidth={2.75} /> Previous
          </span>
          <span className="mt-1.5 block font-display text-2xl text-ink">{prev.label}</span>
          {pageDesc(prev.href) && (
            <span className="mt-1 block text-sm text-ink/70">{pageDesc(prev.href)}</span>
          )}
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next && (
        <Link href={next.href} className="hand press group relative bg-pink p-5 hover:bg-pink-soft">
          <span className="kicker flex items-center gap-1.5 text-ink">
            Read next <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.75} />
          </span>
          <span className="mt-1.5 block font-display text-2xl text-milk pop-text-sm [--pop:var(--color-ink)]">
            {next.label}
          </span>
          {pageDesc(next.href) && (
            <span className="mt-1 block max-w-[75%] text-sm font-medium text-ink">{pageDesc(next.href)}</span>
          )}
        </Link>
      )}
    </div>
  );
}

/** Article shell: left chapter rail + one cream paper card + read-next. */
export function WikiLayout({
  toc,
  current,
  children,
}: {
  toc: TocItem[];
  current: string;
  /** Kept for call-site compatibility; the article shell no longer places characters. */
  scene?: ArtScene;
  children: React.ReactNode;
}) {
  return (
    <Container size="wide" className="relative overflow-visible pb-16 pt-2">
      <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
        <PageToc items={toc} />
        <div className="relative min-w-0">
          <div
            className="article-paper relative px-7 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16"
          >
            {children}
          </div>
          <ReadNext current={current} />
        </div>
      </div>
    </Container>
  );
}
