import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { PortraitFlip } from "@/components/site/portrait-flip";
import { CREAM, MILK, WaveSeam } from "@/components/site/wave-seam";
import { asset, cn } from "@/lib/utils";

/** One team member as a pinned polaroid: flip portrait, name, roles, and the member's own bio. */
export function MemberProfile({
  name,
  roles,
  illustration,
  photo,
  children,
}: {
  name: string;
  roles?: string;
  illustration?: string;
  photo?: string;
  children?: ReactNode;
}) {
  return (
    <article className="hand mb-8 break-inside-avoid bg-milk p-3 sm:p-3.5">
      {illustration && photo ? (
        <PortraitFlip name={name} illustration={illustration} photo={photo} />
      ) : (
        (illustration || photo) && (
          // eslint-disable-next-line @next/next/no-img-element -- static export + basePath via asset()
          <img
            src={asset((illustration || photo)!)}
            alt={illustration ? `Drawn portrait of ${name}` : `Photo of ${name}`}
            draggable={false}
            loading="lazy"
            className="radius-hand aspect-[4/5] w-full select-none object-cover object-top"
          />
        )
      )}
      <div className="px-1.5 pb-2 pt-4">
        <h3 className="font-display text-2xl leading-tight text-ink">{name}</h3>
        {roles && <p className="mt-1.5 text-[0.82rem] font-extrabold leading-snug text-ink-70">{roles}</p>}
        {children && (
          <div className="mt-3 space-y-2 border-t-2 border-dashed border-ink/15 pt-3 text-sm leading-relaxed [&_p]:text-ink-70">
            {children}
          </div>
        )}
      </div>
    </article>
  );
}

/** Masonry wall of MemberProfile polaroids. Each card sits at its own slight tilt. */
export function MemberGrid({ children }: { children: ReactNode }) {
  return <div className="team-wall columns-1 gap-7 sm:columns-2 lg:columns-3 xl:columns-4">{children}</div>;
}

/** Full-bleed band for the team page, replacing the article `WikiSection`. */
export function TeamSection({
  id,
  title,
  kicker,
  hint,
  tone = "milk",
  children,
}: {
  id: string;
  title: string;
  kicker?: string;
  hint?: string;
  tone?: "milk" | "cream";
  children: ReactNode;
}) {
  const numbered = kicker && /^\d+$/.test(kicker.trim());
  return (
    <section id={id} className={cn("scroll-mt-24", tone === "cream" && "bg-cream")}>
      {tone === "cream" && <WaveSeam from={MILK} to={CREAM} />}
      <Container size="wide" className={cn("pb-12", tone === "cream" ? "pt-8" : "pt-6")}>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <div className="flex items-center gap-4">
              {numbered && (
                <span className="num-pop" aria-hidden>
                  {Number(kicker)}
                </span>
              )}
              <h2 className="font-display text-ink display-1">{title}</h2>
            </div>
            <span className="rule-pop" aria-hidden />
          </div>
          {hint && <p className="chip-pop kicker rotate-[1.5deg]">{hint}</p>}
        </div>
        <div className="[&>p]:mt-2 [&>p]:max-w-2xl">{children}</div>
      </Container>
      {tone === "cream" && <WaveSeam from={CREAM} to={MILK} />}
    </section>
  );
}
