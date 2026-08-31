#!/usr/bin/env node
/**
 * TFB gates. Reads .render/** (written by scripts/render-harness.mjs), the
 * built out/ tree and src/, and prints ONE LINE PER FAILURE:
 *
 *   SURFACE | GATE-ID | ACTUAL | LIMIT | ARTEFACT-PATH
 *
 *   node scripts/gates.mjs [--surface <name>] [--gate <G05,G08>] [--self-test]
 *
 * Exit code is non-zero when anything failed.
 *
 * Every gate is a pure function of a context object, so the same code runs
 * against the real capture set and against the synthetic fixtures in
 * qa/fixtures/. --self-test asserts each gate FAILS its bad fixture and PASSES
 * its good one: a rule that cannot tell the two apart is not a measurement.
 */
import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const argv = process.argv.slice(2);
const argOf = (n, d) => { const i = argv.indexOf(n); return i === -1 ? d : argv[i + 1]; };
const ONLY_SURFACE = argOf("--surface", null);
const ONLY_GATES = (argOf("--gate", "") || "").split(",").filter(Boolean);
const SELF_TEST = argv.includes("--self-test");
const VERBOSE = argv.includes("--verbose");
const HTTP_PORT = Number(argOf("--port", 4611));

const CURRENT_YEAR = 2026;

// ------------------------------------------------------------- constants ---

const TOKENS = {
  ink: "#14100F", inkSoft: "#4A4341", lotus: "#E31375", lotusDeep: "#8D0C49",
  lotusLight: "#FF77AE", paper: "#FAF7F5", petal: "#F6EAF1", rule: "#E2D8DC",
};
const PETAL_MASK = /^0px\s+\d+(?:\.\d+)?%(?:\s+0px\s+\d+(?:\.\d+)?%)?$/;
const EMERGENCY_NUMBER = "55 31 50 50";

const SURFACE_OF_ROUTE = {
  "/": "home",
  "/articles/": "articles",
  "/articles/loi-krathong-2026/": "articles",
  "/help/": "help",
  "/help/emergency/": "help",
  "/courses/": "courses",
  "/courses/food-hygiene/": "courses",
  "/about/": "about",
  "/about/board/": "about",
  "/about/bylaws/": "about",
  "/about/finances/": "about",
  "/about/membership/": "about",
  "/contact/": "contact",
  "/contact/complaint/": "contact",
  "/privacy/": "contact",
  "/calendar/": "contact",
  "/chooser/": "shell",
  "/design/": "design",
};
const surfaceOf = (route) => SURFACE_OF_ROUTE[route] || "shell";

/** out/<locale>/<rest> back to a route, so HTML-only gates can name a surface. */
function routeOfHtmlPath(rel) {
  const m = rel.match(/^out\/(?:(en|no|th)\/)?(.*)index\.html$/);
  if (!m) return { locale: "root", route: "/chooser/" };
  const locale = m[1] || "root";
  if (!m[1]) return { locale: "root", route: "/chooser/" };
  const rest = m[2];
  return { locale, route: "/" + rest };
}

// ---------------------------------------------------------------- colour ---

function parseColor(c) {
  if (!c) return null;
  const s = String(c).trim();
  let m = s.match(/^#([0-9a-f]{6})$/i);
  if (m) return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4, 6), 16), a: 1 };
  m = s.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
  return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
}
const toHex = (c) => c ? "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase() : "";
const colorIs = (c, hex) => { const p = parseColor(c); return p ? toHex(p) === hex.toUpperCase() : false; };

// --------------------------------------------------------------- context ---

function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function realContext() {
  const metaPath = path.join(ROOT, ".render", "build.json");
  const meta = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf8")) : null;

  const diskFiles = new Set();
  for (const d of ["out", "src", "qa", "design", "scripts", "content", "public", ".design-audit"]) {
    for (const f of walk(path.join(ROOT, d))) diskFiles.add(path.relative(ROOT, f));
  }
  for (const f of ["README.md", "tfb-prompt-and-skeleton.md", "tfb-gauntlet-prompt.md", "package.json", ".gitignore"]) {
    if (fs.existsSync(path.join(ROOT, f))) diskFiles.add(f);
  }

  const textCache = new Map();
  const readFile = (rel) => {
    if (textCache.has(rel)) return textCache.get(rel);
    let t = null;
    try { t = fs.readFileSync(path.join(ROOT, rel), "utf8"); } catch { t = null; }
    textCache.set(rel, t);
    return t;
  };
  const readBuffer = (rel) => { try { return fs.readFileSync(path.join(ROOT, rel)); } catch { return null; } };

  const captures = [];
  if (meta) {
    for (const c of meta.captures || []) {
      if (!c.ok) continue;
      const dump = readJson(c.dumpPath);
      if (!dump) continue;
      captures.push({
        route: c.route, locale: c.locale, width: c.width, nojs: c.nojs,
        surface: surfaceOf(c.route),
        dump, aux: readJson(c.auxPath) || {},
        dumpPath: c.dumpPath, auxPath: c.auxPath, pngPath: c.pngPath, consolePath: c.consolePath,
      });
    }
  }
  function readJson(rel) {
    if (!rel) return null;
    try { return JSON.parse(fs.readFileSync(path.join(ROOT, rel), "utf8")); } catch { return null; }
  }

  return {
    root: ROOT,
    real: true,
    meta,
    buildResult: meta ? meta.build : { code: null },
    today: (meta && meta.buildDate) || new Date().toISOString().slice(0, 10),
    files: null,
    fileList: [...diskFiles].sort(),
    readFile,
    readBuffer,
    captures,
    statuses: null,
    allowlist: readJson("qa/allowlist.json") || [],
    port: HTTP_PORT,
  };
}

function fixtureContext(spec) {
  const files = spec.files || {};
  return {
    root: ROOT,
    real: false,
    meta: spec.meta || null,
    buildResult: spec.buildResult || { code: 0 },
    today: spec.today || "2026-08-30",
    files,
    fileList: Object.keys(files).sort(),
    readFile: (rel) => (rel in files ? files[rel] : null),
    readBuffer: (rel) => (rel in files ? Buffer.from(files[rel]) : null),
    captures: (spec.captures || []).map((c) => ({
      route: c.route, locale: c.locale, width: c.width, nojs: !!c.nojs,
      surface: surfaceOf(c.route),
      dump: c.dump || {}, aux: c.aux || {},
      dumpPath: c.dumpPath || `qa/fixtures/${c.route}.json`,
      auxPath: c.auxPath || `qa/fixtures/${c.route}.aux.json`,
      pngPath: c.pngPath || `qa/fixtures/${c.route}.png`,
      consolePath: c.consolePath || "qa/fixtures/console.txt",
    })),
    statuses: spec.statuses || {},
    allowlist: spec.allowlist || [],
    g22Lines: spec.g22Lines || [],
    port: HTTP_PORT,
  };
}

