// Step 0 reconciliation. Reads qa/seed-facts.json and every file under content/,
// and reports for each brief fact whether an exact string for it exists in content.
// Writes nothing. Read-only by design: seed-facts is immutable.
import fs from "node:fs";
import path from "node:path";

const seed = JSON.parse(fs.readFileSync("qa/seed-facts.json", "utf8"));

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (p.endsWith(".json")) out.push(p);
  }
  return out;
}

const files = walk("content");
const leaves = []; // {file, pointer, value}
function collect(file, node, pointer) {
  if (node === null) return leaves.push({ file, pointer, value: null });
  if (Array.isArray(node)) return node.forEach((v, i) => collect(file, v, `${pointer}/${i}`));
  if (typeof node === "object") return Object.entries(node).forEach(([k, v]) => collect(file, v, `${pointer}/${k}`));
  leaves.push({ file, pointer, value: node });
}
for (const f of files) collect(f, JSON.parse(fs.readFileSync(f, "utf8")), "");

const norm = (s) => String(s).trim();
const report = [];
for (const fact of seed.facts) {
  if (fact.value === null) { report.push({ id: fact.id, value: fact.value, status: "NULL-BY-DESIGN", hits: [], partial: [] }); continue; }
  const target = norm(fact.value);
  const hits = leaves.filter((l) => l.value !== null && norm(l.value) === target);
  const partial = hits.length ? [] : leaves.filter(
    (l) => typeof l.value === "string" && l.value.length < 120 && (l.value.includes(target) || target.includes(l.value)) && String(l.value).length > 3
  );
  report.push({
    id: fact.id, value: fact.value,
    status: hits.length ? "EXACT" : partial.length ? "PARTIAL" : "ABSENT-FROM-CONTENT",
    hits: hits.slice(0, 3).map((h) => `${h.file}#${h.pointer}`),
    partial: partial.slice(0, 3).map((h) => `${h.file}#${h.pointer} = ${JSON.stringify(h.value).slice(0, 90)}`),
  });
}

const width = Math.max(...report.map((r) => r.id.length));
for (const r of report) {
  console.log(`${r.status.padEnd(20)} ${r.id.padEnd(width)}  ${JSON.stringify(r.value)}`);
  for (const h of r.hits) console.log(`${" ".repeat(21)}  at ${h}`);
  for (const p of r.partial) console.log(`${" ".repeat(21)}  near ${p}`);
}
console.log("\ncontent files:", files.length, " leaves:", leaves.length);
