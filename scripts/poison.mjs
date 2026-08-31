// THE POISONED CONTROL.
// Takes a built page from out/ and writes a deliberately degraded copy of it.
// The degradation is exactly the three things the job panel is meant to detect:
//   1. the emergency number is moved below the fold
//   2. every date is removed
//   3. the organisation number is deleted
// If a panel round does not put this copy LAST on steps and correctness, the testers
// are not reading, the round is void, and it does not count toward the two clean rounds.
// It audits the judge, not the work.
import fs from "node:fs";
import path from "node:path";

const [, , srcPage, outPage] = process.argv;
if (!srcPage || !outPage) {
  console.error("usage: node scripts/poison.mjs <out/en/index.html> <.panel/poisoned/home.html>");
  process.exit(2);
}

let html = fs.readFileSync(srcPage, "utf8");
const before = html;
const applied = [];

// 1. Move the crisis number below the fold, in the DOM and not only on screen.
//    Filler above a pinned bar moves it visually, but a tester also reads extracted
//    text, and innerText follows DOM order: a bar left at the top of the document
//    would still be the first thing the tester read, and the control would not lose.
//    So the bar is physically cut out and reattached at the end of <body>.
function sliceBalanced(src, openIdx, tag) {
  const openRx = new RegExp(`<${tag}\\b`, "gi");
  const closeRx = new RegExp(`</${tag}\\s*>`, "gi");
  let depth = 0, i = openIdx;
  while (i < src.length) {
    openRx.lastIndex = i; closeRx.lastIndex = i;
    const o = openRx.exec(src), c = closeRx.exec(src);
    if (!c) return null;
    if (o && o.index < c.index) { depth++; i = o.index + o[0].length; continue; }
    depth--; i = c.index + c[0].length;
    if (depth === 0) return { start: openIdx, end: i };
  }
  return null;
}

const phoneAt = html.search(/<a[^>]+href="tel:\+?4755315050"/i);
let moved = false;
if (phoneAt > -1) {
  // Walk back to the outermost div that opens before the phone and still wraps it.
  // Take the LARGEST div that still wraps the phone and is still plausibly the bar
  // rather than a page shell. Taking the innermost would move a fragment and leave
  // most of the bar's text where it was.
  const opens = [...html.slice(0, phoneAt).matchAll(/<div\b/gi)].map((m) => m.index);
  let best = null;
  for (const start of opens) {
    const span = sliceBalanced(html, start, "div");
    if (!span || span.start > phoneAt || span.end < phoneAt) continue;
    if (span.end - span.start >= 4000) continue;
    if (!best || span.end - span.start > best.end - best.start) best = span;
  }
  if (best) {
    const bar = html.slice(best.start, best.end);
    html = html.slice(0, best.start) + html.slice(best.end);
    html = html.replace(/<\/body>/i, `${bar}</body>`);
    moved = true;
    applied.push("help bar cut from the top of the document and reattached at the end of body");
  }
}
if (!moved) {
  html = html.replace(/<\/head>/i, '<style>[class*="fixed"],[class*="sticky"]{position:static !important}</style></head>');
  html = html.replace(/<body([^>]*)>/i, '<body$1><div aria-hidden="true" style="height:2400px"></div>');
  applied.push("help bar could not be located; unpinned and pushed below 2400px of filler instead");
}

// 2. Strip every date the page renders: the machine-readable form, the written form,
//    and the bare year, which is how most of this site's archive is labelled.
html = html.replace(/<time\b[^>]*>[\s\S]*?<\/time>/gi, "<span></span>");
const MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sept|Sep|Oct|Nov|Dec|januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember";
html = html.replace(new RegExp(`\\b\\d{1,2}\\.?\\s*(?:${MONTHS})\\.?\\s*\\d{4}\\b`, "gi"), "");
html = html.replace(new RegExp(`\\b(?:${MONTHS})\\.?\\s+\\d{4}\\b`, "gi"), "");
html = html.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "");
html = html.replace(/\b\d{1,2}\.\d{1,2}\.\d{4}\b/g, "");
html = html.replace(/\b(?:19|20)\d{2}\b/g, "");
html = html.replace(/(?:\u0e1e\.\u0e28\.|\u0e04\.\u0e28\.)\s*\d{2,4}/g, "");
applied.push("every rendered date removed, bare years included");

// 3. Delete both organisation numbers wherever they appear.
html = html.replace(/996\s*630\s*307/g, "").replace(/924\s*409\s*509/g, "");
html = html.replace(/Org\.?\s*nr\.?/gi, "");
applied.push("both organisation numbers deleted");

fs.mkdirSync(path.dirname(outPage), { recursive: true });
fs.writeFileSync(outPage, html);
console.log(`poisoned ${srcPage} -> ${outPage}`);
console.log(`  ${before.length} chars in, ${html.length} chars out`);
for (const a of applied) console.log(`  ${a}`);
