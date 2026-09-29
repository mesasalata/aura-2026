import { PageHero } from "@/components/site/page-hero";
import { WikiLayout } from "@/components/site/wiki-layout";
import type { TocItem } from "@/components/site/page-toc";
import type { Accent } from "@/components/ui/badge";
import { sceneFor } from "@/lib/art";
import { pageLabel } from "@/lib/nav";

/** Wraps project pages with the illustrated banner + article shell. */
export function WikiMdxShell({
  kicker,
  title,
  lede,
  accent = "signal",
  current,
  toc,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  lede?: string;
  accent?: Accent;
  current: string;
  toc: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero
        kicker={kicker}
        accent={accent}
        name={pageLabel(current)}
        title={title}
        lede={lede}
        scene={sceneFor(current)}
      />
      <WikiLayout toc={toc} current={current} scene={sceneFor(current)}>
        <div className="space-y-4 [&>section]:scroll-mt-28">{children}</div>
      </WikiLayout>
    </>
  );
}
