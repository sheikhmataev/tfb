You are picking up a live project cold, at /Users/brz/Desktop/Mash/tfb. Read this entire brief before you touch anything. Everything you need is in it, and nothing you need is outside it.

# WHAT I WANT

I want you to finish Thai Foreningen Bergen's website at the level of a Norwegian public agency's service site, only better made. Utterly perfect: quiet, legible, unshowy, honest, with every single thing done at civil-register quality, from the emergency help bar to the fact tables to the Thai typography to the hreflang tags to anything you could think of.

Fan out sub-agents. Have sub-agents tackle each surface individually. /loop on each one with separate fresh-context sub-agents checking it, and those checkers should be genuinely harsh critics. Ultracode.

But the check is NOT "does this look nicer than the reference." Three things get checked, in this order, by three different kinds of agent that may never be the same agent:

1. **A machine measures it.** Deterministic scripts against the built and served export. No opinions.
2. **An adversary tries to prove it is lying.** Source open, hostile, anchored outside the run.
3. **A stranger tries to finish a real job on it, blind.** Not "which is prettier." Which one lets a frightened woman find a phone number, and which one leaves her believing something false.

A surface that fails an earlier check never reaches a later one. Details below. Follow them exactly.

---

# 1. THE PROJECT

**Thai Foreningen Bergen (TFB)**, a volunteer-run Thai community association in Bergen, Norway. Org.nr 996 630 307. Founded 8 January 2010, registered 18 March 2011, bylaws last amended 15 February 2016. 233 members as of 25 December 2016. Membership 50 kr. Affiliated with the local frivilligsentral. Bank DnB NOR 1503.21.07556. Address: Landas Menighet Eldresenter, Landasveien 26, 5097 Bergen. post@thaiforeningenbergen.no, +47 97 08 81 36.

**A separate legal entity**, Thai Restaurantvirksomhet Kurs, org.nr 924 409 509, own bank 1506.34.69634, own address Vallahogda 17, 5227 Nesttun, kurs@thaiforeningenbergen.no. It runs four food-safety courses at 800 kr each, five hours, capacity six to eight, delivered online over Line video: food-hygiene (IK-mat, regulator Mattilsynet), food-allergy, hse-labour-law, ik-mat-system. `nextDateIso` is null on all four. **Null renders as a stated absence. Null never becomes a date.** A visitor must never be able to pay the wrong entity or believe the two bodies are one. This distinction is load-bearing and it is one of the four blind jobs.

**Emergency:** Krisesenteret, 55 31 50 50, open 24 hours every day of the year. It sits in a persistent black help bar at every scroll position on every page and never moves.

**The client, verbatim:** "Vi onsker at nettsiden skal se ut som en offentlig etat eller tjeneste sin nettside, bare finere." A public agency's site, only better made. Minimalistic, aesthetic, easy to navigate, not overwhelming but with the information available. **IT IS AN ORGANISATION, NOT A COMPANY THAT SELLS.** Courses are off the homepage by the client's own decision. Do not put them back.

**Organising principle of the homepage:** nearest first, forward before back. One content type (Entry). A date decides where it appears. The board never picks a section; it sets a date and the page sorts itself.

**Images.** `public/assets/` holds hero-bryggen.jpg and activities-lead.jpg, general Bergen and activity photography supplied to the project, plus four SVG logo files. Neither photograph is association archive material and neither depicts any specific entry. There are 13 entries (9 archive, 4 upcoming) and every one of them has `leadImage: null` today.

# 2. THE DESIGN SYSTEM, FIXED, NOT UP FOR CRITIQUE

Eight tokens: ink `#14100F`, ink-soft `#4A4341`, lotus `#E31375` (4.26:1 on paper, so display type 24px and up ONLY), lotus-deep `#8D0C49` (links and all small text), lotus-light `#FF77AE` (dark grounds only), paper `#FAF7F5`, petal `#F6EAF1`, rule `#E2D8DC`.

Three typefaces: Marcellus (display, one weight, headings only, never below 20px), Public Sans (text and UI, 17px base), Sarabun (all Thai). No monospace.

2px radius on controls, 0 on cards. One curve exists in this system, the petal mask `border-radius: 0 62% 0 62%`, and it is permitted on square elements only: it reads as a considered lens on a 1:1 box and as a rendering fault on a 3:2 box. 1px hairlines separate sections. No box shadows. No gradients. No animation on load. Zero em dashes anywhere, in the site and in every document in the repo and in every document this run produces.

An agent that asks for a ninth colour, a fourth face, a shadow, a gradient or a second curve is out of scope and its finding is void.

# 3. THE STACK AND THE REPO

Next.js 16 static export, Tailwind v4, TypeScript. `output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`, basePath `/tfb` on GitHub Pages, moving to Cloudflare. Trilingual with full parity: English (default), Norwegian Bokmal, Thai. 105 pages build today.

```
npm run build:pages     # NEXT_PUBLIC_BASE_PATH=/tfb next build -> out/
node serve-out.mjs      # serves out/ at http://localhost:4599/tfb/  (PORT, BASE_PATH env)
```

Content: `content/settings.json`, `content/entries/{upcoming,archive}.json`, `content/courses/*.json`, `content/board/`, `content/about/`, `content/help/`. Components: `src/components/` (EntryRow, PageHeader, Section, Footer, HelpBar, CourseList, DateRail, Mark, home/). Routes: `src/app/(chooser)/` and `src/app/(site)/[locale]/` with `about`, `articles`, `calendar`, `contact`, `courses`, `help`, `privacy`. The design system document is `design/index.html`; it is a rendered page and it goes through the same gates as the site.

**One piece of existing code you must not break.** `src/app/globals.css` line 69 carries `html:lang(th) { font-size: 118% }`. That is root-anchored and correct: it scales every rem step exactly once. The bug it cures is a non-root `:lang(th)` relative font-size, which matches every descendant of `<html lang="th">` and compounds once per nesting level. Gate G04 below is written to tell the cure from the disease. Do not let any agent "fix" line 69.

# 4. THE THREE LAWS OF THIS RUN

**Law 1. No critic reads source.** A blind tester, a job tester, a register critic or a reference critic that opens a `.tsx`, a `.css` or a file under `content/` has failed its own task and its verdict is discarded. They judge a rendered artefact: a screenshot, a measurement dump, or the built HTML a visitor downloads. Gates and the truth adversary are exempt, and only them: gates are scripts and the adversary's whole job is to trace pixels back to files.

