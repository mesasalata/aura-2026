/* Shared, reusable content for AURA. Boilerplate copy lives here so pages stay consistent. */

export type Stat = {
  value: string;
  prefix?: string;
  suffix?: string;
  to: number;
  decimals?: number;
  label: string;
  sub: string;
  accent: "pink" | "signal" | "butter" | "coral" | "bio";
};

export const IMPACT_STATS: Stat[] = [
  {
    value: "€30B",
    prefix: "€",
    suffix: "B",
    to: 30,
    label: "Annual industry losses",
    sub: "Estimated global economic burden of mastitis on the dairy sector each year.",
    accent: "coral",
  },
  {
    value: "1 in 3",
    to: 3,
    label: "Cows affected",
    sub: "Roughly one-third of dairy cows experience mastitis over a given period.",
    accent: "pink",
  },
  {
    value: "47–65%",
    suffix: "%",
    to: 65,
    label: "Annual infection rate",
    sub: "Reported herd-level incidence ranges widely across systems and regions.",
    accent: "butter",
  },
  {
    value: "<15%",
    prefix: "<",
    suffix: "%",
    to: 15,
    label: "From treatment alone",
    sub: "Direct treatment is a small slice of the total cost - most losses are hidden.",
    accent: "signal",
  },
];

export type GlossaryTerm = {
  term: string;
  short: string;
  long: string;
  accent: "pink" | "signal" | "butter" | "coral" | "bio";
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "miR-223",
    short: "The molecule in the pail",
    long: "bta-miR-223 is a cow microRNA used to control bacterial inflammation. In subclinical mastitis it shows up in milk before the udder looks wrong - AURA’s target.",
    accent: "pink",
  },
  {
    term: "FET",
    short: "A transistor that tastes charge",
    long: "A field-effect transistor. When the DNA catapult opens, the local electrical field at the gate changes, and current between source and drain ticks.",
    accent: "signal",
  },
  {
    term: "DNA catapult",
    short: "A hinge that opens on miRNA",
    long: "A DNA fold on the FET surface with an invasion region complementary to miR-223. Binding opens the stem and moves charge away from the gate.",
    accent: "butter",
  },
  {
    term: "Reference electrode",
    short: "The sample’s own baseline",
    long: "Electrodes upstream of the chamber that read ionic concentration and electrochemical activity, so salty milk is less likely to raise a false flag.",
    accent: "bio",
  },
  {
    term: "Biomarker",
    short: "A biological tell",
    long: "A measurable molecule whose presence or level signals a biological state - here, miR-223 as a sign of bacterial subclinical mastitis.",
    accent: "coral",
  },
  {
    term: "Biosensor",
    short: "Recognition → readout",
    long: "An engineered system that recognises a specific molecule and converts that recognition into a signal a person can act on - here, FET current and a cow-level flag.",
    accent: "signal",
  },
];

export type Stakeholder = {
  id: string;
  role: string;
  emoji?: string;
  heard: string;
  changed: string;
  concern: string;
  accent: "pink" | "signal" | "butter" | "coral" | "bio";
};

