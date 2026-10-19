import type { Metadata } from "next";
import Description from "@/content/project/description.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Description",
  description:
    "AURA is a proposed inline FET biosensor for bta-miR-223 in milk, built to give earlier warning of subclinical mastitis.",
};

const TOC = [
  { id: "overview", label: "What AURA is" },
  { id: "mirna", label: "Detecting miR-223" },
  { id: "fet", label: "Recognition to signal" },
  { id: "farmer", label: "Sensor to farmer" },
  { id: "milking", label: "In the milking line" },
  { id: "progress", label: "Our progress" },
]

export default function DescriptionPage() {
  return (
    <WikiMdxShell
      kicker="Project · Description"
      accent="signal"
      title="An inline FET that listens for miR-223"
      lede="An easy-to-use diagnostic system for subclinical mastitis: a proposed field-effect transistor biosensor in the milking line that detects changes in bta-miR-223."
      current="/description"
      toc={TOC}
    >
      <Description />
    </WikiMdxShell>
  );
}
