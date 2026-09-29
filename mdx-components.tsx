import type { MDXComponents } from "mdx/types";
import { WikiSection } from "@/components/site/wiki-layout";
import { Callout, Placeholder } from "@/components/ui/callout";
import { ScienceExplainer } from "@/components/ui/science-explainer";
import { BiosensorDiagram } from "@/components/viz/biosensor-diagram";
import { DbtlWheel } from "@/components/viz/dbtl-wheel";
import { FarmToLabPipeline } from "@/components/viz/farm-to-lab";
import { ReferenceList } from "@/components/ui/reference-list";
import { REFERENCES } from "@/lib/content";
import {
  GlossaryGrid,
  NotebookBlock,
  SafetyBlock,
  StakeholderMapBlock,
  StripDemo,
  TeamGrid,
} from "@/components/mdx/blocks";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mb-5 font-display text-pink-deep display-2">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 font-display text-xl text-ink">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="text-ink-70 leading-relaxed text-pretty">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc space-y-2 pl-5 text-ink-70">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-5 text-ink-70">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    table: ({ children }) => (
      <div className="not-prose my-4 overflow-x-auto rounded-2xl border border-ink/10">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="border-b border-ink/10 bg-cream/40">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-ink/10">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-4 py-3 font-medium text-ink">{children}</th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-3 text-ink-70">{children}</td>
    ),
    strong: ({ children }) => <strong className="font-medium text-ink">{children}</strong>,
    em: ({ children }) => <em className="text-ink">{children}</em>,
    Section: WikiSection,
    Callout,
    Placeholder,
    ScienceExplainer,
    BiosensorDiagram,
    DbtlWheel,
    FarmToLabPipeline,
    ReferenceList,
    References: () => <ReferenceList references={REFERENCES} />,
    StakeholderMap: StakeholderMapBlock,
    NotebookTimeline: NotebookBlock,
    TeamGrid,
    GlossaryGrid,
    SafetyBlock,
    StripDemo,
    ...components,
  };
}
