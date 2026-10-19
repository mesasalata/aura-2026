import type { ReactNode } from "react";

/**
 * Table for MDX pages. The MDX setup has no GFM, so markdown pipe tables do not
 * parse; this renders the same markup and classes as the `table` mapping in
 * mdx-components.tsx.
 */
export function DataTable({
  head,
  rows,
  caption,
}: {
  head: ReactNode[];
  rows: ReactNode[][];
  caption?: string;
}) {
  return (
    <div className="hand not-prose my-4 overflow-x-auto border-ink">
      <table className="w-full text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="border-b-[2.25px] border-ink bg-butter/55">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-extrabold text-ink">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/15">
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => (
                <td key={c} className="px-4 py-3 text-ink/80">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
