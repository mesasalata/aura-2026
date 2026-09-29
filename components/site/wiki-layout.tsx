import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageToc, type TocItem } from "./page-toc";
import { ALL_PAGES, pageDesc, pageLabel } from "@/lib/nav";
import type { ArtScene } from "@/lib/art";
import { asset, cn } from "@/lib/utils";
import { SOFT_ID } from "@/components/viz/sketch";
import { PaperCorner } from "@/components/viz/doodads";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "@/app/doodad-article.css";

/** 01-indexed folio for article routes (home is not a booklet page). */
export function pageFolio(href: string): string | null {
  const pages = ALL_PAGES.filter((p) => p.href !== "/");
  const i = pages.findIndex((p) => p.href === href);
  return i >= 0 ? String(i + 1).padStart(2, "0") : null;
}

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
      {kicker && (
        <p className="booklet-chapter">
          <span className="booklet-pip">{kicker}</span>
        </p>
      )}
      {title && <h2 className="mb-5 font-display text-pink-deep display-2">{title}</h2>}
      <div className="space-y-4 text-ink-70 leading-relaxed [&_p]:text-pretty">{children}</div>
    </section>
  );
}

/** Centered figure with a numbered caption - the winner-wiki figure pattern. */
export function WikiFigure({
  src,
  alt,
  n,
  caption,
  width = "md",
  className,
}: {
  src: string;
  alt: string;
  n?: number;
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
        alt={alt}
        draggable={false}
        className={cn(
          "mx-auto select-none rounded-xl",
          width === "sm" && "w-2/5 min-w-52",
          width === "md" && "w-3/5 min-w-64",
          width === "lg" && "w-4/5",
        )}
      />
      <figcaption className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-55">
        {n !== undefined && <span className="booklet-fig">Fig. {n}</span>}
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
          className="booklet-next group rounded-[1.15rem_1.4rem_1.1rem_1.25rem] border border-ink/15 p-5"
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
          className="booklet-next group rounded-[1.25rem_1.1rem_1.4rem_1.15rem] border border-pink/30 p-5"
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

function BinderColumn() {
  return (
    <div className="booklet-binder" aria-hidden>
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="booklet-hole" />
      ))}
    </div>
  );
}

function NotebookRule() {
  return (
    <svg className="booklet-rule" viewBox="0 0 8 400" preserveAspectRatio="none" aria-hidden>
      <path
        d="M 4.2 6 C 5.4 70, 2.8 140, 4.6 210 C 5.8 270, 2.6 330, 4 394"
        filter={`url(#${SOFT_ID})`}
      />
    </svg>
  );
}

function DogEar({ folio }: { folio: string | null }) {
  return (
    <div className="booklet-ear" aria-hidden>
      <PaperCorner />
      {folio && <span className="booklet-folio">p. {folio}</span>}
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
  const folio = pageFolio(current);
  const here = pageLabel(current);

  return (
    <Container size="wide" className="relative overflow-visible pb-16 pt-2">
      <div className="booklet-spread grid gap-8 lg:grid-cols-[200px_28px_minmax(0,1fr)] lg:gap-0 xl:grid-cols-[220px_32px_minmax(0,1fr)]">
        <PageToc items={toc} here={here} />
        <BinderColumn />
        <div className="relative min-w-0 lg:pl-5">
          <div
            className={cn(
              "article-paper booklet-paper relative rounded-2xl bg-[#fffdf2] pt-10 pr-7 pb-20 pl-11 sm:pt-14 sm:pr-12 sm:pb-24 sm:pl-16 lg:pt-16 lg:pr-16 lg:pb-28 lg:pl-[4.4rem]",
              "shadow-[0_4px_24px_-8px_rgba(7,5,16,0.14)]",
              "[&_h2]:font-display [&_h2]:text-pink-deep",
            )}
          >
            <NotebookRule />
            <DogEar folio={folio} />
            <div className="booklet-page-body">{children}</div>
          </div>
          <ReadNext current={current} />
        </div>
      </div>
    </Container>
  );
}
