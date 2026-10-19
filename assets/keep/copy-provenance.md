# Copy provenance manifest

The article status line (`components/site/copy-status.tsx`) reads **Route**, **Completion**, and **Notes** from the Wiki pages tables below. Change those cells when copy changes. Do not duplicate them in code.

What can be ascertained about which **prose** on this wiki is team-written versus LLM-written. Art, layout, and motion are out of scope except where they carry words.

Judged 13 Oct 2026 from: the surviving team draft, the keep-file header, the 22 Sep 2026 content-replacement pass, DESIGN.md session notes, and internal tells (INSERT markers, fake names, “representative” citations). This is not a sentence-level classifier. Unlabelled fragments default to **llm-voice**.

## Labels

| Label | Meaning |
| --- | --- |
| `team-draft` | Human science copy. Typos, informal grammar, and `**INSERT**` holes are the tell. |
| `team-draft-cleaned` | Same facts as `team-draft`, grammar/spelling normalised into the keep file / homepage data module. |
| `llm-fill` | Team left a placeholder; an LLM wrote the missing section. |
| `llm-paraphrase` | Team science restated in wiki voice (“flag not a verdict”, “udder looks wrong”). Facts from the draft; sentences are not the team’s. |
| `llm-original` | Invented wiki theatre: fake people, fake interviews, fake notebook dates, fake parts, DBTL cycle writeups, chrome ledes. |
| `team-chosen` | Team locked the line or the numbers in session; wording around them may still be LLM. |
| `citation-real` | Real papers, LLM-assembled bibliography. Verify DOIs before freeze. |
| `citation-placeholder` | Explicitly fake or unverified. |
| `uncertain` | Cannot tell from the repo. |

## Completion

`done` only when **every unique string** on that row is human-written. A team body with an LLM title, lede, or metadata line is not `done`. Chrome like “Scroll” / skip-link is out of scope (`n/a`).

| Completion | Meaning |
| --- | --- |
| `done` | Every unique string is team-written (draft, paste, or a session-locked exact line). |
| `in-progress` | Mix of human and LLM unique text, or human text with INSERT / figure / citation holes. |
| `todo` | Unique text is LLM-written, paraphrased, filled, or placeholder. |
| `n/a` | UI chrome, not wiki copy. |

## Canonical sources

1. **`content/project/description.mdx`** - closest thing to the raw team paste. Informal English, “inflation” for inflammation, “bacterias”, “complimentary”, and two unfilled `**INSERT**` blocks.
2. **`assets/keep/project-description.md`** - saved 22 Sep 2026 “from team copy” with **placeholders filled**. The FET / miR-223 / siphon / electrode paragraphs are cleaned team draft. The model-to-farmer section and the design-process overview were empty in the MDX and are **llm-fill** here.
3. **`components/home/sections.ts`** - homepage science bodies taken from the description paste (What AURA is, miR-223, FET, electrodes, In the milking line). The two INSERT blocks are not filled here.
4. **DESIGN.md** - team session locked the slogan and the economics numbers; the rest of that file is design direction, not wiki body copy.

---

## Live homepage `/`

Current `app/page.tsx` follows the `old-migrate/` sequence. Facts stay the live homepage’s (not the old colour-readout / 1-in-3 copy).

