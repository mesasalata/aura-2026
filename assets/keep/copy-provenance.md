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
| Impact €35 billion / about 1 in 5 / 40–70% / &lt;15% | `impact-beats.tsx` + `lib/content.ts` `IMPACT_STATS` | `team-draft` + `team-chosen` | `in-progress` | The first three figures and their labels match the 14 Oct 2026 background paste. The under-15% treatment slice is not in that paste and stays. Treatment copy no longer claims “early detection pays”; it uses the background caveat. The pail layers are an illustrative split labelled from that paste (lost yield, milk quality, other costs). The picture marks 5 of 24, then 17 of 24. The “cows marked” count is not shown. |
| Current tools (SCC / PCR / pathogen-specific) | `app/page.tsx` | `team-draft-cleaned` | `in-progress` | Title and lede from the background SCC “why this matters.” Items are SCC (background), PCR and laboratory testing (attribution market-analysis note), and the background pathogen-variety limit. Conductivity and culture were dropped: they are not in the team-written pages. |
| Dark idea “what if” + What AURA is + FET | `app/page.tsx` | `team-draft-cleaned` + `team-draft` | `in-progress` | Question line is the background “signs of the cow's response to infection.” Body is a one-line and a shorter-than-paragraph cut of the description paste, same informal wording (easy to use, help diagnosis, complimentary, “As a result, of the”). |
| Signal intro + Input / Recognition / Transduction / Output | `components/home/signal-beats.tsx` | `team-draft-cleaned` | `in-progress` | Stepper restates the description siphon / catapult / FET / electrode sentences. Verdicts are closed vs open catapult, not a colour readout or a mastitis flag. |
| DBTL wheel blurbs | `components/viz/dbtl-wheel.tsx` | `team-draft-cleaned` | `in-progress` | Design/Build/Test/Learn sentences from the experiments paste (probe variants, BHQ-1/6-FAM, DNA analogue fluorescence, SNR 6.73 vs 17.96). Intro is that cycle’s lead-architecture line. |
| Parlour sunset + “In the milking line” | `components/home/parlour-beat.tsx` + `HOME_SECTIONS` | `llm-original` + `team-draft` | `in-progress` | Sunset lines are form. Body is the description paste. Farm-to-lab labels are `team-draft-cleaned`. |
| Farm-to-lab step labels | `components/viz/farm-to-lab.tsx` | `team-draft-cleaned` | `in-progress` | Cow / Siphon / Catapult / FET / Reader / App. Subs follow the hardware stages and the description siphon sentence. Stops at readings to the app; does not fill the model INSERT. |
| Footer tagline + blurb | `components/site/site-footer.tsx` | `team-chosen` + `team-draft-cleaned` | `in-progress` | Slogan team-chosen. Blurb is the description FET sentence plus the hardware “not a direct identification of mastitis” line. |
| Site metadata / OG | `app/layout.tsx` | `team-draft-cleaned` | `in-progress` | Description opening plus the hardware “not a direct identification of mastitis” line. |
| Nav group intros + link `desc`s | `lib/nav.ts` | `llm-original` + `team-draft-cleaned` | `in-progress` | Description, Background, Hardware, and Education `desc`s now name what those team-written pages contain. Group intros and the other link lines are still LLM chrome. |

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
| `/description` | `content/project/description.mdx` | **`team-draft`** | `in-progress` | Body is the human science draft, including two unfilled INSERT blocks. Title/lede/metadata on the shell are `llm-paraphrase`. |
| `/background` | `content/project/background.mdx` | `team-draft` | `in-progress` | Body, title, lede, and metadata description are the 14 Oct 2026 paste. The kicker is site chrome. |
| `/engineering` | `content/project/engineering.mdx` | `team-draft` | `in-progress` | Pasted 13 Oct 2026. Cycles 1–2: miR-21 catapult adapted to miR-223, then the FAM/BHQ variant screen. Figure, sequence, RNAfold-setting, and graph notes are still unfilled. Shell title, lede, and metadata are LLM. |
| `/results` | `content/project/results.mdx` | `llm-original` | `todo` | Pending-data theatre mapped onto FET/catapult. No team results document in-repo. |
| `/contribution` | `content/project/contribution.mdx` | `llm-original` | `todo` | |

