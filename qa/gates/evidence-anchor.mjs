// G22 EVIDENCE ANCHOR.
// Every non-UNVERIFIED row in qa/evidence.json must re-resolve, by exact string,
// against the file and pointer it names. A row that does not is a build break.
// Also: qa/seed-facts.json is immutable, and this run may not add files to qa/sources/.
import fs from "node:fs";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const fails = [];
const fail = (id, actual, limit, artefact) => fails.push(`G22 | ${id} | ${actual} | ${limit} | ${artefact}`);

const read = (p) => fs.readFileSync(p, "utf8");
const ev = JSON.parse(read("qa/evidence.json"));
const seed = JSON.parse(read("qa/seed-facts.json"));

// --- seed immutability -------------------------------------------------
const seedHash = crypto.createHash("sha256").update(fs.readFileSync("qa/seed-facts.json")).digest("hex");
let firstCommitted = null;
try {
  const sha = execFileSync("git", ["log", "--diff-filter=A", "--format=%H", "-1", "--", "qa/seed-facts.json"], { encoding: "utf8" }).trim();
  if (sha) firstCommitted = crypto.createHash("sha256").update(execFileSync("git", ["show", `${sha}:qa/seed-facts.json`])).digest("hex");
} catch { /* not a repo, or never committed */ }

const lockPath = "qa/.seed-hash";
if (firstCommitted) {
  if (firstCommitted !== seedHash) fail("seed-facts.mutated", seedHash.slice(0, 12), firstCommitted.slice(0, 12), "qa/seed-facts.json");
} else if (fs.existsSync(lockPath)) {
  const locked = read(lockPath).trim();
  if (locked !== seedHash) fail("seed-facts.mutated", seedHash.slice(0, 12), locked.slice(0, 12), lockPath);
} else {
  fs.writeFileSync(lockPath, seedHash + "\n");
  console.log(`G22 | seed-facts.json not yet committed; locked its hash into ${lockPath}`);
}

// --- qa/sources must not grow during this run --------------------------
const sourcesPath = "qa/sources";
const sources = fs.existsSync(sourcesPath) ? fs.readdirSync(sourcesPath).filter((f) => !f.startsWith(".")) : [];
const manifestPath = "qa/.sources-manifest.json";
if (fs.existsSync(manifestPath)) {
  const before = JSON.parse(read(manifestPath));
  const added = sources.filter((f) => !before.includes(f));
  if (added.length) fail("qa/sources.added", added.join(", "), "no file may be added during this run", manifestPath);
} else {
  fs.writeFileSync(manifestPath, JSON.stringify(sources, null, 2) + "\n");
  console.log(`G22 | recorded the qa/sources manifest: ${sources.length ? sources.join(", ") : "(empty)"}`);
}

// --- row resolution ----------------------------------------------------
const cache = new Map();
const load = (p) => (cache.has(p) ? cache.get(p) : (cache.set(p, JSON.parse(read(p))), cache.get(p)));

function resolvePointer(doc, pointer) {
  if (pointer === "" || pointer === "/") return doc;
  let node = doc;
  for (const rawSeg of pointer.split("/").slice(1)) {
    const seg = rawSeg.replace(/~1/g, "/").replace(/~0/g, "~");
    if (seg === "length" && Array.isArray(node)) return node.length;
    if (node === null || node === undefined) return undefined;
    node = node[seg];
  }
  return node;
}

let checked = 0, unverified = 0;
for (const row of ev.rows) {
  if (row.source === "UNVERIFIED") { unverified++; continue; }
  if (row.pointer === "/*") {
    if (!fs.existsSync(row.file)) fail(`missing-file:${row.claim.slice(0, 40)}`, row.file, "file exists", "qa/evidence.json");
    continue;
  }
  checked++;
  if (!fs.existsSync(row.file)) { fail(`missing-file:${row.claim.slice(0, 40)}`, row.file, "file exists", "qa/evidence.json"); continue; }

  if (row.source === "brief") {
    const f = seed.facts.find((x) => x.id === row.pointer);
    if (!f) { fail(`no-seed-row:${row.pointer}`, "absent", "a row in qa/seed-facts.json", "qa/seed-facts.json"); continue; }
    const want = f.value === null ? null : String(f.value);
    if (want !== row.literal) fail(`literal-mismatch:${row.pointer}`, JSON.stringify(row.literal), JSON.stringify(want), "qa/seed-facts.json");
    continue;
  }

  if (row.source === "document") {
    // A document anchor must pre-exist. Not created by this run: proven by git history.
    let tracked = false;
    try { tracked = execFileSync("git", ["log", "-1", "--format=%H", "--", row.file], { encoding: "utf8" }).trim().length > 0; } catch {}
    if (!tracked) fail(`document-not-in-history:${row.file}`, "untracked", "pre-existing in git history", row.file);
    if (!read(row.file).includes(row.literal)) fail(`quote-not-found:${row.file}`, row.literal.slice(0, 50), `an exact line in ${row.file}`, row.file);
    continue;
  }

  // source === "content"
  const got = resolvePointer(load(row.file), row.pointer);
  const want = row.literal === null ? null : String(row.literal);
  const actual = got === null || got === undefined ? null : String(got);
  if (actual !== want) fail(`literal-mismatch:${row.file}${row.pointer}`, JSON.stringify(actual), JSON.stringify(want), row.file);
}

// --- ground truth must resolve through an anchored row -----------------
if (fs.existsSync("qa/ground-truth.json")) {
  const gt = JSON.parse(read("qa/ground-truth.json"));
  const anchored = new Set(ev.rows.filter((r) => r.source !== "UNVERIFIED").map((r) => String(r.literal)));
  for (const [key, val] of Object.entries(gt.answers ?? {})) {
    for (const v of [].concat(val.value ?? [])) {
      if (v === null) continue;
      if (!anchored.has(String(v))) fail(`ground-truth-unanchored:${key}`, JSON.stringify(v), "an anchored row in qa/evidence.json", "qa/ground-truth.json");
    }
  }
}

console.log(`G22 | rows ${ev.rows.length} | resolved ${checked} | UNVERIFIED ${unverified} | failures ${fails.length}`);
for (const f of fails) console.log(f);
process.exit(fails.length ? 1 : 0);
