import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { CopyStatus } from "@/components/site/copy-status";
import { TeamRoster } from "@/components/site/team-roster";
import { WikiLayout, WikiSection } from "@/components/site/wiki-layout";
import { Callout } from "@/components/ui/callout";

export const metadata: Metadata = {
  title: "Members",
  description: "The students behind AURA - wet lab, dry lab, human practices, and design.",
};

const TOC = [
  { id: "members", label: "Members" },
  { id: "advisors", label: "Advisors" },
];

export default function Page() {
  return (
    <>
      <PageHero
        kicker="Team · Members"
        name="Members"
        title="The people behind AURA"
        lede="A student team spanning the bench, the model, the device, the farm conversations, and this wiki."
        page="/team"
        scene="team"
        notice={<CopyStatus route="/team" />}
      />

      <WikiLayout toc={TOC} current="/team">
        <WikiSection id="members" title="Members" kicker="01">
          <TeamRoster />
        </WikiSection>

        <WikiSection id="advisors" title="The people who steered us" kicker="02">
          <p>
            Faculty advisors, lab supervisors, and industry mentors shaped biosafety, experimental
            design, and how we talk about the project. They are credited on{" "}
            <Link href="/attributions" className="text-pink-deep underline decoration-pink/30 underline-offset-4 hover:decoration-pink">
              Attributions
            </Link>
            .
          </p>
          <Callout variant="note" title="Get in touch">
            For collaboration, parts requests, or press: contact the team through your
            institution&apos;s iGEM channel or the email listed on the official team page at wiki
            freeze.
          </Callout>
        </WikiSection>
      </WikiLayout>
    </>
  );
}
