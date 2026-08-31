#!/usr/bin/env node
/**
 * TFB render harness. Builds the static export, serves it the way GitHub Pages
 * does, drives headless Chromium over every route x locale x viewport, and
 * writes one measurement dump plus tiled screenshots per capture.
 *
 * It measures. It never edits the site.
 *
 *   node scripts/render-harness.mjs [--port 4599] [--no-build] [--only <substr>]
 *
 * Artefacts, all under .render/ :
 *   <base>.png / <base>__mid.png / <base>__tail.png   tiled full-page crops
 *   <base>.json                                       the fixed dump schema
 *   aux/<base>.json                                   everything the fixed schema cannot hold
 *   nojs/<base>.png, nojs/<base>.json, nojs/aux/...   JavaScript disabled
 *   console/<route>__<locale>.txt                     console errors and non-200 responses
 *   build.json                                        build result, route table, run metadata
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RENDER = path.join(ROOT, ".render");

const argv = process.argv.slice(2);
const argOf = (name, dflt) => {
  const i = argv.indexOf(name);
  return i === -1 ? dflt : argv[i + 1];
};
const PORT = Number(argOf("--port", 4599));
const DESIGN_PORT = PORT + 1;
const NO_BUILD = argv.includes("--no-build");
const ONLY = argOf("--only", null);

export const LOCALES = ["en", "no", "th"];

/**
 * The 12 static routes, plus /contact/complaint/ so the contact surface is
 * whole, plus one representative page per dynamic route.
 */
export const ROUTES = [
  "/",
  "/about/",
  "/about/board/",
  "/about/bylaws/",
  "/about/finances/",
  "/about/membership/",
  "/articles/",
  "/calendar/",
  "/contact/",
  "/contact/complaint/",
  "/courses/",
  "/help/",
  "/privacy/",
  "/articles/loi-krathong-2026/",
  "/courses/food-hygiene/",
  "/help/emergency/",
];

export const PRIMARY_VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 900 },
];
/** Extra widths, shell surface only. */
export const SHELL_VIEWPORTS = [
  { width: 768, height: 1024 },
  { width: 1728, height: 1000 },
];
const SHELL_ROUTE = "/";

const TILE = 1400;
const TALL = 4200;
const CAP = 1500;

export function slugify(route) {
  if (route === "/") return "home";
  return route.replace(/^\/|\/$/g, "").replace(/\//g, "-");
}

const log = (...a) => console.log("[harness]", ...a);

// ---------------------------------------------------------------- build ----

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"], ...opts });
    let out = "";
    p.stdout.on("data", (d) => (out += d));
    p.stderr.on("data", (d) => (out += d));
    p.on("close", (code) => resolve({ code, out }));
  });
}

async function build() {
  // out/ carries stale Finder duplicates ("en 2", "no 2", "th 2"). They must
  // never reach a capture set, so the tree is removed outright every run.
  await fsp.rm(path.join(ROOT, "out"), { recursive: true, force: true });
  log("removed out/, building");
  const r = await run("npm", ["run", "build:pages"]);
  log(`build exited ${r.code}`);
  if (r.code !== 0) console.log(r.out.slice(-4000));
  return r;
}

function serve(script, port, extraEnv = {}) {
  const p = spawn(process.execPath, [script], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), ...extraEnv },
    stdio: ["ignore", "pipe", "pipe"],
  });
  p.stdout.on("data", () => {});
  p.stderr.on("data", () => {});
  return p;
}

async function waitFor(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.status < 500) return true;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

