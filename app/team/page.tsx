import type { Metadata } from "next";
import Content from "@/content/team/members.mdx";
import { CopyStatus } from "@/components/site/copy-status";
import { TeamSection } from "@/components/site/member-profile";
import { PageHero } from "@/components/site/page-hero";
import { ReadNext } from "@/components/site/wiki-layout";
import { Container } from "@/components/ui/container";
import { sceneFor } from "@/lib/art";
import { pageLabel } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Members",
  description: "The students and supervisors behind AURA, in their own words.",
};

const ROUTE = "/team";

export default function Page() {
  return (
    <>
      <PageHero
        kicker="Team · Members"
        accent="signal"
        name={pageLabel(ROUTE)}
        title="The people behind AURA"
        lede="Sixteen students and two supervisors, with their roles and a few words from each of them."
        page={ROUTE}
        scene={sceneFor(ROUTE)}
        notice={<CopyStatus route={ROUTE} />}
      />
      <Content components={{ Section: TeamSection }} />
      <Container size="wide" className="pb-16">
        <ReadNext current={ROUTE} />
      </Container>
    </>
  );
}