| Section | File | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| Hero H1 *Milk is quiet. Infection is not.* | `components/home/home-hero.tsx` | `team-chosen` | `done` | DESIGN.md line. Session-locked exact wording. Who coined it is unknown. |
| Hero lede (easy to use diagnostic…) | same | `team-draft` | `in-progress` | First sentence of the description body. Button “Read the description” is LLM chrome. |
| Mastitis summary | `components/home/mastitis-summary.tsx` | `team-draft-cleaned` | `in-progress` | Replaces CapsuleStory on `/` for now. Body is the background udder paragraph plus the description’s subclinical miR-223 sentence. Heading restates “before any physiological changes occur.” Sprite is `cowSick`. |
| Capsule story (unmounted) | `components/home/capsule-story.tsx` | `llm-paraphrase` | `in-progress` | Kept, not on `/`. Four capsules restating current miR-223 / 1-in-5 / FET / siphon facts. |
| Impact intro “very loud bill” | `components/home/impact-beats.tsx` | `team-chosen` + `team-draft` | `in-progress` | Heading is the session keep. Body is the background economics opening paragraph. |
| Impact up to US$32 billion / about 1 in 5 / 40–70% / &lt;15% | `impact-beats.tsx` + `lib/content.ts` `IMPACT_STATS` | `team-draft` + `team-chosen` | `in-progress` | The first three figures and their labels match the 14 Oct 2026 background paste. The under-15% treatment slice is not in that paste and stays. Treatment copy no longer claims “early detection pays”; it uses the background caveat. The pail layers are an illustrative split labelled from that paste (lost yield, milk quality, other costs). The picture marks 5 of 24, then 17 of 24. The “cows marked” count is not shown. |
| Current tools (SCC / PCR / pathogen-specific) | `app/page.tsx` | `team-draft-cleaned` | `in-progress` | Title and lede from the background SCC “why this matters.” Items are SCC (background), PCR and laboratory testing (attribution market-analysis note), and the background pathogen-variety limit. Conductivity and culture were dropped: they are not in the team-written pages. |
| Dark idea “what if” + What AURA is + FET | `app/page.tsx` | `team-draft-cleaned` + `team-draft` | `in-progress` | Question line is the background “signs of the cow's response to infection.” Body is a one-line and a shorter-than-paragraph cut of the description paste, same informal wording (easy to use, help diagnosis, complimentary, “As a result, of the”). |
| Signal intro + Input / Recognition / Transduction / Output | `components/home/signal-beats.tsx` | `team-draft-cleaned` | `in-progress` | Stepper restates the description siphon / catapult / FET / electrode sentences. The visual is a current readout (flat baseline, miR-223 binds, current steps, flat no-target control); the pink-milk vial and its verdict chips are removed. No colour readout or mastitis flag. |
| DBTL wheel blurbs | `components/viz/dbtl-wheel.tsx` | `team-draft-cleaned` | `in-progress` | Design/Build/Test/Learn sentences from the experiments paste (probe variants, BHQ-1/6-FAM, DNA analogue fluorescence, SNR 6.73 vs 17.96). Intro is that cycle’s lead-architecture line. |
| Parlour sunset + “In the milking line” | `components/home/parlour-beat.tsx` + `HOME_SECTIONS` | `llm-original` + `team-draft` | `in-progress` | Sunset lines are form. Body is the description paste. Farm-to-lab labels are `team-draft-cleaned`. |
| Farm-to-lab step labels | `components/viz/farm-to-lab.tsx` | `team-draft-cleaned` | `in-progress` | Cow / Siphon / Catapult / FET / Reader / App. Subs follow the hardware stages and the description siphon sentence. Stops at readings to the app; does not fill the model INSERT. |
| Footer tagline + blurb | `components/site/site-footer.tsx` | `team-chosen` + `team-draft-cleaned` | `in-progress` | Slogan team-chosen. Blurb is the description FET sentence plus the hardware “not a direct identification of mastitis” line. |
| Site metadata / OG | `app/layout.tsx` | `team-draft-cleaned` | `in-progress` | Description opening plus the hardware “not a direct identification of mastitis” line. |
| Nav group intros + link `desc`s | `lib/nav.ts` | `llm-original` + `team-draft-cleaned` | `in-progress` | Link `desc`s for the pages synced on 19 Oct 2026 now name what those pages contain (still LLM wording). Group intros are LLM chrome. |

The `/` route as a whole is **`in-progress`** (human science sections sit next to LLM chrome, fills, and paraphrases).

---

## Other homepage variants (not `/`)

The old `/home-old` and `/home-migrate` routes are gone. The `old-migrate/` snapshot is the form reference for the live homepage; it is not a public route.

---

## Wiki pages

Shell titles/ledes in `app/<page>/page.tsx` are `llm-original` unless noted. Body = MDX. A page is **`done` only if the shell, metadata, and body are all human.**

