import Link from "next/link";
import { NAV } from "@/lib/nav";
import { Container } from "@/components/ui/container";
import { PailMark } from "@/components/viz/marks";

export function SiteFooter() {
  return (
    <footer className="section-dark relative">
      <Container size="wide" className="relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="font-display text-3xl font-semibold text-milk">AURA.</span>
            </Link>
            <p className="mt-4 max-w-sm font-display text-xl leading-snug text-milk/80">
              Milk is quiet. Infection is not.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-milk/70">
              A student-led iGEM 2026 project: an inline FET biosensor for bta-miR-223 in milk,
              built to flag subclinical bacterial mastitis. A note to the farmer - not a
              replacement for veterinary diagnosis.
            </p>
            <Link href="/" className="footer-pail-home" aria-label="Back to home">
              <PailMark className="h-9 w-9" fill={0.85} />
            </Link>
            <p className="footer-student-stamp">built by students</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {NAV.map((group) => (
              <div key={group.label}>
                <p className="kicker text-sm text-milk/70">
                  {group.label}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-milk/70 transition-colors hover:text-signal"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-milk/10 pt-6 text-xs text-milk/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AURA · iGEM 2026</p>
          <p className="kicker">
            Content on this wiki reflects a proof-of-concept in progress. Pending data is marked as such.
          </p>
        </div>
      </Container>
    </footer>
  );
}