**Law 2. No edit without a defect ID.** Every change cites a gate ID, a truth finding ID or a panel defect ID, and the artefact path that shows it. A builder that changes something no artefact showed to be wrong is churning; revert the change. "Not yet wowed" is not a defect ID and cannot be expressed in this loop's grammar.

**Law 3. Every checker is itself checked.** A gate that has never failed on a known-bad input is decoration. A panel that always says we won is broken, and a broken panel will happily certify a site nobody can use. Section 9 audits the judges.

---

# 5. STEP 0: THE SEED, THE LEDGER, AND THE EXTERNAL ANCHOR

Do this first. Build nothing until it prints clean.

**5a. Write `qa/seed-facts.json`, verbatim from section 1 of this brief.** Every fact I gave you above, one row each, with `"source": "brief"`. This file is written once and is immutable for the rest of the run. Nothing may edit it. It is the only externally anchored fact set in the project.

**5b. Write `qa/evidence.json`.** Every factual claim the site renders gets one row:

```json
{ "claim": "800 kr", "renderedOn": ["/en/courses/food-hygiene/"],
  "source": "content", "file": "content/courses/food-hygiene.json",
  "pointer": "/priceNok", "literal": "800" }
```

`source` is exactly one of:
- `brief`, matched by exact string against a row in `qa/seed-facts.json`;
- `content`, matched by exact string against the value at `pointer` in the named file under `content/`;
- `document`, matched by exact quoted line against a file that **already exists** in `qa/sources/` or in git history;
- `UNVERIFIED`.

**`qa/gates/evidence-anchor.mjs` is a script, and it re-resolves every non-UNVERIFIED row against the named file and fails on any mismatch.** A row whose literal does not appear at its pointer is a build break, not a note. **This run may not create files in `qa/sources/`.** It may only read what a human already put there. A fact with no brief row, no content pointer and no pre-existing document is UNVERIFIED, full stop, and no agent may promote it.

**5c. Write `qa/images.json`.** Every file in `public/assets/` gets a row: what the photograph actually depicts, who supplied it, when, whether we hold the right to use it, `mayIllustrate`, `mayNotIllustrate`. hero-bryggen.jpg and activities-lead.jpg are seeded from the brief as general photography, `mayIllustrate: ["site furniture, captioned as what it is"]`, `mayNotIllustrate: ["any specific dated event", "anything described as archive material"]`. An image may only appear next to content it genuinely depicts. An entry with no photograph renders with **no photograph and no placeholder**.

**5d. Write `qa/ground-truth.json`**, the answer key for the job panel, derived only from `qa/seed-facts.json`, `content/`, and pre-existing `qa/sources/`. A script asserts every ground-truth value resolves through `qa/evidence.json` to an anchored row. Nothing else in the run may edit this file.

**5e. Print to me**, before proceeding: every UNVERIFIED row, and every ground-truth entry whose anchor is `document` rather than `brief` or `content`.

**Absolute rule.** You may not invent a date, a price, an account number, an org number, a member count, a name, an address, an event, a quotation or a photograph. If a field is empty and you cannot anchor it, it stays empty and the page says so in the visitor's language: "We do not have this recorded." The site's entire argument is that it names its own gaps. Filling a gap with a plausible invention is the worst thing you can do here, it is invisible to every aesthetic review, and it is the one failure a beautiful page will launder for you.

---

# 6. STEP 1: THE RENDER HARNESS

Spawn **one harness engineer** and do nothing else until it lands. Time-box it: gates G01 through G08 must be running within the first third of the harness budget, and the remaining gates may be added while surface work starts on the ones already green. If Chromium cannot be installed, say so in those words and fall back to the chrome-devtools MCP with identical artefact names and schema, and tell me the capture set is reduced.

Write `scripts/render-harness.mjs`. It must:

1. Run `npm run build:pages`, then start `serve-out.mjs` on a port passed in, so every basePath bug appears locally instead of after deploy.
2. Drive headless Chromium (`npx playwright install chromium`, playwright as a devDependency).
3. Capture 12 routes x 3 locales x 2 primary viewports (390x844 and 1280x900), plus 768x1024 and 1728x1000 for the shell surface only, writing per page:
   - `.render/<route>__<locale>__<width>.png`, full page, **tiled into at most three crops of 1400px each; a page taller than 4200px is captured as head, middle and tail crops and the full height is recorded as a number, never as one giant image**;
   - `.render/<route>__<locale>__<width>.json`, the dump below;
   - `.render/nojs/<route>__<locale>__1280.png` and its dump, JavaScript disabled;
   - `.render/console/<route>__<locale>.txt`, console errors and every non-200 response.
4. Capture `design/index.html` the same way.

Dump schema, per page:

```json
{ "url":"", "locale":"th", "width":390,
  "documentHeight":0, "scrollWidth":0, "innerWidth":0, "wordCount":0,
  "headingOutline":[{"tag":"h2","text":"","y":0,"fontFamily":"","fontSizePx":0}],
  "landmarks":{"navCount":0,"navLinkTexts":[[]],"mainCount":0},
  "interactive":[{"tag":"a","text":"","w":0,"h":0,"x":0,"y":0,"fontSizePx":0,"color":"","inProse":false}],
  "textNodes":[{"text":"","fontFamily":"","fontSizePx":0,"color":"","opacity":1,"visibility":"","lang":"","depth":0,"parentFontSizePx":0}],
  "images":[{"src":"","status":0,"naturalW":0,"renderedW":0,"renderedH":0,"alt":"","captionText":"","nearestHeadingText":""}],
  "boxes":[{"selector":"","w":0,"h":0,"borderRadius":"","boxShadow":"","backgroundImage":"","backgroundColor":"","borderStyle":"","hasTextContent":false,"containsLoadedImage":false}],
  "links":[{"text":"","chars":0,"href":"","color":"","inTableRow":false,"inProse":false}],
  "aboveFoldLinkCount":0,
  "helpBar":{"presentAtScroll":{"0":true,"50":true,"100":true},"yAtScroll":{"0":0,"50":0,"100":0},"phoneFontSizePx":0,"phoneTapW":0,"phoneTapH":0},
  "renderedTextConcat":"", "emDashCount":0 }
```