/** Minimal static server for design/, which is not part of the Next export. */
function serveDesign(port) {
  const src = `
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
const ROOT = ${JSON.stringify(path.join(ROOT, "design"))};
const TYPES = { ".html":"text/html; charset=utf-8", ".css":"text/css", ".js":"text/javascript", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".webp":"image/webp", ".woff2":"font/woff2" };
createServer(async (req,res)=>{
  let p = normalize(decodeURIComponent(new URL(req.url,"http://x").pathname));
  let file = join(ROOT, p);
  if (!extname(file)) file = join(file, "index.html");
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try { const b = await readFile(file); res.writeHead(200,{"content-type":TYPES[extname(file)]||"application/octet-stream"}); res.end(b); }
  catch { res.writeHead(404).end("not found"); }
}).listen(${port});
`;
  const tmp = path.join(RENDER, ".design-server.mjs");
  fs.writeFileSync(tmp, src);
  return serve(tmp, port);
}

// ------------------------------------------------------------ collector ----

/**
 * Runs inside the page. Returns { dump, aux }: dump is the fixed schema,
 * aux carries everything the fixed schema has no key for (image geometry,
 * contrast pairs, section names, aspect ratios, truncation counts).
 */
const COLLECT = function collect(opts) {
  const CAP = opts.cap;
  const cs = (el) => getComputedStyle(el);
  const norm = (s) => (s || "").replace(/\s+/g, " ").trim();

  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  };

  const parseColor = (c) => {
    const m = String(c).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const contrast = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const hex = (c) => c ? "#" + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase() : "";

  const effectiveBg = (el) => {
    let node = el;
    let acc = null;
    while (node && node !== document.documentElement.parentNode) {
      const bc = parseColor(cs(node).backgroundColor);
      if (bc && bc.a > 0) {
        acc = acc ? over(acc, bc) : bc;
        if (acc.a >= 0.999) return acc;
      }
      node = node.parentElement;
    }
    return acc && acc.a >= 0.999 ? acc : { r: 255, g: 255, b: 255, a: 1 };
  };

  const depthOf = (el) => { let d = 0, n = el; while ((n = n.parentElement)) d++; return d; };

  const selectorOf = (el) => {
    const bits = [];
    let n = el, hops = 0;
    while (n && n.nodeType === 1 && hops < 4) {
      let s = n.tagName.toLowerCase();
      if (n.id) { s += "#" + n.id; bits.unshift(s); break; }
      const cls = (n.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
      if (cls.length) s += "." + cls.join(".");
      bits.unshift(s);
      n = n.parentElement; hops++;
    }
    return bits.join(">");
  };

  const visible = (el) => {
    const st = cs(el);
    if (st.display === "none" || st.visibility === "hidden") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  };

  const langOf = (el) => {
    let n = el;
    while (n && n.nodeType === 1) {
      const l = n.getAttribute && n.getAttribute("lang");
      if (l) return l;
      n = n.parentElement;
    }
    return document.documentElement.lang || "";
  };

  const inProse = (el) => {
    if (el.closest("nav, [role=navigation], header, footer")) return false;
    const p = el.closest("p, li, blockquote, dd, figcaption, td, th");
    if (!p) return false;
    const t = p.tagName;
    if (t === "TD" || t === "TH") return false;
    if (t === "BLOCKQUOTE" || t === "DD" || t === "FIGCAPTION") return true;
    const own = norm(p.innerText).length;
    const ctrl = norm(el.innerText || el.value || "").length;
    return own - ctrl >= 20;
  };

  const containsLoadedImage = (el) => {
    if (el.tagName === "IMG") return el.naturalWidth > 0;
    if (el.tagName === "SVG" || el.tagName === "svg") return true;
    if (el.querySelector("img")) {
      for (const im of el.querySelectorAll("img")) if (im.naturalWidth > 0) return true;
    }
    if (el.querySelector("svg, picture source, video")) return true;
    const bi = cs(el).backgroundImage;
    if (bi && bi !== "none" && !/gradient/.test(bi)) return true;
    return false;
  };

  // ---- headings ----
  const headingOutline = [];
  for (const h of document.querySelectorAll("h1,h2,h3,h4,h5,h6")) {
    if (!visible(h)) continue;
    const st = cs(h), r = rectOf(h);
    headingOutline.push({
      tag: h.tagName.toLowerCase(),
      text: norm(h.innerText),
      y: r.y,
      fontFamily: st.fontFamily,
      fontSizePx: Math.round(parseFloat(st.fontSize) * 100) / 100,
    });
  }

  // ---- landmarks ----
  const navs = [...document.querySelectorAll("nav, [role=navigation]")].filter(visible);
  const landmarks = {
    navCount: navs.length,
    navLinkTexts: navs.map((n) => [...n.querySelectorAll("a")].map((a) => norm(a.innerText)).filter(Boolean)),
    mainCount: document.querySelectorAll("main, [role=main]").length,
  };

  // ---- interactive ----
  const CONTROL = "a, button, input, select, summary, [role=button]";
  const interactive = [];
  for (const el of document.querySelectorAll(CONTROL)) {
    if (!visible(el)) continue;
    const st = cs(el), r = rectOf(el);
    interactive.push({
      tag: el.tagName.toLowerCase(),
      text: norm(el.innerText || el.value || el.getAttribute("aria-label") || ""),
      w: r.w, h: r.h, x: r.x, y: r.y,
      fontSizePx: Math.round(parseFloat(st.fontSize) * 100) / 100,
      color: st.color,
      inProse: inProse(el),
    });
  }

  // ---- text nodes ----
  const textNodes = [];
  const contrastRows = [];
  let textTruncated = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let tn;
  while ((tn = walker.nextNode())) {
    const t = norm(tn.nodeValue);
    if (!t) continue;
    const el = tn.parentElement;
    if (!el) continue;
    if (el.closest("script, style, template")) continue;
    if (textNodes.length >= CAP) { textTruncated++; continue; }
    const st = cs(el);
    const parent = el.parentElement;
    const fontSizePx = Math.round(parseFloat(st.fontSize) * 100) / 100;
    textNodes.push({
      text: t.slice(0, 160),
      fontFamily: st.fontFamily,
      fontSizePx,
      color: st.color,
      opacity: Number(st.opacity),
      visibility: st.visibility,
      lang: langOf(el),
      depth: depthOf(el),
      parentFontSizePx: parent ? Math.round(parseFloat(cs(parent).fontSize) * 100) / 100 : fontSizePx,
    });
    if (st.display !== "none" && st.visibility !== "hidden" && Number(st.opacity) > 0) {
      const fg = parseColor(st.color);
      const bg = effectiveBg(el);
      if (fg && bg) {
        const flat = fg.a < 1 ? over(fg, bg) : fg;
        contrastRows.push({
          text: t.slice(0, 60),
          color: hex(fg),
          background: hex(bg),
          fontSizePx,
          fontWeight: st.fontWeight,
          contrast: Math.round(contrast(flat, bg) * 100) / 100,
          selector: selectorOf(el),
        });
      }
    }
  }

  // ---- images ----
  const nearestHeading = (el) => {
    const all = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")];
    let best = "", bestY = -Infinity;
    const y = rectOf(el).y;
    for (const h of all) {
      const hy = rectOf(h).y;
      if (hy <= y && hy > bestY) { bestY = hy; best = norm(h.innerText); }
    }
    return best;
  };
  const captionOf = (el) => {
    const fig = el.closest("figure");
    if (fig) {
      const fc = fig.querySelector("figcaption");
      if (fc) return norm(fc.innerText);
    }
    const par = el.parentElement;
    if (par) {
      const sib = par.nextElementSibling;
      if (sib && /^(FIGCAPTION|P|SPAN|SMALL|DIV)$/.test(sib.tagName) && norm(sib.innerText).length < 400) {
        if (!sib.querySelector("img")) return norm(sib.innerText);
      }
    }
    return "";
  };
  const images = [];
  const auxImages = [];
  for (const im of document.querySelectorAll("img")) {
    const r = rectOf(im);
    const src = im.currentSrc || im.src || "";
    images.push({
      src,
      status: opts.statuses[src] ?? (im.naturalWidth > 0 ? 200 : 0),
      naturalW: im.naturalWidth,
      renderedW: r.w,
      renderedH: r.h,
      alt: im.getAttribute("alt") ?? null,
      captionText: captionOf(im),
      nearestHeadingText: nearestHeading(im),
    });
    auxImages.push({ src, x: r.x, y: r.y, w: r.w, h: r.h, fullBleed: r.w >= innerWidth - 2, tag: "img" });
  }

  // ---- boxes ----
  const boxes = [];
  const auxBoxes = [];
  let boxTruncated = 0;
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("script, style, template, svg")) continue;
    const st = cs(el);
    if (st.display === "none") continue;
    const borderStyle = st.borderTopStyle === st.borderRightStyle && st.borderTopStyle === st.borderBottomStyle && st.borderTopStyle === st.borderLeftStyle
      ? st.borderTopStyle
      : [st.borderTopStyle, st.borderRightStyle, st.borderBottomStyle, st.borderLeftStyle].join(" ");
    const bw = [st.borderTopWidth, st.borderRightWidth, st.borderBottomWidth, st.borderLeftWidth].map(parseFloat);
    const hasBorder = borderStyle !== "none" && bw.some((v) => v > 0);
    const bgc = parseColor(st.backgroundColor);
    const hasFill = !!bgc && bgc.a > 0;
    const hasBgImage = st.backgroundImage && st.backgroundImage !== "none";
    const hasShadow = st.boxShadow && st.boxShadow !== "none";
    const hasRadius = st.borderRadius && st.borderRadius !== "0px";
    const ar = st.aspectRatio && st.aspectRatio !== "auto";
    if (!(hasBorder || hasFill || hasBgImage || hasShadow || hasRadius || ar)) continue;
    if (boxes.length >= CAP) { boxTruncated++; continue; }
    const r = rectOf(el);
    boxes.push({
      selector: selectorOf(el),
      w: r.w, h: r.h,
      borderRadius: st.borderRadius,
      boxShadow: st.boxShadow,
      backgroundImage: st.backgroundImage,
      backgroundColor: st.backgroundColor,
      borderStyle,
      hasTextContent: norm(el.innerText).length > 0,
      containsLoadedImage: containsLoadedImage(el),
    });
    auxBoxes.push({ selector: selectorOf(el), aspectRatio: st.aspectRatio, x: r.x, y: r.y, borderWidths: bw });
  }

  // ---- links ----
  const links = [];
  for (const a of document.querySelectorAll("a")) {
    if (!visible(a)) continue;
    const st = cs(a);
    const text = norm(a.innerText);
    links.push({
      text,
      chars: text.length,
      href: a.getAttribute("href") || "",
      color: st.color,
      inTableRow: !!a.closest("tr, dl"),
      inProse: inProse(a),
    });
  }

  const fold = innerHeight;
  const aboveFoldLinkCount = [...document.querySelectorAll("a")].filter((a) => {
    if (!visible(a)) return false;
    const r = rectOf(a);
    return r.y < fold && r.y + r.h > 0;
  }).length;

  // ---- sections, for the accessible-name clause ----
  const sections = [...document.querySelectorAll("section")].map((s) => {
    const labelledby = s.getAttribute("aria-labelledby");
    let name = s.getAttribute("aria-label") || "";
    if (!name && labelledby) {
      const t = labelledby.split(/\s+/).map((id) => document.getElementById(id)).filter(Boolean).map((e) => norm(e.innerText)).join(" ");
      name = t;
    }
    if (!name && s.getAttribute("title")) name = s.getAttribute("title");
    return { selector: selectorOf(s), id: s.id || "", name, y: rectOf(s).y };
  });

  const renderedTextConcat = norm(document.body.innerText);

  return {
    dump: {
      url: location.href,
      locale: opts.locale,
      width: innerWidth,
      documentHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      innerWidth,
      wordCount: renderedTextConcat.split(/\s+/).filter(Boolean).length,
      headingOutline,
      landmarks,
      interactive,
      textNodes,
      images,
      boxes,
      links,
      aboveFoldLinkCount,
      helpBar: opts.helpBar,
      renderedTextConcat,
      emDashCount: (renderedTextConcat.match(/\u2014/g) || []).length,
    },
    aux: {
      route: opts.route,
      locale: opts.locale,
      width: innerWidth,
      htmlLang: document.documentElement.lang,
      truncated: { textNodes: textTruncated, boxes: boxTruncated },
      contrast: contrastRows,
      images: auxImages,
      boxes: auxBoxes,
      sections,
      liCount: document.querySelectorAll("main li").length,
      h1Count: document.querySelectorAll("h1").length,
    },
  };
};

