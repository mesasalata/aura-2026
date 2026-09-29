import type { Metadata } from "next";
import Content from "@/content/wet-lab/measurement.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Measurement",
  description: "Calibration and characterisation methods for fluorescence, colorimetric, and strip readouts.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "fluorescence", label: "Fluorescence" },
  { id: "colorimetric", label: "Colorimetric" },
  { id: "calibration", label: "Calibration" },
  { id: "units", label: "Units" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Wet Lab · Measurement"
      accent="pink"
      title="Calibration & characterisation"
      lede="How we turn raw signals into comparable data - and what we report."
      current="/measurement"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
