import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/site/page-hero";
import { TeamRoster } from "@/components/site/team-roster";
import { ReadNext } from "@/components/site/wiki-layout";
import { Callout } from "@/components/ui/callout";

export const metadata: Metadata = {
  title: "Members",
  description: "The students behind AURA - wet lab, dry lab, human practices, and design.",
};

export default function Page() {
  return (
    <>
      <PageHero
        kicker="Team · Members"
        name="Members"
        title="The people behind AURA"
        lede="A student team spanning the bench, the model, the device, the farm conversations, and this wiki."
        scene="team"
      />

      <Container size="wide" className="pb-20 pt-4">
        <p className="booklet-here" aria-hidden>
          this page · members
        </p>
        <TeamRoster />

        <section className="mt-20 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-cream/50 px-6 py-8 sm:px-8">
            <p className="kicker text-pink-deep">Advisors</p>
            <h2 className="mt-2 font-display text-2xl text-ink">The people who steered us</h2>
            <p className="mt-3 leading-relaxed text-ink-70 text-pretty">
              Faculty advisors, lab supervisors, and industry mentors shaped biosafety, experimental
              design, and how we talk about the project. They are credited on{" "}
              <Link href="/attributions" className="text-pink-deep underline decoration-pink/30 underline-offset-4 hover:decoration-pink">
                Attributions
              </Link>
              .
            </p>
          </div>
          <Callout variant="note" title="Get in touch" className="h-full">
            For collaboration, parts requests, or press: contact the team through your
            institution&apos;s iGEM channel or the email listed on the official team page at wiki
            freeze.
          </Callout>
        </section>

        <ReadNext current="/team" />
      </Container>
    </>
  );
}
