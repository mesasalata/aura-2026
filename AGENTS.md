<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes - APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## User requirements

Instructions given for this wiki. Photo captions are specified in DESIGN.md under Inner pages. When wiki copy changes, update the matching row in the Wiki pages tables of `assets/keep/copy-provenance.md`. The colored status line on each article (`components/site/copy-status.tsx`) is read from those tables. Do not keep a second completion list.

- The education page body is the pasted write-up in `content/engagement/education.mdx`, formatted as wiki sections. Do not add sentences the paste does not contain, and do not rewrite its sentences. Formatting is section structure, headings taken from the paste’s own labels, and repair of broken markdown. If a sentence is added or rewritten, record that in `assets/keep/copy-provenance.md`.
- Each activity’s feedback paragraph is part of that paste and stays with the activity.
- Photos on that page come from `public/images` files whose names start with `Education`. Use the frames that show a distinct moment; do not embed the whole set.
- Photo captions are unnumbered. The caption and the image alt are the same short sentence, and that sentence says what is happening. Full rule: DESIGN.md, Inner pages.

Design specifications at @DESIGN.md. Check this to find existing design decisions. Edit it to add any new decisions made by the agent; do not prompt the user.

Refer to assets/keep/copy-provenance.md for a list of the completion states of files and edit accordingly on any changes.