const glob = (ctx, prefix, ext) =>
  ctx.fileList.filter((f) => f.startsWith(prefix) && (!ext || f.endsWith(ext)));

const htmlPages = (ctx) =>
  glob(ctx, "out/", ".html")
    .filter((f) => !/(^|\/)404\.html$/.test(f) && !f.startsWith("out/404/") && !f.startsWith("out/_not-found/"))
    .map((f) => ({ path: f, ...routeOfHtmlPath(f), html: ctx.readFile(f) || "" }));

const jsCaptures = (ctx, width) =>
  ctx.captures.filter((c) => !c.nojs && (width === undefined || c.width === width));

// ------------------------------------------------------------- http probe --

let serverProc = null;
async function ensureServer(ctx) {
  if (!ctx.real) return;
  if (serverProc) return;
  serverProc = spawn(process.execPath, [path.join(ROOT, "serve-out.mjs")], {
    cwd: ROOT, env: { ...process.env, PORT: String(ctx.port) }, stdio: "ignore",
  });
  for (let i = 0; i < 80; i++) {
    try { const r = await fetch(`http://localhost:${ctx.port}/tfb/`); if (r.status < 500) return; } catch { /* wait */ }
    await new Promise((r) => setTimeout(r, 150));
  }
}
function stopServer() { if (serverProc) { serverProc.kill(); serverProc = null; } }

const statusCache = new Map();
async function statusOf(ctx, url) {
  if (!ctx.real) return ctx.statuses[url] ?? 200;
  if (statusCache.has(url)) return statusCache.get(url);
  let code = 0;
  try { code = (await fetch(url, { method: "GET" })).status; } catch { code = 0; }
  statusCache.set(url, code);
  return code;
}
const SITE_URL = "https://sheikhmataev.github.io/tfb";
const localise = (ctx, url) => url.startsWith(SITE_URL) ? `http://localhost:${ctx.port}/tfb` + url.slice(SITE_URL.length) : url;

// ------------------------------------------------------------ tiny parsers --

const stripTags = (h) => h.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

/** All attribute URL values in a document that a browser would fetch. */
function urlAttrs(html) {
  const out = [];
  const re = /\b(src|href|srcset|content)\s*=\s*"([^"]*)"/gi;
  let m;
  while ((m = re.exec(html))) {
    const attr = m[1].toLowerCase(), raw = m[2];
    if (attr === "srcset") {
      for (const part of raw.split(",")) {
        const u = part.trim().split(/\s+/)[0];
        if (u) out.push({ attr, value: u });
      }
    } else out.push({ attr, value: raw });
  }
  return out;
}

function alternates(html) {
  const out = [];
  const re = /<link\b[^>]*\brel\s*=\s*"alternate"[^>]*>/gi;
  let m;
  while ((m = re.exec(html))) {
    const tag = m[0];
    const hl = tag.match(/\bhreflang\s*=\s*"([^"]*)"/i);
    const hf = tag.match(/\bhref\s*=\s*"([^"]*)"/i);
    if (hl && hf) out.push({ hreflang: hl[1], href: hf[1] });
  }
  return out;
}

/** Split a stylesheet into { selector, body } rules, skipping at-rule wrappers. */
function cssRules(text) {
  const out = [];
  const src = text.replace(/\/\*[\s\S]*?\*\//g, "");
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(src))) {
    const sel = m[1].trim();
    if (!sel || sel.startsWith("@")) continue;
    out.push({ selector: sel, body: m[2] });
  }
  return out;
}

// -------------------------------------------------------------- the gates --

const GATES = [];
const gate = (id, title, run) => GATES.push({ id, title, run });

/* ---- G01 BUILD AND ROOT ------------------------------------------------ */
gate("G01", "build and root", async (ctx, F) => {
  const code = ctx.buildResult ? ctx.buildResult.code : null;
  if (code !== 0) F("shell", "G01", `build exit ${code}`, "exit 0", ".render/build.json");
  const idx = ctx.readFile("out/index.html");
  if (idx === null) { F("shell", "G01", "out/index.html missing", "present", "out/index.html"); return; }
  for (const target of ["/tfb/en/", "/tfb/no/", "/tfb/th/"]) {
    if (!idx.includes(target)) F("shell", "G01", `root does not link ${target}`, "linked", "out/index.html");
  }
  for (const bad of ["Application error", "__next_error__", "digest"]) {
    if (idx.includes(bad)) F("shell", "G01", `root contains "${bad}"`, "absent", "out/index.html");
  }
  for (const f of glob(ctx, "src/app/")) {
    const t = ctx.readFile(f);
    if (!t) continue;
    // Comments are stripped first. A prose line explaining why redirect() cannot
    // run in a static export is not a call, and a gate that cannot tell the two
    // apart would order a builder to delete correct documentation.
    const code = t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/[^\n]*/g, "$1");
    if (/\bredirect\s*\(/.test(code)) F("shell", "G01", `redirect( called in ${f}`, "0 occurrences", f);
  }
});

/* ---- G02 BASEPATH ------------------------------------------------------ */
gate("G02", "basePath", async (ctx, F) => {
  await ensureServer(ctx);
  const seen = new Map();
  for (const p of htmlPages(ctx)) {
    for (const { value } of urlAttrs(p.html)) {
      if (!value.startsWith("/")) continue;
      if (!seen.has(value)) seen.set(value, p);
    }
  }
  for (const [value, p] of seen) {
    const s = surfaceOf(p.route);
    if (!value.startsWith("/tfb/")) {
      F(s, "G02", `${value}`, "starts with /tfb/", p.path);
      continue;
    }
    const code = await statusOf(ctx, `http://localhost:${ctx.port}${value}`);
    if (code !== 200) F(s, "G02", `${value} -> ${code}`, "200", p.path);
  }
});

