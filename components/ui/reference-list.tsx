import type { Reference } from "@/lib/content";

/** ReferenceList - clean numbered citations. */
export function ReferenceList({ references }: { references: Reference[] }) {
  return (
    <ol className="space-y-4">
      {references.map((ref) => (
        <li key={ref.id} id={`ref-${ref.id}`} className="flex gap-4 scroll-mt-24">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/5 font-mono text-xs text-ink-70">
            {ref.id}
          </span>
          <p className="text-sm leading-relaxed text-ink-70">
            <span className="text-ink">{ref.authors}</span> ({ref.year}).{" "}
            <span className="italic">{ref.title}</span> {ref.source}
          </p>
        </li>
      ))}
    </ol>
  );
}