### Wet lab

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/experiments` | `content/wet-lab/experiments.mdx` | `team-draft` | `in-progress` | Pasted 13 Oct 2026. FAM/BHQ methods and results. Three figure files were not in the paste and are placeholders. Shell title/lede are LLM. |
| `/protocols` | `content/wet-lab/protocols.mdx` | `llm-original` | `todo` | |
| `/parts` | `content/wet-lab/parts.mdx` | `llm-original` | `todo` | Invented part names (`AuraCat-stem`, etc.). |
| `/measurement` | `content/wet-lab/measurement.mdx` | `llm-original` | `todo` | |
| `/notebook` | `content/wet-lab/notebook.mdx` + `NOTEBOOK_ENTRIES` | `llm-original` | `todo` | Dated log (12 Jun–30 Jul) is fictional scaffolding. |

### Dry lab

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/model` | `content/dry-lab/model.mdx` | `llm-paraphrase` / `llm-original` | `todo` | Load-score / consecutive-session logic expands the llm-fill model section. |
| `/hardware` | `content/dry-lab/hardware.mdx` | `team-draft` | `in-progress` | Body, title, lede, and metadata description are the 14 Oct 2026 paste. The kicker is site chrome. Diagrams were matched by content. A suggested CAD caption had no image. |
| `/software` | `content/dry-lab/software.mdx` | `llm-original` | `todo` | |

### Engagement

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/human-practices` | `content/engagement/human-practices.mdx` + `STAKEHOLDERS` | `llm-original` | `todo` | “Semi-structured interviews” and quoted “What we heard” are not backed by files in this repo. |
| `/integrated-human-practices` | `content/engagement/integrated-human-practices.mdx` | `llm-original` | `todo` | Same invented stakeholder loop. |
| `/education` | `content/engagement/education.mdx` | `team-draft` + `llm-original` | `in-progress` | Activity and feedback paragraphs are the 14 Oct 2026 team paste, with a duplicate club draft and “Picture:” notes omitted and a few typos normalised. Overview, shell title, lede, metadata, and photo captions are LLM. Glossary is no longer on this page. |
| `/sustainability` | `content/engagement/sustainability.mdx` | `llm-original` | `todo` | |
| `/safety` | `content/engagement/safety.mdx` + `SAFETY_COMMITMENTS` | `llm-original` | `todo` | |

### Team

| Route | Body | Label | Completion | Notes |
| --- | --- | --- | --- | --- |
| `/team` | `content/team/members.mdx` + `TEAM_MEMBERS` | `llm-original` | `todo` | Names are placeholders (Alex Chen, Sam Rivera, Jordan Lee, Morgan Blake, Riley Okafor, Casey Nguyen). |
| `/attributions` | `content/team/attributions.mdx` + `ATTRIBUTION_ENTRIES` | `team-draft` + `llm-original` | `in-progress` | Contribution bullets are the team’s advisor/collaborator document. Overview, shell title “Who helped”, lede, and metadata are LLM. |
| `/references` | `content/team/references.mdx` + `REFERENCES` | mix | `in-progress` | Real cites + Duffy placeholder + LLM overview / “further reading”. See bibliography below. |

---

## Shared data (`lib/content.ts`)

| Export | Label | Completion | Notes |
| --- | --- | --- | --- |
| `IMPACT_STATS` | `team-draft` numbers for the first three; `&lt;15%` unchanged | `in-progress` | First three match the background paste. The treatment slice is not in that paste. Treatment `sub` now uses the background caveat instead of “most losses are hidden.” |
| `GLOSSARY` | `llm-paraphrase` | `todo` | |
| `STAKEHOLDERS` | `llm-original` | `todo` | |
| `REFERENCES` 1–6, 8 | `citation-real` | `in-progress` | Standard mastitis / iGEM policy cites, LLM-assembled. Confirm before freeze. |
| `REFERENCES` 7 Duffy 2021 | `citation-placeholder` | `todo` | Labelled in code as “representative review”. |
| `TEAM_MEMBERS` | `llm-original` | `todo` | |
| `ATTRIBUTION_ENTRIES` | `team-draft` | `done` | Advisor/collaborator names, kinds, roles, and contribution sentences from the team document. |
| `NOTEBOOK_ENTRIES` | `llm-original` | `todo` | |
| `SAFETY_COMMITMENTS` | `llm-original` | `todo` | |

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
- **`content/project/background.mdx`** and the background title, lede, and metadata description (14 Oct 2026 paste). Em dashes were removed and not replaced with other dashes: the “01 - Title” marks became the section kicker plus the title, and each economics figure (“€35 billion - Estimated annual global losses”, “Approximately 1 in 5 - Dairy cows affected”, “40–70% - Reported herd-level incidence”) sits in its own column of one row, figure, then label, then sentence. The en dash inside 40–70% was kept. The opening paragraph is the hero lede and is not repeated in the body. The previous LLM explainer, the cow drawing, and the IMPACT_STATS cards are no longer on this page.
- **`ATTRIBUTION_ENTRIES`** contribution text (team advisor/collaborator document).
- **Slogan** *Milk is quiet. Infection is not.* - team-chosen (DESIGN.md).
- **Homepage economics figures** that match the background paste: €35 billion, about 1 in 5, and 40–70%. The under-15% treatment slice is not in that paste and stays on the homepage.
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