### Project

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/description` | `content/project/description.mdx` | **`team-draft`** | `in-progress` | Body is the team’s 19 Oct 2026 Notion rewrite of the description. Shell title, lede, metadata, and TOC labels are LLM. |
| `/background` | `content/project/background.mdx` | `team-draft` | `in-progress` | Body, title, lede, and metadata description are the team’s paste, synced to Notion on 19 Oct 2026 (US$32 billion with its Forbes reference). The kicker is site chrome. |
| `/engineering` | `content/project/engineering.mdx` | `team-draft` | `in-progress` | Body is the team’s Notion Engineering page (cycles 1–5). The two reset-diagram captions, lede, metadata, and TOC labels are LLM. Notion’s unfinished figure notes were left out. |
| `/results` | `content/project/results.mdx` | `llm-paraphrase` | `todo` | There is no Results page in Notion. Assembled from the team’s Experiments, Engineering, and Measurement pages: the numbers are theirs, many sentences are restated. |
| `/contribution` | `content/project/contribution.mdx` | `team-draft` | `in-progress` | Body is the team’s Notion Contributions page. The repository-link placeholder was left out and registry links are not added. Lede, metadata, and TOC labels are LLM. |

### Wet lab

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/experiments` | `content/wet-lab/experiments.mdx` | `team-draft` | `in-progress` | Experiment 1 (Notion, 19 Oct 2026) and Experiment 2 (Notion, 18 Oct 2026). Experiment 1 figure captions, shell title, lede, metadata, and TOC labels are LLM. |
| `/protocols` | `content/wet-lab/protocols.mdx` | `team-draft` + `llm-paraphrase` | `in-progress` | There is no Protocols page in Notion. Steps are the team’s Experiment 1, Experiment 2, and Measurement methods, condensed. The overview, two callouts, lede, and metadata are LLM. |
| `/parts` | `content/wet-lab/parts.mdx` | `team-draft` + `llm-original` | `in-progress` | Part IDs, designs, and sequences come from the team’s Contributions, Engineering, and Experiment 1 tables. The overview and linking sentences are LLM, and registry links are not added. |
| `/measurement` | `content/wet-lab/measurement.mdx` | `team-draft` | `in-progress` | Body is the team’s Notion Measurement page (19 Oct 2026). The SNR bar graph does not exist yet and was left out. The lede is the team’s; title, metadata, TOC labels, and shortened figure captions are LLM. |
| `/notebook` | `content/wet-lab/notebook.mdx` | `team-draft` | `in-progress` | Needs verification: the entries are the team’s project-notes PDF (19 Oct 2026), which uses the same dates as a deleted draft reconstruction. A teammate must confirm them. The callout, shell, and metadata are LLM. |

### Dry lab

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/model` | `content/dry-lab/model.mdx` | `llm-paraphrase` / `llm-original` | `todo` | Load-score / consecutive-session logic expands the llm-fill model section. |
| `/hardware` | `content/dry-lab/hardware.mdx` | `team-draft` | `in-progress` | Body, title, lede, and metadata description are the team’s paste, synced 19 Oct 2026: not-built disclaimer added, two clauses Notion dropped removed. The CAD figure has no image. The kicker and callout title are site chrome. |
| `/software` | `content/dry-lab/software.mdx` | `llm-original` | `todo` | |

### Engagement

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/human-practices` | `content/engagement/human-practices.mdx` | `team-draft` | `in-progress` | Body is the team’s Notion Human Practices page: who we contacted, what we learned, responsible implementation, references. Typos fixed. The second overview paragraph, metadata, and TOC labels are LLM. |
| `/integrated-human-practices` | `content/engagement/integrated-human-practices.mdx` | `team-draft` | `in-progress` | Body is the “How did this influence AURA” paragraphs and “How Human Practices Changed AURA” from the team’s Human Practices page. Section titles, the cross-link sentence, shell, and metadata are LLM. |
| `/education` | `content/engagement/education.mdx` | `team-draft` | `in-progress` | Body is the team’s Notion Education page (19 Oct 2026), unedited. Its downloadable PDFs are not on the site yet. Photo captions, metadata, and TOC labels are LLM. |
| `/sustainability` | `content/engagement/sustainability.mdx` | `team-draft` | `in-progress` | Body, title, and lede are the team’s Notion SDGs page. Metadata and TOC labels are LLM. |
| `/entrepreneurship` | `content/engagement/entrepreneurship.mdx` | `team-draft` + `llm-original` | `in-progress` | Body is the team’s Notion “Entrepreneurship - Wiki” page (last edited 4 Oct 2026), split into sections at its own bold headings; “Long term” hyphenated, wording otherwise unchanged. The existing-solutions caveat sits in a callout. Shell title, lede, metadata, TOC labels, and nav `desc` are LLM. |
| `/safety` | `content/engagement/safety.mdx` | `team-draft` | `in-progress` | Body is the team’s Notion Safety page. Lede, metadata, and TOC labels are LLM. |

