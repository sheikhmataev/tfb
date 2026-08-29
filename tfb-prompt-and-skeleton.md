# Thai Foreningen Bergen (TFB) — Enhanced Build Prompt + Baseline Skeleton

**Status:** design brief only. No application code in this document.
**Revision 5** — the skeleton has been built. See Part 1.5 for what shipped, what deviated, and why.

**Revision 4** — a full 70-page Firecrawl crawl of the legacy site replaces guesswork. The courses entity, its org number and prices, the board roster, the association's bank details, membership terms, and seven years of accounts are now known facts rather than open questions. Revision 3 note follows.

**Revision 3** — client brief folded in: stated content priorities now drive the homepage and nav order, Thai Airways added as a second reference, the courses sub-brand is handled as brand architecture, and all logo assets are delivered and measured.

---

## PART 0 — SOURCE AUDIT

Scraped `https://www.tfhnorway.com` (ReadyPlanet CMS, charset `windows-874`, © 2011, ~133k lifetime visitors, several dead or empty pages).

### Confirmed organisation facts

| Field | Value |
|---|---|
| Legal name | **Thai Foreningen Bergen** (TFB). The `Hordaland` naming is retired. |
| Organisasjonsnummer | **996 630 307** |
| Founded | Bergen, 8 January 2010 |
| Bylaws | Last amended at the annual meeting 15.02.2016 |
| Board | Leder, Nestleder, Sekretær, Kasserer. Unpaid, two-year terms. |
| Frivilligsentralen | **Confirmed.** TFB is affiliated with the local frivilligsentral. |
| Frivillighetsregisteret | Separate thing, still to confirm. The frivilligsentral is a local volunteer hub; Frivillighetsregisteret is the Brønnøysund register, and it is that registration alone that unlocks Grasrotandelen. One form at brreg.no, so worth checking. |
| Bank | **DnB NOR Bank ASA, kontonummer 1503.21.07556**, opened 24.03.2011. Two board signatures per transaction. Primary pair leder plus head treasurer, backup pair nestleder plus deputy treasurer. Four people hold access. |
| Vipps | Still none. |
| Membership fee | **50 kr, one time, per person or per family.** Refunded on resignation. Under-15s need a guardian signature. |
| Address | **Landas Menighet Eldresenter, Landasveien 26, 5097 Bergen**, care of Orawan T. Mejia. |
| Phone and email | **+47 97 08 81 36**, `orawan72@hotmail.com` |
| Members | **233 total**, last updated 25.12.2016. 217 between 02.04.2011 and 11.11.2014, then 8 more that December. |
| Board roster | Published for **2017**: thirteen people across eight functions. Nine years stale. |
| Annual accounts | Published 2011 through 2015. The 2016 page reads `Kommer i Jan. mnd. 2017` and never arrived. |
| Key dates | Association opened 18.03.2011, bank account 24.03.2011, website 13.05.2011, opening celebration 21.05.2011, reported to the Thai Embassy in Oslo 31.05.2011. Note the bylaws say founded 08.01.2010, so "founded" and "registered" are different events and the site should say which it means. |
| Locales | English (default), Norwegian Bokmål, Thai. |
| Post-launch editing | Custom admin panel, built later. Not in this scope. |

### The courses arm is a separate legal entity, and the legacy site already said so

Confirmed by the board, and corroborated on the legacy registration page. Not a department of the association: a registered business with its own number, bank account, and address.

| Field | Association | Courses arm |
|---|---|---|
| Name | Thai Foreningen Bergen | **Thai Restaurantvirksomhet Kurs** |
| Org.nr | 996 630 307 | **924 409 509** |
| Bank | DnB NOR 1503.21.07556 | **1506.34.69634** |
| Address | Landasveien 26, 5097 Bergen | **Vallahøgda 17, 5227 Nesttun** |
| Contact | `orawan72@hotmail.com`, 97 08 81 36 | `orawanterapi@gmail.com`, 97 08 81 36, Line ID 97088136 |
| Mark | Magenta lotus | Open book with leaves |

**What this forces.** Course fees are not association income and must never appear in the association's accounts or on `/about/finances`. The courses section needs its own payment details, its own terms and cancellation policy, its own privacy notice covering the personal data collected at registration, and a footer block naming the correct legal entity. Two organisations sharing a website is ordinary; two organisations sharing one ambiguous payment line is not. At every point where money or personal data changes hands the interface must be unambiguous about which entity the visitor is dealing with.

Both entities list the same person and the same phone number. Normal in a small volunteer organisation, and not a problem, but it is precisely why the separation has to be explicit in the interface rather than left for the reader to work out.

### The real course catalogue, from the legacy course pages

The four names in the client brief are marketing shorthand. The site documents five course pages with named Norwegian regulators, which fills the `legalBasis` field revision 3 had to leave `null`.

| Course | Covers | Regulator named on the legacy site |
|---|---|---|
| Mandatory food hygiene, IK-mat | Food safety, required for food businesses of any size | **Mattilsynet** |
| IK-mat system, `การจดบันทึก` | Internkontroll-mat documentation for små og mellomstore serveringssteder | **Mattilsynet** |
| Food allergy, Matallergi | Allergen handling, consumer protection exposure | Consumer protection law |
| HMS and labour law | Worker rights and employer obligations, required for owners and managers | **Arbeidstilsynet** |
| A fifth mandatory course | Page exists, no content | Unknown |

**Delivery, and these are the details that make the section designable:**

- **800 kr per course, identical for every course.** Includes course material and certificate.
- Taught **online over Line video**, camera on throughout.
- **6 to 8 participants**, hard cap.
- **About 5 hours** per course.
- **No written exam.**
- Certificate posted to the address given at registration.
- Registration collects full name in Latin script for the certificate, date of birth, phone, Line ID, email, and up to five chosen course numbers.

**Two contradictions for the board.** The legacy homepage advertises `Brann kurs (เรียนฟรี)`, free, while the registration page states 800 kr for every course without exception. The homepage also lists Brann as a course while no detail page covers it. Publish neither version until the board says which is current. This matters more than it looks: courses are priority one, and price is the first thing a visitor checks.

**One wording risk worth naming.** The legacy pages say the certificate can be used legally and is what Mattilsynet or Arbeidstilsynet inspect for. Someone has already complained to Mattilsynet alleging the association misrepresented an affiliation, so this is not hypothetical. Describe what each course covers and say the certificate documents completed training. Do not imply accreditation or approval by a Norwegian agency unless the board can produce documentation of it.

### The 2019 dispute page, which should not be migrated

The legacy site carries a long page titled `เอกสารชี้แจง` recounting a defamation dispute: two named individuals accused of spreading false information online, a police report filed 13.02.2019, a complaint lodged against the association at Mattilsynet, and enquiries to the Thai Embassy in Oslo.

Recommendation: leave it behind. It is seven years old, it is a personal legal matter rather than a service the association offers, and a site whose stated goal is to read like a public agency undermines that the moment it airs a dispute on a public page. Nothing in the client brief asks for it. If the board wants a public record it belongs in a members-only notice, not in the site's main content. The board decides; this is a recommendation, not a refusal.

### The client's own brief, in their words

Given directly by the board, and it reorders the site.

> Vi ønsker at nettsiden skal se ut som en offentlig etat eller tjeneste sin nettside, bare finere.

That single sentence is the design target: institutional credibility first, polish second. It also confirms the calibration already in this brief, so nothing there loosens.

**References they named:** `oslo.thaiembassy.org` and `thaiairways.com/en-no`. The embassy gives the information architecture and the institutional tone. Thai Airways gives one thing worth taking and one worth refusing. Take the **primary-action module placed high on the page**: their booking widget is the first interactive thing you meet, and the equivalent here is a compact course finder with registration, because courses are the client's stated first priority. Refuse their density, their promotional carousels, and their card-grid marketing pages, which are the opposite of "offentlig etat, bare finere".

**Their stated content priorities, in their order:**

1. **Matkursene.** What courses exist (IK-mat, HMS for leder, Brann, Matallergi) and how to register. Named as the single most important thing on the site.
2. **Offentlige hjelpetjenester og sosiale tjenester.** Krisesenteret, Barnevernet, UDI, Politiet, NAV.
3. **Foreningens aktiviteter.** Charity work and donations, cultural events, food festivals.
4. **Bakgrunnen for foreningen.** Who they are, why they started, what the purpose is.
5. **Kontakt.** Email and phone.