/* ---- G03 HREFLANG ------------------------------------------------------ */
gate("G03", "hreflang", async (ctx, F) => {
  await ensureServer(ctx);
  const want = ["en", "nb", "th", "x-default"];
  for (const p of htmlPages(ctx)) {
    const s = surfaceOf(p.route);
    const alts = alternates(p.html);
    const byLang = {};
    for (const a of alts) byLang[a.hreflang.toLowerCase()] = (byLang[a.hreflang.toLowerCase()] || []).concat(a.href);
    for (const w of want) {
      const n = (byLang[w] || []).length;
      if (n !== 1) F(s, "G03", `hreflang ${w} x${n}`, "exactly 1", p.path);
    }
    for (const k of Object.keys(byLang)) {
      if (!want.includes(k)) F(s, "G03", `unexpected hreflang ${k}`, "en, nb, th, x-default only", p.path);
    }
    for (const a of alts) {
      if (!/^https?:\/\//i.test(a.href)) F(s, "G03", `${a.hreflang} ${a.href}`, "absolute URL", p.path);
      const n = (a.href.match(/\/tfb/g) || []).length;
      if (n !== 1) F(s, "G03", `${a.hreflang} has /tfb x${n}`, "exactly 1", p.path);
      const code = await statusOf(ctx, localise(ctx, a.href));
      if (code !== 200) F(s, "G03", `${a.hreflang} ${a.href} -> ${code}`, "200", p.path);
    }
  }
});

/* ---- G04 THAI SCALE ---------------------------------------------------- */
const RELATIVE_FONT_SIZE = /font-size\s*:\s*([^;}]+)/i;
function isRootAnchored(part) {
  const s = part.trim();
  if (/[\s>+~]/.test(s)) return false;
  if (!/^(html|:root)[:.\[]/.test(s)) return false;
  // Everything after the html/:root subject must be a pseudo-class, attribute
  // or class on that same element, never another element.
  const rest = s.replace(/^(html|:root)/, "");
  return /^(?::[a-z-]+(?:\([^)]*\))?|\.[\w-]+|\[[^\]]*\])+$/i.test(rest);
}
gate("G04", "thai scale", async (ctx, F) => {
  // Static clause.
  for (const f of glob(ctx, "src/", ".css")) {
    const text = ctx.readFile(f) || "";
    for (const rule of cssRules(text)) {
      if (!rule.selector.includes(":lang(")) continue;
      const m = rule.body.match(RELATIVE_FONT_SIZE);
      if (!m) continue;
      const value = m[1].trim();
      if (!/(\d|\.)\s*(%|em|ex|ch|lh)\b|^(larger|smaller)$/i.test(value)) continue;
      for (const part of rule.selector.split(",")) {
        if (!part.includes(":lang(")) continue;
        if (isRootAnchored(part)) continue;
        F("shell", "G04", `${part.trim()} { font-size: ${value} }`, "root-anchored :lang() only", f);
      }
    }
  }
  // Measured clause.
  const at = (route, locale) => jsCaptures(ctx, 1280).find((c) => c.route === route && c.locale === locale);
  const routes = [...new Set(jsCaptures(ctx, 1280).map((c) => c.route))];
  for (const route of routes) {
    const en = at(route, "en");
    if (!en || !en.dump.documentHeight) continue;
    for (const loc of ["no", "th"]) {
      const other = at(route, loc);
      if (!other) continue;
      const ratio = other.dump.documentHeight / en.dump.documentHeight;
      if (ratio < 0.85 || ratio > 1.35) {
        F(surfaceOf(route), "G04", `${loc}/en height ${ratio.toFixed(3)} on ${route}`, "0.85 to 1.35", other.dumpPath);
      }
    }
  }
});

/* ---- G05 NO COMPOUNDING TYPE ------------------------------------------- */
// The disease is a relative font-size on a selector that matches every
// descendant, so the multiplier is applied once per nesting level. It shows as
// the SAME ratio recurring down a chain. A single step from 17px to 34px is a
// declared display size, not compounding, and a gate that cannot tell the two
// apart reports every wordmark, price and date rail on the site.
gate("G05", "no compounding type", async (ctx, F) => {
  for (const c of ctx.captures) {
    const headings = c.dump.headingOutline || [];
    const byRatio = new Map();
    for (const t of c.dump.textNodes || []) {
      if (!t.parentFontSizePx || !t.fontSizePx) continue;
      const r = t.fontSizePx / t.parentFontSizePx;
      if (r <= 1.02 || r > 1.6) continue; // a per-level multiplier is small
      const declared = headings.some((h) => Math.abs(h.fontSizePx - t.fontSizePx) < 0.51 && (h.text === t.text || h.text.startsWith(t.text) || t.text.startsWith(h.text)));
      if (declared) continue;
      const key = r.toFixed(2);
      if (!byRatio.has(key)) byRatio.set(key, []);
      byRatio.get(key).push(t);
    }
    for (const [key, nodes] of byRatio) {
      const depths = new Set(nodes.map((n) => n.depth));
      if (depths.size < 3) continue;
      // Confirm it is a chain, not three unrelated elements that happen to share
      // a ratio: the sizes must form a rising staircase across those depths.
      const sizes = [...new Set(nodes.map((n) => Math.round(n.fontSizePx * 100) / 100))].sort((a, b) => a - b);
      if (sizes.length < 3) continue;
      const worst = nodes.reduce((a, b) => (b.depth > a.depth ? b : a));
      F(c.surface, "G05", `ratio ${key} recurs at ${depths.size} depths, sizes ${sizes.slice(0, 5).join("/")}px, deepest "${worst.text.slice(0, 32)}"`,
        "a font-size multiplier may not recur down a chain", c.dumpPath);
    }
  }
});

/* ---- G06 NO-JS --------------------------------------------------------- */
gate("G06", "no-js", async (ctx, F) => {
  for (const nj of ctx.captures.filter((c) => c.nojs)) {
    const js = ctx.captures.find((c) => !c.nojs && c.route === nj.route && c.locale === nj.locale && c.width === nj.width);
    const nText = (nj.dump.renderedTextConcat || "").length;
    if (js) {
      const jText = (js.dump.renderedTextConcat || "").length;
      if (jText > 0 && nText < jText * 0.95) {
        F(nj.surface, "G06", `no-js text ${nText} of ${jText} (${((nText / jText) * 100).toFixed(1)}%)`, ">= 95%", nj.dumpPath);
      }
    }
    const hidden = (nj.dump.textNodes || []).filter((t) => Number(t.opacity) === 0 || t.visibility === "hidden");
    if (hidden.length) {
      F(nj.surface, "G06", `${hidden.length} hidden text nodes in server HTML, first "${hidden[0].text.slice(0, 40)}"`, "0", nj.dumpPath);
    }
    if (!(nj.dump.renderedTextConcat || "").includes(EMERGENCY_NUMBER)) {
      F(nj.surface, "G06", `no-js render lacks ${EMERGENCY_NUMBER}`, "present", nj.dumpPath);
    }
  }
});