/** Scroll to 0, 50 and 100 per cent of the document and measure the help bar. */
const MEASURE_HELPBAR = async function measure() {
  const find = () => {
    const tel = document.querySelector('a[href^="tel:"]');
    if (!tel) return null;
    let el = tel;
    while (el && el.parentElement && el.parentElement !== document.body) el = el.parentElement;
    return { bar: el, tel };
  };
  const out = { presentAtScroll: {}, yAtScroll: {}, phoneFontSizePx: 0, phoneTapW: 0, phoneTapH: 0 };
  const doc = document.documentElement;
  // The site sets scroll-behavior: smooth, which would leave the page mid-flight
  // when the measurement is taken. Suspended for the duration of the probe.
  const prevBehavior = doc.style.scrollBehavior;
  doc.style.scrollBehavior = "auto";
  const max = Math.max(0, doc.scrollHeight - innerHeight);
  for (const pct of [0, 50, 100]) {
    scrollTo({ top: Math.round((max * pct) / 100), behavior: "instant" });
    await new Promise((r) => setTimeout(r, 60));
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const f = find();
    if (!f || !f.bar) { out.presentAtScroll[pct] = false; out.yAtScroll[pct] = -1; continue; }
    const st = getComputedStyle(f.bar);
    const r = f.bar.getBoundingClientRect();
    const onScreen = st.display !== "none" && st.visibility !== "hidden" && r.height > 0;
    out.presentAtScroll[pct] = onScreen;
    // Viewport-relative y: a bar that is pinned reports the same number at
    // every scroll position, a bar that scrolls away does not.
    out.yAtScroll[pct] = Math.round(r.top);
    if (pct === 0) {
      const tr = f.tel.getBoundingClientRect();
      out.phoneFontSizePx = Math.round(parseFloat(getComputedStyle(f.tel).fontSize) * 100) / 100;
      out.phoneTapW = Math.round(tr.width);
      out.phoneTapH = Math.round(tr.height);
    }
  }
  scrollTo({ top: 0, behavior: "instant" });
  await new Promise((r) => requestAnimationFrame(r));
  doc.style.scrollBehavior = prevBehavior;
  return out;
};