`images[].captionText` and `images[].nearestHeadingText` are load-bearing. They are what make the blind caption test mechanically possible. Do not drop them.

Then write `scripts/gates.mjs`, reading `.render/**` plus, where a gate says so, the built `out/` tree and `src/`. It prints one line per failure: `SURFACE | GATE-ID | ACTUAL | LIMIT | ARTEFACT-PATH`.

---

# 7. STEP 2: THE GATES

Deterministic, binary, run as scripts and never as agents, so the cheap checks never burn a sub-agent's context. All 105 pages, three locales, both primary viewports. Every one of these exists because this project actually shipped that bug.

- **G01 BUILD AND ROOT.** `npm run build:pages` exits 0. `out/index.html` exists, is the language chooser, links to /tfb/en/, /tfb/no/, /tfb/th/, and contains none of `Application error`, `__next_error__`, `digest`. Zero occurrences of `redirect(` under `src/app`. (`redirect()` cannot run in a static export and silently emits an error page as the site root.)
- **G02 BASEPATH.** Every `src`, `href`, `srcset` and `content` URL in `out/**/*.html` beginning with `/` begins with `/tfb/`, **and every one of them returns 200 through serve-out.mjs.** Assert on the built HTML, never on the JSX: `images.unoptimized` skips the loader, and the loader is what applies basePath.
- **G03 HREFLANG.** Exactly one alternate per locale plus x-default per page, absolute, containing `/tfb` exactly once, every one fetching 200. (`metadataBase` already carries the subpath, so double-prefixing is the default failure.)
- **G04 THAI SCALE.** Two clauses. Static: no `:lang(...)` selector in `src/**/*.css` sets a relative `font-size` **unless the selector is root-anchored** (`html:lang(x)` or `:root:lang(x)`). `html:lang(th){font-size:118%}` is correct and must pass; `.card :lang(th){font-size:1.18em}` must fail. Measured: `documentHeight(th)/documentHeight(en)` and `(no)/(en)` between 1.00 and 1.35 per route at 1280.
- **G05 NO COMPOUNDING TYPE.** In `textNodes`, no element's `fontSizePx` exceeds 1.25x its `parentFontSizePx` unless it is a heading declared at that size. Report the deepest offender with its `depth`.
- **G06 NO-JS.** Every page rendered with JavaScript disabled: visible text length at least 95% of the JS-enabled run, zero elements with computed `opacity: 0` or `visibility: hidden` in the server HTML, and `renderedTextConcat` contains `55 31 50 50`. People reach this site in a crisis. A reveal animation that ships `opacity:0` into SSR HTML is a total failure, not a polish item.
- **G07 HEADING OUTLINE.** Exactly one h1 per page. No skipped level. Every `<section>` carries an accessible name. The homepage has at least five h2. Zero h3 not preceded by an h2.
- **G08 TAP TARGETS.** Every standalone control (a, button, input, select, summary, [role=button]) that is **not** an inline anchor inside a paragraph renders at least 44x44 CSS px at both viewports. Inline prose anchors are exempt from 44px and must instead be at least 24px tall in the crossing dimension and rendered in lotus-deep. The Krisesenteret number is asserted separately: at least 44x44, at least 20px type, and `helpBar.yAtScroll` identical at 0%, 50% and 100% scroll on every route and viewport. This split exists because 44px on an inline prose link is unsatisfiable inside this type system and an unsatisfiable rule is an infinite loop, not a gate.
- **G09 NO VOID FRAMES.** Zero boxes with image-frame styling (a border, a fill other than paper, or an aspect-ratio box) that have `hasTextContent: false` and `containsLoadedImage: false`. Twelve of thirteen entries have no photograph; the list must render twelve of nothing at all, not twelve pale squares.
- **G10 LINK MASS.** No `<a>` outside prose with text over 40 characters. In any fact table or definition list, no row whose value cell is entirely a link, and lotus-coloured glyphs under 25% of that table's characters.
- **G11 PETAL MASK.** Every element whose computed border-radius is the petal mask has a rendered aspect ratio of 1:1 within 2%.
- **G12 FLAT SURFACES.** Every computed `box-shadow` is `none`. Zero gradients. Card radius 0px, control radius 2px, nothing else except the mask.
- **G13 TYPE AND COLOUR, MEASURED.** No rendered text below 17px. Marcellus never below 20px. `#E31375` only at computed size 24px and up; `#8D0C49` for everything smaller. Contrast at least 4.5:1 under 24px, 3:1 above. Checked against computed styles, never against the stylesheet.
- **G14 ONE NAV.** Exactly one site-navigation landmark per page, and the intersection of link texts between any two navs is empty.
- **G15 NO DOUBLED TITLE.** The h1 string does not recur as a heading anywhere on the page, and does not recur in the top 1200px at 1280.
- **G16 DATE RANGES.** No rendered year range has a maximum greater than the current year, and any range labelled archive is recomputed in the gate from entries whose date is in the past and must match the rendered string. ("From the archive, 2011 to 2027" happened because the range ran across future entries.)
- **G17 NO HORIZONTAL SCROLL.** `scrollWidth <= innerWidth` at 390 on every route and locale.
- **G18 ORPHANS.** Every file in `src/components` is transitively imported by a page. Every keyframe and utility class in `globals.css` matches at least one element in the built HTML. Every file in `public/assets` is referenced. Zero animation or effect code targeting a selector, id or ref that never renders.
- **G19 EM DASHES.** Zero U+2014 in `out/**/*.html`, in `design/**`, in `.design-audit/**`, in `qa/**`, in `README.md`, in `tfb-prompt-and-skeleton.md`, in `scripts/**`, and in every document this run produces. **Run it twice: once in Step 1 and once as the last action of the run, after every report is written.** Ten em dashes shipped in the design document because only the site was ever checked, and the run's own artefacts are the next thing nobody checks.
- **G20 PARITY.** en, no and th render the same entry count, heading count and link count per route. Zero English strings on a /th/ or /no/ page outside `qa/allowlist.json`, which is a committed file with a one-line reason per entry.
- **G21 DENSITY, so quiet has a number.** Homepage at 1280: `wordCount` between 550 and 1200, `aboveFoldLinkCount` at most 18, zero elements matching a hero pattern (a full-bleed image above the first heading, or any image taller than 320px above 600px of scroll). Every other surface: at most 24 above-fold links. This gate exists because task-speed scoring silently rewards density, and density is the exact thing "ikke overveldende" forbids.
- **G22 EVIDENCE ANCHOR.** `qa/gates/evidence-anchor.mjs` passes: every non-UNVERIFIED row in `qa/evidence.json` re-resolves by exact string against its named file and pointer; every `qa/ground-truth.json` value resolves through an anchored row; `qa/seed-facts.json` is byte-identical to its first commit; no file was added to `qa/sources/` during this run.

