import type { Accent } from "@/components/ui/badge";

export type NavLink = {
  label: string;
  href: string;
  desc: string;
  accent: Accent;
};

export type NavGroup = {
  label: string;
  intro?: string;
  links: NavLink[];
};

/**
 * Primary iGEM navigation, grouped for the mega-menu.
 * Order and grouping follow the AURA information architecture.
 */
export const NAV: NavGroup[] = [
  {
    label: "Project",
    intro: "The problem, the science, and what AURA is designed to do.",
    links: [
      { label: "Description", href: "/description", desc: "Abstract, inspiration & approach", accent: "signal" },
      { label: "Background", href: "/background", desc: "Mastitis, the udder & the biology", accent: "coral" },
      { label: "Engineering", href: "/engineering", desc: "Design–Build–Test–Learn cycles", accent: "butter" },
      { label: "Results", href: "/results", desc: "What we found (and what's pending)", accent: "bio" },
      { label: "Contribution", href: "/contribution", desc: "What we leave for future teams", accent: "pink" },
    ],
  },
  {
    label: "Wet Lab",
    intro: "Bench work: constructs, assays, parts and the daily record.",
    links: [
      { label: "Experiments", href: "/experiments", desc: "Experimental plan & rationale", accent: "bio" },
      { label: "Protocols", href: "/protocols", desc: "Reproducible bench methods", accent: "signal" },
      { label: "Parts", href: "/parts", desc: "BioBricks & basic/composite parts", accent: "butter" },
      { label: "Measurement", href: "/measurement", desc: "Calibration & characterisation", accent: "pink" },
      { label: "Notebook", href: "/notebook", desc: "Dated lab & project log", accent: "bio" },
    ],
  },
  {
    label: "Dry Lab",
    intro: "Modeling, the physical device, and supporting software.",
    links: [
      { label: "Model", href: "/model", desc: "Kinetics, sensitivity & thresholds", accent: "signal" },
      { label: "Hardware", href: "/hardware", desc: "The AURA reader & diagnostic strip", accent: "butter" },
      { label: "Software", href: "/software", desc: "Readout & analysis tooling", accent: "pink" },
    ],
  },
  {
    label: "Engagement",
    intro: "The people AURA is built with - and how we stayed responsible.",
    links: [
      { label: "Human Practices", href: "/human-practices", desc: "Stakeholders & how they shaped us", accent: "pink" },
      { label: "Integrated HP", href: "/integrated-human-practices", desc: "Feedback woven into design", accent: "coral" },
      { label: "Education", href: "/education", desc: "SynBio, explained without prereqs", accent: "butter" },
      { label: "Sustainability", href: "/sustainability", desc: "Welfare, environment & the SDGs", accent: "bio" },
      { label: "Safety", href: "/safety", desc: "Containment & responsible use", accent: "coral" },
    ],
  },
  {
    label: "Team",
    intro: "Who we are and who helped.",
    links: [
      { label: "Members", href: "/team", desc: "The students behind AURA", accent: "signal" },
      { label: "Attributions", href: "/attributions", desc: "Who did what, and thanks", accent: "pink" },
      { label: "References", href: "/references", desc: "Sources & further reading", accent: "ink" },
    ],
  },
];

/** Flat list of every routable page, in reading order, for prev/next + sitemap. */
export const ALL_PAGES: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  ...NAV.flatMap((g) => g.links.map(({ label, href }) => ({ label, href }))),
];

/** Short description for a page, pulled from the nav metadata. */
export function pageDesc(href: string): string | undefined {
  for (const g of NAV) for (const l of g.links) if (l.href === href) return l.desc;
  return undefined;
}

/** Nav label for a page - the short banner word. */
export function pageLabel(href: string): string | undefined {
  for (const g of NAV) for (const l of g.links) if (l.href === href) return l.label;
  return undefined;
}