// ------------------------------------------------------------- capture ----

async function tile(page, base, documentHeight, width) {
  const written = [];
  const shot = async (file, clip) => {
    try {
      await page.screenshot({ path: file, fullPage: true, clip, animations: "disabled" });
    } catch {
      await page.evaluate((y) => scrollTo(0, y), clip.y);
      await page.screenshot({ path: file, animations: "disabled" });
      await page.evaluate(() => scrollTo(0, 0));
    }
    written.push(path.relative(ROOT, file));
  };
  const h = documentHeight;
  if (h <= TILE) {
    await shot(`${base}.png`, { x: 0, y: 0, width, height: Math.max(1, h) });
  } else if (h <= TALL) {
    const n = Math.min(3, Math.ceil(h / TILE));
    const names = [`${base}.png`, `${base}__mid.png`, `${base}__tail.png`];
    for (let i = 0; i < n; i++) {
      const y = i * TILE;
      await shot(names[i], { x: 0, y, width, height: Math.min(TILE, h - y) });
    }
  } else {
    // Too tall to image whole. Head, middle and tail only; the real height is
    // recorded as a number in the dump.
    await shot(`${base}.png`, { x: 0, y: 0, width, height: TILE });
    await shot(`${base}__mid.png`, { x: 0, y: Math.round(h / 2 - TILE / 2), width, height: TILE });
    await shot(`${base}__tail.png`, { x: 0, y: h - TILE, width, height: TILE });
  }
  return written;
}

