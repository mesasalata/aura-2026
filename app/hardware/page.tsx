import type { Metadata } from "next";
import Content from "@/content/dry-lab/hardware.mdx";
import { WikiMdxShell } from "@/components/site/wiki-mdx-shell";

export const metadata: Metadata = {
  title: "Hardware",
  description:
    "A molecular biosensing system needs more than a recognition probe.",
};

const TOC = [
  { id: "motivation", label: "Motivation" },
  { id: "overview", label: "System Overview" },
  { id: "sampling", label: "Sampling Module" },
  { id: "sensing", label: "Sensing Module" },
  { id: "app", label: "Hardware–App Communication" },
  { id: "operation", label: "Operating Principle" },
];

export default function Page() {
  return (
    <WikiMdxShell
      kicker="Dry Lab · Hardware"
      accent="butter"
      title="Motivation"
      lede="A molecular biosensing system needs more than a recognition probe. It also needs a way to bring a sample into contact with the sensing interface, acquire the resulting signal, and deliver data to the user."
      current="/hardware"
      toc={TOC}
    >
      <Content />
    </WikiMdxShell>
  );
}
