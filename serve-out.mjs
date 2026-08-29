// Mimics GitHub Pages: serves out/ under the /tfb subpath, so basePath bugs
// show up locally instead of after a deploy.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("./out/", import.meta.url).pathname;
const BASE = process.env.BASE_PATH ?? "/tfb";
const PORT = Number(process.env.PORT || 4599);
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8" };

createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
  else if (BASE && p !== "/") { res.writeHead(404).end("outside base path"); return; }
  let file = join(ROOT, p);
  if (!extname(file)) file = join(file, "index.html");
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("forbidden"); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch {
    try {
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(await readFile(join(ROOT, "404.html")));
    } catch { res.writeHead(404).end("not found"); }
  }
}).listen(PORT, () => console.log(`serving out/ at http://localhost:${PORT}${BASE}/`));
