import type { Metadata } from "next";
import Content from "@/content/engagement/education.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Education",
  description:
    "Making synthetic biology understandable, interactive, and accessible: a weekly club, workshops, community talks, a website, a card game, and written science communication.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "approach", label: "Our approach" },
  { id: "website", label: "Website" },
  { id: "game", label: "Card game" },
  { id: "rolle", label: "Rolle outreach" },
  { id: "club", label: "SynBio Club" },
  { id: "isl", label: "ISL workshop" },
  { id: "juniors", label: "Junior workshop" },
  { id: "bookfete", label: "Bookfête" },
  { id: "reatch", label: "Reatch" },
  { id: "other", label: "Outreach & fundraising" },
  { id: "learned", label: "What we learned" },
]

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Engagement · Education"
      accent="butter"
      title="Making synthetic biology understandable, interactive, and accessible"
      lede="A weekly club, workshops, community talks, an educational website, a card game, and written science communication, each adapted to its audience."
      current="/education"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