**What this changes.** Revision 2 led the homepage with the help pathways. The client ranks courses first. Both can be true, because the persistent help bar carries the emergency number on every screen at all times, so life-safety is never more than one tap away regardless of scroll position. That frees the scrollable body to lead with what the association actually wants promoted. The section order in 2.5 and the nav in 2.2 are rebuilt around their five priorities, and membership drops off the homepage entirely, which is honest given no fee is set.

### Board roster, as published for 2017

Thirteen people across eight functions, which is a very different shape from the four roles in the bylaws. The bylaws define Leder, Nestleder, Sekretær and Kasserer; the organisation actually runs departments for finance, information, activities, interpreting, Thailand coordination, web and Facebook, plus a senior advisor.

| Function | Norwegian title |
|---|---|
| Chair | Styreleder |
| Deputy chair | Nestleder |
| Finance, two people | Regnskap og økonomi |
| Interpreting | Tolk |
| Information lead and assistant | Informasjonsleder, informasjonsassistent |
| Activities lead, deputy, three assistants | Aktivitetsleder, aktivitetsnestleder, aktivitetsassistent |
| Thailand coordination | Koordinator, Thailand |
| Website and Facebook | Administration |
| Senior advisor | Rådgiver |

The page carries a colour key: one person holds final decision authority, a core group of five decides urgent matters by majority, and the full committee attends normal meetings. That decision model is real and worth publishing, because it tells a member who can actually authorise help in an emergency.

**Two things follow.** The roster is nine years old, so names must be reconfirmed before publication. And `/about/board` should present the functions as they are actually run, with a note that the bylaws still describe only four roles, rather than pretending the bylaw structure is the operating structure.

### Membership terms, now fully known

- **50 kr, one time**, per person or per family.
- Eligibility: legal residence in Norway, an 11-digit fødselsnummer, and **not a member of another association**, except religious bodies such as a Thai temple.
- **Residence in one of 33 named Hordaland municipalities.** The full list is published, from Bergen through Fedje and Masfjorden.
- Under 15 requires a guardian's signature.
- Process: download a `.doc` form, print it, pay 50 kr to the association account, post the form with a copy of the transfer receipt.

**The geographic restriction is the problem.** Those 33 municipalities were dissolved or merged into Vestland on 1 January 2020, and several no longer exist under those names. A membership rule that names abolished municipalities cannot be published as-is. The board needs to decide the new catchment, most likely Bergen and surrounding Vestland, and that is a bylaw question rather than a design one.

The current process is also entirely offline: print, post, bank transfer. The join form specified in this brief replaces the printing and posting, but payment still has nowhere to go until Vipps or a payment link exists.

### Finances, published 2011 to 2015

The association publishes full annual income and expenditure. 2011 as an example: income 18 054,50 kr from membership fees, garland sales at the opening event, a Thai Embassy donation and Norsk Tipping support; expenditure 12 782,25 kr on Songkran venue and catering, performing-arts support, youth sports equipment, a refunded membership, travel to the national Thai association meeting in Oslo, and registration costs. Balance 5 272,25 kr.

This level of openness is unusual and is the single strongest trust signal the association has. `/about/finances` should carry it forward as a real table per year, not a PDF link. The gap after 2015 needs explaining or filling.

### Activity history, roughly twenty documented projects

Enough real material that the Activities section launches full rather than empty. Documented across 2011 to 2016: founding and hosting the first Thai temple in Bergen, covered by BT Avis in August 2011; flood relief for southern Thailand in 2011 and two rehabilitation centres set up in 2012 with two board members travelling at their own expense; Songkran and Loi Krathong celebrations; Thai Food Festival 2014, 2015 and 2016; `โครงการอิ่มท้องน้องมีสุข` school meals; a mobile medical project in Ayutthaya; a project in Sangkhlaburi; mothers-and-children events; hosting the Thai ambassador and consul.

This directly answers the client's third priority, charity work and cultural events, and it means the gallery and activity pages have real photographs and real dates from day one.

### Legacy navigation, one flat list of 15 items with no hierarchy

| Thai | Meaning |
|---|---|
| หน้าแรก | Home |
| Vedtekter | Bylaws (Norwegian page) |
| ข้อมูลสมาคม | About the association |
| คณะกรรมการ | The board |
| ข้อมูลสมาชิก | Member information |
| ปฎิทินงาน | Event calendar (empty) |
| รูปกิจกรรม | Photo gallery |
| บัญชีสมาคม | Association accounts / finances |
| สมัครสมาชิก | Become a member |
| ติดต่อคณะกรรมการ | Contact the board |
| ติดต่อฉุกเฉิน | Emergency contact |
| ติดต่อสอบถาม | General enquiry |
| ติดต่อร้องเรียน | Complaints |
| ลิขสิทธิ์เวบไซต์ | Website copyright |
| ลิขสิทธิ์ส่วนบุคคล | Personal data notice |

### Real services found in the content, which are the product

1. **Crisis and legal support.** Interpreting, and liaison with politi, advokat, sykehus, krisesenter, barnevernet. Members are prioritised because volunteer capacity is limited; a genuine emergency is answered regardless of membership. Staff on this function are bound by `taushetsplikt` and keep no written record, and the legacy site states this explicitly.
2. **Krisesenteret referral.** Free shelter, 365 days, 24 hours, phone `55 31 50 50`. The legacy page advises bringing identity documents for yourself and your children.
3. **Courses, with registration open on the legacy homepage:** `IK Mat kurs`, `HMS for leder kurs`, `Brann kurs` (free), `Matallergi kurs`. Aimed at Thai restaurant and kitchen workers. This is the most undersold asset on the old site.
4. **Culture.** Preserving Thai traditions, gatherings, and building understanding between Thai immigrants and Norwegian society.
5. **Fundraising.** Natural-disaster relief and social aid in Thailand: poor primary schools, homeless shelters, care homes, orphanages.
6. **Information bridge.** Deep links to `udi.no` (residence card, permanent residence, renewal), `politi.no` (passport, lost passport, local police district), the Royal Thai Embassy Oslo, and the Norwegian Embassy in Bangkok.

### Legacy contact data, available for migration

Carried here as a migration source. The board decides what is republished; the client has confirmed there is no need to withhold.

| Function | Name | Phone | Email |
|---|---|---|---|
| Emergency | คุณ อรวรรณ ตรงต่อศักดิ์ | 97 08 81 36 | orawan72@hotmail.com |
| General enquiry | คุณ กานดา พอลเซ่น | 41 31 21 02 | not listed |
| Complaints / secretary | คุณ สง่า อินทะจักร | 46 34 90 49 | sintajak@hotmail.com |

One engineering note, not a policy objection: personal Hotmail addresses break when a volunteer steps down, and the site then silently routes crisis contact into a dead mailbox. Recommend role addresses (`emergency@`, `post@`, `membership@`) forwarding to whoever currently holds the role, with the person's name still displayed next to it. Same visibility, no dead-end when the roster changes.

### Reference site, `oslo.thaiembassy.org`

Borrow the **information architecture and the institutional seriousness**: a five-item top nav, a bilingual toggle in the header, a lead news grid, a formal announcements block, a rail of external links, and a footer carrying address and hours. Reject the visual execution, the banner clutter, and the view counters.

---

## PART 1 — THE ENHANCED PROMPT

> Paste everything between the rules below into a fresh session.

---

### ROLE & OBJECTIVE

You are a Design Director, Full-Stack Architect, and Accessibility Lead working on civic and cultural-institution websites. Load your `taste` skill and treat it as a binding bar. Also load `design-taste-frontend`.

Build the website for **Thai Foreningen Bergen (TFB)**, organisasjonsnummer **996 630 307**, a volunteer-run Thai community association in Bergen, Norway. Members rely on it for legal help, interpreting, crisis referral, mandatory workplace courses, and cultural life.

**Calibration, and read this before anything else.** This is not a startup landing page and not a portfolio. The audience includes people in genuine distress, people with limited Norwegian, and people over 60 reading on an old Android phone. Distinctiveness here comes from **typographic authority, trilingual typesetting done properly, an asymmetric editorial grid, and one restrained signature shape drawn from the logo**. Not from stunt animation, not from scroll hijacking, not from experimental navigation. If a choice makes the site more memorable but slower to use in a crisis, the choice is wrong. Aim for the register of a Norwegian public institution that happens to have excellent design taste.

**Override on the standard brief:** the usual instruction to gamify contact flows is cancelled here. Emergency contact must be the lowest-friction element on the site: a visible phone number, one tap, no steps, no reveal animation, no form gate.

### INPUT PARAMETERS

