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
  return (
    <section id={id} className={cn("scroll-mt-28 py-10 first:pt-0", className)}>
      {kicker && <p className="kicker mb-2 text-pink-deep">{kicker}</p>}
      {title && <h2 className="mb-5 font-display text-pink-deep display-2">{title}</h2>}
      <div className="space-y-4 text-ink-70 leading-relaxed [&_p]:text-pretty">{children}</div>
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
          "mx-auto select-none rounded-xl",
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
    <div className="mt-12 grid gap-4 sm:grid-cols-2">
      {prev && prev.href !== "/" ? (
        <Link
          href={prev.href}
          className="group rounded-2xl border border-ink/10 bg-milk p-5 transition-all hover:-translate-y-0.5 hover:border-pink/40 hover:shadow-lg hover:shadow-pink/10"
        >
          <span className="kicker flex items-center gap-1.5 text-ink-40">
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </span>
          <span className="mt-1.5 block font-display text-xl text-ink group-hover:text-pink-deep">
            {prev.label}
          </span>
          {pageDesc(prev.href) && (
            <span className="mt-1 block text-sm text-ink-55">{pageDesc(prev.href)}</span>
          )}
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
      {next && (
        <Link
          href={next.href}
          className="group relative overflow-hidden rounded-2xl border border-pink/25 bg-pink/5 p-5 transition-all hover:-translate-y-0.5 hover:border-pink/50 hover:shadow-lg hover:shadow-pink/15"
        >
          <span className="kicker flex items-center gap-1.5 text-pink-deep/70">
            Read next <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1.5 block font-display text-xl text-ink group-hover:text-pink-deep">
            {next.label}
          </span>
          {pageDesc(next.href) && (
            <span className="mt-1 block max-w-[75%] text-sm text-ink-55">{pageDesc(next.href)}</span>
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
            className={cn(
              "article-paper relative rounded-2xl bg-cream px-7 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16",
              "shadow-[0_4px_24px_-8px_color-mix(in_srgb,var(--color-ink)_18%,transparent)]",
              "[&_h2]:font-display [&_h2]:text-pink-deep",
            )}
          >
            {children}
          </div>
          <ReadNext current={current} />
        </div>
      </div>
    </Container>
  );
}