async function capturePage(context, { url, route, locale, width, height, nojs, outDir, consoleFile }) {
  const page = await context.newPage();
  await page.setViewportSize({ width, height });
  const statuses = {};
  const notes = [];
  page.on("console", (m) => { if (m.type() === "error") notes.push(`console.error ${m.text()}`); });
  page.on("pageerror", (e) => notes.push(`pageerror ${e.message}`));
  page.on("requestfailed", (r) => notes.push(`requestfailed ${r.url()} ${r.failure()?.errorText || ""}`));
  page.on("response", (r) => {
    statuses[r.url()] = r.status();
    if (r.status() !== 200 && r.status() !== 304) notes.push(`http ${r.status()} ${r.url()}`);
  });

  let ok = true;
  try {
    const resp = await page.goto(url, { waitUntil: "load", timeout: 45000 });
    if (resp && resp.status() !== 200) notes.push(`document ${resp.status()} ${url}`);
    await page.waitForTimeout(nojs ? 150 : 500);
  } catch (e) {
    notes.push(`navigation failed ${e.message}`);
    ok = false;
  }

  let dump = null, aux = null, pngs = [];
  if (ok) {
    let helpBar;
    try {
      helpBar = await page.evaluate(MEASURE_HELPBAR);
    } catch {
      helpBar = { presentAtScroll: { 0: false, 50: false, 100: false }, yAtScroll: { 0: -1, 50: -1, 100: -1 }, phoneFontSizePx: 0, phoneTapW: 0, phoneTapH: 0 };
    }
    const res = await page.evaluate(COLLECT, { cap: CAP, locale, route, statuses, helpBar });
    dump = res.dump;
    aux = res.aux;
    const base = path.join(outDir, `${slugify(route)}__${locale}__${width}`);
    await fsp.mkdir(path.dirname(base), { recursive: true });
    await fsp.writeFile(`${base}.json`, JSON.stringify(dump, null, 1));
    await fsp.mkdir(path.join(outDir, "aux"), { recursive: true });
    await fsp.writeFile(path.join(outDir, "aux", `${slugify(route)}__${locale}__${width}.json`), JSON.stringify(aux, null, 1));
    pngs = await tile(page, base, dump.documentHeight, width);
  }

  if (notes.length) {
    await fsp.mkdir(path.dirname(consoleFile), { recursive: true });
    await fsp.appendFile(consoleFile, `--- ${url} @${width}${nojs ? " nojs" : ""}\n${notes.join("\n")}\n`);
  }
  await page.close();
  return { ok, dump, pngs, notes: notes.length };
}