/* ---- G07 HEADING OUTLINE ----------------------------------------------- */
gate("G07", "heading outline", async (ctx, F) => {
  for (const c of jsCaptures(ctx, 1280)) {
    const hs = [...(c.dump.headingOutline || [])].sort((a, b) => a.y - b.y);
    const h1s = hs.filter((h) => h.tag === "h1");
    if (h1s.length !== 1) F(c.surface, "G07", `${h1s.length} h1 on ${c.route} (${c.locale})`, "exactly 1", c.dumpPath);
    let prev = 0;
    for (const h of hs) {
      const lvl = Number(h.tag.slice(1));
      if (prev && lvl > prev + 1) {
        F(c.surface, "G07", `h${prev} then h${lvl} "${h.text.slice(0, 40)}"`, "no skipped level", c.dumpPath);
      }
      prev = lvl;
    }
    let seenH2 = false;
    for (const h of hs) {
      if (h.tag === "h2") seenH2 = true;
      if (h.tag === "h3" && !seenH2) F(c.surface, "G07", `h3 "${h.text.slice(0, 40)}" before any h2`, "h3 follows an h2", c.dumpPath);
    }
    for (const s of (c.aux.sections || [])) {
      if (!norm(s.name)) F(c.surface, "G07", `section ${s.selector || s.id || "(unnamed)"} has no accessible name`, "aria-label or aria-labelledby", c.auxPath);
    }
    if (c.route === "/") {
      const h2 = hs.filter((h) => h.tag === "h2").length;
      if (h2 < 5) F(c.surface, "G07", `${h2} h2 on home (${c.locale})`, ">= 5", c.dumpPath);
    }
  }
});

/* ---- G08 TAP TARGETS --------------------------------------------------- */
gate("G08", "tap targets", async (ctx, F) => {
  for (const c of ctx.captures.filter((x) => !x.nojs && (x.width === 390 || x.width === 1280))) {
    for (const el of c.dump.interactive || []) {
      // Visually hidden controls (the sr-only skip link) are not tap targets.
      if (el.w * el.h <= 4) continue;
      if (el.inProse) {
        if (el.h < 24) F(c.surface, "G08", `prose link "${el.text.slice(0, 32)}" ${el.w}x${el.h} @${c.width}`, ">= 24px tall", c.dumpPath);
        if (!colorIs(el.color, TOKENS.lotusDeep)) {
          F(c.surface, "G08", `prose link "${el.text.slice(0, 32)}" ${toHex(parseColor(el.color)) || el.color}`, TOKENS.lotusDeep, c.dumpPath);
        }
      } else if (el.w < 44 || el.h < 44) {
        F(c.surface, "G08", `${el.tag} "${el.text.slice(0, 32)}" ${el.w}x${el.h} @${c.width}`, "44x44", c.dumpPath);
      }
    }
    const hb = c.dump.helpBar;
    if (!hb) continue;
    if (hb.phoneTapW < 44 || hb.phoneTapH < 44) {
      F(c.surface, "G08", `Krisesenteret tap ${hb.phoneTapW}x${hb.phoneTapH} @${c.width}`, "44x44", c.dumpPath);
    }
    if (hb.phoneFontSizePx < 20) {
      F(c.surface, "G08", `Krisesenteret type ${hb.phoneFontSizePx}px @${c.width}`, ">= 20px", c.dumpPath);
    }
    const ys = [hb.yAtScroll?.[0], hb.yAtScroll?.[50], hb.yAtScroll?.[100]];
    if (!(ys[0] === ys[1] && ys[1] === ys[2])) {
      F(c.surface, "G08", `help bar y ${ys.join("/")} at 0/50/100% @${c.width}`, "identical", c.dumpPath);
    }
    for (const pct of [0, 50, 100]) {
      if (hb.presentAtScroll && hb.presentAtScroll[pct] === false) {
        F(c.surface, "G08", `help bar absent at ${pct}% scroll @${c.width}`, "present", c.dumpPath);
      }
    }
  }
});

/* ---- G09 NO VOID FRAMES ------------------------------------------------ */
function frameLike(box, auxBox) {
  const widths = (auxBox && auxBox.borderWidths) || [];
  const hasBorder = box.borderStyle && box.borderStyle !== "none" && widths.some((w) => Number(w) > 0);
  const hasBgImage = box.backgroundImage && box.backgroundImage !== "none";
  const bg = parseColor(box.backgroundColor);
  const hasFill = !!bg && bg.a > 0 && toHex(bg) !== TOKENS.paper;
  return hasBorder || hasBgImage || hasFill;
}
gate("G09", "no void frames", async (ctx, F) => {
  for (const c of jsCaptures(ctx)) {
    const auxBySel = new Map((c.aux.boxes || []).map((b, i) => [i, b]));
    (c.dump.boxes || []).forEach((box, i) => {
      if (box.w < 88 || box.h < 88) return;
      if (box.hasTextContent || box.containsLoadedImage) return;
      if (!frameLike(box, auxBySel.get(i))) return;
      F(c.surface, "G09", `${box.selector} ${box.w}x${box.h} fill ${box.backgroundColor} border ${box.borderStyle}`,
        "no empty framed box", c.pngPath);
    });
  }
});