- **Organisation:** Thai Foreningen Bergen (TFB). Norwegian: `Thai Foreningen Bergen`. Thai: `สมาคมคนไทยในเบอร์เกน`. Org.nr `996 630 307`. Founded in Bergen 8 January 2010. Volunteer-run, unpaid board, non-profit.
- **Design vibe:** Nordic civic minimalism carrying a single Thai floral signature. Warm paper, deep ink serif, one magenta drawn from the logo, generous hairline rules, editorial asymmetry. Formal enough that a caseworker at NAV or a police liaison takes it seriously, warm enough that a 55-year-old member recognises it as her association.
- **Tech stack:** Next.js 16 (static export) + Tailwind v4 + Framer Motion + TypeScript, deployed to Cloudflare Pages via wrangler. Forms post to a separate Cloudflare Worker. No test suite. The repo is empty and no `CLAUDE.md` exists, so rely solely on these inlined constraints and do not ask for a config file.
- **Locales:** `en` (default), `no` (Bokmål), `th`. Full parity across all three. Static export means locale-segmented routes.
- **Legacy URL:** `https://www.tfhnorway.com`, already scraped, summarised in the Source Audit below. Raw data in this brief overrides anything scraped.
- **Golden references:** `https://oslo.thaiembassy.org/en` for information architecture and institutional tone. `https://www.thaiairways.com/en-no/` for one thing only, a primary-action module placed high on the page. Take neither site's visual execution.
- **The client's brief, verbatim:** "Vi ønsker at nettsiden skal se ut som en offentlig etat eller tjeneste sin nettside, bare finere." Institutional credibility first, polish second.
- **Content priority, set by the board and not yours to reorder:** 1, the food courses and how to register. 2, public help and social services: Krisesenteret, Barnevernet, UDI, Politiet, NAV. 3, the association's activities: charity and donations, cultural events, food festivals. 4, the background of the association. 5, contact by email and phone.
- **Photos:** `/Users/brz/Desktop/Mash/tfb/photos`. Logo and hero banner are in the repo root. If the photo directory is thin, pull the legacy gallery at `รูปกิจกรรม` on `tfhnorway.com` as the source of real event photography.
- **MCP media:** ON. Target: Recraft (live). Iconography, patterns, and illustration only. **Never** generate photographs of people. Every human face on this site is a real member at a real event.
- **Baseline skeleton:** supplied below in full. Follow it. You may argue for changes, but state the reason.
- **Admin panel:** a custom admin panel will be built later to edit content and manage photos. **Do not build it now.** Its existence changes one thing only, and it is architectural, so see the Content Layer constraint.

### LOGO AND BRAND SOURCE

The mark is a five-petal magenta lotus/orchid. A white hand-drawn heart outline sits over the centre petals containing `TFB` in Roman serif capitals, with a fine white filigree flourish inside the heart's lower curve resolving into a spiral tail below the flower. The full lockup stacks the mark over `THAI` in large black Roman capitals, a thin magenta rule, `FORENINGEN BERGEN` in smaller black capitals, then a second magenta rule. The banner places this lockup over a pale-pink dawn photograph of Bergen harbour with Bryggen and Fløyen.

Extract exactly three things and let the rest go:

1. **The magenta**, used sparingly, as an accent and a rule colour, never as a wash.
2. **The Roman serif capitals with hairline rules**, which become the display typography and the section-divider system.
3. **The petal arc**, the lens shape formed by two opposed curves, which becomes the single signature geometry, used for image masks and nothing else.

Do not extract the heart, the filigree, or the spiral. They do not survive at UI scale and they read as clip art.

### THE KILL LIST

Generic bans:

- No centred hero headline with a generic fade-up.
- No full-bleed dark video background with thin serif text over it.
- No bento grid unless the data is genuinely dense enough to require one.
- No indigo or violet Tailwind defaults, no `slate-900` grounds, no neon, no glow.
- No 20px blanket border radius, no soft ambient drop shadow on every card.
- No emoji used as icons. No emoji flags as a language switcher.
- No left-border accent-stripe cards.
- No invented testimonials and no invented names.
- No em dashes in user-facing copy. Use a comma, a full stop, or a colon.
- No typographic curly quotes in body copy. Straight quotes only.
- No three identical cards carrying three identical two-sentence descriptions. Vary the lengths because the content varies.
- No blanket `py-24` standing in for a layout decision.
- No light/dark toggle. This site is light, always. Language is the only switcher.

Project-specific bans, and these are the ones that will actually go wrong here:

- **No magenta gradient washes, no glowing pink, no pink-on-pink hero.** The logo colour is loud, so the site must not be.
- **No giant lotus watermark at low opacity behind a section.** No lotus as a bullet. No lotus repeated as a background pattern.
- **No Thai silk texture, no gold filigree borders, no temple silhouettes, no elephants, no Thai-restaurant-menu styling.** This is a Norwegian civil-society organisation.
- **No AI-generated or stock photographs of smiling women in traditional Thai dress.** That image is the clearest possible signal that nobody from the community touched the site.
- **No view counters and no hit badges.**
- **No homepage carousel.** Volunteers will not maintain it and it hides content on mobile.
- **No Thai text falling back to a Latin webfont.** See the typography constraint. Getting this wrong is the most common failure on Norwegian-Thai bilingual sites.
- **No fabricated financial identifiers.** Never render a plausible-looking bank account number, Vipps number, KID, or fee amount as filler. Those fields are unset, so they render as an explicit empty state.

### NON-NEGOTIABLE CONSTRAINTS

**Typefaces are fixed and are not yours to choose.** Three families, specified in 2.2. Do not substitute. Specifically banned, because they are the reflex defaults and they will make this site look like every other generated site: `Inter`, `Space Grotesk`, `Manrope`, `Playfair Display`, `Lora`, `Poppins`, `Montserrat`, `DM Sans`, `Outfit`, `Sora`, `JetBrains Mono`, `Fira Code`, `Roboto Mono`. Ship no monospace family at all; tabular figures come from `font-variant-numeric: tabular-nums` on the text face.

**Trilingual typesetting.** Thai is set in its own family, never a fallback. Thai needs roughly 1.15 to 1.25 times the Latin font-size at the same optical weight, and `line-height` of at least 1.85 because of stacked vowel and tone marks. Never apply `letter-spacing` to Thai; Thai has no inter-word spaces and tracking destroys word boundaries. Set `word-break: normal` and `overflow-wrap: normal` and let the browser's Thai line-breaker work. Set `lang` correctly on every element that switches language, including inline switches. Thai headings never borrow the Latin display face; Thai has no Roman inscriptional tradition and forcing that shape onto it is wrong, so Thai headings step up in weight within the Thai family instead. Norwegian needs `æ ø å`, so ship `latin` plus `latin-ext` and never a `latin`-only subset.

**Language strategy.** English is the default and the `x-default` target. Norwegian and Thai are equals, not translations bolted on. Every route exists in all three. Emit `hreflang` for all four values. Never machine-translate the bylaws, the confidentiality statement, or anything on the emergency path; those are drafted per language and marked with a translation status in the content layer.

**Content layer.** All content lives outside components, in typed, locale-keyed data files under `content/`, read at build time. Every translatable field is an object of shape `{ en: string; no: string; th: string }`, never a flat string. Every collection item carries `id`, `slug`, `status` (`draft` or `published`), and `updatedAt`. Components read from a thin accessor module, never from the filesystem directly, and never from a hardcoded literal. This exists so the admin panel being built later can write the identical shapes into D1 and swap the accessor without touching a single component. Do not build the admin panel. Do build the seam.

**Placeholder discipline.** Where a fact is unset, render a designed empty state, never filler that looks real. Financial identifiers, the address, the roster, and the fee all render as an explicit "not yet published, contact us" state with a working contact route. Course dates and prices may carry plausible placeholder values because the cost of being wrong is low, but they must be flagged `status: "draft"` in the content layer and surfaced in a build-time warning listing every draft field. Never write `Lorem ipsum` and never write `[Insert X]` into rendered output.

**Accessibility.** WCAG 2.2 AA minimum. The brand magenta `#E10082` measures 4.67:1 on white, which clears AA for normal text with no margin, so use it for display type, rules, and graphics, and use the deeper `#8E0050` at 9.2:1 for body links, small text, and dense UI. Visible focus rings everywhere, never `outline: none`. Full keyboard operability. Body text at 17px minimum. Honour `prefers-reduced-motion` by disabling transform and opacity entrances entirely, not by shortening them. Target sizes of at least 24px per WCAG 2.2, and 44px anywhere on the help or emergency path.

**Performance.** Members open this on old phones over patchy mobile data. Budget: under 120KB of compressed JavaScript on the homepage, LCP under 2.0s on a simulated Moto G4 over 3G. Framer Motion only in leaf client components; page shells stay server components. All images through `next/image` with explicit dimensions, AVIF and WebP, lazy below the fold.