// ---------------------------------------------------------------- main ----

async function main() {
  await fsp.mkdir(RENDER, { recursive: true });
  const meta = { startedAt: new Date().toISOString(), port: PORT, buildDate: new Date().toISOString().slice(0, 10) };

  if (NO_BUILD) {
    meta.build = { code: 0, skipped: true };
  } else {
    const b = await build();
    meta.build = { code: b.code, skipped: false, tail: b.out.slice(-2000) };
  }

  const server = serve(path.join(ROOT, "serve-out.mjs"), PORT);
  const designServer = serveDesign(DESIGN_PORT);
  const base = `http://localhost:${PORT}/tfb`;
  const upOk = await waitFor(`${base}/`);
  const designOk = await waitFor(`http://localhost:${DESIGN_PORT}/index.html`);
  meta.serveOk = upOk;
  meta.designServeOk = designOk;
  if (!upOk) {
    console.error("[harness] cannot serve: serve-out.mjs never answered");
    meta.finishedAt = new Date().toISOString();
    await fsp.writeFile(path.join(RENDER, "build.json"), JSON.stringify(meta, null, 2));
    server.kill(); designServer.kill();
    process.exit(2);
  }

  // Which of the configured routes actually exist in this build.
  const routeStatus = {};
  for (const r of ROUTES) {
    for (const l of LOCALES) {
      const u = `${base}/${l}${r === "/" ? "/" : r}`;
      try { routeStatus[`${l}${r}`] = (await fetch(u)).status; } catch { routeStatus[`${l}${r}`] = 0; }
    }
  }
  meta.routeStatus = routeStatus;
  meta.routes = ROUTES;
  meta.locales = LOCALES;

  const browser = await chromium.launch();
  const jsCtx = await browser.newContext({ deviceScaleFactor: 1 });
  const noJsCtx = await browser.newContext({ javaScriptEnabled: false, deviceScaleFactor: 1 });

  const captures = [];
  const jobs = [];
  for (const route of ROUTES) {
    if (ONLY && !route.includes(ONLY)) continue;
    for (const locale of LOCALES) {
      const url = `${base}/${locale}${route === "/" ? "/" : route}`;
      const vps = route === SHELL_ROUTE ? [...PRIMARY_VIEWPORTS, ...SHELL_VIEWPORTS] : PRIMARY_VIEWPORTS;
      for (const vp of vps) jobs.push({ url, route, locale, ...vp, nojs: false });
      jobs.push({ url, route, locale, width: 1280, height: 900, nojs: true });
    }
  }
  // The locale chooser and the design system page.
  if (!ONLY) {
    for (const vp of PRIMARY_VIEWPORTS) {
      jobs.push({ url: `${base}/`, route: "/chooser/", locale: "root", ...vp, nojs: false });
      jobs.push({ url: `http://localhost:${DESIGN_PORT}/index.html`, route: "/design/", locale: "root", ...vp, nojs: false });
    }
    jobs.push({ url: `${base}/`, route: "/chooser/", locale: "root", width: 1280, height: 900, nojs: true });
  }

  log(`${jobs.length} captures`);
  let n = 0;
  for (const job of jobs) {
    n++;
    const outDir = job.nojs ? path.join(RENDER, "nojs") : RENDER;
    const consoleFile = path.join(RENDER, "console", `${slugify(job.route)}__${job.locale}.txt`);
    const r = await capturePage(job.nojs ? noJsCtx : jsCtx, { ...job, outDir, consoleFile });
    captures.push({
      route: job.route, locale: job.locale, width: job.width, nojs: job.nojs,
      ok: r.ok, url: job.url,
      dumpPath: path.relative(ROOT, path.join(outDir, `${slugify(job.route)}__${job.locale}__${job.width}.json`)),
      auxPath: path.relative(ROOT, path.join(outDir, "aux", `${slugify(job.route)}__${job.locale}__${job.width}.json`)),
      pngPath: path.relative(ROOT, path.join(outDir, `${slugify(job.route)}__${job.locale}__${job.width}.png`)),
      consolePath: path.relative(ROOT, consoleFile),
      documentHeight: r.dump ? r.dump.documentHeight : null,
    });
    if (n % 10 === 0 || n === jobs.length) log(`${n}/${jobs.length}`);
  }

  await browser.close();
  server.kill();
  designServer.kill();

  meta.captures = captures;
  meta.finishedAt = new Date().toISOString();
  await fsp.writeFile(path.join(RENDER, "build.json"), JSON.stringify(meta, null, 2));
  log(`done, ${captures.length} captures, ${captures.filter((c) => !c.ok).length} failed`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error("[harness] fatal", e); process.exit(2); });
}
