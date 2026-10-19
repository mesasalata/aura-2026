# AURA wiki - design bible

Read this before changing look, layout, or scroll choreography.

**Line:** Milk is quiet. Infection is not.  
**Team:** AURA · iGEM 2026  
**Stack:** Next.js 16 static export (`output: "export"`), Tailwind 4, Motion `12.36.0` (do not bump - later versions break sticky `useScroll`).  
**Deploy:** `https://2026.igem.wiki/aura/` via `NEXT_PUBLIC_BASE_PATH=/aura`.

---

## North star

**GreatBay-level graphical cohesion + professional layout craft. AURA colour theory stays.**

GreatBay is the reference for **how the pictures hold together**, not for how the page is wired. Do not clone their room-corner, cream-on-green cards, bubble rail, or chunky wordmark.

| Layer | Source | What we take | What we do **not** take |
|---|---|---|---|
| Graphical cohesion | [GreatBay-SCIE 2026](https://2026.igem.wiki/greatbay-scie/) | One illustrated world. Same hand, same line, same materials, same cast, from homepage through every article. Graphics look commissioned, not assembled. | Their layout. Their forest-green / lime / terracotta. Comic nav. Bubble type. HS cute-for-cute. |
| Professional craft | [21st.dev](https://21st.dev/) + the galleries below | How a grown-up site is structured: hero has one job, one action, specific claims, CSS-first motion, one H1, words in the HTML. | SaaS chrome, mesh slop, fake logo walls, “Get started,” installing their runtimes. |
| Colour / type / brand | This repo (`app/globals.css`) | Milk, cream, ink, pink, cyan. Space Grotesk + Inter. | GreatBay greens. Any Recraft “theme lock.” |

The green-and-orange iGEM site people mean **is GreatBay**. Study the *drawings*. Recolour nothing of ours to match it. Build our own pages.

If a change makes AURA look like mixed clipart **or** a generic SaaS landing, it is wrong. The mix is: *their one-world graphics, our milk/ink/pink, our type, 21st-level page craft.*

---

## 1. What this wiki is trying to be

Not a modernist poster. Not a SaaS landing. Not a wallpaper of AI paintings behind type. Not ArMOLDgeddon with the greens swapped for pink.

It should feel like **one illustrated world, laid out like a professional site**: the cow, the pail, the milk, the pink signal all look like they were painted by the same hand. The page itself can be quiet and structural. **One cinematic motion beat** fills the screen.

The homepage hero is a **full-frame pour**, not rain:

1. Dark title: *Milk is quiet. Infection is not.*
2. A milk pail tips.
3. One thick cream column drops from the rim.
4. A pool rises from the floor until the next section is the same milk surface.

If a change makes that beat look like particle rain, stickers, or a faded overlay, it is wrong.

---

## 2. Decisions from this project (do not forget)

These came from the team in session. They override older code.

| Decision | Why |
|---|---|
| **GreatBay = graphical cohesion, not layout** | Same illustrated world everywhere. Pages are ours / 21st.dev, not a GreatBay clone. |
| **Keep current colour theory** | Milk / cream / ink + pink + cyan. Do not import GreatBay green/orange. |
| Look like **winning wikis**, not a poster | Judges remember GreatBay / GEMS / Lambert more than generic dark UI |
| **Progress bar is required** | Always-on scroll progress at the top, 12px tall. The milk-edge pour stays, and its leading edge stays on the cow's center. A two-frame cow (`cow-walk-1`, `cow-walk-2`, one frame at a time) walks from the left of the screen to the right, sitting slightly below the rail. The walk plays only while the page is scrolling |
| **Thin nav** | Groups only. No extra chrome, no dumped sitemap in the header. At rest the bar is clear over the page (no blur), and its type turns from milk to ink exactly where the page turns from dark to light. An open group is one milk plate behind the links that fades, shifts, and grows open over 250ms on `--ease-out-soft` |
| Homepage from the Procreate mock + **generated graphics**, not decorative SVGs | SVGs only if they must animate (graphs, pour geometry) |
| Image gen via **Fal / Recraft**, then rembg cutouts | Keep sprites modular so they can move |
| **Modular sprites**, never baked landscape banners as heroes | One locked painting behind type looks cheap and cannot animate |
| **One hero sprite id per page** | `HERO_CAST` in `lib/art.ts` is keyed by route (`description`, `education`, …), plus `default`. The id is the image title even before the file exists; a missing file is shown as that id and its alt description, in text |
| **Bucket, not udder** | Udder reads icky. Pour source is a pail |
| Pour = **one stream that fills the frame**, like a short video | Cute raining droplets failed. Unreadable. |
| **Minimal** | Too much unseeable detail (cells, stamps, 7-piece dioramas, coin showers) kills the beat |
| Recraft “child_book + brand colors” **failed** | Model stuffed kids, cows-in-flasks, foam scenes into “simple pail” prompts. Prompt one object, throw away anything that isn’t that object. |
| Generated icons that look like kawaii stickers / photoreal still-lifes / game assets **do not fit** | Same world as the cream cow mascot, or don’t use them |
| Diagrams should be **interactive** and sit on the page, not in chrome frames | Biosensor already steps; don’t bury it in painted stamps |
| Article shell: **chapter rail + one paper card + numbered figures + read-next** | Our current professional reading layout - not a GreatBay clone |
| Lorem is fine on unfinished science pages | Honesty > fake results. Mark pending data. |
| Mastitis economics copy stays | Quiet disease, loud bill. Homepage bill and herd figures match the background paste: €35 billion, about 1 in 5, 40–70%. The uncited treatment slice (under 15%) stays on the homepage only. The herd picture marks cows; it does not print a “N of 24 cows marked” count |
| Mascot language: lab-coat cow - **not cluttered** | One character at a time on inner heroes |
| **Homepage form follows `old-migrate/`** | Sequence: pour hero → mastitis summary (`cowSick` sprite; CapsuleStory unmounted for now) → impact beats (including the under-15% slice) → current tools → idea → milk-to-signal → DBTL → parlour. Facts stay the live homepage’s: €35 billion / 1 in 5 / 40–70%, FET catapult (not a colour readout), siphon-in-the-line. Do not bring back 1-in-3 or “pink means look closer.” Homepage sentences that name science or results must agree with the team-written wiki pages. The DBTL wheel is the experiments Design/Build/Test/Learn paste (fluorescence / SNR), not a FET-in-milk loop. Farm-to-lab ends at readings to the app and does not fill the description’s model INSERT. Current-tools names only methods those pages name: SCC, PCR and laboratory testing, and the limit of a pathogen-specific test. The treatment beat keeps the under-15% slice and does not claim that early detection pays. |
| **Chrome is drawn, type stays set** | Buttons, cards, article paper, and chips share an uneven radius, a cocoa pen (`--pen`, the sketch line), and a short offset shadow. Paper surfaces get a faint tooth. The nav bar, progress rail, and hero stay straight. Display type stays Space Grotesk. No handwritten face. |
| **The 40–70% chapter has the bloom** | On the herd pin, each marked cow still grows a pink colony in its own cell. The floor `InfectionBloom` stays quiet through “1 in 5” and grows in from the corners only while the chapter reads 40–70%. |

### Things that already broke once

- Motion `>= 12.37` + string `useScroll` offsets + sticky children → wrong progress, inverted fades. **Stay on `12.36.0`.**
- Too many large looping PNG rains in the Electron/webview → compositor freeze. Keep rain/sprites few and small if they return.
- Hydration: never emit raw `Math.sin` floats into SVG attrs; `toFixed(3)` or static paths.
- Smooth `scroll-behavior` + programmatic `scrollTop` fights sticky pins. Be careful when debugging scroll.
- Fal rembg poll path is the **base app** (`fal-ai/imageutils`), not the nested route.
- Recraft often returns WebP named `.png`. Convert with `sips -s format png` before resize.

---

## 3. Colour theory (locked)

Do not restyle to GreatBay. Tokens live in `app/globals.css`.

| Token | Hex | Use |
|---|---|---|
| milk | `#f6eee0` | Page paper, pour fill, next-section handoff |
| cream | `#eadfcb` | Slightly deeper bands, article card |
| ink | `#1c140f` | Type, dark hero (warm chocolate, not purple-midnight) |
| ink-2 / ink-3 | `#261c16` / `#32251e` | Raised dark surfaces |
| pink | `#e45b88` | Primary aura / infection (dusty rose, not neon) |
| pink-soft | `#f09bb4` | Blush, hero accent |
| pink-deep | `#c4456e` | Article H2s, active rail |
| signal | `#5aaeb8` | Quiet teal readout - not electric cyan |
| signal-deep | `#3d8a93` | Focus-adjacent |
| orange | `#ff8a4c` | Warm mid in gradients only |
| butter | `#f7c65a` | Optimism / dry-lab accent |
| coral | `#ff6f81` | Inflammation (sparse) |
| bio | `#46d19b` | Fresh / wet-lab accent (sparse) |

**How the palette works**

- Surfaces are **milk / cream / ink**. Almost all area is one of those three.
- **Pink + quiet teal** are the two brand signals. Pink = infection / aura. Teal = readout / sensor only. They should never fight for the same sentence. Do not use electric cyan.
- Orange, butter, coral, bio are **softeners**, not a second theme. A page that suddenly goes lime-and-terracotta is GreatBay, not us.
- Dark sections flip to ink. Selection uses signal. Focus ring is `signal-deep`.
- The document root (`html`) is ink, the same as `section-dark`. Overscroll on mobile and Firefox shows that colour. The page surface stays milk on `body`.
- Contrast: ink on milk, milk on ink. Never pink text on cream at small sizes.

### Type

- Display: Space Grotesk (`font-display`), tight tracking, `display-hero` / `display-1` / `display-2`
- Body: Inter
- Kickers: small, tracked, uppercase - **sans, not mono**
- No serif display. No code-looking labels. No chunky comic slab like GreatBay’s wordmark.

### Surfaces

- Default page is milk. Articles sit on **one cream paper card** (`article-paper`), not a stack of cards.
- Ink for the homepage open, every inner-page hero, and the footer. A homepage story beat may also sit on ink.
- Buttons, cards, the article sheet, and chips use one drawn chrome: uneven radius, cocoa pen, short offset. Paper surfaces carry a faint tooth. The nav bar, progress rail, and hero stay straight, and the type stays Space Grotesk and Inter.

### Art rules (this is the GreatBay lesson)

GreatBay works because **every graphic is from one kit**. Mold blobs, magnifying glass, awards badge, body-map icons - same roundness, same gouache, same greens. Nothing looks like it wandered in from another deck.

AURA needs that, in milk / ink / pink / cyan:

1. **One world, one hand.** Cream cow, rosy cheeks, gouache grain, soft outline. If a new asset would not sit next to the mascot without a fight, delete it.
2. **One object per sprite.** Isolated cutout, transparent PNG, ≤512px (drops ≤128px). Compose on the page; do not bake scenes.
3. **Objects are objects.** No faces on flasks, coins, drops, pails.
4. **A small recurring cast.** Mascot scientist, reader cow, grazing cow, pail. Same three or four, every page. That recurrence *is* cohesion.
5. **Materials stay consistent.** Same paper tooth, same highlight, same shadow softness. Do not mix kawaii stickers + photoreal metal + children’s-book landscapes + flat UI icons.
6. **Colour in the art follows our tokens.** Pink for infection / aura, cyan for signal, cream/milk for dairy, ink for line. No leftover GreatBay lime in a sprite.
7. If Fal returns extra people, suns, speech bubbles, or “DOLK” text - delete it. Do not ship it.
8. SVGs only if the shape must animate (graphs, pour column, progress).
9. Professional, not kawaii. The cow can be warm. Props cannot be cute-for-their-own-sake.

Sprite catalog: `lib/art.ts` → prefer `/public/art/images/`; `gen/` only when unsupported (see `ART_UNSUPPORTED` / `ART_UNUSED`).

**Cohesion test:** screenshot the homepage hero, a mid-page beat, and a wet-lab article. If they look like three different brands, the graphics failed - the layout is not the problem.

---

## 4. GreatBay - graphical cohesion only

Primary look-at: [2026.igem.wiki/greatbay-scie](https://2026.igem.wiki/greatbay-scie/)

They won HS Grand Prize **and** Best Wiki. Their *pictures* are the lesson. Their *page geometry* is not a brief.

### What “cohesion” means there

- One motif language (round mold, one mascot, one magnifying glass) used as **the same family** on home, articles, badges, diagrams.
- Line weight, blob geometry, and pigment feel shared. You can tell a GreatBay drawing in one glance.
- Graphics carry the subject (mold in the corner) instead of generic science clipart.
- Enough restraint that the world stays readable: a few shapes, repeated, not a new style per section.

### What that is not

- Not “build a 3D room and put type on the right.”
- Not “cream card on a dark wash with a sticker TOC.”
- Not “copy their nav, pills, or drop-shadow chapter labels.”
- Not “use green and orange because they did.”

Layout, type hierarchy, and motion cost stay in the 21st.dev / AURA sections below. We already have `page-hero` + `wiki-layout`. Keep evolving those as a professional site, not as a GreatBay skin.

### Graphics checklist

- [ ] Every bitmap looks like it came from the same picture-book kit
- [ ] The cow / pail / drop could move from home to Description without a style jump
- [ ] No orphan styles (kawaii, photoreal, UI icon, landscape banner)
- [ ] Art uses our tokens, not leftover generator colours
- [ ] One object in the frame unless a second object is doing a job
- [ ] Motion uses those objects (the pour), it does not paper over mixed assets

---

## 5. Layout rules

### Homepage

- Sticky cinematic hero (tall pin, ~260vh, matching `old-migrate/`) → milk handoff → story beats.
- Beats, in order: mastitis summary (`cowSick`) → cost → current tools → idea → milk-to-signal → DBTL → parlour (siphon in the line). CapsuleStory is kept but unmounted.
- Each beat is **one idea**. If you need a sticker, use one.

Map to the 21st.dev “reader questions” (wiki version, not SaaS):

1. **Hero** - what this is, why keep scrolling  
2. **Problem** - the signal is hiding; the bill is loud  
3. **Failed tools** - SCC, PCR and laboratory testing, pathogen-specific limits; shown, not listed  
4. **Idea / demo** - the biosensor doing the thing (interactive)  
5. **Evidence** - stats that are checkable (€35 billion, about 1 in 5, 40–70%)  
6. **How we work** - DBTL, not a feature bento of fluff  
7. **Next** - read the project pages (one action, repeated)

Skip logo walls, fake testimonials, pricing tables, countdown timers.

### Inner pages

```
[ thin site nav ]
[ kicker + H1 + lede ]     [ one character ]
[ chapter rail ] [ cream paper article ]
                 [ previous / read next ]
```

- Left rail: pink pill on the active H2. Sticky. Hidden below `lg`.
- Paper: numbered pink H2s (`01`, `02`…), figures with captions, callouts for “how to read / pending data”.
- Photo captions are unnumbered. `WikiFigure` uses one short sentence as both the visible caption and the image alt. That sentence says what is happening. Leave out clothing, incidental hands, and lists of objects. If the frame has no activity worth stating, do not use the image.
- Read-next at the end. Optional small reader-cow on the next card - not a collage.
- Progress bar on every page.
- **One H1.** Article title is the H1. Section titles are H2. Catalogue components must not ship a second H1.
- Completion line: one colored sentence at the top of the article banner, under the nav and above the kicker. Green when `done`, butter when `in-progress`, coral when `todo`. Wording comes from the Wiki pages tables in `assets/keep/copy-provenance.md`. No second list, no badge, no box.

### Nav

`lib/nav.ts` groups: Project · Wet Lab · Dry Lab · Engagement · Team.  
That is enough. Do not add a second nav, a floating encyclopedia, or footer dumps of every link above the fold.  
At rest the bar has no plate and no blur. Blur is not used anywhere else on the site, so the bar does not use it either. The bar is a milk wash (70%) over light surfaces and an ink wash (25%) over dark ones. The type is drawn twice, ink and milk. The milk copy is clipped to the part of the bar over a dark surface, so the colour changes on the page edge itself, whether that edge is straight, a wave seam, or the pour's meniscus. The washes are cut on the same line. The ink row is the one that takes pointer and focus; the milk copy is `inert` paint. If blur comes back, turn it off while `navToneClips` reports `split` (an edge inside the bar): blur smears the edge across the line where the type turns.  
`lib/nav-tone.ts` reads the surfaces. `.section-dark` and `data-nav-tone="dark"` are dark, `data-nav-tone="light"` paints light back over them, later elements paint over earlier ones, and unmarked page is light. On an SVG `<path>` (with `preserveAspectRatio="none"`) the cut follows the drawn top edge down to the bottom of its `<svg>`. A new full-bleed dark surface needs `section-dark` or `data-nav-tone="dark"`; a seam or pool that eats into it needs `data-nav-tone="light"`. `WaveSeam` marks itself from its colours.  
The desktop group panel is a child of one milk plate. When a group opens, the plate fades in over the bar and shifts as a single surface, then grows open over 250ms on `--ease-out-soft`. The milk type fades out with it. The links stay put on top. While it is open the plate is solid milk and the type is ink.  
On the homepage, the nav “Read the description” button uses the hero button’s pink style without its glow, at the nav’s earlier size (`text-sm`, `h-9`, `px-5`). It stays faded out while that hero button is on screen, and fades in once the hero button has left the viewport. The fade is opacity over 300ms on `--ease-out-soft`, written as a plain opacity transition so Firefox does not snap it when `pointer-events` changes with the opacity.

---

## 6. Professional UI rules (from 21st.dev et al)

These are **general design rules**, not “install this hero.” Source notes: [Landing page sections](https://21st.dev/blog/landing-page-sections), [Hero patterns](https://21st.dev/blog/react-hero-section-examples), [CTA sections](https://21st.dev/blog/react-cta-section-components), [Animated libraries / cost](https://21st.dev/blog/animated-component-libraries), [Split screens](https://21st.dev/blog/split-screen-layout-components).

### The page

1. **The hero has one job:** make the next scroll feel worth it. Name what this is. One supporting line. Evidence in the frame (the pour, not a stock shot).
2. **Fewer blocks, filled honestly.** A menu of nine SaaS sections is not a checklist. Three honest beats beat nine half-filled ones.
3. **One action, repeated.** Hero, middle, and footer ask for the same thing (keep reading / open Description). Two equal buttons split the response.
4. **Specificity.** “€35 billion a year” beats “mastitis is a big problem.” If a number cannot be checked, do not put it in the hero.
5. **Demo beats description.** The biosensor, readout, and pour must *do the thing*. A 20-second loop of the idea beats two minutes of caption.
6. **Split layouts:** message first, picture second in the markup. A phone must not see decoration before a word. Do not `order` your way out of a bad source order.
7. **Nothing after the close except the footer / read-next.** Extra sections after the ask are a pause, not a finish.
8. **No fake proof.** Four unknown logos, unnamed quotes, or a timer that resets = the page taught the reader to skim.

### Motion cost (three tiers)

| Tier | What | When |
|---|---|---|
| Free | CSS transitions, keyframes, `transform` / `opacity`, `prefers-reduced-motion`, native `animation-timeline` | Almost everything |
| Cheap | One small library doing one job (Motion, already in the repo) | The pour, pins, interruptible sequences |
| Expensive | A second runtime (GSAP + a 3D engine) | Do not. Motion is the animation library. Lenis is homepage scroll only. |

- Animate `transform` and `opacity`. Never `top`, `height`, `box-shadow`, or `background-position` on scroll.
- `prefers-reduced-motion`: render the **end state**, not a shorter duration.
- Do not hide the H1 behind a reveal. Search and first paint need the words in the HTML.
- Do not pull a catalogue runtime (Magic UI, Aceternity, Cult) for one effect. Take the *idea*, write the CSS.
- Scroll hijacking is the fastest way to break a trackpad. Test the pin on a real Mac.

### Assembly traps (catalogue pages fail this)

- Two animation runtimes on one page.
- Every section `"use client"`, HTML arrives empty.
- Three H1s because each block shipped its own.

After any assemble: view source, search `<h1>`, check the bundle.

### What a hero must not do

- Autoplay video above the fold (fights JS for the only second that counts). The pour film is **scroll-scrubbed and paused** - never `autoplay`.
- Block the headline on a font swap. Preload Space Grotesk for the hero face.
- Load an animation library for one parallax.

---

## 7. Motion rules (AURA-specific)

1. **One full-screen event per visit** (the pour). Everything else is quieter: fade, slight parallax, count-up.
2. Scroll owns time. `useScroll` on a pinned section; every transform that must hold includes a **terminal keyframe at progress 1** (`[…, 1] → […, v]`).
3. Handoffs match surfaces. End of pour = `--color-milk`. Next section starts on milk. No dark ring, no grey vignette leftover.
4. `prefers-reduced-motion`: static hero, no pour, no infinite loops.
5. The homepage uses Lenis so the pour stays smooth under wheel and trackpad. Other pages stay on native scroll. Do not add a second smoother.
6. Interactive diagrams (biosensor steps, stakeholder tabs, DBTL wheel) **change the picture**, not just a caption.

### Pour spec (current intent)

- File: `components/viz/bucket-pour.tsx`, driven by `components/home/home-hero.tsx`
- Asset: `public/art/video/pour.webm` (VP9 alpha) + `pour.mov` (HEVC alpha, Safari) + `pour.mp4` (flat-ink fallback) + `pour-poster.png` - generated once via `scripts/gen-pour.mjs` in the cast look from `scripts/look.mjs` (Recraft still on green screen → ffmpeg colorkey → Kling 2.5 i2v on green → colorkey per frame; no rembg, it eats white milk). 1080×1920, 24 fps, 10 s. Checked in. No runtime Fal.
- Scroll owns time: `video.pause()` + `currentTime` from `useScroll`. First ~36% of scroll = dark tip so the H1 stays readable; then the cream flood.
- End of clip crossfades to `--color-milk` so SignalSection never flashes a video-grade mismatch.
- `prefers-reduced-motion`: no video. CSS pour is only a load-error fallback.
- No droplet sprites, no CSS wave marquee, no aura bloom behind the title.

The pour should feel closer to an **Apple product film** than to a Codrops particle demo. One liquid, one fill, one handoff.

---

## 8. Copy rules

- Diagnostic-support concept. **Not** a diagnosis, not a cure, not a replacement for vets. Hardware: the electrical response is interpreted in context, rather than as a direct identification of mastitis.
- Mark pending wet-lab results. Do not imply outcomes. The wet-lab work on `/` is the FAM/BHQ probe screen in buffer against a DNA analogue, not current traces in milk.
- Homepage bill and herd figures match the background paste: €35 billion a year, about 1 in 5 cows, herd-level incidence 40–70%. The uncited “under 15% is treatment” slice stays on the homepage only. The herd picture marks cows; it does not print a “N of 24 cows marked” count. Do not write that early detection pays; the background paste caveats benefits on accuracy, usability, and validation.
- Voice: clear, a bit cinematic, professional. Not cute-for-its-own-sake. Not “revolutionise.”
- When homepage copy names science or results, use the team-written pages (`description`, `background`, `engineering`, `experiments`, `hardware`, and the attribution PCR note). Do not fill INSERT blocks.

---

## 9. Other iGEM wikis (secondary)

Official results: [2024](https://competition.igem.org/results/2024) · [2026](https://competition.igem.org/results/2026)  
History of Best Wiki: [iGEM blog, 2023](https://blog.igem.org/blog/2023/9/13/communicating-with-the-world-through-igem-team-wikis)

**GreatBay first.** Then these, for article density and older patterns - not as the look.

| Team | Why | Wiki |
|---|---|---|
| GEMS-Taiwan 2024 | HS Grand Prize + Best Wiki. Illustrated story. | [2024.igem.wiki/gems-taiwan](https://2024.igem.wiki/gems-taiwan/) |
| GEMS-Taiwan 2023 | Earlier illustrated wiki. Scene → article. | [2023.igem.wiki/gems-taiwan](https://2023.igem.wiki/gems-taiwan/) |
| Lambert-GA 2024 | Recurring HS craft. | [2024.igem.wiki/lambert-ga](https://2024.igem.wiki/lambert-ga/) |
| Lambert-GA 2022 | HS Grand Prize + Best Wiki. | [2022.igem.wiki/lambert-ga](https://2022.igem.wiki/lambert-ga/) |
| Brno 2026 | Overgrad Grand Prize; Best Wiki nominee | [2026.igem.wiki/brno-czech-republic](https://2026.igem.wiki/brno-czech-republic/) |
| Heidelberg 2026 | 1st runner-up; Best Wiki nominee | [2026.igem.wiki/heidelberg](https://2026.igem.wiki/heidelberg/) |
| Freiburg 2026 | Best Wiki nominee | [2026.igem.wiki/freiburg](https://2026.igem.wiki/freiburg/) |
| UZurich 2024 | Best Wiki (overgrad) | [2024.igem.wiki/uzurich](https://2024.igem.wiki/uzurich/) |
| Aachen 2024 | Best Wiki nominee | [2024.igem.wiki/aachen](https://2024.igem.wiki/aachen/) |
| Patras 2024 | Best Wiki nominee | [2024.igem.wiki/patras](https://2024.igem.wiki/patras/) |
| INSA_Lyon1 2022 | Best Wiki | [2022.igem.wiki/insa-lyon1](https://2022.igem.wiki/insa-lyon1/) |
| Patras-Medicine 2022 | Best Wiki | [2022.igem.wiki/patras-medicine](https://2022.igem.wiki/patras-medicine/) |
| Leiden 2022 | Best Wiki | [2022.igem.wiki/leiden](https://2022.igem.wiki/leiden/) |

If a 2022 slug 404s, search the team on [old.igem.org](https://old.igem.org/).

---

## 10. Inspiration index (outside iGEM)

Use for **timing and restraint**. Recolour nothing. Do not import chrome.

### Design-engineer circuit (21st.dev and the rest)

| Source | URL | Use for |
|---|---|---|
| **21st.dev** | [21st.dev](https://21st.dev/) | Live previews of heroes, rails, splits. **Read the blogs; do not paste components.** |
| 21st - heroes | [blog/react-hero-section-examples](https://21st.dev/blog/react-hero-section-examples) | Hero has one job; scroll-as-transition; what makes a hero slow |
| 21st - page order | [blog/landing-page-sections](https://21st.dev/blog/landing-page-sections) | Reader-question order; fewer honest blocks |
| 21st - CTAs | [blog/react-cta-section-components](https://21st.dev/blog/react-cta-section-components) | One action, repeated; risk-removal line |
| 21st - motion cost | [blog/animated-component-libraries](https://21st.dev/blog/animated-component-libraries) | Free / cheap / expensive; CSS-first |
| 21st - splits | [blog/split-screen-layout-components](https://21st.dev/blog/split-screen-layout-components) | Message first in markup |
| Godly | [godly.website](https://godly.website/) | Curated “this is actually good” marketing sites |
| Dark Design | [dark.design](https://www.dark.design/) | Dark UI done with contrast, not murk |
| Landingfolio | [landingfolio.com](https://landingfolio.com/) | Conventional section rhythm |
| Refero | [refero.design](https://refero.design/) | Real product screens, not Dribbble shots |
| Osmo | [osmo.supply](https://www.osmo.supply/) | GSAP / Webflow craft - study easing, don’t add their stack |
| Magic UI | [magicui.design](https://magicui.design/) | Effect catalogue (rewrite in CSS/Motion) |
| Aceternity | [ui.aceternity.com](https://ui.aceternity.com/) | Same - composition only |
| Motion Primitives | [motion-primitives.com](https://motion-primitives.com/) | Small building blocks |
| React Bits | [reactbits.dev](https://www.reactbits.dev/) | Effects + their cost |
| Animations.dev | [animations.dev](https://animations.dev/) | Emil’s interaction notes |
| shadcn/ui | [ui.shadcn.com](https://ui.shadcn.com/) | Primitives under the hood, not a look |

### Award / studio galleries

| Source | URL | Use for |
|---|---|---|
| Awwwards | [awwwards.com](https://www.awwwards.com/) | Current SOTD |
| The FWA | [thefwa.com](https://thefwa.com/) | Cinematic craft |
| GSAP Showcase | [gsap.com/showcase](https://gsap.com/showcase/) | ScrollTrigger done right |
| Codrops | [tympanus.net/codrops](https://tympanus.net/codrops/) | Recreate-able techniques |
| CSS Design Awards | [cssdesignawards.com](https://www.cssdesignawards.com/) | Editorial / type-led |

### Specific sites (pacing, not paint)

| What | URL | Steal this |
|---|---|---|
| Apple product pages | [apple.com/iphone](https://www.apple.com/iphone/) | Scroll = time. One object, full frame. **This is the pour.** |
| Apple AirPods-style writeup | [CSS-Tricks](https://css-tricks.com/lets-make-one-of-those-fancy-scrolling-animations-used-on-apple-product-pages/) | Pin + progress → one visual |
| Locomotive | [locomotive.ca](https://locomotive.ca/) | Scroll as craft |
| Uncommon Studio | [uncommonstudio.com.au](https://uncommonstudio.com.au) | Section-to-section as camera |
| Active Theory | [activetheory.net](https://activetheory.net/) | Pacing only - too heavy to copy |
| Bruno Simon | [bruno-simon.com](https://bruno-simon.com/) | Commitment to one idea, not the 3D |

### How-to

| Resource | URL |
|---|---|
| Motion (what we use) | [motion.dev](https://motion.dev/) |
| GSAP ScrollTrigger (read, don’t add) | [gsap.com/docs/v3/Plugins/ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) |
| Lenis (homepage scroll only) | [github.com/darkroomengineering/lenis](https://github.com/darkroomengineering/lenis) |

---

## 11. Technical constraints (iGEM)

- Static export only. No image optimizer. Use `asset()` for every public path.
- `trailingSlash: true`.
- Wiki freeze is unforgiving - no runtime APIs on the hosted site.
- Keep GPU cheap: few large PNGs, no 30 looping full-res sprites.
- Client components only where motion or pointer needs them. Page shells stay server.

Key files:

| File | Role |
|---|---|
| `app/page.tsx` | Homepage story |
| `components/home/home-hero.tsx` | Pinned hero |
| `components/viz/bucket-pour.tsx` | The pour |
| `components/site/page-hero.tsx` | Inner title + one character |
| `components/site/wiki-layout.tsx` | Rail + paper + read-next |
| `components/site/site-nav.tsx` + `lib/nav-tone.ts` | Clear nav, type split along dark/light page edges |
| `lib/art.ts` | Sprite catalog + scene casts |
| `lib/nav.ts` | IA |
| `app/globals.css` | Tokens + pour/paper utilities |
| `scripts/gen-*.mjs` | Fal generation (keys in `.env`, never commit) |

---

## 12. Rebuild plan (execute this, don’t tour more wikis)

The current kit fails the cohesion test. Recraft stuffed extra objects into “simple” prompts and those files are on the homepage: `icon-clot.png` is two children, `milk-drop.png` is a cow in a droplet, `icon-bucket.png` is a landscape medallion. The mascot and grazing cow are the keepers - same gouache hand. Lock that style. Throw the rest away.

**Vibe:** one illustrated world (GreatBay’s lesson) + whimsical idle (characters breathe) + professional pages (ours / 21st). Not more AI stickers. Not particle rain.

### Fal - so it does not look generated

1. `fal-ai/recraft/v3/create-style` on the keepers (`mascot-scientist`, `cow-grazing`). `base_style`: `digital_illustration/hand_drawn`. Never `child_book`. Never the 5-colour lock (that is what summoned kids).
2. Generate with `style_id`. One object, white background, no text, no face on props. Four variants; pick one.
3. If it has a second object, a person, a circular badge, a landscape, or leftover black - **delete**. Do not crop it into shape.
4. `fal-ai/imageutils/rembg` → PNG → ≤512px. Halo or black disc = regen.

One script. Retire `gen-art` / `gen-theme` / `gen-redesign` sticker pipelines.

### Kit (eight, then stop)

Keep: mascot, grazing cow. Maybe reader if the hand matches.  
Kill: bucket, drop, clot, udder, all `banner-*.png`, unused SVGs.  
Regen: one pail, one faceless drop, one curd, pink flask, milk flask, one coin.

### Motion

- **Once:** the pour (scroll-scrubbed film, not a CSS column).
- **Idle:** breathe / sway / flask glow, 4–8s, a few pixels. Turn `Art` presets back on. No spin, tumble, walk, pointer-chase on articles.
- `Art` idle presets (breathe, float, bob, sway) are CSS keyframes on an inner wrapper, not Motion props. Motion rewrites the inline transform every frame, the sprite repaints, and Chrome and Firefox snap the bitmap to whole pixels, so the scale looks stepped. Keyframes run on the compositor and scale smoothly. Firefox still snaps an axis-aligned transform to whole pixels, so the moving presets add `rotate(0.01deg)`; measured in headless Firefox 157, that took the sprite from 15 of 24 distinct frames to 24 of 24 and cut its drift from the eased curve about 7×.
- **Scroll:** signal beat is one composition (cow flushes pink), not three labeled disasters.
- **Kill:** `PastureScene`, `DriftingMilk`, `MilkRain`, 40-cow grids, Lucide as science pictures, sprite drop-shadows.

### Order

0. Strip broken bitmaps off the pages (CSS pour still reads).
1. Style lock from keepers.
2. Generate the eight.
3. Wire kit + idle life.
4. Homepage as composed illustrations.
5. Article pass: one character, diagrams without Lucide.

Done when hero, signal beat, and a wet-lab article look like one picture-book on a professional site. Then stop generating.

---

*GreatBay-SCIE 2026 for graphical cohesion (one illustrated world). 21st.dev / Godly / Osmo for professional page craft. AURA milk–ink–pink–cyan for colour. Layout is ours.*