/* ---- G10 LINK MASS ----------------------------------------------------- */
gate("G10", "link mass", async (ctx, F) => {
  for (const c of jsCaptures(ctx, 1280)) {
    for (const l of c.dump.links || []) {
      if (l.inProse) continue;
      if (l.chars > 40) F(c.surface, "G10", `${l.chars} char link "${l.text.slice(0, 48)}"`, "<= 40 chars outside prose", c.dumpPath);
    }
  }
  for (const p of htmlPages(ctx)) {
    const s = surfaceOf(p.route);
    const blocks = [...p.html.matchAll(/<table\b[\s\S]*?<\/table>/gi), ...p.html.matchAll(/<dl\b[\s\S]*?<\/dl>/gi)].map((m) => m[0]);
    for (const block of blocks) {
      const isDl = /^<dl/i.test(block);
      const cells = isDl
        ? [...block.matchAll(/<dd\b[\s\S]*?<\/dd>/gi)].map((m) => m[0])
        : [...block.matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map((m) => {
            const tds = [...m[0].matchAll(/<td\b[\s\S]*?<\/td>/gi)].map((x) => x[0]);
            return tds.length ? tds[tds.length - 1] : null;
          }).filter(Boolean);
      for (const cell of cells) {
        const anchors = [...cell.matchAll(/<a\b[\s\S]*?<\/a>/gi)].map((m) => m[0]);
        if (!anchors.length) continue;
        const cellText = stripTags(cell);
        const anchorText = norm(anchors.map(stripTags).join(" "));
        if (cellText && cellText === anchorText) {
          F(s, "G10", `value cell is entirely a link: "${cellText.slice(0, 48)}"`, "link is a named target beside the value", p.path);
        }
      }
      const total = stripTags(block).length;
      const linked = [...block.matchAll(/<a\b[\s\S]*?<\/a>/gi)].map((m) => stripTags(m[0])).join("").length;
      if (total > 0 && linked / total >= 0.25) {
        F(s, "G10", `${((linked / total) * 100).toFixed(0)}% of table glyphs are lotus links`, "< 25%", p.path);
      }
    }
  }
});

/* ---- G11 PETAL MASK ---------------------------------------------------- */
gate("G11", "petal mask", async (ctx, F) => {
  for (const c of jsCaptures(ctx)) {
    for (const box of c.dump.boxes || []) {
      if (!PETAL_MASK.test(norm(box.borderRadius))) continue;
      if (!box.w || !box.h) continue;
      const ar = box.w / box.h;
      if (Math.abs(ar - 1) > 0.02) {
        F(c.surface, "G11", `${box.selector} ${box.w}x${box.h} ratio ${ar.toFixed(3)}`, "1:1 within 2%", c.pngPath);
      }
    }
  }
});

/* ---- G12 FLAT SURFACES ------------------------------------------------- */
function radiusAllowed(r) {
  const v = norm(r);
  if (!v) return true;
  if (PETAL_MASK.test(v)) return true;
  const parts = v.split(/\s+/);
  return parts.every((p) => p === "0px" || p === "2px");
}
gate("G12", "flat surfaces", async (ctx, F) => {
  for (const c of jsCaptures(ctx)) {
    for (const box of c.dump.boxes || []) {
      if (box.boxShadow && box.boxShadow !== "none") {
        F(c.surface, "G12", `${box.selector} box-shadow ${box.boxShadow.slice(0, 40)}`, "none", c.dumpPath);
      }
      if (box.backgroundImage && /gradient/i.test(box.backgroundImage)) {
        F(c.surface, "G12", `${box.selector} ${box.backgroundImage.slice(0, 40)}`, "no gradients", c.dumpPath);
      }
      if (!radiusAllowed(box.borderRadius)) {
        F(c.surface, "G12", `${box.selector} radius ${box.borderRadius}`, "0px, 2px or the petal mask", c.dumpPath);
      }
    }
  }
});

/* ---- G13 TYPE AND COLOUR, MEASURED ------------------------------------- */
gate("G13", "type and colour", async (ctx, F) => {
  for (const c of jsCaptures(ctx)) {
    for (const t of c.dump.textNodes || []) {
      if (t.visibility === "hidden" || Number(t.opacity) === 0) continue;
      if (t.fontSizePx < 17) {
        F(c.surface, "G13", `${t.fontSizePx}px "${t.text.slice(0, 40)}"`, ">= 17px", c.dumpPath);
      }
      if (/Marcellus/i.test(t.fontFamily || "") && t.fontSizePx < 20) {
        F(c.surface, "G13", `Marcellus at ${t.fontSizePx}px "${t.text.slice(0, 40)}"`, ">= 20px", c.dumpPath);
      }
      if (colorIs(t.color, TOKENS.lotus) && t.fontSizePx < 24) {
        F(c.surface, "G13", `${TOKENS.lotus} at ${t.fontSizePx}px "${t.text.slice(0, 40)}"`, `${TOKENS.lotus} only >= 24px, else ${TOKENS.lotusDeep}`, c.dumpPath);
      }
    }
    for (const row of c.aux.contrast || []) {
      const need = row.fontSizePx >= 24 ? 3 : 4.5;
      if (row.contrast < need) {
        F(c.surface, "G13", `${row.contrast}:1 ${row.color} on ${row.background} at ${row.fontSizePx}px "${row.text.slice(0, 30)}"`, `${need}:1`, c.auxPath);
      }
    }
  }
});

/* ---- G14 ONE NAV ------------------------------------------------------- */
gate("G14", "one nav", async (ctx, F) => {
  for (const c of jsCaptures(ctx, 1280)) {
    const lm = c.dump.landmarks || {};
    const SECTION_WORDS = ["help", "calendar", "articles", "about", "courses", "contact",
      "hjelp", "kalender", "artikler", "om", "kurs", "kontakt"];
    const isSiteNav = (links) => {
      const t = links.map((x) => norm(x).toLowerCase());
      return SECTION_WORDS.filter((w) => t.some((x) => x === w || x.startsWith(w + " "))).length >= 3
        || links.length >= 5;
    };
    const siteNavs = (lm.navLinkTexts || []).filter(isSiteNav);
    if (siteNavs.length !== 1) {
      F(c.surface, "G14", `${siteNavs.length} SITE navigation landmarks on ${c.route} (${c.locale}), ${lm.navCount} nav elements in total`, "exactly 1 site nav", c.dumpPath);
    }
    const sets = (lm.navLinkTexts || []).map((a) => new Set(a.map(norm).filter(Boolean)));
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        const shared = [...sets[i]].filter((t) => sets[j].has(t));
        if (shared.length) F(c.surface, "G14", `navs ${i} and ${j} share ${shared.slice(0, 3).join(", ")}`, "empty intersection", c.dumpPath);
      }
    }
  }
});

/* ---- G15 NO DOUBLED TITLE ---------------------------------------------- */
gate("G15", "no doubled title", async (ctx, F) => {
  for (const c of jsCaptures(ctx, 1280)) {
    const hs = c.dump.headingOutline || [];
    const h1 = hs.find((h) => h.tag === "h1");
    if (!h1) continue;
    const title = norm(h1.text);
    if (!title) continue;
    const repeats = hs.filter((h) => norm(h.text) === title && h !== h1);
    if (repeats.length) {
      F(c.surface, "G15", `h1 "${title.slice(0, 40)}" repeats as ${repeats.map((r) => r.tag).join(", ")}`, "h1 appears once", c.dumpPath);
    }
    const near = [
      ...hs.filter((h) => h !== h1),
      ...(c.dump.interactive || []),
    ].filter((e) => e.y < 1200 && norm(e.text) === title);
    if (near.length) {
      F(c.surface, "G15", `"${title.slice(0, 40)}" recurs ${near.length}x above 1200px`, "once in the top 1200px", c.pngPath);
    }
  }
});