**Two brands.** The association owns the magenta lotus. The courses arm owns a separate black mark, an open book with leaves over `THAI` with a Thai flag ribbon. Do not merge them, do not recolour either to match the other, and do not put both in the same viewport. The courses mark heads the courses section and course pages and appears nowhere else. The flag red and blue are 1 per cent of that mark and never become site tokens. The link between the two brands is the shared Roman capital in `THAI`, which is also why the display face is Marcellus.

**Content honesty.** Write real English, Norwegian, and Thai copy. Never invent a board member, an organisation number, an account number, or a membership count. The bylaws are supplied verbatim in the skeleton and are reproduced exactly, including the numbering gaps.

### AI-SLOP SELF-AUDIT

Run this before writing code, and again before declaring the plan finished. Report the result honestly.

Count the em dashes in your copy; the answer must be zero. Check whether the palette drifted toward indigo or violet. Check whether every card in every grid has the same word count. Check whether any emoji is doing an icon's job. Check whether every section has identical height and padding. Check whether any human being appears in a generated image. Check whether the lotus appears anywhere except the logo. Check whether any rendered number was invented. Check whether the copy uses "seamlessly", "empower", "vibrant community", "rich cultural heritage", or "bridging cultures"; if so, rewrite in the plain register an association actually writes in. Fix every failure before proceeding.

### OUTPUT STRUCTURE — PHASE 1: THE PLAN

1. **Strategic concept**, under 150 words. How a frightened member, a curious Norwegian, and a caseworker each reach what they need in under two clicks.
2. **Reference selection.** Exactly 3 to 5 references from `/Users/brz/Downloads/design_list.md`, each justified in one sentence tied to a specific mechanic you are borrowing. If that file is unreadable, say so and substitute named public institutional sites.
3. **Design system.** Full token table with measured contrast ratios, type scale for both scripts, spacing, rules, the petal mask, motion curves and durations. Give the Tailwind v4 `@theme` block.
4. **Content model.** The TypeScript types for every collection, and the `content/` tree.
5. **Architecture.** Every page and section, top to bottom, in the skeleton's format, with layout, interaction, mobile behaviour, and final trilingual copy.
6. **Asset blueprint.** Exact Recraft prompts. State explicitly that no human figures are generated.
7. **Draft-field register.** Every field currently carrying a placeholder, so the board can fill them in one pass.

### OUTPUT STRUCTURE — PHASE 2: BUILD

Once the plan is complete, proceed without asking. Order: scaffold and `@theme` tokens, content layer and types, root layout with locale routing and the persistent help bar, header and footer, homepage sections in order, the Help section, then remaining routes. Ship real copy in all three languages as you go.

---

## PART 1.5 — BUILD REPORT

The skeleton has been executed. 99 static pages across `en`, `no` and `th`.
Run it with `npm run dev`; build with `npm run build`.

**Three deviations from the plan, each with a reason.**

**1. The JavaScript budget is missed, and cannot be met on this stack.** The brief set 120 KB gzip for the homepage. The shipped figure is **184.6 KB gzip**, of which roughly **178 KB is the Next.js App Router and React 19 baseline** that every page carries whether or not it has a client component: a page with no interactive code of its own measures 178 KB. Application code is about 7 KB per page. Framer Motion was removed entirely once it became clear its only job was a single `border-radius` tween, which CSS does natively; that alone cut 42 KB. Getting under 120 KB would mean leaving the App Router, which the brief mandates, so the number is reported rather than quietly dropped.

What was done instead is the thing that actually matters for this audience: **the site is fully usable with no JavaScript at all.** The mobile menu is a `<details>` element, every navigation item is a real link, the language switcher is three links, the emergency number is a `tel:` link, and no content anywhere starts at zero opacity. A member on an old Android whose bundle never arrives still gets the whole site. Verified against the built HTML.

**2. Scroll reveals were rebuilt so they cannot hide content.** The first implementation used Framer Motion's `whileInView`, which writes `opacity: 0` into the server-rendered HTML. Eight blocks shipped invisible, so a crawler, a failed observer, or disabled JS would have hidden the help pathways. The replacement ships the finished state and only hides once an inline script has proved JS is running, with a 1.5 second failsafe on top.

**3. `<html lang>` needed route groups.** A single root layout cannot know the locale, so Thai pages were shipping `lang="en"`. The app is now split into two route groups, each with its own root layout: `(site)/[locale]` renders `<html lang>` from the locale, and `(chooser)` handles `/`. Norwegian correctly emits `nb`.

**Smaller corrections made during the build.** `redirect()` cannot run in a static export, so `/` is a real language-chooser page with a meta refresh, backed by an edge rule in `public/_redirects`. Em-dash placeholders standing in for absent values were removed, since a glyph doing a word's job is still the kill list's problem: an unset field now renders nothing or does not render at all. The hero image bleed only applies above 1240px, where the container genuinely has gutter to spare; below that it was pushing the document sideways. Thai needed `overflow-wrap: anywhere` as a last resort, because the earlier `normal` left long Thai runs unbreakable and they forced their container wider than the screen.

**Verified.** 99 pages build clean, no broken internal links, zero em dashes in shipped copy, zero curly quotes, no horizontal overflow across 52 route and breakpoint combinations at 320, 414, 768 and 1280.

**Still outstanding, all content rather than code.** Course dates, the Brannvern contradiction, the membership catchment after the Vestland merger, the board roster for 2026, accounts after 2015, Vipps, and a transparent vector of the courses mark. Each has a designed empty state today, so none of them blocks launch.

## PART 2 — THE BASELINE SKELETON

### 2.0 Living reference

A working one-page design system is in the repo at `design/index.html`. It renders the real typefaces, the tokens, and every component below, and it computes its contrast ratios in the browser from the token values so the numbers cannot drift from the CSS. Serve it with:

```bash
node design/serve.mjs
```

Then open `http://localhost:4321`. Every ratio quoted in 2.1 is the browser-measured value from that page, not a hand calculation.

### 2.0b Brand assets and the reduced mark

Three assets, each owning a size range. The supplied artwork is decorative and detailed, which is exactly why it must not be asked to work at 24px.

| Asset | Size range | Where |
|---|---|---|
| Primary lockup | 200px wide and up | OG image, print. Paper grounds only, see below. |
| Mark | 96px and up | Editorial use. |
| **Reduced mark** | below 96px | Header at 36px, footer, favicon at 16 and 32, app icon, empty-state glyph. |

**The 96px floor is measured, not guessed.** On the supplied 979px canvas the heart outline is an 18px stroke and the filigree runs at 3px. The heart holds a full device pixel only from 56px; the filigree only from roughly 320px. So 96px is the working floor and full fidelity wants 320px and up. This is also why the header uses the reduced mark: at 36px the heart would render at two thirds of a pixel and grey out.

The **reduced mark** is five petals and nothing else, authored as inline SVG with `currentColor` so it inherits ink on paper and paper on ink without a second file. Each petal uses the same lens shape as the image mask, so the mark and the photography are one geometry rather than two. This is the concrete form of the earlier instruction to drop the heart, the filigree, and the spiral: they are kept in the supplied artwork at large sizes and dropped from the small-size mark, rather than being deleted from the brand.

**The supplied lockup cannot go on a dark ground.** Its wordmark is pure black artwork, so on `--ink` it disappears. Until an inverse asset exists, the footer uses the reduced mark in `--paper` plus the organisation name as a text element. That is not a contradiction of the misuse rule below: the *lockup*, with its rules and letterspacing, is artwork and must never be rebuilt in live type, but a plain text wordmark beside the mark is a different object and is fine.

Rules: clear space equals the height of one outer petal on all four sides. On `--ink` the reduced mark goes to `--paper`, never magenta. The supplied banner is the one sanctioned lockup-on-photograph treatment and it works only because the photograph is washed to near-white behind the type; any other photograph needs the same wash at 82 per cent paper or lighter, measured. That treatment belongs to the banner and is not repeated as a hero pattern.

Misuse, all forbidden: recolouring, tinting, or gradienting the mark; the full mark below 44px; lifting the lotus out as a pattern, bullet, or watermark; setting the wordmark yourself in Marcellus, since the lockup is artwork and not live type; adding a shadow or outline to lift it off a busy photograph; stretching, rotating, or cropping, because the petal angles carry the identity.

