import type { Metadata } from "next";
import Content from "@/content/project/background.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Background",
  description:
    "To understand how AURA could help detect mastitis earlier, we first needed to understand what happens inside a cow's udder when an infection develops.",
};

const TOC = [
  { id: "udder", label: "The Udder as a System" },
  { id: "causes", label: "What Causes Mastitis?" },
  { id: "scc", label: "Understanding Somatic Cell Count" },
  { id: "biomarkers", label: "Biomarkers: Signals of Inflammation" },
  { id: "economics", label: "The Economic Impact of Mastitis" },
];

export default function BackgroundPage() {
  return (
    <WikiMdxShell
      kicker="Project · Background"
      accent="butter"
      title="The Biology Behind the Problem"
      lede="To understand how AURA could help detect mastitis earlier, we first needed to understand what happens inside a cow's udder when an infection develops. By looking at how mastitis starts, how the immune system responds, and which biological signals change during infection, we could better understand what our biosensor should aim to detect."
      current="/background"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