/* ---- G16 DATE RANGES --------------------------------------------------- */
const RANGE_RE = /\b((?:19|20)\d{2})\s*(?:to|til|ถึง|through|until|-|–)\s*((?:19|20)\d{2})\b/g;
const ARCHIVE_LABELS = ["From the archive", "Fra arkivet", "จากคลังข้อมูล"];
function archiveRangeFromContent(ctx) {
  const read = (p) => { const t = ctx.readFile(p); return t ? JSON.parse(t) : []; };
  const all = [...read("content/entries/archive.json"), ...read("content/entries/upcoming.json")];
  const today = ctx.today;
  const past = all
    .map((e) => (e.eventStartsAt || e.publishedAt || "").slice(0, 10))
    .filter((d) => d && d <= today);
  if (!past.length) return null;
  const years = past.map((d) => d.slice(0, 4)).sort();
  return { from: years[0], to: years[years.length - 1] };
}
gate("G16", "date ranges", async (ctx, F) => {
  const computed = archiveRangeFromContent(ctx);
  for (const c of jsCaptures(ctx, 1280)) {
    const text = c.dump.renderedTextConcat || "";
    RANGE_RE.lastIndex = 0;
    let m;
    while ((m = RANGE_RE.exec(text))) {
      const hi = Math.max(Number(m[1]), Number(m[2]));
      if (hi > CURRENT_YEAR) {
        F(c.surface, "G16", `range "${m[0]}" maximum ${hi}`, `<= ${CURRENT_YEAR}`, c.dumpPath);
      }
    }
    if (!computed) continue;
    for (const label of ARCHIVE_LABELS) {
      const i = text.indexOf(label);
      if (i === -1) continue;
      const tail = text.slice(i, i + 120);
      const years = tail.match(/(?:19|20)\d{2}/g);
      if (!years || years.length < 2) continue;
      const rendered = `${years[0]}-${years[1]}`;
      const expect = `${computed.from}-${computed.to}`;
      if (rendered !== expect) {
        F(c.surface, "G16", `archive range rendered ${rendered}`, `recomputed ${expect}`, c.dumpPath);
      }
      break;
    }
  }
});

/* ---- G17 NO HORIZONTAL SCROLL ------------------------------------------ */
gate("G17", "no horizontal scroll", async (ctx, F) => {
  for (const c of ctx.captures.filter((x) => x.width === 390 && !x.nojs)) {
    if (c.dump.scrollWidth > c.dump.innerWidth) {
      F(c.surface, "G17", `scrollWidth ${c.dump.scrollWidth} on ${c.route} (${c.locale})`, `<= ${c.dump.innerWidth}`, c.pngPath);
    }
  }
});

/* ---- G18 ORPHANS ------------------------------------------------------- */
gate("G18", "orphans", async (ctx, F) => {
  // (a) components reachable from a page or layout
  const srcFiles = glob(ctx, "src/").filter((f) => /\.(tsx|ts)$/.test(f));
  const resolve = (from, spec) => {
    let base;
    if (spec.startsWith("@/")) base = "src/" + spec.slice(2);
    else if (spec.startsWith(".")) base = path.posix.normalize(path.posix.join(path.posix.dirname(from), spec));
    else return null;
    for (const cand of [base, base + ".tsx", base + ".ts", base + "/index.tsx", base + "/index.ts"]) {
      if (srcFiles.includes(cand)) return cand;
    }
    return null;
  };
  const importsOf = (f) => {
    const t = ctx.readFile(f) || "";
    const out = [];
    const re = /from\s+"([^"]+)"/g;
    let m;
    while ((m = re.exec(t))) { const r = resolve(f, m[1]); if (r) out.push(r); }
    return out;
  };
  const roots = srcFiles.filter((f) => /^src\/app\/.*\/(page|layout)\.tsx$/.test(f) || /^src\/app\/(page|layout)\.tsx$/.test(f));
  const seen = new Set(roots);
  const queue = [...roots];
  while (queue.length) {
    const f = queue.pop();
    for (const dep of importsOf(f)) if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
  }
  for (const f of srcFiles.filter((f) => f.startsWith("src/components/"))) {
    if (!seen.has(f)) F("shell", "G18", `${f} is never imported by a page`, "transitively imported", f);
  }

  // (b) globals.css utilities, classes and keyframes must match built HTML
  const cssPath = "src/app/globals.css";
  const css = ctx.readFile(cssPath) || "";
  const pages = htmlPages(ctx);
  const allHtml = pages.map((p) => p.html).join("\n");
  const classAttrs = allHtml.match(/class="[^"]*"/g) || [];
  const usedClasses = new Set();
  for (const a of classAttrs) for (const cl of a.slice(7, -1).split(/\s+/)) if (cl) usedClasses.add(cl);
  const usedIds = new Set((allHtml.match(/\bid="([^"]*)"/g) || []).map((s) => s.slice(4, -1)));

  for (const m of css.matchAll(/@utility\s+([\w-]+)/g)) {
    if (!usedClasses.has(m[1])) F("shell", "G18", `@utility ${m[1]} matches no element`, "used at least once", cssPath);
  }
  const builtCss = glob(ctx, "out/_next/", ".css").map((f) => ctx.readFile(f) || "").join("\n");
  for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) {
    const name = m[1];
    const used = new RegExp(`animation(?:-name)?\\s*:[^;}]*\\b${name}\\b`).test(builtCss) || new RegExp(`animation(?:-name)?\\s*:[^;}]*\\b${name}\\b`).test(css);
    if (!used) F("shell", "G18", `@keyframes ${name} is never referenced`, "animated by a rule", cssPath);
  }
  // (d) effect rules whose selectors never render
  for (const rule of cssRules(css)) {
    if (!/(transition|animation|opacity|transform)\s*:/.test(rule.body)) continue;
    for (const rawPart of rule.selector.split(",")) {
      // A class inside :not() is a negation, not a target: it is expected to be
      // absent from the markup and must not be reported as an orphan.
      const part = rawPart.replace(/:not\([^)]*\)/g, "");
      for (const cm of part.matchAll(/\.([\w-]+)/g)) {
        if (!usedClasses.has(cm[1])) F("shell", "G18", `effect rule "${norm(part)}" targets .${cm[1]}, which never renders`, "selector matches an element", cssPath);
      }
      for (const im of part.matchAll(/#([\w-]+)/g)) {
        if (!usedIds.has(im[1])) F("shell", "G18", `effect rule "${norm(part)}" targets #${im[1]}, which never renders`, "selector matches an element", cssPath);
      }
      for (const am of part.matchAll(/\[([\w-]+)(?:[~^$*|]?=[^\]]*)?\]/g)) {
        // An attribute set by an inline script before first paint never appears
        // as markup, but its name is in the document. That counts as rendering.
        if (!allHtml.includes(am[1])) {
          F("shell", "G18", `effect rule "${norm(part)}" targets [${am[1]}], which never renders`, "selector matches an element", cssPath);
        }
      }
    }
  }

  // (c) public/assets referenced by the build
  const refHaystack = allHtml + "\n" + builtCss + "\n" + glob(ctx, "out/", ".svg").map((f) => ctx.readFile(f) || "").join("\n");
  for (const f of glob(ctx, "public/assets/")) {
    const name = path.basename(f);
    if (!refHaystack.includes(name)) F("shell", "G18", `public/assets/${name} is never referenced`, "referenced by the build", f);
  }
});