export const STAKEHOLDERS: Stakeholder[] = [
  {
    id: "farmer",
    role: "Dairy farmers",
    heard: "A test is only useful if it fits the milking routine and costs less than the loss it prevents. Trust is earned herd by herd.",
    changed: "We put AURA in the milking line as an inline siphon - not another lab errand - and made the output a quiet flag, not a diagnosis.",
    concern: "False positives that pull healthy cows from the tank; who pays for the consumable.",
    accent: "butter",
  },
  {
    id: "vet",
    role: "Veterinarians",
    heard: "Early signal is valuable, but a screen must not be mistaken for a diagnosis or a reason to reach for antibiotics.",
    changed: "We positioned AURA as decision-support that flags risk earlier and points to confirmatory testing - never a replacement for clinical judgement.",
    concern: "Antimicrobial stewardship; distinguishing subclinical risk from clinical disease.",
    accent: "signal",
  },
  {
    id: "processor",
    role: "Dairy processors",
    heard: "Milk quality and somatic cell count drive price and shelf life. Earlier flags protect the whole tank.",
    changed: "We added tank-level and cow-level framing so the signal maps onto decisions processors already make.",
    concern: "Consistency across farms; integration with existing quality data.",
    accent: "bio",
  },
  {
    id: "regulator",
    role: "Regulators & biosafety",
    heard: "Anything engineered must stay contained. In-vitro use, no environmental release, clear waste handling.",
    changed: "We committed to a cell-free / contained-cell readout with no GMO release and documented containment throughout.",
    concern: "Environmental release; dual-use; validation before any real-world claim.",
    accent: "coral",
  },
  {
    id: "consumer",
    role: "Consumers",
    heard: "People want safe milk and well-treated animals, and are wary of 'GMO' language they don't understand.",
    changed: "We wrote plain-language explainers and made welfare and transparency central to how we describe AURA.",
    concern: "Trust, transparency, and what 'synthetic biology' means for their food.",
    accent: "pink",
  },
  {
    id: "team",
    role: "Student team",
    heard: "We are learning in public. Scope must match a season and our biosafety level.",
    changed: "We kept claims honest, marked pending data as pending, and designed within a realistic wet-lab envelope.",
    concern: "Overclaiming; finishing a credible, well-documented proof-of-concept.",
    accent: "signal",
  },
];

export type Reference = {
  id: number;
  authors: string;
  title: string;
  source: string;
  year: string;
};

/* Representative, plausibly-real references. Replace DOIs/exact citations with verified sources before submission. */
export const REFERENCES: Reference[] = [
  {
    id: 1,
    authors: "Halasa, T., Huijps, K., Østerås, O., & Hogeveen, H.",
    title: "Economic effects of bovine mastitis and mastitis management: A review.",
    source: "Veterinary Quarterly, 29(1), 18–31.",
    year: "2007",
  },
  {
    id: 2,
    authors: "Hogeveen, H., Steeneveld, W., & Wolf, C. A.",
    title: "Production diseases reduce the efficiency of dairy production: A review of the results, methods, and approaches regarding the economics of mastitis.",
    source: "Annual Review of Resource Economics, 11, 289–312.",
    year: "2019",
  },
  {
    id: 3,
    authors: "Ruegg, P. L.",
    title: "A 100-Year Review: Mastitis detection, management, and prevention.",
    source: "Journal of Dairy Science, 100(12), 10381–10397.",
    year: "2017",
  },
  {
    id: 4,
    authors: "Viguier, C., Arora, S., Gilmartin, N., Welbeck, K., & O'Kennedy, R.",
    title: "Mastitis detection: current trends and future perspectives.",
    source: "Trends in Biotechnology, 27(8), 486–493.",
    year: "2009",
  },
  {
    id: 5,
    authors: "Adkins, P. R. F., & Middleton, J. R.",
    title: "Methods for diagnosing mastitis.",
    source: "Veterinary Clinics of North America: Food Animal Practice, 34(3), 479–491.",
    year: "2018",
  },
  {
    id: 6,
    authors: "Sharma, N., Singh, N. K., & Bhadwal, M. S.",
    title: "Relationship of somatic cell count and mastitis: An overview.",
    source: "Asian-Australasian Journal of Animal Sciences, 24(3), 429–438.",
    year: "2011",
  },
  {
    id: 7,
    authors: "Duffy, E., Mitchell, K., & Nichols, S.",
    title: "Point-of-care biosensors for veterinary diagnostics: opportunities and constraints.",
    source: "Biosensors and Bioelectronics (representative review).",
    year: "2021",
  },
  {
    id: 8,
    authors: "iGEM Foundation.",
    title: "Safety and Security Policies & the Responsible Conduct guidelines.",
    source: "competition.igem.org/policies/safety",
    year: "2026",
  },
];