**Two brands, one site.** The association mark is the magenta lotus. The courses arm has its own mark: an open book with leaves growing out of it, education and food in one symbol, over `THAI` in Roman capitals with a Thai flag ribbon through the wordmark, and the strapline `Thai mat virksomhet kurs & market`. It covers teaching IK-mat, IK-mat systems, food allergy and HMS in Thai, selling food at food festivals and on 17. mai, and organising food markets.

These two palettes do not merge, so the site does not try. Measured on the artwork, the flag colours are **0.6 per cent red and 0.4 per cent blue** of the mark: incidental, confined to the ribbon, and never site tokens. No red or blue enters the palette.

What links them is already there: both lockups set `THAI` in the same Roman capital. That shared letterform is the family resemblance, and it is independent evidence that Marcellus is the right display face. The courses mark heads the courses section and course pages, and appears nowhere else. The association mark never appears inside that section, so the two never sit side by side competing.

**`--fjord` is removed.** Revision 2 put the courses section on an invented deep teal. There is now real evidence about what that section should look like, and the answer is the sub-brand's own black on a light ground, framed by a 2px ink rule rather than an inverted band. That keeps the section reading as "offentlig etat, bare finere" instead of a dark marketing block, needs no inverse of the courses mark, and removes a colour that had no basis in the brand. Eight tokens again.

**Asset register, measured from the delivered files.**

| File | Size | Note |
|---|---|---|
| `logo-mark.svg` | 939 x 767 | Vector, `#E31375` with paper detail. The working mark, 96px and up. |
| `logo-lockup.svg` | 420 x 562 | Vector. Wordmark `#14100F`, so light grounds only. |
| `logo-lockup-inverse.svg` | 420 x 562 | Vector. Wordmark `#FAF7F5` for dark grounds. Verified as a genuinely different file, not a duplicate of the default. |
| `logo-courses.png` | 1915 x 1423 | Courses sub-brand, trimmed from `Logo2.jpg` which carried roughly 20 per cent white margin on every side. |
| `banner.jpg` | 1983 x 793 | 2.5:1. The lockup reads only because the photograph is already washed to near-white behind it. |
| `TFB logo.png` | 1254 x 1254 | Original supply, RGB with a white background and no alpha. Archive only. Never referenced from the site; use `logo-mark.svg`. |

**One asset still outstanding:** a transparent vector of the courses mark. `logo-courses.png` is raster on an opaque white background, so it cannot sit on `--petal` or any tinted band, which constrains where the courses section can go. Everything else is now vector and correctly trimmed.

### 2.1 Design system

**Colour**

| Token | Hex | On `--paper` | Use |
|---|---|---|---|
| `--ink` | `#14100F` | 17.72:1 | Body text, display type, help bar ground |
| `--ink-soft` | `#4A4341` | 9.07:1 | Secondary text, captions, metadata |
| `--lotus` | `#E31375` | **4.26:1** | Display type 24px and up, rules, active state, mask edge. Not for body text. |
| `--lotus-deep` | `#8D0C49` | 8.63:1 | Links, small text, hover, anything under 24px |
| `--lotus-light` | `#FF77AE` | 7.65:1 on `--ink` | Labels and links on `--ink` and `--fjord` grounds |
| `--paper` | `#FAF7F5` | — | Page ground |
| `--petal` | `#F6EAF1` | — | Alternating band, table zebra, quiet callouts |
| `--rule` | `#E2D8DC` | — | 1px hairlines, the primary structural device |
| `--fjord` | `#1F3A44` | 11.27:1 | The single cool counterweight, courses section only |

**Correction worth reading.** The magenta is sampled from the supplied artwork, not chosen. The dominant fill in `logo-mark.png` is **#E31375**, which is redder than it reads on screen and is not the `#E10082` an eyedropper-by-eye would guess. It measures **4.26:1 on `--paper`**, below the 4.5:1 AA threshold for normal text. So `--lotus` is a display and graphics colour only: 24px and up, or 18.66px bold, where the 3:1 large-text threshold applies. Every link, label, caption, and table cell uses `--lotus-deep` at 8.63:1, and anything sitting on `--ink` or `--fjord` uses `--lotus-light`. Do not put `--lotus` on a body string anywhere, including eyebrow labels if they drop below 24px.

Nine tokens now, not eight. `--lotus-light` was forced by the dark grounds: the help bar and the courses table both need a magenta that reads on ink, and darkening or lightening at render time would drift off the brand hue.

Nine tokens. No tenth. Magenta coverage stays under roughly 5% of pixels on any full page.

**Type: three families, each chosen for a reason that survives being questioned**

| Role | Family | Why this one |
|---|---|---|
| Display, Latin | **Marcellus** (400, single weight) | A Roman inscriptional capital cut from the same tradition as the Trajan-style capitals in the TFB wordmark. Using it for headings means the page and the logo are speaking one language instead of two. Single weight is a feature here: it forces hierarchy to come from size and rules rather than from weight soup. |
| Text and UI, Latin | **Public Sans** (variable 300 to 700) | The typeface of the US Web Design System, drawn from Libre Franklin for public-service interfaces. It is a civic face by origin, which is exactly the register this organisation needs, and it is built for small sizes, dense tables, and forms. |
| Thai, all levels | **Sarabun** (400, 600) | Drawn by Cadson Demak and one of Thailand's national typefaces, used across official Thai government documents. It carries the same civic authority in Thai that Public Sans carries in Latin, which is the whole point of the pairing. Real Thai design, not a Latin face with Thai glyphs bolted on. |

**No monospace family ships.** Nothing on this site is code. Tabular figures for the organisation number, phone numbers, dates, prices, and bylaw paragraph numbers come from `font-variant-numeric: tabular-nums` on Public Sans.

