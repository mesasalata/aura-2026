import type { Metadata } from "next";
import Content from "@/content/team/references.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "References",
  description: "Published sources and stakeholder consultations cited across the AURA wiki.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "literature", label: "Literature" },
  { id: "consultations", label: "Consultations" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Team · References"
      accent="ink"
      title="Sources"
      lede="Every published source and stakeholder consultation cited on the AURA wiki, in one list."
      current="/references"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
