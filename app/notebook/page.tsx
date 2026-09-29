import type { Metadata } from "next";
import Content from "@/content/wet-lab/notebook.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Notebook",
  description: "Dated log of wet lab, dry lab, design, modeling, and engagement work.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Timeline" },
  { id: "format", label: "Format" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Notebook"
      accent="bio"
      title="Lab & project log"
      lede="Filterable timeline of what we did, saw, and decided - updated as the season progresses."
      current="/notebook"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