### Team

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/team` | `content/team/members.mdx` | `team-draft` | `in-progress` | Names, roles, and bios are the team’s Notion team page, unedited; surnames come from the attributions page. Shell title, lede, metadata, and section labels are LLM. |
| `/attributions` | `content/team/attributions.mdx` + `ATTRIBUTION_ENTRIES` | `team-draft` | `in-progress` | Tables are the team’s Notion attributions page. Ella Bussaume’s tasks are blank there, so her row is left out. Overview, shell, and metadata are LLM. |
| `/references` | `content/team/references.mdx` | `citation-real` | `in-progress` | Compiled from the reference lists on Background, Engineering, Human Practices, Safety, and SDGs, duplicates merged. The overview line and shell are LLM. |

---

## Shared data (`lib/content.ts`)

| Export | Label | Completion | Notes |
| --- | --- | --- | --- |
| `IMPACT_STATS` | `team-draft` numbers for the first three; `&lt;15%` unchanged | `in-progress` | First three match the background paste. The treatment slice is not in that paste. Treatment `sub` now uses the background caveat instead of “most losses are hidden.” |
| `GLOSSARY` | `llm-paraphrase` | `todo` | |
| `STAKEHOLDERS` | `llm-original` | `todo` | No longer rendered: `/human-practices` dropped `<StakeholderMap />` on 19 Oct 2026. |
| `REFERENCES` 1–6, 8 | `citation-real` | `in-progress` | No longer rendered: `/references` lists the team’s cited sources directly since 19 Oct 2026. |
| `REFERENCES` 7 Duffy 2021 | `citation-placeholder` | `todo` | No longer rendered. |
| `TEAM_MEMBERS` | `llm-original` | `todo` | No longer rendered: `/team` renders `members.mdx` since 19 Oct 2026. |
| `ATTRIBUTION_ENTRIES` | `team-draft` | `done` | Advisor/collaborator names, kinds, roles, and contribution sentences from the team document. |
| `NOTEBOOK_ENTRIES` | `llm-original` | `todo` | No longer rendered: `/notebook` dropped `<NotebookTimeline />` on 19 Oct 2026. |
| `SAFETY_COMMITMENTS` | `llm-original` | `todo` | No longer rendered: `/safety` dropped `<SafetyBlock />` on 19 Oct 2026. |

---

## Other copy-bearing UI

| Surface | File | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| Mastitis summary | `components/home/mastitis-summary.tsx` | `team-draft-cleaned` | `in-progress` | `cowSick` plus background udder paragraph and the description’s subclinical miR-223 sentence. |
| Biosensor diagram captions | `components/viz/biosensor-diagram.tsx` | `llm-paraphrase` | `todo` | Same four stages as signal-beats. |
| Parlour beat | `components/home/parlour-beat.tsx` | `llm-original` + `team-draft` | `in-progress` | Sunset form; milking-line body from `HOME_SECTIONS`. No stakeholder quotes. |
| Capsule story (unmounted) | `components/home/capsule-story.tsx` | `llm-paraphrase` | `in-progress` | Kept, not on `/`. |
| Page-hero titles | per-route `PageHero` / `WikiMdxShell` | `llm-original` | `todo` | Blocks any wiki page from `done` until replaced. |
| Skip-link, “Scroll”, “top”, chapter pips | chrome | n/a | `n/a` | UI, not content. |

---

## What is *not* LLM-written (ascertainable)

- **`content/project/description.mdx`** body, including the two INSERT holes.
- **Keep-file / `HOME_SECTIONS` paragraphs** that match that draft: What AURA is, miR-223, FET catapult, reference electrodes, In the milking line.
- **`content/project/engineering.mdx`** body (13 Oct 2026 paste), minus the unfilled figure, sequence, and graph notes.
- **`content/wet-lab/experiments.mdx`** body (13 Oct 2026 paste), minus missing figure files.
- **`content/engagement/education.mdx`** activity and feedback paragraphs (14 Oct 2026 paste). Overview, shell title, lede, and photo captions on that page are LLM. Captions name the activity: a DNA lesson, a simpler explanation, students holding a candy model, and the models laid out.
- **`content/dry-lab/hardware.mdx`** and the hardware title, lede, and metadata description (14 Oct 2026 paste). The opening paragraph is the hero lede and is not repeated. Figure captions drop the “Figure N.” prefix. The files in `public/images` do not follow the paste’s figure numbers: `Hardware Figure 1.png` is the architecture, `Hardware Figure 3.png` is the sliding sleeve, `Hardware Figure 4.png` is the pinch valve, `Hardware Figure 5.png` is the chamber, and `Hardware Figure 2.png` is the readout. The mechanical-layout “Suggested caption” had no image file and was omitted. The previous siphon/strip explainer is no longer on this page.
- **`content/project/background.mdx`** and the background title, lede, and metadata description (14 Oct 2026 paste). Em dashes were removed and not replaced with other dashes: the “01 - Title” marks became the section kicker plus the title, and each economics figure (“up to US$32 billion - Estimated annual global losses”, “Approximately 1 in 5 - Dairy cows affected”, “40–70% - Reported herd-level incidence”) sits in its own column of one row, figure, then label, then sentence. The en dash inside 40–70% was kept. The opening paragraph is the hero lede and is not repeated in the body. The previous LLM explainer, the cow drawing, and the IMPACT_STATS cards are no longer on this page.
- **`ATTRIBUTION_ENTRIES`** contribution text (team advisor/collaborator document).
- **Slogan** *Milk is quiet. Infection is not.* - team-chosen (DESIGN.md).
- **Homepage economics figures** that match the background paste: up to US$32 billion, about 1 in 5, and 40–70%. The under-15% treatment slice is not in that paste and stays on the homepage.
- **Hand-made art** under `public/art/images/` (not copy).
- **Real bibliography entries** 1–6 and 8, if DOIs check out.

No **wiki route** is `done`. Shell titles, ledes, and metadata still add unique LLM text on article pages other than Background and Hardware, whose titles, ledes, and metadata descriptions are the 14 Oct 2026 pastes. Both stay `in-progress` because the kicker is site chrome.

## What is LLM-written (ascertainable)

- Almost every other paragraph on the wiki, including Results, remaining wet-lab pages, Parts tables, Notebook dates, HP interview voice, Team names, Contribution, the Education overview and photo captions, Sustainability, Safety, Software, and shell ledes other than Background and Hardware.
- Keep-file (and therefore homepage) **model** and **design-process** sections - they replace INSERT blocks.
- The 22 Sep 2026 FET rewrite of pages that previously described a genetic circuit and colorimetric strip (that older story was also LLM scaffold).

## Uncertain

- Who first wrote the slogan.
- Whether any stakeholder quotes compress real conversations not stored here.
- Whether IMPACT_STATS match a team spreadsheet or only the DESIGN.md keep-list.
- Exact authorship of DESIGN.md itself (session decisions vs LLM bible).

If a judge or teammate needs a single rule: **trust `content/project/description.mdx` as the human science draft; treat everything else as LLM until a person replaces it. A page is `done` only when every unique string on it is human.**

---

## Notion sync, 19 Oct 2026

Read-only sync from the team’s Notion WIKI pages (export of 19 Oct 2026, about 20:45 Zurich). Nothing was written to Notion. Images were downloaded once and saved under `public/images/`; no Notion URLs are linked.

| Route | Notion source | What changed |
| --- | --- | --- |
| `/description` | dESCRIPTION (19 Oct 03:32) | Whole body replaced with the rewrite. A stray `** **` bold marker around “UdderNet” removed. |
| `/background` | Background (19 Oct 18:12) | €35 billion → US$32 billion with footnote [1] (Forbes 2025). “Dairy cows are affected.” Reference formatted from Notion’s bare URL, title from the SDGs page, date from the URL. Alan’s uncommitted card styling kept. |
| `/engineering` | Engineering (18 Oct 20:39) | Rewritten: rationale + cycles 1–5. NUPACK replaces RNAfold. Footnotes renumbered [1]–[3] (Notion restarts at [1]). Cycle 2 status column “To test” shown as “Tested” (Test 2B tested those four). Test 2A “all three designs” → “the screened designs” (Notion lists four names). One Test 2A paragraph about the fluorescence results moved to Test 2B. Build 2 temperature 30 °C per Experiment 1 methods (Notion: 30.3 °C). Cycle 3–5 plots use the Experiment 2 figures and captions instead of Notion’s “TO FIX” charts. RNase H and strand-displacement diagram captions are LLM (from the page’s own figure notes). Omitted: “Graphic for engineering page”, the cycle-arrow line, “Original catapult:” labels, “Figure X: to write and redo / TO FIX / to fix”, four `[ADD FIGURE …]` notes, black-background TIFF animation frames. |
| `/results` | Experiment 1, Experiment 2, Measurement, Engineering | Rebuilt. Old FET current-trace, milk-test, siphon “prototype built” and modelling claims removed. Baseline target RFU (16,716 vs 19,135) avoided because the pages disagree. |
| `/contribution` | Contributions (19 Oct 18:07) | Rebuilt with the 7 BBa IDs and UdderNet paragraph. Omitted: “[Insert official iGEM Software Repository link]” and the “For Mete to do” list. |
| `/experiments` | Experiment 1 (19 Oct 17:06), Experiment 2 (18 Oct 12:23) | Exp 1 methodology updated to Notion (30 °C, “in all the experimental assays”, “less prone to degradation”). Plate wells D/E/F all “30 °C experimental”. “At EPFL” highlight dropped from a heading. QC formulas transcribed from the screenshot. Figures 1–2 added; Figure 1 caption drops “approximately 25 °C”. DBTL and Next steps sections removed (no longer in Notion); third limitation and hand-off sentence added. Limitation temperature written as 30 °C (Notion: “room temperature”). Experiment 2 appended in full; “miRNA-221” → “miRNA-21” to match its protocol (miR21_DNA). Alan’s table styling kept. |
| `/protocols` | Experiment 1, Experiment 2, Measurement | Rebuilt from the methods. Reader settings are the ones Measurement recorded (Cytation 5, Ex 492/Em 530, top read, 5 min), not Experiment 1’s planned Ex 485/Em 520 bottom read every 30 s. |
| `/parts` | Contributions, Engineering, Experiment 1 | Rebuilt: 7 BBa parts with sequences matched by design name; Experiment 1 target and comparator oligos. Invented AuraCat parts removed. |
| `/measurement` | Measurement (19 Oct 19:44) | Rebuilt. Formula headings that were scrambled in Notion re-paired with their formulas. Omitted: “[INSERT SNR BAR GRAPH HERE]” with its orphan Figure 2 caption, and “Providing these files would allow…” (no files are provided). |
| `/notebook` | Notebook PDF (19 Oct 19:22) | Rebuilt from the PDF text; “loks” → “looks”; the 1 Sep “Next step:” line made a sentence. Needs a teammate to confirm the dates. |
| `/hardware` | Hardware (19 Oct 18:32) | Disclaimer added as a callout. Removed “rather than as a direct identification of mastitis” and “rather than treating a separate external ADC as mandatory” (no longer in Notion). “Suggested caption” CAD note has no image and stays out. |
| `/education` | Education (19 Oct 16:20) | Rebuilt verbatim from Notion, headings from its labels. New images: website homepage, lessons screenshot, ISL workshop. Existing four junior-workshop photos kept. PDF/docx downloads not copied. |
| `/human-practices`, `/integrated-human-practices` | Human Practices (19 Oct 18:10) | Split without duplication: backgrounds and learnings on HP, “how this influenced AURA” on IHP. `utm_source=chatgpt.com` stripped from links. Typos fixed (feilds, bacteria’s, miking, casses, “our the”, staring, organisations). “bacterial strands” → “bacterial strains”. “only confirmed” → “confirmed” (Romano). Invented quotes and the stakeholder map removed. |
| `/safety` | Safety (19 Oct 19:29) | Rebuilt; the old “chassis strains” and commitments block removed. |
| `/sustainability` | SDGs (19 Oct 16:51) | Rebuilt: SDGs 2, 3, 9, 12 and references. |
| `/team` | Igem Team page (19 Oct 19:12) | Route now renders `members.mdx` (new `MemberProfile` cards with drawn portrait + photo). Bios verbatim, including Riho and Fotios. Omitted: “Descriptions i need: …” note and an empty embed. Alan’s bio is no longer bold. |
| `/attributions` | attributions (19 Oct 19:46) | Team, PI/instructor, institution and AI-tool tables added; existing advisor/collaborator list kept. |
| `/references` | Background, Engineering, HP, Safety, SDGs | Compiled list; Duffy placeholder and LLM further-reading text removed. |

New components: `components/ui/data-table.tsx` (the MDX setup has no GFM, so pipe tables do not parse) and `components/site/member-profile.tsx`, both registered in `mdx-components.tsx`.

