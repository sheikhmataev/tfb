// Retry the references that did not actually render. A page whose body never grew past
// the viewport, or that yields almost no text, is a blank page. Putting one in front of
// a critic and calling the result a measurement is worse than having no reference at all.
import fs from "node:fs";
import { chromium } from "playwright";

const CANDIDATES = {
  helsenorge: [
    "https://www.hjelpetelefonen.no/",
    "https://www.helsenorge.no/psykisk-helse/hjelpetelefoner-og-chattetjenester/",
    "https://www.bergen.kommune.no/innbyggerhjelpen/helse-og-omsorg/psykisk-helse/psykisk-helsehjelp",
  ],
  vocational: [
    "https://www.mattilsynet.no/mat-og-drikke/virksomheter/serveringssteder",
    "https://www.arbeidstilsynet.no/tema/hms-arbeid/",
    "https://www.mattilsynet.no/mat-og-drikke/virksomheter",
  ],
  thaiairways: [
    "https://www.thaiairways.com/en_TH/index.page",
    "https://www.thaiairways.com/en-no/",
  ],
  bergenkommune: [
    "https://www.bergen.kommune.no/innbyggerhjelpen/kultur-idrett-og-fritid/arrangement",
  ],
};

const OUT = ".refs";
const TILE = 1400;

async function tryOne(browser, id, url, width) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, locale: "en-GB" });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 35000 }).catch(() => {});
    for (const rx of [/reject all/i, /avvis alle/i, /kun nødvendige/i, /only necessary/i, /bare nødvendige/i, /decline/i, /avvis/i, /^ok$/i, /godta/i, /accept/i, /agree/i]) {
      const b = page.getByRole("button", { name: rx }).first();
      if (await b.count().catch(() => 0)) { await b.click({ timeout: 4000 }).catch(() => {}); await page.waitForTimeout(1500); break; }
    }
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
      window.scrollTo(0, 0);
    }).catch(() => {});
    await page.waitForTimeout(3000);
    const height = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, document.body.scrollHeight));
    const text = await page.evaluate(() => document.body.innerText);
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const ok = wordCount >= 120 && height > (width < 768 ? 844 : 900) + 4;
    return { ok, page, ctx, height, text, wordCount, url };
  } catch (e) {
    await ctx.close();
    return { ok: false, error: e.message.split("\n")[0], url };
  }
}

const browser = await chromium.launch();
for (const [id, urls] of Object.entries(CANDIDATES)) {
  for (const width of [390, 1280]) {
    let won = null;
    for (const url of urls) {
      const r = await tryOne(browser, id, url, width);
      if (!r.ok) { if (r.ctx) await r.ctx.close(); console.log(`  ${id} @${width} ${url} -> ${r.error ?? `${r.wordCount} words, ${r.height}px, still blank`}`); continue; }
      won = r; break;
    }
    if (!won) { console.log(`${id} @${width}: NO CANDIDATE RENDERED. This surface has no comparable reference and is scored single-page.`); continue; }
    const stem = `${OUT}/${id}__${width}`;
    const { height, text, wordCount, page } = won;
    const stops = height <= TILE ? [0] : height <= TILE * 3 ? [0, TILE, TILE * 2].filter((y) => y < height) : [0, Math.round(height / 2 - TILE / 2), height - TILE];
    const names = ["head", "mid", "tail"];
    for (let i = 0; i < stops.length; i++) {
      await page.screenshot({ path: `${stem}${i === 0 ? "" : "__" + names[i]}.png`, fullPage: true, clip: { x: 0, y: stops[i], width, height: Math.min(TILE, height - stops[i]) } });
    }
    const prev = fs.existsSync(`${stem}.json`) ? JSON.parse(fs.readFileSync(`${stem}.json`, "utf8")) : {};
    fs.writeFileSync(`${stem}.json`, JSON.stringify({ ...prev, id, width, url: won.url, documentHeight: height, wordCount, tiles: stops.length, suspect: false, renderedTextConcat: text.slice(0, 40000) }, null, 2) + "\n");
    console.log(`${id} @${width}: ${height}px, ${wordCount} words, ${stops.length} tiles, from ${won.url}`);
    await won.ctx.close();
  }
}
await browser.close();
