// Assembles the materials a job tester sees, and nothing else.
// A tester gets tiled screenshots and extracted visible text. No file paths, no URLs,
// no domain names, no source. Law 1: a tester that opens a .tsx, a .css or a file under
// content/ has failed its own task and its verdict is discarded, so it must never be
// handed anything that would let it.
import fs from "node:fs";
import path from "node:path";

const DOMAIN = /\b(?:[a-z0-9-]+\.)+(?:no|com|org|net|th|io|dev)\b/gi;
const URLISH = /\bhttps?:\/\/\S+/gi;
const PATHISH = /(?:\.{0,2}\/)?(?:src|out|content|qa|scripts|public|design|\.render|\.panel)\/[\w./[\]()@-]*/g;
const LOCALEPATH = /\/(?:tfb\/)?(?:en|no|th)\/[\w/-]*/g;

// Addresses and emails ARE content a tester must be able to read. Job 2 answers with an
// email address and job 4 turns on telling post@ from kurs@, so an email that survives
// scrubbing is load-bearing. Only the scaffolding that would reveal WHICH page is ours,
// or where it came from, is removed.
const EMAIL = /\b[\w.+-]+@(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi;

export function scrub(text) {
  const emails = [];
  let out = String(text).replace(EMAIL, (m) => `\u0000E${emails.push(m) - 1}\u0000`);
  out = out
    .replace(URLISH, "[link]")
    .replace(PATHISH, "[path]")
    .replace(LOCALEPATH, "[link]")
    .replace(DOMAIN, "[site]")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return out.replace(/\u0000E(\d+)\u0000/g, (_, i) => emails[Number(i)]);
}

function visibleText(dumpPath) {
  const d = JSON.parse(fs.readFileSync(dumpPath, "utf8"));
  return scrub(d.renderedTextConcat ?? "");
}

const invokedDirectly = process.argv[1] && process.argv[1].endsWith("panel-materials.mjs");
const [, , outDir, ...pairs] = process.argv;
if (invokedDirectly && (!outDir || !pairs.length)) {
  console.error('usage: node scripts/panel-materials.mjs .panel/r1/job2 "ours=.render/about__en__1280" "ref=.refs/brreg__1280"');
  process.exit(2);
}

// Label order is randomised per tester by the caller, which passes the labels it wants.
if (!invokedDirectly) { /* imported for its scrub() only */ } else {
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
for (const pair of pairs) {
  const [label, stem] = pair.split("=");
  const dest = path.join(outDir, label);
  fs.mkdirSync(dest, { recursive: true });

  const dump = `${stem}.json`;
  if (fs.existsSync(dump)) {
    fs.writeFileSync(path.join(dest, "visible-text.txt"), visibleText(dump));
  }
  const shots = [];
  for (const suffix of ["", "__mid", "__tail"]) {
    const png = `${stem}${suffix}.png`;
    if (fs.existsSync(png)) {
      const name = `${shots.length + 1}-${suffix ? suffix.replace(/^__/, "") : "head"}.png`;
      fs.copyFileSync(png, path.join(dest, name));
      shots.push(name);
    }
  }
  manifest.push({ label, screenshots: shots, hasText: fs.existsSync(dump) });
  if (shots.length > 6) console.error(`WARNING ${label} has ${shots.length} images; the ceiling is 6 per critic invocation`);
}
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify({ pages: manifest }, null, 2) + "\n");
console.log(`materials in ${outDir}:`);
for (const m of manifest) console.log(`  ${m.label}: ${m.screenshots.length} tiles, text ${m.hasText ? "yes" : "no"}`);
}
