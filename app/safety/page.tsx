import type { Metadata } from "next";
import Content from "@/content/engagement/safety.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Safety",
  description: "Lab safety training and procedures, AURA's cell-free in vitro design, and responsible use as a screening tool.",
};

const TOC = [
  { id: "team", label: "Team safety" },
  { id: "project", label: "Project safety" },
  { id: "responsible-use", label: "Responsible use" },
  { id: "references", label: "References" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Safety"
      accent="coral"
      title="Safety and security"
      lede="EPFL safety training, standard lab procedures, a cell-free in vitro project, and a sensor meant to prompt investigation rather than decide treatment."
      current="/safety"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
