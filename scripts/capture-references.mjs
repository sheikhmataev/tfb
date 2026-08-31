// Captures the reference pages for Step 5's reference panel.
// One reference per surface, and each is confined to the ONE axis it genuinely earns.
// Nothing here is ever shown to a builder. Builders are blind to the reference.
//
// The trap this run exists to avoid: the embassy carries a view counter, a duplicated
// horizontal nav and three text-size buttons, and Thai Airways sells seats. A critic
// asked which page looks better rewards precisely what the client rejected. So no agent
// is ever asked which page looks better, and a reference that wins its axis while
// carrying something on the refusal register has its measurement recorded and its
// prescription voided.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

export const REFERENCES = [
  { surface: "home",     id: "embassy",        url: "https://oslo.thaiembassy.org/en",
    axis: "How few fixations to reach the first dated, substantive item" },
  { surface: "articles", id: "regjeringen",    url: "https://www.regjeringen.no/no/aktuelt/id2006120/",
    axis: "Legibility of a dated list at a glance, and whether items with no photograph sit comfortably" },
  { surface: "about",    id: "brreg",          url: "https://virksomhet.brreg.no/nb/oppslag/enheter/996630307",
    axis: "Whether a register of facts reads as calm and scannable rather than as a wall" },
  { surface: "help",     id: "helsenorge",     url: "https://www.helsenorge.no/psykisk-helse/hjelpetelefoner-og-chattetjenester/",
    axis: "Time to the phone number under stress, on a phone" },
  { surface: "courses",  id: "vocational",     url: "https://www.mattilsynet.no/mat-og-drikke/virksomheter/regelverk-for-mat-og-drikke",
    axis: "Whether an obligation is stated plainly with no selling register" },
  { surface: "contact",  id: "bergenkommune",  url: "https://www.bergen.kommune.no/innbyggerhjelpen/kultur-idrett-og-fritid/arrangement",
    axis: "Whether a month of items is comprehensible without colour coding, and whether a person knows who they are writing to" },
  { surface: "shell",    id: "thaiairways",    url: "https://www.thaiairways.com/en-no/",
    axis: "Warmth and Thai identity inside a restrained frame. Typography and image register ONLY. Never layout, never commerce." },
];

const OUT = ".refs";
const TILE = 1400;

async function capture(browser, ref, width) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, locale: "en-GB" });
  const page = await ctx.newPage();
  const stem = path.join(OUT, `${ref.id}__${width}`);
  try {
    await page.goto(ref.url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});

    // A cookie or consent banner is chrome, not register. Dismiss it, never count it
    // as a disqualifier, and choose the most privacy-preserving option available.
    const DECLINE = [
      /reject all/i, /avvis alle/i, /kun n\u00f8dvendige/i, /only necessary/i,
      /bare n\u00f8dvendige/i, /necessary only/i, /decline/i, /avvis/i,
      /godta n\u00f8dvendige/i, /accept necessary/i, /^ok$/i, /godta/i, /accept/i,
    ];
    for (const rx of DECLINE) {
      const b = page.getByRole("button", { name: rx }).first();
      if (await b.count().catch(() => 0)) {
        await b.click({ timeout: 4000 }).catch(() => {});
        await page.waitForTimeout(1200);
        break;
      }
    }
    // Some consent walls are links, not buttons.
    for (const rx of [/reject/i, /avvis/i]) {
      const l = page.getByRole("link", { name: rx }).first();
      if (await l.count().catch(() => 0)) { await l.click({ timeout: 3000 }).catch(() => {}); break; }
    }

    // Lazy content only exists once something scrolls past it.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    }).catch(() => {});
    await page.waitForTimeout(2000);

    const height = await page.evaluate(() => Math.max(
      document.documentElement.scrollHeight, document.body.scrollHeight));
    const text = await page.evaluate(() => document.body.innerText);
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    // A page whose body never grew past the viewport, or that yields almost no text,
    // did not actually render. Recording it would put a blank page in front of a
    // critic and call the result a measurement.
    const suspect = wordCount < 80 || height <= (width < 768 ? 844 : 900) + 4;

    fs.mkdirSync(OUT, { recursive: true });
    // Tile, at most three crops of 1400px. Never one giant image: the binding cost of
    // this whole run is image tokens, not agent count. fullPage is required, because a
    // clip below the viewport is otherwise outside the resulting image.
    const stops = height <= TILE ? [0]
      : height <= TILE * 3 ? [0, TILE, TILE * 2].filter((y) => y < height)
      : [0, Math.round(height / 2 - TILE / 2), height - TILE];
    const names = ["head", "mid", "tail"];
    for (let i = 0; i < stops.length; i++) {
      await page.screenshot({
        path: `${stem}${i === 0 ? "" : "__" + names[i]}.png`,
        fullPage: true,
        clip: { x: 0, y: stops[i], width, height: Math.min(TILE, height - stops[i]) },
      });
    }
    fs.writeFileSync(`${stem}.json`, JSON.stringify({
      id: ref.id, surface: ref.surface, axis: ref.axis, width,
      documentHeight: height, wordCount, tiles: stops.length, suspect,
      renderedTextConcat: text.slice(0, 40000),
    }, null, 2) + "\n");
    console.log(`${ref.id} @${width}: ${height}px, ${wordCount} words, ${stops.length} tiles${suspect ? "   SUSPECT, this page probably did not render" : ""}`);
    return !suspect;
  } catch (e) {
    console.log(`${ref.id} @${width}: COULD NOT CAPTURE. ${e.message.split("\n")[0]}`);
    return false;
  } finally {
    await ctx.close();
  }
}

const only = process.argv[2];
const browser = await chromium.launch();
let ok = 0, failed = 0;
for (const ref of REFERENCES) {
  if (only && ref.id !== only && ref.surface !== only) continue;
  for (const width of [390, 1280]) ((await capture(browser, ref, width)) ? ok++ : failed++);
}
await browser.close();
console.log(`\ncaptured ${ok}, could not capture ${failed}`);
if (failed) console.log("A reference that cannot be captured is a missing counterpart, which is not a signal about anything. That surface is scored single-page against the absolute thresholds.");