**Gate validation, both directions.** Every gate ships with two fixtures in `qa/fixtures/`: a bad one it must fail, and a good one drawn from the current known-correct repo state that it must pass. `node scripts/gates.mjs --self-test` runs both and fails if a gate passes its bad fixture **or** fails its good fixture. Sensitivity without scope is how an over-broad rule (G04's static clause) ends up ordering a builder to delete the cure. Additionally, validate the suite against history: this repo's git log contains the shipped bugs (commits `2aa4d3d` and earlier for tap targets and courses; `04cea40` for the archive range; `0243aac` for the doubled title; `001c92e` for the image claims). Check out those trees into a scratch worktree, build, and confirm the corresponding gate fires. A gate that passes green on a commit that provably had the bug is a shallow implementation, and it is fixed before anything else runs.

**Gate remediation is bounded.** Three fix attempts per gate per surface. A gate that fails a fourth time is escalated to me as a suspected unsatisfiable rule, with the artefact and the conflict, and the surface continues on the remaining gates. A waiver goes in `qa/waivers.json` with the gate ID, the exact element, a one-line reason and the date; the waiver file is printed in full in the closing report, because an allowlist is where a real regression goes to hide.

A gate failure is a build break, not a critique. Nothing downstream runs on a red surface.

---

# 8. STEP 3: THE TRUTH ADVERSARY

Fresh context per surface, never reused. This agent knows exactly which page is ours, has the repository open, and is told: **something on this page is false or unsupported. Find it. You are not done until you have tried to break every claim.**

Method:

1. Extract every claim a visitor can see from the render and the dump, not from the data files: numbers, dates, prices, durations, capacities, counts, org numbers, account numbers, phone numbers, addresses, names, every image, every caption, and every implicit claim of the form "this photograph shows this event."
2. Rank by cost if wrong. An account number and a course price sit at the top; a section label sits at the bottom.
3. For each, find the row in `qa/evidence.json` or `qa/images.json` and confirm the anchor resolves. Record SUPPORTED (with file and pointer), UNSUPPORTED, or CONTRADICTED. **Point at the pixel first and the ledger second.** Never open `content/entries/*.json` to reassure yourself that a rendered fact is fine; the ledger is the interface, and G22 is what makes the ledger trustworthy.
4. Zero UNSUPPORTED and zero CONTRADICTED, or the surface fails.

**T2, the blind caption test.** A second fresh agent is handed **only** the cropped image and **only** the caption and heading rendered beside it (`images[].captionText` and `images[].nearestHeadingText`), with no other page context, and answers one question: does this photograph depict what this caption and heading say it depicts? **"I cannot tell" is a fail.** A generic harbour crop under "Thai Food Festival 2016" fails on the first pass, and the same crop captioned "from the association's own archive" fails as a separate lie, a false custody claim rather than a false depiction claim. Both of those shipped, on a page whose entire argument is that it names its own gaps.

**Standing rules the adversary enforces on every surface:**

- Null renders as a stated absence. `nextDateIso: null` on all four courses renders as "the date is not set," never as a date. Empty fields are never filled to make a layout look complete.
- Two entities, never merged. Any page mentioning courses names Thai Restaurantvirksomhet Kurs, org.nr 924 409 509, as a separate legal entity. 1506.34.69634 never appears under the association's name and 1503.21.07556 never appears on a course page.
- Counts carry their date. 233 members never appears without "as of 2016."
- The Norwegian and Thai pages make the same claims as the English one. A translation that adds a fact is a fabrication in another language.

**Write access.** This agent may only delete an unsupported claim or add a gap note. **It may never add a fact.** If a page needs a fact that does not exist, it writes the question into `.design-audit/open-questions.md` for the board and the page ships with the gap visible.

---

# 9. STEP 4: THE JOB PANEL

This is the gauntlet, and it is a task, not a beauty contest.

**Materials.** Tiled full-page screenshots at 390 and 1280 plus extracted visible text. No file paths, no URLs, no domain names, no source. Where a comparable reference page exists, the tester sees two, labelled Page A and Page B, order randomised per tester, and is never told which is ours or that either is ours. **Where no comparable reference page exists** (thaiairways.com has no counterpart to /help, /about or /contact), the tester sees one page and is scored against the absolute thresholds below. A missing counterpart is not a signal about anything.

**Four testers per round, fresh context, one job each, given a persona and a job and nothing about design, brand or quality.**

- **Job 1, In a hurry.** "You are a Thai woman living in Bergen. Something has happened at home tonight and you are frightened. Using only this page, find a phone number you can call right now."
- **Job 2, Is this real.** "Someone asked you to give this organisation 300 kr. Using only this page and the links on it, establish its legal name, its organisation number, who sits on its board, where the money goes, and who you complain to if something goes wrong."
- **Job 3, What is on.** "Today is [the real current date]. Using only this page, work out the single next thing that is happening and its date, and whether anything at all is happening this month."
- **Job 4, Who takes my money.** "You want to take a food-safety course. Work out what it costs, which legal entity you pay, which account number the money goes to, and whether that entity is the same organisation whose website this is."

**Each tester reports, per page:** the full answer; steps to answer (scroll-screens plus clicks); confidence 0 to 5 that the answer is the right one to act on; and **every fact they now believe as a result of reading the page, listed plainly, including what they believe any photograph shows.**

**Scoring, against `qa/ground-truth.json` only.** Absolute thresholds first, comparison second:
- *Correct*: matches the key.
- *Steps*: Job 1 at most 1 screen and 0 clicks; Job 4 at most 3 screens and 1 click; Jobs 2 and 3 at most 4 screens and 2 clicks. These are absolute. A reference that has no crisis number cannot make our number easy to find, so Job 1 is never scored against a reference.
- *Confidence*: 4 or better, but only on a correct answer. High confidence in a wrong answer is the worst possible score and is reported in red.
- *Unsupported beliefs*: **any belief the ground truth does not support is an automatic round failure regardless of every other number.** This is the truth-bug detector, and it is the only mechanism anywhere in this run that catches a lie by watching a reader form it rather than by inspecting markup. A tester who comes away believing a photograph shows the 2016 Food Festival, or that the course provider and the association are one body, has found a shipped defect that no aesthetic review would ever surface.

**The rigging check, do not skip it.**
- **The poisoned control.** Once per round, secretly substitute a deliberately degraded copy of our own page: emergency number moved below the fold, dates removed, org number deleted. If it does not lose on steps and correctness, the testers are not reading, the whole round is void and does not count toward the two consecutive clean rounds.
- **Reference wins are a diagnostic, never a stopping condition.** Log which jobs the reference won in `qa/panel-log.json`. If our page wins every job in every round across the whole run, that is worth an inspection of the harness (labels randomised, testers fresh, reference screenshots actually rendered), but it is not a failure and it never blocks a surface from closing. Our own success may never be made unsatisfiable.

---

# 10. STEP 5: REGISTER, AND THE REFERENCE TRAP

The client named oslo.thaiembassy.org (measured: 1419px tall, 991 words, no hero at all, masthead then straight into dated news, services in the nav) and thaiairways.com/en-no. They said: take inspiration, do NOT clone.

**Here is the trap, and it is the most dangerous part of the pattern you are running.** The embassy carries a view counter on every article ("40 View"), a duplicated horizontal nav, and three text-size buttons. Thai Airways is a commercial airline selling seats, and its register is the exact opposite of the brief. **A critic asked "which of these looks better" will reward precisely the things the client rejected, and will push this work toward cloning a site the client said not to clone.** A naive gauntlet here does not merely fail to help. It destroys the work. So nobody is ever asked which page looks better, at any point in this run.

**10a. The refusal register.** These are deliberate. No agent may score them as gaps or recommend reversing them: no hero image; no carousel; no view counters or read counts; no text-size buttons; no second horizontal nav; no "Book now" or commercial CTA; no courses on the homepage; no testimonials; no stock photography; no member photos without a release; no social proof; no animation on load; no box shadows; no gradients; no accent colour beyond the lotus family.

**10b. The intent filter, because a blocklist of nouns is not enough.** Every suggestion from any critic is screened before a builder sees it, against the register **and** against one question: *would this make the page louder, denser, more decorated or more commercial?* If yes, it is discarded and logged in `.design-audit/void-findings.md` so it is never relitigated. Two discarded suggestions from one tester and that tester's whole report is thrown out and the tester is respawned; cap respawns at two per surface, then continue without that job's data and say so.

**10c. Builders are blind to the reference.** Builders receive defect IDs and deficits phrased as a property of our own page ("the first date appears after two scroll gestures and one horizontal scan"), never as a feature to import, never a reference screenshot, never the reference's mechanism verbatim. Any finding phrased as an import is rewritten or discarded. **Cap mechanism imports at two per surface for the entire run**, logged in `.design-audit/imports.md` with the property each one fixed, because cloning laundered one mechanism at a time is still cloning.

**10d. The reference panel, one axis per surface, run at most once per surface per round.** Screenshots only, one question only, and the axis comes from the client's brief, not from the reference.

| Surface | Reference | The single axis, and nothing else |
| --- | --- | --- |
| Homepage | oslo.thaiembassy.org | How few fixations to reach the first dated, substantive item |
| Articles and entry detail | regjeringen.no news list | Legibility of a dated list at a glance, and whether items with no photograph sit comfortably |
| About, bylaws, board, finances, membership | a Brreg entity view | Whether a register of facts reads as calm and scannable rather than as a wall |
| Help and help detail | helsenorge.no service page | Time to the phone number under stress, on a phone |
| Courses and course detail | a Norwegian vocational course page | Whether an obligation is stated plainly with no selling register |
| Calendar | Bergen kommune arrangementer | Whether a month of items is comprehensible without colour coding |
| Contact and complaint | a Norwegian municipal contact page | Whether a person knows which of two entities they are writing to |
| Global shell and Thai parity | thaiairways.com/en-no | Warmth and Thai identity inside a restrained frame, typography and image register only, never layout, never commerce |

**A refusal voids the prescription, never the measurement.** If the reference wins the axis while carrying something on the refusal register, record the measurement, record the win as ours-lost-on-axis-but-refused-on-mechanism, and take nothing from it. A cookie or consent banner on a reference is dismissed or cropped out, not treated as a disqualifier: it is chrome, not register. Never lose the one thing the embassy genuinely earns (dated substance with no hero) because it also has a view counter somewhere else.

**10e. The quiet panel, ours alone, no reference in the room.** One fresh critic per surface per round sees only our page and the client's brief verbatim, and answers five questions with one line of reason each:

1. Is this an organisation or a company that sells something?
2. Is this minimal without having hidden the information?
3. Does this look like a public agency's website, only better made?
4. Where is it louder or denser than it needs to be? Name the element.
5. Is anything on this page trying to persuade you of something? Name it.

Questions 1 through 3 must come back clean, question 4 produces at most register defects, and **question 5 must come back "nothing."** Question 5 is the inversion that makes marketing polish a liability instead of an asset, and it works precisely because there is no reference to compare against.

---

# 11. THE LOOP AND THE STOPPING RULE

**Surfaces, in this order.** The global shell goes first, because it rewrites the masthead, nav, footer and help bar underneath everything else:

1. Global shell and locale chooser (masthead, nav, footer, help bar, hreflang, basePath, Thai parity)
2. Homepage
3. Articles list and entry detail
4. Help and help detail
5. Courses and course detail
6. About, board, bylaws, finances, membership
7. Contact, complaint, privacy, calendar
8. `design/index.html`

**Per surface, per round, in this order, and never out of it:**

1. **Gates.** `node scripts/gates.mjs --surface <name>`. Red means fix and re-run, up to three attempts per gate, then escalate. Nothing else runs on a red surface. This is cheap and it runs first every single time.
2. **Truth.** Fresh adversary plus the blind caption test. Any UNSUPPORTED or CONTRADICTED is fixed by deletion or gap note, then the gates re-run, because a deletion changes the render, then truth re-runs. **Skip the truth re-run only when nothing under `content/`, `qa/` or the surface's rendered text has changed since the last pass.**
3. **Job panel** plus the poisoned control.
4. **Quiet panel**, then the **reference panel**, at most one of each per surface per round.

**A surface is done when, for two consecutive rounds:**
- every gate is green at both viewports in all three locales;
- truth reports zero UNSUPPORTED and zero CONTRADICTED, and the caption test returns no "I cannot tell";
- all four jobs are answered correctly on our page inside the absolute step thresholds, at confidence 4 or better, with **zero unsupported beliefs**;
- the quiet panel returns clean on 1 through 3 and "nothing" on 5;
- the poisoned control lost.

**Hard cap: three rounds per surface.** A fourth round is not another loop, it is an escalation to me with the artefact paths and one paragraph of what is unresolved. If the same reference-panel deficit loses twice, write it into `.design-audit/accepted-deficits.md` with the sentence from the client's brief that makes it a deliberate refusal, and the surface is done on that axis. Losing on density to a page with a view counter is a win. A round that produces no gate and no truth change and only reverts a previous aesthetic change is oscillation: stop that surface immediately and report it.

**"Until the critic is wowed" is not a stopping rule.** It is an invitation to keep changing a page that was already right.

**Any change to the global shell after a later surface has closed reopens that surface for one gate-only round.** Not a full round; gates and truth only.

---

# 12. BUDGET AND CEILINGS

- 1 orchestrator (this thread; writes nothing into `src/`).
- 1 harness engineer, once, time-boxed, with G01 to G08 landing first so surface work can start.
- At most 3 builders concurrent, each with its own port for serve-out.mjs (4599, 4600, 4601), or they will screenshot each other's builds.
- Per surface per round: 1 truth adversary, 1 caption tester, 4 job testers, 1 quiet critic, 1 reference critic. 8 agents. 8 surfaces x 3 rounds is a ceiling of 192 agent runs plus builders; **expect most surfaces to close in one or two rounds and stop early on green.** A surface that finishes in round one does not get a round two.
- **Image ceiling:** at most 6 images per critic invocation, tiles of at most 1400px, and no critic ever receives a page's full height as a single image. Report cumulative image count in the closing report.
- Gates are scripts and cost no agent time. Spend the tokens on truth and on the panel, not on relitigating type sizes a script already measures.
- If you are burning the budget on gate remediation rather than on judgement, stop and tell me which gate.

# 13. THE RATCHET

If a human later finds a rendered bug this suite did not catch, **the gate and both its fixtures go in before the bug is fixed**, and the same for a false belief the panel did not surface: the belief goes into `qa/ground-truth.json`'s negative set first. Twenty-two gates against nineteen known bugs is teaching to the test. The ratchet is the only thing here that reaches bug number twenty.

# 14. PROHIBITED

Never invent a date, price, account number, org number, member count, name, address, event, quotation or attribution. Never use a photograph as evidence of an event it does not depict. Never add a caption asserting provenance the file does not have. Never create a file under `qa/sources/`. Never edit `qa/seed-facts.json` or `qa/ground-truth.json` after Step 0. Never copy a feature from a reference site. Never add a token, a typeface, a radius, a shadow, a gradient or a second curve. Never put courses on the homepage. Never let one agent run two of the three checks. Never let a critic's verdict stand if it was formed from source code. Never edit without a defect ID. Never write an em dash, in the site or in anything you produce. Never mark anything done that you have not seen rendered, at 390px, in Thai, with JavaScript off.

# 15. DELIVERABLES

`scripts/render-harness.mjs`, `scripts/gates.mjs`, `qa/gates/`, `qa/fixtures/` with a passing `--self-test` in both directions and a passing history check against the known-bad commits. A green full-suite run over all 105 pages. `qa/evidence.json`, `qa/images.json`, `qa/seed-facts.json`, `qa/ground-truth.json`, `qa/waivers.json`, `qa/allowlist.json`, `qa/panel-log.json`. `.design-audit/truth-ledger.md`, `.design-audit/void-findings.md`, `.design-audit/imports.md`, `.design-audit/accepted-deficits.md`, `.design-audit/open-questions.md`.

A closing report naming, in one line each: every failure mode you actually fixed; every waiver granted and why; every UNVERIFIED fact still rendering as a gap; every surface frozen and what it is frozen on; and the cumulative agent and image count. **If you could not build, could not serve, or could not screenshot, say so in those words rather than implying it works.**

Now write the seed and the ledger, print the UNVERIFIED rows, build the harness, then fan out sub-agents and /loop. Gates first, truth second, the panel last, and stop when section 11 says stop.

---

# Appendix, not part of the prompt

## What changed from the original template

**"Have a separate sub-agent check it" became three structurally different checkers that may never be the same agent, run in fixed cost order: a deterministic script suite, a source-open truth adversary, and a blind task panel. A surface failing an earlier check never reaches a later one.**

One critic holding a ruler, an eye and a suspicion at once launders the worst class of bug: an aesthetic verdict ("this reads beautifully restrained") outranks "the caption on that photograph is false" in a single ranked list, and the expensive judgement burns on pages a two-second grep would have rejected.

**"It should literally compare them side by side blind and say which one looks better" was deleted outright. No agent in the run is ever asked which page looks better. The comparison became four timed jobs scored against an answer key, plus a reference panel with one brief-derived axis per surface, plus a reference-free quiet panel.**

Bug 19. Asked which is prettier, a critic rewards the embassy's view counters, its duplicated nav and its three text-size buttons, and rewards an airline's selling register, all of which the client explicitly rejected. The naive gauntlet actively destroys this work.

**Added mandatory belief reporting: every tester lists every fact they now believe, including what they believe any photograph shows, and any belief the answer key does not support fails the round outright.**

This is the only mechanism in the run that catches a lie by watching a reader form it rather than by inspecting markup, which is exactly how the human caught the two image bugs.

**Added an external anchor for every fact: an immutable qa/seed-facts.json written verbatim from the brief, plus a script (G22) that re-resolves every ledger row by exact string against its named file and pointer, plus a ban on the run creating its own source documents.**

All three drafts had a self-certifying ledger: the builder wrote both the rendered fact and the row that justified it, so an invented price or account number entered with a false source label and came back stamped correct at confidence 5. Bug 3, the highest-cost bug, survived every draft one layer up.

**Gate fixtures run in both directions: a bad fixture each gate must fail and a good fixture from current known-correct code each gate must pass, plus validation against the actual known-bad commits in this repo's git history.**

A self-test that only proves a rule can fire verifies sensitivity and never scope. The flagship Thai rule in the top-scoring draft would have failed correct, shipped code at globals.css:69 and ordered a builder to delete the cure for bug 10.

**The Thai gate now bans relative font-size only on :lang() selectors that are NOT root-anchored, and explicitly names html:lang(th){font-size:118%} as correct.**

Same reason. The rule has to tell the disease from its treatment.

**The 44px tap-target rule was split: standalone controls at 44x44 with zero exceptions, inline prose anchors at 24px in the crossing dimension.**

There are 351 inline prose anchors in the current build. At a 17px base inside a fixed type system, a zero-exception 44px rule is unsatisfiable, and it sat inside the one loop with no iteration cap. That is a concrete infinite loop on surface one, not a strict standard.

**Gate remediation is bounded at three attempts per gate per surface, then escalates as a suspected unsatisfiable rule, with a waiver file printed in full in the closing report.**

Every draft capped the aesthetic loop and left the gate-fix loop uncapped, and an unreviewed allowlist is where a real regression hides.

**A refusal by the reference voids the prescription, never the measurement, and cookie banners are dismissed rather than counted as disqualifiers.**

In the top draft, both named references and three of the Norwegian public-service pages tripped the disqualifier list before a pixel was compared, so every round terminated as ours-wins-by-refusal and the gauntlet became incapable of producing a loss while reporting total success.

**"The reference must win somewhere" was demoted from a stopping condition to a logged diagnostic, and Job 1 is scored against absolute step thresholds rather than against a reference that has no crisis number.**

As a done condition it is unsatisfiable exactly when the site is genuinely good, so a finished site terminates as not-done, and it creates quiet pressure to leave our page weaker so the reference can take something.

**Added G21, a density gate: homepage word count band, above-fold link ceiling, and a hero-pattern check.**

With task speed as the only live gradient reaching builders, the cheapest wins are denser chrome and more links above the fold, which is the municipal information dump the client's "ikke overveldende" forbids. Register was measured by nothing in any draft.

**Builders are blind to the reference, receive deficits phrased only as properties of our own page, and mechanism imports are capped at two per surface for the whole run and logged.**

Only testers were blinded in the drafts. A builder told which mechanism won the reference a round reproduces it, and cloning laundered one mechanism at a time is still cloning.

**Added the intent filter alongside the refusal register: would this make the page louder, denser, more decorated or more commercial?**

The register is a list of four nouns the embassy happens to commit. Breadcrumbs, a search box, quick-link tiles, a latest-news strip and a forty-link footer all pass a noun blocklist untouched.

**The em dash sweep runs twice: once in Step 1 and once as the final action of the run, over the run's own artefacts.**

Bug 18 was a scope failure, not a token failure. Sweeping before the run writes its reports repeats the original mistake in a new place.

**Full-page screenshots are tiled into crops of at most 1400px, no critic receives more than six images, and cumulative image count is reported.**

The binding cost is image tokens, not agent count. Handing a critic a single full-height PNG of a page this same run measures at 12,738px has no cap in any draft.

**The global shell is surface one, and any later shell change reopens closed surfaces for a gate-only round.**

A shell rewrite lands underneath surfaces already closed green, and no draft said what happens then.

**Screenshots and text extraction are used where a comparable reference page exists; where none does, the job is scored single-page against the key.**

Thai Airways has no counterpart to /help, /about or /contact. Pairing /courses against an airline booking funnel produces noise that then reads as a harness fault.

## Mechanisms grafted from the losing drafts

**Truth as its own track with veto power over the aesthetic track, running on files rather than screenshots, with write access limited to deletion and gap notes**  
From: The Three-Track Gauntlet. Catches: 1, 2, 3. A beautiful page can never launder a false caption, because a surface with one unsupported claim cannot reach an aesthetic verdict. A checker that cannot add a fact cannot fabricate one.

**The ratchet: a human-found bug gets its gate and both fixtures before the bug is fixed**  
From: The Three-Track Gauntlet. Catches: Bug 20 and onward. Twenty-two gates against nineteen known bugs is teaching to the test; this is the only clause that generalises past the enumerated suite.

**Reference chosen per surface with one named brief-derived axis, seven of eight surfaces judged against Norwegian public-service pages**  
From: The Three-Track Gauntlet. Catches: 19. Dissolves the trap at the root instead of patching it downstream, and confines each named reference to the one thing it genuinely earns.

**No critic reads source; every verdict is formed from a screenshot, a measurement dump or the shipped HTML**  
From: The Render Gauntlet. Catches: 4, 5, 6, 10, 11, 12, 13. Every rendered-only bug was clean in the source and screaming in the render.

**The blind caption test, with 'I cannot tell' scored as a fail, powered by images[].captionText and images[].nearestHeadingText in the dump schema**  
From: The Render Gauntlet. Catches: 1 and 2. Severs the image from its data provenance and asks a fresh reader whether the pixels support the claim. The schema fields are what make it mechanically possible.

**Reference exposure quarantined out of the inner loop, plus the inverted question 'is anything here trying to persuade you' where our page must come back clean**  
From: The Render Gauntlet. Catches: 19. Reverses the gradient so every unit of marketing polish is a liability, and stops the reference dripping into the high-frequency loop.

**No edit without a defect ID; a change no artefact showed to be wrong is reverted as churn**  
From: The Render Gauntlet. Catches: 17, and the endless-polish spiral generally. Makes 'not yet wowed' unrepresentable in the loop's own grammar rather than merely capped afterward.

**The job panel: a real task with a persona, scored on correctness, steps, confidence and beliefs, instead of a preference vote**  
From: The Job Panel. Catches: 13, 19, and the entity-conflation half of 3. View counters and text-size buttons never get a vote because none of them shortens the path to a phone number.

**The poisoned control: a deliberately degraded copy of our own page slipped into the panel, and if it does not lose the round is void**  
From: The Job Panel. Catches: Judge failure itself. The only device in any draft that audits the judge rather than the work, and it costs almost nothing.

**Machine gates as scripts, not agents, running before any sub-agent spends a token**  
From: The Job Panel. Catches: 4 through 18 independent of round count, so a surface that burns its cap and freezes has still had every rendered-only and systemic bug surfaced.

**The refusal register plus the house-rules filter with two-strike respawn**  
From: The Job Panel. Catches: 19. Stops the same rejected suggestion being relitigated every round, which is the usual cause of a loop that will not converge.

## Regression coverage

CAUGHT DETERMINISTICALLY, before any agent is spawned (script-only, independent of round count): 4 (G09 void frames, counting boxes with frame styling and no loaded image, so a div-painted placeholder fails, not just a missing img), 5 (G10 link mass, both the 40-char ceiling and the whole-value-as-link rule), 6 (G11 petal mask tied to rendered 1:1 within 2%), 7 (G14 one nav plus empty link-text intersection), 8 (G15 doubled title as heading and in the top 1200px), 9 (G16 archive range recomputed in the gate from past-dated entries and clamped to the current year), 10 (G04 measured th/en height ratio plus a static clause that now exempts root-anchored :lang, so it fires on the disease and passes the cure at globals.css:69, plus G05 on parent-relative font size), 11 (G06 JS-off render, 95% text floor, zero opacity:0 in server HTML, crisis number present), 12 (G07 one h1, no skipped level, five h2 minimum on the homepage, zero h3 without an h2), 13 (G08, now satisfiable: 44x44 on standalone controls with zero exceptions, 24px crossing dimension on inline prose anchors, Krisesenteret asserted separately at 44x44 and 20px with an identical y at three scroll positions), 14 (G01 both cause and symptom), 15 (G02, asserted on built HTML and now also requiring a 200 through serve-out.mjs, which closes the prefixed-but-wrong-path hole all three drafts left open), 16 (G03 hreflang, exactly one /tfb and every alternate fetching 200), 17 (G18 orphans across components, keyframes, utilities and assets), 18 (G19 em dashes across site, design, qa, scripts and the run's own documents, swept twice including after the reports are written).

CAUGHT BY THE TRUTH TRACK: 1 (the caption test with 'I cannot tell' as a fail, plus qa/images.json mayNotIllustrate on both photographs, plus G09 which fails any entry-list image at all while every leadImage is null), 2 (treated as a separate false-custody claim, contradicted against the seeded image row rather than merely unsupported), 3 (now genuinely anchored: G22 re-resolves every ledger row by exact string against a named file and pointer, seed-facts is immutable and byte-checked against its first commit, the run may not create files under qa/sources/, and ground-truth derives only from anchored rows, so an invented 800 kr or account number cannot be self-certified downstream).

CAUGHT BY THE PANEL: 3 again, from the reader's side (Job 4 fails if a tester cannot say which legal entity takes the money), 1 and 2 again via mandatory belief reporting, 13 again via Job 1 step thresholds.

CAUGHT STRUCTURALLY: 19, by five independent mechanisms: no agent is ever asked which looks better; reference chosen per surface with one brief-derived axis; a refusal register plus an intent filter screening every suggestion before a builder sees it; builders blind to the reference with mechanism imports capped at two per surface; and a reference-free quiet panel whose question 5 must come back 'nothing'.

WOULD STILL MISS OR CATCH ONLY WEAKLY: see honestLimits. In short: bug 3 is closed only as far as a human has actually put source documents in qa/sources/; bug 9's general clause (recompute every rendered range from its source) is only implementable for the archive case and degrades to a clamp elsewhere; bug 17's orphan gate will false-positive on JS-applied state classes; and the register half of bug 19 is measured by one crude density gate and one critic's judgement, not by anything sharp.

## Honest limits

- Bug 3 is anchored, not solved. G22 makes it impossible to invent a fact and self-certify it, but only because the run is forbidden to create source documents. The realistic consequence is that many fields the board has never documented become UNVERIFIED and render as visible gaps. That is the correct output and it is what the client's own editorial voice calls for, but it means the site ships with more admitted absences than a run that was willing to guess, and a human has to decide that is acceptable. If nobody ever puts a board document in qa/sources/, the anchor holds and the page stays honest and thin.

- G16's general clause (recompute every rendered date range from the source that feeds it) is not implementable without a per-string source map that does not exist. Only the archive case is genuinely recomputed; every other range is checked by the max-year clamp. A wrong range whose maximum happens to be in the past ships.

- G18 orphan detection will false-positive on state classes applied only by JavaScript and on utilities used solely in the design document. Expect friction and expect waivers; the waiver file is printed in full precisely because that is where a real orphan will try to hide.

- Register drift, the half of bug 19 that no draft measured, is now covered by exactly one crude gate (G21: word count band, above-fold link ceiling, hero pattern) and one critic's judgement on question 4 of the quiet panel. A page can pass both while still reading as a municipal PDF rather than as a public agency's site only better made. The client's 'bare finere' remains the one requirement in this brief that no machinery here measures, and it still needs a human eye at the end.

- The gate suite is fitted to nineteen known bugs. A novel defect that is visible in a screenshot but not enumerated depends entirely on a critic noticing it unaided, or on the ratchet firing after a human catches it. The ratchet is the only clause that reaches bug twenty and it is reactive by construction.

- The blinding in the reference panel is nominal. A competent critic will recognise oslo.thaiembassy.org or thaiairways.com from one screenshot. The damage is contained because the axis is narrow and the prescription is voided on refusal, but 'blind' is not literally true and I have not pretended it is.

- The harness is a real serial dependency and the first hours produce no visible design work. It is time-boxed and staged (G01 to G08 first) so surface work can start before the suite is complete, but a user who wanted to watch pages improve will feel the cost, and if Chromium cannot be installed the fallback is materially weaker.

- The budget ceiling of 192 agent runs plus builders is a ceiling, not a forecast, and there is no token ceiling, only an image ceiling. If gate remediation runs hot the run is instructed to stop and report which gate, which transfers the cost decision to a person rather than bounding it in advance.