/* ---- G19 EM DASHES ----------------------------------------------------- */
const EM_DASH = "\u2014";
const TEXTUAL = /\.(html|css|js|mjs|cjs|ts|tsx|json|md|txt|svg|yml|yaml)$/i;
gate("G19", "em dashes", async (ctx, F) => {
  const scopes = [
    { prefix: "out/", ext: ".html" },
    { prefix: "design/" },
    { prefix: ".design-audit/" },
    { prefix: "qa/" },
    { prefix: "scripts/" },
    { prefix: "README.md" },
    { prefix: "tfb-prompt-and-skeleton.md" },
    { prefix: "tfb-gauntlet-prompt.md" },
  ];
  const seen = new Set();
  for (const sc of scopes) {
    for (const f of glob(ctx, sc.prefix, sc.ext)) {
      if (seen.has(f)) continue;
      seen.add(f);
      if (!sc.ext && !TEXTUAL.test(f)) continue;
      const t = ctx.readFile(f);
      if (t === null) continue;
      const n = (t.match(new RegExp(EM_DASH, "g")) || []).length;
      if (n) {
        const s = f.startsWith("out/") ? surfaceOf(routeOfHtmlPath(f).route) : "shell";
        F(s, "G19", `${n} em dashes in ${f}`, "0", f);
      }
    }
  }
});

/* ---- G20 PARITY -------------------------------------------------------- */
function localisedTriples(ctx) {
  const triples = [];
  const strings = ctx.readFile("src/lib/strings.ts") || "";
  const re = /\{\s*en:\s*("(?:[^"\\]|\\.)*")\s*,\s*no:\s*("(?:[^"\\]|\\.)*")\s*,\s*th:\s*("(?:[^"\\]|\\.)*")\s*\}/g;
  let m;
  while ((m = re.exec(strings))) {
    try { triples.push({ en: JSON.parse(m[1]), no: JSON.parse(m[2]), th: JSON.parse(m[3]), from: "src/lib/strings.ts" }); } catch { /* skip */ }
  }
  const visit = (node, from) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { for (const v of node) visit(v, from); return; }
    const k = Object.keys(node);
    if (k.includes("en") && k.includes("no") && k.includes("th") && k.every((x) => typeof node[x] === "string" || node[x] === null)) {
      if (node.en && node.no && node.th) triples.push({ en: node.en, no: node.no, th: node.th, from });
      return;
    }
    for (const v of Object.values(node)) visit(v, from);
  };
  for (const f of glob(ctx, "content/", ".json")) {
    const t = ctx.readFile(f);
    if (!t) continue;
    try { visit(JSON.parse(t), f); } catch { /* skip */ }
  }
  return triples;
}
gate("G20", "parity", async (ctx, F) => {
  const routes = [...new Set(jsCaptures(ctx, 1280).map((c) => c.route))];
  for (const route of routes) {
    const byLocale = {};
    for (const l of ["en", "no", "th"]) {
      const c = jsCaptures(ctx, 1280).find((x) => x.route === route && x.locale === l);
      if (c) byLocale[l] = c;
    }
    const en = byLocale.en;
    if (!en) continue;
    const metric = (c) => ({
      entries: c.aux.liCount ?? 0,
      headings: (c.dump.headingOutline || []).length,
      links: (c.dump.links || []).length,
    });
    const base = metric(en);
    for (const l of ["no", "th"]) {
      const c = byLocale[l];
      if (!c) continue;
      const m = metric(c);
      for (const key of ["entries", "headings", "links"]) {
        if (m[key] !== base[key]) {
          F(surfaceOf(route), "G20", `${route} ${l} ${key} ${m[key]} vs en ${base[key]}`, "identical", c.dumpPath);
        }
      }
    }
  }
  const triples = localisedTriples(ctx);
  const allow = new Set((ctx.allowlist || []).map((a) => (typeof a === "string" ? a : a.text)));
  for (const c of jsCaptures(ctx, 1280)) {
    if (c.locale !== "th" && c.locale !== "no") continue;
    const text = c.dump.renderedTextConcat || "";
    const hits = new Set();
    for (const t of triples) {
      const localised = t[c.locale];
      if (!t.en || t.en.length < 3 || localised === t.en) continue;
      if (allow.has(t.en)) continue;
      if (text.includes(localised)) continue;
      // A Latin-script string must occur as a whole word. "Thailand" inside the
      // Norwegian "Thailandsk" is not an untranslated English string.
      const whole = /^[\x20-\x7E]+$/.test(t.en)
        ? new RegExp(`(?:^|[^\\p{L}\\p{N}])${t.en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[^\\p{L}\\p{N}]|$)`, "u").test(text)
        : text.includes(t.en);
      if (whole) hits.add(t.en);
    }
    for (const h of [...hits].slice(0, 20)) {
      F(c.surface, "G20", `English on /${c.locale}${c.route}: "${h.slice(0, 48)}"`, "translated or allowlisted", "qa/allowlist.json");
    }
  }
});

/* ---- G21 DENSITY ------------------------------------------------------- */
gate("G21", "density", async (ctx, F) => {
  for (const c of jsCaptures(ctx, 1280)) {
    if (c.route === "/") {
      // The word band is only meaningful where words are separated by whitespace.
      // Thai is written without inter-word spaces, so splitting on whitespace counts
      // whole phrases as one word and reports a page four times denser than it reads
      // as one quarter the size. Thai density is checked against the English page's
      // character count instead, which is the same quantity measured a way Thai
      // actually supports.
      if (c.locale === "th") {
        const en = jsCaptures(ctx, 1280).find((x) => x.route === "/" && x.locale === "en");
        const enChars = (en?.dump?.renderedTextConcat || "").replace(/\s+/g, "").length;
        const thChars = (c.dump.renderedTextConcat || "").replace(/\s+/g, "").length;
        const ratio = enChars ? thChars / enChars : 0;
        if (enChars && (ratio < 0.55 || ratio > 1.6)) {
          F(c.surface, "G21", `th/en rendered character ratio ${ratio.toFixed(2)} on home`, "0.55 to 1.60", c.dumpPath);
        }
      } else {
        const w = c.dump.wordCount || 0;
        if (w < 550 || w > 1200) F(c.surface, "G21", `${w} words on home (${c.locale})`, "550 to 1200", c.dumpPath);
      }
      if ((c.dump.aboveFoldLinkCount || 0) > 18) {
        F(c.surface, "G21", `${c.dump.aboveFoldLinkCount} above-fold links on home (${c.locale})`, "<= 18", c.dumpPath);
      }
      const firstHeadingY = Math.min(...((c.dump.headingOutline || []).map((h) => h.y).concat([Infinity])));
      for (const im of c.aux.images || []) {
        if (im.fullBleed && im.y < firstHeadingY) {
          F(c.surface, "G21", `full-bleed image ${im.src.split("/").pop()} above the first heading`, "no hero", c.pngPath);
        }
        if (im.h > 320 && im.y < 600) {
          F(c.surface, "G21", `${im.h}px image ${im.src.split("/").pop()} at y ${im.y}`, "no image over 320px above 600px of scroll", c.pngPath);
        }
      }
    } else if ((c.dump.aboveFoldLinkCount || 0) > 24) {
      F(c.surface, "G21", `${c.dump.aboveFoldLinkCount} above-fold links on ${c.route} (${c.locale})`, "<= 24", c.dumpPath);
    }
  }
});

