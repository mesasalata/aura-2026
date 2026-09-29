import type { Metadata } from "next";
import Content from "@/content/dry-lab/hardware.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Hardware",
  description: "Inline siphon, FET gate with DNA catapult, and reference electrodes upstream of the chamber.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "siphon", label: "Siphon" },
  { id: "fet", label: "FET" },
  { id: "electrodes", label: "Electrodes" },
  { id: "integration", label: "Parlour" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Dry Lab · Hardware"
      accent="butter"
      title="Siphon, FET & electrodes"
      lede="Hardware meant to live in the milking machine - a siphoned chamber, a transistor, and a baseline from the milk itself."
      current="/hardware"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