**Explicitly rejected**, because they are the reflex picks and they carry no argument: `Inter` (the default body face of every generated interface), `Space Grotesk` and `Manrope` (geometric sans reached for when something should feel designed), `Playfair Display` and `Lora` (the elegance reflex, and Playfair's high contrast collapses at 15px on a cheap Android screen), `JetBrains Mono` and `Fira Code` (there is no code here). None of them have a reason to be on this site beyond familiarity.

**Rules**

- Marcellus is used for H1, H2, and section labels only. Never below 20px, never for body, never for UI. It has one weight and no italic, so do not fake either.
- Section labels: Marcellus, uppercase, `letter-spacing: 0.06em`, 15px, `--lotus-deep`.
- Public Sans at 17px base, 1.6 line-height, `latin` plus `latin-ext`.
- Thai never uses Marcellus. Thai headings are Sarabun 600 at `1.18em` relative to the Latin size, 1.85 line-height, `letter-spacing: 0`. Thai body is Sarabun 400 at the same 1.18 ratio.
- Scale, Latin: 13 / 15 / 17 / 20 / 26 / 34 / 46 / 62. Fluid via `clamp()` only at the top three steps.
- Total font payload budget: under 120KB across all three families after subsetting. Marcellus latin plus latin-ext only. Sarabun thai plus latin only, two weights. Public Sans as one variable file.

**Geometry and physics**

- Radius `2px` on inputs and buttons, `0` on cards and bands. The only curve on the site is the petal mask.
- Petal mask: `border-radius: 0 62% 0 62%` on image containers, at most three per page. This is the entire signature. Do not add a second one.
- Rules: 1px `--rule` hairlines separate sections. Section headings sit on a rule with the label breaking through it on the left, like a printed programme.
- Motion: entrances are opacity `0 → 1` plus `translateY(8px → 0)`, 220ms, `cubic-bezier(0.22, 1, 0.36, 1)`, once, via `whileInView` with `viewport={{ once: true, margin: "-10%" }}`. Hover 140ms. No spring, no bounce, no stagger over 60ms per item, no parallax on text. Under `prefers-reduced-motion` everything renders at final state.
- Grid: 12 columns, `max-w-[1180px]`. Default splits 7/5 and 8/4. Three equal columns are forbidden as a default.

### 2.2 Sitemap

Slugs stay English across all locales; only labels translate. One route table in a static export, and one slug per item for the admin panel instead of three.

```
/[locale]/                        locale = en (default) | no | th
├─ /courses                       Courses, the client's first priority
│  ├─ /courses/food-hygiene       IK-mat
│  ├─ /courses/hse-for-managers   HMS for ledere
│  ├─ /courses/fire-safety        Brannvern
│  ├─ /courses/food-allergy       Matallergi
│  └─ /courses/register           Registration, form posts to Worker
├─ /help                          Public help and social services
│  ├─ /help/emergency             Krisesenteret, immediate danger
│  ├─ /help/child-welfare         Barnevernet
│  ├─ /help/immigration           UDI, residence, renewals
│  ├─ /help/police                Politiet, passports, reporting
│  ├─ /help/nav                   NAV, benefits, sick pay, letters
│  ├─ /help/interpreting          Interpreting and documents
│  └─ /help/confidentiality       Taushetsplikt, what we log
├─ /activities                    What the association does
│  ├─ /activities/charity         Veldedighetsarbeid and donations
│  ├─ /activities/culture         Cultural events, Songkran, Loi Krathong
│  ├─ /activities/food-festivals  Matfestival, matmarked, 17. mai
│  ├─ /activities/gallery         Photo gallery
│  └─ /activities/[slug]          Individual events and news items
├─ /about                         Background of the association
│  ├─ /about/purpose              Why it was started, what it is for
│  ├─ /about/board                The board and their duties
│  ├─ /about/bylaws               Full bylaws, all three languages
│  ├─ /about/finances             Accounts and annual reports
│  └─ /about/membership           Join, benefits, member information
├─ /contact                       Email and phone, front and centre
│  └─ /contact/complaint          Complaints procedure
└─ /privacy                       Privacy and personal data
```

**Top nav is five items, in the client's priority order.**

| EN | NO | TH |
|---|---|---|
| Courses | Kurs | อบรม |
| Help | Hjelp | ความช่วยเหลือ |
| Activities | Aktiviteter | กิจกรรม |
| About | Om oss | เกี่ยวกับสมาคม |
| Contact | Kontakt | ติดต่อ |

Three changes from revision 2, all driven by the client brief. Courses moves to first position. Contact is promoted into the nav, because the board asked for email and phone to be findable rather than buried. News and Events fold into Activities, since the client describes them as one thing: showing what the association does. Membership moves under About, which is honest while no fee exists.

### 2.3 Content model

```
content/
  settings.json               identity, org.nr, address, bank, vipps, fee, contact hours
  navigation.json
  pages/<route>.json          static page copy, locale-keyed
  courses/<slug>.json
  news/<slug>.json
  events/<slug>.json
  board/<id>.json
  members/<id>.json
  gallery/<album>.json
  links.json
  bylaws.json                 § structure preserved, per-language body
```

```ts
type L10n = { en: string; no: string; th: string }

type Status = "draft" | "published"

interface Course {
  id: string
  slug: string
  status: Status
  title: L10n
  summary: L10n
  body: L10n
  legalBasis: L10n | null      // Norwegian statutory reference, null when unverified
  nextDate: string | null      // ISO, null renders "date to be announced"
  durationHours: number | null
  priceNok: number | null      // 0 renders as "Free", null renders as empty state
  instructionLanguage: ("no" | "th" | "en")[]
  location: L10n | null
  updatedAt: string
}

interface Settings {
  orgNumber: "996630307"
  foundedIso: "2010-01-08"
  bylawsAmendedIso: "2016-02-15"
  address: L10n | null          // null today
  bankAccount: string | null    // null today, never fabricate
  vipps: string | null          // null today, never fabricate
  membershipFeeNok: number | null  // null today
  memberCountPublished: number | null
  emails: { emergency: string; general: string; membership: string; complaint: string }
  emergencyPhone: "55 31 50 50"
}
```

Every `null` above has a designed empty state in 2.6. Build-time check: emit a console table of every `draft` item and every `null` in `Settings`, so the state of the placeholder register is visible on each deploy.

### 2.4 Global chrome

**A. Help bar.** Persistent, top of viewport, above the header, never dismissible.
Full-bleed `--ink` band, 44px, single line, tabular numerals. Left: label in magenta small caps. Then the number as a `tel:` link, underlined, 17px. Right on desktop only: the interpreter line. On mobile the whole bar is the tap target and the right text drops.
It does not animate, collapse, or reveal. It is the one element on the site that never moves.

- EN: `Urgent help · Krisesenteret 55 31 50 50 · open 24 hours, every day · We can provide an interpreter`
- NO: `Akutt hjelp · Krisesenteret 55 31 50 50 · døgnåpent hele året · Vi kan stille med tolk`
- TH: `ช่วยเหลือฉุกเฉิน · ศูนย์ช่วยเหลือ (Krisesenteret) 55 31 50 50 · เปิด 24 ชั่วโมง ทุกวัน · สมาคมจัดล่ามให้ได้`

**B. Header.** Sticky, 72px, `--paper`, with a 1px bottom rule that appears only after 40px of scroll.
Left: logo mark at 36px plus wordmark in Roman capitals. Centre: the five nav items at 15px uppercase, 0.06em tracking, active item carrying a 2px `--lotus` underline sitting on the header rule. Right: a three-way language switcher rendered as text, `EN · NO · ไทย`, separated by hairlines, inactive states in `--ink-soft`, each a real link to the same route in that locale. No flags, no globe icon, no dropdown.
Mobile: logo left, the word `Menu` beside a two-line glyph right. Panel slides down from the header, full width, opacity plus 8px, 220ms, no backdrop blur, no scale. The language switcher sits at the top of the panel, not buried at the bottom.

**C. Footer.** `--ink` ground, `--paper` text, four unequal columns at 4/3/3/2.
Column 1: full lockup, `Founded in Bergen, 8 January 2010`, `Org.nr 996 630 307`, address or its empty state.
Column 2: the five nav items plus Events, Culture, Contact.
Column 3: contact by role with the role holder's name beside each, plus contact hours.
Column 4: membership and donations, showing the empty state until bank details exist, linking to Finances.
Bottom strip above a 1px rule at 20% opacity: `Thai Foreningen Bergen · Org.nr 996 630 307` left; Privacy, Bylaws, and the two external links right.
No newsletter signup. No social icon larger than 20px.

### 2.5 Homepage sections, in order

Rebuilt around the client's five stated priorities. The persistent help bar carries the emergency number at all times, which is what allows the body to lead with courses.

**1 — Hero.** Asymmetric 7/5, left-weighted, never centred.
Left: eyebrow in magenta uppercase, `Founded in Bergen, 8 January 2010`; H1 in mixed-case display serif at `clamp(38px, 5vw, 62px)`; a 20px lead at 52 characters per line; two actions, a solid `--ink` primary and a text-plus-underline secondary; then a hairline and one line of proof in `--ink-soft`.
Right: one real photograph in the petal mask, bleeding 40px past the container's right edge on desktop, square and inset on mobile.
Interaction: the H1 does not animate. The mask animates `border-radius` from `0 40% 0 40%` to `0 62% 0 62%` over 700ms on mount, once. That is the entire hero animation.

- H1: `Thai Foreningen Bergen` / `สมาคมคนไทยในเบอร์เกน`
- EN lead: `We run the food safety courses you need to work in a Norwegian kitchen, and we help Thai people in Bergen deal with the police, lawyers, hospitals and the crisis centre.`
- NO lead: `Vi arrangerer matkursene du trenger for å jobbe på kjøkken i Norge, og vi hjelper thailendere i Bergen med kontakt mot politi, advokat, sykehus og krisesenter.`
- TH lead: `เราจัดคอร์สอบรมความปลอดภัยด้านอาหารที่จำเป็นสำหรับการทำงานในครัวที่นอร์เวย์ และช่วยคนไทยในเบอร์เกนติดต่อตำรวจ ทนาย โรงพยาบาล และศูนย์ช่วยเหลือ`
- Actions: `See the courses` / `Se kursene` / `ดูคอร์สอบรม` and `Get help` / `Få hjelp` / `ขอความช่วยเหลือ`
- Proof: `Volunteer run since 2010 · Org.nr 996 630 307`. Member count omitted until published.

**2 — Courses.** The client's first priority, so it is the first thing under the hero. A light section framed by a 2px `--ink` rule, with the courses sub-brand mark at its head at 64px, 48px on mobile.
This is where the Thai Airways lesson lands: the primary action sits high and is the first interactive thing on the page. A compact course finder above the table, filtering by language of instruction and by month, with a single `Register` action per row.
Then a table, not cards. Columns: course, next date, language of instruction, price, action. Zebra striping in `--petal`, tabular numerals.

| Course | Regulator | Price | Format |
|---|---|---|---|
| Food hygiene, IK-mat | Mattilsynet | 800 kr | Online, 5 h |
| IK-mat system and documentation | Mattilsynet | 800 kr | Online, 5 h |
| Food allergy, Matallergi | Consumer protection | 800 kr | Online, 5 h |
| HMS and labour law | Arbeidstilsynet | 800 kr | Online, 5 h |

Every course is 800 kr, so price is not a differentiator and does not belong in the filter. What varies is the regulator, and that is what a kitchen worker is actually searching by: which certificate does the inspector ask for. Make regulator the primary filter, not price.

Each row carries the real delivery facts, because they answer the questions people actually ask before booking: **online over Line video, camera on, 6 to 8 participants, about 5 hours, no written exam, certificate posted to your address.** The 6 to 8 cap is a scarcity fact and belongs next to the register action, stated plainly rather than as a countdown.

`Brannvern` is deliberately absent. The legacy homepage advertises it as free while the registration page prices every course at 800 kr, and no detail page describes it. Do not publish it until the board resolves the contradiction.

Certificate wording: say what the course covers and that the certificate documents completed training. Do not write that it is approved or accredited by Mattilsynet or Arbeidstilsynet.

Unset dates render `Date to be announced` linking to the enquiry contact, never a fabricated date. Rows expand in place at 200ms to show duration, location, and what the certificate is worth. No modal. Below 900px the table becomes stacked definition blocks, never a horizontally scrolling table.
Section copy, EN: `Courses and certification`. Lead: `The courses you need to work in a Norwegian kitchen. Taught in Thai and Norwegian.`

**3 — Public help and social services.** The client's second priority, and the section that replaces both the old help pathways and the old links rail, because they named the same agencies.
Layout: four pathway blocks in a deliberately uneven 7/5 then 5/7 arrangement, hairline-ruled, not cards. Copy lengths differ per block because the situations differ. Then a ruled directory of the named agencies with the destination host shown in `--ink-soft`.
Blocks: `Emergency` (Krisesenteret 55 31 50 50, free, every day of the year, no membership needed, bring identity documents for you and your children); `Barnevernet` (what it is, what happens when they contact you, that we can come with you); `Interpreting and paperwork` (letters from NAV or UDI before a deadline passes); `Confidentiality` (what we log, which is nothing, and who is bound).
Directory, grouped under three ruled headings: `Norwegian authorities` (UDI, Politiet, NAV, Barnevernet, Helsenorge, Skatteetaten), `Thailand` (Royal Thai Embassy Oslo, Norwegian Embassy Bangkok, Thai e-Visa), `Urgent` (Krisesenteret 55 31 50 50, Alarmtelefonen for barn og unge 116 111, Legevakt 116 117, emergency 113).
The confidentiality block must state plainly in all three languages that emergency contacts are not reported to the board and no record is kept. Inherited from the legacy site, and members rely on it.

**4 — Activities.** The client's third priority: charity work and donations, cultural events, food festivals.
Layout: one lead item at 8 columns with a petal-masked photograph, then three secondary items at 4 columns as a hairline-separated list with no images. Underneath, a compact three-strand summary linking to `/activities/charity`, `/activities/culture`, `/activities/food-festivals`.
Dates in tabular numerals, formatted per locale. No view counters, no category pills.
Charity strand carries amounts raised and where they went, because that is what earns trust for a volunteer association.
Empty state: with no posts, one ruled block reading `No activities published yet` plus the Facebook link. Never an empty grid.

**5 — About the association.** The client's fourth priority: who they are, why they started, what the purpose is.
Layout: 5/7 split. Left, a short statement of purpose drawn from § 5 of the bylaws, not a marketing rewrite. Right, three dated facts as a ruled sequence: founded in Bergen 8 January 2010, bylaws last amended 15 February 2016, affiliated with the local frivilligsentral. Then one text link to the full background.
No timeline graphic, no milestone counters.

**6 — Contact.** The client's fifth priority, and it gets a real section rather than only a footer line.
Layout: 7/5. Left, contact by role, each with a `mailto:` and a `tel:` where one exists, plus contact hours and the expected response time. Right, the emergency number repeated at full size, because someone who scrolled this far may have been looking for exactly that.
No contact form on the homepage. The form lives on `/contact`, and the complaints procedure has its own route.

**7 — Footer.** As specified in 2.4C.

Membership is deliberately absent from the homepage. No fee is set, no payment details exist, and a band inviting people to join with nothing behind it would be the same empty promise the legacy site made. It lives at `/about/membership` with a working register-your-interest form.

### 2.6 Empty states, since most facts are unset today

Design these properly. They are the majority of the launch surface and the legacy site's worst failure was leaving them blank.

| Field | Empty state |
|---|---|
| Vipps | The association bank account is known and publishes normally. Vipps does not exist, so the row simply does not render. Never a placeholder number. |
| Membership fee | Known: 50 kr one time. Renders normally. |
| Member count | Known: 233 as of 25.12.2016. Publish it **with its date**, never as a bare current figure, because it is nine years old. |
| Address | Known: Landasveien 26, 5097 Bergen. Renders normally. The courses arm shows its own address, Vallahøgda 17, 5227 Nesttun. |
| Board roster | Functions publish now, drawn from the 2017 structure. Names hold until reconfirmed, since the roster is nine years old. |
| Course dates | The only genuinely unknown course field. `Date to be announced` linking to enquiry. Price, format, duration and cap are all known. |
| News, events | Single ruled block with the Facebook link. Never an empty grid. |

### 2.7 Key inner pages

**`/help`** — index of the four pathways at full depth, with the help bar repeated as an in-page block at the top. Confidentiality gets its own route because people need to read it before they trust the number.

**`/courses/[slug]`** — what it certifies, who legally needs it, duration, language, price, next dates, and a registration form posting to the Worker. Include the Norwegian statutory reference where one exists, `legalBasis: null` when unverified rather than guessed.

**`/about/bylaws`** — full text, reproduced verbatim from 2.8. Norwegian is the legally binding version; English and Thai are marked clearly as unofficial translations. Two-column desktop layout with paragraph numbers in a left rail, stacked language blocks on mobile. Show the amendment date, 15 February 2016.

**`/about/board`** — the four roles with their bylaw duties, which are unusually well documented. Names and photos as supplied.

**`/about/finances`** — annual accounts, the fact that leder and kasserer jointly authorise expenditure, and any fundraising campaign with amounts raised and destination. This is where a volunteer association earns trust, and the legacy site had `บัญชีสมาคม` for exactly this reason.

**`/membership/members`** — member roster, driven by a `published` flag in settings so the board controls visibility centrally rather than by deleting a route.

**`/contact/complaint`** — the procedure carried over intact: submit in writing by email with name, subject, content, and the outcome sought; the secretary forwards to the leader; the board convenes; you receive an answer.

### 2.8 Bylaws, verbatim source text

Reproduce exactly. Do not silently correct. Two defects are present in the source and are noted below the text rather than fixed in it.

```
VEDTEKTER FOR THAI FORENING Bergen

Sist endret på årsmøte 15. 02. 2016.

I PRINSIPPERKLÆRING

§ 1  Thai forening i Hordaland ble stiftet i Bergen 08. Januar 2010. Foreningen er
     åpen for alle individer med thailandsk opprinelse i Hordaland fylke.

§ 2  Å yte hjelp til Thailandsk som er bosatt i Hordaland.
     Foreningen fungerer først og fremst som støtteorgan for den det gjelder som
     trenger hjelp til f.eks. advokat, politi, sjukehus, krisesenter og dersom det
     oppstår en nødsituasjon.

§ 3  Å ha ansvar for sammenkomster for å bevare tradisjoner og kultur.

§ 4  Fungere som innsamlingsorgan i forbindelse med naturkatastrofer, for å kunne
     hjelpe den katastroferammende befolkningen.

II VEDTEKTER

§ 5  Hovedmålsettingen for Thai forening Hordaland er å:

 a)  Å hjelpe til individer med thailandsk opprinnelse som trenger hjelp med f.eks.
     tolk/oversettelser eller til å ta kontakt med advokat, politi, sykehus,
     krisesenter eller barnevernet.
 b)  Være et kontaktorgan mellom innvandrere og de norske myndighetene og de
     frivillige organisasjonene.
 c)  Å bevare og videreføre både thailandske tradisjoner og kultur.
 d)  Innsamlingsorgan i forbindelse med naturkatastrofer, for å hjelpe befolkningen
     som er i vanskelige situasjoner i Thailand.
 e)  Innsamlingsorgan for sosialhjelp i Thailand, f.eks. hjelp til fattige
     barneskoler, hjemløssenter og fattige gamlehjem/barnehjem og mye mer.
 f)  Være et felles informasjonsorgan for thailandske og for innvandrere og
     samfunnet generelt.
 g)  Bidra til å skape kulturell forståelse mellom innvandrere og det norske
     samfunnet.
 h)  Arbeide for familiens utvikling og samhold gjennom rettferdighet og
     likebehandling i det norske samfunnet.

§    Styrets sammensetning og arbeidsform.

 a)  Styremedlemmene har taushetsplikt i konfidensielle saker.
 b)  Styremedlemmenes arbeid er ulønnet.
 c)  De faste styremedlemmene i Thai forening Hordaland kan bli fratatt plassen sin
     hvis de ikke følger forennings regelverk.
 d)  De faste styremedlemmene har møteplikt. De styremedlemmene som ikke møter 5
     ganger på rad uten gyldig grunn, eller ikke oppfyller sine plikter i henhold
     til forenings regler skal bes om å vurdere sin stilling i styret.
 e)  Nytt styremedlemmene i Thai forening Hordaland blir valgt hvert 2 år av
     medlemene i Thai forening. Styret kan bli gjenvalgt hvis medlemmene stemmer
     for dette.
 f)  For at styret skal være vedtaksdyktig må minst halvparten av styret være til
     stede. Resolusjoner kan vedtaes dersom de får over halvparten av stemmene.

§ 7  Arbeidsoppgaver for styremedlemmene

 a)  Leder
     Lederen skal være ordstyrer for alle styremøter og leder forhandlinger i alle
     saker. Leder skal koordinere alle saker og handle som talsmann for Thai
     forening Hordaland. Leder må sammen med kasserer autorisere alle ordinære
     driftsutgifter. De to må sammen ha ansvaret for den økonomiske situasjonen i
     organisasjonen og de må sammen disponere kontoer til Thai forening Hordaland.
     Leder har ansvaret for at alle sekretærer fyller sine funksjoner. Leder skal ha
     det faglige og administrative ansvar for Thai forening Hordaland. Leder skal
     påse at de vedtatte målsettinger og planer blir realisert. Leder må påse at
     saksliste og innkalling til styremøte blir sendt ut i god tid.
     Leder bør ikke sitte i styre for en annen medlemsorganisasjon. Leder i Thai
     forening Hordaland kan ikke være leder for en annen medlemsorganisasjon.

 b)  Nestleder og Sekretær.
     Nestleder og / Sekretær skal fylle de funksjoner eller oppgaver som leder har i
     lederens fravær. Nestleder og Sekretær skal sammen med leder koordinere alle
     aktiviteter og være til hjelp for de forskjellige. Nestleder skal overta leders
     funksjoner frem til neste årsmøte dersom leder trekker seg. Hvis leder trekker
     seg og nestleder overtar lederfunksjonen, styret kan fylle andre ledige verv
     dersom det er behov for det.
```

Two defects in the source, to be raised with the board rather than patched in code:

1. **The section between § 5 and § 7 has no number.** It should be § 6. The heading currently reads `§ Styrets sammensetning og arbeidsform`.
2. **Kasserer has no duties section.** § 7 defines Leder in (a) and Nestleder/Sekretær in (b), and stops. Kasserer is named as a board role and § 7(a) gives the treasurer joint control of the accounts and joint authorisation of expenditure, but there is no § 7(c). Render § 7 as it stands and note the gap on the page.

Note also that the heading now reads `Bergen` while the body still says `Hordaland` throughout. The heading is reproduced as supplied. The body is legally binding text and is not edited here; correcting it requires an årsmøte resolution. The site should carry a short dated note on `/about/bylaws` stating that the association operates as Thai Foreningen Bergen and that the body text predates the name change.

### 2.9 Admin-panel forward compatibility

Not built now. These four decisions are what make it cheap to build later, so they are taken now.

1. **Content is data, not JSX.** Every string, image reference, and date lives in `content/`, never inline in a component. The accessor module is the only thing that knows where content comes from.
2. **Locale-keyed fields everywhere.** `{ en, no, th }` objects, so an editor UI renders three fields per string without a schema migration.
3. **Stable identifiers.** Every collection item carries an immutable `id` alongside its `slug`, so a slug edit in the admin panel does not orphan an image or break a relation.
4. **Images by reference.** Gallery and news images are referenced by an id resolved through one image module, never by a hardcoded path, so an R2-backed uploader can swap the resolver without touching a page.

Likely later shape, recorded so today's seams line up: Cloudflare Worker for the admin API, D1 for content, R2 for photos, and a Pages deploy hook on publish. Nothing in this build should assume the filesystem is the permanent source.

### 2.10 Recraft asset brief

Generate only these. Nothing with a face.

1. **Line icon set, 8 glyphs.** `Minimal single-weight line icons, 1.5px uniform stroke, square 24px grid, rounded terminals, no fill, no gradient, no shadow, pure #14100F on transparent. Set of eight: telephone handset, document with folded corner, two overlapping speech bubbles, shield outline, calendar grid, certificate with ribbon, house with door, hand offering. Flat vector, geometric, Swiss pictogram tradition, no perspective, no 3D.`
2. **Petal divider rule.** `A single horizontal 1px hairline in #E2D8DC, interrupted at the left third by one small lens-shaped petal outline in #E10082, 12px wide, formed by two opposed arcs. Flat vector, no gradient, no glow, transparent background.`
3. **Empty-state mark.** `One lens-shaped petal outline, 1px #E2D8DC stroke, 48px, rotated 45 degrees, centred on transparent. Flat vector, no fill, no gradient, no shadow.`
4. **Favicon and OG image.** Derive directly from the supplied logo file. Do not regenerate the lotus.

Banned from generation: any human figure, traditional dress, temple, elephant, silk texture, gold ornament, three-dimensional or glossy icon, and any lotus other than the supplied logo.

### 2.11 Motion and video

Recommendation: no video on this build. It costs the performance budget this audience cannot spare, and the kill list already bans the only place a hero video would go. If the board insists, the single permitted use is a six-second silent loop of rain on Bergen harbour, desaturated, at most 400px wide, inside the History section on `/about/history`, with `poster`, `muted`, `playsinline`, and `preload="none"`, and no autoplay on a metered connection.

### 2.12 Board question register

| # | Question | Status |
|---|---|---|
| 1 | Legal name | **Answered.** Thai Foreningen Bergen. Bylaws body text still reads Hordaland and needs an årsmøte resolution to correct. |
| 2 | Organisasjonsnummer and registers | **Answered.** 996 630 307, and TFB is affiliated with the frivilligsentral. Still open: whether TFB is separately entered in Frivillighetsregisteret at brreg.no, which is the registration that unlocks Grasrotandelen. |
| 3 | Bank account and Vipps | **Answered by the crawl.** DnB NOR 1503.21.07556 for the association, 1506.34.69634 for the courses arm. No Vipps for either. |
| 4 | Membership fee and member count | **Answered by the crawl.** 50 kr one time per person or family; 233 members as of 25.12.2016. Membership returns to `/about/membership` with real numbers. |
| 5 | Board roster and consent | **Partly answered.** The 2017 roster of thirteen across eight functions is published on the legacy site. Needs reconfirming for 2026, and the bylaws still describe only four roles. |
| 6 | Postal and meeting address | **Answered by the crawl.** Landas Menighet Eldresenter, Landasveien 26, 5097 Bergen. |
| 7 | Course prices and format | **Answered by the crawl.** 800 kr flat, online over Line, 5 hours, 6 to 8 people, no exam. Only the dates remain unknown. |
| 8 | Locales | **Answered.** English default, plus Norwegian and Thai, all at parity. |
| 9 | Post-launch editing | **Answered.** Custom admin panel, built separately. Content-layer seams specified in 2.9. |
| 10 | Bylaws § numbering gap and missing Kasserer duties | **Open.** Raise at the next årsmøte. |
| 11 | Transparent vector of the courses mark | **Open.** `logo-courses.png` is raster on opaque white, so it cannot sit on any tinted band. |
| 12 | Is the courses arm a separate legal entity? | **Answered.** Yes. Thai Restaurantvirksomhet Kurs, org.nr 924 409 509, own bank account and address. Course income is not association income. |
| 13 | Brannvern: free or 800 kr, and does it still run? | **New and urgent.** The homepage and the registration page contradict each other, and no detail page describes it. Courses are priority one, so this is the highest-value unknown on the site. |
| 14 | Membership catchment after the Vestland merger | **New.** Membership is restricted to 33 named Hordaland municipalities, several of which no longer exist. A bylaw question, not a design one. |
| 15 | Certificate claims | **New.** Confirm what the certificates actually are before repeating the legacy claim that they are what Mattilsynet and Arbeidstilsynet inspect for. |
| 16 | Annual accounts after 2015 | **New.** The 2016 page says the figures are coming in January 2017 and they never arrived. Publishing 2011 to 2015 and then stopping invites the wrong question. |
| 17 | Migrate the 2019 dispute page? | **New.** Recommendation is no. See Part 0. |
| 18 | Founded 08.01.2010 or registered 18.03.2011? | **New.** The bylaws and the projects page give different dates for different events. The site should say which it means. |