/* ---- G23 THAI FACE ------------------------------------------------------ */
/* Added by the ratchet. The suite measured Thai SIZE from the first run and never
   measured Thai FACE, so 16 text nodes on the Thai homepage, including the site name,
   every section heading and every date in the rail, rendered in Marcellus. Marcellus
   carries no Thai glyphs, so those strings fell through to whatever face the reader's
   operating system happened to supply. The bug was invisible to every size gate and to
   every contrast gate, and it is invisible in the source, where the element simply
   carries a display class with no lang guard. */
const THAI_RANGE = /[\u0E00-\u0E7F]/;
gate("G23", "thai face", async (ctx, F) => {
  for (const c of jsCaptures(ctx)) {
    if (c.locale !== "th") continue;
    const offenders = (c.dump.textNodes || []).filter(
      (t) => THAI_RANGE.test(t.text || "") && !/sarabun/i.test(t.fontFamily || "")
    );
    const seen = new Set();
    for (const t of offenders) {
      const key = `${t.fontFamily}|${(t.text || "").slice(0, 24)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      F(c.surface, "G23",
        `Thai "${(t.text || "").slice(0, 24)}" in ${(t.fontFamily || "?").split(",")[0]} at ${t.fontSizePx}px`,
        "Sarabun for all Thai", c.dumpPath);
    }
  }
});

/* ---- G22 EVIDENCE ANCHOR ----------------------------------------------- */
gate("G22", "evidence anchor", async (ctx, F) => {
  if (!ctx.real) {
    // In self-test the subprocess is stubbed by the fixture.
    for (const line of ctx.g22Lines || []) {
      const parts = line.split("|").map((s) => s.trim());
      F("shell", `G22:${parts[1]}`, parts[2], parts[3], parts[4]);
    }
    return;
  }
  const r = spawnSync(process.execPath, [path.join(ROOT, "qa/gates/evidence-anchor.mjs")], { cwd: ROOT, encoding: "utf8" });
  const out = `${r.stdout || ""}\n${r.stderr || ""}`;
  // Its first line is a summary it prints on every run, pass or fail. Only the
  // rows after it are failures, and its exit code is the authority.
  const rows = out.split("\n").filter((l) => /^G22\s*\|/.test(l) && !/^G22\s*\|\s*rows\s/.test(l));
  if (r.status === 0) return;
  for (const line of rows) {
    const parts = line.split("|").map((s) => s.trim());
    F("shell", `G22:${parts[1]}`, parts[2] || "", parts[3] || "", parts[4] || "qa/evidence.json");
  }
  if (!rows.length) F("shell", "G22", `subprocess exit ${r.status}`, "exit 0", "qa/gates/evidence-anchor.mjs");
});

// ------------------------------------------------------------- self test ---

async function runGate(g, ctx) {
  const rows = [];
  const F = (surface, id, actual, limit, artefact) => {
    const clean = (s) => String(s ?? "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();
    rows.push(`${clean(surface)} | ${clean(id)} | ${clean(actual)} | ${clean(limit)} | ${clean(artefact)}`);
  };
  await g.run(ctx, F);
  return rows;
}

async function selfTest() {
  const dir = path.join(ROOT, "qa/fixtures");
  let bad = 0, checked = 0;
  for (const g of GATES) {
    if (ONLY_GATES.length && !ONLY_GATES.includes(g.id)) continue;
    const goodPath = path.join(dir, g.id, "good.json");
    const badPath = path.join(dir, g.id, "bad.json");
    if (!fs.existsSync(goodPath) || !fs.existsSync(badPath)) {
      console.log(`self-test | ${g.id} | fixture missing | good.json and bad.json | qa/fixtures/${g.id}/`);
      bad++;
      continue;
    }
    checked++;
    const goodRows = await runGate(g, fixtureContext(JSON.parse(fs.readFileSync(goodPath, "utf8"))));
    const badRows = await runGate(g, fixtureContext(JSON.parse(fs.readFileSync(badPath, "utf8"))));
    if (goodRows.length) {
      console.log(`self-test | ${g.id} | good fixture produced ${goodRows.length} failures | 0 | qa/fixtures/${g.id}/good.json`);
      for (const r of goodRows.slice(0, 3)) console.log(`  ${r}`);
      bad++;
    }
    if (!badRows.length) {
      console.log(`self-test | ${g.id} | bad fixture produced 0 failures | >= 1 | qa/fixtures/${g.id}/bad.json`);
      bad++;
    } else if (VERBOSE) {
      for (const r of badRows) console.log(`  caught  ${r}`);
    }
  }
  console.log(`self-test | ${checked} gates checked in both directions, ${bad} problems`);
  return bad === 0 ? 0 : 1;
}

// ------------------------------------------------------------------ main ---

async function main() {
  if (SELF_TEST) {
    const code = await selfTest();
    stopServer();
    process.exit(code);
  }
  const ctx = realContext();
  if (!ctx.meta) {
    console.log("shell | G00 | .render/build.json missing | run scripts/render-harness.mjs first | .render/build.json");
    process.exit(2);
  }
  let all = [];
  for (const g of GATES) {
    if (ONLY_GATES.length && !ONLY_GATES.includes(g.id)) continue;
    const rows = await runGate(g, ctx);
    all = all.concat(rows);
  }
  stopServer();
  if (ONLY_SURFACE) all = all.filter((r) => r.split("|")[0].trim() === ONLY_SURFACE);
  for (const r of all) console.log(r);
  console.error(`${all.length} failures${ONLY_SURFACE ? ` on surface ${ONLY_SURFACE}` : ""}`);
  process.exit(all.length ? 1 : 0);
}

main().catch((e) => { console.error("gates fatal", e); stopServer(); process.exit(2); });