export type TeamMember = {
  name: string;
  role: string;
  track: string;
  accent: "pink" | "signal" | "butter" | "coral" | "bio";
  quote: string;
  initials: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  { name: "Alex Chen", role: "Team lead · Wet lab", track: "Wet Lab", accent: "bio", initials: "AC", quote: "If it doesn't work in milk, it doesn't work on a farm." },
  { name: "Sam Rivera", role: "Dry lab · Modeling", track: "Dry Lab", accent: "signal", initials: "SR", quote: "Models tell you what to measure next." },
  { name: "Jordan Lee", role: "Human practices", track: "Engagement", accent: "pink", initials: "JL", quote: "Design with the people who'll use it, not just admire it." },
  { name: "Morgan Blake", role: "Hardware · Device", track: "Dry Lab", accent: "butter", initials: "MB", quote: "A brilliant assay nobody can read is still a failure." },
  { name: "Riley Okafor", role: "Wiki · Design", track: "Design", accent: "coral", initials: "RO", quote: "Honest documentation is part of the science." },
  { name: "Casey Nguyen", role: "Protocols · Safety", track: "Wet Lab", accent: "bio", initials: "CN", quote: "Containment isn't a footnote - it's the design." },
];

export type NotebookEntry = {
  date: string;
  month: string;
  track: "wet" | "dry" | "hp" | "design" | "modeling" | "meeting";
  title: string;
  body: string;
};

export const NOTEBOOK_ENTRIES: NotebookEntry[] = [
  { date: "12 Jun", month: "Jun", track: "meeting", title: "Stakeholder kickoff", body: "Farmers and vets: sit in the milking line, cost less than the loss, a readout before the tank is mixed. Culture and PCR ruled out as the everyday test." },
  { date: "18 Jun", month: "Jun", track: "design", title: "Why miR-223", body: "bta-miR-223 scored above SCC proxies: earlier, and specific to bacterial inflammation." },
  { date: "25 Jun", month: "Jun", track: "wet", title: "Catapult oligo design", body: "Invasion-region sequences complementary to miR-223 drafted; off-target controls queued." },
  { date: "02 Jul", month: "Jul", track: "modeling", title: "Sample-wise baseline", body: "FET residual against that siphon’s reference electrodes - one spike is not a verdict." },
  { date: "09 Jul", month: "Jul", track: "dry", title: "Siphon chamber v1", body: "Inline sampling path sized for a milking pulse; electrode bosses upstream of the FET." },
  { date: "16 Jul", month: "Jul", track: "hp", title: "Flag, not verdict", body: "HP pushed the last mile: consecutive highs mark the cow; the farmer gets a quiet alert." },
  { date: "23 Jul", month: "Jul", track: "wet", title: "Opening assay design", body: "miR-223 versus irrelevant RNA in milk matrix; current traces scheduled." },
  { date: "30 Jul", month: "Jul", track: "design", title: "Cycle 5 integration sketch", body: "Siphon → catapult → FET → score → parlour flag." },
];

export const SAFETY_COMMITMENTS = [
  {
    title: "Containment",
    items: [
      { text: "In-vitro / cell-free readout - no environmental release of engineered organisms.", done: true },
      { text: "All work at approved biosafety level with institutional oversight.", done: true },
      { text: "Waste decontamination protocol documented and followed.", done: true },
      { text: "Field deployment risk assessment - not applicable this season (lab-only POC).", done: true },
    ],
  },
  {
    title: "Responsible use",
    items: [
      { text: "AURA positioned as diagnostic-support, not veterinary diagnosis.", done: true },
      { text: "No clinical claims without paired validation data.", done: true },
      { text: "Antimicrobial stewardship considered in all stakeholder materials.", done: true },
      { text: "iGEM Safety Form submitted and kept current.", done: false },
    ],
  },
];
